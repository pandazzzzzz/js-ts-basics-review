// TypeScript vs JavaScript: Intl API Comparison
// 📘 For JavaScript examples, see: 42-intl-api.js
// This file demonstrates TypeScript-specific type features for Intl API

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: Intl.NumberFormat Types
// ============================================

console.log("=== Intl.NumberFormat Types ===\n");

// TypeScript provides full type definitions for Intl.NumberFormat
const number = 1234567.89;

// Options are fully typed
const numberFormatOptions: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const formatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", numberFormatOptions);
const formatted: string = formatter.format(number);

console.log("Formatted:", formatted);

// Type-safe currency formatting
function formatCurrency(amount: number, currency: string, locale: string = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
}

console.log("USD:", formatCurrency(1234.56, "USD"));
console.log("EUR:", formatCurrency(1234.56, "EUR", "de-DE"));

// Compact notation with types
const compactOptions: Intl.NumberFormatOptions = {
  notation: "compact",
  compactDisplay: "short",
};

const compactFormatter = new Intl.NumberFormat("en-US", compactOptions);
console.log("Compact:", compactFormatter.format(1234567890));

// Unit formatting with types
const unitOptions: Intl.NumberFormatOptions = {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "long",
};

console.log(`
TypeScript Intl.NumberFormat types:
- Intl.NumberFormat: Constructor type
- Intl.NumberFormatOptions: Options interface
- style: "decimal" | "currency" | "percent" | "unit"
- notation: "standard" | "scientific" | "engineering" | "compact"
- unitDisplay: "short" | "long" | "narrow"
`);

// ============================================
// Section 2: Intl.DateTimeFormat Types
// ============================================

console.log("\n=== Intl.DateTimeFormat Types ===\n");

const date = new Date("2024-03-15T14:30:00");

// Options are fully typed
const dateFormatOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  weekday: "long",
  timeZone: "America/New_York",
};

const dateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", dateFormatOptions);

const formattedDate: string = dateFormatter.format(date);
console.log("Formatted date:", formattedDate);

// Type-safe date formatting function
function formatDate(
  date: Date,
  locale: string = "en-US",
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

console.log("Short:", formatDate(date, "en-US", { dateStyle: "short" }));
console.log("Full:", formatDate(date, "en-US", { dateStyle: "full" }));

// formatRange with types
const startDate = new Date("2024-03-15");
const endDate = new Date("2024-03-20");

const rangeFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });
const range: string = rangeFormatter.formatRange(startDate, endDate);
console.log("Date range:", range);

console.log(`
TypeScript Intl.DateTimeFormat types:
- Intl.DateTimeFormat: Constructor type
- Intl.DateTimeFormatOptions: Options interface
- dateStyle: "full" | "long" | "medium" | "short"
- timeStyle: "full" | "long" | "medium" | "short"
- weekday: "long" | "short" | "narrow"
- month: "numeric" | "2-digit" | "long" | "short" | "narrow"
`);

// ============================================
// Section 3: Intl.Collator Types
// ============================================

console.log("\n=== Intl.Collator Types ===\n");

// Collator options are fully typed
const collatorOptions: Intl.CollatorOptions = {
  numeric: true,
  sensitivity: "base",
};

const collator: Intl.Collator = new Intl.Collator("en-US", collatorOptions);

// compare method returns number
const compareResult: number = collator.compare("a", "b");
console.log("Compare result:", compareResult);

// Type-safe sorting
function sortStrings(
  strings: string[],
  locale: string = "en-US",
  options?: Intl.CollatorOptions
): string[] {
  return strings.sort(new Intl.Collator(locale, options).compare);
}

const files = ["file1.txt", "file10.txt", "file2.txt", "file20.txt"];
console.log("Sorted:", sortStrings(files, "en-US", { numeric: true }));

console.log(`
TypeScript Intl.Collator types:
- Intl.Collator: Constructor type
- Intl.CollatorOptions: Options interface
- sensitivity: "base" | "accent" | "case" | "variant"
- usage: "sort" | "search"
- numeric: boolean
`);

// ============================================
// Section 4: Intl.PluralRules Types
// ============================================

console.log("\n=== Intl.PluralRules Types ===\n");

// PluralRules options are fully typed
const pluralOptions: Intl.PluralRulesOptions = {
  type: "cardinal",
};

