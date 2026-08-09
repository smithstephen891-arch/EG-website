import { NextResponse } from "next/server";
import { Resend } from "resend";
import {
  VAN_VIDEO_PREFIX,
  extractVideoPathname,
  mintVideoLink,
} from "@/lib/video-storage";

const EMPLOYMENT_LABELS: Record<string, string> = {
  "full-time": "Yes, full time",
  "part-time": "Yes, part time",
  unemployed: "Currently unemployed",
};

const RECIPIENT_LABELS: Record<string, string> = {
  myself: "For me",
  "someone-i-care-for": "For someone I care for",
};

const HOW_HEARD_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  "friend-family": "Friend or family",
  news: "News",
  other: "Other",
};

function isYesNo(value: string): boolean {
  return value === "yes" || value === "no";
}

function yesNoLabel(value: string): string {
  return value === "yes" ? "Yes" : "No";
}

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function accepted(): NextResponse {
  return NextResponse.json(
    { message: "Application received successfully" },
    { status: 200 }
  );
}

// Cloudflare Turnstile. Skipped entirely when TURNSTILE_SECRET_KEY is unset,
// so the form keeps working (honeypot + timing only) before keys are added.
async function verifyTurnstile(
  token: string,
  ip: string
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };
  if (!token) return { ok: false, reason: "no token supplied" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "Unknown") body.append("remoteip", ip);
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      }
    );
    const result = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (result.success) return { ok: true };
    return { ok: false, reason: (result["error-codes"] ?? []).join(", ") };
  } catch (error) {
    // Cloudflare unreachable. Fail open: turning away a real applicant is worse
    // than letting a submission through, since every one is reviewed by hand.
    console.error("[van-gift] Turnstile unreachable, allowing:", error);
    return { ok: true };
  }
}

// Per-instance flood guard. Serverless instances don't share memory, so this
// won't catch a distributed attack — it's a cheap brake on rapid-fire bursts
// from one source, layered under Turnstile.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const recentByIp = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  if (!ip || ip === "Unknown") return false;
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  if (hits.length >= RATE_LIMIT_MAX) {
    recentByIp.set(ip, hits);
    return true;
  }
  hits.push(now);
  recentByIp.set(ip, hits);
  if (recentByIp.size > 500) {
    for (const [key, times] of recentByIp) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
        recentByIp.delete(key);
      }
    }
  }
  return false;
}

