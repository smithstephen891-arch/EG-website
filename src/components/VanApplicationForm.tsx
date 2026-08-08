"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { AlertCircle, Info, X } from "lucide-react";
import VideoStoryField, { type VideoStoryValue } from "./VideoStoryField";

type YesNo = "" | "yes" | "no";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  isAdult: YesNo;
  hasLicense: YesNo;
  street: string;
  city: string;
  state: string;
  zip: string;
  employment: "" | "full-time" | "part-time" | "unemployed";
  canMaintain: YesNo;
  isCaretaker: YesNo;
  recipient: "" | "myself" | "someone-i-care-for";
  whyNeed: string;
  hasAccessibleVehicle: YesNo;
  currentTransport: string;
  howHeard:
    | ""
    | "tiktok"
    | "instagram"
    | "facebook"
    | "friend-family"
    | "news"
    | "other";
  howHeardOther: string;
  asIsAcknowledgment: boolean;
  mediaRelease: boolean;
  newsletterOptIn: boolean;
}

type FieldName = keyof FormValues;
type Errors = Partial<Record<FieldName, string>>;

const initialValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  isAdult: "",
  hasLicense: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  employment: "",
  canMaintain: "",
  isCaretaker: "",
  recipient: "",
  whyNeed: "",
  hasAccessibleVehicle: "",
  currentTransport: "",
  howHeard: "",
  howHeardOther: "",
  asIsAcknowledgment: false,
  mediaRelease: false,
  newsletterOptIn: true,
};

const FIELD_ORDER: FieldName[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "dob",
  "isAdult",
  "hasLicense",
  "street",
  "city",
  "state",
  "zip",
  "employment",
  "canMaintain",
  "isCaretaker",
  "recipient",
  "whyNeed",
  "hasAccessibleVehicle",
  "currentTransport",
  "howHeard",
  "howHeardOther",
  "asIsAcknowledgment",
];

// Radio groups focus their first option; everything else uses id === name.
const focusIdFor: Partial<Record<FieldName, string>> = {
  isAdult: "isAdult-yes",
  hasLicense: "hasLicense-yes",
  canMaintain: "canMaintain-yes",
  isCaretaker: "isCaretaker-yes",
  hasAccessibleVehicle: "hasAccessibleVehicle-yes",
};

const WHY_NEED_MAX = 2000;

// Parse by string parts: new Date("yyyy-mm-dd") is parsed as UTC midnight,
// which shifts the date back a day in US timezones.
function computeAge(dob: string): number | null {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return null;
  const today = new Date();
  let age = today.getFullYear() - y;
  if (
    today.getMonth() + 1 < m ||
    (today.getMonth() + 1 === m && today.getDate() < d)
  ) {
    age -= 1;
  }
  return age;
}

