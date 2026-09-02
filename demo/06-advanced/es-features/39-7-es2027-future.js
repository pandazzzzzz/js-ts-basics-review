// ES2027 & Future Features Demo
// 📘 For TypeScript comparison, see: 39-7-es2027-future-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2027 features and upcoming proposals:
// 1. Temporal API (Date/Time overhaul)
// 2. Explicit Resource Management (using/await using)
// 3. DisposableStack / AsyncDisposableStack
// 4. Joint Iteration (Iterator.zip / zipKeyed)
// 5. Atomics.pause()
// 6. Decorators (Stage 2.7)
// 7. Other upcoming Stage 2+ proposals

// ============================================
// Table of Contents
// ============================================
// 1. Temporal API (ES2027)
// 2. Explicit Resource Management (ES2027)
// 3. Joint Iteration (ES2027)
// 4. Atomics.pause() (ES2027)
// 5. Decorators (Stage 2.7)
// 6. Other Upcoming Proposals
// 7. Common Pitfalls
// 8. Best Practices
// 9. Cross-references

console.log("\n=== ES2027 & Future Features ===\n");

// ============================================
// 1. Temporal API (ES2027)
// ============================================
console.log("\n--- 1. Temporal API (ES2027) ---\n");

/*
 * verification:
 *   feature: Temporal
 *   status: ES2027
 *   stage4Date: 2026-03
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2026-03/march-11.md#temporal-for-stage-4
 */

// Modern replacement for the Date object
// Note: Temporal is shipping in ES2027, enable with browser flags or polyfill today

// Uncomment when Temporal is available:
/*
// Current date/time
const now = Temporal.Now.plainDateTimeISO();
console.log("Now:", now.toString()); // e.g. "2026-08-05T14:30:00"

// Create specific dates
const date = Temporal.PlainDate.from("2024-01-01");
console.log("Date:", date.toString()); // "2024-01-01"
console.log("Day of week:", date.dayOfWeek); // 1 (Monday)
console.log("Day of year:", date.dayOfYear); // 1
console.log("Is in leap year:", date.inLeapYear); // true (2024 is leap year)

// Date arithmetic
const nextWeek = date.add({ days: 7 });
console.log("+7 days:", nextWeek.toString()); // "2024-01-08"

const oneMonthAgo = date.subtract({ months: 1 });
console.log("-1 month:", oneMonthAgo.toString()); // "2023-12-01"

// Durations
const duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const endTime = now.add(duration);
console.log("Now + 2h30m:", endTime.toString());

// Time zones
const zonedDate = Temporal.ZonedDateTime.from({
  year: 2024,
  month: 1,
  day: 1,
  timeZone: "America/New_York"
});
console.log("NY time:", zonedDate.toString()); // "2024-01-01T00:00:00-05:00[America/New_York]"

// Comparison
const date1 = Temporal.PlainDate.from("2024-01-01");
const date2 = Temporal.PlainDate.from("2024-12-31");
console.log("date1 < date2:", date1.since(date2).sign < 0); // true
console.log("Days between:", date1.until(date2).days); // 365
*/

console.log("Temporal API provides a modern, immutable, and easy-to-use date/time API");
console.log(
  "Replaces the problematic Date object with separate types for dates, times, durations, and zoned times"
);
console.log("No more off-by-one month errors, no more time zone confusion!");

// ============================================
// 2. Explicit Resource Management (ES2027)
// ============================================
console.log("\n--- 2. Explicit Resource Management (ES2027) ---\n");

/*
 * verification:
 *   feature: using (Explicit Resource Management)
 *   status: ES2027
 *   stage4Date: 2025-05
 *   lastVerified: 2026-09-01
 *   note: Conditional Stage 4 at 2025-05; all conditions met and advanced to full Stage 4 at 2026-05
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2025-05/may-28.md#explicit-resource-management-for-stage-4
 */

// using declaration automatically disposes resources when they go out of scope
// Resources must implement Symbol.dispose or Symbol.asyncDispose

/*
class DatabaseConnection {
  constructor(url) {
    this.url = url;
    console.log("Connected to", url);
  }

  query(sql) {
    console.log("Running query:", sql);
    return { results: [] };
  }

  // Required for using
  [Symbol.dispose]() {
    console.log("Closing connection to", this.url);
  }
}

// Usage:
{
  using db = new DatabaseConnection("postgres://localhost/db");
  const result = db.query("SELECT * FROM users");
  console.log("Query result:", result);
} // db is automatically disposed here, connection closed

// Async version for async cleanup
class AsyncFileHandle {
  constructor(path) {
    this.path = path;
    console.log("Opening file:", path);
  }

  async read() {
    console.log("Reading file:", this.path);
    return "file content";
  }

  // Required for await using
  async [Symbol.asyncDispose]() {
    console.log("Closing file:", this.path);
    // await actual file close operation
  }
}

// Usage in async function:
async function processFile() {
  await using file = new AsyncFileHandle("data.txt");
  const content = await file.read();
  console.log("File content:", content);
} // file is automatically closed here
*/

