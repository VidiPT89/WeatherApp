"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useTranslations } from "@/i18n/LocaleProvider";

const SCREENSHOTS = [
  { src: "/screenshots/dashboard.png", rotate: -2, width: 1008, height: 390, className: "w-full z-10" },
  { src: "/screenshots/marine.png", rotate: 2, width: 1000, height: 178, className: "w-[85%] -mt-6 ml-10" },
];

export function AppShowcase() {
  const { dict } = useTranslations();

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-accent">{dict.landing.showcaseEyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {dict.landing.showcaseTitle}
          </h2>
          <p className="mt-4 max-w-md text-text-muted">{dict.landing.showcaseSubtitle}</p>
        </div>

        <div className="relative flex flex-col items-center py-6">
          {SCREENSHOTS.map((shot, index) => (
            <motion.div
              key={shot.src}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: shot.rotate }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className={`overflow-hidden rounded-2xl border border-border shadow-2xl ${shot.className}`}
            >
              <Image
                src={shot.src}
                alt=""
                width={shot.width}
                height={shot.height}
                className="h-auto w-full"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
