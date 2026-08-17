import type { AddressCheckResult, AddressParts } from "@/lib/address";

/*
 * USPS Addresses 3.0 lookup. Server side only — the client id and secret never
 * reach the browser, so the form calls /api/address/verify instead.
 *
 * Everything here fails soft. An applicant who cannot get through this form is
 * an applicant who does not get equipment, so a missing key, a USPS outage or
 * a rural address the database has never heard of all resolve to "unavailable"
 * or "not-found" and let the submission continue.
 *
 * Credentials come from a USPS Business account at developers.usps.com:
 *   USPS_CLIENT_ID, USPS_CLIENT_SECRET
 * Set USPS_API_BASE to https://apis-tem.usps.com to work against their test
 * environment.
 */

const API_BASE = process.env.USPS_API_BASE || "https://apis.usps.com";
const TIMEOUT_MS = 4000;

interface CachedToken {
  value: string;
  expiresAt: number;
}

// Tokens last 8 hours. Caching them per warm instance keeps a form that
// verifies on every field blur from minting a token each time.
let cachedToken: CachedToken | null = null;

export function uspsConfigured(): boolean {
  return Boolean(process.env.USPS_CLIENT_ID && process.env.USPS_CLIENT_SECRET);
}

async function fetchWithTimeout(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function getToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;
  if (!uspsConfigured()) return null;

  const res = await fetchWithTimeout(`${API_BASE}/oauth2/v3/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.USPS_CLIENT_ID,
      client_secret: process.env.USPS_CLIENT_SECRET,
      grant_type: "client_credentials",
    }),
  });

  if (!res.ok) {
    console.error("USPS: token request failed", res.status, await res.text().catch(() => ""));
    return null;
  }

  const body = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!body.access_token) return null;

  // Expire a minute early rather than discover staleness mid-request.
  const ttl = (Number(body.expires_in) || 3600) * 1000;
  cachedToken = { value: body.access_token, expiresAt: Date.now() + ttl - 60_000 };
  return cachedToken.value;
}

interface UspsAddressResponse {
  address?: {
    streetAddress?: string;
    secondaryAddress?: string;
    city?: string;
    state?: string;
    ZIPCode?: string;
    ZIPPlus4?: string;
  };
  additionalInfo?: {
    DPVConfirmation?: string;
  };
}

function sameAddress(a: AddressParts, b: AddressParts): boolean {
  const norm = (v: string) => v.trim().toUpperCase().replace(/\s+/g, " ");
  return (
    norm(a.street) === norm(b.street) &&
    norm(a.unit) === norm(b.unit) &&
    norm(a.city) === norm(b.city) &&
    norm(a.state) === norm(b.state) &&
    // Compare the 5 digit ZIP only: USPS routinely adds the +4 the applicant
    // had no way of knowing, and that is not a correction worth flagging.
    norm(a.zip).slice(0, 5) === norm(b.zip).slice(0, 5)
  );
}

export async function verifyAddress(input: AddressParts): Promise<AddressCheckResult> {
  const token = await getToken().catch((err) => {
    console.error("USPS: token error", err);
    return null;
  });
  if (!token) return { status: "unavailable" };

  const query = new URLSearchParams({
    streetAddress: input.street.trim(),
    city: input.city.trim(),
    state: input.state.trim().toUpperCase(),
    ZIPCode: input.zip.trim().slice(0, 5),
  });
  if (input.unit.trim()) query.set("secondaryAddress", input.unit.trim());

  let res: Response;
  try {
    res = await fetchWithTimeout(`${API_BASE}/addresses/v3/address?${query}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    });
  } catch (err) {
    console.error("USPS: address request failed", err);
    return { status: "unavailable" };
  }

  // USPS answers a well-formed request it cannot match with a 400, which is a
  // real answer about the address rather than a fault on our side.
  if (res.status === 400 || res.status === 404) return { status: "not-found" };
  if (!res.ok) {
    console.error("USPS: address lookup returned", res.status);
    return { status: "unavailable" };
  }

  const body = (await res.json().catch(() => null)) as UspsAddressResponse | null;
  const found = body?.address;
  if (!found?.streetAddress || !found.city || !found.state || !found.ZIPCode) {
    return { status: "not-found" };
  }

  const standardized: AddressParts = {
    street: found.streetAddress,
    unit: found.secondaryAddress || "",
    city: found.city,
    state: found.state,
    zip: found.ZIPCode,
  };

  const dpv = body?.additionalInfo?.DPVConfirmation;

  // N is undeliverable. S and D both mean the building matched but the
  // apartment or unit did not, which is worth asking about rather than
  // silently accepting.
  if (dpv === "N") return { status: "not-found" };
  if (dpv === "S" || dpv === "D") {
    return { status: "needs-unit", address: standardized, zipPlus4: found.ZIPPlus4 };
  }

  return {
    status: sameAddress(input, standardized) ? "verified" : "corrected",
    address: standardized,
    zipPlus4: found.ZIPPlus4,
  };
}

/** ZIP to city and state, so the applicant does not have to type either. */
export async function lookupCityState(
  zip: string
): Promise<{ city: string; state: string } | null> {
  const token = await getToken().catch(() => null);
  if (!token) return null;

  try {
    const res = await fetchWithTimeout(
      `${API_BASE}/addresses/v3/city-state?ZIPCode=${encodeURIComponent(zip.slice(0, 5))}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const body = (await res.json()) as { city?: string; state?: string };
    if (!body.city || !body.state) return null;
    return { city: body.city, state: body.state };
  } catch {
    return null;
  }
}
