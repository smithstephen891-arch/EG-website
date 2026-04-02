import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, name, source } = data;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.log("Newsletter signup (no email sent — RESEND_API_KEY not set):", data);
      return NextResponse.json({ message: "Signed up successfully" }, { status: 200 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Notify admin of new subscriber (always runs first)
    await resend.emails.send({
      from: "Elizabeth's Gift <noreply@elizabethsgift.com>",
      to: "info@elizabethsgift.com",
      subject: `New Newsletter Signup — ${email}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #352e24;">New Newsletter Subscriber</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #352e24;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            ${name ? `
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Name</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${name}</td>
            </tr>` : ""}
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Source</strong></td>
              <td style="padding: 8px 0; color: #352e24;">${source ?? "Website"}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Submitted via elizabethsgift.com</p>
        </div>
      `,
    });

    // Add contact to Resend (runs independently — won't break the signup if it fails)
    try {
      await resend.contacts.create({
        email,
        firstName: name?.split(" ")[0] ?? "",
        lastName: name?.split(" ").slice(1).join(" ") ?? "",
        unsubscribed: false,
      });
    } catch (contactError) {
      console.error("Resend contact add failed (non-critical):", contactError);
    }

    return NextResponse.json({ message: "Signed up successfully" }, { status: 200 });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
