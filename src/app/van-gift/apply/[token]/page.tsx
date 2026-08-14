import type { Metadata } from "next";
import { notFound } from "next/navigation";
import VanApplicationForm from "@/components/VanApplicationForm";
import { Check, ShieldAlert } from "lucide-react";

/*
 * The van application, reachable only by someone holding the link.
 *
 * Applications closed publicly on 12 August 2026. This exists so a specific
 * person we have already spoken to can still apply, and it is deliberately
 * unreachable from the site: nothing links here, the van page still says
 * applications are closed, and the segment below is a secret rather than a
 * guessable path like /van-gift/apply.
 *
 * The secret lives in VAN_APPLICATION_TOKEN rather than in this file, so it
 * never enters git and can be changed or cleared without a code change.
 * Clearing it turns every issued link off.
 */

// Read the token per request, so rotating it takes effect on the next request
// rather than at the next build, and so no 200 is ever cached for a path that
// should have stopped working.
export const dynamic = "force-dynamic";

// Belt and braces. Nothing links here, so a crawler should never find it — but
// a URL can still leak through a referrer header or a forwarded email, and this
// is what stops that leak from turning into a search result.
export const metadata: Metadata = {
  title: "Apply for the Wheelchair Accessible Van — Elizabeth's Gift",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const eligibilityRequirements = [
  "You must be a resident of the United States.",
  "You must be at least 18 years old to apply.",
  "You must have held a valid U.S. driver's license for at least one year prior to submitting this application.",
  "You do not currently own a handicap accessible van.",
];

export default async function PrivateVanApplicationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const expected = process.env.VAN_APPLICATION_TOKEN;

  // Fails closed. An unset token disables the link entirely rather than
  // opening it, so a missing environment variable can never publish the form.
  if (!expected || token !== expected) {
    notFound();
  }

  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
            Apply for the Wheelchair Accessible Van
          </h1>
          {/* The recipient cannot find this page from the site and may wonder
              whether they are in the right place. Saying so costs one line. */}
          <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
            This application was sent to you directly. It isn&apos;t listed on
            our website, so please use this link to return to it rather than
            searching for it.
          </p>
        </div>
      </section>

      <section className="bg-charcoal text-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl text-cream mb-8">
            Who Can Apply
          </h2>
          <ul className="space-y-4">
            {eligibilityRequirements.map((requirement) => (
              <li key={requirement} className="flex items-start gap-3">
                <Check aria-hidden="true" className="mt-1 h-5 w-5 flex-shrink-0 text-olive-muted" />
                <span className="text-cream/80 text-lg leading-relaxed">{requirement}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl bg-charcoal-light p-6 border-l-4 border-olive">
            <p className="text-cream/80 leading-relaxed">
              Completing this application is{" "}
              <strong className="font-semibold text-cream">not a guarantee</strong>{" "}
              of receiving the vehicle. We review every application and will
              contact selected applicants directly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-24">
          <div className="mb-10 rounded-xl border border-red-700/25 bg-red-700/5 px-6 py-5">
            <p className="flex items-center gap-2 font-semibold text-charcoal">
              <ShieldAlert aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-red-700" />
              Beware of scams
            </p>
            <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
              Elizabeth&apos;s Gift will{" "}
              <strong className="font-semibold text-charcoal">
                never ask you for money
              </strong>{" "}
              at any point in this process. There is no fee to apply, no fee to
              be selected, and no payment of any kind required to receive the
              vehicle. We will never ask for your bank account, card, or
              payment information.
            </p>
            <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
              We only contact applicants from an{" "}
              <strong className="font-semibold text-charcoal">
                @elizabethsgift.com
              </strong>{" "}
              address. If someone claiming to be us asks you for payment,
              it isn&apos;t us. Please report it to{" "}
              <a
                href="mailto:info@elizabethsgift.com"
                className="font-semibold text-olive-dark underline underline-offset-2 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olive-dark focus-visible:ring-offset-2 rounded"
              >
                info@elizabethsgift.com
              </a>
              .
            </p>
          </div>

          {/* Video uploads light up once a Vercel Blob store is linked. */}
          <VanApplicationForm
            videoUploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
          />
        </div>
      </section>
    </>
  );
}
