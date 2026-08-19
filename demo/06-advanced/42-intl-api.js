// Intl Internationalization API Demo
// 📘 For TypeScript comparison, see: 42-intl-api-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
// 📘 javascript.info: "Intl" (brief mention)
// 📌 ECMAScript Internationalization API
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces the Intl API as a standard way to format numbers, dates, and other values for different locales.
// The examples show how language and region settings change the output without changing the underlying data.

// ============================================
// Table of Contents
// ============================================
// 1. Intl.NumberFormat - Number Formatting
// 2. Intl.DateTimeFormat - Date/Time Formatting
// 3. Intl.Collator - String Sorting
// 4. Intl.PluralRules - Plural Rules
// 5. Intl.RelativeTimeFormat - Relative Time
// 6. Intl.ListFormat - List Formatting
// 7. Intl.Segmenter - Text Segmentation
// 8. Practical Applications
// 9. Common Pitfalls
// 10. Best Practices
// 11. Intl.DisplayNames
// 12. Intl.Locale
// 13. Intl.DurationFormat
// 14. formatToParts() Method
// 15. Intl.MessageFormat / MessageFormat 2.0 (proposal)

// ============================================
// Section 1: Intl.NumberFormat - Number Formatting
// ============================================

console.log("\n=== Intl.NumberFormat ===");

// Basic usage
const number = 1234567.89;

// Different locales
console.log("US English:", new Intl.NumberFormat('en-US').format(number));
// 1,234,567.89
console.log("German:", new Intl.NumberFormat('de-DE').format(number));
// 1.234.567,89
console.log("Chinese:", new Intl.NumberFormat('zh-CN').format(number));
// 1,234,567.89

// Currency formatting
const price = 1234.56;
console.log("\nCurrency formatting:");
console.log("USD:", new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(price)); // $1,234.56

console.log("EUR:", new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR'
}).format(price)); // 1.234,56 €

console.log("CNY:", new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY'
}).format(price)); // ¥1,234.56

// Percentage formatting
const ratio = 0.756;
console.log("\nPercentage:", new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1
}).format(ratio)); // 75.6%

// Unit formatting (ES2020)
const distance = 384400;
console.log("\nUnit formatting:");
console.log("Kilometers:", new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'kilometer'
}).format(distance)); // 384,400 km

console.log("Miles:", new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'mile',
  unitDisplay: 'long'
}).format(238855)); // 238,855 miles

// Compact notation
const bigNumber = 1234567890;
console.log("\nCompact notation:");
console.log("Short:", new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short'
}).format(bigNumber)); // 1.2B

console.log("Long:", new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'long'
}).format(bigNumber)); // 1.2 billion

// Precision control
console.log("\nPrecision control:");
console.log("Min 2 decimals:", new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2
}).format(123)); // 123.00

console.log("Max 2 decimals:", new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2
}).format(123.456)); // 123.46

console.log("Significant digits:", new Intl.NumberFormat('en-US', {
  minimumSignificantDigits: 3,
  maximumSignificantDigits: 5
}).format(1234.5)); // 1,234.5

// ============================================
// Section 2: Intl.DateTimeFormat - Date/Time Formatting
// ============================================

console.log("\n=== Intl.DateTimeFormat ===");

const date = new Date('2024-03-15T14:30:00');

// Different locales
console.log("US English:", new Intl.DateTimeFormat('en-US').format(date));
// 3/15/2024
console.log("British English:", new Intl.DateTimeFormat('en-GB').format(date));
// 15/03/2024
console.log("Chinese:", new Intl.DateTimeFormat('zh-CN').format(date));
// 2024/3/15

// Date styles
console.log("\nDate styles:");
console.log("Full:", new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full'
}).format(date)); // Friday, March 15, 2024

console.log("Long:", new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long'
}).format(date)); // March 15, 2024

console.log("Medium:", new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium'
}).format(date)); // Mar 15, 2024

console.log("Short:", new Intl.DateTimeFormat('en-US', {
  dateStyle: 'short'
}).format(date)); // 3/15/24

