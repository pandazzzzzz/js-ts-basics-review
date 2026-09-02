// TypeScript vs JavaScript: Regular Expressions Comparison
// 📘 For JavaScript examples, see: 21-regex.js
// This file demonstrates TypeScript-specific typing for regular expressions

// 🎯 Difficulty: Intermediate
export {};

// ============================================================================
// 1. REGEXP TYPE
// ============================================================================

// JavaScript: RegExp without type checking
// const regex = /pattern/;

// TypeScript: RegExp type annotation
const pattern: RegExp = /[a-z]+/;
const flags: RegExp = /test/gi;

console.log("=== RegExp Type ===");
console.log(pattern.test("hello")); // true

// ============================================================================
// 2. TEMPLATE LITERAL TYPES FOR PATTERNS (TS 4.1+)
// ============================================================================

// TypeScript: Template literal types for regex pattern validation
type DigitPattern = `\\d+`;
type EmailPattern = `${string}@${string}.${string}`;

// Pattern validator type
type RegexPattern<T extends string> = T;

// Usage with compile-time pattern hints
function createRegex<T extends string>(pattern: T, flags?: string): TypedRegExp<T> {
  return new TypedRegExp(pattern, flags);
}

// Custom typed RegExp wrapper
class TypedRegExp<T extends string> {
  private regex: RegExp;
  public readonly pattern: T;

  constructor(pattern: T, flags?: string) {
    this.pattern = pattern;
    this.regex = new RegExp(pattern, flags);
  }

  test(str: string): boolean {
    return this.regex.test(str);
  }

  exec(str: string): RegExpExecArray | null {
    return this.regex.exec(str);
  }
}

console.log("\n=== Template Literal Types ===");
const digitRegex = createRegex("\\d+");
console.log(`Pattern: ${digitRegex.pattern}`);
console.log(digitRegex.test("123"));

// ============================================================================
// 3. STRING LITERAL TYPES FOR VALIDATION
// ============================================================================

// TypeScript: String literal types for pattern-based validation
type EmailString = `${string}@${string}.${string}`;
type HttpUrl = `http://${string}` | `https://${string}`;

// Type guard for email format
function isValidEmail(str: string): str is EmailString {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}

function isValidUrl(str: string): str is HttpUrl {
  return /^https?:\/\/.+/.test(str);
}

console.log("\n=== String Literal Types ===");
const email: string = "test@example.com";
if (isValidEmail(email)) {
  console.log(`Valid email: ${email}`);
}

const url: string = "https://example.com";
if (isValidUrl(url)) {
  console.log(`Valid URL: ${url}`);
}

// ============================================================================
// 4. REGEXP EXEC RETURN TYPE
// ============================================================================

// TypeScript: RegExpExecArray | null return type
function extractYear(date: string): number | null {
  const match: RegExpExecArray | null = /(\d{4})/.exec(date);
  return match ? parseInt(match[1], 10) : null;
}

// With named groups
interface DateMatchGroups {
  year: string;
  month: string;
  day: string;
}

function extractDateGroups(date: string): DateMatchGroups | null {
  const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
  const match = regex.exec(date);
  if (!match?.groups) return null;
  return {
    year: match.groups.year || "",
    month: match.groups.month || "",
    day: match.groups.day || "",
  };
}

console.log("\n=== RegExp Exec Return Type ===");
console.log(extractYear("2024-01-15")); // 2024
console.log(extractDateGroups("2024-01-15"));

// ============================================================================
// 5. MATCH RESULT TYPING
// ============================================================================

// TypeScript: RegExpMatchArray | null for match results
function findAllMatches(text: string, pattern: RegExp): string[] {
  const matches: RegExpMatchArray | null = text.match(pattern);
  return matches ?? [];
}

// With proper null handling
function findFirstMatch(text: string, pattern: RegExp): string | null {
  const match = text.match(pattern);
  if (!match) return null;
  return match[0];
}

console.log("\n=== Match Result Typing ===");
const numbers = findAllMatches("a1b2c3", /\d/g);
console.log(numbers); // ['1', '2', '3']

// ============================================================================
// 6. REPLACEMENT FUNCTION TYPING
// ============================================================================

// TypeScript: Typed replacement functions
function doubleNumbers(text: string): string {
  return text.replace(/(\d+)/g, (match: string, num: string): string => {
    return String(parseInt(num, 10) * 2);
  });
}

// Multiple capture groups
function swapWords(text: string): string {
  return text.replace(/(\w+)\s+(\w+)/g, (_match, first, second) => {
    return `${second} ${first}`;
  });
}

console.log("\n=== Replacement Function Typing ===");
console.log(doubleNumbers("Items: 5, 10, 15"));
console.log(swapWords("Hello World"));

// ============================================================================
// 7. REGEX UTILITY TYPES
// ============================================================================

// Extract all digit sequences
function extractDigits(text: string): string[] {
  const matches = text.matchAll(/\d+/g);
  return Array.from(matches, m => m[0]);
}

// Named group extraction
interface PhoneNumberMatch {
  areaCode: string;
  prefix: string;
  lineNumber: string;
}

