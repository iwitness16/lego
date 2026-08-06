import Link from "next/link";

export default function Pagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function hrefFor(page) {
    return page === 1 ? basePath : `${basePath}?page=${page}`;
  }

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      <Link
        href={hrefFor(Math.max(1, currentPage - 1))}
        aria-disabled={currentPage === 1}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm ${
          currentPage === 1
            ? "pointer-events-none opacity-40"
            : "hover:border-brand-300 hover:text-brand-700"
        }`}
      >
        ‹
      </Link>
      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(page)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
            page === currentPage
              ? "border-ink bg-ink text-white"
              : "border-line text-ink-soft hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        aria-disabled={currentPage === totalPages}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm ${
          currentPage === totalPages
            ? "pointer-events-none opacity-40"
            : "hover:border-brand-300 hover:text-brand-700"
        }`}
      >
        ›
      </Link>
    </nav>
  );
}