// Time styles
console.log("\nTime styles:");
console.log("Full:", new Intl.DateTimeFormat('en-US', {
  timeStyle: 'full'
}).format(date)); // 2:30:00 PM ...

console.log("Long:", new Intl.DateTimeFormat('en-US', {
  timeStyle: 'long'
}).format(date)); // 2:30:00 PM ...

console.log("Medium:", new Intl.DateTimeFormat('en-US', {
  timeStyle: 'medium'
}).format(date)); // 2:30:00 PM

console.log("Short:", new Intl.DateTimeFormat('en-US', {
  timeStyle: 'short'
}).format(date)); // 2:30 PM

// Custom format
console.log("\nCustom format:");
console.log(new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  weekday: 'long'
}).format(date)); // Friday, March 15, 2024 at 2:30:00 PM

// Time zones
console.log("\nTime zones:");
console.log("New York:", new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  timeStyle: 'full'
}).format(date));

console.log("Tokyo:", new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Tokyo',
  timeStyle: 'full'
}).format(date));

// Format range
const startDate = new Date('2024-03-15');
const endDate = new Date('2024-03-20');
console.log("\nDate range:", new Intl.DateTimeFormat('en-US', {
  dateStyle: 'long'
}).formatRange(startDate, endDate)); // March 15 – 20, 2024

// ============================================
// Section 3: Intl.Collator - String Sorting
// ============================================

console.log("\n=== Intl.Collator ===");

// Basic sorting (use slice() to avoid mutating original)
const names = ['Ä', 'Z', 'A', 'Ö'];
console.log("Default sort:", names.slice().sort()); // ['A', 'Z', 'Ä', 'Ö'] (wrong!)

console.log("Collator sort:", names.slice().sort(
  new Intl.Collator('de-DE').compare
)); // ['A', 'Ä', 'Ö', 'Z'] (correct!)

// Numeric sorting
const files = ['file1.txt', 'file10.txt', 'file2.txt', 'file20.txt'];
console.log("\nDefault sort:", files.slice().sort());
// ['file1.txt', 'file10.txt', 'file2.txt', 'file20.txt'] (wrong!)

console.log("Numeric sort:", files.slice().sort(
  new Intl.Collator('en-US', { numeric: true }).compare
)); // ['file1.txt', 'file2.txt', 'file10.txt', 'file20.txt'] (correct!)

// Sensitivity options
const words1 = ['resume', 'Resume', 'résumé', 'RESUME'];
console.log("\nSensitivity options:");

console.log("base:", words1.sort(
  new Intl.Collator('en', { sensitivity: 'base' }).compare
)); // Ignores case and accents

console.log("accent:", words1.sort(
  new Intl.Collator('en', { sensitivity: 'accent' }).compare
)); // Considers accents, ignores case

console.log("case:", words1.sort(
  new Intl.Collator('en', { sensitivity: 'case' }).compare
)); // Considers case, ignores accents

console.log("variant:", words1.sort(
  new Intl.Collator('en', { sensitivity: 'variant' }).compare
)); // Considers both case and accents

// Relationship with String.prototype.localeCompare()
console.log("\nlocaleCompare uses Collator internally:");
console.log("'a'.localeCompare('b'):", 'a'.localeCompare('b')); // -1
console.log("'b'.localeCompare('a'):", 'b'.localeCompare('a')); // 1
console.log("'a'.localeCompare('a'):", 'a'.localeCompare('a')); // 0

// ============================================
// Section 4: Intl.PluralRules - Plural Rules
// ============================================

console.log("\n=== Intl.PluralRules ===");

// Different languages have different plural rules
const enPlural = new Intl.PluralRules('en-US');
const arPlural = new Intl.PluralRules('ar-EG'); // Arabic has 6 plural forms!

console.log("English plural rules:");
console.log("0:", enPlural.select(0));   // "other"
console.log("1:", enPlural.select(1));   // "one"
console.log("2:", enPlural.select(2));   // "other"
console.log("5:", enPlural.select(5));   // "other"

