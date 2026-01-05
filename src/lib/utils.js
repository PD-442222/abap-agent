export function cn(...values) {
  return values.filter(Boolean).join(' ');
}

export function formatDateString() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}
