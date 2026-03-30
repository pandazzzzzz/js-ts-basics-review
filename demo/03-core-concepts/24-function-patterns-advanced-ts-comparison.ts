// TypeScript vs JavaScript: Advanced Function Patterns Comparison
// 📘 For JavaScript examples, see: 24-function-patterns-advanced.js
// This file demonstrates TypeScript-specific function pattern features

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
type Curry = <T extends any[], R>(fn: (...args: T) => R) =>
  <A extends any[]>(...args: A) =>
    A['length'] extends T['length']
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

const compose: Compose = (f, g) => (a) => f(g(a));
const pipe = <A, B, C>(g: (a: A) => B, f: (b: B) => C) => (a: A) => f(g(a));

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
  keyFn: (...args: Parameters<T>) => string = JSON.stringify
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
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

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
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  if (typeof a === 'string' && typeof b === 'string') return a + b;
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
  return 'bark' in animal;
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
  assert(typeof value === 'string', 'Value must be string');
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
type UserId = number & { __brand: 'UserId' };
type ProductId = number & { __brand: 'ProductId' };

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

  while (typeof result === 'function') {
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

console.log("Trampoline factorial(10):", trampoline(() => factorial(10))); // 3628800

// Mutual recursion with trampoline
function isEven(n: number): boolean | (() => boolean | (() => boolean)) {
  if (n === 0) return true;
  return thunk(isOdd, n - 1);
}

function isOdd(n: number): boolean | (() => boolean | (() => boolean)) {
  if (n === 0) return false;
  return thunk(isEven, n - 1);
}

console.log("isEven(10):", trampoline(() => isEven(10))); // true
console.log("isEven(9):", trampoline(() => isEven(9))); // false


// ============================================================================
// 8. DECORATORS (EXPERIMENTAL)
// ============================================================================

console.log("\n=== Decorators ===");

// TypeScript: Method decorator
function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`Calling ${propertyKey} with args:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

const calc = new Calculator();
calc.add(2, 3); // Logs call and result


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

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Compile-time type checking");
console.log("- Better IDE autocompletion");
console.log("- Refactoring safety");
console.log("- Self-documenting code");
