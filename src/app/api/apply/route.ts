import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const recipientName = formData.get("recipientName") as string;
    const guardianName = formData.get("guardianName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const age = formData.get("age") as string;
    const story = formData.get("story") as string;
    const equipment = formData.get("equipment") as string;
    const doctor = formData.get("doctor") as string;
    const medicalLetter = formData.get("medicalLetter") as string;
    const howHeard = formData.get("howHeard") as string;
    const additional = formData.get("additional") as string;
    const documentFiles = formData.getAll("documents") as File[];

    if (!process.env.RESEND_API_KEY) {
      console.log("Application submission (no email sent — RESEND_API_KEY not set):", {
        recipientName, guardianName, phone, email, address, age,
        story, equipment, doctor, medicalLetter, howHeard, additional,
      });
      return NextResponse.json({ message: "Application received successfully" }, { status: 200 });
    }

    // Build attachments from uploaded files
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const file of documentFiles) {
      if (file && file.size > 0) {
        const buffer = await file.arrayBuffer();
        attachments.push({ filename: file.name, content: Buffer.from(buffer) });
      }
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: "info@elizabethsgift.com",
      replyTo: email,
      subject: `New Assistance Application — ${recipientName}`,
      attachments,
      text: `New Assistance Application\n\nRecipient Name: ${recipientName}\nGuardian Name: ${guardianName || "—"}\nAge: ${age || "—"}\nPhone: ${phone}\nEmail: ${email}\nAddress: ${address}\n\nTheir Story:\n${story}\n\nRequested Equipment:\n${equipment}\n\nPCP / Therapist: ${doctor || "—"}\n\nLetter of Medical Necessity:\n${medicalLetter}\n\nHow They Heard About Us: ${howHeard || "—"}\n\nAdditional Information:\n${additional || "—"}\n\n---\nSubmitted via elizabethsgift.com assistance application`,
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
              <td style="padding: 8px 0; color: #666;"><strong>Address</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${address}</td>
            </tr>
          </table>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />

          <h3 style="color: #352e24;">Their Story</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${story}</p>

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
          <p style="color: #999; font-size: 12px;">Submitted via elizabethsgift.com assistance application</p>
        </div>
      `,
    });

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
