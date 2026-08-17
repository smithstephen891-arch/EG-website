import { NextResponse } from "next/server";
import { Resend } from "resend";
import { formatAddressBlock, formatAddressOneLine } from "@/lib/address";
import {
  ASSISTANCE_VIDEO_PREFIX,
  extractVideoPathname,
  formatVideoDuration,
  mintVideoLink,
} from "@/lib/video-storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const recipientName = formData.get("recipientName") as string;
    const guardianName = formData.get("guardianName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    // The address arrives in parts now. Composed here so the reviewer's email
    // still reads as an address rather than five labelled fragments.
    const addressParts = {
      street: (formData.get("street") as string) || "",
      unit: (formData.get("unit") as string) || "",
      city: (formData.get("city") as string) || "",
      state: (formData.get("state") as string) || "",
      zip: (formData.get("zip") as string) || "",
    };
    const address = formatAddressOneLine(addressParts);
    const addressHtml = formatAddressBlock(addressParts).replace(/\n/g, "<br />");
    const age = formData.get("age") as string;
    const story = formData.get("story") as string;
    const equipment = formData.get("equipment") as string;
    const doctor = formData.get("doctor") as string;
    const medicalLetter = formData.get("medicalLetter") as string;
    const howHeard = formData.get("howHeard") as string;
    // Videos live in Blob storage, not in this request: only the URL arrives,
    // and it is validated before we ever sign or email a link to it.
    const videoPathname = extractVideoPathname(
      formData.get("videoUrl"),
      ASSISTANCE_VIDEO_PREFIX,
      "apply"
    );
    const rawVideoSeconds = Number(formData.get("videoSeconds"));
    const videoSeconds = Number.isFinite(rawVideoSeconds) && rawVideoSeconds > 0
      ? Math.round(rawVideoSeconds)
      : null;
    const additional = formData.get("additional") as string;
    const liabilityWaiver = formData.get("liabilityWaiver") === "on" ? "Yes" : "No";
    const mediaRelease = formData.get("mediaRelease") === "on" ? "Yes" : "No";
    const documentFiles = formData.getAll("documents") as File[];

    // Consent record: timestamp + IP for proof of agreement
    const submittedAt = new Date().toLocaleString("en-US", { timeZone: "America/Chicago", dateStyle: "full", timeStyle: "long" });
    const submittedAtISO = new Date().toISOString();
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "Unknown";
    const signedBy = guardianName ? `${guardianName} (guardian for ${recipientName})` : recipientName;

    if (!process.env.RESEND_API_KEY) {
      console.log("Application submission (no email sent — RESEND_API_KEY not set):", {
        recipientName, guardianName, phone, email, address, age,
        story, equipment, doctor, medicalLetter, howHeard, additional,
        videoPathname: videoPathname || "(none)",
      });
      return NextResponse.json({ message: "Application received successfully" }, { status: 200 });
    }

    // Signed just before sending, so the 7 day clock starts as close as
    // possible to when the reviewer actually opens the email.
    const videoUrl = await mintVideoLink(videoPathname, "apply");
    const videoLabel = videoPathname
      ? `Yes${formatVideoDuration(videoSeconds)}`
      : "No video submitted";
    const videoTextBlock = videoPathname
      ? videoUrl
        ? `\n\nStory Video: ${videoLabel}\nLink (expires in 7 days): ${videoUrl}`
        : `\n\nStory Video: ${videoLabel}\n(A video was submitted, but a link could not be generated. Check the server logs.)`
      : "";

    // Build attachments from uploaded files
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const file of documentFiles) {
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        attachments.push({ filename: file.name, content: Buffer.from(buffer) });
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    // Resend reports failures in the response body rather than throwing, so a
    // bare await would let a rejected send look like success to the applicant.
    const { error: sendError } = await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: "info@elizabethsgift.com",
      replyTo: email,
      subject: `New Assistance Application — ${recipientName}`,
      attachments,
      text: `New Assistance Application\n\nRecipient Name: ${recipientName}\nGuardian Name: ${guardianName || "—"}\nAge: ${age || "—"}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\nTheir Story:\n${story}\n\nRequested Equipment:\n${equipment}\n\nPCP / Therapist: ${doctor || "—"}\n\nLetter of Medical Necessity:\n${medicalLetter}\n\nHow They Heard About Us: ${howHeard || "—"}\n\nAdditional Information:\n${additional || "—"}${videoTextBlock}\n\n========== CONSENT RECORD ==========\nSigned By: ${signedBy}\nEmail: ${email}\nDate & Time: ${submittedAt}\nTimestamp (UTC): ${submittedAtISO}\nIP Address: ${ip}\n\nRelease of Liability, Assumption of Risk, and Hold Harmless Agreement: ${liabilityWaiver === "Yes" ? "ACCEPTED" : "NOT ACCEPTED"}\nMedia and Publicity Release: ${mediaRelease === "Yes" ? "ACCEPTED" : "DECLINED (optional)"}\n====================================\n\n---\nSubmitted via elizabethsgift.com assistance application`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #352e24;">New Assistance Application</h2>

          <h3 style="color: #352e24; margin-top: 24px;">Applicant Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 180px;"><strong>Recipient Name</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${recipientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Guardian Name</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${guardianName || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Age</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${age || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Phone</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #352e24;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; vertical-align: top;"><strong>Address</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${addressHtml}</td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <h3 style="color: #352e24;">Their Story</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${story}</p>

          ${
            videoPathname
              ? `<h3 style="color: #352e24;">Story Video</h3>
                 ${
                   videoUrl
                     ? `<p style="color: #555; line-height: 1.6;">${videoLabel}<br />
                          <a href="${videoUrl}" style="color: #7a7c3b; font-weight: bold;">Watch or download video</a>
                        </p>
                        <p style="color: #999; font-size: 12px;">Right-click the link and choose &ldquo;Save Link As&rdquo; to download. This link is private and expires 7 days after this email is sent.</p>`
                     : `<p style="color: #dc2626;">A video was submitted, but a viewable link could not be generated. Check the server logs.</p>`
                 }`
              : ""
          }

          <h3 style="color: #352e24;">Requested Equipment</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${equipment}</p>

          <h3 style="color: #352e24;">PCP / Therapist</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${doctor || "—"}</p>

          <h3 style="color: #352e24;">Letter of Medical Necessity</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${medicalLetter}</p>

          ${attachments.length > 0 ? `
          <h3 style="color: #352e24;">Uploaded Documents</h3>
          <p style="color: #555;">${attachments.map((a) => a.filename).join(", ")}</p>
          ` : ""}

          <h3 style="color: #352e24;">How They Heard About Us</h3>
          <p style="color: #555; line-height: 1.6;">${howHeard || "—"}</p>

          <h3 style="color: #352e24;">Additional Information</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${additional || "—"}</p>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />

          <div style="background: #f8f5f0; border: 1px solid #d4c9b8; border-radius: 8px; padding: 20px; margin-top: 24px;">
            <h3 style="color: #352e24; margin-top: 0;">Consent Record</h3>
            <p style="color: #999; font-size: 12px; margin-bottom: 12px;">Retain this record as proof of the applicant&rsquo;s agreement to each waiver.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #666; width: 200px;"><strong>Signed By</strong></td>
                <td style="padding: 6px 0; color: #352e24;">${signedBy}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>Email</strong></td>
                <td style="padding: 6px 0; color: #352e24;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>Date &amp; Time</strong></td>
                <td style="padding: 6px 0; color: #352e24;">${submittedAt}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>Timestamp (UTC)</strong></td>
                <td style="padding: 6px 0; color: #352e24; font-family: monospace; font-size: 12px;">${submittedAtISO}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #666;"><strong>IP Address</strong></td>
                <td style="padding: 6px 0; color: #352e24; font-family: monospace; font-size: 12px;">${ip}</td>
              </tr>
            </table>
            <hr style="border: none; border-top: 1px solid #d4c9b8; margin: 14px 0;" />
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; width: 200px;"><strong>Liability Waiver</strong></td>
                <td style="padding: 8px 0; color: ${liabilityWaiver === "Yes" ? "#16a34a" : "#dc2626"}; font-weight: bold; font-size: 15px;">${liabilityWaiver === "Yes" ? "✓ ACCEPTED" : "✗ NOT ACCEPTED"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Media Release</strong></td>
                <td style="padding: 8px 0; color: ${mediaRelease === "Yes" ? "#16a34a" : "#666"}; font-weight: bold; font-size: 15px;">${mediaRelease === "Yes" ? "✓ ACCEPTED" : "— DECLINED (optional)"}</td>
              </tr>
            </table>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Submitted via elizabethsgift.com assistance application</p>
        </div>
      `,
    });

    if (sendError) {
      console.error("Application: Resend rejected the message:", sendError);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Application received successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
