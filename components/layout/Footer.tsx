"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  SITE,
  CERTIFICATIONS,
  LEGAL_LINKS,
  NAV_LINKS,
  FOOTER_FORMATIONS,
} from "@/lib/constants";
import { easeCinematic } from "@/lib/motion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Container } from "@/components/ui/Container";

import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" as const },
  transition: { duration: 0.85, delay, ease: easeCinematic },
});

export function Footer() {
  return (
    <footer className="footer-architectural relative overflow-hidden">
      <div className="gradient-bar-animated mx-auto max-w-6xl opacity-60" />

      <Container className="relative py-16 md:py-20">
        <motion.div
          {...reveal(0)}
          className="flex flex-col items-center gap-8 border-b border-slate-200/80 pb-12 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left"
        >
          <div>
            <BrandLogo size="footer" />
            <p className="mt-6 max-w-sm font-serif text-lg italic leading-relaxed text-navy-800 md:text-xl">
              {SITE.tagline}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 lg:justify-end">
            {CERTIFICATIONS.map((cert) => (
              <Image
                key={cert.id}
                src={cert.image}
                alt={cert.name}
                width={96}
                height={42}
                className="h-8 w-auto object-contain opacity-90"
              />
            ))}
          </div>
        </motion.div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
          <motion.div {...reveal(0.06)} className="lg:col-span-5">
            <p className="section-eyebrow">Nous trouver</p>
            <div className="refined-card mt-4 overflow-hidden">
              <div className="border-b border-slate-200/80 p-5 md:p-6">
                <p className="font-semibold text-navy-950">{SITE.address.street}</p>
                <p className="mt-1 text-sm text-body-strong">
                  {SITE.address.building} · {SITE.address.city}
                </p>
                <p className="mt-1.5 text-xs text-lead-strong">{SITE.address.access}</p>
                <a
                  href={SITE.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-all duration-500 hover:border-blue-300 hover:text-blue-600"
                >
                  Itinéraire Google Maps
                  <span aria-hidden className="text-xs opacity-70">↗</span>
                </a>
              </div>
              <GoogleMapEmbed className="rounded-none border-0 shadow-none" />
            </div>
          </motion.div>

          <motion.div {...reveal(0.1)} className="lg:col-span-4">
            <p className="section-eyebrow">Contact</p>
            <div className="refined-card mt-4 space-y-5 p-5 md:p-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Téléphone
                </p>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="mt-1.5 block text-lg font-semibold text-navy-950 transition-colors duration-500 hover:text-blue-600"
                >
                  {SITE.phone}
                </a>
                <a
                  href={`tel:${SITE.mobile.replace(/\./g, "").replace(/\s/g, "")}`}
                  className="mt-1 block text-sm font-medium text-body-strong transition-colors duration-500 hover:text-blue-600"
                >
                  {SITE.mobile}
                </a>
              </div>
              <div className="section-divider-glow" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Email
                </p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-1.5 block text-sm font-medium text-body-strong transition-colors duration-500 hover:text-blue-600"
                >
                  {SITE.email}
                </a>
              </div>
              <div className="section-divider-glow" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
                  Horaires
                </p>
                <p className="mt-1.5 text-sm text-body-strong">{SITE.hours}</p>
                <p className="mt-1.5 text-xs text-lead-strong">{SITE.onSiteNote}</p>
              </div>
            </div>
          </motion.div>

          <motion.div {...reveal(0.14)} className="lg:col-span-3">
            <p className="section-eyebrow">Navigation</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-body-strong transition-colors duration-500 hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="section-eyebrow mt-8">Formations</p>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_FORMATIONS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-body-strong transition-colors duration-500 hover:text-blue-600"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          {...reveal(0.2)}
          className="mt-12 flex flex-col gap-5 border-t border-slate-200/80 pt-8 md:flex-row md:items-center md:justify-between"
        >
          <div className="flex flex-wrap gap-5">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-lead-strong transition-colors duration-500 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-600">
            Qualiopi · Qualianor · Éligible CPF
          </p>
        </motion.div>

        <p className="mt-6 text-center text-xs text-lead-strong md:text-left">
          © {new Date().getFullYear()} {SITE.name}. Tous droits réservés.
        </p>
      </Container>
    </footer>
  );
}
