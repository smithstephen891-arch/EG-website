"use client";

import Link from "next/link";
import { useDonation } from "@/context/DonationContext";

export default function CartPage() {
  const { donation } = useDonation();

  if (donation.amount <= 0) {
    return (
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="font-serif text-3xl text-charcoal mb-4">
            Your Donation Summary
          </h1>
          <p className="text-charcoal/70 mb-8">
            You haven&apos;t selected a donation amount yet.
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

  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
            Your Donation Summary
          </h1>
          <p className="mt-4 text-charcoal/70 text-lg">
            Thank you for choosing to support Elizabeth&apos;s Gift. Please review
            your donation below before proceeding to checkout.
          </p>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-charcoal mb-8">
              Donation Details
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-charcoal/10">
                <span className="text-charcoal/70">Donation Amount</span>
                <span className="font-serif text-3xl text-charcoal">
                  ${donation.amount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-charcoal/10">
                <span className="text-charcoal/70">Donation Type</span>
                <span className="font-semibold text-charcoal capitalize">
                  {donation.type}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-charcoal/10">
                <span className="text-charcoal/70">Designation</span>
                <span className="font-semibold text-charcoal">General Fund</span>
              </div>
            </div>

            <div className="mt-8 bg-olive/5 rounded-lg p-4">
              <p className="text-sm text-charcoal/60">
                Elizabeth&apos;s Gift is a registered nonprofit organization. Your
                donation is tax-deductible to the extent allowed by law. A
                receipt will be sent to the email address you provide.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/checkout"
                className="flex-1 rounded-full bg-olive px-8 py-3.5 font-semibold text-white text-center hover:bg-olive-light transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/donate"
                className="flex-1 rounded-full border-2 border-charcoal/20 px-8 py-3.5 font-semibold text-charcoal text-center hover:border-charcoal/40 transition-colors"
              >
                Adjust Amount
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
