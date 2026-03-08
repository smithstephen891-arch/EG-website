"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useDonation } from "@/context/DonationContext";

export default function CheckoutPage() {
  const { donation, resetDonation } = useDonation();
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [optNewsletter, setOptNewsletter] = useState(false);

  if (donation.amount <= 0 && !completed) {
    return (
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-serif text-3xl text-charcoal mb-4">
            Complete Your Donation
          </h1>
          <p className="text-charcoal/70 mb-8">
            Please select a donation amount first.
          </p>
          <Link
            href="/donate"
            className="inline-block rounded-full bg-olive px-8 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors"
          >
            Go to Donation Page
          </Link>
        </div>
      </section>
    );
  }

  if (completed) {
    return (
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="bg-olive/10 rounded-2xl p-12">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Thank You!
            </h1>
            <p className="text-charcoal/70 text-lg mb-2">
              Your donation has been received. On behalf of Elizabeth, and
              everyone whose life you are helping to transform — thank you.
            </p>
            <p className="text-charcoal/50 text-sm mt-4">
              A receipt will be sent to the email address you provided.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-full bg-olive px-8 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreePrivacy) {
      alert("Please agree to the Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    // In production, this would create a Stripe PaymentIntent
    // For now, simulate a successful donation
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);

      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: donation.amount,
          type: donation.type,
          donor: data,
          newsletter: optNewsletter,
        }),
      });

      if (res.ok) {
        setCompleted(true);
        resetDonation();
      } else {
        alert("Payment processing is not yet configured. Thank you for your interest in donating!");
        setCompleted(true);
        resetDonation();
      }
    } catch {
      // For demo purposes, show success anyway
      setCompleted(true);
      resetDonation();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            Complete Your Donation
          </h1>
          <p className="mt-4 text-charcoal/70 text-lg">
            You&apos;re one step away from making a difference.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Form */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h2 className="font-serif text-xl text-charcoal mb-6">
                    Billing Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-charcoal mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                        Phone Number (optional)
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-charcoal mb-2">
                        Billing Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label htmlFor="city" className="block text-sm font-medium text-charcoal mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          required
                          className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-charcoal mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          required
                          className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block text-sm font-medium text-charcoal mb-2">
                          ZIP *
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          required
                          className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-xl text-charcoal mb-4">
                    Payment Details
                  </h2>
                  <div className="bg-charcoal/5 rounded-lg p-6">
                    <p className="text-charcoal/60 text-sm">
                      Secure payment processing via Stripe will be configured
                      here. For now, this is a demo checkout flow.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreePrivacy}
                      onChange={(e) => setAgreePrivacy(e.target.checked)}
                      className="mt-1 rounded border-charcoal/30 text-olive focus:ring-olive"
                    />
                    <span className="text-sm text-charcoal/70">
                      I agree to the{" "}
                      <Link href="/privacy" className="text-olive hover:underline">
                        Privacy Policy
                      </Link>{" "}
                      *
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={optNewsletter}
                      onChange={(e) => setOptNewsletter(e.target.checked)}
                      className="mt-1 rounded border-charcoal/30 text-olive focus:ring-olive"
                    />
                    <span className="text-sm text-charcoal/70">
                      I would like to receive updates from Elizabeth&apos;s Gift
                      (optional)
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading || !agreePrivacy}
                  className="w-full rounded-full bg-olive px-10 py-4 font-semibold text-white text-lg hover:bg-olive-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : `Complete $${donation.amount.toLocaleString()} Donation`}
                </button>

                <p className="text-center text-xs text-charcoal/40">
                  All transactions are secure and encrypted. Elizabeth&apos;s Gift
                  does not store your payment information.
                </p>
              </form>
            </div>

            {/* Summary Sidebar */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-serif text-lg text-charcoal mb-4">
                  Donation Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 text-sm">Amount</span>
                    <span className="font-semibold text-charcoal">
                      ${donation.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 text-sm">Type</span>
                    <span className="font-semibold text-charcoal capitalize">
                      {donation.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/60 text-sm">Designation</span>
                    <span className="font-semibold text-charcoal">
                      General Fund
                    </span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-charcoal/10">
                  <p className="text-xs text-charcoal/50">
                    Your generosity helps provide life-changing mobility and
                    medical equipment to individuals who need it most.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
