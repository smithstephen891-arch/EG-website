import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the submission (in production, send email via Resend/SendGrid)
    console.log("Contact form submission:", data);

    return NextResponse.json(
      { message: "Message received successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
