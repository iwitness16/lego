"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SLIDE_COUNT = 8;
const AUTOPLAY_MS = 5500;

const SLIDES = Array.from({ length: SLIDE_COUNT }, (_, i) => ({
  src: `/hero${i + 1}.jpg`,
  alt: `LegoBricksLink featured build ${i + 1}`,
}));

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const goTo = useCallback((next) => {
    setIndex((next + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDE_COUNT);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  function pauseAndRun(fn) {
    clearInterval(timerRef.current);
    fn();
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDE_COUNT);
    }, AUTOPLAY_MS);
  }

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-700 ease-out"
            style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />
          </div>
        ))}

        <div className="container-page relative z-10 flex h-full items-end pb-14 sm:items-center sm:pb-0">
          <div className="max-w-xl rounded-xl2 bg-white/10 p-6 backdrop-blur-md sm:p-8">
            <p className="eyebrow text-stud">Themed, catalogued, ready to build</p>
            <h1 className="mt-3 font-display text-3xl font-semibold leading-[1.1] text-white sm:text-4xl lg:text-[2.75rem]">
              Every LEGO® theme, one clean catalog
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
              From Icons book nooks to Formula 1 pit stops — browse sets and
              minifigures by theme and subtheme, with real spec sheets on
              every listing.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/sets" className="btn-accent">
                Shop Sets
              </Link>
              <Link
                href="/minifigures"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/15"
              >
                Shop Minifigures
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => pauseAndRun(() => goTo(index - 1))}
        className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30 sm:flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => pauseAndRun(() => goTo(index + 1))}
        className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30 sm:flex"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-6">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => pauseAndRun(() => goTo(i))}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-stud" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