// DisposableStack for multiple resources
/*
 * verification:
 *   feature: DisposableStack
 *   status: ES2027
 *   stage4Date: 2025-05
 *   lastVerified: 2026-09-01
 *   note: Part of Explicit Resource Management; conditional Stage 4 at 2025-05, full Stage 4 at 2026-05
 *   source: https://github.com/tc39/proposal-explicit-resource-management
 */
/*
function processMultipleResources() {
  using stack = new DisposableStack();

  const db = stack.use(new DatabaseConnection("postgres://localhost/db"));
  const cache = stack.use(new RedisConnection("redis://localhost"));
  const file = stack.use(new FileHandle("output.txt"));

  // Use all resources
  // All automatically disposed in reverse order when scope exits
}
*/

console.log("Explicit Resource Management provides RAII-style automatic resource cleanup");
console.log("No more try/finally blocks for cleaning up connections, files, and other resources!");

// ============================================
// 3. Joint Iteration (ES2027)
// ============================================
console.log("\n--- 3. Joint Iteration (ES2027) ---\n");

/*
 * verification:
 *   feature: Joint Iteration
 *   status: ES2027
 *   stage4Date: 2026-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposal-joint-iteration
 */

// Iterator.zip takes ONE iterable of iterables. Mode: "shortest" (default), "longest", "strict".
// 3.1 Iterator.zip() - Iterate multiple iterables in parallel (shortest wins)
const numbers = [1, 2, 3];
const letters = ["a", "b", "c"];
const booleans = [true, false, true];

/*
for (const [num, letter, bool] of Iterator.zip([numbers, letters, booleans])) {
  console.log(`num: ${num}, letter: ${letter}, bool: ${bool}`);
}
// Output:
// num: 1, letter: a, bool: true
// num: 2, letter: b, bool: false
// num: 3, letter: c, bool: true
*/

// 3.2 Longest mode via options (no separate zipLongest method)
const longer = [1, 2, 3, 4, 5];
const shorter = ["a", "b"];

/*
for (const [num, letter] of Iterator.zip([longer, shorter], { mode: "longest" })) {
  console.log(`num: ${num}, letter: ${letter}`);
}
// Output:
// num: 1, letter: a
// num: 2, letter: b
// num: 3, letter: undefined
// num: 4, letter: undefined
// num: 5, letter: undefined
// Custom fill values: Iterator.zip([longer, shorter], { mode: "longest", padding: [0, "-"] })
*/

// 3.3 Iterator.zipKeyed() - zip the values of an object, keyed by property
const names = ["Alice", "Bob"];
const scores = [90, 85];

/*
for (const { name, score } of Iterator.zipKeyed({ name: names, score: scores })) {
  console.log(`${name}: ${score}`);
}
// Output:
// Alice: 90
// Bob: 85
*/

// Note: Array.fromPairs, Iterator.count, and Iterator.cycle are NOT part of the
// Joint Iteration proposal — its complete API is Iterator.zip + Iterator.zipKeyed.
// Use Object.fromEntries(pairs) today; collect iterators with .toArray() / spread.

console.log("Joint iteration features simplify working with multiple iterables in parallel");

// ============================================
// 4. Atomics.pause() (ES2027)
// ============================================
console.log("\n--- 4. Atomics.pause() (ES2027) ---\n");

/*
 * verification:
 *   feature: Atomics.pause
 *   status: ES2027
 *   stage4Date: 2026-05
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/HEAD/meetings/2026-05/may-19.md#atomics-pause-for-stage-4
 */

// Atomics.pause() provides a hint to the CPU that we're in a spin-wait loop
// Allows the CPU to optimize power usage and hyper-threading

/*
// Spin-wait loop example
function waitForFlag(sharedArray, index, expectedValue) {
  while (Atomics.load(sharedArray, index) !== expectedValue) {
    Atomics.pause(); // Hint that we're spinning
  }
}
*/

console.log("Atomics.pause() improves performance of spin-wait loops in multi-threaded code");
console.log("Useful in Web Workers and multi-threaded JavaScript applications");

// ============================================
// 5. Decorators (Stage 2.7)
// ============================================
console.log("\n--- 5. Decorators (Stage 2.7) ---\n");

// Decorators allow adding metadata and modifying classes, methods, properties, and parameters
// Note: Stage 2.7, expected in ES2028 or later
// TypeScript has experimental decorator support today

/*
// Class decorator
function logged(target) {
  return class extends target {
    constructor(...args) {
      super(...args);
      console.log(`Created instance of ${target.name}`);
    }
  };
}

// Method decorator
function measure(target, propertyKey, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
    const start = performance.now();
    const result = original.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };
  return descriptor;
}

// Property decorator
function readonly(target, propertyKey) {
  return {
    writable: false
  };
}

@logged
class User {
  @readonly
  id = Math.random();

  name: string;

  constructor(name) {
    this.name = name;
  }

  @measure
  doHeavyWork() {
    // Simulate work
    for (let i = 0; i < 1000000; i++) {}
    return "done";
  }
}

const user = new User("Alice"); // Logs "Created instance of User"
console.log("User ID:", user.id);
user.doHeavyWork(); // Logs "doHeavyWork took Xms"
// user.id = 123; // Error: Cannot assign to read only property 'id'
*/

