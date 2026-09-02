// TypeScript vs JavaScript: ES2021 Features
// 📘 For JavaScript version, see: 39-1-es2021-features.js
/// <reference lib="es2021" />

// 🎯 Difficulty: Intermediate
export {}; // Module

console.log("\n=== TypeScript ES2021 Features Comparison ===\n");

// ============================================
// 1. String.prototype.replaceAll()
// ============================================
console.log("\n--- 1. String.prototype.replaceAll() ---\n");

// TypeScript fully supports replaceAll() with proper type inference
const str: string = "foo foo foo";
const replaced: string = str.replaceAll("foo", "bar");
console.log("replaceAll result:", replaced); // "bar bar bar"
console.log("Type of replaced:", typeof replaced); // string

// Type safety: replaceAll only works on string types
const num = 12345;
// num.replaceAll("1", "9"); // ❌ Error: Property 'replaceAll' does not exist on type 'number'

// ============================================
// 2. Logical Assignment Operators
// ============================================
console.log("\n--- 2. Logical Assignment Operators ---\n");

// TypeScript correctly narrows types with logical assignment
type User = { name: string; age?: number };
let user: User | null = { name: "Alice" };

// ||= assignment
user ||= { name: "Default User" };
console.log("After ||=:", user);
// TypeScript now knows user is definitely User (not null)
console.log("User name:", user.name); // No type error!

// ??= assignment with nullish values
let config: { port?: number; host?: string } = { port: 0 };
config.port ??= 3000; // 0 is preserved (not null/undefined)
config.host ??= "localhost"; // undefined, so assigned
console.log("Config:", config);
console.log("Type of port:", typeof config.port); // number

// Type safety: can't assign wrong type
let count: number | null = 0;
// count ||= "10"; // ❌ Error: Type 'string' is not assignable to type 'number'

// Type narrowing example
function getValue(): number | null {
  return Math.random() > 0.5 ? 42 : null;
}

let value = getValue();
value ??= 0;
// Now value is definitely number, no need for ! operator
console.log("Value doubled:", value * 2); // ✅ No type error

// ============================================
// 3. Numeric Separators
// ============================================
console.log("\n--- 3. Numeric Separators ---\n");

// Numeric separators are purely syntactic, TypeScript treats them as regular numbers
const largeNumber = 1_000_000_000;
console.log("Large number:", largeNumber); // 1000000000
console.log("Type:", typeof largeNumber); // number

// Type checking works correctly
const hex: number = 0xff_ee_dd;
const binary: number = 0b1010_1010;
const pi: number = 3.1415_9265;

// Can be used in type-level numeric literals (TypeScript 4.5+)
type StatusCode = 200 | 400 | 404 | 500;
const ok: StatusCode = 200;
const notFound: StatusCode = 404;
// const invalid: StatusCode = 401; // ❌ Error: Type '401' is not assignable to type 'StatusCode'

// ============================================
// 4. WeakRef and FinalizationRegistry
// ============================================
console.log("\n--- 4. WeakRef and FinalizationRegistry ---\n");

// TypeScript provides generic types for WeakRef
interface CacheEntry {
  data: string;
  timestamp: number;
}

const target: CacheEntry = { data: "cached data", timestamp: Date.now() };
const weakRef: WeakRef<CacheEntry> = new WeakRef(target);

// deref() returns T | undefined, TypeScript enforces checking
const entry = weakRef.deref();
if (entry) {
  // entry is CacheEntry here
  console.log("Cached data:", entry.data);
  console.log("Timestamp:", entry.timestamp);
} else {
  console.log("Entry expired");
}

// FinalizationRegistry also has generic types
const registry = new FinalizationRegistry<string>((id: string) => {
  console.log(`Cleaning up cache entry: ${id}`);
});

const entryObj: CacheEntry = { data: "test", timestamp: Date.now() };
registry.register(entryObj, "entry-123");

// ============================================
// 5. ES2021 Library Additions
// ============================================
console.log("\n--- 5. ES2021 Library Additions ---\n");

// Promise.any (covered in detail in 30-promises-ts-comparison.ts)
const p1 = Promise.reject("Error 1");
const p2 = Promise.resolve("Success");
const p3 = Promise.reject("Error 2");

Promise.any([p1, p2, p3])
  .then((result: string) => console.log("First resolved:", result))
  .catch((error: AggregateError) => console.log("All rejected:", error.errors));

// AggregateError type
const aggregateError = new AggregateError([new Error("1"), new Error("2")], "Multiple errors");
console.log("AggregateError message:", aggregateError.message);
console.log("Number of errors:", aggregateError.errors.length);

// ============================================
// 6. TypeScript-specific Enhancements
// ============================================
console.log("\n--- 6. TypeScript-specific Enhancements ---\n");

// 1. Template Literal Types (TypeScript 4.1+) work great with string methods
type Path = `/api/${string}`;
const apiPath: Path = `/api/users`;
const normalizedPath = apiPath.replaceAll("//", "/"); // Still type Path

// 2. Strict Null Checks with logical assignment
interface Settings {
  theme?: "light" | "dark";
  fontSize?: number;
}

const settings: Settings = {};
settings.theme ??= "light"; // Type is now "light" | "dark"
settings.fontSize ||= 16; // Type is now number

// 3. Type safety for replaceAll with regex
const regex = /foo/g; // Must have g flag for replaceAll
const text = "foo foo";
const result = text.replaceAll(regex, "bar"); // ✅ Works
// const badRegex = /foo/;
// text.replaceAll(badRegex, "bar"); // ❌ Type error: missing g flag

// ============================================
// 7. Configuration
// ============================================
console.log("\n--- 7. tsconfig.json Configuration ---\n");
console.log("To use ES2021 features in TypeScript:");
console.log('1. Set "target": "ES2021" or higher in tsconfig.json');
console.log('2. Add "ES2021" to "lib" array if target is lower');
console.log('3. Ensure "module" supports ES modules if needed');

// Example tsconfig snippet:
/*
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["ES2021", "DOM"],
    "module": "ESNext"
  }
}
*/

console.log("\n✅ ES2021 TypeScript comparison completed");
