"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/apply", label: "Apply" },
  { href: "/donate", label: "Donate" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [headerVisible, setHeaderVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setHeaderVisible(true);
      return;
    }

    setHeaderVisible(false);

    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) {
      setHeaderVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeaderVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isHome]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-charcoal/10 transition-transform duration-300 ${
        headerVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/eg-logo.svg"
              alt="Elizabeth's Gift"
              width={48}
              height={48}
              className="h-12 w-auto"
              priority
            />
            <span className="font-serif text-xl font-semibold text-charcoal hidden sm:block">
              Elizabeth&apos;s Gift
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-serif text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="rounded-full border border-olive px-6 py-2.5 text-sm font-semibold text-olive hover:bg-olive/10 transition-colors"
            >
              Apply
            </Link>
            <Link
              href="/donate"
              className="rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white hover:bg-olive-light transition-colors"
            >
              Donate Now
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-charcoal"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-charcoal/10 bg-cream">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-3 text-sm font-medium text-charcoal/70 hover:text-charcoal hover:bg-cream-dark rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/apply"
              className="mt-2 rounded-full border border-olive px-6 py-2.5 text-sm font-semibold text-olive text-center hover:bg-olive/10 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Apply
            </Link>
            <Link
              href="/donate"
              className="mt-1 rounded-full bg-olive px-6 py-2.5 text-sm font-semibold text-white text-center hover:bg-olive-light transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Donate Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