function validate(values: FormValues): Errors {
  const errors: Errors = {};

  if (!values.firstName.trim()) errors.firstName = "Please enter your first name.";
  if (!values.lastName.trim()) errors.lastName = "Please enter your last name.";

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }

  const phoneDigits = values.phone.replace(/\D/g, "");
  if (!values.phone.trim()) {
    errors.phone = "Please enter your phone number.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Please enter a valid phone number, including area code.";
  }

  const age = computeAge(values.dob);
  if (!values.dob) {
    errors.dob = "Please enter your date of birth.";
  } else if (age === null || age < 0 || age > 120) {
    errors.dob = "Please enter a valid date of birth.";
  }

  if (!values.isAdult) {
    errors.isAdult = "Please tell us whether you are 18 or older.";
  } else if (
    age !== null &&
    age >= 0 &&
    age <= 120 &&
    ((age < 18 && values.isAdult === "yes") ||
      (age >= 18 && values.isAdult === "no"))
  ) {
    errors.isAdult =
      "Your date of birth doesn't match this answer. Please double-check both.";
  }

  if (!values.hasLicense) {
    errors.hasLicense =
      "Please tell us whether you have a valid U.S. driver's license.";
  }

  if (!values.street.trim()) errors.street = "Please enter your street address.";
  if (!values.city.trim()) errors.city = "Please enter your city.";
  if (!values.state.trim()) errors.state = "Please enter your state.";
  if (!values.zip.trim()) {
    errors.zip = "Please enter your ZIP code.";
  } else if (!/^\d{5}(-\d{4})?$/.test(values.zip.trim())) {
    errors.zip = "Please enter a valid ZIP code, like 37064.";
  }

  if (!values.employment) errors.employment = "Please select your employment status.";
  if (!values.canMaintain) errors.canMaintain = "Please answer this question.";
  if (!values.isCaretaker) errors.isCaretaker = "Please answer this question.";
  if (!values.recipient) errors.recipient = "Please tell us who the vehicle is for.";

  if (!values.whyNeed.trim()) {
    errors.whyNeed = "Please tell us why you are in need of this vehicle.";
  } else if (values.whyNeed.length > WHY_NEED_MAX) {
    errors.whyNeed = "Please keep this under 2,000 characters.";
  }

  if (!values.hasAccessibleVehicle) errors.hasAccessibleVehicle = "Please answer this question.";
  if (!values.currentTransport.trim()) {
    errors.currentTransport =
      "Please describe the transportation currently being used.";
  }

  if (!values.howHeard) {
    errors.howHeard = "Please tell us how you heard about us.";
  }
  if (values.howHeard === "other" && !values.howHeardOther.trim()) {
    errors.howHeardOther = "Please tell us how you heard about us.";
  }

  if (!values.asIsAcknowledgment) {
    errors.asIsAcknowledgment =
      "You must read and accept this acknowledgment to submit your application.";
  }

  return errors;
}

const inputClass =
  "w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition";
const inputErrorClass =
  " border-red-700 focus:border-red-700 focus:ring-red-700/20";
const labelClass = "block text-sm font-medium text-charcoal mb-2";
const checkClass =
  "mt-0.5 h-5 w-5 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2";
const radioClass =
  "h-5 w-5 accent-olive cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2";
const groupHeadingClass = "font-serif text-xl text-charcoal pt-4";

function describedBy(
  ...ids: Array<string | false | undefined>
): string | undefined {
  const joined = ids.filter(Boolean).join(" ");
  return joined || undefined;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700">
      <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
      {message}
    </p>
  );
}

function EligibilityNote({ children }: { children: ReactNode }) {
  return (
    <div role="note" className="mt-3 flex items-start gap-2.5 rounded-lg bg-gold/20 px-4 py-3">
      <Info aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0 text-charcoal/70" />
      <p className="text-sm text-charcoal/80 leading-relaxed">{children}</p>
    </div>
  );
}

interface TextFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  hint?: string;
  autoComplete?: string;
  inputMode?: "tel" | "email" | "numeric";
  maxLength?: number;
  min?: string;
  max?: string;
  placeholder?: string;
}

function TextField({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  hint,
  autoComplete,
  inputMode,
  maxLength,
  min,
  max,
  placeholder,
}: TextFieldProps) {
  const errorId = `${name}-error`;
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {hint && (
        <p id={hintId} className="-mt-1 mb-2 text-sm text-charcoal/60">
          {hint}
        </p>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        max={max}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hintId, error && errorId)}
        className={`${inputClass}${error ? inputErrorClass : ""}`}
      />
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface SelectFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children: ReactNode;
}

function SelectField({ name, label, value, onChange, error, children }: SelectFieldProps) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && errorId)}
        className={`${inputClass}${error ? inputErrorClass : ""}`}
      >
        {children}
      </select>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface TextAreaFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
}

