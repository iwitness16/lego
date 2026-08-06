import Link from "next/link";

export default function Breadcrumbs({ trail }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-muted">
      {trail.map((crumb, i) => {
        const isLast = i === trail.length - 1;
        return (
          <span key={crumb.href || crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {isLast || !crumb.href ? (
              <span className="font-medium text-ink">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="transition-colors hover:text-brand-700">
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
