import { format, isoFormat, isoParse, timeFormat, timeParse } from "d3";

/**
 * Format a number with SI prefix (k, M, G, etc.)
 */
export function formatSI(value: number, precision = 2): string {
  return format(`.${precision}s`)(value);
}

/**
 * Format a number with commas as thousands separator
 */
export function formatNumber(value: number, decimals = 0): string {
  return format(`,.${decimals}f`)(value);
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  value: number,
  currency = "$",
  decimals = 2
): string {
  return `${currency}${format(`,.${decimals}f`)(value)}`;
}

/**
 * Format a number as a percentage
 */
export function formatPercent(value: number, decimals = 1): string {
  return format(`.${decimals}%`)(value);
}

/**
 * Format a date with a specified format string
 */
export function formatDate(date: Date, formatStr = "%b %d, %Y"): string {
  return timeFormat(formatStr)(date);
}

/**
 * Format a date as a short date (e.g., "Jan 1")
 */
export function formatShortDate(date: Date): string {
  return timeFormat("%b %d")(date);
}

/**
 * Format a date as a full date (e.g., "January 1, 2024")
 */
export function formatFullDate(date: Date): string {
  return timeFormat("%B %d, %Y")(date);
}

/**
 * Format a date as time (e.g., "14:30")
 */
export function formatTime(date: Date, includeSeconds = false): string {
  return timeFormat(includeSeconds ? "%H:%M:%S" : "%H:%M")(date);
}

/**
 * Format a date as date and time
 */
export function formatDateTime(date: Date): string {
  return timeFormat("%b %d, %Y %H:%M")(date);
}

/**
 * Format a date as ISO string
 */
export function formatISODate(date: Date): string {
  return isoFormat(date);
}

/**
 * Parse a date string into a Date object
 */
export function parseDate(
  dateStr: string,
  formatStr = "%Y-%m-%d"
): Date | null {
  return timeParse(formatStr)(dateStr);
}

/**
 * Parse an ISO date string
 */
export function parseISODate(dateStr: string): Date | null {
  return isoParse(dateStr);
}

/**
 * Format duration in milliseconds to human-readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncateLabel(str: string, maxLength = 20): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Create a tick formatter that abbreviates large numbers
 */
export function createAbbreviatedFormatter(
  decimals = 1
): (value: number) => string {
  return (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1e9) {
      return `${(value / 1e9).toFixed(decimals)}B`;
    }
    if (absValue >= 1e6) {
      return `${(value / 1e6).toFixed(decimals)}M`;
    }
    if (absValue >= 1e3) {
      return `${(value / 1e3).toFixed(decimals)}K`;
    }
    return value.toString();
  };
}

/**
 * Create a formatter that shows ordinal suffixes (1st, 2nd, 3rd, etc.)
 */
export function formatOrdinal(value: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = value % 100;
  return value + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

/**
 * Format a number range
 */
export function formatRange(
  min: number,
  max: number,
  formatter = formatNumber
): string {
  return `${formatter(min)} – ${formatter(max)}`;
}
