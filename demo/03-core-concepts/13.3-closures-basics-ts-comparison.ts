// Closures Basics TypeScript Comparison
// 📘 Complementary to: 13.3-closures-basics.js

export {};

console.log("=== Closures Basics TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. CLOSURES WITH TYPE INFERENCE
 *    JS:  Closures capture values; type is determined at runtime
 *    TS:  TypeScript preserves type information through closures:
 *         function createCounter(initial: number) {
 *           let count = initial; // TypeScript infers 'number'
 *           return () => ++count; // Return type inferred as () => number
 *         }
 *
 * 2. GENERIC CLOSURES
 *    TS:  Create type-safe, reusable closures with generics:
 *         function createIdentity<T>(initial: T): () => T {
 *           return () => initial;
 *         }
 *         const getId = createIdentity<string>("hello");
 *         // getId is inferred as () => string
 *
 * 3. READONLY CLOSURES
 *    TS:  'as const' narrows literal types and makes values readonly:
 *         const config = { timeout: 5000 } as const;
 *         // config: { readonly timeout: 5000 }
 *         This affects how values are inferred through closures.
 *
 * 4. PRIVATE VS #PRIVATE
 *    ⚠️  COMMON CONFUSION POINT:
 *    - TypeScript's 'private' is compile-time only (erased at runtime)
 *    - JavaScript # private fields are runtime (true privacy, ES2022)
 *    Both work with closures but have different enforcement levels.
 *
 * 5. RETURN TYPE INFERENCE
 *    TS:  Return types of closures are automatically inferred:
 *         const adder = (a: number) => (b: number) => a + b;
 *         // adder: (a: number) => (b: number) => number
 */

// Example 1: Type inference in closures
console.log("1. Type inference in closures:");
function createCounter(initial: number) {
  let count = initial; // TS infers 'number'
  return () => ++count; // Return type: () => number
}

const counter = createCounter(10);
console.log("  createCounter(10) returns a () => number function");
console.log("  counter():", counter()); // 11
console.log("  counter():", counter()); // 12

// Example 2: Generic closures
console.log("\n2. Generic closures:");
function createIdentity<T>(initial: T): () => T {
  return () => initial;
}

const getId = createIdentity<string>("abc123");
const getNum = createIdentity<number>(42);
console.log("  createIdentity<string>('abc123')():", getId());
console.log("  createIdentity<number>(42)():", getNum());

// Example 3: as const with closures
console.log("\n3. as const with closures:");
function createConfig() {
  const settings = {
    timeout: 5000,
    retries: 3,
  } as const; // Narrow to literal types, make readonly

  return {
    getSetting: (key: keyof typeof settings) => settings[key],
  };
}

const config = createConfig();
console.log("  getSetting('timeout'):", config.getSetting("timeout"));
console.log("  settings are readonly and type-narrowed");

// Example 4: Closure return type inference
console.log("\n4. Return type inference:");
const adder = (a: number) => (b: number) => a + b;
const add5 = adder(5);
console.log("  adder(5) creates (b: number) => number");
console.log("  add5(3):", add5(3)); // 8

/**
 * 📋 Key Takeaways:
 * - TS automatically infers types in closures
 * - Generic closures enable type-safe, reusable patterns
 * - 'as const' narrows types and adds readonly behavior
 * - TypeScript 'private' is compile-time only; JS # is runtime
 * - Return types of higher-order functions are fully inferred
 */
