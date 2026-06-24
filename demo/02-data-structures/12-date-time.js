// Date and Time - Complete Demo
// 📘 For TypeScript comparison, see: 12-date-time-ts-comparison.ts
// 📘 javascript.info: "Date and time"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
// 📌 ES1 (Date object), ES5 (Date.now(), Date.parse(), Date.UTC())

// ============================================
// Section 1: Date Object Creation
// ============================================

console.log("Date Object Creation:");

// new Date() - Current date and time
const now = new Date();
console.log("  new Date():", now);

// Date.now() - Current timestamp (milliseconds)
// ES5, better performance than new Date().getTime()
const timestamp = Date.now();
console.log("  Date.now():", timestamp);

// Date.parse() - Parse date string to timestamp
// - Supports ISO 8601 format
// - Returns milliseconds, NaN for invalid dates
const parsedMs = Date.parse("2024-06-15T10:30:00Z");
console.log("  Date.parse('2024-06-15T10:30:00Z'):", parsedMs);

// Create from timestamp
const fromTimestamp = new Date(1718447400000);
console.log("  new Date(1718447400000):", fromTimestamp);

// Create from date string
const fromString = new Date("June 15, 2024 10:30:00");
console.log("  new Date('June 15, 2024 10:30:00'):", fromString);

// Create from year, month, day, hour, minute, second, millisecond (local timezone)
// Parameters: year, month(0-11), day(1-31), hours(0-23), minutes(0-59), seconds(0-59), ms(0-999)
const fromParts = new Date(2024, 5, 15, 10, 30, 0, 0);
console.log("  new Date(2024, 5, 15, 10, 30, 0, 0):", fromParts);
console.log("  Note: Month is 0-indexed, 5 means June");

// Date.UTC() - Create UTC timestamp
// Returns milliseconds, use with new Date()
const utcTimestamp = Date.UTC(2024, 5, 15, 10, 30, 0);
const utcDate = new Date(utcTimestamp);
console.log("  Date.UTC(2024, 5, 15, 10, 30, 0):", utcTimestamp);
console.log("  new Date(utcTimestamp):", utcDate);

// ============================================
// Section 2: Getting Date Components
// ============================================

console.log("\nGetting Date Components:");

const date = new Date("2024-06-15T10:30:45.123");

// getFullYear() - Four-digit year
console.log("  getFullYear():", date.getFullYear()); // 2024

// getMonth() - Month (0-11)
// ⚠️ Pitfall: 0=January, 11=December
console.log("  getMonth():", date.getMonth()); // 5 (June)
console.log("  Actual month:", date.getMonth() + 1); // 6

// getDate() - Day of month (1-31)
console.log("  getDate():", date.getDate()); // 15

// getDay() - Day of week (0-6)
// 0=Sunday, 1=Monday, ..., 6=Saturday
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
console.log("  getDay():", date.getDay(), `(${days[date.getDay()]})`); // 6 (Saturday)

// Utility function: Format date
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
console.log("  Formatted date:", formatDate(date)); // 2024-06-15

// ============================================
// Section 3: Getting Time Components
// ============================================

console.log("\nGetting Time Components:");

// getHours() - Hour (0-23)
console.log("  getHours():", date.getHours()); // 10

// getMinutes() - Minute (0-59)
console.log("  getMinutes():", date.getMinutes()); // 30

// getSeconds() - Second (0-59)
console.log("  getSeconds():", date.getSeconds()); // 45

// getMilliseconds() - Millisecond (0-999)
console.log("  getMilliseconds():", date.getMilliseconds()); // 123

// getTime() - Timestamp (milliseconds)
console.log("  getTime():", date.getTime()); // 1718447445123

// Utility function: Format time
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
console.log("  Formatted time:", formatTime(date)); // 10:30:45

// Utility function: Format date and time
function formatDateTime(date) {
  return `${formatDate(date)} ${formatTime(date)}`;
}
console.log("  Formatted datetime:", formatDateTime(date));

