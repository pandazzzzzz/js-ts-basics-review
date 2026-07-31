// Optimization & Performance Demo
// 📘 For TypeScript comparison, see: 26-optimization-performance-ts-comparison.ts


// ============================================
// Learning goals
// ============================================
// This file introduces common performance ideas that matter when JavaScript code grows beyond simple examples.
// The sections highlight trade-offs rather than claiming that any single approach is always best.

// ============================================
// Table of Contents
// ============================================

// 1. TAIL CALL OPTIMIZATION (TCO)
// 2. ADVANCED MEMOIZATION
// 3. LAZY EVALUATION
// 4. EVENT LOOP OPTIMIZATION
// 5. BATCHING AND COALESCING
// 6. WEB WORKERS FOR PARALLEL PROCESSING
// 7. requestAnimationFrame OPTIMIZATION
// 8. PERFORMANCE BENCHMARKING
// 9. COMMON PERFORMANCE PITFALLS
// 10. V8 ENGINE INTERNALS

// ============================================

// ============================================
// 1. TAIL CALL OPTIMIZATION (TCO)
// ============================================
/**
 * Tail Call Optimization - Optimizing recursive calls
 *
 * Characteristics:
 * - Tail position: last operation in function
 * - Reuses current stack frame (theoretical)
 * - Prevents stack overflow (theoretical)
 *
 * IMPORTANT: Proper Tail Calls (PTC) are part of ES6 spec. Safari/JavaScriptCore
 * is the only major engine that implements PTC; Chrome/V8 and Firefox do not.
 * For deep recursion in non-Safari engines, use iterative approaches or
 * trampoline patterns instead.
 *
 * Use Cases (theoretical):
 * - Deep recursion algorithms
 * - Mathematical sequences
 * - Tree/graph traversals
 * - State machines
 *
 * Common Pitfalls:
 * - TCO is NOT reliable - do not depend on it
 * - Use iterative or trampoline patterns for deep recursion
 * - Only Safari/JavaScriptCore ships PTC; V8 and SpiderMonkey do not
 */

console.log("=== 1. Tail Call Optimization Demo ===");

// 1.1 Non-tail-recursive factorial (stack grows)
function factorialNonTail(n) {
  if (n <= 1) return 1;
  return n * factorialNonTail(n - 1); // Not tail position (multiply after call)
}

// 1.2 Tail-recursive factorial (constant stack)
function factorialTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTail(n - 1, n * acc); // Tail position
}

console.log("\nFactorial comparison:");
console.log("Non-tail factorial(5):", factorialNonTail(5)); // 120
console.log("Tail factorial(5):", factorialTail(5)); // 120

// 1.3 Trampoline pattern for environments without TCO
function trampoline(fn) {
  let result = fn();
  while (typeof result === 'function') {
    result = result();
  }
  return result;
}

function makeTailRecursive(f) {
  return function(...args) {
    return trampoline(() => f(...args));
  };
}

const safeFactorial = makeTailRecursive(function factorial(n, acc = 1) {
  if (n <= 1) return () => acc;
  return () => factorial(n - 1, n * acc);
});

console.log("\nTrampoline factorial(10):", safeFactorial(10)); // 3628800

// 1.4 Tail-recursive sum
function sumArrayTail(arr, index = 0, acc = 0) {
  if (index >= arr.length) return acc;
  return sumArrayTail(arr, index + 1, acc + arr[index]);
}

console.log("\nTail-recursive sum:", sumArrayTail([1, 2, 3, 4, 5])); // 15

// 1.5 Mutual recursion with trampoline
const isEvenT = (n) => n === 0 ? true : () => isOddT(n - 1);
const isOddT = (n) => n === 0 ? false : () => isEvenT(n - 1);

function mutualIsEven(n) {
  return trampoline(() => isEvenT(n));
}

console.log("\nMutual recursion:");
console.log("isEven(1000):", mutualIsEven(1000)); // true


// ============================================
// 2. ADVANCED MEMOIZATION
// ============================================
/**
 * Memoization - Caching function results (ES6)
 *
 * Characteristics:
 * - Stores results of expensive calls
 * - Returns cached result for same inputs
 * - Trade memory for speed
 * - Works best with pure functions
 *
 * Use Cases:
 * - Expensive calculations
 * - Recursive algorithms (Fibonacci)
 * - API response caching
 * - Lookup tables
 *
 * Common Pitfalls:
 * - Memory leaks with unbounded cache
 * - Doesn't work with impure functions
 * - Cache key generation complexity
 */

console.log("\n=== 2. Advanced Memoization Demo ===");

