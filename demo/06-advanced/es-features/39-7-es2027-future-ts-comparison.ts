// @ts-nocheck
// TypeScript vs JavaScript: ES2027 & Future Features
// 📘 For JavaScript version, see: 39-7-es2027-future.js
// Note: @ts-nocheck because ES2027 APIs (Temporal, Explicit Resource Management)
// are not yet fully in TypeScript's type definitions.
/// <reference lib="esnext.disposable" />
/// <reference lib="esnext.decorators" />

// 🎯 Difficulty: Advanced
export {}; // Module

console.log("\n=== TypeScript ES2027 & Future Features Comparison ===\n");

// ============================================
// 1. Temporal API
// ============================================
console.log("\n--- 1. Temporal API ---\n");

// TypeScript provides full type definitions for Temporal
/*
import { Temporal } from "@js-temporal/polyfill";

// All Temporal types are strongly typed
const now: Temporal.PlainDateTime = Temporal.Now.plainDateTimeISO();
console.log("Now:", now.toString());

const date: Temporal.PlainDate = Temporal.PlainDate.from("2024-01-01");
console.log("Date:", date.toString());
console.log("Day of week:", date.dayOfWeek); // 1-7, typed as number
console.log("Is leap year:", date.inLeapYear); // boolean

// Date arithmetic returns correct types
const nextWeek: Temporal.PlainDate = date.add({ days: 7 });
console.log("Next week:", nextWeek.toString());

const duration: Temporal.Duration = Temporal.Duration.from({ hours: 2, minutes: 30 });
const endTime: Temporal.PlainDateTime = now.add(duration);
console.log("End time:", endTime.toString());

// Type-safe comparison
const date1: Temporal.PlainDate = Temporal.PlainDate.from("2024-01-01");
const date2: Temporal.PlainDate = Temporal.PlainDate.from("2024-12-31");
const difference: Temporal.Duration = date1.until(date2);
console.log("Days between:", difference.days); // number

// Zoned date times
const zoned: Temporal.ZonedDateTime = Temporal.ZonedDateTime.from({
  year: 2024,
  month: 1,
  day: 1,
  timeZone: "America/New_York"
});
console.log("Zoned date:", zoned.toString());
console.log("Time zone:", zoned.timeZoneId); // string
*/

console.log(
  "Temporal API has full TypeScript support with strong typing for all date/time operations"
);
console.log("Eliminates entire classes of date/time bugs through type safety");

// ============================================
// 2. Explicit Resource Management
// ============================================
console.log("\n--- 2. Explicit Resource Management ---\n");

// TypeScript supports the Disposable and AsyncDisposable interfaces
interface DatabaseConnection {
  query(sql: string): { results: any[] };
}

class PostgresConnection implements Disposable {
  constructor(private url: string) {
    console.log("Connected to", url);
  }

  query(sql: string): { results: any[] } {
    console.log("Running query:", sql);
    return { results: [] };
  }

  [Symbol.dispose](): void {
    console.log("Closing connection to", this.url);
  }
}

// using declaration works with type checking
/*
{
  using db = new PostgresConnection("postgres://localhost/db");
  // db is typed as PostgresConnection
  const result = db.query("SELECT * FROM users");
  console.log("Result count:", result.results.length);
} // db disposed here
*/

// Async disposable
class AsyncFileHandle implements AsyncDisposable {
  constructor(private path: string) {
    console.log("Opening file:", path);
  }

  async read(): Promise<string> {
    console.log("Reading file:", this.path);
    return "file content";
  }

  async [Symbol.asyncDispose](): Promise<void> {
    console.log("Closing file:", this.path);
    // await actual close operation
  }
}

/*
async function processFile(): Promise<void> {
  await using file = new AsyncFileHandle("data.txt");
  // file is typed as AsyncFileHandle
  const content = await file.read();
  console.log("Content:", content);
} // file disposed here
*/

// DisposableStack is typed
/*
function processResources(): void {
  using stack = new DisposableStack();
  const db = stack.use(new PostgresConnection("postgres://localhost/db"));
  // db is typed as PostgresConnection
  db.query("SELECT 1");
}
*/

// Custom disposable types
interface TempFile extends Disposable {
  path: string;
  write(data: string): void;
}

function createTempFile(): TempFile {
  const path = `/tmp/${Math.random().toString(36).slice(2)}`;
  console.log("Created temp file:", path);

  return {
    path,
    write(data: string): void {
      console.log("Writing to", path, ":", data);
    },
    [Symbol.dispose](): void {
      console.log("Deleting temp file:", path);
    },
  };
}

/*
{
  using tempFile = createTempFile();
  tempFile.write("test data");
  // tempFile.path is accessible, typed as string
  // tempFile.write() is type safe
} // Temp file automatically deleted
*/

