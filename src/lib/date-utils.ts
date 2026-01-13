import {
  CalendarDate,
  fromDate,
  getLocalTimeZone,
  toCalendarDate,
  type ZonedDateTime,
} from "@internationalized/date";
import { isValid } from "date-fns";

const DEFAULT_TIMEZONE = "Europe/Amsterdam";

/**
 * Convert a JavaScript Date object to a CalendarDate object
 *
 * @param jsDate - The JavaScript Date object to convert
 * @returns A CalendarDate object representing the same date
 */
export function jsDateToCalendarDate(jsDate: Date): CalendarDate {
  return toCalendarDate(fromDate(jsDate, getLocalTimeZone()));
}

/**
 * Convert a CalendarDate object to a JavaScript Date object
 *
 * @param calendarDate - The CalendarDate object to convert
 * @param timeZone - The time zone to use for conversion (defaults to Europe/Amsterdam)
 * @returns A JavaScript Date object representing the same date
 */
export function calendarDateToJsDate(
  calendarDate: CalendarDate,
  timeZone: string = DEFAULT_TIMEZONE
): Date {
  return calendarDate.toDate(timeZone);
}

/**
 * Convert a JavaScript Date to a ZonedDateTime
 *
 * @param jsDate - The JavaScript Date object to convert
 * @param timeZone - The time zone to use (defaults to Europe/Amsterdam)
 * @returns A ZonedDateTime object
 */
export function jsDateToZonedDateTime(
  jsDate: Date,
  timeZone: string = DEFAULT_TIMEZONE
): ZonedDateTime {
  return fromDate(jsDate, timeZone);
}

/**
 * Convert a ZonedDateTime to a JavaScript Date
 *
 * @param zonedDateTime - The ZonedDateTime object to convert
 * @returns A JavaScript Date object
 */
export function zonedDateTimeToJsDate(zonedDateTime: ZonedDateTime): Date {
  return zonedDateTime.toDate();
}

/**
 * Convert a date string (YYYY-MM-DD) to a CalendarDate
 *
 * @param dateString - The date string in YYYY-MM-DD format
 * @returns A CalendarDate object
 */
export function dateStringToCalendarDate(dateString: string): CalendarDate {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!(year && month && day)) {
    throw new Error(
      `Invalid date string format: ${dateString}. Expected format: YYYY-MM-DD`
    );
  }
  return new CalendarDate(year, month, day);
}

/**
 * Convert a CalendarDate to a date string (YYYY-MM-DD)
 *
 * @param calendarDate - The CalendarDate object to convert
 * @returns A date string in YYYY-MM-DD format
 */
export function calendarDateToDateString(calendarDate: CalendarDate): string {
  return calendarDate.toString();
}

/**
 * Safely convert any date-like value to a CalendarDate
 *
 * @param value - A Date object, number (timestamp), or date string
 * @returns A CalendarDate object or null if conversion fails
 */
export function toCalendarDateSafe(
  value: Date | number | string | undefined | null
): CalendarDate | null {
  if (!value) return null;

  try {
    if (value instanceof Date) {
      return jsDateToCalendarDate(value);
    }

    if (typeof value === "number") {
      return jsDateToCalendarDate(new Date(value));
    }

    if (typeof value === "string") {
      // Handle YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return dateStringToCalendarDate(value);
      }
      // Handle other date string formats
      return jsDateToCalendarDate(new Date(value));
    }

    return null;
  } catch (error) {
    console.warn("Failed to convert value to CalendarDate:", value, error);
    return null;
  }
}

/**
 * Safely convert a CalendarDate to a JavaScript Date
 *
 * @param calendarDate - The CalendarDate to convert
 * @param timeZone - The time zone to use for conversion
 * @returns A JavaScript Date object or null if conversion fails
 */
export function toJsDateSafe(
  calendarDate: CalendarDate | null | undefined,
  timeZone: string = DEFAULT_TIMEZONE
): Date | null {
  if (!calendarDate) return null;

  try {
    return calendarDateToJsDate(calendarDate, timeZone);
  } catch (error) {
    console.warn(
      "Failed to convert CalendarDate to Date:",
      calendarDate,
      error
    );
    return null;
  }
}

/**
 * Parse a Dutch-formatted date input string into a Date object.
 * Supports multiple input formats:
 * - With separators: "02-02-2025", "02/02/2025", "2-2-2025", "2/2/25"
 * - Without separators: "02022025" (8 digits), "2022025" (7 digits), "222025" (6 digits)
 *
 * For 2-digit years: 00-29 → 2000-2029, 30-99 → 1930-1999
 *
 * @param input - The user input string to parse
 * @returns A valid Date object or null if parsing fails
 */
export function parseDutchDateInput(input: string): Date | null {
  if (!input || input.trim() === "") return null;

  const trimmed = input.trim();

  // Check if input contains separators (- or /)
  if (trimmed.includes("-") || trimmed.includes("/")) {
    return parseDateWithSeparators(trimmed);
  }

  // No separators - parse as digits only
  return parseDateWithoutSeparators(trimmed);
}

