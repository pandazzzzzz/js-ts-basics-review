// TypeScript vs JavaScript: Date and Time Comparison
// 📘 For JavaScript examples, see: 12-date-time.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
// 🎯 Difficulty: Beginner
export {};

// ============================================================================
// 1. DATE TYPE ANNOTATIONS
// ============================================================================

// JavaScript: No type information
// const now = new Date(); // Type is Date object, no compile-time checking

// TypeScript: Explicit Date type annotation
const now: Date = new Date();
console.log("=== Date Type Annotations ===");
console.log("Current date:", now);

// Function with Date return type
function getCurrentDate(): Date {
  return new Date();
}

// Function with Date parameter
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

console.log("Formatted:", formatDate(getCurrentDate()));

// ⚠️ PITFALL: Date.parse returns number (timestamp), not Date
const timestamp: number = Date.parse("2024-06-15");
console.log("Timestamp:", timestamp);

// ✅ CORRECT: Create Date from timestamp
const parsedDate: Date = new Date(timestamp);
console.log("Parsed date:", parsedDate);

// ============================================================================
// 2. TYPE-SAFE DATE FUNCTIONS
// ============================================================================

// JavaScript: No parameter or return type checking
// function addDays(date, days) { ... }

// TypeScript: Fully typed date operations
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getDiffInDays(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((date2.getTime() - date1.getTime()) / msPerDay);
}

console.log("\n=== Type-Safe Date Functions ===");
const baseDate = new Date("2024-06-15");
console.log("Base date:", formatDate(baseDate));
console.log("+ 7 days:", formatDate(addDays(baseDate, 7)));
console.log("+ 3 months:", formatDate(addMonths(baseDate, 3)));
console.log("Days until 2024-12-31:", getDiffInDays(baseDate, new Date("2024-12-31")));

// Type-safe date comparison
function isBefore(date1: Date, date2: Date): boolean {
  return date1.getTime() < date2.getTime();
}

function isAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

function isSameDay(date1: Date, date2: Date): boolean {
  return formatDate(date1) === formatDate(date2);
}

const date1 = new Date("2024-06-15");
const date2 = new Date("2024-06-16");
console.log("\nDate comparisons:");
console.log("Is before:", isBefore(date1, date2));
console.log("Is after:", isAfter(date1, date2));
console.log("Is same day:", isSameDay(date1, new Date("2024-06-15")));

// ============================================================================
// 3. BRANDED TYPES FOR TYPE-SAFE TIMESTAMPS
// ============================================================================

// JavaScript: Numbers are just numbers
// const timestamp = 1718447400000; // Could be any number

// TypeScript: Branded types distinguish semantically different numbers
type Timestamp = number & { readonly brand: unique symbol };
type UnixTimestamp = number & { readonly unixBrand: unique symbol };
type Milliseconds = number & { readonly msBrand: unique symbol };

// Constructor functions for branded types
function createTimestamp(ms: number): Timestamp {
  return ms as Timestamp;
}

function createUnixTimestamp(seconds: number): UnixTimestamp {
  return seconds as UnixTimestamp;
}

// Type-safe conversion functions
function toUnixTimestamp(ms: Timestamp): UnixTimestamp {
  return createUnixTimestamp(Math.floor(ms / 1000));
}

function fromUnixTimestamp(seconds: UnixTimestamp): Timestamp {
  return createTimestamp(seconds * 1000);
}

console.log("\n=== Branded Types for Timestamps ===");
const ts: Timestamp = createTimestamp(Date.now());
const unix: UnixTimestamp = toUnixTimestamp(ts);
console.log("Millisecond timestamp:", ts);
console.log("Unix timestamp:", unix);

// ✅ BENEFIT: Can't accidentally mix different timestamp types
// const wrong: UnixTimestamp = ts; // ❌ Error: Types not compatible

// ============================================================================
// 4. BRANDED TYPES FOR ISO DATE STRINGS
// ============================================================================

type ISODateString = string & { readonly isoBrand: unique symbol };
type ISODateTimeString = string & { readonly isoDateTimeBrand: unique symbol };

// Validated constructors
function createISODate(str: string): ISODateString {
  // Validate format: YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    throw new Error(`Invalid ISO date format: ${str}`);
  }
  return str as ISODateString;
}