// ============================================
// 3. Joint Iteration
// ============================================
console.log("\n--- 3. Joint Iteration ---\n");

// Iterator.zip takes ONE iterable of iterables and preserves tuple types
/*
const numbers: number[] = [1, 2, 3];
const letters: string[] = ["a", "b", "c"];
const booleans: boolean[] = [true, false, true];

for (const [num, letter, bool] of Iterator.zip([numbers, letters, booleans])) {
  // num is number, letter is string, bool is boolean
  console.log(num.toFixed(0), letter.toUpperCase(), bool.valueOf());
}
*/

// Longest mode via options (no separate zipLongest method); extra slots become undefined
/*
const longer: number[] = [1, 2, 3, 4, 5];
const shorter: string[] = ["a", "b"];

for (const [num, letter] of Iterator.zip([longer, shorter], { mode: "longest" })) {
  // num is number, letter is string | undefined
  console.log(num, letter?.toUpperCase());
}
*/

// Iterator.zipKeyed preserves the value type of each key
/*
const names: string[] = ["Alice", "Bob"];
const scores: number[] = [90, 85];

for (const { name, score } of Iterator.zipKeyed({ name: names, score: scores })) {
  // name is string, score is number
  console.log(`${name}: ${score}`);
}
*/

// ============================================
// 4. Atomics.pause()
// ============================================
console.log("\n--- 4. Atomics.pause() ---\n");

// Atomics.pause is typed correctly
function waitForFlag(sab: SharedArrayBuffer, index: number, expected: number): void {
  const int32 = new Int32Array(sab);
  while (Atomics.load(int32, index) !== expected) {
    Atomics.pause(); // No return value
  }
}

console.log("Atomics.pause() has proper type definitions in TypeScript");

// ============================================
// 5. Decorators (Stage 2.7)
// ============================================
console.log("\n--- 5. Decorators (Stage 2.7) ---\n");

// TypeScript has supported decorators for a long time (experimental) and now supports standard decorators

// Class decorator type
type ClassDecorator = <T extends new (...args: any[]) => any>(target: T) => T | void;

function logged<T extends new (...args: any[]) => any>(target: T): T {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      console.log(`Created instance of ${target.name}`);
    }
  };
}

// Method decorator type
type MethodDecorator = <T>(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

function measure<T>(
  target: any,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => T>
): TypedPropertyDescriptor<(...args: any[]) => T> {
  const original = descriptor.value!;
  descriptor.value = function (...args: any[]): T {
    const start = performance.now();
    const result = original.apply(this, args);
    const end = performance.now();
    console.log(`${String(propertyKey)} took ${end - start}ms`);
    return result;
  };
  return descriptor;
}

// Property decorator
function readonly(target: any, propertyKey: string | symbol): void {
  Object.defineProperty(target, propertyKey, {
    writable: false,
  });
}

// Decorator applications below are commented out — ts-node ESM does NOT transpile
// Stage 2.7 decorators, so an active `@` crashes at runtime. The decorator
// factories above are illustrative; compile with tsc (target esnext, lib
// esnext.decorators) or run in a supporting runtime to exercise them.
// @logged
class User {
  // @readonly
  id: number = Math.random();

  name: string;

  constructor(name: string) {
    this.name = name;
  }

  // @measure
  doHeavyWork(): string {
    for (let i = 0; i < 1000000; i++) {}
    return "done";
  }
}

const user = new User("Alice");
console.log("User ID:", user.id);
user.doHeavyWork();
// user.id = 123; // ❌ Error: Cannot assign to 'id' because it is a read-only property.

// Decorator metadata (with experimentalDecorators and emitDecoratorMetadata)
// TypeScript can emit type metadata for decorators to use

// ============================================
// 6. TypeScript-specific Future Features
// ============================================
console.log("\n--- 6. TypeScript-specific Future Features ---\n");

console.log("🔮 TypeScript is always evolving alongside JavaScript:");
console.log("1. Type-Level Programming improvements");
console.log("2. Better type inference for patterns and destructuring");
console.log("3. Performance improvements for large projects");
console.log("4. Better integration with build tools and bundlers");
console.log("5. Enhanced type checking for Web APIs");

// ============================================
// 7. Configuration
// ============================================
console.log("\n--- 7. tsconfig.json Configuration ---\n");
console.log("To use ES2027 features in TypeScript:");
console.log('1. No "ES2027" lib exists yet — use "ESNext" plus polyfill/feature types');
console.log('2. For Explicit Resource Management: Add "ESNext.Disposable" to lib');
console.log('3. For Decorators: Set "experimentalDecorators": false (use standard decorators)');
console.log('   Or "experimentalDecorators": true for legacy TypeScript decorators');
console.log("4. For Temporal: Install @js-temporal/polyfill and add its types");

console.log("\n✅ ES2027 & Future Features TypeScript comparison completed");
