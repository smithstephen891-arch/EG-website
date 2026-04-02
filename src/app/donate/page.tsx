"use client";

import { useState } from "react";

const presetAmounts = [25, 50, 150, 500];

export default function DonatePage() {
  const [pledgeType, setPledgeType] = useState<"one-time" | "monthly">("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const currentAmount = selectedAmount || Number(customAmount) || 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentAmount <= 0) return;
    setLoading(true);
    try {
      const form = e.currentTarget;
      const data = {
        name: (form.elements.namedItem("name") as HTMLInputElement).value,
        email: (form.elements.namedItem("email") as HTMLInputElement).value,
        pledgeType,
        amount: currentAmount,
        message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      };
      await fetch("/api/pledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              Support Elizabeth&apos;s Gift
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              We are not yet set up to accept donations, but we are working on it and
              would love to know you&apos;re with us. If you would like to make a pledge —
              one-time or monthly — fill out the form below and we will reach out to
              you as soon as we are ready to receive donations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <h2 className="font-serif text-3xl text-charcoal">Thank You!</h2>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                Your pledge means the world to us. We will be in touch as soon
                as we are ready to accept donations.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
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
                    className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Pledge Type Toggle */}
              <div>
                <p className="block text-sm font-medium text-charcoal mb-3">Pledge Type</p>
                <div className="bg-charcoal/5 rounded-full p-1 flex w-fit">
                  <button
                    type="button"
                    onClick={() => setPledgeType("one-time")}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                      pledgeType === "one-time"
                        ? "bg-olive text-white"
                        : "text-charcoal/60 hover:text-charcoal"
                    }`}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => setPledgeType("monthly")}
                    className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                      pledgeType === "monthly"
                        ? "bg-olive text-white"
                        : "text-charcoal/60 hover:text-charcoal"
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Preset Amounts */}
              <div>
                <p className="block text-sm font-medium text-charcoal mb-3">Pledge Amount</p>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount("");
                      }}
                      className={`rounded-2xl py-4 text-center transition-all border-2 ${
                        selectedAmount === amount
                          ? "border-olive bg-olive/10"
                          : "border-charcoal/10 bg-white hover:border-olive/30"
                      }`}
                    >
                      <p className="font-serif text-xl text-charcoal">${amount}</p>
                    </button>
                  ))}
                </div>
                <div className="relative max-w-xs">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 font-semibold">
                    $
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    min="1"
                    placeholder="Custom amount"
                    className="w-full rounded-lg border border-charcoal/20 bg-white pl-8 pr-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                  />
                </div>
              </div>

              {/* Optional Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                  Anything you&apos;d like to share? (optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-y"
                />
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="newsletterOptIn"
                  name="newsletterOptIn"
                  className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0"
                />
                <label htmlFor="newsletterOptIn" className="text-sm text-charcoal/60 leading-snug cursor-pointer">
                  Sign me up to receive updates from Elizabeth&apos;s Gift. You can
                  unsubscribe at any time.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading || currentAmount <= 0}
                className="rounded-full bg-olive px-10 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : currentAmount > 0 ? `Pledge $${currentAmount.toLocaleString()}` : "Select an amount to continue"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Why Your Support Matters */}
      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="font-serif text-3xl md:text-4xl text-cream mb-8">
            Why Your Support Matters
          </h2>
          <div className="text-cream/80 text-lg leading-relaxed space-y-6">
            <p>
              Elizabeth lived fully and joyfully despite the many challenges her
              disabilities presented, in part because she had access to the
              equipment and support she needed. We started Elizabeth&apos;s Gift
              because we know not everyone is so fortunate.
            </p>
            <p>
              Too many people are waiting for a properly fitting wheelchair,
              shower chairs, track systems, adaptive vehicles, and many, many
              more items that are needed to make life a little easier. With your
              support, you help us close that gap: one person, one piece of
              equipment at a time.
            </p>
            <p className="font-serif text-xl italic text-gold">
              No gift is too small. Every dollar brings us closer to a world
              where all people are lifted up and living fully, regardless of
              income or abilities.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
