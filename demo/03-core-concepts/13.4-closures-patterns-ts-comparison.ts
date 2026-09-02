// Closure Patterns TypeScript Comparison
// 📘 Complementary to: 13.4-closures-patterns.js

// 🎯 Difficulty: Advanced
export {};

console.log("=== Closure Patterns TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. FUNCTION FACTORIES WITH TYPE SAFETY
 *    JS:  Factory functions return closures; types are dynamic
 *    TS:  Type-safe factories with parameterized return types:
 *         function createMultiplier(factor: number): (n: number) => number {
 *           return (n: number) => n * factor;
 *         }
 *
 * 2. TYPED PARTIAL APPLICATION
 *    TS:  Preserve type safety through partial application:
 *         function partial<A, B, C>(fn: (a: A, b: B) => C, a: A): (b: B) => C {
 *           return (b: B) => fn(a, b);
 *         }
 *
 * 3. MEMOIZATION WITH TYPE PRESERVATION
 *    TS:  Generic memoizer preserves input/output type relationships:
 *         function memoize<T extends (...args: any[]) => any>(fn: T): T {
 *           const cache = new Map<string, ReturnType<T>>();
 *           return ((...args: Parameters<T>) => {
 *             const key = JSON.stringify(args);
 *             if (cache.has(key)) return cache.get(key)!;
 *             const result = fn(...args);
 *             cache.set(key, result);
 *             return result;
 *           }) as T;
 *         }
 *
 * 4. MODULE PATTERN VS NAMESPACES
 *    JS:  Module pattern uses IIFE + closures
 *    TS:  Prefer namespaces or ES6 modules (with better tooling):
 *         namespace Utils {
 *           export function add(a: number, b: number): number { ... }
 *         }
 *
 * 5. CURRYING WITH TYPE INFERENCE
 *    TS:  Automatic type inference for curried functions:
 *         const add = (a: number) => (b: number) => a + b;
 *         // (a: number) => (b: number) => number
 */

// Example 1: Type-safe function factories
console.log("1. Type-safe function factories:");
function createMultiplier(factor: number): (n: number) => number {
  return (n: number) => n * factor;
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log("  double(5):", double(5)); // 10
console.log("  triple(5):", triple(5)); // 15
console.log("  double is typed as (n: number) => number");

// Example 2: Typed partial application
console.log("\n2. Typed partial application:");
function partial<A, B, C>(fn: (a: A, b: B) => C, a: A): (b: B) => C {
  return (b: B) => fn(a, b);
}

const add = (a: number, b: number): number => a + b;
const add5 = partial(add, 5);
console.log("  add5(10):", add5(10)); // 15
console.log("  add5 preserves type safety: (b: number) => number");

// Example 3: Generic memoization
console.log("\n3. Generic memoization:");
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const expensive = (n: number): number => {
  console.log("  Computing...");
  return n * n;
};
const memoized = memoize(expensive);

console.log("  First call (computes):", memoized(5));
console.log("  Second call (cached):", memoized(5));
console.log("  Memoizer preserves exact input/output types");

// Example 4: Namespaces as module pattern alternative
console.log("\n4. Namespaces:");
namespace Calculator {
  export function add(a: number, b: number): number {
    return a + b;
  }
  export function multiply(a: number, b: number): number {
    return a * b;
  }
}

console.log("  Calculator.add(2, 3):", Calculator.add(2, 3));
console.log("  Calculator.multiply(2, 3):", Calculator.multiply(2, 3));
console.log("  Namespaces provide type-safe encapsulation");

// Example 5: Currying with type inference
console.log("\n5. Currying with type inference:");
const curriedAdd = (a: number) => (b: number) => (c: number) => a + b + c;
console.log("  curriedAdd(1)(2)(3):", curriedAdd(1)(2)(3)); // 6
console.log("  Type: (a: number) => (b: number) => (c: number) => number");

/**
 * 📋 Key Takeaways:
 * - Function factories preserve full type safety
 * - Partial application maintains type relationships
 * - Generic memoizers preserve exact input/output types
 * - Namespaces are TS's type-safe alternative to module pattern
 * - Curried functions have fully inferred types
 */
