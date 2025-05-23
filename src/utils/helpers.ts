import i18n from 'i18next';

/**
 * Format a date string to a user-friendly format based on locale.
 *
 * - Arabic locales (ar-*) → full month names in Arabic (Gregorian calendar),
 *   e.g. "٥ أغسطس ٢٠٢٥"
 * - Other locales → abbreviated English month names,
 *   e.g. "Aug 5, 2025"
 */
export function formatDate(
  dateString: string,
  locale: string = i18n.language
): string {
  try {
    const date = new Date(dateString);
    const isArabic = locale.startsWith('ar');
    // Force Gregorian calendar for Arabic
    const localeTag = isArabic ? `${locale}-u-ca-gregory` : 'en-US';

    return new Intl.DateTimeFormat(localeTag, {
      year: 'numeric',
      month: isArabic ? 'long' : 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('formatDate error:', error);
    return dateString;
  }
}

/**
 * Calculate the number of days between two ISO dates.
 * Rounds up to the next whole day. Defaults endDate to now.
 */
export function daysBetween(
  startDate: string,
  endDate: string = new Date().toISOString()
): number {
  try {
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diffMs = Math.abs(endMs - startMs);
    const days = diffMs / (1000 * 60 * 60 * 24);
    return Math.ceil(days);
  } catch (error) {
    console.error('daysBetween error:', error);
    return 0;
  }
}

/**
 * Return a human-friendly "time ago" string for an ISO date.
 * Examples: "just now", "5 minutes ago", "yesterday", "3 weeks ago", etc.
 */
export function timeAgo(isoDate: string): string {
  const nowMs = Date.now();
  const thenMs = new Date(isoDate).getTime();
  const diffMs = nowMs - thenMs;

  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

  const days = daysBetween(isoDate);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

/**
 * Truncate a string to a given character limit, appending "..." if truncated.
 */
export function truncateText(text: string, limit = 50): string {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

/**
 * Get up to two uppercase initials from a full name.
 * E.g. "John Doe" → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

/**
 * Generate a deterministic hex color string from any input string.
 * Useful for avatar backgrounds, tags, etc.
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (const char of str) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }

  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }
  return color;
}
