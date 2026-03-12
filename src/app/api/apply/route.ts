import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      recipientName,
      guardianName,
      phone,
      email,
      address,
      age,
      story,
      equipment,
      doctor,
      medicalLetter,
      additional,
    } = data;

    if (!process.env.RESEND_API_KEY) {
      console.log("Application submission (no email sent — RESEND_API_KEY not set):", data);
      return NextResponse.json({ message: "Application received successfully" }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Elizabeth's Gift <onboarding@resend.dev>",
      to: "smithstephen891@gmail.com",
      replyTo: email,
      subject: `New Assistance Application — ${recipientName}`,
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
              <td style="padding: 8px 0; color: #352e24;">${guardianName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Age</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${age}</td>
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
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${doctor}</p>

          <h3 style="color: #352e24;">Letter of Medical Necessity</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${medicalLetter}</p>

          <h3 style="color: #352e24;">Additional Information</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${additional}</p>

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
