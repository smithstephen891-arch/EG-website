"use client";

import { useCallback, useRef, useState } from "react";
import { Check, Info, Loader2 } from "lucide-react";
import {
  EMPTY_ADDRESS,
  US_STATES,
  formatAddressOneLine,
  isZip,
  type AddressCheckResult,
  type AddressParts,
} from "@/lib/address";

/*
 * The applicant's mailing address, broken into the parts the USPS actually
 * uses. One free-text box let people submit "Franklin TN" and left the team
 * chasing the rest by email before anything could be shipped.
 *
 * The USPS check is advisory and never blocks submission. Rural routes, brand
 * new construction and plenty of legitimate addresses do not match cleanly,
 * and the people this form exists for are the least able to argue with a
 * validator. It offers the standardized version; it does not insist.
 */

const inputClass =
  "w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition";
const labelClass = "block text-sm font-medium text-charcoal mb-2";

type Status = "idle" | "checking" | AddressCheckResult["status"];

export default function AddressFields() {
  const [value, setValue] = useState<AddressParts>(EMPTY_ADDRESS);
  const [status, setStatus] = useState<Status>("idle");
  const [suggestion, setSuggestion] = useState<AddressParts | null>(null);

  // Blur handlers must read the address as it stands *now*, not as it stood
  // when their render closed over it. Tabbing out of the ZIP fires blur in the
  // same tick as its own change, so the closure copy is a keystroke behind.
  // Every mutation goes through set/accept/fill below, so this ref stays
  // authoritative and `value` is only the copy React renders from.
  const latest = useRef(EMPTY_ADDRESS);

  // Only the newest lookup may write to state: fields blur faster than USPS
  // answers, so an earlier reply can otherwise land after a later one.
  const requestId = useRef(0);
  // What we last asked USPS about, so moving focus across untouched fields
  // does not re-ask the same question.
  const lastChecked = useRef("");

  const set = useCallback((patch: Partial<AddressParts>) => {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    setValue(next);
    // Any edit invalidates whatever the last check concluded.
    setStatus("idle");
    setSuggestion(null);
  }, []);

  const check = useCallback(async () => {
    const next = latest.current;
    if (!next.street.trim() || !next.city.trim() || !next.state.trim() || !isZip(next.zip)) {
      return;
    }
    const key = JSON.stringify(next);
    if (key === lastChecked.current) return;
    lastChecked.current = key;

    const id = ++requestId.current;
    setStatus("checking");
    try {
      const res = await fetch("/api/address/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      });
      const body = (await res.json()) as AddressCheckResult;
      if (id !== requestId.current) return;
      setStatus(body.status);
      setSuggestion(body.status === "corrected" && body.address ? body.address : null);
    } catch {
      if (id === requestId.current) setStatus("unavailable");
    }
  }, []);

  // ZIP is the one field that can fill in others, so it runs its own lookup
  // first and only then checks the address the fill produced.
  const fillCityStateThenCheck = useCallback(
    async (zip: string) => {
      if (isZip(zip)) {
        try {
          const res = await fetch("/api/address/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "city-state", zip }),
          });
          const body = (await res.json()) as {
            status: string;
            city?: string;
            state?: string;
          };
          if (body.status === "verified" && body.city && body.state) {
            // Only fill blanks. Someone who typed a city meant it, even if
            // USPS would have named the place differently.
            const filled: AddressParts = {
              ...latest.current,
              city: latest.current.city.trim() ? latest.current.city : body.city,
              state: latest.current.state.trim() ? latest.current.state : body.state,
            };
            latest.current = filled;
            setValue(filled);
          }
        } catch {
          /* advisory only */
        }
      }
      await check();
    },
    [check]
  );

  function acceptSuggestion() {
    if (!suggestion) return;
    latest.current = suggestion;
    lastChecked.current = JSON.stringify(suggestion);
    setValue(suggestion);
    setSuggestion(null);
    setStatus("verified");
  }

  return (
    <fieldset className="space-y-6">
      <legend className={labelClass}>Home Address *</legend>

      <div>
        <label htmlFor="street" className="sr-only">
          Street address
        </label>
        <input
          type="text"
          id="street"
          name="street"
          required
          autoComplete="street-address"
          placeholder="Street address"
          value={value.street}
          onChange={(e) => set({ street: e.target.value })}
          onBlur={() => void check()}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="unit" className="sr-only">
          Apartment, suite, or unit (optional)
        </label>
        <input
          type="text"
          id="unit"
          name="unit"
          autoComplete="address-line2"
          placeholder="Apartment, suite, or unit (optional)"
          value={value.unit}
          onChange={(e) => set({ unit: e.target.value })}
          onBlur={() => void check()}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
        <div className="sm:col-span-3">
          <label htmlFor="city" className={labelClass}>
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            required
            autoComplete="address-level2"
            value={value.city}
            onChange={(e) => set({ city: e.target.value })}
            onBlur={() => void check()}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-1">
          <label htmlFor="state" className={labelClass}>
            State *
          </label>
          <select
            id="state"
            name="state"
            required
            autoComplete="address-level1"
            value={value.state}
            onChange={(e) => set({ state: e.target.value })}
            onBlur={() => void check()}
            className={inputClass}
          >
            <option value="">—</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.code}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="zip" className={labelClass}>
            ZIP code *
          </label>
          <input
            type="text"
            id="zip"
            name="zip"
            required
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={10}
            pattern="\d{5}(-\d{4})?"
            title="A 5 digit ZIP code, like 37064"
            value={value.zip}
            onChange={(e) => set({ zip: e.target.value })}
            onBlur={(e) => void fillCityStateThenCheck(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <AddressStatus
        status={status}
        suggestion={suggestion}
        onAccept={acceptSuggestion}
      />
    </fieldset>
  );
}

function AddressStatus({
  status,
  suggestion,
  onAccept,
}: {
  status: Status;
  suggestion: AddressParts | null;
  onAccept: () => void;
}) {
  if (status === "checking") {
    return (
      <p className="flex items-center gap-2 text-sm text-charcoal/50">
        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
        Checking this address with USPS…
      </p>
    );
  }

  if (status === "corrected" && suggestion) {
    return (
      <div role="status" className="rounded-xl border border-olive/40 bg-olive/5 px-5 py-4">
        <p className="text-sm font-medium text-charcoal">USPS suggests this address:</p>
        <p className="mt-1.5 text-sm text-charcoal/70">{formatAddressOneLine(suggestion)}</p>
        <button
          type="button"
          onClick={onAccept}
          className="mt-3 rounded-full bg-olive px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-olive-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2"
        >
          Use this address
        </button>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-olive-dark">
        <Check aria-hidden="true" className="h-4 w-4" />
        USPS confirmed this address.
      </p>
    );
  }

  if (status === "needs-unit") {
    return (
      <p role="status" className="flex items-start gap-2 text-sm text-charcoal/70">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
        USPS found this building but not the apartment or unit. Add it above if
        you have one — you can still submit either way.
      </p>
    );
  }

  if (status === "not-found") {
    return (
      <p role="status" className="flex items-start gap-2 text-sm text-charcoal/70">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
        We couldn&apos;t confirm this address with USPS. Please double-check it.
        If it&apos;s right, go ahead and submit — plenty of good addresses
        don&apos;t match.
      </p>
    );
  }

  // idle and unavailable both say nothing: there is no news worth the space.
  return null;
}
