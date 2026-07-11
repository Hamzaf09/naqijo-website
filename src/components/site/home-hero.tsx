"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/components/site/eyebrow";
import { buttonVariants } from "@/ui/button";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

interface HeroContent {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  subtitle: string;
  primary: string;
  primaryHref: string;
  secondary: string;
  secondaryHref: string;
  /** Hero photograph (CMS media, or the static fallback resolved upstream). */
  image: { src: string; alt: string };
}

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Cinematic hero: the Hero Lifestyle photograph dominates full-bleed, under a
 * single navy scrim for legibility. Monumental Thmanyah Black headline, sky-blue
 * accent to guide the eye, one gold action. Gentle scroll zoom + staged reveal.
 */
export function HomeHero({ content }: { locale: Locale; content: HeroContent }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const img = content.image;

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[90svh] items-end overflow-hidden"
    >
      <motion.div style={{ scale }} className="absolute inset-0 -z-10">
        <motion.div
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease }}
          className="relative h-full w-full"
        >
          <Image src={img.src} alt={img.alt} fill priority sizes="100vw" className="object-cover" />
        </motion.div>
      </motion.div>

      {/* Single navy scrim — bottom-weighted for text legibility (AA). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(8,33,56,0.96) 0%, rgba(8,33,56,0.80) 30%, rgba(8,33,56,0.44) 56%, rgba(8,33,56,0.12) 80%, rgba(8,33,56,0) 100%)",
        }}
      />

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto w-full max-w-[1320px] px-5 pb-16 pt-40 sm:px-8 lg:px-12 lg:pb-24"
      >
        <div className="max-w-3xl text-white">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease, delay: 0.35 }}>
            <Eyebrow tone="onDark">{content.eyebrow}</Eyebrow>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.45 }}
            className="mt-8 font-display font-extrabold leading-[1.05] tracking-[-0.015em] text-[clamp(2.6rem,6.2vw,4.75rem)]"
          >
            {content.titleTop}
            <br />
            <span className="text-sky">{content.titleAccent}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.6 }}
            className="mt-8 max-w-[48ch] text-xl leading-[1.85] text-white/85"
          >
            {content.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.72 }}
            className="mt-11 flex flex-wrap gap-4"
          >
            <Link href={content.primaryHref} className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
              {content.primary}
            </Link>
            <Link
              href={content.secondaryHref}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/40 text-white hover:border-white hover:bg-white/10",
              )}
            >
              {content.secondary}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <span aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-[3px] bg-gold" />
    </section>
  );
}