console.log("\nArabic plural rules:");
console.log("0:", arPlural.select(0));   // "zero"
console.log("1:", arPlural.select(1));   // "one"
console.log("2:", arPlural.select(2));   // "two"
console.log("5:", arPlural.select(5));   // "few"
console.log("11:", arPlural.select(11)); // "many"
console.log("100:", arPlural.select(100)); // "other"

// Practical usage
function pluralize(count, singular, plural) {
  const rule = new Intl.PluralRules('en-US').select(count);
  const forms = { one: singular, other: plural };
  return `${count} ${forms[rule]}`;
}

console.log("\nPluralization:");
console.log(pluralize(0, 'item', 'items')); // "0 items"
console.log(pluralize(1, 'item', 'items')); // "1 item"
console.log(pluralize(5, 'item', 'items')); // "5 items"

// ============================================
// Section 5: Intl.RelativeTimeFormat - Relative Time
// ============================================

console.log("\n=== Intl.RelativeTimeFormat ===");

const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });

console.log("Relative time (auto):");
console.log(rtf.format(-1, 'day'));    // "yesterday"
console.log(rtf.format(0, 'day'));     // "today"
console.log(rtf.format(1, 'day'));     // "tomorrow"
console.log(rtf.format(-2, 'day'));    // "2 days ago"
console.log(rtf.format(2, 'day'));     // "in 2 days"

const rtfAlways = new Intl.RelativeTimeFormat('en-US', { numeric: 'always' });

console.log("\nRelative time (always numeric):");
console.log(rtfAlways.format(-1, 'day'));  // "1 day ago"
console.log(rtfAlways.format(0, 'day'));   // "in 0 days"
console.log(rtfAlways.format(1, 'day'));   // "in 1 day"

// Different units
console.log("\nDifferent units:");
console.log(rtf.format(-1, 'second'));  // "1 second ago"
console.log(rtf.format(-1, 'minute'));  // "1 minute ago"
console.log(rtf.format(-1, 'hour'));    // "1 hour ago"
console.log(rtf.format(-1, 'week'));    // "last week"
console.log(rtf.format(-1, 'month'));   // "last month"
console.log(rtf.format(-1, 'year'));    // "last year"

// Different locales
console.log("\nDifferent locales:");
console.log("Chinese:", new Intl.RelativeTimeFormat('zh-CN').format(-1, 'day'));
// "1天前"
console.log("Spanish:", new Intl.RelativeTimeFormat('es-ES').format(-1, 'day'));
// "hace 1 día"

// ============================================
// Section 6: Intl.ListFormat - List Formatting
// ============================================

console.log("\n=== Intl.ListFormat ===");

const items = ['Apple', 'Banana', 'Orange'];

// Conjunction (and)
const conjunctionFormatter = new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'conjunction'
});
console.log("Conjunction:", conjunctionFormatter.format(items));
// "Apple, Banana, and Orange"

// Disjunction (or)
const disjunctionFormatter = new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'disjunction'
});
console.log("Disjunction:", disjunctionFormatter.format(items));
// "Apple, Banana, or Orange"

// Unit (no connector)
const unitFormatter = new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'unit'
});
console.log("Unit:", unitFormatter.format(items));
// "Apple, Banana, Orange"

// Different styles
console.log("\nDifferent styles:");
console.log("Long:", new Intl.ListFormat('en-US', {
  style: 'long',
  type: 'conjunction'
}).format(items)); // "Apple, Banana, and Orange"

console.log("Short:", new Intl.ListFormat('en-US', {
  style: 'short',
  type: 'conjunction'
}).format(items)); // "Apple, Banana, & Orange"

console.log("Narrow:", new Intl.ListFormat('en-US', {
  style: 'narrow',
  type: 'conjunction'
}).format(items)); // "Apple, Banana, Orange"