// 2.1 Basic memoization
function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`  [Cache hit] ${key}`);
      return cache.get(key);
    }
    console.log(`  [Cache miss] ${key}`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function add(a, b) {
  return a + b;
}

const memoizedAdd = memoize(add);

console.log("\nBasic memoization:");
console.log("Result:", memoizedAdd(2, 3));
console.log("Result:", memoizedAdd(2, 3)); // Cached

// 2.2 Fibonacci with memoization
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = memoize(fibonacci);

console.log("\nFibonacci memoization:");
console.time('fib(35)');
console.log("fib(35):", memoizedFib(35));
console.timeEnd('fib(35)');

// 2.3 LRU Cache (bounded memoization)
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove oldest (first) item
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  get size() {
    return this.cache.size;
  }
}

function memoizeLRU(fn, maxSize = 100) {
  const cache = new LRUCache(maxSize);

  const memoized = function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };

  memoized.cacheSize = () => cache.size;
  return memoized;
}

const lruFib = memoizeLRU(fibonacci, 50);
console.log("\nLRU Fibonacci:");
console.log("fib(40):", lruFib(40));
console.log("Cache size:", lruFib.cacheSize);

// 2.4 Multi-argument memoization with custom serializer
function memoizeWithSerializer(fn, serializer = JSON.stringify) {
  const cache = new Map();

  return function(...args) {
    const key = serializer(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Custom serializer for objects (by reference)
function identitySerializer(args) {
  return args.map(arg =>
    typeof arg === 'object' && arg !== null
      ? `${arg.constructor.name}@${Object.isFrozen(arg) ? 'frozen' : 'mutable'}`
      : String(arg)
  ).join('|');
}


// ============================================
// 3. LAZY EVALUATION
// ============================================
/**
 * Lazy Evaluation - Computing values on-demand (ES6)
 *
 * Characteristics:
 * - Defers computation until needed
 * - Avoids unnecessary calculations
 * - Enables infinite sequences
 * - Generator-based implementation
 *
 * Use Cases:
 * - Large data processing
 * - Infinite sequences
 * - Pipeline processing
 * - Virtual scrolling
 *
 * Common Pitfalls:
 * - Harder to debug
 * - May hide performance issues
 * - Not always beneficial
 */

console.log("\n=== 3. Lazy Evaluation Demo ===");

// 3.1 Lazy value wrapper
class Lazy {
  constructor(fn) {
    this.fn = fn;
    this.evaluated = false;
    this.value = undefined;
  }

  get() {
    if (!this.evaluated) {
      this.value = this.fn();
      this.evaluated = true;
      console.log('  [Lazy evaluation executed]');
    } else {
      console.log('  [Lazy value returned from cache]');
    }
    return this.value;
  }

  force() {
    return this.get();
  }
}

const expensiveComputation = () => {
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += i;
  }
  return sum;
};

const lazyValue = new Lazy(expensiveComputation);

console.log("\nLazy value (not yet computed)");
console.log("First access:", lazyValue.get());
console.log("Second access:", lazyValue.get());

// 3.2 Lazy array operations
class LazyArray {
  constructor(array) {
    this.array = array;
    this.operations = [];
  }

  map(fn) {
    this.operations.push({ type: 'map', fn });
    return this;
  }

  filter(fn) {
    this.operations.push({ type: 'filter', fn });
    return this;
  }

  take(n) {
    this.operations.push({ type: 'take', n });
    return this.execute();
  }

  execute() {
    let result = [...this.array];

    for (const op of this.operations) {
      if (op.type === 'map') {
        result = result.map(op.fn);
      } else if (op.type === 'filter') {
        result = result.filter(op.fn);
      } else if (op.type === 'take') {
        result = result.slice(0, op.n);
        break;
      }
    }

    this.operations = [];
    return result;
  }
}

const lazyArr = new LazyArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const result = lazyArr
  .map(x => x * 2)
  .filter(x => x > 10)
  .take(3);

console.log("\nLazy array operations:", result); // [12, 14, 16]

// 3.3 Generator-based lazy sequences
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

function* mapGen(gen, fn) {
  for (const item of gen) {
    yield fn(item);
  }
}

function* filterGen(gen, predicate) {
  for (const item of gen) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* takeGen(gen, n) {
  let count = 0;
  for (const item of gen) {
    if (count >= n) break;
    yield item;
    count++;
  }
}

console.log("\nGenerator pipeline:");
const gen = takeGen(
  filterGen(
    mapGen(range(1, 100), x => x * 2),
    x => x > 10
  ),
  5
);

console.log([...gen]); // [12, 14, 16, 18, 20]

// 3.4 Infinite sequence
function* naturalNumbers() {
  let n = 1;
  while (true) {
    yield n++;
  }
}

const nums = naturalNumbers();
console.log("\nInfinite sequence (first 10):");
const first10 = [];
for (let i = 0; i < 10; i++) {
  first10.push(nums.next().value);
}
console.log(first10);


// ============================================
// 4. EVENT LOOP OPTIMIZATION
// ============================================
/**
 * Event Loop Optimization - Efficient async patterns (ES6+)
 *
 * Characteristics:
 * - Microtasks vs macrotasks
 * - Batch synchronous work
 * - Yield to event loop strategically
 * - Avoid blocking the main thread
 *
 * Use Cases:
 * - Processing large arrays
 * - UI responsiveness
 * - Animation smoothness
 * - Network request batching
 *
 * Common Pitfalls:
 * - Too many microtasks starve rendering
 * - Unnecessary task switching overhead
 * - Race conditions with async splits
 */

console.log("\n=== 4. Event Loop Optimization Demo ===");

// 4.1 Microtask vs macrotask timing
console.log("\nTask scheduling order:");

Promise.resolve().then(() => {
  console.log('  Promise (microtask) 1');
});

setTimeout(() => {
  console.log('  Timeout (macrotask) 1');
}, 0);

Promise.resolve().then(() => {
  console.log('  Promise (microtask) 2');
});

console.log('  Synchronous code');

// 4.2 Chunking large tasks
async function processLargeArray(array, processFn, chunkSize = 1000) {
  const results = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    const chunkResults = chunk.map(processFn);
    results.push(...chunkResults);

    // Yield to event loop every chunk
    if (i + chunkSize < array.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return results;
}

const largeArray = Array.from({ length: 10000 }, (_, i) => i);

console.log("\nChunked processing:");
processLargeArray(largeArray, x => Math.sqrt(x), 2500)
  .then(results => {
    console.log(`  Processed ${results.length} items`);
  });

// 4.3 Using MessageChannel for task (macrotask) scheduling
// Note: MessageChannel posts a TASK (macrotask), NOT a microtask.
// Use queueMicrotask() or Promise.resolve().then() for microtasks.
function scheduleTask(fn) {
  const channel = new MessageChannel();
  channel.port1.onmessage = () => fn();
  channel.port2.postMessage(null);
}

console.log("\nTask scheduling via MessageChannel (macrotask, not microtask):");
scheduleTask(() => {
  console.log('  Executed via MessageChannel');
});

// 4.4 requestIdleCallback for non-critical work
function scheduleIdleWork(fn) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(fn);
  } else {
    setTimeout(fn, 1);
  }
}

// Simulated idle callback
console.log("\nIdle work scheduling (simulated):");
setTimeout(() => {
  console.log('  Idle callback executed');
}, 10);


// ============================================
// 5. BATCHING AND COALESCING
// ============================================
/**
 * Batching - Combining multiple operations (ES6)
 *
 * Characteristics:
 * - Groups similar operations
 * - Reduces overhead per operation
 * - Improves throughput
 * - May increase latency slightly
 *
 * Use Cases:
 * - DOM updates
 * - Network requests
 * - Database writes
 * - Log aggregation
 *
 * Common Pitfalls:
 * - Increased latency for individual ops
 * - Complex batch management
 * - Error handling complexity
 */

console.log("\n=== 5. Batching and Coalescing Demo ===");

// 5.1 Request batching
class RequestBatcher {
  constructor(batchSize = 10, delayMs = 100) {
    this.batchSize = batchSize;
    this.delayMs = delayMs;
    this.queue = [];
    this.timer = null;
  }

  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });

      if (this.queue.length >= this.batchSize) {
        this.flush();
      } else if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.delayMs);
      }
    });
  }

  async flush() {
    clearTimeout(this.timer);
    this.timer = null;

    const batch = [...this.queue];
    this.queue = [];

    console.log(`  Flushing batch of ${batch.length} requests`);

    // Simulate batch processing
    const results = batch.map(({ request }) => ({ success: true, data: request }));

    batch.forEach(({ resolve }, i) => {
      resolve(results[i]);
    });
  }
}

