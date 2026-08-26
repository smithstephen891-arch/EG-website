import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const INTEREST_LABELS: Record<string, string> = {
  playing: "Playing in the tournament",
  sponsoring: "Sponsoring",
  volunteering: "Volunteering",
  updates: "Just keep me posted",
};

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
    { message: "Submission received successfully" },
    { status: 200 }
  );
}

// Per-instance flood guard. Serverless instances don't share memory, so this
// won't catch a distributed attack — it's a cheap brake on rapid-fire bursts
// from one source.
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

type MailchimpResult = {
  status: "added" | "skipped" | "failed";
  detail: string;
};

// Adds the person to the Townies Open Mailchimp audience. Never throws and
// never fails the request: the notification email is the submission of
// record, Mailchimp is the convenience on top.
async function addToMailchimp(
  email: string,
  name: string
): Promise<MailchimpResult> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    console.log(
      "[townies-interest] Mailchimp skipped: MAILCHIMP_API_KEY / MAILCHIMP_AUDIENCE_ID not set"
    );
    return { status: "skipped", detail: "Mailchimp keys not configured" };
  }

  // The data-center prefix rides on the end of the API key ("...-us21") and
  // doubles as the API hostname's subdomain.
  const dc = process.env.MAILCHIMP_SERVER_PREFIX || apiKey.split("-").pop() || "";
  if (!/^[a-z]{2,4}\d+$/.test(dc)) {
    console.error(
      "[townies-interest] Mailchimp skipped: could not determine the data-center prefix. Set MAILCHIMP_SERVER_PREFIX."
    );
    return { status: "skipped", detail: "Data-center prefix missing" };
  }

  const [firstName, ...restOfName] = name.split(" ");
  // Upsert keyed by MD5 of the lowercased email: re-submitting the same
  // address updates the contact instead of erroring on the duplicate.
  const memberUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${audienceId}/members/${createHash(
    "md5"
  )
    .update(email.toLowerCase())
    .digest("hex")}`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(memberUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: { FNAME: firstName ?? "", LNAME: restOfName.join(" ") },
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      // Mailchimp explains failures in the body ("Member In Compliance State",
      // fake-looking address, ...). Surface that in the notification email.
      let detail = `HTTP ${res.status}`;
      try {
        const body = (await res.json()) as { title?: string; detail?: string };
        detail = [body.title, body.detail].filter(Boolean).join(": ") || detail;
      } catch {}
      console.error("[townies-interest] Mailchimp upsert failed:", detail);
      return { status: "failed", detail };
    }

    // Tags in the upsert body don't reliably apply to already-existing
    // members, so they get their own call. Best-effort: a tag failure never
    // demotes the successful subscribe.
    try {
      const tagRes = await fetch(`${memberUrl}/tags`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tags: [{ name: "townies-open-2027", status: "active" }],
        }),
        signal: AbortSignal.timeout(8000),
      });
      if (!tagRes.ok) {
        console.error(
          "[townies-interest] Mailchimp tag call failed:",
          tagRes.status
        );
      }
    } catch (error) {
      console.error("[townies-interest] Mailchimp tag call failed:", error);
    }

    return { status: "added", detail: "Added to the audience" };
  } catch (error) {
    console.error("[townies-interest] Mailchimp unreachable:", error);
    return { status: "failed", detail: "Mailchimp unreachable" };
  }
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

    // Spam checks. All respond with a normal success so bots get no signal.
    const honeypot = typeof data.website === "string" ? data.website : "";
    const elapsedMs = typeof data.elapsedMs === "number" ? data.elapsedMs : NaN;
    if (honeypot.trim() !== "") {
      console.log("[townies-interest] Dropped submission: honeypot filled");
      return accepted();
    }
    if (!Number.isFinite(elapsedMs) || elapsedMs < 5000) {
      console.log("[townies-interest] Dropped submission: submitted too fast");
      return accepted();
    }
    if (isRateLimited(ip)) {
      console.log("[townies-interest] Dropped submission: rate limited", ip);
      return accepted();
    }

    const text = (value: unknown, max: number) =>
      typeof value === "string" ? value.trim().slice(0, max) : "";
    // Single-line fields: also strip newlines so user input can never inject
    // headers via the email subject.
    const line = (value: unknown, max: number) =>
      text(value, max).replace(/[\r\n]+/g, " ");

    const name = line(data.name, 120);
    const email = line(data.email, 200);
    const interest = line(data.interest, 30);
    const message = text(data.message, 2000);

    // Server-side validation. Never trust the client.
    const errors: string[] = [];
    if (!name) errors.push("Name is required");
    if (!email) errors.push("Email is required");
    if (email && !/^\S+@\S+\.\S+$/.test(email)) errors.push("Email is invalid");
    if (!(interest in INTEREST_LABELS)) errors.push("Interest is invalid");

    if (errors.length > 0) {
      console.log("[townies-interest] Validation failed:", errors);
      return NextResponse.json(
        { message: "Please check the form and try again." },
        { status: 400 }
      );
    }

    const interestLabel = INTEREST_LABELS[interest];
    const mailchimp = await addToMailchimp(email, name);
    const mailchimpLine =
      mailchimp.status === "added"
        ? "Added to the Mailchimp audience (tagged townies-open-2027)"
        : mailchimp.status === "skipped"
          ? `Skipped — ${mailchimp.detail}`
          : `FAILED — ${mailchimp.detail} (add them by hand)`;

    const submittedAt = new Date().toLocaleString("en-US", {
      timeZone: "America/Chicago",
      dateStyle: "full",
      timeStyle: "long",
    });

    if (!process.env.RESEND_API_KEY) {
      console.log(
        "[townies-interest] Submission (no email sent, RESEND_API_KEY not set):",
        { name, email, interest: interestLabel, message, mailchimp }
      );
      return accepted();
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const toAddress =
      process.env.TOWNIES_INTEREST_TO_EMAIL || "towniesopen@gmail.com";

    const e = escapeHtml;
    const row = (label: string, value: string) =>
      `<tr><td style="padding: 8px 0; color: #666; width: 140px; vertical-align: top;"><strong>${label}</strong></td><td style="padding: 8px 0; color: #3d513f;">${value}</td></tr>`;

    // The from address stays on elizabethsgift.com — the domain verified in
    // Resend — until towniesgolf.com is verified there too. Resend rejects
    // sends from unverified domains.
    // Resend reports failures in the response body rather than throwing, so a
    // bare await would let a rejected send look like success to the sender.
    const { error: sendError } = await resend.emails.send({
      from: "Townies Open <noreply@elizabethsgift.com>",
      to: toAddress,
      replyTo: email,
      subject: `[TOWNIES INTEREST] ${name} — ${interestLabel}`,
      text: `New Townies Open Interest Submission

Name: ${name}
Email: ${email}
Interested in: ${interestLabel}

Message:
${message || "(none)"}

Mailchimp: ${mailchimpLine}

Submitted: ${submittedAt}
IP: ${ip}

---
Sent via the Townies Open interest form (towniesgolf.com)`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3d513f;">New Townies Open Interest Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Name", e(name))}
            ${row("Email", `<a href="mailto:${e(email)}">${e(email)}</a>`)}
            ${row("Interested in", e(interestLabel))}
          </table>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <h3 style="color: #3d513f;">Message</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message ? e(message) : "(none)"}</p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            ${row("Mailchimp", e(mailchimpLine))}
            ${row("Submitted", e(submittedAt))}
            ${row("IP", e(ip))}
          </table>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Sent via the Townies Open interest form (towniesgolf.com)</p>
        </div>
      `,
    });

    if (sendError) {
      console.error(
        "[townies-interest] Resend rejected the message:",
        sendError
      );
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }

    return accepted();
  } catch (error) {
    console.error("Townies interest submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