const pluralRules: Intl.PluralRules = new Intl.PluralRules("en-US", pluralOptions);

// select returns specific string literals
type PluralCategory = "zero" | "one" | "two" | "few" | "many" | "other";
const category: Intl.LDMLPluralRule = pluralRules.select(1);

console.log("Plural category for 1:", category);

// Type-safe pluralization
interface PluralForms {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

function pluralize(count: number, forms: PluralForms, locale: string = "en-US"): string {
  const rule = new Intl.PluralRules(locale).select(count);
  const form = forms[rule] || forms.other;
  return `${count} ${form}`;
}

console.log(pluralize(0, { one: "item", other: "items" }));
console.log(pluralize(1, { one: "item", other: "items" }));
console.log(pluralize(5, { one: "item", other: "items" }));

console.log(`
TypeScript Intl.PluralRules types:
- Intl.PluralRules: Constructor type
- Intl.PluralRulesOptions: Options interface
- Intl.LDMLPluralRule: "zero" | "one" | "two" | "few" | "many" | "other"
- type: "cardinal" | "ordinal"
`);

// ============================================
// Section 5: Intl.RelativeTimeFormat Types
// ============================================

console.log("\n=== Intl.RelativeTimeFormat Types ===\n");

// RelativeTimeFormat options are fully typed
const relativeTimeOptions: Intl.RelativeTimeFormatOptions = {
  numeric: "auto",
  style: "long",
};

const rtf: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat("en-US", relativeTimeOptions);

// format returns string
const relative: string = rtf.format(-1, "day");
console.log("Relative time:", relative);

// Type-safe relative time formatting
type RelativeTimeUnit =
  "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second";

function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string = "en-US"
): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(value, unit);
}

console.log("Yesterday:", formatRelativeTime(-1, "day"));
console.log("Tomorrow:", formatRelativeTime(1, "day"));
console.log("Last week:", formatRelativeTime(-1, "week"));

console.log(`
TypeScript Intl.RelativeTimeFormat types:
- Intl.RelativeTimeFormat: Constructor type
- Intl.RelativeTimeFormatOptions: Options interface
- Intl.RelativeTimeFormatUnit: "year" | "quarter" | "month" | "week" | "day" | "hour" | "minute" | "second"
- numeric: "always" | "auto"
- style: "long" | "short" | "narrow"
`);

// ============================================
// Section 6: Intl.ListFormat Types
// ============================================

console.log("\n=== Intl.ListFormat Types ===\n");

// ListFormat options are fully typed
const listFormatOptions: Intl.ListFormatOptions = {
  style: "long",
  type: "conjunction",
};

const listFormatter: Intl.ListFormat = new Intl.ListFormat("en-US", listFormatOptions);

const items = ["Apple", "Banana", "Orange"];
const formattedList: string = listFormatter.format(items);
console.log("Formatted list:", formattedList);

// Type-safe list formatting
function formatList(
  items: string[],
  type: Intl.ListFormatType = "conjunction",
  locale: string = "en-US"
): string {
  return new Intl.ListFormat(locale, { type }).format(items);
}

console.log("Conjunction:", formatList(items, "conjunction"));
console.log("Disjunction:", formatList(items, "disjunction"));

console.log(`
TypeScript Intl.ListFormat types:
- Intl.ListFormat: Constructor type
- Intl.ListFormatOptions: Options interface
- Intl.ListFormatType: "conjunction" | "disjunction" | "unit"
- style: "long" | "short" | "narrow"
`);

// ============================================
// Section 7: Intl.Segmenter Types (ES2022)
// ============================================

console.log("\n=== Intl.Segmenter Types (ES2022) ===\n");

// Segmenter options are fully typed
const segmenterOptions: Intl.SegmenterOptions = {
  granularity: "word",
};

const segmenter: Intl.Segmenter = new Intl.Segmenter("en-US", segmenterOptions);

const text = "Hello, world! How are you?";
const segments: Intl.Segments = segmenter.segment(text);

// Iterate with type safety
for (const segment of segments) {
  // segment: Intl.SegmentData
  const segmentText: string = segment.segment;
  const index: number = segment.index;
  const isWordLike: boolean | undefined = segment.isWordLike;

  if (isWordLike) {
    console.log("Word:", segmentText);
  }
}

