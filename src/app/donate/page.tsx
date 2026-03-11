"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDonation } from "@/context/DonationContext";

const tiers = [
  { amount: 50, description: "Can help cover an adaptive accessory or daily living aid" },
  { amount: 150, description: "Can contribute toward a specialized medical device" },
  { amount: 500, description: "Can help fund a significant portion of a mobility aid" },
  { amount: 1000, description: "Can change someone's life completely" },
];

export default function DonatePage() {
  const router = useRouter();
  const { setDonation } = useDonation();
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState("");
  const [donationType, setDonationType] = useState<"one-time" | "monthly">("one-time");

  const currentAmount = selectedAmount || Number(customAmount) || 0;

  function handleProceed() {
    if (currentAmount <= 0) return;
    setDonation({ amount: currentAmount, type: donationType });
    router.push("/cart");
  }

  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-charcoal">
              Give the Gift of Possibility
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              Every donation to Elizabeth&apos;s Gift puts life-enhancing equipment
              in the hands of someone who needs it: a new wheelchair that fits,
              a device that helps communication, a lift system that makes
              transportation easier. Tools that make the difference between
              getting through the day and truly living it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Donation Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-charcoal/5 rounded-full p-1 flex">
              <button
                onClick={() => setDonationType("one-time")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  donationType === "one-time"
                    ? "bg-olive text-white"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                One-time
              </button>
              <button
                onClick={() => setDonationType("monthly")}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  donationType === "monthly"
                    ? "bg-olive text-white"
                    : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          {/* Tier Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {tiers.map((tier) => (
              <button
                key={tier.amount}
                onClick={() => {
                  setSelectedAmount(tier.amount);
                  setCustomAmount("");
                }}
                className={`rounded-2xl p-6 text-center transition-all border-2 ${
                  selectedAmount === tier.amount
                    ? "border-olive bg-olive/10"
                    : "border-charcoal/10 bg-white hover:border-olive/30"
                }`}
              >
                <p className="font-serif text-2xl md:text-3xl text-charcoal">
                  ${tier.amount.toLocaleString()}
                </p>
              </button>
            ))}
          </div>

          {/* Impact Descriptions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {tiers.map((tier) => (
              <p key={tier.amount} className="text-xs text-charcoal/50 text-center px-2">
                {tier.description}
              </p>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="max-w-sm mx-auto mb-12">
            <label htmlFor="customAmount" className="block text-sm font-medium text-charcoal mb-2 text-center">
              Or enter a custom amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 font-semibold">
                $
              </span>
              <input
                type="number"
                id="customAmount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                min="1"
                placeholder="Enter amount"
                className="w-full rounded-lg border border-charcoal/20 bg-white pl-8 pr-4 py-3 text-charcoal text-center text-lg placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
              />
            </div>
          </div>

          {/* Proceed */}
          <div className="text-center">
            <button
              onClick={handleProceed}
              disabled={currentAmount <= 0}
              className="rounded-full bg-olive px-10 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentAmount > 0
                ? `Proceed with $${currentAmount.toLocaleString()} ${donationType} donation`
                : "Select an amount to continue"}
            </button>
          </div>

          <p className="text-center text-sm text-charcoal/50 mt-4">
            All donations are tax-deductible to the extent allowed by law.
          </p>
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
              donation, you help us close that gap: one person, one piece of
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