function createISODateTime(str: string): ISODateTimeString {
  // Validate ISO datetime format
  const date = new Date(str);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ISO datetime format: ${str}`);
  }
  return str as ISODateTimeString;
}

// Type-safe conversion
function dateToISODate(date: Date): ISODateString {
  return createISODate(date.toISOString().split("T")[0]);
}

function isoDateToDate(iso: ISODateString): Date {
  return new Date(iso);
}

console.log("\n=== Branded ISO Date Strings ===");
const isoDate: ISODateString = createISODate("2024-06-15");
const isoDateTime: ISODateTimeString = createISODateTime("2024-06-15T10:30:00.000Z");
console.log("ISO date:", isoDate);
console.log("ISO datetime:", isoDateTime);

// Parse ISO string back to Date
const parsedFromISO = isoDateToDate(isoDate);
console.log("Parsed from ISO:", parsedFromISO);

// ============================================================================
// 5. UTILITY TYPES FOR DATE OPERATIONS
// ============================================================================

// Date range type
type DateRange = {
  start: Date;
  end: Date;
};

// Date interval type
type DateInterval = {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
};

// Type for date precision
type DatePrecision = "year" | "month" | "day" | "hour" | "minute" | "second" | "millisecond";

// Date part type
type DatePart =
  | { type: "year"; value: number }
  | { type: "month"; value: number }
  | { type: "day"; value: number }
  | { type: "hour"; value: number }
  | { type: "minute"; value: number }
  | { type: "second"; value: number };

console.log("\n=== Utility Types ===");

function createDateRange(start: Date, end: Date): DateRange {
  if (isAfter(start, end)) {
    throw new Error("Start date must be before end date");
  }
  return { start, end };
}

function isDateInRange(date: Date, range: DateRange): boolean {
  return !isBefore(date, range.start) && !isAfter(date, range.end);
}

const range = createDateRange(new Date("2024-01-01"), new Date("2024-12-31"));
const testDate = new Date("2024-06-15");
console.log("Date range:", {
  start: formatDate(range.start),
  end: formatDate(range.end),
});
console.log("Is in range:", isDateInRange(testDate, range));

// ============================================================================
// 6. TYPE-SAFE DATE ARITHMETIC
// ============================================================================

// JavaScript: Manual calculations, error-prone
// const diff = date2 - date1; // Returns milliseconds

// TypeScript: Type-safe arithmetic with clear return types
function addInterval(date: Date, interval: DateInterval): Date {
  const result = new Date(date);
  if (interval.years) result.setFullYear(result.getFullYear() + interval.years);
  if (interval.months) result.setMonth(result.getMonth() + interval.months);
  if (interval.days) result.setDate(result.getDate() + interval.days);
  if (interval.hours) result.setHours(result.getHours() + interval.hours);
  if (interval.minutes) result.setMinutes(result.getMinutes() + interval.minutes);
  if (interval.seconds) result.setSeconds(result.getSeconds() + interval.seconds);
  return result;
}

function getDatePart(date: Date, part: DatePrecision): number {
  switch (part) {
    case "year":
      return date.getFullYear();
    case "month":
      return date.getMonth() + 1; // 1-indexed
    case "day":
      return date.getDate();
    case "hour":
      return date.getHours();
    case "minute":
      return date.getMinutes();
    case "second":
      return date.getSeconds();
    case "millisecond":
      return date.getMilliseconds();
    default:
      throw new Error(`Unknown date part: ${part}`);
  }
}

function setDatePart(date: Date, part: DatePart): Date {
  const result = new Date(date);
  switch (part.type) {
    case "year":
      result.setFullYear(part.value);
      break;
    case "month":
      result.setMonth(part.value - 1);
      break; // 0-indexed internally
    case "day":
      result.setDate(part.value);
      break;
    case "hour":
      result.setHours(part.value);
      break;
    case "minute":
      result.setMinutes(part.value);
      break;
    case "second":
      result.setSeconds(part.value);
      break;
  }
  return result;
}

console.log("\n=== Type-Safe Date Arithmetic ===");
const base = new Date("2024-06-15T10:30:00");

const withInterval = addInterval(base, { years: 1, months: 2, days: 3 });
console.log("Base date:", base);
console.log("+ 1 year, 2 months, 3 days:", withInterval);

console.log("\nDate parts from", formatDate(base), ":");
console.log("  Year:", getDatePart(base, "year"));
console.log("  Month:", getDatePart(base, "month"));
console.log("  Day:", getDatePart(base, "day"));

const modified = setDatePart(base, { type: "day", value: 25 });
console.log("\nWith day set to 25:", formatDate(modified));

// ============================================================================
// 7. DATE VALIDATION TYPES
// ============================================================================

type ValidDate = Date & { readonly validBrand: unique symbol };
type FutureDate = Date & { readonly futureBrand: unique symbol };
type PastDate = Date & { readonly pastBrand: unique symbol };

// Validation functions that return branded types
function createValidDate(date: Date): ValidDate | null {
  if (isNaN(date.getTime())) {
    return null;
  }
  return date as ValidDate;
}

function createFutureDate(date: Date): FutureDate | null {
  if (isNaN(date.getTime()) || date.getTime() <= Date.now()) {
    return null;
  }
  return date as FutureDate;
}

function createPastDate(date: Date): PastDate | null {
  if (isNaN(date.getTime()) || date.getTime() >= Date.now()) {
    return null;
  }
  return date as PastDate;
}

// Functions that require validated dates
function scheduleEvent(date: FutureDate, name: string): void {
  console.log(`Scheduled "${name}" for ${date.toISOString()}`);
}

function recordHistory(date: PastDate, event: string): void {
  console.log(`Recorded "${event}" from ${date.toISOString()}`);
}

console.log("\n=== Date Validation Types ===");
const valid = createValidDate(new Date("2024-06-15"));
const invalid = createValidDate(new Date("invalid"));
console.log("Valid date:", valid ? "yes" : "no");
console.log("Invalid date:", invalid ? "yes" : "no");

const future = createFutureDate(new Date(Date.now() + 86400000)); // Tomorrow
if (future) {
  scheduleEvent(future, "Team Meeting");
}

const past = createPastDate(new Date("2020-01-01"));
if (past) {
  recordHistory(past, "Project started");
}

// ============================================================================
// 8. TIMEZONE-AWARE TYPES
// ============================================================================

type UTCDate = Date & { readonly utcBrand: unique symbol };
type LocalDate = Date & { readonly localBrand: unique symbol };

function createUTCDate(year: number, month: number, day: number): UTCDate {
  return new Date(Date.UTC(year, month - 1, day)) as UTCDate;
}

function toUTCDate(localDate: Date): UTCDate {
  const utc = new Date(localDate.getTime() + localDate.getTimezoneOffset() * 60000);
  return utc as UTCDate;
}

function formatInTimezone(date: Date, timezone: string): string {
  return date.toLocaleString("en-US", { timeZone: timezone });
}

console.log("\n=== Timezone-Aware Types ===");
const utcDate: UTCDate = createUTCDate(2024, 6, 15);
console.log("UTC date:", utcDate.toISOString());

const shanghaiTime = formatInTimezone(new Date(), "Asia/Shanghai");
const nyTime = formatInTimezone(new Date(), "America/New_York");
console.log("Current time in Shanghai:", shanghaiTime);
console.log("Current time in New York:", nyTime);

// ============================================================================
// 9. DATE FORMATTING TYPES
// ============================================================================

type DateFormat =
  | "ISO" // 2024-06-15
  | "ISO_DATETIME" // 2024-06-15T10:30:00.000Z
  | "LOCALE_DATE" // 6/15/2024
  | "LOCALE_DATETIME" // 6/15/2024, 10:30:00 AM
  | "CUSTOM";

interface FormatOptions {
  format: DateFormat;
  locale?: string;
  timezone?: string;
  customPattern?: string;
}

function formatDateTyped(date: Date, options: FormatOptions): string {
  switch (options.format) {
    case "ISO":
      return date.toISOString().split("T")[0];
    case "ISO_DATETIME":
      return date.toISOString();
    case "LOCALE_DATE":
      return date.toLocaleDateString(options.locale || "en-US", {
        timeZone: options.timezone,
      });
    case "LOCALE_DATETIME":
      return date.toLocaleString(options.locale || "en-US", {
        timeZone: options.timezone,
      });
    case "CUSTOM":
      // Custom pattern implementation would go here
      return date.toString();
    default:
      throw new Error(`Unknown format: ${options.format}`);
  }
}

console.log("\n=== Date Formatting Types ===");
const sampleDate = new Date("2024-06-15T10:30:00Z");
console.log("ISO format:", formatDateTyped(sampleDate, { format: "ISO" }));
console.log("ISO datetime:", formatDateTyped(sampleDate, { format: "ISO_DATETIME" }));
console.log("Locale date:", formatDateTyped(sampleDate, { format: "LOCALE_DATE" }));
console.log("Locale datetime:", formatDateTyped(sampleDate, { format: "LOCALE_DATETIME" }));

// ============================================================================
// 10. GENERIC DATE HELPERS
// ============================================================================

// Generic date cache with typed keys
class DateCache<TKey> {
  private cache = new Map<string, Date>();

  get(key: TKey): Date | undefined {
    return this.cache.get(JSON.stringify(key));
  }

  set(key: TKey, date: Date): void {
    this.cache.set(JSON.stringify(key), date);
  }
}

// Typed date comparator
function createDateComparator<T>(extractFn: (item: T) => number): (a: T, b: T) => number {
  return (a, b) => extractFn(a) - extractFn(b);
}

interface Event {
  id: string;
  name: string;
  scheduledDate: Date;
}

const events: Event[] = [
  { id: "1", name: "Event A", scheduledDate: new Date("2024-06-20") },
  { id: "2", name: "Event B", scheduledDate: new Date("2024-06-10") },
  { id: "3", name: "Event C", scheduledDate: new Date("2024-06-15") },
];

const byDate = createDateComparator<Event>(e => e.scheduledDate.getTime());
const sortedEvents = [...events].sort(byDate);

console.log("\n=== Generic Date Helpers ===");
console.log("Sorted events:");
sortedEvents.forEach(e => console.log(`  ${e.name}: ${formatDate(e.scheduledDate)}`));

// ============================================================================
// 11. COMMON PITFALLS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Month is 0-indexed
console.log("\nPitfall 1 - Month Index:");
const january = new Date(2024, 0, 1); // 0 = January
const december = new Date(2024, 11, 1); // 11 = December
console.log("January:", formatDate(january));
console.log("December:", formatDate(december));

// ✅ SOLUTION: Use constants or helper functions
const Months = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
} as const;

const juneDate = new Date(2024, Months.June, 15);
console.log("Using constant:", formatDate(juneDate));

// PITFALL 2: Date mutability
console.log("\nPitfall 2 - Date Mutability:");
const originalDate = new Date("2024-06-15");
const mutatedDate = originalDate;
mutatedDate.setDate(20); // Mutates originalDate too!
console.log("Original after mutation:", formatDate(originalDate));

// ✅ SOLUTION: Always create new Date instances
function cloneDate(date: Date): Date {
  return new Date(date.getTime());
}

const safeOriginal = new Date("2024-06-15");
const safeCopy = cloneDate(safeOriginal);
safeCopy.setDate(20);
console.log("Safe original:", formatDate(safeOriginal));
console.log("Safe copy:", formatDate(safeCopy));

// PITFALL 3: Timezone parsing issues
console.log("\nPitfall 3 - Timezone Parsing:");
const noTimezone = new Date("2024-06-15"); // May be parsed as UTC
console.log("No timezone:", noTimezone.toString());

const withTimezone = new Date("2024-06-15T00:00:00+08:00"); // Explicit timezone
console.log("With timezone:", withTimezone.toString());

// ✅ SOLUTION: Always use ISO 8601 format with timezone
function parseISODateSafe(isoString: string): Date | null {
  const date = new Date(isoString);
  return isNaN(date.getTime()) ? null : date;
}

// PITFALL 4: Date comparison using ===
console.log("\nPitfall 4 - Date Comparison:");
const dateA = new Date("2024-06-15");
const dateB = new Date("2024-06-15");
console.log("dateA === dateB:", dateA === dateB); // false (different objects)
console.log("getTime() comparison:", dateA.getTime() === dateB.getTime()); // true

// ✅ SOLUTION: Compare timestamps
function datesEqual(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}

// PITFALL 5: Automatic rollover
console.log("\nPitfall 5 - Automatic Rollover:");
const rollover = new Date(2024, 1, 30); // Feb 30 doesn't exist
rollover.setMonth(1); // Setting month again
rollover.setDate(30); // Rolls over to March
console.log("Rollover result:", formatDate(rollover));

// ============================================================================
// 12. BEST PRACTICES SUMMARY
// ============================================================================

/*
✅ DO:
1. Use branded types (Timestamp, ISODateString) for type-safe date identifiers
2. Create immutable date functions that return new Date instances
3. Use explicit Date type annotations for function parameters and returns
4. Implement validation functions that return branded types or null
5. Use discriminated unions for different date formats/precisions
6. Create utility types (DateRange, DateInterval) for domain concepts
7. Always handle invalid dates (isNaN check)
8. Use constants for month indices to avoid 0-index confusion
9. Include timezone information in stored/transmitted dates
10. Compare dates using getTime(), not === or valueOf()

❌ DON'T:
1. Mutate Date parameters directly (violates pure function principles)
2. Rely on implicit Date conversion in comparisons
3. Parse date strings without validation
4. Mix different timestamp units (seconds vs milliseconds)
5. Forget that month is 0-indexed in Date constructor
6. Use == or === to compare Date objects (compares references)
7. Ignore timezone differences in date calculations
8. Use bare numbers for timestamps without branded types
9. Assume Date.parse() handles all formats consistently
10. Create dates from user input without validation

⚠️ WATCH OUT FOR:
1. Date mutability - always clone before modifying
2. Month index (0-11 vs 1-12)
3. Timezone offsets and DST changes
4. Automatic date rollover (Feb 30 -> Mar 2)
5. Precision loss when converting between timestamp units
6. String date parsing inconsistencies across browsers/runtimes
7. UTC vs local time confusion
8. Leap year calculations
9. Invalid Date objects (isNaN(date.getTime()))
10. Performance.now() vs Date.now() precision differences

🎯 MIGRATION TIPS: JS → TS
1. Add Date type annotations to all date parameters
2. Introduce branded types for timestamps and ISO strings
3. Replace date mutations with immutable helper functions
4. Add validation functions that return null for invalid dates
5. Use discriminated unions for date precision levels
6. Create DateRange and DateInterval types for business logic
7. Replace == date comparisons with getTime() comparisons
8. Add explicit timezone handling
9. Use utility types to document date constraints
10. Enable strictNullChecks for better date safety

📘 SUMMARY: TYPESCRIPT BENEFITS FOR DATES
✅ Branded types prevent mixing different timestamp formats
✅ Compile-time validation of date function contracts
✅ Type-safe date arithmetic with clear input/output types
✅ Discriminated unions for different date formats
✅ Self-documenting code with Date type annotations
✅ Catch date-related errors at compile time
✅ Better refactoring support across the codebase
✅ Type-safe date validation and parsing

⚠️ Runtime behavior still follows JavaScript Date quirks
⚠️ Type system can't prevent all date-related logic errors
⚠️ Timezone handling remains complex regardless of types

🎯 RECOMMENDATION: Use TypeScript with date-fns or Luxon for production!
*/

// ============================================================================
// 13. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript Date & Time ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Basic Date operations      │       ✓         │       ✓         │
│ Type annotations           │       ✗         │       ✓         │
│ Branded types              │       ✗         │       ✓         │
│ Timestamp type safety      │       ✗         │       ✓         │
│ Date validation types      │       ✗         │       ✓         │
│ Utility types              │       ✗         │       ✓         │
│ Type-safe arithmetic       │       ✗         │       ✓         │
│ Discriminated unions       │       ✗         │       ✓         │
│ Compile-time checking      │       ✗         │       ✓         │
│ IDE autocomplete           │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds compile-time type safety to Date operations
2. Branded types distinguish semantically different timestamps
3. Type annotations document expected date formats
4. Validation functions can return branded types for safety
5. Utility types model domain concepts like DateRange
6. Runtime behavior follows JavaScript Date quirks
7. Types are erased at compile time
8. Use TypeScript with date-fns or Temporal API for best results
`);

console.log("\n=== TypeScript provides type safety at compile time ===");
console.log("=== But runtime behavior follows JavaScript rules ===");
console.log("=== Consider using date-fns or Temporal API for complex date handling ===");