// Different locales
console.log("\nDifferent locales:");
console.log("Chinese:", new Intl.ListFormat('zh-CN', {
  type: 'conjunction'
}).format(items)); // "Apple、Banana和Orange"

console.log("Spanish:", new Intl.ListFormat('es-ES', {
  type: 'conjunction'
}).format(items)); // "Apple, Banana y Orange"

// ============================================
// Section 7: Intl.Segmenter - Text Segmentation (ES2022)
// ============================================

console.log("\n=== Intl.Segmenter (ES2022) ===");

// Grapheme segmentation (user-perceived characters)
const graphemeSegmenter = new Intl.Segmenter('en-US', { granularity: 'grapheme' });
const text1 = "👨‍👩‍👧‍👦Hello";
const graphemes = [...graphemeSegmenter.segment(text1)].map(s => s.segment);
console.log("Graphemes:", graphemes);
// ["👨‍👩‍👧‍👦", "H", "e", "l", "l", "o"]

// Word segmentation
const wordSegmenter = new Intl.Segmenter('en-US', { granularity: 'word' });
const text2 = "Hello, world! How are you?";
const words2 = [...wordSegmenter.segment(text2)]
  .filter(s => s.isWordLike)
  .map(s => s.segment);
console.log("Words:", words2);
// ["Hello", "world", "How", "are", "you"]

// Sentence segmentation
const sentenceSegmenter = new Intl.Segmenter('en-US', { granularity: 'sentence' });
const text3 = "Hello world. How are you? I'm fine!";
const sentences = [...sentenceSegmenter.segment(text3)].map(s => s.segment);
console.log("Sentences:", sentences);
// ["Hello world. ", "How are you? ", "I'm fine!"]

// Chinese/Japanese word segmentation
const zhSegmenter = new Intl.Segmenter('zh-CN', { granularity: 'word' });
const zhText = "你好世界";
const zhWords = [...zhSegmenter.segment(zhText)].map(s => s.segment);
console.log("Chinese words:", zhWords);
// ["你好", "世界"]

console.log("\nSegmenter is crucial for:");
console.log("- CJK (Chinese/Japanese/Korean) text processing");
console.log("- Emoji handling");
console.log("- Word counting");
console.log("- Text truncation");

// ============================================
// Section 8: Practical Applications
// ============================================

console.log("\n=== Practical Applications ===");

// 1. E-commerce: Currency formatting
function formatPrice(amount, currency, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

console.log("\n1. E-commerce:");
console.log("US:", formatPrice(99.99, 'USD', 'en-US'));
console.log("EU:", formatPrice(99.99, 'EUR', 'de-DE'));
console.log("CN:", formatPrice(99.99, 'CNY', 'zh-CN'));

// 2. Social media: Relative time
function timeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' });
  
  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
}

console.log("\n2. Social media:");
const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
console.log("Post time:", timeAgo(pastDate));

// 3. Search: Locale-aware sorting
function sortNames(names, locale) {
  return names.sort(new Intl.Collator(locale, { numeric: true }).compare);
}

console.log("\n3. Search:");
const unsorted = ['file10', 'file2', 'file1', 'file20'];
console.log("Sorted:", sortNames(unsorted, 'en-US'));

// 4. Multi-language UI: Number display
function formatStats(count, locale) {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(count);
}

console.log("\n4. Multi-language UI:");
console.log("Views:", formatStats(1234567, 'en-US')); // "1.2M"
console.log("Likes:", formatStats(9876, 'en-US'));    // "9.9K"

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Locale string format
console.log("\nPitfall 1: Locale string format");
console.log("  'en-US' vs 'en-us' (case sensitivity)");
console.log("  Some locales are case-sensitive");
console.log("  Fix: Use standard locale format");

// Pitfall 2: Time zone handling
console.log("\nPitfall 2: Time zone handling");
console.log("  timeZone: 'UTC' vs timeZone: undefined");
console.log("  undefined uses local timezone");
console.log("  Fix: Always specify timezone for consistency");

