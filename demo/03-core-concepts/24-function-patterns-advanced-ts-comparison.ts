// TypeScript vs JavaScript: Advanced Function Patterns Comparison
// 📘 For JavaScript examples, see: 24-function-patterns-advanced.js
//
// 📌 NOTE: This is the consolidated "all-in-one" comparison file. Focused
// sub-files (24-1 – 24-3) each carry their own -ts-comparison.ts counterpart;
// the sub-files are the recommended study path.
// This file demonstrates TypeScript-specific function pattern features

// 🎯 Difficulty: Advanced
export {};

// ============================================================================
// 1. CURRYING WITH TYPE SAFETY
// ============================================================================

// JavaScript: Currying without type safety
// function jsCurry(fn) {
//   return function curried(...args) {
//     if (args.length >= fn.length) return fn(...args);
//     return (...more) => curried(...args, ...more);
//   };
// }

// TypeScript: Typed curry function
type Curry = <T extends any[], R>(
  fn: (...args: T) => R
) => <A extends any[]>(
  ...args: A
) => A["length"] extends T["length"]
  ? R
  : <B extends any[]>(...more: B) => ReturnType<typeof curry>;

function curry<T extends any[], R>(fn: (...args: T) => R) {
  return function curried(...args: any[]): any {
    if (args.length >= fn.length) {
      return fn(...(args as T));
    }
    return (...more: any[]) => curried(...args, ...more);
  };
}

console.log("=== Typed Currying ===");
const addThree = (a: number, b: number, c: number): number => a + b + c;
const curriedAdd = curry(addThree);
console.log(curriedAdd(1)(2)(3)); // 6

// TypeScript: Function composition with type safety
type Compose = <A, B, C>(f: (b: B) => C, g: (a: A) => B) => (a: A) => C;

const compose: Compose = (f, g) => a => f(g(a));
const pipe =
  <A, B, C>(g: (a: A) => B, f: (b: B) => C) =>
  (a: A) =>
    f(g(a));

const double = (x: number): number => x * 2;
const square = (x: number): number => x * x;
const doubleThenSquare = compose(square, double);
console.log(doubleThenSquare(3)); // 36

// ============================================================================
// 2. HIGHER-ORDER FUNCTIONS WITH GENERICS
// ============================================================================

console.log("\n=== Generic Higher-Order Functions ===");

// Generic memoization
function memoize<T extends (...args: any[]) => R, R>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = JSON.stringify as unknown as (
    ...args: Parameters<T>
  ) => string
): T {
  const cache = new Map<string, R>();
  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

const expensiveCalc = memoize((n: number): number => {
  console.log(`Calculating for ${n}...`);
  return n * n;
});

console.log(expensiveCalc(5)); // Calculates
console.log(expensiveCalc(5)); // Uses cache

// Generic debounce with types
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delayMs);
  };
}

const debouncedLog = debounce((message: string) => console.log(message), 100);
debouncedLog("Hello");
debouncedLog("World"); // Only this will log after 100ms

// Generic throttle with types
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  intervalMs: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= intervalMs) {
      lastCall = now;
      fn(...args);
    }
  };
}

// ============================================================================
// 3. RESULT TYPE PATTERN
// ============================================================================

console.log("\n=== Result Type Pattern ===");

// TypeScript: Result type for explicit error handling
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

// Helper functions
const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division by zero");
  return ok(a / b);
}

const result1 = divide(10, 2);
const result2 = divide(10, 0);

if (result1.ok) {
  console.log("Result:", result1.value); // 5
}

if (!result2.ok) {
  console.log("Error:", result2.error); // "Division by zero"
}

// ============================================================================
// 4. FUNCTION OVERLOADS
// ============================================================================

console.log("\n=== Function Overloads ===");

// TypeScript: Function overload signatures
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number[], b: number[]): number[];
function add(a: any, b: any): any {
  if (typeof a === "number" && typeof b === "number") return a + b;
  if (typeof a === "string" && typeof b === "string") return a + b;
  if (Array.isArray(a) && Array.isArray(b)) return [...a, ...b];
  throw new Error("Invalid arguments");
}