// Type-safe word extraction
function extractWords(text: string, locale: string = "en-US"): string[] {
  const segmenter = new Intl.Segmenter(locale, { granularity: "word" });
  return [...segmenter.segment(text)].filter(s => s.isWordLike).map(s => s.segment);
}

console.log("Words:", extractWords(text));

console.log(`
TypeScript Intl.Segmenter types:
- Intl.Segmenter: Constructor type
- Intl.SegmenterOptions: Options interface
- Intl.Segments: Iterable of SegmentData
- Intl.SegmentData: { segment: string; index: number; input: string; isWordLike?: boolean }
- granularity: "grapheme" | "word" | "sentence"
`);

// ============================================
// Section 8: Locale Type
// ============================================

console.log("\n=== Locale Type ===\n");

// Intl.Locale provides type-safe locale handling
const locale: Intl.Locale = new Intl.Locale("en-US");

const baseName: string = locale.baseName;
const language: string = locale.language;
const region: string | undefined = locale.region;
const script: string | undefined = locale.script;

console.log("Locale info:");
console.log("Base name:", baseName);
console.log("Language:", language);
console.log("Region:", region);

// Type-safe locale options
const localeOptions: Intl.LocaleOptions = {
  calendar: "gregory",
  numberingSystem: "latn",
  hourCycle: "h12",
};

const customLocale = new Intl.Locale("en-US", localeOptions);
console.log("Calendar:", customLocale.calendar);
console.log("Numbering system:", customLocale.numberingSystem);

// ============================================
// Section 9: Type-Safe Utility Functions
// ============================================

console.log("\n=== Type-Safe Utility Functions ===\n");

// Generic formatter factory
class IntlFormatter<T extends Intl.NumberFormat | Intl.DateTimeFormat> {
  constructor(private formatter: T) {}

  format(value: T extends Intl.NumberFormat ? number : Date): string {
    return this.formatter.format(value as any);
  }
}

// Currency formatter with validation
class CurrencyFormatter {
  private formatter: Intl.NumberFormat;

  constructor(
    private currency: string,
    private locale: string = "en-US"
  ) {
    this.formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    });
  }

  format(amount: number): string {
    return this.formatter.format(amount);
  }

  getCurrency(): string {
    return this.currency;
  }
}

const usdFormatter = new CurrencyFormatter("USD");
console.log("Formatted:", usdFormatter.format(1234.56));

// Multi-locale formatter
class MultiLocaleFormatter {
  private formatters = new Map<string, Intl.NumberFormat>();

  constructor(private options: Intl.NumberFormatOptions) {}

  format(value: number, locale: string): string {
    if (!this.formatters.has(locale)) {
      this.formatters.set(locale, new Intl.NumberFormat(locale, this.options));
    }
    return this.formatters.get(locale)!.format(value);
  }
}

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use Intl.NumberFormatOptions for type-safe options");
console.log("2. Leverage type inference for formatter methods");
console.log("3. Use Intl.Locale for locale manipulation");
console.log("4. Cache formatters for better performance");
console.log("5. Use specific types (Intl.LDMLPluralRule, etc.)");
console.log("6. Create type-safe wrapper classes");

console.log("\n❌ DON'T:");
console.log("1. Don't use string literals for options (use types)");
console.log("2. Don't create formatters in loops");
console.log("3. Don't ignore locale fallbacks");
console.log("4. Don't use any type with Intl APIs");
console.log("5. Don't forget to validate currency codes");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - INTL API                                │
├─────────────────────────────────────────────────────────────────────┤
│ Options:                                                            │
│   JavaScript: Plain objects, no validation                         │
│   TypeScript: Typed interfaces with autocomplete                   │
│                                                                     │
│ Return Types:                                                       │
│   JavaScript: Inferred at runtime                                  │
│   TypeScript: Known at compile time                                │
│                                                                     │
│ Locale Handling:                                                    │
│   JavaScript: String-based                                          │
│   TypeScript: Intl.Locale type with properties                     │
│                                                                     │
│ Plural Rules:                                                       │
│   JavaScript: Returns string                                        │
│   TypeScript: Returns Intl.LDMLPluralRule                          │
│                                                                     │
│ Segmenter:                                                          │
│   JavaScript: Iterator of objects                                   │
│   TypeScript: Intl.Segments with SegmentData                       │
└─────────────────────────────────────────────────────────────────────┘
`);
