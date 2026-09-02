// Function Patterns - Composition TypeScript Comparison
// 📘 Complementary to: 24-1-function-composition.js

// 🎯 Difficulty: Advanced
export {};

console.log("=== Function Patterns - Composition TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. CURRYING TYPES
 *    JS:  Function returns function, types inferred from calls
 *    TS:  Curry functions can be generic, preserve parameter types
 *
 * 2. FUNCTION COMPOSITION TYPES
 *    JS:  compose/pipe work with any functions
 *    TS:  compose/pipe can be generic, type inputs and outputs
 *
 * 3. HIGHER-ORDER FUNCTION TYPES
 *    JS:  Functions accept/return functions, dynamic types
 *    TS:  Can define precise HOF types: (f: (A) => B) => (C) => A
 *
 * 4. DECORATOR TYPES
 *    JS:  Wrapping functions, runtime only
 *    TS:  Decorators preserve function signatures: type Decorated<T> = T
 */

// Example 1: Typed currying
console.log("1. Typed currying:");
function addThree(a: number, b: number, c: number): number {
  return a + b + c;
}

function curried<A, B, C>(fn: (a: A, b: B, c: C) => any): (a: A) => (b: B) => (c: C) => any {
  return (a: A) => (b: B) => (c: C) => fn(a, b, c);
}

const curriedAdd: (a: number) => (b: number) => (c: number) => number = curried(addThree);
console.log("  curriedAdd(1)(2)(3):", curriedAdd(1)(2)(3));

// Example 2: Generic curry function
console.log("\n2. Generic curry function:");
function curry<T extends any[]>(fn: (...args: T) => any): (...args: any[]) => any {
  return function curried(...accumulated: any[]): any {
    if (accumulated.length >= fn.length) {
      return fn(...(accumulated as T));
    }
    return (...remaining: any[]) => curried(...accumulated, ...remaining);
  };
}

const curriedSum: any = curry(addThree);
console.log("  curriedSum(1)(2)(3):", curriedSum(1)(2)(3));

// Example 3: Function composition with types
console.log("\n3. Function composition:");
type UnaryFn<T> = (x: T) => T;

function compose<A, B, C>(f: (y: B) => C, g: (x: A) => B): (x: A) => C {
  return (x: A) => f(g(x));
}

const addOne: UnaryFn<number> = x => x + 1;
const multiplyByTwo: UnaryFn<number> = x => x * 2;
const addOneThenDouble: UnaryFn<number> = compose(multiplyByTwo, addOne);
console.log("  compose(double, addOne)(5):", addOneThenDouble(5));

// Pipe (left-to-right composition)
function pipe<A, B, C>(f: (x: A) => B, g: (y: B) => C): (x: A) => C {
  return (x: A) => g(f(x));
}

const incrementThenDouble: UnaryFn<number> = pipe(addOne, multiplyByTwo);
console.log("  pipe(addOne, double)(5):", incrementThenDouble(5));

// Example 4: Generic compose/pipe
console.log("\n4. Generic compose/pipe:");
function composeN<T>(...fns: UnaryFn<T>[]): UnaryFn<T> {
  return (x: T) => fns.reduceRight((acc, fn) => fn(acc), x);
}

function pipeN<T>(...fns: UnaryFn<T>[]): UnaryFn<T> {
  return (x: T) => fns.reduce((acc, fn) => fn(acc), x);
}

// Example 5: Partial application with types
console.log("\n5. Partial application:");
function bind<T>(fn: (...args: any[]) => T, ...fixedArgs: any[]): (...remaining: any[]) => T {
  return function (...remaining: any[]): T {
    return fn(...fixedArgs, ...remaining);
  };
}

const greet = (greeting: string, name: string, punctuation: string) =>
  `${greeting}, ${name}${punctuation}`;
const sayHello = bind(greet, "Hello");
console.log("  sayHello('World', '!'):", sayHello("World", "!"));

// Example 6: Higher-order function types
console.log("\n6. Higher-order function types:");
interface BinaryOp<T> {
  (a: T, b: T): T;
}

function multiplier<T extends number>(factor: T): BinaryOp<T> {
  return (a: T, b: T) => (a * factor) as any;
}

const double: BinaryOp<number> = multiplier(2 as number);
const triple: BinaryOp<number> = multiplier(3 as number);
console.log("  double(5, 3):", double(5, 3));
console.log("  triple(5, 3):", triple(5, 3));

// Example 7: Function factories with types
console.log("\n7. Function factories:");
type Logger = (message: string) => void;
type LoggerFactory = (level: string) => Logger;

function createLogger(level: string): Logger {
  return (message: string) => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];
    console.log(`[${timestamp}] [${level}] ${message}`);
  };
}

const info: Logger = createLogger("INFO");
const warn: Logger = createLogger("WARN");
const error: Logger = createLogger("ERROR");

console.log("  Logger created:");
info("Application started");
warn("Configuration not found");
error("Failed to connect");

// Example 8: Decorator types
console.log("\n8. Decorator types:");
type TimedFn<T> = (...args: any[]) => T;

function withTiming<T>(fn: TimedFn<T>): TimedFn<T> {
  return function (...args: any[]): T {
    const start = performance.now();
    const result = fn(...(args as any[]));
    const end = performance.now();
    console.log(`${fn.name} took ${(end - start).toFixed(2)}ms`);
    return result;
  };
}

function add(a: number, b: number): number {
  return a + b;
}

const timedAdd: TimedFn<number> = withTiming(add);
console.log("  timedAdd(5, 3):", timedAdd(5, 3));

// Example 9: Memoization with types
console.log("\n9. Memoization with types:");
type Fn<T extends any[], R> = (...args: T) => R;

function memoize<T extends any[], R>(fn: Fn<T, R>): Fn<T, R> {
  const cache = new Map<string, R>();

  return function (...args: T): R {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const fibonacci: Fn<[number], number> = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const memoizedFibonacci = memoize(fibonacci);
console.log("  memoizedFibonacci(10):", memoizedFibonacci(10));

// Example 10: Placeholder partial application
console.log("\n10. Placeholder partial application:");
const PLACEHOLDER = Symbol("placeholder");

function partialWithPlaceholders(
  fn: (...args: any[]) => any,
  ...args: any[]
): (...newArgs: any[]) => any {
  return function (...newArgs: any[]): any {
    let argIndex = 0;
    const finalArgs: any[] = args.map(arg => {
      if (arg === PLACEHOLDER) {
        return newArgs[argIndex++];
      }
      return arg;
    });
    return fn(...finalArgs, ...newArgs.slice(argIndex));
  };
}

const subtract = (a: number, b: number) => a - b;
const subtractFrom10 = partialWithPlaceholders(subtract, 10, PLACEHOLDER, PLACEHOLDER);
console.log("  subtractFrom10(3):", subtractFrom10(3));

/**
 * 📋 Key Takeaways:
 * - Currying preserves function parameter types with generics
 * - compose/pipe can be generic: compose<A, B, C>(f, g) => (x: A) => C
 * - Higher-order functions can be typed with interfaces: BinaryOp<T>
 * - Function factories return typed functions: LoggerFactory returns Logger
 * - Decorators preserve function signatures with generic types
 * - memoize can be generic: memoize<T extends any[], R>(fn) => Fn<T, R>
 */