console.log(add(2, 3)); // 5
console.log(add("Hello", " World")); // "Hello World"
console.log(add([1, 2], [3, 4])); // [1, 2, 3, 4]

// ============================================================================
// 5. TYPE GUARDS AND PREDICATES
// ============================================================================

console.log("\n=== Type Guards and Predicates ===");

// Type predicate functions
interface Dog {
  bark(): void;
}

interface Cat {
  meow(): void;
}

function isDog(animal: Dog | Cat): animal is Dog {
  return "bark" in animal;
}

function makeSound(animal: Dog | Cat): void {
  if (isDog(animal)) {
    animal.bark(); // TypeScript knows this is Dog
  } else {
    animal.meow(); // TypeScript knows this is Cat
  }
}

// Assertion functions
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

function processValue(value: unknown): void {
  assert(typeof value === "string", "Value must be string");
  console.log(value.toUpperCase()); // TypeScript knows value is string
}

// ============================================================================
// 6. TYPED PROMISES
// ============================================================================

console.log("\n=== Typed Promises ===");

// TypeScript: Promise with generic type parameter
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return { id, name: "User " + id };
}

// Typed async/await
async function processUsers(ids: number[]): Promise<void> {
  const users = await Promise.all(ids.map(fetchUser));
  console.log("Users:", users);
}

processUsers([1, 2, 3]);

// ============================================================================
// 7. BRANDED TYPES
// ============================================================================

console.log("\n=== Branded Types ===");

// TypeScript: Branded types for nominal typing
type UserId = number & { __brand: "UserId" };
type ProductId = number & { __brand: "ProductId" };

function createUserId(id: number): UserId {
  return id as UserId;
}

function createProductId(id: number): ProductId {
  return id as ProductId;
}

function getUser(id: UserId): void {
  console.log("Getting user", id);
}

const userId = createUserId(123);
const productId = createProductId(456);

getUser(userId); // OK
// getUser(productId); // ❌ Type error: ProductId not assignable to UserId

// ============================================================================
// 8. DECORATORS (EXPERIMENTAL)
// ============================================================================
// NOTE: Decorator example below is commented out because it runs at runtime with
// ts-node using the new TC39 decorator standard, where the descriptor parameter
// is different from the legacy decorator protocol. The @ts-expect-error comment only
// suppresses the TypeScript compilation error, not the runtime error.

console.log("\n=== Decorators ===");

// TypeScript: Method decorator (example only - not executed)
// function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;
//   descriptor.value = function(...args: any[]) {
//     console.log(`Calling ${propertyKey} with args:`, args);
//     const result = originalMethod.apply(this, args);
//     console.log(`Result:`, result);
//     return result;
//   };
// }

// class Calculator {
//   @log
//   add(a: number, b: number): number {
//     return a + b;
//   }
// }

// const calc = new Calculator();
// calc.add(2, 3); // Logs call and result

// ============================================================================
// 9. TRAMPOLINE PATTERN FOR RECURSION
// ============================================================================

// JavaScript: Trampoline without type safety
// function trampoline(fn) {
//   let result = fn();
//   while (typeof result === 'function') {
//     result = result();
//   }
//   return result;
// }

// TypeScript: Typed trampoline pattern
type Thunk<T> = () => T | Thunk<T>;

function trampoline<T>(fn: Thunk<T>): T {
  let result: T | Thunk<T> = fn();

  while (typeof result === "function") {
    result = (result as Thunk<T>)();
  }

  return result;
}

// Typed thunk creator
function thunk<T extends (...args: any[]) => any, R extends ReturnType<T>>(
  fn: T,
  ...args: Parameters<T>
): () => R {
  return () => fn(...args) as R;
}

console.log("\n=== Trampoline Pattern ===");

