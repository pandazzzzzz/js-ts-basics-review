// Function Patterns - Memoization & Cache Demo
// 📘 For TypeScript comparison, see: 24.3-memoization-cache-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers memoization and caching patterns:
// 1. Basic memoization (Map-based)
// 2. LRU (Least Recently Used) cache
// 3. Trampolines for deep recursion
// 4. Recursion patterns
// 5. Point-free style
// 6. Performance considerations

// ============================================
// Table of Contents
// ============================================

// 1. Basic Memoization
// 2. LRU Cache Implementation
// 3. Trampolines - Tail Recursion Optimization
// 4. Recursion Patterns
// 5. Point-Free Style
// 6. Performance Considerations

// ============================================

console.log("=== Function Patterns - Memoization & Cache Demo ===\n");

// ============================================
// 1. Basic Memoization
// ============================================
/**
 * Memoization - Caching results of expensive function calls
 *
 * Characteristics:
 * - Caches results based on arguments
 * - Subsequent calls with same args return cached value
 * - Only works for pure functions (same input → same output)
 *
 * Use Cases:
 * - Expensive calculations (fibonacci, factorial)
 * - API response caching
 * - Rendering optimizations
 *
 * Common Pitfalls:
 * - Memory leaks with unbounded caches
 * - Invalid key generation (JSON.stringify limits)
 * - Mutating cached results
 */

console.log("=== 1. Basic Memoization ===");

// 1.1 Simple memoize with Map
// - 记忆化核心模式，基于 Map 缓存参数→结果 (ES6)
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log('Cache hit:', key);
      return cache.get(key);
    }
    console.log('Cache miss:', key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Fibonacci with memoization
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);
console.log("Fibonacci(10):", memoizedFib(10)); // Computes
console.log("Fibonacci(10):", memoizedFib(10)); // Cache hit

