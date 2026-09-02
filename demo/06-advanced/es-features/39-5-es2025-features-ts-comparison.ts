// @ts-nocheck
// TypeScript vs JavaScript: ES2025 Features
// 📘 For JavaScript version, see: 39-5-es2025-features.js
// Note: @ts-nocheck because ES2025 APIs (RegExp.escape, Intl.DurationFormat,
// Float16Array, Set methods) are not yet in TypeScript's built-in type definitions.

// 🎯 Difficulty: Advanced
export {}; // Module

console.log("\n=== TypeScript ES2025 Features Comparison ===\n");

// ============================================
// 1. Set Methods
// ============================================
console.log("\n--- 1. Set Methods ---\n");

const setA: Set<number> = new Set([1, 2, 3, 4, 5]);
const setB: Set<number> = new Set([4, 5, 6, 7, 8]);
const setC: Set<number> = new Set([1, 2]);

// All set methods preserve type
const intersection: Set<number> = setA.intersection(setB);
console.log("Intersection:", [...intersection]); // number[]

const union: Set<number> = setA.union(setB);
console.log("Union:", [...union]); // number[]

const difference: Set<number> = setA.difference(setB);
console.log("Difference:", [...difference]); // number[]

const symmetricDifference: Set<number> = setA.symmetricDifference(setB);
console.log("Symmetric difference:", [...symmetricDifference]); // number[]

// Boolean checks
const isSubset: boolean = setC.isSubsetOf(setA);
console.log("Is subset:", isSubset); // true

const isSuperset: boolean = setA.isSupersetOf(setC);
console.log("Is superset:", isSuperset); // true

const isDisjoint: boolean = setA.isDisjointFrom(new Set([9, 10]));
console.log("Is disjoint:", isDisjoint); // true

// Type safety: Can't perform operations on sets of different types
const stringSet: Set<string> = new Set(["a", "b", "c"]);
// setA.intersection(stringSet); // ❌ Error: Set<number> and Set<string> are incompatible

// Chaining operations with type preservation
const result = setA
  .union(setB)
  .intersection(new Set([2, 4, 6, 8]))
  .difference(new Set([2]));
console.log("Chained result type:", typeof result); // Set<number>
console.log("Chained result:", [...result]); // [4, 6, 8]

// ============================================
// 2. Iterator Helpers
// ============================================
console.log("\n--- 2. Iterator Helpers ---\n");

// Iterator helpers preserve type information
const numbers = [1, 2, 3, 4, 5].values(); // Iterator<number>

// map transforms type
const stringIter = numbers.map(n => n.toString()); // Iterator<string>
const strings = stringIter.toArray(); // string[]
console.log("Mapped to strings:", strings); // ["1", "2", "3", "4", "5"]

// filter preserves type
const evenNumbers = [1, 2, 3, 4, 5].values().filter(n => n % 2 === 0); // Iterator<number>
const evens = evenNumbers.toArray(); // number[]
console.log("Even numbers:", evens); // [2, 4]

// Type narrowing in filter
type User = { name: string; age?: number };
const users: User[] = [{ name: "Alice", age: 30 }, { name: "Bob" }, { name: "Charlie", age: 25 }];

const usersWithAge = users.values().filter((user): user is User & { age: number } => {
  return user.age !== undefined;
}); // Iterator<User & { age: number }>

const agedUsers = usersWithAge.toArray();
// agedUsers have age property guaranteed
console.log(
  "Users with age:",
  agedUsers.map(u => `${u.name} (${u.age})`)
);

// reduce type inference
const sum = [1, 2, 3, 4].values().reduce((acc, n) => acc + n, 0); // number
console.log("Sum:", sum); // 10

const stringReduce = [1, 2, 3, 4].values().reduce((acc, n) => acc + n.toString(), ""); // string
console.log("String reduce:", stringReduce); // "1234"

// Generator type preservation
function* generateNumbers(): Generator<number> {
  yield 1;
  yield 2;
  yield 3;
}

const doubled = generateNumbers().map(n => n * 2); // Iterator<number>
console.log("Doubled generator values:", [...doubled]); // [2, 4, 6]

// ============================================
// 3. RegExp.escape()
// ============================================
console.log("\n--- 3. RegExp.escape() ---\n");

// RegExp.escape takes string and returns string
const userInput: string = "Hello. How are you? [123]";
const escaped: string = RegExp.escape(userInput);
console.log("Escaped regex:", escaped); // "Hello\. How are you\? \[123\]"

// Type safety: Only accepts strings
// RegExp.escape(123); // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'

// Use case: Type-safe search function
function search(text: string, query: string): RegExpMatchArray | null {
  const escapedQuery = RegExp.escape(query);
  const regex = new RegExp(escapedQuery, "gi");
  return text.match(regex);
}

const results = search("Hello. Test. TEST!", "test.");
console.log("Search results:", results); // ["Test.", "TEST."]

// ============================================
// 4. Promise.try()
// ============================================
console.log("\n--- 4. Promise.try() ---\n");

// Promise.try infers return type correctly
function getConfig(path: string): Promise<{ port: number; host: string }> {
  return Promise.try(() => {
    if (!path) throw new Error("Path is required"); // Sync error caught

    // Async result is typed
    return fetch(path).then(res => res.json() as Promise<{ port: number; host: string }>);
  });
}