// ============================================
// Section 4: Setting Date/Time
// ============================================

console.log("\nSetting Date/Time:");

const setDate = new Date(2024, 0, 1); // 2024-01-01
console.log("  Original date:", formatDate(setDate));

// setFullYear() - Set year
setDate.setFullYear(2025);
console.log("  setFullYear(2025):", formatDate(setDate));

// setMonth() - Set month (0-11)
setDate.setMonth(5); // June
console.log("  setMonth(5):", formatDate(setDate));

// setDate() - Set day of month
setDate.setDate(20);
console.log("  setDate(20):", formatDate(setDate));

// Auto-carry example
const autoCarry = new Date(2024, 1, 28); // 2024-02-28
autoCarry.setDate(30); // Feb doesn't have 30 days, auto-carries to March
console.log("  Auto-carry (Feb 28 + 2 days):", formatDate(autoCarry)); // 2024-03-01

// setHours() - Set hour
const setTime = new Date(2024, 5, 15, 10, 30, 0);
console.log("\n  Original time:", formatTime(setTime));

setTime.setHours(14);
console.log("  setHours(14):", formatTime(setTime));

setTime.setMinutes(45);
console.log("  setMinutes(45):", formatTime(setTime));

setTime.setSeconds(30);
console.log("  setSeconds(30):", formatTime(setTime));

// setTime() - Set timestamp
const newTime = new Date();
newTime.setTime(1718447400000);
console.log("  setTime(1718447400000):", formatDateTime(newTime));

// ============================================
// Section 5: UTC Methods
// ============================================

console.log("\nUTC Methods:");

const utcDate2 = new Date(Date.UTC(2024, 5, 15, 10, 30, 0));
console.log("  UTC date:", utcDate2);

// getUTCFullYear() - UTC year
console.log("  getUTCFullYear():", utcDate2.getUTCFullYear());

// getUTCMonth() - UTC month (0-11)
console.log("  getUTCMonth():", utcDate2.getUTCMonth());

// getUTCDate() - UTC day of month
console.log("  getUTCDate():", utcDate2.getUTCDate());

// getUTCHours() - UTC hour
console.log("  getUTCHours():", utcDate2.getUTCHours());

// getUTCMinutes() - UTC minute
console.log("  getUTCMinutes():", utcDate2.getUTCMinutes());

// setUTC* methods - Set UTC time
const setUtc = new Date();
setUtc.setUTCHours(12, 0, 0, 0);
console.log("  setUTCHours(12, 0, 0, 0):", formatTime(setUtc));

// Local time vs UTC time
console.log("\n  Local Time vs UTC:");
const localDate = new Date();
console.log("    Local:", localDate.toLocaleString("en-US"));
console.log("    UTC:", localDate.toUTCString());

// ============================================
// Section 6: Date Formatting
// ============================================

console.log("\nDate Formatting:");

const fmtDate = new Date("2024-06-15T10:30:45.123");

// toDateString() - Date portion
console.log("  toDateString():", fmtDate.toDateString()); // Sat Jun 15 2024

// toTimeString() - Time portion
console.log("  toTimeString():", fmtDate.toTimeString()); // 10:30:45 GMT+0800

// toISOString() - ISO 8601 format
console.log("  toISOString():", fmtDate.toISOString()); // 2024-06-15T02:30:45.123Z

// toUTCString() - UTC string
console.log("  toUTCString():", fmtDate.toUTCString()); // Sat, 15 Jun 2024 02:30:45 GMT

// toLocaleString() - Localized string
console.log("  toLocaleString('en-US'):", fmtDate.toLocaleString("en-US"));

// toLocaleDateString() - Localized date
console.log("  toLocaleDateString('en-US'):", fmtDate.toLocaleDateString("en-US"));

// toLocaleTimeString() - Localized time
console.log("  toLocaleTimeString('en-US'):", fmtDate.toLocaleTimeString("en-US"));

