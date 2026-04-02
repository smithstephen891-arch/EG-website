"use client";

import { useState, FormEvent } from "react";
import { Facebook, Instagram, Mail } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        if (data.newsletterOptIn === "on") {
          await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: data.email, name: data.name, source: "Contact Form" }),
          });
        }
        setSubmitted(true);
      }
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
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-charcoal/70 leading-relaxed">
              Whether you have a question about applying for assistance, want to
              learn more about how to support our mission, or simply want to
              connect, we&apos;d love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-8">
                Send Us a Message
              </h2>

              {submitted ? (
                <div className="bg-olive/10 rounded-2xl p-8">
                  <p className="text-charcoal font-semibold text-lg mb-2">
                    Message Sent!
                  </p>
                  <p className="text-charcoal/70">
                    Thank you for reaching out. We do our best to respond within
                    2–3 business days.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal mb-2">
                      Your Name *
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

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-charcoal mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full rounded-lg border border-charcoal/20 bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-olive focus:ring-2 focus:ring-olive/20 outline-none transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
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
                    disabled={loading}
                    className="rounded-full bg-olive px-10 py-3.5 font-semibold text-white hover:bg-olive-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl text-charcoal mb-8">
                Other Ways to Reach Us
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-olive/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-olive" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">Email</h3>
                    <p className="text-charcoal/70">info@elizabethsgift.com</p>
                    <p className="text-sm text-charcoal/50 mt-1">
                      We do our best to respond within 2–3 business days.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-charcoal mb-4">
                    Find Us on Social Media
                  </h3>
                  <div className="flex gap-4">
                    <a
                      href="https://facebook.com/elizabethsgift"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                      <Facebook size={22} />
                      <span className="text-sm font-medium">Facebook</span>
                    </a>
                    <a
                      href="https://instagram.com/elizabethsgift"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                      <Instagram size={22} />
                      <span className="text-sm font-medium">@elizabethsgift</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-olive/10 rounded-2xl p-8">
                <p className="font-serif text-lg italic text-charcoal/70">
                  Thank you for your interest in Elizabeth&apos;s Gift. Every
                  message, every connection, and every act of generosity brings us
                  closer to a world where all people are lifted up and living
                  fully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