// Pitfall 3: Number formatting precision
console.log("\nPitfall 3: Number formatting precision");
console.log("  maximumFractionDigits affects rounding");
console.log("  Rounding may not match expectations");
console.log("  Fix: Test edge cases");

// Pitfall 4: Collator numeric sorting
console.log("\nPitfall 4: Collator numeric sorting");
console.log("  Without numeric: true, '10' comes before '2'");
console.log("  Files sorted: file1, file10, file2");
console.log("  Fix: Use numeric: true for numbers in strings");

// Pitfall 5: Currency code validity
console.log("\nPitfall 5: Invalid currency codes");
console.log("  Invalid codes throw RangeError");
console.log("  'XYZ' is not valid currency");
console.log("  Fix: Validate currency codes");

// Pitfall 6: Intl.Segmenter support
console.log("\nPitfall 6: Intl.Segmenter availability");
console.log("  Newer API (ES2022)");
console.log("  Not available in older browsers");
console.log("  Fix: Check support before use");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Cache Intl formatters for reuse (expensive to create)");
console.log("2. Use appropriate granularity for Segmenter");
console.log("3. Provide fallback locales for missing translations");
console.log("4. Test with actual locale data (not just 'en-US')");
console.log("5. Use numeric: true for sorting strings with numbers");
console.log("6. Always specify timezone for date formatting");
console.log("7. Validate currency codes before use");
console.log("8. Use Intl.RelativeTimeFormat for user-friendly times");
console.log("9. Consider locale-specific plural rules");
console.log("10. Handle missing locale gracefully");

console.log("\n❌ DON'T:");
console.log("1. Don't create new formatter for each call");
console.log("2. Don't use 'en-US' as only test locale");
console.log("3. Don't forget timezone in date formatting");
console.log("4. Don't sort without numeric: true for file names");
console.log("5. Don't assume all currencies are valid");
console.log("6. Don't use Intl.Segmenter without fallback");
console.log("7. Don't ignore locale fallback chain");
console.log("8. Don't forget to validate locale strings");
console.log("9. Don't use default locale for user-specific content");
console.log("10. Don't forget about RTL locale considerations");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Formatter creation overhead (cache them)");
console.log("2. Timezone inconsistencies");
console.log("3. Currency code validation");
console.log("4. Numeric sorting vs alphabetical");
console.log("5. Intl.Segmenter browser support");
console.log("6. Plural rules variations across locales");
console.log("7. RTL text direction considerations");
console.log("8. Missing locale fallback handling");

// ============================================
// Section 9: Intl.DisplayNames (ES2021)
// ============================================

console.log("\n=== Intl.DisplayNames ===");

// Intl.DisplayNames - Get localized names for languages, regions, scripts, currencies
// Useful for building locale selection UIs

const languageNames = new Intl.DisplayNames(['en'], { type: 'language' });
console.log("Language names (English):");
console.log("- 'fr':", languageNames.of('fr')); // "French"
console.log("- 'zh':", languageNames.of('zh')); // "Chinese"
console.log("- 'ja':", languageNames.of('ja')); // "Japanese"

const regionNames = new Intl.DisplayNames(['zh'], { type: 'region' });
console.log("\nRegion names (Chinese):");
console.log("- 'US':", regionNames.of('US')); // "美国"
console.log("- 'JP':", regionNames.of('JP')); // "日本"
console.log("- 'FR':", regionNames.of('FR')); // "法国"

const currencyNames = new Intl.DisplayNames(['en'], { type: 'currency' });
console.log("\nCurrency names (English):");
console.log("- 'USD':", currencyNames.of('USD')); // "US Dollar"
console.log("- 'EUR':", currencyNames.of('EUR')); // "Euro"
console.log("- 'CNY':", currencyNames.of('CNY')); // "Chinese Yuan"

const scriptNames = new Intl.DisplayNames(['en'], { type: 'script' });
console.log("\nScript names (English):");
console.log("- 'Latn':", scriptNames.of('Latn')); // "Latin"
console.log("- 'Hant':", scriptNames.of('Hant')); // "Traditional"
console.log("- 'Arab':", scriptNames.of('Arab')); // "Arabic"