function TextAreaField({
  name,
  label,
  value,
  onChange,
  error,
  rows = 4,
  maxLength,
  showCounter = false,
}: TextAreaFieldProps) {
  const errorId = `${name}-error`;
  const countId = showCounter ? `${name}-count` : undefined;
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label} <span aria-hidden="true">*</span>
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        rows={rows}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(countId, error && errorId)}
        className={`${inputClass} resize-y${error ? inputErrorClass : ""}`}
      />
      {showCounter && maxLength && (
        <p id={countId} className="mt-2 text-sm text-charcoal/60">
          {value.length.toLocaleString()} / {maxLength.toLocaleString()} characters
        </p>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  );
}

interface YesNoGroupProps {
  name: string;
  legend: string;
  value: YesNo;
  onChange: (value: YesNo) => void;
  error?: string;
  hint?: string;
  note?: ReactNode;
}

function YesNoGroup({ name, legend, value, onChange, error, hint, note }: YesNoGroupProps) {
  const errorId = `${name}-error`;
  const hintId = hint ? `${name}-hint` : undefined;
  const ariaDescribedBy = describedBy(hintId, error && errorId);
  return (
    <fieldset>
      <legend className="text-sm font-medium text-charcoal mb-2">
        {legend} <span aria-hidden="true">*</span>
      </legend>
      {hint && (
        <p id={hintId} className="-mt-1 mb-2 text-sm text-charcoal/60">
          {hint}
        </p>
      )}
      <div className="flex gap-8">
        {(["yes", "no"] as const).map((option) => (
          <label
            key={option}
            htmlFor={`${name}-${option}`}
            className="flex min-h-11 cursor-pointer items-center gap-2.5"
          >
            <input
              type="radio"
              id={`${name}-${option}`}
              name={name}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
              required
              aria-describedby={ariaDescribedBy}
              className={radioClass}
            />
            <span className="text-charcoal">{option === "yes" ? "Yes" : "No"}</span>
          </label>
        ))}
      </div>
      <FieldError id={errorId} message={error} />
      <div aria-live="polite">{note}</div>
    </fieldset>
  );
}

const notEligibleNote =
  "Based on this answer, you may not meet the stated eligibility requirements. You may still submit your application, and our team will review it.";

interface LegalModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

