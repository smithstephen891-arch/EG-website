import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // In production, create a Stripe PaymentIntent:
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: data.amount * 100, // Stripe uses cents
    //   currency: "usd",
    //   metadata: {
    //     type: data.type,
    //     donor_name: data.donor.fullName,
    //     donor_email: data.donor.email,
    //   },
    // });
    // return NextResponse.json({ clientSecret: paymentIntent.client_secret });

    console.log("Payment intent request:", data);

    return NextResponse.json(
      { message: "Payment processing not yet configured. Stripe test keys required." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
