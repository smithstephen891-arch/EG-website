"use client";

import { useState, FormEvent } from "react";
import { Info } from "lucide-react";
import VideoStoryField, { type VideoStoryValue } from "@/components/VideoStoryField";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [showMediaRelease, setShowMediaRelease] = useState(false);
  const [video, setVideo] = useState<VideoStoryValue | null>(null);
  const [videoBusy, setVideoBusy] = useState(false);
  const [videoPending, setVideoPending] = useState(false);
  const [videoNotice, setVideoNotice] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // A video still uploading, or recorded but never added, would be silently
    // lost while the applicant believes they sent it.
    if (videoBusy) {
      setVideoNotice(
        "Your video is still uploading. Please wait for it to finish, then submit."
      );
      return;
    }
    if (videoPending) {
      setVideoNotice(
        "You have a video that hasn't been added to your application yet. Choose “Use this video” to include it, or “Discard” to leave it out, then submit."
      );
      document.getElementById("video-story")?.scrollIntoView({ block: "center" });
      return;
    }
    setVideoNotice(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    if (video) {
      formData.set("videoUrl", video.url);
      if (video.seconds !== null) {
        formData.set("videoSeconds", String(Math.round(video.seconds)));
      }
    }

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        if (formData.get("newsletterOptIn") === "on") {
          await fetch("/api/newsletter", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.get("email"),
              name: formData.get("recipientName"),
              source: "Apply Form",
            }),
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
              We exist so everyone has the opportunity to move, participate, and
              thrive!
            </p>
            <p className="mt-4 text-lg text-charcoal/70 leading-relaxed">
              We invite you to dream big about what would allow you and your
              family to live fully — Tumble Forms that make traveling easier,
              adaptive bikes, special wheelchairs, a swing for your backyard or
              neighborhood, a communication device, etc.
            </p>
            <p className="mt-4 text-lg text-charcoal/70 leading-relaxed">
              If you or someone you know is in need of mobility or adaptive
              equipment, please fill out the application below. We are honored
              to help.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
          {/* This used to send van hopefuls to the van's own application. That
              closed on 12 August 2026, and this form is where people who missed
              that will try next — so it now has to turn them away rather than
              redirect them. A van request filed here cannot be actioned at all,
              which is worth saying before the first field rather than after. */}
          <div
            role="note"
            className="mb-10 flex items-start gap-3 rounded-xl bg-gold/20 px-6 py-5"
          >
            <Info aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0 text-charcoal/70" />
            {/* Deliberately no bold "applications are closed" heading. Scanned
                rather than read, that line reads as this form being closed too.
                The only emphasis goes on what this form is, so a skimmer lands
                on the reassurance and the closure stays inside the sentence. */}
            <p className="text-sm text-charcoal/80 leading-relaxed">
              This is our{" "}
              <strong className="font-semibold text-charcoal">
                general equipment application
              </strong>
              . The van application is currently closed. Please do not submit
              van applications here, as we have other needs we are trying to
              fulfill separate from the van.
            </p>
          </div>

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

            {/* Optional story video */}
            <div>
              <VideoStoryField
                uploadUrl="/api/apply/upload"
                pathnamePrefix="assistance-applications"
                value={video}
                onChange={setVideo}
                onBusyChange={setVideoBusy}
                onPendingChange={setVideoPending}
                disabled={loading}
              />
              {videoNotice && (
                <p role="alert" className="mt-2 text-sm font-medium text-red-700">
                  {videoNotice}
                </p>
              )}
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

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="newsletterOptIn"
                name="newsletterOptIn"
                defaultChecked
                className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0"
              />
              <label htmlFor="newsletterOptIn" className="text-sm text-charcoal/60 leading-snug cursor-pointer">
                Sign me up to receive updates from Elizabeth&apos;s Gift. You can
                unsubscribe at any time.
              </label>
            </div>

            {/* ── Liability Waiver (Required) ── */}
            <div className="rounded-xl border border-charcoal/20 bg-white px-6 py-5 space-y-4">
              <h3 className="font-semibold text-charcoal text-base">
                Release of Liability, Assumption of Risk, and Hold Harmless Agreement <span className="text-red-600">*</span>
              </h3>
              <div className="max-h-64 overflow-y-auto border border-charcoal/10 rounded-lg px-4 py-3 text-sm text-charcoal/70 leading-relaxed space-y-3 bg-charcoal/[0.02]">
                <p>
                  By checking the box below, I, the undersigned applicant (or the
                  authorized parent, legal guardian, or representative of the
                  equipment recipient), hereby acknowledge and voluntarily agree to
                  the following:
                </p>
                <p>
                  <strong className="text-charcoal">1. Nature of Services.</strong>{" "}
                  Elizabeth&apos;s Gift is a Tennessee nonprofit organization that
                  provides mobility, medical, and adaptive equipment to individuals
                  with disabilities at no cost. I understand that Elizabeth&apos;s
                  Gift does not manufacture, design, or warranty any equipment
                  provided, and that equipment may be new, refurbished, or
                  previously used.
                </p>
                <p>
                  <strong className="text-charcoal">2. Assumption of Risk.</strong>{" "}
                  I acknowledge that the receipt and use of mobility, medical, and
                  adaptive equipment involves inherent risks, including but not
                  limited to: equipment malfunction or failure, improper fit, skin
                  irritation or pressure injury, falls, collision, and other bodily
                  harm. I voluntarily accept and assume all such risks, both known
                  and unknown, arising from the receipt, use, or possession of
                  equipment provided by Elizabeth&apos;s Gift. I understand that it
                  is my responsibility (or the responsibility of the recipient&apos;s
                  guardian or healthcare provider) to evaluate the safety,
                  suitability, and proper fit of any equipment received prior to use,
                  and to consult with a qualified medical professional regarding
                  appropriateness for the recipient&apos;s specific needs.
                </p>
                <p>
                  <strong className="text-charcoal">3. Release and Waiver of Liability.</strong>{" "}
                  In consideration of receiving equipment from Elizabeth&apos;s Gift
                  at no cost, I, on behalf of myself, the equipment recipient (if
                  different), and our respective heirs, executors, administrators,
                  assigns, and personal representatives, hereby release, waive, and
                  forever discharge Elizabeth&apos;s Gift, together with its
                  officers, directors, board members, employees, volunteers, agents,
                  contractors, and representatives (collectively, the &quot;Released
                  Parties&quot;), from any and all claims, demands, actions, causes
                  of action, suits, liabilities, damages, costs, losses, or
                  expenses of any kind whatsoever, whether known or unknown, arising
                  out of or in any way related to the provision, condition,
                  selection, delivery, use, maintenance, modification, or
                  suitability of any equipment provided, to the fullest extent
                  permitted by the laws of the State of Tennessee. This release
                  includes, but is not limited to, claims based on the negligence of
                  the Released Parties. This release does not apply to claims arising
                  from the gross negligence or willful misconduct of the Released
                  Parties.
                </p>
                <p>
                  <strong className="text-charcoal">4. Hold Harmless and Indemnification.</strong>{" "}
                  I agree to indemnify, defend, and hold harmless the Released
                  Parties from and against any and all claims, demands, damages,
                  losses, liabilities, costs, and expenses (including reasonable
                  attorneys&apos; fees and court costs) arising out of or resulting
                  from the receipt, use, misuse, or possession of equipment provided
                  by Elizabeth&apos;s Gift, to the fullest extent permitted by law.
                </p>
                <p>
                  <strong className="text-charcoal">5. Equipment Disclaimer.</strong>{" "}
                  I understand and acknowledge that Elizabeth&apos;s Gift makes no
                  warranties or representations, express or implied, regarding any
                  equipment provided, including but not limited to warranties of
                  merchantability, fitness for a particular purpose, or suitability
                  for the recipient&apos;s specific condition or needs. All equipment
                  is provided &quot;as is.&quot;
                </p>
                <p>
                  <strong className="text-charcoal">6. Authority to Agree.</strong>{" "}
                  If I am executing this agreement on behalf of a minor child or an
                  individual for whom I serve as parent, legal guardian, or
                  authorized representative, I represent and warrant that I have full
                  legal authority to enter into this agreement on their behalf, and I
                  agree to be personally bound by its terms. I further agree that
                  this release and waiver shall apply to any claims brought by or on
                  behalf of such individual.
                </p>
                <p>
                  <strong className="text-charcoal">7. Governing Law.</strong>{" "}
                  This agreement shall be governed by and construed in accordance
                  with the laws of the State of Tennessee, without regard to its
                  conflict of laws principles. Any dispute arising under this
                  agreement shall be subject to the exclusive jurisdiction of the
                  courts of the State of Tennessee.
                </p>
                <p>
                  <strong className="text-charcoal">8. Severability.</strong>{" "}
                  If any provision of this agreement is held to be invalid,
                  unenforceable, or void, the remaining provisions shall continue in
                  full force and effect to the maximum extent permitted by law.
                </p>
                <p>
                  <strong className="text-charcoal">9. Entire Agreement.</strong>{" "}
                  This agreement constitutes the entire understanding between the
                  parties with respect to the subject matter herein and supersedes
                  all prior or contemporaneous agreements, whether written or oral.
                </p>
                <p>
                  <strong className="text-charcoal">10. Acknowledgment.</strong>{" "}
                  I have read this Release of Liability, Assumption of Risk, and
                  Hold Harmless Agreement in its entirety. I fully understand its
                  terms, and I check the box below voluntarily and with full
                  knowledge of its legal significance.
                </p>
              </div>
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="liabilityWaiver"
                  name="liabilityWaiver"
                  required
                  className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0"
                />
                <label htmlFor="liabilityWaiver" className="text-sm text-charcoal leading-snug cursor-pointer">
                  <strong>I have read, understand, and agree to the Release of
                  Liability, Assumption of Risk, and Hold Harmless Agreement
                  above.</strong> <span className="text-red-600">*</span>
                </label>
              </div>
            </div>

            {/* ── Media & Publicity Release (Optional) ── */}
            <div className="rounded-xl border border-charcoal/20 bg-olive/5 px-6 py-5 space-y-3">
              <h3 className="font-serif text-lg text-charcoal">
                Can We Share Your Story to Help More People?
              </h3>
              <p className="text-sm text-charcoal/60 leading-relaxed">
                One of the most powerful ways to grow our mission is by sharing
                the stories of the people we serve. If you&apos;re comfortable, we&apos;d
                love the opportunity to share your story — on our website, social
                media, or in other materials — to inspire others and help us
                reach more people who need support. This is completely optional.
              </p>
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="mediaRelease"
                  name="mediaRelease"
                  className="mt-0.5 h-4 w-4 rounded border-charcoal/30 accent-olive cursor-pointer flex-shrink-0"
                />
                <label htmlFor="mediaRelease" className="text-sm text-charcoal leading-snug cursor-pointer">
                  Yes, Elizabeth&apos;s Gift may use my name, image, and story to
                  help spread the word.{" "}
                  <button
                    type="button"
                    onClick={() => setShowMediaRelease(true)}
                    className="text-olive underline hover:text-olive-light transition-colors"
                  >
                    Read the full media release
                  </button>
                  {" "}
                  <span className="text-charcoal/40">(Optional)</span>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-red-700/25 bg-red-700/5 px-6 py-5">
              <p className="font-semibold text-charcoal">Beware of scams</p>
              <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                Elizabeth&apos;s Gift will{" "}
                <strong className="font-semibold text-charcoal">
                  never ask you for money
                </strong>{" "}
                at any point in this process. There is no fee to apply, no fee
                to be selected, and no payment of any kind required to receive
                equipment. We will never ask for your bank account, card, or
                payment information.
              </p>
              <p className="mt-2 text-sm text-charcoal/80 leading-relaxed">
                We only contact applicants from an{" "}
                <strong className="font-semibold text-charcoal">
                  @elizabethsgift.com
                </strong>{" "}
                address. If someone claiming to be us asks you for payment, it
                isn&apos;t us. Please report it to{" "}
                <a
                  href="mailto:info@elizabethsgift.com"
                  className="font-semibold text-olive underline underline-offset-2 hover:text-charcoal"
                >
                  info@elizabethsgift.com
                </a>
                .
              </p>
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

      {/* Media Release Modal */}
      {showMediaRelease && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] flex flex-col">
            <div className="px-6 pt-6 pb-4 border-b border-charcoal/10 flex items-center justify-between">
              <h2 className="font-serif text-xl text-charcoal">Media and Publicity Release</h2>
              <button
                type="button"
                onClick={() => setShowMediaRelease(false)}
                className="text-charcoal/40 hover:text-charcoal transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5 overflow-y-auto text-sm text-charcoal/70 leading-relaxed space-y-3">
              <p>
                By checking the box on the application form, I, the undersigned
                applicant (or the authorized parent, legal guardian, or
                representative of the individual identified in this application),
                hereby grant to Elizabeth&apos;s Gift, its successors, assigns,
                and authorized representatives, the irrevocable, royalty-free,
                worldwide right and permission to use, reproduce, publish,
                display, distribute, and create derivative works of the
                following, in any form or media now known or hereafter developed:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2">
                <li>Name of the recipient (or the individual on whose behalf this application is submitted)</li>
                <li>Photograph, image, and likeness</li>
                <li>Voice and recorded statements</li>
                <li>Personal story, testimonial, and biographical information</li>
              </ul>
              <p>
                This grant of rights extends to use in any and all publications
                and media, including but not limited to: the Elizabeth&apos;s Gift
                website, social media accounts, print and digital materials,
                newsletters, press releases, presentations, video and audio
                recordings, and fundraising campaigns, for purposes related to
                the charitable mission and activities of Elizabeth&apos;s Gift.
              </p>
              <p className="font-semibold text-charcoal">I acknowledge and agree to the following:</p>
              <p>
                <strong className="text-charcoal">1. No Compensation.</strong>{" "}
                I will receive no monetary compensation or other consideration
                for the use of the above materials.
              </p>
              <p>
                <strong className="text-charcoal">2. No Approval Right.</strong>{" "}
                I waive any right to inspect, review, or approve any finished
                materials, publications, or other works that may include the
                above.
              </p>
              <p>
                <strong className="text-charcoal">3. Respectful Use.</strong>{" "}
                Elizabeth&apos;s Gift will endeavor to portray the recipient
                respectfully and in a manner consistent with its charitable
                mission.
              </p>
              <p>
                <strong className="text-charcoal">4. Authority to Consent.</strong>{" "}
                If I am authorizing this release on behalf of a minor child or
                an individual under my legal guardianship or care, I confirm
                that I have full legal authority to grant this consent on their
                behalf.
              </p>
              <p>
                <strong className="text-charcoal">5. Revocation.</strong>{" "}
                This release shall remain in effect unless I provide written
                notice of revocation to Elizabeth&apos;s Gift at{" "}
                <a href="mailto:info@elizabethsgift.com" className="text-olive underline">info@elizabethsgift.com</a>.
                Any such revocation shall apply only on a going-forward basis
                and shall not apply to materials already published, distributed,
                or in production at the time of revocation.
              </p>
              <p>
                <strong className="text-charcoal">6. Governing Law.</strong>{" "}
                This release shall be governed by and construed in accordance
                with the laws of the State of Tennessee.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-charcoal/10">
              <button
                type="button"
                onClick={() => setShowMediaRelease(false)}
                className="w-full rounded-full bg-olive px-6 py-3 font-semibold text-white hover:bg-olive-light transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