// Tail-recursive factorial with trampoline
function factorial(n: number, acc: number = 1): number | (() => number) {
  if (n <= 1) {
    return acc;
  }
  return thunk(factorial, n - 1, n * acc);
}

console.log(
  "Trampoline factorial(10):",
  trampoline(() => factorial(10))
); // 3628800

// Mutual recursion with trampoline
function isEven(n: number): boolean | (() => boolean | (() => boolean)) {
  if (n === 0) return true;
  return thunk(isOdd, n - 1);
}

function isOdd(n: number): boolean | (() => boolean | (() => boolean)) {
  if (n === 0) return false;
  return thunk(isEven, n - 1);
}

console.log(
  "isEven(10):",
  trampoline(() => isEven(10))
); // true
console.log(
  "isEven(9):",
  trampoline(() => isEven(9))
); // false

// ============================================================================
// 10. POINT-FREE STYLE WITH TYPES
// ============================================================================

console.log("\n=== Point-Free Style with Types ===");

// Multi-parameter pipe with generics
function pipe3<A, B, C, D>(f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): (a: A) => D {
  return a => f3(f2(f1(a)));
}

// Point-free style functions with types
const add1 = (x: number): number => x + 1;
const multiply2 = (x: number): number => x * 2;

// Regular style - explicit argument x
const regularTransform = (x: number): number => multiply2(add1(x));
console.log("Regular style:", regularTransform(5)); // 12

// Point-free style - no explicit argument
const pointFreeTransform = pipe(add1, multiply2);
console.log("Point-free style:", pointFreeTransform(5)); // 12

// TypeScript: Practical array processing with point-free style
const isEvenNumber = (x: number): boolean => x % 2 === 0;
const doubleValue = (x: number): number => x * 2;
const trim = (str: string): string => str.trim();
const toUpper = (str: string): string => str.toUpperCase();
const addPrefix =
  (prefix: string) =>
  (str: string): string =>
    `${prefix} ${str}`;

const numbers = [1, 2, 3, 4, 5];
const result = numbers.filter(isEvenNumber).map(doubleValue);
console.log("\nArray processing:", result); // [4, 8]

// Point-free data transformation pipeline
const formatName = pipe3(trim, toUpper, addPrefix("Dr."));
console.log("Name formatting:", formatName("  alice  ")); // "Dr. ALICE"

// ============================================================================
// 11. PERFORMANCE CONSIDERATIONS WITH TYPES
// ============================================================================

console.log("\n=== Performance Considerations with Types ===");

// TypeScript: Iteration vs function composition
function sumLoop(n: number): number {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += i;
  }
  return total;
}

function sumReduce(n: number): number {
  return Array.from({ length: n }, (_, i) => i).reduce((acc, val) => acc + val, 0);
}

console.log("Performance comparison (conceptual):");
console.log("- sumLoop: Direct iteration, minimal overhead");
console.log("- sumReduce: Array creation + reduce, more overhead");

// TypeScript: Memoization with max cache size (LRU-like)
function memoizeWithMaxSize<T extends (...args: any[]) => R, R>(
  fn: T,
  maxSize: number = 100,
  keyFn: (...args: Parameters<T>) => string = JSON.stringify as unknown as (
    ...args: Parameters<T>
  ) => string
): (...args: Parameters<T>) => R {
  const cache = new Map<string, R>();

  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);

    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    cache.set(key, result);
    return result;
  }) as T;
}

const cachedCalc = memoizeWithMaxSize((n: number): number => {
  console.log(`Calculating for ${n}...`);
  return n * n;
}, 3);

console.log("\nMemoization with max cache size:");
cachedCalc(1); // Calculates
expensiveCalc(2); // Calculates
expensiveCalc(3); // Calculates
expensiveCalc(4); // Calculates, evicts 1
expensiveCalc(1); // Calculates again (evicted)