console.log("Decorators provide a declarative way to add behavior to classes and their members");
console.log("Common use cases: logging, validation, caching, dependency injection, etc.");

// ============================================
// 6. Other Upcoming Proposals
// ============================================
console.log("\n--- 6. Other Upcoming Proposals ---\n");

console.log("\n📌 Stage 2 Proposals (likely future ES versions):");
console.log("1. Pipeline Operator (|>) - Functional pipelines: 'value |> func1 |> func2'");
console.log(
  "2. Module Fragments - Inline module fragments within a file: 'module fragment Utils { }'"
);

console.log("\n📌 Stage 1 Proposals (early development):");
console.log(
  "1. Pattern Matching - Match values against patterns: 'match (value) { when <pattern>: ... }'"
);
console.log("2. Decimal Type - Exact decimal arithmetic: '0.1m + 0.2m === 0.3m'");
console.log("3. Do Expressions - 'do { ... }' statement expressions");
console.log(
  "4. Composites - Deeply immutable value types (successor to Records & Tuples): '#{ x: 1, y: 2 }'"
);
console.log("5. Intl.MessageFormat - Internationalized message formatting");
console.log("6. Observable - Push-based event streams");
console.log("7. JSON Modules improvements");
console.log("8. WebAssembly JS Integration improvements");

// ============================================
// 7. Common Pitfalls
// ============================================
console.log("\n--- 7. Common Pitfalls ---\n");

// Pitfall 1: Temporal objects are immutable, all operations return new objects
// const date = Temporal.PlainDate.from("2024-01-01");
// date.add({ days: 7 }); // ❌ Doesn't modify date, returns new date
// const newDate = date.add({ days: 7 }); // ✅ Correct

// Pitfall 2: using declarations are block-scoped
// {
//   using res = getResource();
// } // res disposed here
// res.doSomething(); // ❌ Error: res is not defined

// Pitfall 3: Iterator.zip stops at the shortest iterable by default
// const a = [1, 2, 3];
// const b = [4, 5];
// Iterator.zip([a, b]) // Gives [1,4], [2,5] only
// Iterator.zip([a, b], { mode: "strict" }) // ❌ Throws TypeError when lengths differ

// Pitfall 4: Decorators are still Stage 2.7, not yet standardized
// Syntax and behavior may change before finalization

// ============================================
// 8. Best Practices
// ============================================
console.log("\n--- 8. Best Practices ---\n");

console.log("✅ Start using Temporal API for all new date/time code (use polyfill if needed)");
console.log(
  "✅ Use explicit resource management for all disposable resources (connections, files, etc.)"
);
console.log("✅ Replace manual zip implementations with Iterator.zip()");
console.log("✅ Use Atomics.pause() in spin-wait loops in multi-threaded code");
console.log("⚠️  Decorators are still experimental, use with caution in production");
console.log("⚠️  Check browser/Node.js support before using new features in production");
console.log("📅 Follow TC39 proposals for the latest updates on upcoming features");

// ============================================
// 9. Cross-references
// ============================================
console.log("\n--- 9. Cross-references ---\n");

console.log("📘 Date/Time: 12-date-time.js");
console.log("📘 Classes: 16-classes.js");
console.log("📘 Iterators/Generators: 22-iterators-generators.js");
console.log("📦 TypeScript Decorators: ../metaprogramming/47-metaprogramming.js");
console.log("📘 Atomics: ../data-processing/41-typed-arrays.js");
console.log("🌐 TC39 Proposals: https://github.com/tc39/proposals");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39-7-es2027-future-ts-comparison.ts
*/

// == verification block ==
// feature: Temporal
// stage4Date: 2026-03
// stage4DateType: exact
// source: https://github.com/tc39/notes/blob/HEAD/meetings/2026-03/march-11.md#temporal-for-stage-4
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Atomics.pause
// stage4Date: 2026-05
// stage4DateType: exact
// source: https://github.com/tc39/notes/blob/HEAD/meetings/2026-05/may-19.md#atomics-pause-for-stage-4
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Joint Iteration
// stage4Date: 2026-05
// stage4DateType: exact
// source: https://github.com/tc39/notes/blob/HEAD/meetings/2026-05/may-19.md#joint-iteration-for-stage-4
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: using (Explicit Resource Management)
// stage4Date: 2025-05
// stage4DateType: exact
// source: https://github.com/tc39/notes/blob/HEAD/meetings/2025-05/may-28.md#explicit-resource-management-for-stage-4
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: DisposableStack
// stage4Date: 2025-05
// stage4DateType: exact
// source: https://github.com/tc39/proposal-explicit-resource-management
// lastVerified: 2026-09-01
// == end verification block ==
