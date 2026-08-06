import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="stud-tag bg-brand-50">404</p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        This brick isn&apos;t in the bin
      </h1>
      <p className="max-w-sm text-sm text-ink-muted">
        The page you&apos;re looking for doesn&apos;t exist. Try browsing sets
        and minifigures by theme instead.
      </p>
      <div className="mt-2 flex gap-3">
        <Link href="/sets" className="btn-primary">
          Shop sets
        </Link>
        <Link href="/minifigures" className="btn-outline">
          Shop minifigures
        </Link>
      </div>
    </div>
  );
}
