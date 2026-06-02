"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { easePremium } from "@/lib/motion";
import { NAV_LINKS, CERTIFICATIONS } from "@/lib/constants";
import { useHiddenAdminLoginGesture } from "@/lib/hooks/use-hidden-admin-login-gesture";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const handleLogoClick = useHiddenAdminLoginGesture();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/90 backdrop-blur-xl transition-all duration-500",
        scrolled ? "shadow-[var(--shadow-soft)] bg-white/95" : "",
      )}
    >
      <div className="hidden border-b border-slate-100/80 bg-gradient-to-r from-surface/80 via-white/90 to-surface/80 lg:block">
        <Container className="flex items-center justify-center gap-12 py-2">
          {CERTIFICATIONS.map((cert) => (
            <div key={cert.id} className="flex items-center gap-2.5">
              <Image
                src={cert.image}
                alt={cert.name}
                width={72}
                height={32}
                className="h-7 w-auto object-contain opacity-90"
              />
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-navy-700 xl:inline">
                {cert.shortName}
              </span>
            </div>
          ))}
        </Container>
      </div>

      <Container>
        <nav className="flex h-[82px] sm:h-[92px] md:h-[116px] lg:h-[140px] items-center justify-between gap-3 sm:gap-5 lg:gap-8">
          <Link
            href="/"
            onClick={handleLogoClick}
            className="group flex min-w-0 shrink-0 items-center py-1 pr-3 transition-opacity duration-300 hover:opacity-95 sm:pr-5 md:pr-8"
          >
            <BrandLogo size="nav" priority />
          </Link>

          <ul className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3.5 py-2 text-sm font-medium tracking-wide transition-colors duration-300",
                      active
                        ? "bg-blue-100/90 text-blue-600"
                        : "text-navy-800 hover:bg-surface hover:text-navy-950",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center xl:flex">
            <Button href="/devis" variant="primary" className="!py-2.5 !px-5 text-sm">
              Demander un devis
            </Button>
          </div>

          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-navy-900 shadow-[0_4px_16px_rgba(7,21,37,0.06)] xl:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: easePremium }}
            className="max-h-[calc(100svh-82px)] overflow-y-auto border-t border-slate-200 bg-white xl:hidden"
          >
            <Container className="py-4 sm:py-5">
              <div className="mb-4 flex flex-wrap justify-center gap-3 border-b border-slate-100 pb-4 sm:mb-5 sm:gap-4 sm:pb-5">
                {CERTIFICATIONS.map((cert) => (
                  <Image
                    key={cert.id}
                    src={cert.image}
                    alt={cert.name}
                    width={72}
                    height={32}
                    className="h-6 w-auto object-contain sm:h-7"
                  />
                ))}
              </div>
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3.5 text-base font-semibold text-navy-800 hover:bg-surface sm:text-sm sm:font-medium"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-4">
                  <Button href="/devis" variant="primary" className="w-full justify-center">
                    Demander un devis
                  </Button>
                </li>
              </ul>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