// TypeScript: Lazy evaluation with types
function lazy<T>(fn: () => T): () => T {
  let evaluated = false;
  let result: T | undefined;

  return (): T => {
    if (!evaluated) {
      result = fn();
      evaluated = true;
    }
    return result!;
  };
}

const expensiveComputation = lazy(() => {
  console.log("Computing (lazy)...");
  return 42 * 42;
});

console.log("\nLazy evaluation:");
console.log("First call:", expensiveComputation()); // Logs "Computing..."
console.log("Second call:", expensiveComputation()); // No log

// TypeScript: WeakMap-based cache for GC-friendly memoization
function weakMemoize<T extends object, R>(fn: (obj: T) => R): (obj: T) => R {
  const cache = new WeakMap<T, R>();

  return (obj: T): R => {
    if (cache.has(obj)) {
      return cache.get(obj)!;
    }
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

interface DataObject {
  id: number;
  value: number;
}

const processData = weakMemoize((obj: DataObject): number => {
  console.log("Processing data...");
  return obj.value * 2;
});

const data: DataObject = { id: 1, value: 100 };
console.log("\nWeakMap memoization:");
console.log(processData(data)); // Processes
console.log(processData(data)); // Uses cache

// ============================================================================
// 12. LRU CACHE WITH GENERICS
// ============================================================================

console.log("\n=== Generic LRU Cache ===");

// TypeScript: Generic LRU Cache with proper typing
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly maxSize: number;

  constructor(maxSize: number = 100) {
    if (maxSize <= 0) {
      throw new Error("maxSize must be positive");
    }
    this.cache = new Map<K, V>();
    this.maxSize = maxSize;
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) {
      return null;
    }

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first key in Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  // Type-safe iterator
  [Symbol.iterator](): Iterator<[K, V]> {
    return this.cache[Symbol.iterator]();
  }

  // Type-safe keys iterator
  keys(): IterableIterator<K> {
    return this.cache.keys();
  }

  // Type-safe values iterator
  values(): IterableIterator<V> {
    return this.cache.values();
  }
}

// Example usage
interface User {
  id: number;
  name: string;
  email: string;
}

const userCache = new LRUCache<number, User>(3);

console.log("LRU Cache usage:");

userCache.set(1, { id: 1, name: "Alice", email: "alice@example.com" });
userCache.set(2, { id: 2, name: "Bob", email: "bob@example.com" });
userCache.set(3, { id: 3, name: "Charlie", email: "charlie@example.com" });

console.log("Cache size:", userCache.size()); // 3

// Access user 1 (moves to most recently used)
const alice = userCache.get(1);
console.log("Got user 1:", alice?.name); // "Alice"

// Add user 4 - evicts user 2 (since user 1 was just accessed)
userCache.set(4, { id: 4, name: "Diana", email: "diana@example.com" });

console.log("Has user 2?", userCache.has(2)); // false
console.log("Has user 1?", userCache.has(1)); // true

// Type safety: trying to use wrong types gives compile error
// userCache.set("string-key", { id: 5, name: "Error", email: "e@e.com" });
// const wrongType = userCache.get(1)?.nonExistentProperty;

// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== TypeScript Function Patterns Summary ===");
console.log("1. Typed curry and compose functions");
console.log("2. Generic higher-order functions");
console.log("3. Result type for explicit error handling");
console.log("4. Function overloads");
console.log("5. Type guards and assertion functions");
console.log("6. Typed Promises and async/await");
console.log("7. Branded types for nominal typing");
console.log("8. Method decorators");
console.log("9. Trampoline pattern for safe recursion");
console.log("10. Point-free style with typed compose/pipe");
console.log("11. Performance considerations (memoization, lazy evaluation)");
console.log("12. Generic LRU Cache with type safety");

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Compile-time type checking");
console.log("- Better IDE autocompletion");
console.log("- Refactoring safety");
console.log("- Self-documenting code");
console.log("- Type-safe function composition");
console.log("- GC-friendly memoization with WeakMap");
console.log("- Generic cache implementations with type safety");