const batcher = new RequestBatcher(5, 50);

console.log("\nRequest batching:");
for (let i = 0; i < 7; i++) {
  batcher.add({ id: i }).then(result => {
    console.log(`  Request ${i} completed:`, result);
  });
}

// 5.2 Debounced state updates
class StateManager {
  constructor() {
    this.state = {};
    this.pendingUpdates = {};
    this.debounceTimer = null;
  }

  update(updates) {
    Object.assign(this.pendingUpdates, updates);

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.commit();
    }, 100);
  }

  commit() {
    Object.assign(this.state, this.pendingUpdates);
    console.log('  State committed:', this.state);
    this.pendingUpdates = {};
  }

  getState() {
    return { ...this.state };
  }
}

const stateMgr = new StateManager();

console.log("\nDebounced state updates:");
stateMgr.update({ a: 1 });
stateMgr.update({ b: 2 });
stateMgr.update({ c: 3 });


// ============================================
// 6. WEB WORKERS FOR PARALLEL PROCESSING
// ============================================
/**
 * Web Workers - Background thread execution (Browser ES6)
 *
 * Characteristics:
 * - True parallel execution
 * - Separate memory space
 * - Message-based communication
 * - No DOM access
 *
 * Use Cases:
 * - Heavy computations
 * - Data processing
 * - Image/video processing
 * - Real-time analysis
 *
 * Common Pitfalls:
 * - Serialization overhead
 * - Can't share memory directly
 * - Worker creation cost
 * - Browser compatibility
 */

