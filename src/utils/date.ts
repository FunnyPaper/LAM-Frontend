import { format as formatDate } from 'date-fns';

/**
 * Standard date format used across the frontend application.
 * Format: yyyy/MM/dd HH:mm (e.g., 2024/01/15 14:30)
 */
export const DATE_FORMAT = 'yyyy/MM/dd HH:mm';

/**
 * Standard date format with seconds.
 * Format: yyyy/MM/dd HH:mm:ss (e.g., 2024/01/15 14:30:45)
 */
export const DATE_FORMAT_WITH_SECONDS = 'yyyy/MM/dd HH:mm:ss';

/**
 * Formats a date string or Date object using the standard date format.
 * @param date - The date to format (string or Date object)
 * @param dateFormat - Optional custom format string (defaults to DATE_FORMAT)
 * @returns Formatted date string, or undefined if input is invalid
 */
export const formatDateValue = (
  date: string | Date | undefined | null,
  dateFormat: string = DATE_FORMAT
): string | undefined => {
  if (!date) {
    return undefined;
  }
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return undefined;
  }
  return formatDate(dateObj, dateFormat);
};

/**
 * Formats a date string or Date object using the standard date format (yyyy/MM/dd HH:mm).
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string, or undefined if input is invalid
 */
export const formatShortDate = (date: string | Date | undefined | null): string | undefined => {
  return formatDateValue(date, DATE_FORMAT);
};

/**
 * Formats a date string or Date object using the standard date format with seconds (yyyy/MM/dd HH:mm:ss).
 * @param date - The date to format (string or Date object)
 * @returns Formatted date string, or undefined if input is invalid
 */
export const formatLongDate = (date: string | Date | undefined | null): string | undefined => {
  return formatDateValue(date, DATE_FORMAT_WITH_SECONDS);
};
