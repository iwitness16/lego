// Pulls the first USD figure out of a raw RRP string like "£54.99, $59.99, €59.99".
// Falls back gracefully when USD isn't present in the source data.
export function usdPrice(rrpRaw) {
  if (!rrpRaw) return null;
  const match = rrpRaw.match(/\$\s?([\d,]+\.\d{2}|\d+)/);
  if (match) return Number(match[1].replace(/,/g, ""));
  const anyMatch = rrpRaw.match(/([\d,]+\.\d{2})/);
  if (anyMatch) return Number(anyMatch[1].replace(/,/g, ""));
  return null;
}

export function formatUSD(amount) {
  if (amount === null || amount === undefined) return "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