console.log("\n=== 6. Web Workers Demo ===");

// 6.1 Worker simulation (actual workers require separate file)
class SimulatedWorker {
  constructor(taskFn) {
    this.taskFn = taskFn;
    this.messageQueue = [];
    this.processing = false;
  }

  postMessage(data) {
    this.messageQueue.push({ data });
    if (!this.processing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.processing = true;

    while (this.messageQueue.length > 0) {
      const { data } = this.messageQueue.shift();
      try {
        const result = await this.taskFn(data);
        if (this.onmessage) {
          this.onmessage({ data: result });
        }
      } catch (error) {
        if (this.onerror) {
          this.onerror(error);
        }
      }
    }

    this.processing = false;
  }
}

// CPU-intensive task simulation
async function heavyComputation(data) {
  console.log('  Worker processing:', data);
  let sum = 0;
  for (let i = 0; i < data.n; i++) {
    sum += Math.sqrt(i);
  }
  return { result: sum, original: data };
}

const worker = new SimulatedWorker(heavyComputation);
worker.onmessage = (e) => {
  console.log('  Result from worker:', e.data.result.toFixed(2));
};

console.log("\nSimulated worker:");
worker.postMessage({ n: 100000 });

// 6.2 Worker pool pattern
class WorkerPool {
  constructor(workerFactory, size = 4) {
    this.workers = Array.from({ length: size }, () => ({
      worker: workerFactory(),
      busy: false
    }));
    this.taskQueue = [];
  }

  run(task) {
    return new Promise((resolve, reject) => {
      const availableWorker = this.workers.find(w => !w.busy);

      if (availableWorker) {
        this.executeTask(availableWorker, task).then(resolve).catch(reject);
      } else {
        this.taskQueue.push({ task, resolve, reject });
      }
    });
  }

  async executeTask(workerInfo, task) {
    workerInfo.busy = true;
    try {
      const result = await workerInfo.worker(task);
      return result;
    } finally {
      workerInfo.busy = false;
      if (this.taskQueue.length > 0) {
        const { task, resolve, reject } = this.taskQueue.shift();
        this.executeTask(workerInfo, task).then(resolve).catch(reject);
      }
    }
  }
}


// ============================================
// 7. requestAnimationFrame OPTIMIZATION
// ============================================
/**
 * requestAnimationFrame - Smooth animation timing (Browser)
 *
 * Characteristics:
 * - Syncs with display refresh rate
 * - Automatically pauses when tab hidden
 * - More efficient than setInterval
 * - ~60fps target
 *
 * Use Cases:
 * - CSS animations
 * - Canvas drawing
 * - Scroll effects
 * - Game loops
 *
 * Common Pitfalls:
 * - Too much work per frame
 * - Not canceling on unmount
 * - Frame skipping
 */

console.log("\n=== 7. requestAnimationFrame Demo ===");

// 7.1 Animation loop simulation
function simulateRAF(callback, duration = 1000) {
  const startTime = Date.now();
  const frameTime = 16.67; // ~60fps

  function frame() {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) return;

    callback(elapsed);
    setTimeout(frame, frameTime);
  }

  frame();
}

console.log("\nSimulated animation frames:");
let frameCount = 0;
simulateRAF((time) => {
  frameCount++;
  if (frameCount <= 5 || frameCount % 10 === 0) {
    console.log(`  Frame ${frameCount} at ${Math.round(time)}ms`);
  }
}, 150);

// 7.2 Throttled scroll handler
function createSmoothScrollHandler(handler) {
  let ticking = false;

  return function(event) {
    if (!ticking) {
      requestAnimationFrame(() => {
        handler.call(this, event);
        ticking = false;
      });
      ticking = true;
    }
  };
}

