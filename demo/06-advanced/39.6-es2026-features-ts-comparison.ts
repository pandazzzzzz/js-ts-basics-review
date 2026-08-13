// @ts-nocheck
// TypeScript vs JavaScript: ES2026 Features
// 📘 For JavaScript version, see: 39.6-es2026-features.js
// Note: @ts-nocheck because ES2026 APIs (Math.sumPrecise, Uint8Array.toBase64/toHex,
// Map.upsert, Iterator.concat/toArray) are not yet in TypeScript's type definitions.

export {}; // Module

console.log("\n=== TypeScript ES2026 Features Comparison ===\n");

// ============================================
// 1. Math.sumPrecise()
// ============================================
console.log("\n--- 1. Math.sumPrecise() ---\n");

// Math.sumPrecise takes Iterable<number> and returns number
const numbers: number[] = [0.1, 0.2, 0.3, 0.4, 0.5];
const sum: number = Math.sumPrecise(numbers);
console.log("Precise sum:", sum); // 1.5

// Type safety: Only accepts iterables of numbers
const mixed = [1, 2, "3"];
// Math.sumPrecise(mixed); // ❌ Error: Type 'string' is not assignable to type 'number'

// Works with any numeric iterable
const set = new Set([1.5, 2.5, 3.5]);
const setSum: number = Math.sumPrecise(set);
console.log("Set sum:", setSum); // 7.5

// Typed arrays
const float32 = new Float32Array([0.1, 0.2, 0.3]);
const floatSum: number = Math.sumPrecise(float32);
console.log("Float32 sum:", floatSum); // 0.6

// Financial calculation example
interface Transaction {
  amount: number;
  description: string;
}

const transactions: Transaction[] = [
  { amount: 1.99, description: "Item 1" },
  { amount: 2.99, description: "Item 2" },
  { amount: 3.99, description: "Item 3" }
];

const total: number = Math.sumPrecise(transactions.map(t => t.amount));
console.log("Transaction total: $" + total.toFixed(2)); // $8.97

// ============================================
// 2. Array.fromAsync()
// ============================================
console.log("\n--- 2. Array.fromAsync() ---\n");

// Array.fromAsync is generic
async function* generateNumbers(): AsyncGenerator<number> {
  yield 1;
  yield 2;
  yield 3;
}

// Inferred return type: Promise<number[]>
// const numbersPromise = Array.fromAsync(generateNumbers());

// With map function: transform type during conversion
// const stringPromise = Array.fromAsync(generateNumbers(), n => n.toString()); // Promise<string[]>

// Works with sync iterables too, still returns promise
// const syncPromise = Array.fromAsync([1, 2, 3]); // Promise<number[]>

// Array of promises
const promiseArray: Promise<number>[] = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
// const resolved = await Array.fromAsync(promiseArray); // number[]

// Type-safe async processing
interface User {
  id: number;
  name: string;
}

async function* fetchUsers(): AsyncGenerator<User> {
  yield { id: 1, name: "Alice" };
  yield { id: 2, name: "Bob" };
}

// async function getUsers(): Promise<User[]> {
//   return Array.fromAsync(fetchUsers()); // Promise<User[]>
// }

// ============================================
// 3. Error.isError()
// ============================================
console.log("\n--- 3. Error.isError() ---\n");

// Error.isError acts as a type guard
function handleError(value: unknown): void {
  if (Error.isError(value)) {
    // value is typed as Error inside this block
    console.error("Error:", value.message);
    console.error("Stack:", value.stack);
  } else {
    console.error("Non-error value:", value);
  }
}

handleError(new Error("Test error"));
handleError("Just a string");
handleError({ message: "Fake error" });

// Custom error classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

const validationError = new ValidationError("Invalid input");
console.log("Is validation error an Error?", Error.isError(validationError)); // true

// ============================================
// 4. Uint8Array Base64/Hex Methods
// ============================================
console.log("\n--- 4. Uint8Array Base64/Hex Methods ---\n");

const data: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]); // "Hello"

// Base64
const base64: string = data.toBase64();
console.log("Base64:", base64); // "SGVsbG8="

const decodedBase64: Uint8Array = Uint8Array.fromBase64(base64);
console.log("Decoded base64:", new TextDecoder().decode(decodedBase64)); // "Hello"

// Base64 options
interface Base64Options {
  urlSafe?: boolean;
  omitPadding?: boolean;
}

const urlSafeBase64: string = data.toBase64({ urlSafe: true, omitPadding: true });
console.log("URL-safe base64:", urlSafeBase64); // "SGVsbG8"

// Hex
const hex: string = data.toHex();
console.log("Hex:", hex); // "48656c6c6f"

const decodedHex: Uint8Array = Uint8Array.fromHex(hex);
console.log("Decoded hex:", new TextDecoder().decode(decodedHex)); // "Hello"

// Type safety: fromBase64/fromHex only accept strings
// Uint8Array.fromBase64(123); // ❌ Error: Argument of type 'number' is not assignable to parameter of type 'string'

// Use case: Type-safe binary data serialization
function serializeData(data: Uint8Array): string {
  return data.toBase64();
}

function deserializeData(str: string): Uint8Array {
  try {
    return Uint8Array.fromBase64(str);
  } catch (e) {
    throw new Error("Invalid base64 data");
  }
}

// ============================================
// 5. Map.prototype.upsert()
// ============================================
console.log("\n--- 5. Map.prototype.upsert() ---\n");