// Use cases:
console.log("\nUse cases:");
console.log("- Locale/language selection dropdowns");
console.log("- Country/region pickers");
console.log("- Currency selection UIs");
console.log("- Displaying user-friendly names from codes");

// ============================================
// Section 10: Intl.Locale (ES2020)
// ============================================

console.log("\n=== Intl.Locale ===");

// Intl.Locale - Locale object with structured locale data
// Provides locale information in structured form

const locale = new Intl.Locale('zh-CN');
console.log("Locale 'zh-CN':");
console.log("- language:", locale.language); // "zh"
console.log("- region:", locale.region); // "CN"
console.log("- baseName:", locale.baseName); // "zh-CN"
console.log("- toString():", locale.toString()); // "zh-CN"

// Locale with script and variant
const extendedLocale = new Intl.Locale('zh-Hant-TW');
console.log("\nExtended locale 'zh-Hant-TW':");
console.log("- language:", extendedLocale.language); // "zh"
console.log("- script:", extendedLocale.script); // "Hant"
console.log("- region:", extendedLocale.region); // "TW"
console.log("- baseName:", extendedLocale.baseName); // "zh-Hant-TW"

// Locale with options
const localeWithOptions = new Intl.Locale('en', {
  region: 'US',
  calendar: 'gregory',
  numberingSystem: 'latn'
});
console.log("\nLocale with options:");
console.log("- toString():", localeWithOptions.toString()); // "en-US-u-ca-gregory-nu-latn"
console.log("- calendar:", localeWithOptions.calendar); // "gregory"
console.log("- numberingSystem:", localeWithOptions.numberingSystem); // "latn"

// Get all locale info
console.log("\nLocale properties:");
console.log("- locale.language: Primary language subtag");
console.log("- locale.script: Script subtag (optional)");
console.log("- locale.region: Region subtag (optional)");
console.log("- locale.baseName: Core locale identifier");
console.log("- locale.calendar: Calendar type");
console.log("- locale.collation: Collation type");
console.log("- locale.hourCycle: Hour cycle (h12, h23, etc)");
console.log("- locale.numberingSystem: Numbering system");
console.log("- locale.numeric: Numeric ordering flag");
console.log("- locale.caseFirst: Case-first ordering");

// Use cases:
console.log("\nUse cases:");
console.log("- Parsing and validating locale strings");
console.log("- Extracting locale components");
console.log("- Building locale-aware UIs");
console.log("- Locale normalization");

// ============================================
// Section 11: Intl.DurationFormat (ES2025)
// ============================================

/*
 * verification:
 *   feature: Intl.DurationFormat
 *   status: ES2025
 *   stage4Date: 2025-07
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/ecma402/finished-proposals.md
 */

console.log("\n=== Intl.DurationFormat ===");

// Intl.DurationFormat - Format durations (ES2025)
// ⚠️ BROWSER/RUNTIME SUPPORT:
// - Chrome: 129+ (September 2024)
// - Firefox: 136+ (March 2025)
// - Safari: 16.4+ (March 2023)
// - Node.js: 23.0+ (October 2024)
// - Polyfill available: intl-durationformat (npm)

console.log("Intl.DurationFormat is ES2025, modern runtime support available.");
console.log("Runtime check:");
if ('DurationFormat' in Intl) {
  console.log("✅ Intl.DurationFormat supported, running examples:");
  const duration = {
    hours: 2,
    minutes: 30,
    seconds: 45
  };

  const df = new Intl.DurationFormat('en-US', { style: 'long' });
  console.log(df.format(duration));

  const dfShort = new Intl.DurationFormat('en-US', { style: 'short' });
  console.log(dfShort.format(duration));

  const dfNarrow = new Intl.DurationFormat('en-US', { style: 'narrow' });
  console.log(dfNarrow.format(duration));

  const zhDf = new Intl.DurationFormat('zh-CN', { style: 'long' });
  console.log(zhDf.format(duration));
} else {
  console.log("⚠️ Intl.DurationFormat not supported in this runtime.");
  console.log("Expected syntax:");
  console.log(`
const duration = { hours: 2, minutes: 30, seconds: 45 };
const df = new Intl.DurationFormat('en-US', { style: 'long' });
// "2 hours, 30 minutes, 45 seconds"
const dfShort = new Intl.DurationFormat('en-US', { style: 'short' });
// "2 hr, 30 min, 45 sec"
const dfNarrow = new Intl.DurationFormat('en-US', { style: 'narrow' });
// "2h 30m 45s"
`);
}