// 7.3 Animation frame batching
class AnimationBatcher {
  constructor() {
    this.callbacks = [];
    this.scheduled = false;
    // Fallback for Node.js environments
    this.raf = typeof requestAnimationFrame !== 'undefined'
      ? requestAnimationFrame
      : (cb) => setTimeout(cb, 16);
  }

  add(callback) {
    this.callbacks.push(callback);

    if (!this.scheduled) {
      this.scheduled = true;
      this.raf(() => this.flush());
    }
  }

  flush() {
    const callbacks = this.callbacks;
    this.callbacks = [];
    this.scheduled = false;

    callbacks.forEach(cb => cb());
  }
}

const animBatcher = new AnimationBatcher();
animBatcher.add(() => console.log('  Batched animation 1'));
animBatcher.add(() => console.log('  Batched animation 2'));


// ============================================
// 8. PERFORMANCE BENCHMARKING
// ============================================
/**
 * Performance Benchmarking - Measuring code execution (ES6+)
 *
 * Characteristics:
 * - High-resolution timing
 * - Multiple iterations for accuracy
 * - Statistical analysis
 * - Warm-up runs
 *
 * Use Cases:
 * - Algorithm comparison
 * - Optimization validation
 * - Regression detection
 * - Performance budgets
 *
 * Common Pitfalls:
 * - JIT warm-up effects
 * - Garbage collection interference
 * - Insufficient samples
 * - Testing in non-production
 */

console.log("\n=== 8. Performance Benchmarking Demo ===");

// 8.1 Simple benchmark utility
function benchmark(fn, iterations = 10000) {
  // Warm-up
  for (let i = 0; i < 100; i++) {
    fn();
  }

  // Force garbage collection hint (only available with --expose-gc; otherwise no-op)
  global.gc?.();

  const startTime = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const endTime = performance.now();
  const totalMs = endTime - startTime;

  return {
    totalMs,
    avgMs: totalMs / iterations,
    opsPerSec: iterations / (totalMs / 1000)
  };
}

// 8.2 Compare two implementations
function compareImplementations(name, fn1, fn2, iterations = 10000) {
  console.log(`\n${name}:`);

  const result1 = benchmark(fn1, iterations);
  console.log(`  Implementation 1: ${result1.opsPerSec.toFixed(0)} ops/sec`);

  const result2 = benchmark(fn2, iterations);
  console.log(`  Implementation 2: ${result2.opsPerSec.toFixed(0)} ops/sec`);

  const faster = result1.opsPerSec > result2.opsPerSec ? 1 : 2;
  const ratio = result1.opsPerSec / result2.opsPerSec;
  console.log(`  Winner: Implementation ${faster} (${ratio.toFixed(2)}x faster)`);
}

// 8.3 Example: string concatenation methods
compareImplementations(
  'String Concatenation (1000 iterations)',
  () => {
    let str = '';
    for (let i = 0; i < 100; i++) {
      str += 'a';
    }
    return str;
  },
  () => {
    const parts = [];
    for (let i = 0; i < 100; i++) {
      parts.push('a');
    }
    return parts.join('');
  },
  1000
);

// 8.4 Memory benchmark
function memoryBenchmark(fn, iterations = 1000) {
  const startMem = process.memoryUsage?.().heapUsed || 0;

  const results = [];
  for (let i = 0; i < iterations; i++) {
    results.push(fn());
  }

  const endMem = process.memoryUsage?.().heapUsed || 0;
  const memoryDelta = endMem - startMem;

  return {
    memoryDelta,
    memoryPerOp: memoryDelta / iterations,
    resultCount: results.length
  };
}

console.log("\nMemory benchmark:");
const memResult = memoryBenchmark(() => ({ data: new Array(100).fill(0) }), 100);
console.log(`  Memory delta: ${(memResult.memoryDelta / 1024).toFixed(2)} KB`);


// ============================================
// 9. COMMON PERFORMANCE PITFALLS
// ============================================
console.log("\n=== 9. Common Performance Pitfalls Demo ===");

// 9.1 Pitfall: Unnecessary re-renders
console.log("\nPitfall 1 - Unnecessary work:");
console.log("❌ Bad: Recalculating unchanged values on every call");
function badFilterList(list, filterText) {
  // Filter runs EVERY time the function is called, even if filterText hasn't changed
  return list.filter(item => item.includes(filterText));
}

const largeList = Array.from({ length: 10000 }, (_, i) => `item-${i}`);
console.log("Bad: Filter runs every time, even for same filter");
console.time("bad-filter-1");
badFilterList(largeList, "123");
console.timeEnd("bad-filter-1");
console.time("bad-filter-2");
badFilterList(largeList, "123"); // Same filter, runs again
console.timeEnd("bad-filter-2");

