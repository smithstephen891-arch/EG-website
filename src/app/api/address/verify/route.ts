import { NextResponse } from "next/server";
import { isStateCode, isZip, type AddressCheckResult } from "@/lib/address";
import { lookupCityState, uspsConfigured, verifyAddress } from "@/lib/usps";

/*
 * Proxies the USPS lookup so the client id and secret stay on the server.
 *
 * Two modes:
 *   { zip }                      -> city and state for that ZIP
 *   { street, city, state, zip } -> full standardized address
 *
 * Always 200. The form treats every failure as "carry on unverified", so an
 * error status here would only add a console error to a page that is already
 * handling the case.
 */

// A function, not a shared constant: a Response body can only be read once, so
// a module-level instance comes back empty for every request after the first.
const unavailable = () =>
  NextResponse.json({ status: "unavailable" } satisfies AddressCheckResult);

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  if (!uspsConfigured()) return unavailable();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return unavailable();
  }

  const zip = str(body.zip, 10);
  if (!isZip(zip)) return unavailable();

  // ZIP only: the city/state prefill as soon as the applicant leaves the ZIP.
  if (body.mode === "city-state") {
    const found = await lookupCityState(zip);
    return NextResponse.json(found ? { status: "verified", ...found } : { status: "not-found" });
  }

  const street = str(body.street, 120);
  const city = str(body.city, 60);
  const state = str(body.state, 2).toUpperCase();
  if (!street || !city || !isStateCode(state)) return unavailable();

  const result = await verifyAddress({
    street,
    unit: str(body.unit, 60),
    city,
    state,
    zip,
  });

  return NextResponse.json(result);
}