export async function POST(request: Request) {
  try {
    let data: Record<string, unknown>;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "Unknown";

    // Spam checks. Both respond with a normal success so bots get no signal.
    const honeypot = typeof data.website === "string" ? data.website : "";
    const elapsedMs = typeof data.elapsedMs === "number" ? data.elapsedMs : NaN;
    if (honeypot.trim() !== "") {
      console.log("[van-gift] Dropped submission: honeypot filled");
      return accepted();
    }
    if (!Number.isFinite(elapsedMs) || elapsedMs < 5000) {
      console.log("[van-gift] Dropped submission: submitted too fast");
      return accepted();
    }
    if (isRateLimited(ip)) {
      console.log("[van-gift] Dropped submission: rate limited", ip);
      return accepted();
    }

    // Bot challenge. A real applicant whose challenge expired gets a clear
    // retry message rather than a silent drop.
    const turnstileToken =
      typeof data.turnstileToken === "string" ? data.turnstileToken : "";
    const verdict = await verifyTurnstile(turnstileToken, ip);
    if (!verdict.ok) {
      console.log("[van-gift] Turnstile rejected:", verdict.reason);
      return NextResponse.json(
        {
          message:
            "We couldn't verify that you're human. Please complete the verification and try again.",
        },
        { status: 400 }
      );
    }

    const text = (value: unknown, max: number) =>
      typeof value === "string" ? value.trim().slice(0, max) : "";
    // Single-line fields: also strip newlines so user input can never inject
    // headers via the email subject.
    const line = (value: unknown, max: number) =>
      text(value, max).replace(/[\r\n]+/g, " ");

    const firstName = line(data.firstName, 100);
    const lastName = line(data.lastName, 100);
    const email = line(data.email, 200);
    const phone = line(data.phone, 40);
    const dob = line(data.dob, 10);
    const isAdult = line(data.isAdult, 10);
    const hasLicense = line(data.hasLicense, 10);
    const street = line(data.street, 200);
    const city = line(data.city, 100);
    const state = line(data.state, 40);
    const zip = line(data.zip, 10);
    const employment = line(data.employment, 20);
    const canMaintain = line(data.canMaintain, 10);
    const isCaretaker = line(data.isCaretaker, 10);
    const recipient = line(data.recipient, 30);
    const whyNeed = text(data.whyNeed, 2000);
    const hasAccessibleVehicle = line(data.hasAccessibleVehicle, 10);
    const currentTransport = text(data.currentTransport, 1000);
    const howHeard = line(data.howHeard, 20);
    const howHeardOther = line(data.howHeardOther, 200);
    const passengerAcknowledgment = data.passengerAcknowledgment === true;
    const asIsAcknowledgment = data.asIsAcknowledgment === true;
    const mediaRelease = data.mediaRelease === true;
    const newsletterOptIn = data.newsletterOptIn === true;
    const videoPathname = extractVideoPathname(
      data.videoUrl,
      VAN_VIDEO_PREFIX,
      "van-gift"
    );
    const videoSeconds =
      typeof data.videoSeconds === "number" && Number.isFinite(data.videoSeconds)
        ? Math.round(data.videoSeconds)
        : null;
    const videoLabel = videoPathname
      ? `Yes${videoSeconds ? ` (${Math.floor(videoSeconds / 60)}:${String(videoSeconds % 60).padStart(2, "0")})` : ""}`
      : "No video submitted";

    // Server-side validation. Never trust the client.
    const errors: string[] = [];
    const require = (value: string, label: string) => {
      if (!value) errors.push(`${label} is required`);
    };

    require(firstName, "First name");
    require(lastName, "Last name");
    require(email, "Email");
    require(phone, "Phone");
    require(dob, "Date of birth");
    require(street, "Street address");
    require(city, "City");
    require(state, "State");
    require(zip, "ZIP code");
    require(whyNeed, "Reason for need");
    require(currentTransport, "Current transportation");

    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Email is invalid");
    const phoneDigits = phone.replace(/\D/g, "");
    if (phone && (phoneDigits.length < 10 || phoneDigits.length > 15)) {
      errors.push("Phone number is invalid");
    }
    if (zip && !/^\d{5}(-\d{4})?$/.test(zip)) errors.push("ZIP code is invalid");

    const age = dob ? computeAge(dob) : null;
    if (dob && (age === null || age < 0 || age > 120)) {
      errors.push("Date of birth is invalid");
    }

    if (!isYesNo(isAdult)) errors.push("18-or-older answer is required");
    if (!isYesNo(hasLicense)) errors.push("License answer is required");
    if (!isYesNo(canMaintain)) errors.push("Insure/maintain answer is required");
    if (!isYesNo(isCaretaker)) errors.push("Caretaker answer is required");
    if (!isYesNo(hasAccessibleVehicle)) errors.push("Accessible-vehicle answer is required");
    if (!(employment in EMPLOYMENT_LABELS)) errors.push("Employment status is required");
    if (!(recipient in RECIPIENT_LABELS)) errors.push("Vehicle recipient is required");
    if (!(howHeard in HOW_HEARD_LABELS)) errors.push("How-heard answer is required");
    if (howHeard === "other" && !howHeardOther) {
      errors.push("How-heard detail is required when Other is selected");
    }
    if (!passengerAcknowledgment) {
      errors.push("Passenger-use acknowledgment must be accepted");
    }
    if (!asIsAcknowledgment) errors.push("As-is acknowledgment must be accepted");

    // Stated 18+ answer must agree with the date of birth.
    if (
      age !== null &&
      age >= 0 &&
      age <= 120 &&
      isYesNo(isAdult) &&
      ((age < 18 && isAdult === "yes") || (age >= 18 && isAdult === "no"))
    ) {
      errors.push("Date of birth does not match the 18-or-older answer");
    }

    if (errors.length > 0) {
      console.log("[van-gift] Validation failed:", errors);
      return NextResponse.json(
        { message: "Please check the form and try again." },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`;
    const fullAddress = `${street}, ${city}, ${state} ${zip}`;
    const employmentLabel = EMPLOYMENT_LABELS[employment];
    const recipientLabel = RECIPIENT_LABELS[recipient];
    const howHeardLabel =
      howHeard === "other"
        ? `Other: ${howHeardOther}`
        : HOW_HEARD_LABELS[howHeard];

    // Eligibility flags: applicants can submit even when they don't meet the
    // stated requirements, so flag them prominently for manual review.
    const flags: string[] = [];
    if (isAdult === "no" || (age !== null && age < 18)) {
      flags.push("Applicant is under 18");
    }
    if (hasLicense === "no") {
      flags.push("No valid U.S. driver's license");
    }
    if (hasAccessibleVehicle === "yes") {
      flags.push("Already owns a handicap-accessible vehicle");
    }

    // Consent record: timestamp + IP for proof of agreement
    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "long",
    });
    const submittedAtISO = new Date().toISOString();

    if (!process.env.RESEND_API_KEY) {
      console.log("Van application (no email sent, RESEND_API_KEY not set):", {
        fullName, email, phone, dob, age, fullAddress, employment: employmentLabel,
        isAdult, hasLicense, canMaintain, isCaretaker, recipient: recipientLabel,
        whyNeed, hasAccessibleVehicle, currentTransport, howHeard: howHeardLabel,
        passengerAcknowledgment, asIsAcknowledgment, mediaRelease,
        newsletterOptIn, eligibilityFlags: flags,
        videoPathname: videoPathname || "(none)",
      });
      return accepted();
    }

    // Sign once here, right before sending, so the link's 7-day clock starts
    // as close as possible to when the reviewer will actually open the email.
    const videoUrl = await mintVideoLink(videoPathname, "van-gift");

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toAddress =
      process.env.VAN_APPLICATION_TO_EMAIL || "info@elizabethsgift.com";

    const e = escapeHtml;
    const row = (label: string, value: string, width?: number) =>
      `<tr><td style="padding: 8px 0; color: #666;${width ? ` width: ${width}px;` : ""}"><strong>${label}</strong></td><td style="padding: 8px 0; color: #352e24;">${value}</td></tr>`;

    const flagsHtml =
      flags.length > 0
        ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #dc2626; font-weight: bold; margin: 0 0 8px;">&#9888; Eligibility flags: review carefully</p>
            <ul style="color: #dc2626; margin: 0; padding-left: 20px;">
              ${flags.map((flag) => `<li style="padding: 2px 0;">${e(flag)}</li>`).join("")}
            </ul>
          </div>`
        : `<p style="color: #16a34a; font-weight: bold; margin: 16px 0;">&#10003; No eligibility flags. Meets all stated requirements.</p>`;

    const flagsText =
      flags.length > 0
        ? `!! ELIGIBILITY FLAGS: REVIEW CAREFULLY !!\n${flags.map((flag) => `- ${flag}`).join("\n")}`
        : "No eligibility flags. Meets all stated requirements.";

    // Admin notification must succeed, or we return 500. Resend reports
    // failures in the response body rather than throwing, so a bare await
    // would let a rejected send look like success to the applicant.
    const { error: sendError } = await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: toAddress,
      replyTo: email,
      subject: `[VAN APPLICATION] ${fullName}`,
      text: `New Accessible Van Application

${flagsText}

Name: ${fullName}
Email: ${email}
Phone: ${phone}
Date of Birth: ${dob} (age ${age})
Address: ${fullAddress}

18 or older: ${yesNoLabel(isAdult)}
Valid U.S. driver's license: ${yesNoLabel(hasLicense)}
Currently has handicap-accessible vehicle: ${yesNoLabel(hasAccessibleVehicle)}

Employment: ${employmentLabel}
Means to insure, maintain, and repair: ${yesNoLabel(canMaintain)}
Primary caretaker of children: ${yesNoLabel(isCaretaker)}

Vehicle is for: ${recipientLabel}

Why they need this vehicle:
${whyNeed}

Current method of transportation:
${currentTransport}

Story video: ${videoLabel}${
  videoLabel !== "No video submitted"
    ? videoUrl
      ? `\nLink (expires in 7 days): ${videoUrl}`
      : "\n(A video was submitted, but a link could not be generated. Check the server logs.)"
    : ""
}

How they heard about us: ${howHeardLabel}
Newsletter opt-in: ${newsletterOptIn ? "Opted in" : "No"}

========== CONSENT RECORD ==========
Signed By: ${fullName}
Email: ${email}
Date & Time: ${submittedAt}
Timestamp (UTC): ${submittedAtISO}
IP Address: ${ip}

Passenger Use and No Adaptive Controls: ACCEPTED
Vehicle As-Is Acknowledgment and Release: ACCEPTED
Media and Publicity Release: ${mediaRelease ? "ACCEPTED" : "DECLINED (optional)"}
====================================

---
Submitted via elizabethsgift.com accessible van application`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #352e24;">New Accessible Van Application</h2>

          ${flagsHtml}

          <h3 style="color: #352e24; margin-top: 24px;">Applicant</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Name", e(fullName), 220)}
            ${row("Email", `<a href="mailto:${e(email)}">${e(email)}</a>`)}
            ${row("Phone", e(phone))}
            ${row("Date of Birth", `${e(dob)} (age ${age})`)}
            ${row("Address", e(fullAddress))}
          </table>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <h3 style="color: #352e24;">Eligibility Answers</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("18 or older", yesNoLabel(isAdult), 220)}
            ${row("Valid U.S. driver's license", yesNoLabel(hasLicense))}
            ${row("Has accessible vehicle now", yesNoLabel(hasAccessibleVehicle))}
          </table>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <h3 style="color: #352e24;">Household &amp; Finances</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Employment", e(employmentLabel), 220)}
            ${row("Can insure/maintain/repair", yesNoLabel(canMaintain))}
            ${row("Primary caretaker of children", yesNoLabel(isCaretaker))}
          </table>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <h3 style="color: #352e24;">The Need</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Vehicle is for", e(recipientLabel), 220)}
          </table>

          <h3 style="color: #352e24;">Why They Need This Vehicle</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${e(whyNeed)}</p>

          <h3 style="color: #352e24;">Current Method of Transportation</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${e(currentTransport)}</p>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <h3 style="color: #352e24;">Story Video</h3>
          ${
            videoLabel !== "No video submitted"
              ? videoUrl
                ? `<p style="color: #555; line-height: 1.6;">${e(videoLabel)}<br />
                     <a href="${e(videoUrl)}" style="color: #5F6B2C; font-weight: bold;">Watch or download video</a>
                   </p>
                   <p style="color: #999; font-size: 12px;">Right-click the link and choose &ldquo;Save Link As&rdquo; to download. This link is private and expires 7 days after this email is sent &mdash; stored on Elizabeth&rsquo;s Gift private Vercel Blob storage, video files only.</p>`
                : `<p style="color: #dc2626;">A video was submitted, but a viewable link could not be generated. Check the server logs.</p>`
              : `<p style="color: #999;">No video submitted.</p>`
          }

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <table style="width: 100%; border-collapse: collapse;">
            ${row("How they heard about us", e(howHeardLabel), 220)}
            ${row("Newsletter opt-in", newsletterOptIn ? "&#9989; Opted in" : "No")}
          </table>

          <div style="background: #f8f5f0; border: 1px solid #d4c9b8; border-radius: 8px; padding: 20px; margin-top: 24px;">
            <h3 style="color: #352e24; margin-top: 0;">Consent Record</h3>
            <p style="color: #999; font-size: 12px; margin-bottom: 12px;">Retain this record as proof of the applicant&rsquo;s agreement.</p>
            <table style="width: 100%; border-collapse: collapse;">
              ${row("Signed By", e(fullName), 200)}
              ${row("Email", e(email))}
              ${row("Date &amp; Time", e(submittedAt))}
              <tr><td style="padding: 6px 0; color: #666;"><strong>Timestamp (UTC)</strong></td><td style="padding: 6px 0; color: #352e24; font-family: monospace; font-size: 12px;">${e(submittedAtISO)}</td></tr>
              <tr><td style="padding: 6px 0; color: #666;"><strong>IP Address</strong></td><td style="padding: 6px 0; color: #352e24; font-family: monospace; font-size: 12px;">${e(ip)}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #d4c9b8; margin: 14px 0;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 200px;"><strong>Passenger Use / No Adaptive Controls</strong></td>
                <td style="padding: 8px 0; color: #16a34a; font-weight: bold; font-size: 15px;">&#10003; ACCEPTED</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>As-Is Acknowledgment</strong></td>
                <td style="padding: 8px 0; color: #16a34a; font-weight: bold; font-size: 15px;">&#10003; ACCEPTED</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Media Release</strong></td>
                <td style="padding: 8px 0; color: ${mediaRelease ? "#16a34a" : "#666"}; font-weight: bold; font-size: 15px;">${mediaRelease ? "&#10003; ACCEPTED" : "&mdash; DECLINED (optional)"}</td>
              </tr>
            </table>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Submitted via elizabethsgift.com accessible van application</p>
        </div>
      `,
    });

    if (sendError) {
      console.error("[van-gift] Resend rejected the application:", sendError);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }

    // Confirmation to the applicant is best-effort and must never fail the request
    // (the admin notification above already sent).
    try {
      const { error: confirmationError } = await resend.emails.send({
        from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
        to: email,
        subject: "We received your application — Elizabeth's Gift",
        text: `Thank you, ${firstName}!

We've received your application for the wheelchair accessible van. Our team reviews every application carefully.

Please note: submitting an application is not a guarantee of receiving the vehicle. We will contact selected applicants directly.

BEWARE OF SCAMS
Elizabeth's Gift will never ask you for money at any point in this process. There is no fee to apply, no fee to be selected, and no payment of any kind required to receive the vehicle. We will never ask for your bank account, card, or payment information. If anyone contacts you claiming to be from Elizabeth's Gift and asks for money or payment details, it is not us. Please report it to us at info@elizabethsgift.com.

Our messages will only ever come from an @elizabethsgift.com address.

If you have any questions, reach us at info@elizabethsgift.com.

With gratitude,
The Elizabeth's Gift Team

---
Elizabeth's Gift — Lifting Up and Living Fully`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #352e24;">Thank you, ${e(firstName)}!</h2>
            <p style="color: #555; line-height: 1.6;">We&rsquo;ve received your application for the wheelchair accessible van. Our team reviews every application carefully.</p>
            <p style="color: #555; line-height: 1.6;"><strong>Please note:</strong> submitting an application is not a guarantee of receiving the vehicle. We will contact selected applicants directly.</p>

            <div style="background: #fdf6f6; border: 1px solid #e7b9b9; border-left: 4px solid #dc2626; border-radius: 8px; padding: 16px 20px; margin: 24px 0;">
              <p style="color: #b91c1c; font-weight: bold; margin: 0 0 8px; font-size: 15px;">&#9888; Beware of scams</p>
              <p style="color: #555; line-height: 1.6; margin: 0 0 10px;">
                <strong>Elizabeth&rsquo;s Gift will never ask you for money at any point in this process.</strong>
                There is no fee to apply, no fee to be selected, and no payment of any kind required to
                receive the vehicle. We will never ask for your bank account, card, or payment information.
              </p>
              <p style="color: #555; line-height: 1.6; margin: 0;">
                If anyone contacts you claiming to be from Elizabeth&rsquo;s Gift and asks for money or
                payment details, it is not us. Please report it to
                <a href="mailto:info@elizabethsgift.com" style="color: #7a7c3b;">info@elizabethsgift.com</a>.
                Our messages will only ever come from an <strong>@elizabethsgift.com</strong> address.
              </p>
            </div>
            <p style="color: #555; line-height: 1.6;">If you have any questions, reach us at <a href="mailto:info@elizabethsgift.com" style="color: #7a7c3b;">info@elizabethsgift.com</a>.</p>
            <p style="color: #555; line-height: 1.6;">With gratitude,<br /><strong>The Elizabeth&rsquo;s Gift Team</strong></p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
            <p style="color: #999; font-size: 12px;">Elizabeth&rsquo;s Gift &mdash; Lifting Up and Living Fully</p>
          </div>
        `,
      });
      if (confirmationError) {
        console.error(
          "[van-gift] Confirmation email was rejected (application email already sent):",
          confirmationError
        );
      }
    } catch (confirmationError) {
      console.error(
        "[van-gift] Confirmation email failed (application email already sent):",
        confirmationError
      );
    }

    return accepted();
  } catch (error) {
    console.error("Van application submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