console.log("\n✅ Good: Memoize or cache results for unchanged inputs");
function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const goodFilterList = memoize((list, filterText) => {
  return list.filter(item => item.includes(filterText));
});

console.log("Good: Filter runs only once for same inputs");
console.time("good-filter-1");
goodFilterList(largeList, "123");
console.timeEnd("good-filter-1");
console.time("good-filter-2");
goodFilterList(largeList, "123"); // Cache hit, no recalculation
console.timeEnd("good-filter-2");

// 9.2 Pitfall: Synchronous XHR/fetch
console.log("\nPitfall 2 - Blocking operations:");
console.log("❌ Bad: Synchronous network requests block the main thread");
/*
// Bad example (commented out - would block):
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', false); // false = synchronous
xhr.send(); // Blocks all UI interaction until request completes
console.log(xhr.responseText);
*/
console.log("Synchronous requests freeze the entire page until they complete");

console.log("\n✅ Good: Use async/await properly to avoid blocking");
async function goodFetchData(url) {
  const response = await fetch(url); // Async - doesn't block
  return response.json();
}
console.log("Async requests allow UI to remain responsive while loading");

// 9.3 Pitfall: Large array operations
console.log("\nPitfall 3 - Large array operations:");
console.log("❌ Bad: Processing entire array at once blocks the thread");
const hugeArray = Array.from({ length: 1000000 }, (_, i) => i);
console.time("bad-array-process");
const badDoubled = hugeArray.map(n => n * 2); // Processes all 1M items at once
console.timeEnd("bad-array-process");

console.log("\n✅ Good: Chunk or use generators to process incrementally");
function* chunkedProcess(array, chunkSize = 1000) {
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    yield chunk.map(n => n * 2);
  }
}

console.time("good-array-process");
const goodDoubled = [];
for (const chunk of chunkedProcess(hugeArray, 1000)) {
  goodDoubled.push(...chunk);
  // Optionally yield to event loop between chunks:
  // await new Promise(resolve => setTimeout(resolve, 0));
}
console.timeEnd("good-array-process");
console.log("Chunked processing allows main thread to handle other tasks between chunks");

// 9.4 Pitfall: Excessive DOM manipulation
console.log("\nPitfall 4 - DOM thrashing:");
console.log("❌ Bad: Multiple layout-triggering reads/writes interleaved");
/*
// Bad example (commented out - needs DOM environment):
const elements = document.querySelectorAll('.item');
elements.forEach(el => {
  // Read (triggers layout)
  const height = el.offsetHeight;
  // Write (invalidates layout)
  el.style.height = `${height + 10}px`;
}); // Causes layout recalculation for EVERY element
*/
console.log("Interleaved read/write causes forced synchronous layouts (layout thrashing)");

console.log("\n✅ Good: Batch DOM operations");
/*
// Good example (commented out - needs DOM environment):
const elements = document.querySelectorAll('.item');
// First: Read ALL layout values
const heights = Array.from(elements).map(el => el.offsetHeight);
// Then: Write ALL changes
elements.forEach((el, i) => {
  el.style.height = `${heights[i] + 10}px`;
}); // Only one layout recalculation needed
*/
console.log("Batch reads then writes to minimize layout recalculations");

// 9.5 Live demo: Efficient vs inefficient
function inefficientSum(n) {
  const arr = [];
  for (let i = 0; i < n; i++) {
    arr.push(i);
  }
  return arr.reduce((a, b) => a + b, 0);
}

function efficientSum(n) {
  return (n * (n - 1)) / 2; // O(1) formula
}

console.log("\nEfficiency comparison:");
const testN = 100000;

const t1 = performance.now();
inefficientSum(testN);
console.log(`Inefficient: ${(performance.now() - t1).toFixed(2)}ms`);

const t2 = performance.now();
efficientSum(testN);
console.log(`Efficient: ${(performance.now() - t2).toFixed(2)}ms`);


// ============================================
// 10. V8 ENGINE INTERNALS
// ============================================
/**
 * V8 Engine Internals - Hidden classes, inline caches, and shape transitions
 *
 * NOTE: These are V8 (and SpiderMonkey/JSC) engine implementation details,
 * NOT ECMAScript spec features. Behavior is engine-specific and may change
 * between versions. No verification block (not an ES feature).
 *
 * Key concepts:
 * - Hidden classes (maps): V8 tracks object "shape" for fast property access
 * - Inline caches (IC): optimize repeated property access / function calls
 * - Monomorphic vs polymorphic/megamorphic call sites: IC state matters
 * - `delete` transitions objects to slow "dictionary mode"
 *
 * References:
 * - https://v8.dev/blog/fast-properties
 * - https://mathiasbynens.be/notes/shapes-ics
 */