getConfig("config.json")
  .then(config => {
    console.log("Port:", config.port); // ✅ config is typed
    console.log("Host:", config.host); // ✅ Type safe
  })
  .catch(err => {
    if (err instanceof Error) {
      console.error("Error:", err.message);
    }
  });

// Sync function example
const syncFn = (a: number, b: number) => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};

const safeDivide = (a: number, b: number): Promise<number> => {
  return Promise.try(() => syncFn(a, b));
};

safeDivide(10, 2).then(result => console.log("10 / 2 =", result)); // 5
safeDivide(10, 0).catch(err => console.error("Error:", err.message)); // Division by zero

// ============================================
// 5. Float16Array
// ============================================
console.log("\n--- 5. Float16Array ---\n");

// Float16Array is properly typed
const float16: Float16Array = new Float16Array(3);
float16[0] = 1.5;
float16[1] = Math.PI;
float16[2] = 100000;

console.log("Float16 values:", float16);
console.log("Float16 length:", float16.length); // number
console.log("Float16 byteLength:", float16.byteLength); // 6 (3 * 2 bytes)

// Compatible with other typed arrays
const buffer = float16.buffer;
const uint16 = new Uint16Array(buffer);
console.log("Uint16 view:", uint16); // 16-bit integer view of the same data

// ============================================
// 6. Import Attributes
// ============================================
console.log("\n--- 6. Import Attributes ---\n");

// TypeScript supports import attributes for JSON modules
// import config from "./config.json" with { type: "json" };
// config is typed as { [key: string]: any } or specific type if declared

// Declaration for JSON modules (in global.d.ts):
// declare module "*.json" with { type: "json" } {
//   const value: { port: number; host: string };
//   export default value;
// }

// ============================================
// 7. RegExp Improvements
// ============================================
console.log("\n--- 7. RegExp Improvements ---\n");

// Modifiers and duplicate named groups work with TypeScript
const dateRegex = /(?<date>\d{4}-\d{2}-\d{2})|(?<date>\d{2}\/\d{2}\/\d{4})/;
const match1 = "2024-01-01".match(dateRegex);
const match2 = "01/01/2024".match(dateRegex);

if (match1?.groups?.date) {
  console.log("ISO date:", match1.groups.date); // string
}

if (match2?.groups?.date) {
  console.log("US date:", match2.groups.date); // string
}

// Inline modifiers
const caseInsensitive = /(?i:hello)/g;
const matches = "Hello HELLO hello".match(caseInsensitive);
console.log("Case-insensitive matches:", matches); // string[] | null

// ============================================
// 8. Intl.DurationFormat
// ============================================
console.log("\n--- 8. Intl.DurationFormat ---\n");

// DurationFormat is fully typed
interface Duration {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

const duration: Duration = {
  years: 1,
  months: 2,
  days: 3,
  hours: 4,
  minutes: 5,
  seconds: 6,
};

const formatter = new Intl.DurationFormat("en-US", {
  style: "long",
  hours: "numeric",
  minutes: "numeric",
  seconds: "numeric",
});

const formatted: string = formatter.format(duration);
console.log("Formatted duration:", formatted); // string

// formatToParts returns typed parts
const parts = formatter.formatToParts(duration);
parts.forEach(part => {
  console.log(`Part ${part.type}: ${part.value}`); // part.type is "integer" | "literal" | "unit" etc.
});

// ============================================
// 9. TypeScript-specific Enhancements
// ============================================
console.log("\n--- 9. TypeScript-specific Enhancements ---\n");

// 1. Type-safe Set operations with branded types
type UserId = number & { __brand: "UserId" };
const userIds = new Set<UserId>([1 as UserId, 2 as UserId, 3 as UserId]);
const adminIds = new Set<UserId>([2 as UserId, 3 as UserId, 4 as UserId]);

const adminUsers = userIds.intersection(adminIds); // Set<UserId>
console.log("Admin user IDs:", [...adminUsers]); // [2, 3]

// 2. Async iterator helpers — NOT part of ES2025
// Async variants of iterator helpers (map/filter/take on AsyncIterator) were split
// out of the iterator-helpers proposal and have never advanced. There is no
// standard asyncNumbers().map().toArray() — consume async iterables with for-await:
async function* asyncNumbers(): AsyncGenerator<number> {
  yield 1;
  yield 2;
  yield 3;
}

for await (const n of asyncNumbers()) {
  if (n > 3) break;
  console.log("async iterable value:", n); // 1, 2, 3 (for-await replaces helper chaining)
}

// 3. RegExp named group type inference (TypeScript 4.9+)
const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const dateMatch = "2024-01-01".match(regex);
if (dateMatch?.groups) {
  // groups are typed as { year: string; month: string; day: string }
  const year = dateMatch.groups.year; // string
  const month = dateMatch.groups.month; // string
  const day = dateMatch.groups.day; // string
  console.log(`Date parts: ${year}/${month}/${day}`);
}

// ============================================
// 10. Configuration
// ============================================
console.log("\n--- 10. tsconfig.json Configuration ---\n");
console.log("To use ES2025 features in TypeScript:");
console.log('1. Set "target": "ES2025" or higher (TypeScript 5.4+)');
console.log('2. Add "ES2025" to "lib" array if target is lower');
console.log("3. For Set methods: Ensure TypeScript 5.4+");
console.log('4. For iterator helpers: Enable "downlevelIteration" if targeting older runtimes');

console.log("\n✅ ES2025 TypeScript comparison completed");