// Custom localized format
console.log("\n  Custom Localization:");
console.log("    en-US:", fmtDate.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long"
})); // Saturday, June 15, 2024

console.log("    ja-JP:", fmtDate.toLocaleDateString("ja-JP", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
})); // 2024/06/15

console.log("    de-DE:", fmtDate.toLocaleDateString("de-DE", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
})); // 15.06.2024

// Intl.DateTimeFormat - Advanced formatting
const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});
console.log("  Intl.DateTimeFormat:", formatter.format(fmtDate));

// ============================================
// Section 7: Date Arithmetic
// ============================================

console.log("\nDate Arithmetic:");

// Date difference (milliseconds)
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-12-31");
const diffMs = date2 - date1;
const diffDays = diffMs / (1000 * 60 * 60 * 24);
console.log("  2024-01-01 to 2024-12-31:");
console.log("    Millisecond difference:", diffMs);
console.log("    Day difference:", diffDays); // 365

// Add/subtract days
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

console.log("\n  Add/Subtract Days:");
console.log("    2024-06-15 + 7 days:", formatDate(addDays(new Date("2024-06-15"), 7)));
console.log("    2024-06-15 - 30 days:", formatDate(addDays(new Date("2024-06-15"), -30)));

// Add/subtract months
function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

console.log("\n  Add/Subtract Months:");
console.log("    2024-06-15 + 3 months:", formatDate(addMonths(new Date("2024-06-15"), 3)));
console.log("    2024-06-15 - 6 months:", formatDate(addMonths(new Date("2024-06-15"), -6)));

// Calculate age
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

console.log("\n  Age Calculation:");
console.log("    Born 1990-01-01:", calculateAge("1990-01-01"), "years old");
console.log("    Born 2000-12-31:", calculateAge("2000-12-31"), "years old");

