import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/eg-logo.svg"
                alt="Elizabeth's Gift"
                width={40}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
              <span className="font-serif text-lg font-semibold text-cream">
                Elizabeth&apos;s Gift
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-cream/60">
              Lifting Up and Living Fully
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-cream mb-4">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm hover:text-cream transition-colors">About</Link>
              <Link href="/apply" className="text-sm hover:text-cream transition-colors">Apply for Assistance</Link>
              <Link href="/donate" className="text-sm hover:text-cream transition-colors">Donate</Link>
              <Link href="/events" className="text-sm hover:text-cream transition-colors">Events</Link>
              <Link href="/contact" className="text-sm hover:text-cream transition-colors">Contact</Link>
              <Link href="/privacy" className="text-sm hover:text-cream transition-colors">Privacy Policy</Link>
            </nav>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold text-cream mb-4">
              Connect
            </h3>
            <div className="flex gap-4 mb-4">
              <a
                href="https://facebook.com/elizabethsgift"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com/elizabethsgift"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-cream transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
            <p className="text-sm text-cream/60">
              Elizabeth&apos;s Gift is a registered nonprofit organization.
              <br />
              All donations are tax-deductible to the extent allowed by law.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 text-center text-sm text-cream/40">
          <p>&copy; {new Date().getFullYear()} Elizabeth&apos;s Gift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
