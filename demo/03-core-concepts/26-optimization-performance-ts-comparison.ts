// TypeScript vs JavaScript: Performance Optimization Comparison
// 📘 For JavaScript examples, see: 26-optimization-performance.js
// This file demonstrates TypeScript-specific optimization features

export {};

// ============================================================================
// 1. TYPED MEMOIZATION
// ============================================================================

console.log("=== Typed Memoization ===");

// TypeScript: Generic memoization with type safety
function memoize<T extends (...args: any[]) => R, R>(
  fn: T,
  keyFn: (...args: Parameters<T>) => string = JSON.stringify as unknown as (
    ...args: Parameters<T>
  ) => string
): T {
  const cache = new Map<string, R>();
  return ((...args: Parameters<T>) => {
    const key = keyFn(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
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

// TypeScript: LRU cache with types
class TypedLRUCache<K, V> {
  private readonly cache = new Map<K, V>();

  constructor(private readonly maxSize: number = 100) {}

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) entry
      const firstKey = this.cache.keys().next().value!;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  get size(): number {
    return this.cache.size;
  }
}

const lru = new TypedLRUCache<number, string>(3);
lru.set(1, "one");
lru.set(2, "two");
lru.set(3, "three");
console.log("LRU get(1):", lru.get(1));
lru.set(4, "four"); // Evicts 2
console.log("LRU has(2):", lru.has(2));

// ============================================================================
// 2. TYPED LAZY EVALUATION
// ============================================================================

console.log("\n=== Typed Lazy Evaluation ===");

// TypeScript: Typed lazy value
class Lazy<T> {
  private computed = false;
  private value!: T;

  constructor(private readonly fn: () => T) {}

  get(): T {
    if (!this.computed) {
      this.value = this.fn();
      this.computed = true;
    }
    return this.value;
  }
}

const lazyValue = new Lazy(() => {
  console.log("Computing lazy value...");
  return 42 * 42;
});

console.log("First access:", lazyValue.get()); // Computes
console.log("Second access:", lazyValue.get()); // Uses cache

// TypeScript: Typed generator with yield*
function* range(start: number, end: number): Generator<number> {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function* map<T, U>(gen: Generator<T>, fn: (x: T) => U): Generator<U> {
  for (const x of gen) {
    yield fn(x);
  }
}

function* filter<T>(gen: Generator<T>, predicate: (x: T) => boolean): Generator<T> {
  for (const x of gen) {
    if (predicate(x)) {
      yield x;
    }
  }
}

const result = [
  ...map(
    filter(range(1, 10), x => x % 2 === 0),
    x => x * 2
  ),
];
console.log("Generator pipeline:", result);

// ============================================================================
// 3. TYPED OBJECT POOLING
// ============================================================================

console.log("\n=== Typed Object Pooling ===");

// TypeScript: Typed object pool
interface Poolable {
  reset(): void;
}

class TypedObjectPool<T extends Poolable> {
  private readonly available: T[] = [];
  private readonly inUse = new Set<T>();

  constructor(
    private readonly factory: () => T,
    initialSize: number = 10
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  acquire(): T {
    let obj: T;
    if (this.available.length > 0) {
      obj = this.available.pop()!;
    } else {
      obj = this.factory();
    }
    this.inUse.add(obj);
    return obj;
  }

  release(obj: T): void {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      obj.reset();
      this.available.push(obj);
    }
  }

  get stats() {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
    };
  }
}

class Vector implements Poolable {
  constructor(
    public x = 0,
    public y = 0,
    public z = 0
  ) {}

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
}

const vectorPool = new TypedObjectPool(() => new Vector(), 5);
console.log("Initial pool stats:", vectorPool.stats);

const v1 = vectorPool.acquire();
v1.x = 10;
v1.y = 20;
const v2 = vectorPool.acquire();

console.log("After acquire stats:", vectorPool.stats);
vectorPool.release(v1);
console.log("After release stats:", vectorPool.stats);

// ============================================================================
// 4. TYPED PERFORMANCE MONITORING
// ============================================================================

console.log("\n=== Typed Performance Monitoring ===");

// TypeScript: Typed performance mark/measure
class PerformanceMonitor {
  private readonly marks = new Map<string, number>();

  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  measure(name: string, startMark: string, endMark: string): number {
    const start = this.marks.get(startMark)!;
    const end = this.marks.get(endMark)!;
    return end - start;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }

  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${(end - start).toFixed(2)}ms`);
    return result;
  }
}

const monitor = new PerformanceMonitor();

const resultSync = monitor.measureSync("sync", () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) sum += i;
  return sum;
});

// ============================================================================
// 5. TYPED ARRAYS
// ============================================================================

console.log("\n=== Typed Arrays ===");

// TypeScript: TypedArray types
const int8 = new Int8Array(100);
const uint8 = new Uint8Array(100);
const int16 = new Int16Array(100);
const uint16 = new Uint16Array(100);
const int32 = new Int32Array(100);
const uint32 = new Uint32Array(100);
const float32 = new Float32Array(100);
const float64 = new Float64Array(100);

// TypeScript: Working with typed arrays
function processTypedArray(data: Float64Array): Float64Array {
  const result = new Float64Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = Math.sqrt(data[i]);
  }
  return result;
}

const data = new Float64Array([1, 4, 9, 16, 25]);
const processed = processTypedArray(data);
console.log("Processed typed array:", [...processed]);

// ============================================================================
// 6. CONST ASSERTIONS
// ============================================================================

console.log("\n=== Const Assertions ===");

// TypeScript: as const for immutable values
const config = {
  timeout: 5000,
  retries: 3,
  endpoints: {
    api: "https://api.example.com",
    auth: "https://auth.example.com",
  },
} as const;

// config.timeout = 10000; // ❌ Error: read-only
// config.endpoints.api = "..." // ❌ Error: read-only

// TypeScript: String enum pattern
const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
type HttpMethod = (typeof HTTP_METHODS)[number]; // "GET" | "POST" | "PUT" | "DELETE"

function makeRequest(method: HttpMethod, url: string): void {
  console.log(`${method} ${url}`);
}

makeRequest("GET", "/users");
// makeRequest("INVALID", "/users"); // ❌ Type error

// ============================================================================
// 7. TEMPLATE LITERAL TYPES
// ============================================================================

console.log("\n=== Template Literal Types ===");

// TypeScript: Template literal types
type EventName = `${"click" | "focus" | "blur"}-${"in" | "out"}`;
const event1: EventName = "click-in";
const event2: EventName = "focus-out";
// const event3: EventName = "scroll-in"; // ❌ Type error

// TypeScript: CSS units
type CSSUnit = "px" | "em" | "rem" | "%";
type CSSValue = `${number}${CSSUnit}`;
const width: CSSValue = "100px";
const padding: CSSValue = "2em";
// const height: CSSValue = "100"; // ❌ Type error

// TypeScript: Route parameter types
type Route = `/users/${string}` | `/posts/${number}`;
const userRoute: Route = "/users/123";
const postRoute: Route = "/posts/456";
// const invalidRoute: Route = "/comments/789"; // ❌ Type error

// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== TypeScript Optimization Summary ===");
console.log("1. Typed memoization and LRU cache");
console.log("2. Typed lazy evaluation with generators");
console.log("3. Typed object pooling");
console.log("4. Typed performance monitoring");
console.log("5. TypedArray types for numeric data");
console.log("6. Const assertions for immutable values");
console.log("7. Template literal types");

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Type-safe data structures");
console.log("- Better tooling/refactoring (types are erased at runtime; no JIT gain)");
console.log("- Clear performance contracts");
console.log("- Immutable value enforcement");
