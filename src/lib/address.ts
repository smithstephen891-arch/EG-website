/*
 * Shared shape for the broken-out mailing address, used by the assistance
 * application form, its API route, and the USPS lookup in between.
 */

export interface AddressParts {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}

export const EMPTY_ADDRESS: AddressParts = {
  street: "",
  unit: "",
  city: "",
  state: "",
  zip: "",
};

/** The states, territories and military ZIP regions the USPS delivers to. */
export const US_STATES: ReadonlyArray<{ code: string; name: string }> = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "AS", name: "American Samoa" },
  { code: "GU", name: "Guam" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "PR", name: "Puerto Rico" },
  { code: "VI", name: "U.S. Virgin Islands" },
  { code: "AA", name: "Armed Forces Americas" },
  { code: "AE", name: "Armed Forces Europe" },
  { code: "AP", name: "Armed Forces Pacific" },
];

const STATE_CODES = new Set(US_STATES.map((s) => s.code));

export function isStateCode(value: string): boolean {
  return STATE_CODES.has(value.trim().toUpperCase());
}

/** 12345 or 12345-6789. */
export const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

export function isZip(value: string): boolean {
  return ZIP_PATTERN.test(value.trim());
}

/** One line, the way it would be written on an envelope. */
export function formatAddressOneLine(parts: AddressParts): string {
  const street = [parts.street.trim(), parts.unit.trim()].filter(Boolean).join(" ");
  // "Franklin, TN 37064" — the ZIP follows the state on a space, not a comma.
  const cityStateZip = [
    [parts.city.trim(), parts.state.trim()].filter(Boolean).join(", "),
    parts.zip.trim(),
  ]
    .filter(Boolean)
    .join(" ");
  return [street, cityStateZip].filter(Boolean).join(", ");
}

/** Two lines, for the reviewer's email. */
export function formatAddressBlock(parts: AddressParts): string {
  const street = [parts.street.trim(), parts.unit.trim()].filter(Boolean).join(" ");
  const cityState = [parts.city.trim(), parts.state.trim()].filter(Boolean).join(", ");
  return [street, [cityState, parts.zip.trim()].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join("\n");
}

/**
 * How the USPS lookup came back.
 *
 * `unavailable` covers a missing API key, a USPS outage, and a network error
 * alike — every one of them means "carry on without the check", so the form
 * treats them the same and says nothing.
 */
export type AddressCheckStatus =
  | "verified"
  | "corrected"
  | "needs-unit"
  | "not-found"
  | "unavailable";

export interface AddressCheckResult {
  status: AddressCheckStatus;
  /** The USPS standardized address. Present for verified/corrected/needs-unit. */
  address?: AddressParts;
  /** ZIP+4, when USPS supplied one. */
  zipPlus4?: string;
}
