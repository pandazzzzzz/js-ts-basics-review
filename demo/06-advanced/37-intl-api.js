// Intl Internationalization API Demo
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
// 📘 javascript.info: "Intl" (brief mention)
// 📌 ECMAScript Internationalization API

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

// Basic sorting
const names = ['Ä', 'Z', 'A', 'Ö'];
console.log("Default sort:", names.sort()); // ['A', 'Z', 'Ä', 'Ö'] (wrong!)

console.log("Collator sort:", names.sort(
  new Intl.Collator('de-DE').compare
)); // ['A', 'Ä', 'Ö', 'Z'] (correct!)

// Numeric sorting
const files = ['file1.txt', 'file10.txt', 'file2.txt', 'file20.txt'];
console.log("\nDefault sort:", files.sort());
// ['file1.txt', 'file10.txt', 'file2.txt', 'file20.txt'] (wrong!)

console.log("Numeric sort:", files.sort(
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
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. INTL TYPES
   JS:  Runtime API only
   TS:  Full type definitions for all Intl constructors
   TS:  Intl.NumberFormat, Intl.DateTimeFormat, etc.
   TS:  Type-safe options objects

2. OPTIONS TYPES
   TS:  Intl.NumberFormatOptions
   TS:  Intl.DateTimeFormatOptions
   TS:  Intl.CollatorOptions
   TS:  Autocomplete for all options

3. LOCALE STRING TYPE
   TS:  Intl.LocalesArgument = string | string[] | Intl.Locale
   TS:  Type-safe locale handling

4. RETURN TYPES
   TS:  format() returns string
   TS:  formatToParts() returns typed array
   TS:  select() returns specific string literals

⚠️ BROWSER/RUNTIME SUPPORT:
- Most Intl APIs are well-supported in modern browsers
- Intl.Segmenter is ES2022 (check compatibility)
- Node.js: Full support in recent versions
- Polyfills available for older environments

🔧 BEST PRACTICES:
- Cache formatters for better performance
- Use appropriate granularity for Segmenter
- Consider fallback locales
- Test with actual locale data
- Use numeric: true for file sorting
- Remember time zone differences
- Validate currency codes
- Handle missing translations gracefully

📘 See related:
- 04-strings.js (localeCompare)
- 10-date-time.js (Date formatting)
- 05-arrays.js (Sorting)
*/