// Count weekdays between two dates
function countWeekdays(start, end) {
  let count = 0;
  const current = new Date(start);
  while (current <= end) {
    if (current.getDay() !== 0 && current.getDay() !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}

const weekdays = countWeekdays(new Date("2024-06-01"), new Date("2024-06-30"));
console.log("  Weekdays in June 2024:", weekdays, "days");

// ============================================
// Section 8: Date Comparison
// ============================================

console.log("\nDate Comparison:");

const compare1 = new Date("2024-06-15");
const compare2 = new Date("2024-06-15");
const compare3 = new Date("2024-06-16");

// Direct comparison (compares timestamps)
console.log("  compare1 === compare2:", compare1 === compare2); // false (different objects)
console.log("  compare1.getTime() === compare2.getTime():", compare1.getTime() === compare2.getTime()); // true

// Using > < comparison
console.log("  compare1 < compare3:", compare1 < compare3); // true
console.log("  compare1 > compare3:", compare1 > compare3); // false

// Check if date is valid
function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

console.log("\n  Date Validity Check:");
console.log("    Valid date:", isValidDate(new Date("2024-06-15"))); // true
console.log("    Invalid date:", isValidDate(new Date("invalid"))); // false

// Check date range
function isDateInRange(date, start, end) {
  const time = date.getTime();
  return time >= start.getTime() && time <= end.getTime();
}

const checkDate = new Date("2024-06-15");
const rangeStart = new Date("2024-01-01");
const rangeEnd = new Date("2024-12-31");
console.log("  2024-06-15 in range 2024:", isDateInRange(checkDate, rangeStart, rangeEnd));

// ============================================
// Section 9: Timezone Handling
// ============================================

console.log("\nTimezone Handling:");

// getTimezoneOffset() - Returns offset from UTC in minutes
// Note: Sign is inverted, UTC+8 returns -480
const offset = new Date().getTimezoneOffset();
const offsetHours = -offset / 60;
console.log("  Local timezone offset:", offset, "minutes");
console.log("  Converted to hours:", offsetHours > 0 ? `+${offsetHours}` : offsetHours);

// Create date in specific timezone
function createDateInTimezone(year, month, day, hour, minute, timezone) {
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  console.log(`  ${timezone}:`, date.toLocaleString("en-US", { timeZone: timezone }));
  return date;
}

console.log("\n  Different Timezones:");
createDateInTimezone(2024, 6, 15, 10, 30, "Asia/Shanghai");
createDateInTimezone(2024, 6, 15, 10, 30, "America/New_York");
createDateInTimezone(2024, 6, 15, 10, 30, "Europe/London");
createDateInTimezone(2024, 6, 15, 10, 30, "Asia/Tokyo");

// Convert timezone using toLocaleString
const utcDate3 = new Date("2024-06-15T12:00:00Z");
console.log("\n  UTC 2024-06-15 12:00 in different timezones:");
console.log("    Shanghai:", utcDate3.toLocaleString("en-US", { timeZone: "Asia/Shanghai" }));
console.log("    New York:", utcDate3.toLocaleString("en-US", { timeZone: "America/New_York" }));
console.log("    London:", utcDate3.toLocaleString("en-US", { timeZone: "Europe/London" }));
console.log("    Tokyo:", utcDate3.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));

// ============================================
// Section 10: Timestamp Operations
// ============================================

console.log("\nTimestamp Operations:");

// Three ways to get timestamp
const tsDate = new Date();
console.log("  getTime():", tsDate.getTime());
console.log("  valueOf():", tsDate.valueOf());
console.log("  Unary operator:", +tsDate);

// Timestamp to date
const fromTs = new Date(1718447400000);
console.log("\n  Timestamp to date:", formatDateTime(fromTs));

// Unix seconds (common in backends)
const unixSeconds = Math.floor(Date.now() / 1000);
console.log("\n  Unix seconds:", unixSeconds);

// Microseconds (high precision)
if (typeof performance.now === "function") {
  const microSeconds = Math.floor(performance.now() * 1000);
  console.log("  Microseconds (relative):", microSeconds);
}

// Measure code execution time
function measureTime(fn, ...args) {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  console.log(`  Execution time: ${(end - start).toFixed(4)}ms`);
  return result;
}

console.log("\n  Performance Measurement:");
measureTime((n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) sum += i;
  return sum;
}, 1000000);

// ============================================
// Section 11: Common Pitfalls
// ============================================

console.log("\nCommon Pitfalls:");

// Pitfall 1: Month is 0-indexed
console.log("  Pitfall 1 - Month Index:");
console.log("    new Date(2024, 0, 1):", formatDate(new Date(2024, 0, 1))); // January
console.log("    new Date(2024, 11, 1):", formatDate(new Date(2024, 11, 1))); // December

// Pitfall 2: Timezone issues
console.log("\n  Pitfall 2 - Timezone:");
const noTimezone = new Date("2024-06-15");
console.log("    '2024-06-15' parsed:", formatDate(noTimezone));
// May be parsed as UTC midnight, displayed as previous day in local timezone

// Solution: Use ISO format with timezone
const withTimezone = new Date("2024-06-15T00:00:00+08:00");
console.log("    '2024-06-15T00:00:00+08:00':", formatDate(withTimezone));

// Pitfall 3: Inconsistent date parsing
console.log("\n  Pitfall 3 - Date Parsing:");
console.log("    '2024-06-15':", new Date("2024-06-15"));
console.log("    '06/15/2024':", new Date("06/15/2024")); // US format
console.log("    '15/06/2024':", new Date("15/06/2024")); // Invalid

// Solution: Always use ISO 8601 format
console.log("  Recommendation: Always use ISO 8601 format");

// Pitfall 4: Date comparison
console.log("\n  Pitfall 4 - Date Comparison:");
const d1 = new Date("2024-06-15");
const d2 = new Date("2024-06-15");
console.log("    d1 === d2:", d1 === d2); // false
console.log("    d1.getTime() === d2.getTime():", d1.getTime() === d2.getTime()); // true

