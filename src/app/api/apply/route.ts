import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log the application (in production, store in DB and send email notification)
    console.log("Application submission:", data);

    return NextResponse.json(
      { message: "Application received successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
