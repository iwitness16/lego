import Link from "next/link";

export default function SectionHeading({ eyebrow, title, description, href, linkLabel }) {
  return (
    <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div className="max-w-xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm text-ink-muted sm:text-base">{description}</p>
        )}
      </div>
      {href && (
        <Link href={href} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600">
          {linkLabel}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </div>
  );
}