// 1.2 Memoize with custom key generator
function memoizeWithKey(fn, keyGenerator = JSON.stringify) {
  const cache = new Map();

  return function(...args) {
    const key = keyGenerator(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

console.log("\nCustom key generator:");
const sum = memoizeWithKey((a, b) => a + b, (args) => `sum:${args[0]}+${args[1]}`);
console.log("sum(2, 3):", sum(2, 3));
console.log("sum(2, 3):", sum(2, 3)); // Cache hit

// 1.3 WeakMap memoize for object arguments
// - 用 WeakMap 缓存对象参数，键被回收时自动清理 (ES6)
function memoizeWeak(fn) {
  const cache = new WeakMap();

  return function(arg) {
    if (cache.has(arg)) {
      return cache.get(arg);
    }
    const result = fn.call(this, arg);
    cache.set(arg, result);
    return result;
  };
}

console.log("\nWeakMap memoization:");
const processObj = memoizeWeak((obj) => ({ ...obj, processed: true }));
const obj1 = { id: 1 };
console.log("processObj(obj1):", processObj(obj1));
console.log("processObj(obj1):", processObj(obj1)); // Cache hit

// 1.4 Memoize with max size limit
function memoizeMaxSize(fn, maxSize = 100) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    if (cache.size >= maxSize) {
      // Evict oldest entry (first key)
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// ============================================
// 2. LRU Cache Implementation
// ============================================
/**
 * LRU Cache - Evicts least recently used items when full
 *
 * Characteristics:
 * - O(1) get/put operations using Map + doubly-linked list
 * - Evicts least recently accessed when full
 * - Moves accessed item to "most recent" position
 *
 * Use Cases:
 * - API response caching
 * - Rendering caches
 * - Database query caches
 */

console.log("\n=== 2. LRU Cache ===");

// - LRU 缓存，用 Map 插入顺序实现 O(1) get/put (ES6)
class LRUCache {
  constructor(maxSize = 100) {
    this.cache = new Map(); // Doubles as hash map + linked list via insertion order
    this.maxSize = maxSize;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }

    // Reinsert to mark as most recently used
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Evict least recently used (first key in Map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }
}

// LRU usage
console.log("LRU Cache:");
const lru = new LRUCache(3);
lru.set('a', 1);
lru.set('b', 2);
lru.set('c', 3);
console.log("After 3 inserts:", [...lru.cache.keys()]); // ['a', 'b', 'c']

lru.get('a'); // Access 'a' → moves to end
console.log("After get('a'):", [...lru.cache.keys()]); // ['b', 'c', 'a']

lru.set('d', 4); // Evicts 'b' (least recently used)
console.log("After set('d'):", [...lru.cache.keys()]); // ['c', 'a', 'd']

// Memoize with LRU
function memoizeLRU(fn, maxSize = 100) {
  const lruCache = new LRUCache(maxSize);

  return function(...args) {
    const key = JSON.stringify(args);
    if (lruCache.has(key)) {
      return lruCache.get(key);
    }
    const result = fn.apply(this, args);
    lruCache.set(key, result);
    return result;
  };
}

console.log("\nMemoize with LRU:");
const expensive = memoizeLRU((n) => {
  console.log(`Computing for ${n}`);
  return n * n;
}, 2);
expensive(1);
expensive(2);
expensive(1); // Cache hit
expensive(3); // Evicts 1
expensive(1); // Recomputes

// ============================================
// 3. Trampolines - Tail Recursion Optimization
// ============================================
/**
 * Trampolines - Convert recursion to iteration to avoid stack overflow
 *
 * Characteristics:
 * - Returns thunks (functions) instead of recursive calls
 * - Trampoline iteratively calls thunks until result is not a function
 * - Works in environments without TCO support
 *
 * Use Cases:
 * - Deep recursion
 * - Mutual recursion
 * - Algorithms that would otherwise stack overflow
 */

console.log("\n=== 3. Trampolines ===");

// 3.1 Basic trampoline
// - 蹦床函数，用循环代替递归避免栈溢出 (ES5)，比 TCO 兼容性更好
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);

    while (typeof result === 'function') {
      result = result();
    }

    return result;
  };
}

// 3.2 Factorial with trampoline
function factorialTrampoline(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return () => factorialTrampoline(n - 1, n * accumulator);
}

const trampolinedFact = trampoline(factorialTrampoline);
console.log("Factorial(10):", trampolinedFact(10)); // 3628800
console.log("Factorial(1000) works:", String(trampolinedFact(1000)).substring(0, 30), "...");

// 3.3 Mutual recursion with trampoline
function isEven(n) {
  if (n === 0) return true;
  return () => isOdd(n - 1);
}

function isOdd(n) {
  if (n === 0) return false;
  return () => isEven(n - 1);
}

const trampolinedEven = trampoline(isEven);
console.log("\nMutual recursion:");
console.log("isEven(10):", trampolinedEven(10)); // true
console.log("isEven(9):", trampolinedEven(9)); // false

// ============================================
// 4. Recursion Patterns
// ============================================
/**
 * Recursion Patterns - Common patterns for recursive solutions
 *
 * Patterns:
 * - Linear recursion (single recursive call)
 * - Tree recursion (multiple recursive calls)
 * - Tail recursion (optimizable with TCO/trampoline)
 * - Accumulator pattern
 */

console.log("\n=== 4. Recursion Patterns ===");

// 4.1 Linear recursion - sum array
function sumArray(arr, index = 0) {
  if (index >= arr.length) return 0;
  return arr[index] + sumArray(arr, index + 1);
}
console.log("sumArray([1,2,3,4,5]):", sumArray([1,2,3,4,5])); // 15

// 4.2 Tail recursion - sum array
function tailSumArray(arr, index = 0, accumulator = 0) {
  if (index >= arr.length) return accumulator;
  return tailSumArray(arr, index + 1, accumulator + arr[index]);
}
console.log("tailSumArray([1,2,3,4,5]):", tailSumArray([1,2,3,4,5])); // 15

// 4.3 Tree recursion - tree traversal
const tree = {
  value: 1,
  left: { value: 2, left: { value: 4 }, right: { value: 5 } },
  right: { value: 3, left: { value: 6 }, right: { value: 7 } }
};

function traverseTree(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  traverseTree(node.left, result);
  traverseTree(node.right, result);
  return result;
}
console.log("\nTree traversal:", traverseTree(tree)); // [1,2,4,5,3,6,7]

// 4.4 Deep reduce - recursively process nested structures
function deepReduce(obj, fn, acc) {
  acc = fn(acc, obj);

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      acc = deepReduce(obj[key], fn, acc);
    }
  }

  return acc;
}

const nestedObject = { a: 1, b: { c: 2, d: { e: 3 } }, f: 4 };
const nestedSum = deepReduce(nestedObject, (acc, val) => {
  return typeof val === 'number' ? acc + val : acc;
}, 0);
console.log("Nested sum:", nestedSum); // 10

// ============================================
// 5. Point-Free Style
// ============================================
/**
 * Point-Free Style - Functions composed without mentioning arguments
 *
 * Characteristics:
 * - Also called "tacit programming"
 * - Uses function composition and partial application
 * - More declarative
 *
 * Common Pitfalls:
 * - Can be harder to read for beginners
 * - Less flexible for complex logic
 */

console.log("\n=== 5. Point-Free Style ===");

// Helper compose/pipe
const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
const pipe = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// 5.1 Regular vs point-free
const add1 = x => x + 1;
const mult2 = x => x * 2;

