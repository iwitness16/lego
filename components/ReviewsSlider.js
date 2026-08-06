"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { REVIEWS } from "@/lib/reviews";
import { formatDate } from "@/lib/format";

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={i < rating ? "text-stud-dark" : "text-line"}
        >
          <path
            d="M12 2.5l2.9 6.1 6.6.6-5 4.5 1.5 6.6-6-3.5-6 3.5 1.5-6.6-5-4.5 6.6-.6L12 2.5z"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const perView = { base: 1, sm: 2, lg: 3 };
  const maxIndex = REVIEWS.length - 1;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, 4500);
    return () => clearInterval(timerRef.current);
  }, []);

  function manualGo(next) {
    clearInterval(timerRef.current);
    setIndex((next + REVIEWS.length) % REVIEWS.length);
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % REVIEWS.length);
    }, 4500);
  }

  return (
    <section id="reviews" className="bg-brand-50/60 py-16 sm:py-20">
      <div className="container-page">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">From the community</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
              What builders are saying
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() => manualGo(index - 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-brand-300"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next review"
              onClick={() => manualGo(index + 1)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-brand-300"
            >
              ›
            </button>
          </div>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {REVIEWS.map((review) => (
              <div key={review.id} className="w-full shrink-0 px-1.5 sm:w-1/2 sm:px-2 lg:w-1/3">
                <div className="flex h-full flex-col gap-4 rounded-xl2 border border-line bg-white p-6 shadow-card">
                  <Stars rating={review.rating} />
                  <p className="text-sm leading-relaxed text-ink-soft">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
                    <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-paper">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{review.name}</p>
                      <p className="text-xs text-ink-muted">
                        {review.location} · {formatDate(review.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-1.5">
          {REVIEWS.map((review, i) => (
            <button
              key={review.id}
              type="button"
              aria-label={`Go to review ${i + 1}`}
              onClick={() => manualGo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-brand-600" : "w-1.5 bg-brand-200"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
