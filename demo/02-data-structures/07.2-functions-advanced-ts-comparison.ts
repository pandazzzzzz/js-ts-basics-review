// Functions - Advanced TypeScript Comparison
// 📘 Complementary to: 07.2-functions-advanced.js

// 🎯 Difficulty: Intermediate
export {};

console.log("=== Functions - Advanced TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. HIGHER-ORDER FUNCTION TYPES
 *    JS:  Functions accept/return functions, runtime types
 *    TS:  Can define precise function types: (f: (A) => B) => (C) => A
 *
 * 2. CLOSURE TYPES
 *    JS:  Closures capture values, runtime only
 *    TS:  Captured values have known types, closure types inferred
 *
 * 3. ASYNC FUNCTION TYPES
 *    JS:  async function() {} returns Promise
 *    TS:  async function(): Promise<T> with generic type parameter
 *
 * 4. GENERATOR FUNCTION TYPES
 *    JS:  function* yield {} returns Generator
 *    TS:  Generator<T, TReturn, TNext> with typed yields and return
 */

// Example 1: Higher-order function types
console.log("1. Higher-order function types:");
function repeat<T>(times: number, action: (i: number) => T): void {
  for (let i = 0; i < times; i++) {
    action(i);
  }
}

repeat(3, (i: number) => console.log(`  Iteration ${i}`));

type MultiplierFn = (n: number) => number;
function createMultiplier(factor: number): MultiplierFn {
  return (n: number): number => n * factor;
}

const double: MultiplierFn = createMultiplier(2);
const triple: MultiplierFn = createMultiplier(3);
console.log("  double(5):", double(5));
console.log("  triple(5):", triple(5));

type UnaryFn<T> = (x: T) => T;
function compose<A, B, C>(f: (y: B) => C, g: (x: A) => B): (x: A) => C {
  return (x: A) => f(g(x));
}

const addOne: UnaryFn<number> = x => x + 1;
const multiplyByTwo: UnaryFn<number> = x => x * 2;
const addOneThenDouble: UnaryFn<number> = compose(multiplyByTwo, addOne);
console.log("  addOneThenDouble(5):", addOneThenDouble(5));

// Example 2: Closure types
console.log("\n2. Closure types:");
interface Counter {
  increment(): number;
  decrement(): number;
  getCount(): number;
}

function createCounter(): Counter {
  let count: number = 0;

  return {
    increment(): number {
      return ++count;
    },
    decrement(): number {
      return --count;
    },
    getCount(): number {
      return count;
    },
  };
}

const counter: Counter = createCounter();
console.log("  counter.increment():", counter.increment());
console.log("  counter.increment():", counter.increment());
console.log("  counter.getCount():", counter.getCount());

// Example 3: Async function types
console.log("\n3. Async function types:");
interface Data {
  data: string;
}

async function fetchData(): Promise<Data> {
  console.log("Fetching data...");
  await new Promise(resolve => setTimeout(resolve, 10));
  return { data: "Sample data" };
}

async function processData(): Promise<Data> {
  try {
    const result = await fetchData();
    console.log("Data received:", result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

processData().catch(err => console.error("Caught:", err));

// Example 4: Generator function types
console.log("\n4. Generator function types:");
function* numberGenerator(): Generator<number, void, unknown> {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log("  gen.next():", gen.next());
console.log("  gen.next():", gen.next());
console.log("  gen.next():", gen.next());

function* typedGenerator(): Generator<string, void, unknown> {
  yield "hello";
  yield "world";
}

// Example 5: Async generator
console.log("\n5. Async generator (ES2018+):");
async function* asyncNumberGenerator(): AsyncGenerator<number, void, unknown> {
  for (let i = 1; i <= 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 5));
    yield i;
  }
}

// Example 6: Promise utilities
console.log("\n6. Promise utilities:");
type Resolver<T> = (value: T) => void;
type Rejecter = (reason: unknown) => void;

function createPromise<T>(): [Promise<T>, Resolver<T>, Rejecter] {
  let resolve!: Resolver<T>;
  let reject!: Rejecter;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return [promise, resolve, reject];
}

const [dataPromise, resolveData, rejectData] = createPromise<string>();
resolveData("Success");

dataPromise.then(value => console.log("  Resolved:", value));

// Example 7: Simple function type constraints
console.log("\n7. Function type constraints:");
type NumericFn = (a: number, b: number) => number;
type StringFn = (a: string, b: string) => string;

const simpleAdd: NumericFn = (a, b) => a + b;
const simpleConcat: StringFn = (a, b) => a + b;

console.log("  simpleAdd(1, 2):", simpleAdd(1, 2));
console.log("  simpleConcat('a', 'b'):", simpleConcat("a", "b"));

// Example 8: Type predicate for functions
console.log("\n8. Type predicate:");
type Predicate<T> = (value: T) => boolean;

function filter<T>(arr: T[], predicate: Predicate<T>): T[] {
  return arr.filter(predicate);
}

const isEven: Predicate<number> = n => n % 2 === 0;
const numbers: number[] = [1, 2, 3, 4, 5, 6];
console.log("  filter(isEven):", filter(numbers, isEven));

/**
 * 📋 Key Takeaways:
 * - Higher-order functions can be typed: (f: (A) => B) => (C) => A
 * - Closures maintain type information of captured variables
 * - Async functions typed as Promise<T> with generic result type
 * - Generators typed as Generator<T, TReturn, TNext>
 */