// Regular style (mentions argument)
const regularTransform = x => mult2(add1(x));

// Point-free style (no argument mentioned)
const pointFreeTransform = pipe(add1, mult2);

console.log("Regular transform(5):", regularTransform(5)); // 12
console.log("Point-free transform(5):", pointFreeTransform(5)); // 12

// 5.2 Practical point-free example
const trim = str => str.trim();
const toUpper = str => str.toUpperCase();
const addPrefix = prefix => str => `${prefix} ${str}`;

const formatName = pipe(trim, toUpper, addPrefix('Dr.'));
console.log("\nPoint-free formatName:", formatName('  alice smith  '));

// ============================================
// 6. Performance Considerations
// ============================================
/**
 * Performance Considerations - Tradeoffs in functional patterns
 *
 * Key Concerns:
 * - Stack depth (recursion vs iteration)
 * - Memory usage (caches)
 * - Function call overhead
 * - Garbage collection
 */

console.log("\n=== 6. Performance Considerations ===");

// 6.1 Loop vs reduce comparison
function sumLoop(n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += i;
  }
  return total;
}

function sumReduce(n) {
  return Array.from({ length: n }, (_, i) => i)
    .reduce((acc, val) => acc + val, 0);
}

console.log("Performance comparison (loop vs reduce):");
console.time('loop');
sumLoop(1000000);
console.timeEnd('loop');

console.time('reduce');
sumReduce(1000000);
console.timeEnd('reduce');

// 6.2 Lazy evaluation
function lazy(fn) {
  let evaluated = false;
  let result;

  return function() {
    if (!evaluated) {
      console.log('Evaluating lazily');
      result = fn();
      evaluated = true;
    }
    return result;
  };
}

const expensiveComputation = lazy(() => {
  return 42 * 42;
});

console.log("\nLazy evaluation:");
console.log("First call:", expensiveComputation()); // Evaluates
console.log("Second call:", expensiveComputation()); // Cached

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Mutating cached objects
console.log("\nPitfall 1 - Mutating cache:");
const getObject = memoize(() => ({ data: 0 }));
const objA = getObject();
objA.data = 999;
const objB = getObject(); // ❌ objB is the same modified object!
console.log("objB.data:", objB.data); // 999 (should be 0)
console.log("✅ Good: Return immutable objects or copies from memoized functions");

// Pitfall 2: Memory leaks with unbounded caches
console.log("\nPitfall 2 - Unbounded cache:");
console.log("❌ Bad: Memoize without cache size limits");
console.log("✅ Good: Use LRU or TTL-based caches for production");

// Pitfall 3: Recursion without base case
console.log("\nPitfall 3 - Infinite recursion:");
console.log("❌ Bad: Forgetting base case in recursion");
console.log("✅ Good: Always test base case first, consider trampolines for deep recursion");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use memoization only for pure functions");
console.log("✅ Use LRU cache for production to avoid memory leaks");
console.log("✅ Use trampolines for deep recursion (better compatibility than TCO)");
console.log("✅ Use WeakMap for memoizing objects (auto-gc when keys are unreachable)");
console.log("✅ Prefer iteration over recursion for simple loops");
console.log("✅ Consider performance before over-using composition");
console.log("⚠️  Be careful with JSON.stringify for cache keys (circular refs, undefined, Symbols)");
console.log("⚠️  Don't over-use point-free style when clarity suffers");
console.log("⚠️  Test cache invalidation logic carefully");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌───────────────┬─────────────────────────────────┐
│ Pattern       │ Use Case                        │
├───────────────┼─────────────────────────────────┤
│ Memoize       │ Expensive pure function calls   │
│ LRU Cache     │ Production caching with eviction│
│ Trampoline    │ Deep recursion without TCO      │
│ Tail Recursion│ Optimizable recursive functions │
│ Point-Free    │ Declarative composition         │
└───────────────┴─────────────────────────────────┘

Cache Key Best Practices:
- Use JSON.stringify for simple args
- Use WeakMap for object args
- Use custom key generators for complex args
- Always test for cache correctness

Recursion Best Practices:
- Always include base case
- Prefer tail recursion for optimization
- Use trampolines for cross-engine compatibility
- Consider iteration for performance-critical code
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 24.1-function-composition.js - Composition and currying");
console.log("📘 24.2-debounce-throttle.js - Debounce and throttle patterns");
console.log("📘 07.3-functions-patterns.js - Function pattern basics");
console.log("📘 13-scope-closures.js - Closures and lexical scope");
console.log("📘 26-optimization-performance.js - Performance optimization");
console.log("📘 27-memory-management.js - Memory management");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 24.3-memoization-cache-ts-comparison.ts
*/