function LegalModal({ title, onClose, children }: LegalModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-4 border-b border-charcoal/10 flex items-center justify-between">
          <h2 className="font-serif text-xl text-charcoal">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="p-1 -m-1 rounded text-charcoal/40 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark transition-colors"
            aria-label="Close"
          >
            <X aria-hidden="true" size={24} />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto text-sm text-charcoal/70 leading-relaxed space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

const waiverLinkClass =
  "mt-1.5 ml-8 block py-1.5 text-sm font-medium text-olive-dark underline underline-offset-2 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 rounded transition-colors";

// Cloudflare Turnstile. Deliberately not an image-puzzle CAPTCHA: this form is
// for people with disabilities, and "pick the traffic lights" grids lock out
// screen reader, low-vision, and motor-impaired applicants. Turnstile is
// keyboard operable and usually passes with no interaction at all.
// Renders nothing until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

// Module scope keeps the clock read out of the component body, where the React
// compiler's purity rule flags it.
function msSince(start: number | null): number {
  return start === null ? 0 : Date.now() - start;
}

export default function VanApplicationForm({
  videoUploadEnabled = false,
}: {
  videoUploadEnabled?: boolean;
}) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [video, setVideo] = useState<VideoStoryValue | null>(null);
  const [videoBusy, setVideoBusy] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [openWaiver, setOpenWaiver] = useState<"asIs" | "media" | null>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const mountedAt = useRef<number | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  // Record when the form became interactive, for the min-time-to-submit check.
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  // Load Turnstile and mount the widget. One effect, so no setState runs
  // synchronously in the effect body. The widgetId guard keeps React's
  // dev-mode double invocation from mounting two widgets.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;

    const mount = () => {
      if (cancelled || widgetId.current) return;
      if (!turnstileRef.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          setTurnstileToken(token);
          setVerifyError(null);
        },
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    };

    if (window.turnstile) {
      mount();
      return () => {
        cancelled = true;
      };
    }

    // If the script fails to load, mount() never runs and widgetId stays null,
    // which lets submission proceed rather than stranding the applicant.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT}"]`
    );
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", mount);
    return () => {
      cancelled = true;
      script.removeEventListener("load", mount);
    };
  }, []);

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  function setValue<K extends FieldName>(name: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    const invalidFields = FIELD_ORDER.filter((name) => nextErrors[name]);
    setErrors(nextErrors);
    if (invalidFields.length > 0) {
      const first = invalidFields[0];
      const el = document.getElementById(focusIdFor[first] ?? first);
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center" });
      return;
    }

    // Don't submit mid-upload or the video would be orphaned.
    if (videoBusy) {
      setVerifyError(
        "Your video is still uploading. Please wait for it to finish, then submit."
      );
      return;
    }

    // Only block when the widget is actually up and simply hasn't been
    // completed. If the script never loaded, don't strand the applicant.
    if (TURNSTILE_SITE_KEY && widgetId.current && !turnstileToken) {
      setVerifyError(
        "Please complete the verification below so we know you're not a robot."
      );
      turnstileRef.current?.scrollIntoView({ block: "center" });
      return;
    }
    setVerifyError(null);

    setStatus("submitting");
    try {
      const res = await fetch("/api/van-giveaway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypotRef.current?.value ?? "",
          elapsedMs: msSince(mountedAt.current),
          turnstileToken,
          videoUrl: video?.url ?? "",
          videoSeconds: video?.seconds ?? null,
        }),
      });
      if (res.ok) {
        if (values.newsletterOptIn) {
          try {
            await fetch("/api/newsletter", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: values.email,
                name: `${values.firstName} ${values.lastName}`,
                source: "Accessible Van Page",
              }),
            });
          } catch {
            // Newsletter signup is best-effort. Never block the application.
          }
        }
        setStatus("success");
      } else {
        // Turnstile tokens are single use, so hand back a fresh one for retry.
        resetTurnstile();
        setStatus("error");
      }
    } catch {
      resetTurnstile();
      setStatus("error");
    }
  }

  function resetTurnstile() {
    setTurnstileToken("");
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="bg-olive/10 rounded-2xl p-8 md:p-12 focus:outline-none"
      >
        <p className="font-serif text-2xl text-charcoal mb-3">
          Application received
        </p>
        <p className="text-charcoal/70 leading-relaxed">
          Thank you for applying. We review every application and will contact
          selected applicants directly. A confirmation email is on its way to
          you. If you don&apos;t see it soon, check your spam folder.
        </p>
        <p className="text-charcoal/70 leading-relaxed mt-3">
          Please remember that submitting an application is not a guarantee of
          receiving the vehicle.
        </p>
      </div>
    );
  }

  const errorCount = FIELD_ORDER.filter((name) => errors[name]).length;

  return (
    <form onSubmit={handleSubmit} noValidate className="relative space-y-8">
      <p className="text-sm text-charcoal/60">
        Fields marked with an asterisk (<span aria-hidden="true">*</span>
        <span className="sr-only">star</span>) are required.
      </p>

      <noscript>
        <p className="rounded-lg bg-gold/20 px-4 py-3 text-sm text-charcoal/80">
          JavaScript is required to submit this form online. If you can&apos;t
          enable it, you can apply by emailing{" "}
          <a href="mailto:info@elizabethsgift.com" className="font-semibold underline">
            info@elizabethsgift.com
          </a>
          .
        </p>
      </noscript>

      {/* Honeypot: humans never see or reach this field; bots that fill it are
          silently dropped server-side. Off-screen (not display:none) so naive
          bots still fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          ref={honeypotRef}
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <h3 className={groupHeadingClass}>About You</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <TextField
          name="firstName"
          label="First name"
          value={values.firstName}
          onChange={(v) => setValue("firstName", v)}
          error={errors.firstName}
          autoComplete="given-name"
        />
        <TextField
          name="lastName"
          label="Last name"
          value={values.lastName}
          onChange={(v) => setValue("lastName", v)}
          error={errors.lastName}
          autoComplete="family-name"
        />
        <TextField
          name="email"
          label="Email address"
          type="email"
          value={values.email}
          onChange={(v) => setValue("email", v)}
          error={errors.email}
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
        />
        <TextField
          name="phone"
          label="Phone number"
          type="tel"
          value={values.phone}
          onChange={(v) => setValue("phone", v)}
          error={errors.phone}
          autoComplete="tel"
          inputMode="tel"
          placeholder="(615) 555-0123"
        />
      </div>

      <TextField
        name="dob"
        label="Date of birth"
        type="date"
        value={values.dob}
        onChange={(v) => setValue("dob", v)}
        error={errors.dob}
        autoComplete="bday"
        min="1900-01-01"
      />

      <h3 className={groupHeadingClass}>Eligibility</h3>

      <YesNoGroup
        name="isAdult"
        legend="Are you 18 or older?"
        value={values.isAdult}
        onChange={(v) => setValue("isAdult", v)}
        error={errors.isAdult}
        note={values.isAdult === "no" ? <EligibilityNote>{notEligibleNote}</EligibilityNote> : null}
      />

      <YesNoGroup
        name="hasLicense"
        legend="Do you have a valid U.S. driver's license?"
        hint="You must have held it for at least one year prior to submitting this application."
        value={values.hasLicense}
        onChange={(v) => setValue("hasLicense", v)}
        error={errors.hasLicense}
        note={
          values.hasLicense === "no" ? <EligibilityNote>{notEligibleNote}</EligibilityNote> : null
        }
      />

      <h3 className={groupHeadingClass}>Home &amp; Household</h3>

      <TextField
        name="street"
        label="Street address"
        value={values.street}
        onChange={(v) => setValue("street", v)}
        error={errors.street}
        autoComplete="street-address"
      />

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
        <div className="sm:col-span-3">
          <TextField
            name="city"
            label="City"
            value={values.city}
            onChange={(v) => setValue("city", v)}
            error={errors.city}
            autoComplete="address-level2"
          />
        </div>
        <div className="sm:col-span-1">
          <TextField
            name="state"
            label="State"
            value={values.state}
            onChange={(v) => setValue("state", v)}
            error={errors.state}
            autoComplete="address-level1"
            maxLength={20}
          />
        </div>
        <div className="sm:col-span-2">
          <TextField
            name="zip"
            label="ZIP code"
            value={values.zip}
            onChange={(v) => setValue("zip", v)}
            error={errors.zip}
            autoComplete="postal-code"
            inputMode="numeric"
            maxLength={10}
          />
        </div>
      </div>

      <SelectField
        name="employment"
        label="Are you currently employed?"
        value={values.employment}
        onChange={(v) => setValue("employment", v as FormValues["employment"])}
        error={errors.employment}
      >
        <option value="">Select one…</option>
        <option value="full-time">Yes, full time</option>
        <option value="part-time">Yes, part time</option>
        <option value="unemployed">Currently unemployed</option>
      </SelectField>

      <YesNoGroup
        name="canMaintain"
        legend="Do you have the means to consistently insure, maintain, and repair a vehicle?"
        value={values.canMaintain}
        onChange={(v) => setValue("canMaintain", v)}
        error={errors.canMaintain}
      />

      <YesNoGroup
        name="isCaretaker"
        legend="Are you the primary caretaker of any children?"
        value={values.isCaretaker}
        onChange={(v) => setValue("isCaretaker", v)}
        error={errors.isCaretaker}
      />

      <h3 className={groupHeadingClass}>About the Need</h3>

      <SelectField
        name="recipient"
        label="Is this vehicle for you or for someone you care for?"
        value={values.recipient}
        onChange={(v) => setValue("recipient", v as FormValues["recipient"])}
        error={errors.recipient}
      >
        <option value="">Select one…</option>
        <option value="myself">For me</option>
        <option value="someone-i-care-for">For someone I care for</option>
      </SelectField>

      <TextAreaField
        name="whyNeed"
        label="Please tell us why you are in need of this vehicle"
        value={values.whyNeed}
        onChange={(v) => setValue("whyNeed", v)}
        error={errors.whyNeed}
        rows={7}
        maxLength={WHY_NEED_MAX}
        showCounter
      />

      <YesNoGroup
        name="hasAccessibleVehicle"
        legend="Do you currently have a handicap-accessible vehicle?"
        value={values.hasAccessibleVehicle}
        onChange={(v) => setValue("hasAccessibleVehicle", v)}
        error={errors.hasAccessibleVehicle}
        note={
          values.hasAccessibleVehicle === "yes" ? (
            <EligibilityNote>{notEligibleNote}</EligibilityNote>
          ) : null
        }
      />

      <TextAreaField
        name="currentTransport"
        label="What method of transportation is currently used for the individual in need?"
        value={values.currentTransport}
        onChange={(v) => setValue("currentTransport", v)}
        error={errors.currentTransport}
        rows={3}
        maxLength={1000}
      />

      {videoUploadEnabled && (
        <VideoStoryField
          value={video}
          onChange={setVideo}
          onBusyChange={setVideoBusy}
          disabled={status === "submitting"}
        />
      )}

      <h3 className={groupHeadingClass}>How You Found Us</h3>

      <SelectField
        name="howHeard"
        label="How did you hear about us?"
        value={values.howHeard}
        onChange={(v) => setValue("howHeard", v as FormValues["howHeard"])}
        error={errors.howHeard}
      >
        <option value="">Select one…</option>
        <option value="tiktok">TikTok</option>
        <option value="instagram">Instagram</option>
        <option value="facebook">Facebook</option>
        <option value="friend-family">Friend or family</option>
        <option value="news">News</option>
        <option value="other">Other</option>
      </SelectField>

      {values.howHeard === "other" && (
        <TextField
          name="howHeardOther"
          label="Please tell us how you heard about us"
          value={values.howHeardOther}
          onChange={(v) => setValue("howHeardOther", v)}
          error={errors.howHeardOther}
          maxLength={200}
        />
      )}

      <h3 className={groupHeadingClass}>Acknowledgments</h3>

      <div
        className={`rounded-xl border bg-white px-6 py-5 ${
          errors.asIsAcknowledgment ? "border-red-700" : "border-charcoal/20"
        }`}
      >
        <label htmlFor="asIsAcknowledgment" className="flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            id="asIsAcknowledgment"
            name="asIsAcknowledgment"
            checked={values.asIsAcknowledgment}
            onChange={(e) => setValue("asIsAcknowledgment", e.target.checked)}
            required
            aria-invalid={errors.asIsAcknowledgment ? true : undefined}
            aria-describedby={describedBy(errors.asIsAcknowledgment && "asIsAcknowledgment-error")}
            className={checkClass}
          />
          <span className="text-sm text-charcoal leading-relaxed">
            <strong className="font-semibold">
              I have read, understand, and agree to the Vehicle As-Is
              Acknowledgment and Release.
            </strong>{" "}
            <span aria-hidden="true">*</span>
          </span>
        </label>
        <button
          type="button"
          onClick={() => setOpenWaiver("asIs")}
          className={waiverLinkClass}
        >
          Read the full acknowledgment
        </button>
        <FieldError id="asIsAcknowledgment-error" message={errors.asIsAcknowledgment} />
      </div>

      <div className="rounded-xl border border-charcoal/20 bg-white px-6 py-5">
        <label htmlFor="mediaRelease" className="flex min-h-11 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            id="mediaRelease"
            name="mediaRelease"
            checked={values.mediaRelease}
            onChange={(e) => setValue("mediaRelease", e.target.checked)}
            className={checkClass}
          />
          <span className="text-sm text-charcoal/80 leading-relaxed">
            Elizabeth&apos;s Gift may share my name, photos, and video in
            promotional materials.{" "}
            <span className="text-charcoal/50">(Optional)</span>
          </span>
        </label>
        <button
          type="button"
          onClick={() => setOpenWaiver("media")}
          className={waiverLinkClass}
        >
          Read the full media release
        </button>
      </div>

      <div className="flex items-start gap-3 pt-1">
        <input
          type="checkbox"
          id="newsletterOptIn"
          name="newsletterOptIn"
          checked={values.newsletterOptIn}
          onChange={(e) => setValue("newsletterOptIn", e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2"
        />
        <label htmlFor="newsletterOptIn" className="text-sm text-charcoal/60 leading-snug cursor-pointer">
          Sign me up to receive updates from Elizabeth&apos;s Gift. You can
          unsubscribe at any time.
        </label>
      </div>

      {errorCount > 0 && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-lg border border-red-700/30 bg-red-700/5 px-4 py-3"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-700" />
          <p className="text-sm font-medium text-red-700">
            {errorCount === 1
              ? "Please correct the highlighted field above and try again."
              : `Please correct the ${errorCount} highlighted fields above and try again.`}
          </p>
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="rounded-lg border border-red-700/30 bg-red-700/5 px-4 py-3">
          <p className="text-sm text-red-700">
            Something went wrong submitting your application. Please try again,
            or email us directly at{" "}
            <a href="mailto:info@elizabethsgift.com" className="font-semibold underline">
              info@elizabethsgift.com
            </a>
            .
          </p>
        </div>
      )}

      {TURNSTILE_SITE_KEY && (
        <div>
          <div ref={turnstileRef} />
          {verifyError && (
            <p
              role="alert"
              className="mt-2 flex items-start gap-1.5 text-sm font-medium text-red-700"
            >
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {verifyError}
            </p>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-olive-dark px-10 py-3.5 font-semibold text-white hover:bg-olive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Submitting…" : "Submit Application"}
      </button>

      {openWaiver === "asIs" && (
        <LegalModal
          title="Vehicle As-Is Acknowledgment and Release"
          onClose={() => setOpenWaiver(null)}
        >
          <p>
            The van is offered and gifted strictly as-is, where-is, and with
            all faults, with no warranties of any kind, express or implied,
            including without limitation any implied warranty of
            merchantability or fitness for a particular purpose.
          </p>
          <p>
            Elizabeth&apos;s Gift, together with its officers, directors, board
            members, employees, volunteers, agents, affiliates, and
            subsidiaries, assumes no liability arising from or related to the
            condition, operation, maintenance, or use of the vehicle.
          </p>
          <p>
            If selected, I will be required to sign a liability waiver and
            release, and an as-is acknowledgment, prior to transfer of the
            vehicle.
          </p>
          <p>
            Elizabeth&apos;s Gift reserves the right to verify eligibility,
            request supporting documentation, and select the recipient at its
            sole discretion. Submitting an application is not a guarantee of
            receiving the vehicle.
          </p>
          <p>
            This summary is provided for general information only and is not
            legal advice. The final executed transfer documents govern the
            terms of the gift.
          </p>
        </LegalModal>
      )}

      {openWaiver === "media" && (
        <LegalModal
          title="Media and Publicity Release"
          onClose={() => setOpenWaiver(null)}
        >
          <p>
            By checking the media release box, I grant Elizabeth&apos;s Gift
            permission to use my name, likeness, photographs, and video
            recordings related to this vehicle gift in promotional and social
            media materials, including the Elizabeth&apos;s Gift website,
            social media accounts, and print and digital materials.
          </p>
          <p>
            This release is optional. Declining does not affect my application
            in any way.
          </p>
        </LegalModal>
      )}
    </form>
  );
}
