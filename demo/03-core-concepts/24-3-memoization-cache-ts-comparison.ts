// Function Patterns - Memoization & Cache TypeScript Comparison
// 📘 Complementary to: 24-3-memoization-cache.js

// 🎯 Difficulty: Intermediate
export {};

console.log("=== Function Patterns - Memoization & Cache TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. MEMOIZATION TYPES
 *    JS:  Cache keys are JSON.stringify'd, any function can be memoized
 *    TS:  Memoization can be generic with preserved types: memoize<T, R>(fn)
 *
 * 2. CACHE KEY TYPES
 *    JS:  Cache keys are strings, values any
 *    TS:  Cache can be typed: Map<K, V>, WeakMap<K, V>
 *
 * 3. LRU CACHE TYPES
 *    JS:  LRU cache is custom implementation
 *    TS:  LRU can be generic and typed: LRUCache<T>
 *
 * 4. TRAMPOLINE TYPES
 *    JS:  Trampolines return functions, thunks checked at runtime
 *    TS:  Trampolines can be typed: Trampoline<T> returns T
 */

// Example 1: Generic memoization
console.log("1. Generic memoization:");
type AnyFn<T extends any[], R> = (...args: T) => R;

function memoize<T extends any[], R>(fn: (...args: T) => R): AnyFn<T, R> {
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

const fibonacci: AnyFn<[number], number> = (n: number): number => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
};

const memoizedFib: AnyFn<[number], number> = memoize(fibonacci);
console.log("  memoizedFib(10):", memoizedFib(10));
console.log("  memoizedFib(10):", memoizedFib(10)); // Cache hit

// Example 2: Memoization with custom key generator
console.log("\n2. Memoization with custom key generator:");
function memoizeWithKey<T extends any[], R, K>(
  fn: (...args: T) => R,
  keyGenerator: (...args: T) => K
): AnyFn<T, R> {
  const cache = new Map<K, R>();

  return function (...args: T): R {
    const key = keyGenerator(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const sum = memoizeWithKey(
  (a: number, b: number) => a + b,
  (...args) => `sum:${args[0]}+${args[1]}`
);
console.log("  sum(2, 3):", sum(2, 3));

// Example 3: WeakMap memoization for objects
console.log("\n3. WeakMap memoization:");
function memoizeWeak<T extends object, R>(fn: (arg: T) => R): (arg: T) => R {
  const cache = new WeakMap<T, R>();

  return function (arg: T): R {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}

const processObj = memoizeWeak((obj: { id: number }) => ({
  ...obj,
  processed: true,
}));
const obj1 = { id: 1 };
console.log("  processObj(obj1):", processObj(obj1));
console.log("  processObj(obj1):", processObj(obj1));

// Example 4: Memoization with max size
console.log("\n4. Memoization with max size:");
function memoizeMaxSize<T extends any[], R>(
  fn: (...args: T) => R,
  maxSize: number = 100
): AnyFn<T, R> {
  const cache = new Map<string, R>();

  return function (...args: T): R {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Example 5: LRU Cache with types
console.log("\n5. LRU Cache:");
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }
    const value = this.cache.get(key) as V;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value as K;
      this.cache.delete(oldestKey);
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

  get size(): number {
    return this.cache.size;
  }
}

const lru = new LRUCache<string, number>(3);
lru.set("a", 1);
lru.set("b", 2);
lru.set("c", 3);
console.log("  LRUCache:", {
  a: lru.get("a"),
  b: lru.get("b"),
  c: lru.get("c"),
});

// Example 6: Memoize with LRU
console.log("\n6. Memoize with LRU:");
function memoizeLRU<T extends any[], R>(fn: (...args: T) => R, maxSize: number = 100): AnyFn<T, R> {
  const lruCache = new LRUCache<string, R>(maxSize);

  return function (...args: T): R {
    const key = JSON.stringify(args);
    if (lruCache.has(key)) {
      return lruCache.get(key)!;
    }
    const result = fn(...args);
    lruCache.set(key, result);
    return result;
  };
}

// Example 7: Trampoline with types
console.log("\n7. Trampoline:");
type Thunk<T> = () => T;
type TrampolineFn<T> = (...args: any[]) => T;

function trampoline<T>(fn: TrampolineFn<T>): TrampolineFn<T> {
  return function (...args: any[]): T {
    let result: T | Thunk<T> = fn(...args);

    while (typeof result === "function") {
      result = (result as Thunk<T>)();
    }

    return result as T;
  };
}

function factorialTrampoline(
  n: number,
  accumulator: number = 1
): number | (() => number | (() => any)) {
  if (n <= 1) return accumulator;
  return () => factorialTrampoline(n - 1, n * accumulator);
}

const trampolinedFact = trampoline(factorialTrampoline);
console.log("  trampolinedFact(5):", trampolinedFact(5));

// Example 8: Mutual recursion with trampoline
console.log("\n8. Mutual recursion with trampoline:");
type CheckFn = (n: number) => CheckFn | boolean;

function trampolineMutual(fn: CheckFn): (n: number) => boolean {
  return function (n: number): boolean {
    let result: CheckFn | boolean = fn(n);

    while (typeof result === "function") {
      result = (result as CheckFn)(0);
    }

    return result as boolean;
  };
}

function isEven(n: number): CheckFn | boolean {
  if (n === 0) return true;
  return () => isOdd(n - 1);
}

function isOdd(n: number): CheckFn | boolean {
  if (n === 0) return false;
  return () => isEven(n - 1);
}

const trampolinedEven = trampolineMutual(isEven);
console.log("  isEven(10):", trampolinedEven(10));
console.log("  isEven(9):", trampolinedEven(9));

// Example 9: Cache interface
console.log("\n9. Cache interface:");
interface ICache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  size: number;
}

class SimpleCache<K, V> implements ICache<K, V> {
  private cache = new Map<K, V>();

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
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

  get size(): number {
    return this.cache.size;
  }
}

// Example 10: Generic cache factory
console.log("\n10. Generic cache factory:");
type CacheFactory<K, V> = () => ICache<K, V>;

function createLRUCache<K, V>(maxSize: number): CacheFactory<K, V> {
  return () => new LRUCache<K, V>(maxSize);
}

const createStringCache = createLRUCache<string, number>(50);
const stringCache = createStringCache();
stringCache.set("key1", 1);
stringCache.set("key2", 2);
console.log("  String cache size:", stringCache.size);

/**
 * 📋 Key Takeaways:
 * - Generic memoization: memoize<T extends any[], R>(fn) preserves input/output types
 * - Custom key generators: memoize<T, K>(fn, keyGenerator) with typed key function
 * - WeakMap memoization: memoize<T, R> for object arguments (auto GC)
 * - LRU cache can be generic: LRUCache<K, V> with typed methods
 * - Trampolines can be typed: Trampoline<T> where Thunk<T> = () => T
 * - Cache interfaces enable typed cache implementations: ICache<K, V>
 * - Cache factories return typed constructors: CacheFactory<K, V>
 */
