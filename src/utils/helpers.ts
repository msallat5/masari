import i18n from 'i18next';

/**
 * Format a date string to a user-friendly format based on the current locale
 */

/**
 * Format a date string to a user-friendly format based on the current locale.
 * ─ Arabic (ar-*) → full Arabic month names, Gregorian calendar (e.g. "٥ أغسطس ٢٠٢٥")
 * ─ Other locales → abbreviated English (e.g. "Aug 5, 2025")
 */
export const formatDate = (
  dateString: string,
  locale: string = i18n.language
): string => {
  try {
    const date = new Date(dateString);
    const isArab = locale.startsWith('ar');

    // Append the "use Gregorian calendar" extension for Arabic.
    // If i18n.language === "ar" or "ar-SA", we become "ar-u-ca-gregory" or "ar-SA-u-ca-gregory"
    const localeTag = isArab
      ? `${locale}-u-ca-gregory`
      : 'en-US';

    return new Intl.DateTimeFormat(localeTag, {
      year: 'numeric',
      month: isArab ? 'long' : 'short',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Calculate the time difference between two dates in days
 */
export const daysBetween = (startDate: string, endDate: string = new Date().toISOString()): number => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating days between:', error);
    return 0;
  }
};

/**
 * Truncate text with ellipsis if it exceeds the character limit
 */
export const truncateText = (text: string, limit: number = 50): string => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

/**
 * Generate a random color based on a string (e.g., for avatars)
 */
export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  
  return color;
}; 