// Map.upsert preserves type information
const map: Map<string, number> = new Map([["a", 1], ["b", 2]]);

// Update existing key: update function receives number, returns number
const aValue: number = map.upsert("a", 10, (old: number, key: string) => {
  console.log(`Updating key ${key}: ${old} → ${old * 2}`);
  return old * 2;
});
console.log("aValue:", aValue); // 2

// Insert new key: insert value must match map value type
const cValue: number = map.upsert("c", 3, (old) => old * 2);
console.log("cValue:", cValue); // 3

// Type safety: insert value must match map type
// map.upsert("d", "string", old => old); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// Update function must return matching type
// map.upsert("a", 10, old => old.toString()); // ❌ Error: Type 'string' is not assignable to type 'number'

// Use case: Typed counters
type CounterKey = "views" | "clicks" | "conversions";
const counters = new Map<CounterKey, number>();

function incrementCounter(key: CounterKey): number {
  return counters.upsert(key, 1, count => count + 1);
}

incrementCounter("views");
incrementCounter("views");
incrementCounter("clicks");
console.log("Counters:", Object.fromEntries(counters)); // { views: 2, clicks: 1 }

// ============================================
// 6. JSON.parse Source Text Access
// ============================================
console.log("\n--- 6. JSON.parse Source Text Access ---\n");

// JSON.parse reviver now has access to source text
interface ReviverContext {
  source: string;
}

type ReviverFn = (this: any, key: string, value: any, context: ReviverContext) => any;

// Parse numbers larger than MAX_SAFE_INTEGER as BigInt
const json = `{"small": 123, "large": 9007199254740993}`;

const parsed = JSON.parse(json, (key, value, { source }) => {
  if (typeof value === "number" && !Number.isSafeInteger(value)) {
    return BigInt(source);
  }
  return value;
});

console.log("parsed.small:", parsed.small, typeof parsed.small); // 123 number
console.log("parsed.large:", parsed.large, typeof parsed.large); // 9007199254740993n bigint

// Type-safe parsing of financial data
interface FinancialData {
  amount: string; // Exact decimal as string
  currency: string;
  timestamp: number;
}

const financialJson = `{"amount": 19.99, "currency": "USD", "timestamp": 1717209600}`;

const financialData = JSON.parse(financialJson, (key, value, { source }) => {
  if (key === "amount") {
    return source; // Preserve exact decimal as string
  }
  return value;
}) as FinancialData;

console.log("\nFinancial data:");
console.log("Amount:", financialData.amount); // "19.99" string
console.log("Currency:", financialData.currency); // "USD" string
console.log("Timestamp:", financialData.timestamp); // number

// ============================================
// 7. Iterator Sequencing
// ============================================
console.log("\n--- 7. Iterator Sequencing ---\n");

// Iterator.concat preserves type information
const iter1: Iterator<number> = [1, 2, 3].values();
const iter2: Iterator<number> = [4, 5, 6].values();
const combined: Iterator<number> = iter1.concat(iter2);
const combinedArray: number[] = combined.toArray();
console.log("Combined numbers:", combinedArray); // [1, 2, 3, 4, 5, 6]

// Concat different iterable types
function* genStrings(): Generator<string> {
  yield "a";
  yield "b";
}

const stringIter: Iterator<string> = genStrings();
const arrayStrings: string[] = ["c", "d"];
const allStrings: Iterator<string> = stringIter.concat(arrayStrings);
console.log("Combined strings:", allStrings.toArray()); // ["a", "b", "c", "d"]

// Chaining with helper methods preserves type
const result: number[] = [1, 2, 3].values()
  .concat([4, 5, 6].values())
  .filter(n => n % 2 === 0)
  .map(n => n * 2)
  .toArray();
console.log("Chained result:", result); // [4, 8, 12]

// ============================================
// 8. TypeScript-specific Enhancements
// ============================================
console.log("\n--- 8. TypeScript-specific Enhancements ---\n");

// 1. Branded types with upsert
type UserId = string & { __brand: "UserId" };
type UserData = { name: string; email: string };

const userMap = new Map<UserId, UserData>();

function updateUser(id: UserId, data: Partial<UserData>): UserData {
  return userMap.upsert(id, { name: "New User", email: "new@example.com", ...data }, (existing) => ({
    ...existing,
    ...data
  }));
}

// 2. Narrowing with Error.isError
type Result<T> = { success: true; data: T } | { success: false; error: unknown };

function handleResult<T>(result: Result<T>): void {
  if (!result.success) {
    if (Error.isError(result.error)) {
      console.error("Operation failed with error:", result.error.message);
    } else {
      console.error("Operation failed with unknown error");
    }
    return;
  }
  console.log("Operation succeeded:", result.data);
}

// 3. JSON.parse with type guards
interface ApiResponse {
  id: number;
  name: string;
  value: number;
}

function parseApiResponse(json: string): ApiResponse {
  const parsed = JSON.parse(json);
  // Validate and narrow type...
  return parsed as ApiResponse;
}

// ============================================
// 9. Configuration
// ============================================
console.log("\n--- 9. tsconfig.json Configuration ---\n");
console.log("To use ES2026 features in TypeScript:");
console.log('1. Set "target": "ES2026" or higher (TypeScript 5.7+)');
console.log('2. Add "ES2026" to "lib" array if target is lower');
console.log('3. For async iterators: Ensure "downlevelIteration" is enabled if targeting older runtimes');

console.log("\n✅ ES2026 TypeScript comparison completed");