// Pitfall 5: Month overflow
console.log("\n  Pitfall 5 - Month Overflow:");
const overflow = new Date(2024, 12, 1); // Month 12 overflows
console.log("    new Date(2024, 12, 1):", formatDate(overflow)); // 2025-01-01

// ============================================
// Section 12: Practical Examples
// ============================================

console.log("\nPractical Examples:");

// Example 1: Countdown timer
function countdown(targetDate) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) return "Time's up!";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 10);
console.log("  Countdown (10 days):", countdown(futureDate));

// Example 2: Birth date validation
function isValidBirthDate(dateStr) {
  const birth = new Date(dateStr);
  const today = new Date();

  if (!isValidDate(birth)) return false;

  const age = calculateAge(birth);
  return age >= 0 && age <= 150;
}

console.log("\n  Birth Date Validation:");
console.log("    1990-01-01:", isValidBirthDate("1990-01-01")); // true
console.log("    1800-01-01:", isValidBirthDate("1800-01-01")); // false
console.log("    invalid:", isValidBirthDate("invalid")); // false

// Example 3: Date range formatting
function formatDateRange(start, end) {
  const options = { month: "short", day: "numeric" };
  const startStr = start.toLocaleDateString("en-US", options);
  const endStr = end.toLocaleDateString("en-US", options);
  return `${startStr} - ${endStr}`;
}

const rangeStart2 = new Date("2024-06-01");
const rangeEnd2 = new Date("2024-06-30");
console.log("\n  Date Range:", formatDateRange(rangeStart2, rangeEnd2));

