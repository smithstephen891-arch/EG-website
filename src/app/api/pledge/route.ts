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

    // Notify Elizabeth's Gift.
    // Resend reports failures in the response body rather than throwing, so a
    // bare await would let a rejected send look like success to the donor.
    const { error: sendError } = await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: "info@elizabethsgift.com",
      replyTo: email,
      subject: `New Pledge — ${name} (${pledgeType}, $${amount})`,
      text: `New Donation Pledge\n\nName: ${name}\nEmail: ${email}\nPledge Type: ${pledgeType === "monthly" ? "Monthly" : "One-time"}\nAmount: $${Number(amount).toLocaleString()}${message ? `\n\nMessage:\n${message}` : ""}\n\n---\nSubmitted via elizabethsgift.com donation pledge form`,
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

    if (sendError) {
      console.error("Pledge: Resend rejected the notification:", sendError);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }

    // Confirmation to donor. Secondary: the pledge is already recorded above,
    // so a failure here is logged rather than failing the whole request.
    const { error: confirmationError } = await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: email,
      subject: "Your Pledge to Elizabeth's Gift — Thank You!",
      text: `Thank you, ${name}!\n\nWe have received your pledge and are so grateful for your support of Elizabeth's Gift.\n\nThis is a pledge of intent, not a charge. We are not yet set up to accept donations, but we will reach out to you as soon as we are ready.\n\nPledge Type: ${pledgeType === "monthly" ? "Monthly" : "One-time"}\nAmount: $${Number(amount).toLocaleString()}\n\nIf you have any questions, feel free to reply to this email or reach us at info@elizabethsgift.com.\n\nWith gratitude,\nThe Elizabeth's Gift Team\n\n---\nElizabeth's Gift — Lifting Up and Living Fully`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #352e24;">Thank You, ${name}!</h2>
          <p style="color: #555; line-height: 1.6;">
            We have received your pledge and are so grateful for your support of Elizabeth's Gift.
          </p>
          <p style="color: #555; line-height: 1.6;">
            Just a reminder — this is a pledge of intent, not a charge. We are not yet set up to
            accept donations, but we will reach out to you as soon as we are ready. We will contact
            you at this email address when that time comes.
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Pledge Type</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${pledgeType === "monthly" ? "Monthly" : "One-time"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Amount</strong></td>
              <td style="padding: 8px 0; color: #352e24;">$${Number(amount).toLocaleString()}</td>
            </tr>
          </table>
          <p style="color: #555; line-height: 1.6;">
            If you have any questions in the meantime, feel free to reply to this email or reach us at
            <a href="mailto:info@elizabethsgift.com" style="color: #7a7c3b;">info@elizabethsgift.com</a>.
          </p>
          <p style="color: #555; line-height: 1.6; margin-top: 24px;">
            With gratitude,<br />
            <strong>The Elizabeth's Gift Team</strong>
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Elizabeth's Gift &mdash; Lifting Up and Living Fully</p>
        </div>
      `,
    });

    if (confirmationError) {
      console.error(
        "Pledge: confirmation email was rejected (notification already sent):",
        confirmationError
      );
    }

    return NextResponse.json({ message: "Pledge received successfully" }, { status: 200 });
  } catch (error) {
    console.error("Pledge submission error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
