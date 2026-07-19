"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";

export function ClosingCta() {
  const { dict } = useTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-accent-warm px-8 py-16 text-center shadow-2xl sm:px-16"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {dict.landing.ctaSectionTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/90">{dict.landing.ctaSectionSubtitle}</p>
        <Link
          href="/register"
          className="mt-8 inline-flex rounded-full bg-white px-8 py-3 font-medium text-slate-900 shadow-lg transition hover:opacity-90"
        >
          {dict.landing.ctaPrimary}
        </Link>
      </motion.div>
    </section>
  );
}