// Example 4: Meeting time converter
function convertMeetingTime(utcTime, timezones) {
  const utc = new Date(utcTime);
  const result = {};

  for (const tz of timezones) {
    result[tz] = utc.toLocaleString("en-US", {
      timeZone: tz,
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  return result;
}

const meetingTime = "2024-06-15T14:00:00Z";
const timezones = ["Asia/Shanghai", "America/New_York", "Europe/London"];
console.log("\n  Meeting Time Conversion:");
console.log("  UTC:", meetingTime);
const converted = convertMeetingTime(meetingTime, timezones);
for (const [tz, time] of Object.entries(converted)) {
  console.log(`    ${tz}: ${time}`);
}

// ============================================
// Section 13: Performance Considerations
// ============================================

console.log("\nPerformance Considerations:");

// Date.now() vs new Date().getTime()
const iterations = 100000;

// Date.now()
let start1 = performance.now();
for (let i = 0; i < iterations; i++) {
  Date.now();
}
let time1 = performance.now() - start1;

// new Date().getTime()
let start2 = performance.now();
for (let i = 0; i < iterations; i++) {
  new Date().getTime();
}
let time2 = performance.now() - start2;

console.log(`  ${iterations} iterations:`);
console.log(`    Date.now(): ${time1.toFixed(2)}ms`);
console.log(`    new Date().getTime(): ${time2.toFixed(2)}ms`);
console.log(`    Recommendation: Use Date.now() for timestamps`);

// Cache date objects
console.log("\n  Tip: Reuse date objects in loops");

// ============================================
// Section 14: Modern Alternatives
// ============================================

console.log("\nModern Alternatives:");

// Temporal API (ES2027)
// - Modern date/time API complementing the Date object
// - Immutable, time-zone aware, easier to work with
// - Stage 4 Sep 2025, targeted for ES2027, browser support varies by engine
console.log("  Temporal API (ES2027):");
console.log("    - Temporal.Now.instant() - Current instant");
console.log("    - Temporal.PlainDate - Date without timezone");
console.log("    - Temporal.PlainTime - Time without date/timezone");
console.log("    - Temporal.PlainDateTime - Date and time without timezone");
console.log("    - Temporal.ZonedDateTime - Date and time with timezone");
console.log("    - Temporal.Duration - Time duration");
console.log("    - Better timezone and DST handling");

// Date.prototype.toTemporalInstant() (ES2027)
// - Bridge method to convert Date to Temporal
// - Allows migration from Date to Temporal
console.log("\n  Date.prototype.toTemporalInstant() (ES2027):");

// Check if Temporal is available (ES2027, browser support varies)
if (typeof Temporal !== 'undefined') {
  const legacyDate = new Date("2024-06-15T10:30:00Z");
  const temporalInstant = legacyDate.toTemporalInstant();
  console.log("    Legacy Date:", legacyDate.toISOString());
  console.log("    Temporal Instant:", temporalInstant.toString());

  // Convert to PlainDateTime in specific timezone
  const plainDateTime = temporalInstant.toZonedDateTimeISO("America/New_York").toPlainDateTime();
  console.log("    In New York timezone:", plainDateTime.toString());
} else {
  console.log("    Temporal API (ES2027) not yet available in this environment");
  console.log("    Polyfill for older environments: npm install @js-temporal/polyfill");
  console.log("    Usage:");
  console.log("      const legacyDate = new Date('2024-06-15T10:30:00Z');");
  console.log("      const instant = legacyDate.toTemporalInstant();");
  console.log("      const zoned = instant.toZonedDateTimeISO('America/New_York');");
}

// Temporal vs Date comparison
console.log("\n  Temporal vs Date comparison:");
console.log("    Date issues:");
console.log("      - Mutable (changes in place)");
console.log("      - Timezone handling is confusing");
console.log("      - Months are 0-indexed");
console.log("      - Year 0 handling is buggy");
console.log("      - Parsing is implementation-dependent");
console.log("    Temporal benefits:");
console.log("      - Immutable (all operations return new objects)");
console.log("      - Timezone-aware by design");
console.log("      - Clear separation of concepts (Instant, PlainDate, etc.)");
console.log("      - Consistent API across all types");
console.log("      - ES2027 standardized API (Stage 4, September 2025, delayed publication)");
console.log("      - Better for internationalization");

// Third-party library comparison
console.log("\n  Third-party Libraries:");

// date-fns (recommended)
console.log("    date-fns:");
console.log("      - Functional, tree-shakeable");
console.log("      - Immutable, pure functions");
console.log("      - Example: format(addDays(date, 7), 'yyyy-MM-dd')");

// Luxon (successor to Moment.js from same author)
console.log("\n    Luxon:");
console.log("      - Better timezone support");
console.log("      - Immutable objects");
console.log("      - Built on Intl API");

// Moment.js (maintenance mode, not recommended)
console.log("\n    Moment.js:");
console.log("      - ⚠️ Maintenance mode, not recommended for new projects");
console.log("      - Mutable objects, can cause bugs");
console.log("      - Large bundle size");

// Day.js
console.log("\n    Day.js:");
console.log("      - Lightweight (2KB)");
console.log("      - Moment.js compatible API");
console.log("      - Plugin architecture");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. DATE TYPE
   TS:  const date: Date = new Date()
   TS:  Date is a global type with all Date methods

2. TYPE-SAFE DATE FUNCTIONS
   TS:  function formatDate(date: Date): string { ... }
   TS:  function addDays(date: Date, days: number): Date { ... }

3. BRANDED TYPES FOR DATE VALIDATION
   TS:  type Timestamp = number & { readonly brand: unique symbol }
   TS:  type ISODateString = string & { readonly brand: unique symbol }
   TS:  Used to distinguish regular number/string from timestamps/date strings

4. UTILITY TYPES
   TS:  type DateOnly = Omit<Date, 'getHours' | 'setHours' | ...>
   TS:  Create type with only date methods

5. DATE LIBRARY TYPES
   TS:  import { format, addDays } from 'date-fns'
   TS:  Most date libraries have full TypeScript support

📘 See related: 08-objects.js (object methods), 33-fetch-api.js (timestamps)
*/