function parsePhoneNumber(phone: string): PhoneNumberMatch | null {
  const regex = /(?<areaCode>\d{3})-(?<prefix>\d{3})-(?<lineNumber>\d{4})/;
  const match = regex.exec(phone);
  if (!match?.groups) return null;

  return {
    areaCode: match.groups.areaCode,
    prefix: match.groups.prefix,
    lineNumber: match.groups.lineNumber,
  };
}

console.log("\n=== Regex Utility Types ===");
console.log(extractDigits("Order #123, Qty: 456"));
console.log(parsePhoneNumber("123-456-7890"));

// ============================================================================
// 8. PATTERN VALIDATOR CLASS
// ============================================================================

// TypeScript: Typed pattern validator
class PatternValidator {
  private patterns: Map<string, RegExp>;

  constructor() {
    this.patterns = new Map();
  }

  addPattern(name: string, pattern: string, flags?: string): void {
    this.patterns.set(name, new RegExp(pattern, flags));
  }

  validate(name: string, value: string): boolean {
    const pattern = this.patterns.get(name);
    if (!pattern) {
      throw new Error(`Unknown pattern: ${name}`);
    }
    return pattern.test(value);
  }

  getMatch(name: string, value: string): RegExpMatchArray | null {
    const pattern = this.patterns.get(name);
    if (!pattern) return null;
    return value.match(pattern);
  }
}

const validator = new PatternValidator();
validator.addPattern("email", "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
validator.addPattern("phone", "^\\d{3}-\\d{3}-\\d{4}$");
validator.addPattern("date", "^\\d{4}-\\d{2}-\\d{2}$");

console.log("\n=== Pattern Validator Class ===");
console.log(`Email valid: ${validator.validate("email", "test@example.com")}`);
console.log(`Phone valid: ${validator.validate("phone", "123-456-7890")}`);
console.log(`Date valid: ${validator.validate("date", "2024-01-15")}`);

// ============================================================================
// 9. ASYNC PATTERN MATCHING
// ============================================================================

// TypeScript: Async pattern matching utility
async function* matchAllAsync(text: string, pattern: RegExp): AsyncGenerator<RegExpExecArray> {
  const regex = new RegExp(
    pattern.source,
    pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g"
  );

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    yield match;
    if (match[0].length === 0) regex.lastIndex++;
  }
}

console.log("\n=== Async Pattern Matching ===");
(async () => {
  const text = "Contact us at support@example.com or sales@test.org";
  const emailPattern = /\w+@\w+\.\w+/g;

  for await (const match of matchAllAsync(text, emailPattern)) {
    console.log(`Found email: ${match[0]}`);
  }
})();

// ============================================================================
// 10. TYPE-SAFE REGEX BUILDER
// ============================================================================

// Fluent regex builder with types
class RegexBuilder {
  private pattern: string = "";
  private flags: string = "";

  startOfLine(): this {
    this.pattern += "^";
    return this;
  }

  endOfLine(): this {
    this.pattern += "$";
    return this;
  }

  digits(count?: number): this {
    if (count) {
      this.pattern += `\\d{${count}}`;
    } else {
      this.pattern += "\\d+";
    }
    return this;
  }

  letters(count?: number): this {
    if (count) {
      this.pattern += `[a-zA-Z]{${count}}`;
    } else {
      this.pattern += "[a-zA-Z]+";
    }
    return this;
  }

  literal(str: string): this {
    this.pattern += str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return this;
  }

  group(builder: () => RegexBuilder): this {
    const inner = builder();
    this.pattern += `(${inner.toString().slice(1, -inner.flags.length - 1)})`;
    return this;
  }

  optional(): this {
    this.pattern += "?";
    return this;
  }

  zeroOrMore(): this {
    this.pattern += "*";
    return this;
  }

  oneOrMore(): this {
    this.pattern += "+";
    return this;
  }

  caseInsensitive(): this {
    if (!this.flags.includes("i")) {
      this.flags += "i";
    }
    return this;
  }

  global(): this {
    if (!this.flags.includes("g")) {
      this.flags += "g";
    }
    return this;
  }

  build(): RegExp {
    return new RegExp(this.pattern, this.flags);
  }

  toString(): string {
    return `/${this.pattern}/${this.flags}`;
  }
}

console.log("\n=== Type-safe Regex Builder ===");
const phoneRegex = new RegexBuilder()
  .startOfLine()
  .digits(3)
  .literal("-")
  .digits(3)
  .literal("-")
  .digits(4)
  .endOfLine()
  .build();

console.log(phoneRegex);
console.log(phoneRegex.test("123-456-7890"));

// ============================================================================
// 11. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Regular Expressions ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ RegExp type                │       ✗         │       ✓         │
│ Template literal patterns  │       ✗         │       ✓         │
│ String literal validation  │       ✗         │       ✓         │
│ Exec return typing         │  Inferred       │  Explicit      │
│ Match result typing        │  Inferred       │  Explicit      │
│ Replacement function types │  Inferred       │  Typed         │
│ Named group types          │  Runtime only   │  Interface     │
│ Async pattern matching     │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Regex mechanics            │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds RegExp type annotation
2. Template literal types enable pattern hints
3. Match results have explicit null handling
4. Named groups can be typed with interfaces
5. Runtime regex behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
