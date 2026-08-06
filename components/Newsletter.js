"use client";

import { useState } from "react";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div
      id="newsletter"
      className="rounded-xl2 bg-brand-800 px-6 py-9 text-white sm:px-10 sm:py-11"
    >
      <div className="grid gap-6 sm:grid-cols-[1.2fr,1fr] sm:items-center sm:gap-10">
        <div>
          <p className="eyebrow text-stud">New arrivals, weekly</p>
          <h3 className="mt-2 font-display text-2xl font-semibold sm:text-[1.7rem]">
            Get new sets &amp; minifigures before they sell out
          </h3>
          <p className="mt-2 max-w-md text-sm text-brand-100">
            One friendly email a week — restocks, exclusive drops, and
            builder tips. No spam, unsubscribe anytime.
          </p>
        </div>
        {submitted ? (
          <p className="rounded-full bg-white/10 px-5 py-3 text-sm font-medium">
            You&apos;re in! Check your inbox to confirm.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-brand-200 focus:outline-none focus:ring-2 focus:ring-stud"
            />
            <button type="submit" className="btn-accent shrink-0">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
