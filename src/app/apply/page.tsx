"use client";

import { useState, FormEvent } from "react";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="bg-olive/10 rounded-2xl p-12">
            <h1 className="font-serif text-3xl md:text-4xl text-charcoal mb-4">
              Application Received
            </h1>
            <p className="text-charcoal/70 text-lg">
              Thank you for your application. Our team will review it and reach
              out to you soon. We are honored to help.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-olive/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="font-serif text-4xl md:text-5xl text-charcoal">
              Apply for Assistance
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              If you or someone you know is in need of mobility or medical
              equipment, please fill out the application below. We are honored to
              help.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="recipientName" className="block text-sm font-medium text-charcoal mb-2">
                  Name of Recipient *
                </label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  required
                  className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="guardianName" className="block text-sm font-medium text-charcoal mb-2">
                  Name of Guardian (if applicable)
                </label>
                <input
                  type="text"
                  id="guardianName"
                  name="guardianName"
                  className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
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

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-charcoal mb-2">
                Home Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
              />
            </div>

            <div className="max-w-xs">
              <label htmlFor="age" className="block text-sm font-medium text-charcoal mb-2">
                Age of Applicant
              </label>
              <input
                type="text"
                id="age"
                name="age"
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="story" className="block text-sm font-medium text-charcoal mb-2">
                Tell us about the Recipient. We would love to hear your story! *
              </label>
              <textarea
                id="story"
                name="story"
                required
                rows={5}
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-y"
              />
            </div>

            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-charcoal mb-2">
                Please list the Recipient&apos;s desired equipment and price points
                (if known). *
              </label>
              <textarea
                id="equipment"
                name="equipment"
                required
                rows={4}
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-y"
              />
              <p className="mt-3 text-sm text-charcoal/60 italic leading-relaxed">
                In order to best serve you, it is helpful to have a specific piece
                of equipment listed and, if possible, a letter of medical necessity.
              </p>
            </div>

            <div>
              <label htmlFor="doctor" className="block text-sm font-medium text-charcoal mb-2">
                Name of PCP or Therapist
              </label>
              <textarea
                id="doctor"
                name="doctor"
                rows={2}
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-y"
              />
            </div>

            <div>
              <label htmlFor="medicalLetter" className="block text-sm font-medium text-charcoal mb-2">
                Are you able to provide a letter of medical necessity from a
                doctor or licensed practitioner? *
              </label>
              <textarea
                id="medicalLetter"
                name="medicalLetter"
                required
                rows={3}
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-y"
              />
            </div>

            {/* Document Upload */}
            <div className="rounded-xl border border-olive/30 bg-olive/5 px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Upload Documents (optional)
                </label>
                <label className="flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-charcoal/20 bg-white px-4 py-8 cursor-pointer hover:border-olive hover:bg-olive/5 transition">
                  <svg className="w-8 h-8 text-charcoal/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {fileNames.length > 0 ? (
                    <ul className="text-sm text-charcoal/70 text-center space-y-1">
                      {fileNames.map((name, i) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-charcoal/40">Click to upload or drag and drop</span>
                  )}
                  <input
                    type="file"
                    name="documents"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      setFileNames(files.map((f) => f.name));
                    }}
                  />
                </label>
                <p className="mt-2 text-xs text-charcoal/40">PDF, JPG, PNG, or Word documents accepted</p>
              </div>
            </div>

            <div>
              <label htmlFor="howHeard" className="block text-sm font-medium text-charcoal mb-2">
                How did you hear about us?
              </label>
              <input
                type="text"
                id="howHeard"
                name="howHeard"
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
              />
            </div>

            <div>
              <label htmlFor="additional" className="block text-sm font-medium text-charcoal mb-2">
                Anything else you would like to share?
              </label>
              <textarea
                id="additional"
                name="additional"
                rows={3}
                className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-olive px-10 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