console.log("\n=== 10. V8 Engine Internals Demo ===");

// 10.1 Hidden classes (maps) - object shape tracking
// V8 assigns each object a hidden class describing its property layout.
// Two objects with the SAME properties added in the SAME order share a
// hidden class (fast property access). Different order => different class.
const o1 = { a: 1, b: 2 };
const o2 = { b: 2, a: 1 }; // same keys, different insertion order

console.log("\nHidden classes (maps):");
console.log("o1:", o1);          // { a: 1, b: 2 }
console.log("o2:", o2);          // { b: 2, a: 1 }
console.log("Note: o1 and o2 have DIFFERENT hidden classes in V8");
console.log("  because property insertion order differs (a,b vs b,a).");
console.log("Tip: Construct objects of the same logical type in a");
console.log("  consistent field order so they share a hidden class.");

// 10.2 Property addition order triggers hidden class transitions
// Each new property transitions the object to a new hidden class.
// Adding fields dynamically in different orders creates divergent class
// chains, which defeats inline-cache optimizations.
function makePointA(x, y) {
  const p = { x };   // hidden class C0 -> C1 (x)
  p.y = y;           // transitions to C2 (x, y)
  return p;
}

function makePointB(x, y) {
  const p = { y };   // hidden class C0' -> C1' (y)
  p.x = x;           // transitions to C2' (y, x) — different class!
  return p;
}

console.log("\nHidden class transitions:");
console.log("makePointA(1,2):", makePointA(1, 2)); // { x: 1, y: 2 }
console.log("makePointB(1,2):", makePointB(1, 2)); // { y: 2, x: 1 }
console.log("Both look identical logically but use different hidden classes.");
console.log("Fix: Always assign properties in the same order (ideally via");
console.log("  constructor or object literal with fixed key order).");

// 10.3 Inline caches (IC) - monomorphic vs polymorphic vs megamorphic
// When a function reads `obj.x` repeatedly, V8 caches the lookup keyed by
// the object's hidden class:
//   - Monomorphic: 1 shape seen => fastest (single cached lookup)
//   - Polymorphic: 2-4 shapes => slower (small cache of lookups)
//   - Megamorphic: 5+ shapes => falls back to slow generic lookup
// Below we model the *concept* (we cannot directly measure IC state here).
function readX(obj) {
  return obj.x; // IC state depends on the shapes of objects passed here
}

const monomorphic = [makePointA(1, 1), makePointA(2, 2), makePointA(3, 3)];
console.log("\nInline cache states (conceptual):");
console.log("Monomorphic site (all same shape):",
  monomorphic.map(readX)); // [1, 2, 3] — IC stays monomorphic (fast)

// Polymorphic / megamorphic: feed the SAME call site objects of many shapes
const mixed = [
  { x: 1 },            // shape S1
  { x: 2, y: 2 },      // shape S2
  { x: 3, z: 3 },      // shape S3
  { x: 4, w: 4 },      // shape S4
  { x: 5, q: 5 }       // shape S5 -> megamorphic (5+ shapes)
];
console.log("Polymorphic/megamorphic site (many shapes):",
  mixed.map(readX));    // [1, 2, 3, 4, 5] — IC degrades to megamorphic (slow)
console.log("Tip: Keep call sites monomorphic by passing objects that share");
console.log("  a hidden class (same fields, same order).");

// 10.4 The `delete` trap - dictionary (slow) mode
// `delete obj.prop` removes a property and can transition the object from
// fast "in-object" properties to slow "dictionary mode" (hash table backed).
// Dictionary mode is slower for property access. Prefer setting to
// undefined (keeps the shape) when you just need to "clear" a value.
const obj = { a: 1, b: 2, c: 3 };
console.log("\nThe delete trap:");
console.log("Before delete:", obj); // { a: 1, b: 2, c: 3 }

// ❌ SLOWER: delete forces a shape transition (often to dictionary mode)
delete obj.b;
console.log("After delete obj.b:", obj); // { a: 1, c: 3 }

// ✅ FASTER (when clearing is enough): set to undefined, keep shape stable
const obj2 = { a: 1, b: 2, c: 3 };
obj2.b = undefined;
console.log("After obj2.b = undefined:", obj2); // { a: 1, b: undefined, c: 3 }
console.log("Tip: Use `obj.prop = undefined` to clear a value while keeping");
console.log("  the hidden class stable; reserve `delete` for genuinely");
console.log("  removing keys (and accept the shape-transition cost).");

