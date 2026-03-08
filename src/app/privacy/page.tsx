import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Elizabeth's Gift",
  description: "Privacy policy for Elizabeth's Gift nonprofit organization.",
};

export default function PrivacyPage() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
          Privacy Policy
        </h1>
        <p className="text-charcoal/50 mb-12">Last updated: 2025</p>

        <div className="prose-custom space-y-8 text-charcoal/80 leading-relaxed">
          <p>
            Elizabeth&apos;s Gift is a nonprofit organization based in Tennessee.
            We are committed to protecting the privacy of our donors, applicants,
            and website visitors, and operate in accordance with applicable
            Tennessee state law. This Privacy Policy explains what information we
            collect, how we use it, and how we keep it safe.
          </p>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              What Information We Collect
            </h2>
            <p className="mb-3">
              We may collect the following types of information when you visit our
              website, make a donation, or submit an application:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Personal identification information — such as your name, email address, mailing address, and phone number</li>
              <li>Payment information — such as credit or debit card details, processed securely through our payment providers</li>
              <li>Application information — such as medical, financial, or equipment-related information submitted through our grant application</li>
              <li>Usage data — such as browser type, pages visited, and time spent on our site</li>
            </ul>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              How We Use Your Information
            </h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process and acknowledge donations</li>
              <li>Review and respond to equipment grant applications</li>
              <li>Communicate with you about your donation or application status</li>
              <li>Send occasional updates about Elizabeth&apos;s Gift, if you have opted in</li>
              <li>Improve our website and services</li>
            </ul>
            <p className="mt-4 font-semibold">
              We will never sell, rent, or share your personal information with
              third parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              Payment Security
            </h2>
            <p>
              All online payments are processed through secure, encrypted
              third-party payment processors (such as PayPal and Stripe).
              Elizabeth&apos;s Gift does not store your full credit or debit card
              information on our servers.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              Application Confidentiality
            </h2>
            <p>
              Information submitted through our grant application — including
              medical and financial details — is kept strictly confidential and
              used solely for the purpose of evaluating eligibility for
              assistance. It is not shared outside of the Elizabeth&apos;s Gift review
              process.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              Communications
            </h2>
            <p>
              If you provide your email address, we may send you a donation
              receipt or application confirmation. We will only send newsletters
              or updates if you have explicitly opted in, and you may unsubscribe
              at any time.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              Your Rights
            </h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Request access to the personal information we hold about you</li>
              <li>Ask us to correct or delete your information</li>
              <li>Opt out of any communications from us at any time</li>
            </ul>
            <p className="mt-4">
              To make any of these requests, please contact us at{" "}
              <a href="mailto:info@elizabethsgift.org" className="text-olive hover:underline">
                info@elizabethsgift.org
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated date at the top.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-2xl text-charcoal mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please reach
              out to us at{" "}
              <a href="mailto:info@elizabethsgift.org" className="text-olive hover:underline">
                info@elizabethsgift.org
              </a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
