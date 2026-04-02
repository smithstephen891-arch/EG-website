import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, pledgeType, amount, message } = data;

    if (!process.env.RESEND_API_KEY) {
      console.log("Pledge submission (no email sent — RESEND_API_KEY not set):", data);
      return NextResponse.json({ message: "Pledge received successfully" }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: "smithstephen891@gmail.com",
      replyTo: email,
      subject: `New Pledge — ${name} (${pledgeType}, $${amount})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #352e24;">New Donation Pledge</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Name</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #352e24;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Pledge Type</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${pledgeType === "monthly" ? "Monthly" : "One-time"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Amount</strong></td>
              <td style="padding: 8px 0; color: #352e24;">$${Number(amount).toLocaleString()}</td>
            </tr>
          </table>
          ${message ? `
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 16px 0;" />
          <h3 style="color: #352e24;">Message</h3>
          <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          ` : ""}
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Submitted via elizabethsgift.com donation pledge form</p>
        </div>
      `,
    });

    return NextResponse.json({ message: "Pledge received successfully" }, { status: 200 });
  } catch (error) {
    console.error("Pledge submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