console.log("\nDuration object properties:");
console.log("- years, months, weeks, days");
console.log("- hours, minutes, seconds, milliseconds");
console.log("- microseconds, nanoseconds");

console.log("\nStyle options:");
console.log("- 'long': Full names (hours, minutes)");
console.log("- 'short': Abbreviated (hr, min)");
console.log("- 'narrow': Minimal (h, m)");

console.log("\nUse cases:");
console.log("- Video/audio duration display");
console.log("- Timer/countdown formatting");
console.log("- Travel time display");
console.log("- Task duration tracking");

// ============================================
// Section 12: formatToParts() Method
// ============================================

console.log("\n=== formatToParts() Method ===");

// formatToParts() - Get formatted parts as array
// Useful for styling individual parts

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

const parts = formatter.formatToParts(1234.56);
console.log("formatToParts(1234.56):", parts);
// [
//   { type: 'currency', value: '$' },
//   { type: 'integer', value: '1' },
//   { type: 'group', value: ',' },
//   { type: 'integer', value: '234' },
//   { type: 'decimal', value: '.' },
//   { type: 'fraction', value: '56' }
// ]

// Use case: Custom styling
console.log("\nUse case: Custom styling of parts");
console.log(`
// Style each part differently
parts.map(part => {
  if (part.type === 'currency') {
    return \`<span class="currency">\${part.value}</span>\`;
  } else if (part.type === 'integer') {
    return \`<span class="number">\${part.value}</span>\`;
  }
  return part.value;
});
`);

// Available for:
console.log("\nformatToParts() available for:");
console.log("- Intl.NumberFormat.formatToParts()");
console.log("- Intl.DateTimeFormat.formatToParts()");
console.log("- Intl.RelativeTimeFormat.formatToParts()");
console.log("- Intl.ListFormat.formatToParts()");

// ══════════════════════════════════════════
// ⚠️ PROPOSAL SECTION — not current standard, syntax may change
// ══════════════════════════════════════════
// Section 13: Intl.MessageFormat / MessageFormat 2.0 (Stage 1 proposal - not current standard)
// ============================================

/*
 * verification:
 *   feature: Intl.MessageFormat
 *   status: Stage 1
 *   lastVerified: 2026-08-14
 *   source: https://github.com/tc39/proposals/blob/main/ecma402/README.md
 */
console.log("\n=== Intl.MessageFormat (Stage 1 proposal - not current standard) ===");

// MessageFormat 2.0 is a Stage 1 proposal, not yet part of the ECMAScript standard.
// Unifies plural/select/gender/date/number into a single declarative ICU message syntax.
// No verification block (Stage 1, not finalized).
// Proposal: https://github.com/tc39/proposal-intl-messageformat
console.log("- Stage 1 proposal, not yet standardized; use @messageformat/core polyfill for production");
console.log(`// Example template (future syntax):
// const mf = new Intl.MessageFormat(\`You have {count, plural, =0 {no items} one {one item} other {# items}}.\`, 'en-US');
// mf.format({ count: 5 });  // "You have 5 items."
`);
// 📘 See 50-reserved.js (future extensions topic)


// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 12-date-time.js - Date and time formatting");
console.log("📘 04-strings.js - String comparison");
console.log("📘 50-reserved.js - Temporal API");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 42-intl-api-ts-comparison.ts
*/