/**
 * Parse date string with separators (dd-MM-yyyy, dd/MM/yyyy, d-M-yy, etc.)
 */
function parseDateWithSeparators(input: string): Date | null {
  // Split by - or /
  const parts = input.split(/[-/]/);
  if (parts.length !== 3) return null;

  const dayStr = parts[0];
  const monthStr = parts[1];
  const yearStr = parts[2];

  if (!(dayStr && monthStr && yearStr)) return null;

  const day = Number.parseInt(dayStr, 10);
  const month = Number.parseInt(monthStr, 10);
  let year = Number.parseInt(yearStr, 10);

  if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
    return null;
  }

  // Handle 2-digit years
  if (year < 100) {
    year = year <= 29 ? 2000 + year : 1900 + year;
  }

  return createValidDate(day, month, year);
}

/**
 * Parse date string without separators (ddMMyyyy, dMMyyyy, ddMyyyy, dMyyyy)
 * Format assumption: DD MM YYYY (Dutch format)
 */
function parseDateWithoutSeparators(input: string): Date | null {
  // Remove any non-digit characters
  const digits = input.replace(/\D/g, "");

  // Need at least 6 digits (d+m+yyyy) and at most 8 (dd+mm+yyyy)
  if (digits.length < 6 || digits.length > 8) return null;

  // Extract year (always last 4 digits for full year, or last 2 for short year)
  let year: number;
  let remaining: string;

  if (digits.length >= 6) {
    // Check if we have a 4-digit year or 2-digit year
    // Strategy: try 4-digit year first (more common for explicit input)
    if (digits.length >= 6 && digits.length <= 8) {
      // Assume last 4 digits are year if we have 6-8 digits
      const yearStr = digits.slice(-4);
      year = Number.parseInt(yearStr, 10);
      remaining = digits.slice(0, -4);

      // If year seems invalid (like 0202 when user typed 2022025),
      // try treating last 2 as year
      if (year < 1900 || year > 2100) {
        const shortYearStr = digits.slice(-2);
        const shortYear = Number.parseInt(shortYearStr, 10);
        year = shortYear <= 29 ? 2000 + shortYear : 1900 + shortYear;
        remaining = digits.slice(0, -2);
      }
    } else {
      return null;
    }
  } else {
    return null;
  }

  // Now parse day and month from remaining digits (2-4 digits)
  // remaining could be: "dd" + "mm" (4 digits), "d" + "mm" (3 digits),
  // "dd" + "m" (3 digits), or "d" + "m" (2 digits)
  const dayMonth = parseRemainingDayMonth(remaining);
  if (!dayMonth) return null;

  return createValidDate(dayMonth.day, dayMonth.month, year);
}

/**
 * Parse the remaining day+month digits after year extraction
 * Tries different combinations to find a valid date
 */
function parseRemainingDayMonth(
  remaining: string
): { day: number; month: number } | null {
  const len = remaining.length;

  if (len < 2 || len > 4) return null;

  // Generate possible interpretations
  const possibilities: Array<{ day: number; month: number }> = [];

  if (len === 4) {
    // DD MM format
    possibilities.push({
      day: Number.parseInt(remaining.slice(0, 2), 10),
      month: Number.parseInt(remaining.slice(2, 4), 10),
    });
  } else if (len === 3) {
    // Could be D MM or DD M
    possibilities.push({
      day: Number.parseInt(remaining.slice(0, 1), 10),
      month: Number.parseInt(remaining.slice(1, 3), 10),
    });
    possibilities.push({
      day: Number.parseInt(remaining.slice(0, 2), 10),
      month: Number.parseInt(remaining.slice(2, 3), 10),
    });
  } else if (len === 2) {
    // D M format
    possibilities.push({
      day: Number.parseInt(remaining.slice(0, 1), 10),
      month: Number.parseInt(remaining.slice(1, 2), 10),
    });
  }

  // Return first valid combination
  for (const p of possibilities) {
    if (isValidDayMonth(p.day, p.month)) {
      return p;
    }
  }

  return null;
}

/**
 * Check if day and month values are within valid ranges
 */
function isValidDayMonth(day: number, month: number): boolean {
  return day >= 1 && day <= 31 && month >= 1 && month <= 12;
}

/**
 * Create a Date object and validate it's a real date
 * (e.g., rejects 31-02-2025)
 */
function createValidDate(
  day: number,
  month: number,
  year: number
): Date | null {
  // Basic range check
  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > 2100
  ) {
    return null;
  }

  // Create date (month is 0-indexed in JS Date)
  const date = new Date(year, month - 1, day);

  // Validate the date is real by checking if the values match
  // (Date auto-corrects invalid dates, e.g., Feb 31 becomes Mar 3)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  // Double-check with date-fns isValid
  if (!isValid(date)) {
    return null;
  }

  return date;
}

/**
 * Format a Date object to Dutch date string (dd-MM-yyyy)
 *
 * @param date - The Date object to format
 * @returns Formatted string in dd-MM-yyyy format
 */
export function formatDutchDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