// 10.5 Practical takeaways
console.log("\nV8 performance takeaways:");
console.log("- Always initialize object fields in the same order.");
console.log("- Avoid mixing many object shapes at one call site.");
console.log("- Prefer `x = undefined` over `delete x` to preserve shape.");
console.log("- Allocate \"hot\" objects via constructors/classes for stable shapes.");
console.log("- These are engine details: profile with V8 flags / DevTools");
console.log("  before micro-optimizing.");


// ============================================
// BEST PRACTICES
// ============================================
/**
 * Performance Optimization Best Practices
 *
 * 1. MEASURE BEFORE OPTIMIZING
 *    - Profile first, optimize second
 *    - Focus on actual bottlenecks
 *    - Verify improvements with benchmarks
 *
 * 2. USE APPROPRIATE DATA STRUCTURES
 *    - Map/Set for lookups
 *    - Typed arrays for numeric data
 *    - Generators for large sequences
 *
 * 3. BATCH SIMILAR OPERATIONS
 *    - DOM updates
 *    - Network requests
 *    - State changes
 *
 * 4. YIELD TO EVENT LOOP
 *    - Chunk long-running tasks
 *    - Use requestAnimationFrame for UI
 *    - Consider Web Workers for CPU work
 *
 * 5. AVOID PREMATURE OPTIMIZATION
 *    - Write clear code first
 *    - Optimize hot paths only
 *    - Document optimization reasons
 */

console.log("\n=== Performance Best Practices Demo ===");

// Good: Measured optimization
console.log("\nMeasured approach:");
console.log("1. Profile to find bottleneck");
console.log("2. Implement targeted fix");
console.log("3. Verify with benchmark");
console.log("4. Document the optimization");


// ============================================
// SUMMARY
// ============================================
/**
 * Performance Optimization Summary
 *
 * Key Concepts:
 * 1. Tail call optimization and trampolines
 * 2. Memoization with LRU eviction
 * 3. Lazy evaluation with generators
 * 4. Event loop aware programming
 * 5. Batching for throughput
 * 6. Web Workers for parallelism
 * 7. requestAnimationFrame for smooth UI
 * 8. Benchmark-driven optimization
 *
 * When to Use:
 * - Actual performance problems exist
 * - Measurable user impact
 * - Hot code paths identified
 *
 * When to Avoid:
 * - Premature optimization
 * - Clear code sacrifice
 * - Without measurement
 */

console.log("\n=== Performance Optimization Demo Complete ===");


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPED MEMOIZATION
   TS:  function memoize<T extends (...args: any[]) => any>(fn: T): T

   TypeScript example:
   function memoize<T extends (...args: any[]) => any>(
     fn: T,
     serializer: (...args: Parameters<T>) => string = JSON.stringify
   ): T {
     const cache = new Map<string, ReturnType<T>>();
     return ((...args: Parameters<T>) => {
       const key = serializer(...args);
       if (cache.has(key)) return cache.get(key)!;
       const result = fn(...args);
       cache.set(key, result);
       return result;
     }) as T;
   }

2. GENERATOR TYPES
   TS:  function* range(start: number, end: number): IterableIterator<number>

   TypeScript example:
   function* range(start: number, end: number): IterableIterator<number> {
     for (let i = start; i <= end; i++) {
       yield i;
     }
   }

3. WORKER MESSAGE TYPES
   TS:  interface WorkerMessage { type: string; payload: any }

   TypeScript example:
   interface ComputeRequest {
     type: 'compute';
     payload: { n: number };
   }

   interface ComputeResponse {
     type: 'result';
     payload: number;
   }

4. LAZY TYPE
   TS:  class Lazy<T> { get(): T }

   TypeScript example:
   class Lazy<T> {
     private fn: () => T;
     private evaluated: boolean = false;
     private value: T | undefined;

     constructor(fn: () => T) {
       this.fn = fn;
     }

     get(): T {
       if (!this.evaluated) {
         this.value = this.fn();
         this.evaluated = true;
       }
       return this.value!;
     }
   }

5. PERFORMANCE MARK TYPES
   TS:  performance.mark(name: string)

   TypeScript example:
   performance.mark('start');
   // ... code ...
   performance.mark('end');
   performance.measure('duration', 'start', 'end');
   const measure = performance.getEntriesByName('duration')[0];

📘 See related files:
- 22-iterators-generators.js (generators)
- 24-function-patterns-advanced.js (memoization)
- 27-memory-management.js (memory optimization)
*/

// ============================================
// CROSS-REFERENCES
// ============================================
console.log(`
📘 See related files for additional patterns:

Performance & Optimization:
- 24-function-patterns-advanced.js (memoization, lazy evaluation)
- 27-memory-management.js (garbage collection, object pooling)
- 22-iterators-generators.js (generator-based streaming)
`);
