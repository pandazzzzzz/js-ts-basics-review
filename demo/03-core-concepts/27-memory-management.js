// Memory Management Demo
// 📘 For TypeScript comparison, see: 27-memory-management-ts-comparison.ts
// 🎯 Difficulty: Advanced
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces memory management concepts that become relevant as applications grow larger.
// The examples show how weak references, garbage collection, and common leaks relate to everyday JavaScript programming.

// ============================================
// Table of Contents
// ============================================

// 1. WEAKREF AND FINALIZATIONREGISTRY
// 2. WEAKMAP AND WEAKSET PATTERNS
// 3. COMMON MEMORY LEAK PATTERNS
// 4. OBJECT POOLING
// 5. GARBAGE COLLECTION BASICS
// 6. LARGE DATA HANDLING
// 7. NODE.JS MEMORY CONSIDERATIONS
// 8. BROWSER MEMORY CONSIDERATIONS
// 9. MEMORY PROFILING TOOLS
// 10. MEMORY OPTIMIZATION TECHNIQUES

// ============================================

// ============================================
// 1. WEAKREF AND FINALIZATIONREGISTRY
// ============================================
/**
 * WeakRef and FinalizationRegistry - Weak references and cleanup callbacks (ES2021)
 *
 * Characteristics:
 * - WeakRef: Hold weak reference to object
 * - FinalizationRegistry: Register cleanup callback
 * - Allows garbage collection of referenced objects
 * - Non-deterministic finalization timing
 *
 * Use Cases:
 * - Caching without memory leaks
 * - DOM node cleanup tracking
 * - Large object management
 * - Circular reference handling
 *
 * Common Pitfalls:
 * - Not supported in all environments
 * - Finalization not guaranteed
 * - Can't rely on timing
 * - Performance overhead
 */

console.log("=== 1. WeakRef and FinalizationRegistry Demo ===");

// 1.1 WeakRef basics
console.log("\nWeakRef basics:");

let targetObject = { data: "important data" };
const weakRef = new WeakRef(targetObject);

console.log("Strong reference exists:", targetObject !== undefined);
console.log("WeakRef deref():", weakRef.deref());

// Clear strong reference
targetObject = null;

// Force garbage collection hint (only works with --expose-gc flag)
if (global.gc) {
  global.gc();
  console.log("After GC, WeakRef deref():", weakRef.deref());
} else {
  console.log("(Run with --expose-gc to see GC effect)");
}

// 1.2 FinalizationRegistry basics
console.log("\nFinalizationRegistry:");

// Note: FinalizationRegistry callbacks are non-deterministic — they may never
// fire (e.g. if the process exits before GC), so don't rely on them for
// critical cleanup. Use try/finally or `using` (ES2027) for deterministic cleanup.
const registry = new FinalizationRegistry(heldValue => {
  console.log(`  Cleanup callback: ${heldValue} was garbage collected`);
});

{
  let obj = { name: "temporary" };
  registry.register(obj, "obj-1");
  console.log("Registered obj-1 for finalization");
  obj = null; // Allow GC
}

// 📘 Official MDN examples (FinalizationRegistry):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry
// "Callbacks are never called synchronously" — at MDN's original scale (50000/5000)
// the cleanup logs after the allocation loop finishes; at this scaled-down size V8
// may not collect during the run at all — the point is: never rely on the timing.
// (Scaled down 5× from MDN's 50000/5000 so the demo stays fast — same lesson.)
let mdnCounter = 0;
const mdnRegistry = new FinalizationRegistry(() => {
  console.log(`  MDN demo: Array gets garbage collected at ${mdnCounter}`);
});

mdnRegistry.register(["foo"]);

(function allocateMemory() {
  // Allocate 10000 functions — a lot of memory!
  Array.from({ length: 10000 }, () => () => {});
  if (mdnCounter > 1000) return;
  mdnCounter++;
  allocateMemory();
})();

console.log("  Main job ends (finalization logs above may appear later — or never)");

// 1.3 WeakRef with caching pattern
class CacheWithWeakRefs {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry(key => {
      console.log(`  Cache entry "${key}" cleaned up`);
      this.cache.delete(key);
    });
  }

  set(key, value) {
    const weakRef = new WeakRef(value);
    this.cache.set(key, weakRef);
    this.registry.register(value, key);
    console.log(`Cached "${key}"`);
  }

  get(key) {
    const weakRef = this.cache.get(key);
    if (weakRef) {
      const value = weakRef.deref();
      if (value !== undefined) {
        return value;
      }
      // Value was garbage collected
      this.cache.delete(key);
    }
    return undefined;
  }
}

const cache = new CacheWithWeakRefs();
let cachedObj1 = { id: 1, data: "large data" };
let cachedObj2 = { id: 2, data: "more data" };

cache.set("obj1", cachedObj1);
cache.set("obj2", cachedObj2);

console.log("\nCache get obj1:", cache.get("obj1"));

cachedObj1 = null; // Allow GC

// ============================================
// 2. WEAKMAP AND WEAKSET PATTERNS
// ============================================
/**
 * WeakMap and WeakSet - Collections with weak references (ES6)
 *
 * Characteristics:
 * - Keys (WeakMap) / Values (WeakSet) held weakly
 * - Automatically cleaned up by GC
 * - Non-enumerable (no keys()/values())
 * - Only objects as keys/values
 *
 * Use Cases:
 * - Private data storage
 * - Metadata without memory leaks
 * - DOM element associations
 * - Memoization with automatic cleanup
 *
 * Common Pitfalls:
 * - Can't iterate or serialize
 * - No size property
 * - Only weak references to keys
 */

console.log("\n=== 2. WeakMap and WeakSet Patterns Demo ===");

// 2.1 WeakMap for private data
console.log("\nWeakMap for private data:");

const privateData = new WeakMap();

class SecureClass {
  constructor(secret) {
    privateData.set(this, { secret, createdAt: new Date() });
  }

  getSecret() {
    return privateData.get(this)?.secret;
  }

  getInfo() {
    const data = privateData.get(this);
    return {
      hasSecret: !!data?.secret,
      createdAt: data?.createdAt,
    };
  }
}

const secure = new SecureClass("my-secret-key");
console.log("Secret:", secure.getSecret());
console.log("Info:", secure.getInfo());

// 2.2 WeakMap for DOM associations (simulated)
console.log("\nWeakMap for DOM associations:");

const elementData = new WeakMap();

class DOMElementSimulator {
  constructor(id) {
    this.id = id;
  }
}

const button1 = new DOMElementSimulator("btn-1");
const button2 = new DOMElementSimulator("btn-2");

elementData.set(button1, { clickCount: 0, handler: () => {} });
elementData.set(button2, { clickCount: 5, handler: () => {} });

console.log("button1 data:", elementData.get(button1));

// When button1 is "removed" (dereferenced), its data becomes eligible for GC
const button1Ref = button1; // Keep reference for demo

// 2.3 WeakMap for memoization
console.log("\nWeakMap memoization:");

const memoCache = new WeakMap();

function memoizedMethod(obj, computeFn) {
  if (!memoCache.has(obj)) {
    console.log("  Computing result...");
    const result = computeFn(obj);
    memoCache.set(obj, result);
  } else {
    console.log("  Returning cached result...");
  }
  return memoCache.get(obj);
}

const target = { value: 42 };
console.log(
  "First call:",
  memoizedMethod(target, o => o.value * 2)
);
console.log(
  "Second call:",
  memoizedMethod(target, o => o.value * 2)
);

// 2.4 WeakSet for object tracking
console.log("\nWeakSet for tracking:");

const visitedObjects = new WeakSet();

function processObject(obj) {
  if (visitedObjects.has(obj)) {
    console.log("  Already processed, skipping circular reference");
    return;
  }

  visitedObjects.add(obj);
  console.log("  Processing object...");

  // Simulate processing nested objects
  if (obj.nested) {
    processObject(obj.nested);
  }
}

const circularObj = { name: "root", nested: { name: "child" } };
circularObj.nested.parent = circularObj; // Circular reference

processObject(circularObj);
processObject(circularObj.nested);
processObject(circularObj); // Will be skipped

// 2.5 Symbol as WeakMap key (ES2023)
console.log("\nSymbol as WeakMap key (ES2023):");

// Before ES2023, WeakMap keys had to be objects. ES2023 (Symbols as WeakMap
// keys proposal) allows non-registered (unique, created with Symbol()) Symbols
// to be used as keys in WeakMap, WeakSet, WeakRef, and FinalizationRegistry —
// useful for keyed metadata without needing an object identity.
// Registered symbols (Symbol.for()) are not allowed, as they are never
// garbage-collected; well-known symbols like Symbol.iterator are allowed.
/*
 * verification:
 *   feature: Symbols as WeakMap keys
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const wm = new WeakMap();
const s = Symbol("k");
wm.set(s, "v");
console.log("  wm.get(s):", wm.get(s)); // 'v'

// ============================================
// 3. COMMON MEMORY LEAK PATTERNS
// ============================================
/**
 * Memory Leak Patterns - Common causes and prevention (All ES versions)
 *
 * Characteristics:
 * - Unintended references preventing GC
 * - Accumulating data over time
 * - Event listeners not removed
 * - Timers not cleared
 *
 * Use Cases:
 * - Understanding leak sources
 * - Debugging memory issues
 * - Writing leak-free code
 *
 * Common Pitfalls:
 * - Global variables accumulation
 * - Forgotten event listeners
 * - Unclosed timers/intervals
 * - Detached DOM trees
 */

console.log("\n=== 3. Common Memory Leak Patterns Demo ===");

// 3.1 Leak: Global variable accumulation
console.log("\nLeak pattern 1 - Global accumulation:");

function leakyGlobalAccumulation() {
  // Bad: Adding to global without cleanup
  // window.leakyData = new Array(1000000).fill('data');
  console.log("  Bad: window.leakyData = largeArray");
  console.log("  Good: Use local variables or clean up globals");
}

leakyGlobalAccumulation();

// 3.2 Leak: Forgotten event listeners
console.log("\nLeak pattern 2 - Forgotten event listeners:");

class LeakyEventEmitter {
  constructor() {
    this.listeners = [];
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  removeListener(fn) {
    this.listeners = this.listeners.filter(f => f !== fn);
  }

  emit(data) {
    this.listeners.forEach(fn => fn(data));
  }
}

const emitter = new LeakyEventEmitter();

function problematicComponent() {
  const handler = data => console.log("Handler called:", data);
  emitter.addListener(handler);
  // Problem: Never removing listener when component unmounts
  console.log("  Bad: Listener added, never removed");
}

problematicComponent();

// Good pattern
class ProperComponent {
  constructor(emitter) {
    this.emitter = emitter;
    this.handler = this.handle.bind(this);
    this.emitter.addListener(this.handler);
  }

  handle(data) {
    console.log("  Proper handler:", data);
  }

  destroy() {
    this.emitter.removeListener(this.handler);
    console.log("  Good: Listener removed on destroy");
  }
}

const component = new ProperComponent(emitter);
component.destroy();

// 3.3 Leak: Unclosed timers
console.log("\nLeak pattern 3 - Unclosed timers:");

class TimerLeak {
  start() {
    // Bad: Interval never cleared
    // setInterval(() => this.doWork(), 1000);
    console.log("  Bad: setInterval without clearInterval");
  }
}

class TimerProper {
  constructor() {
    this.intervalId = null;
  }

  start() {
    this.intervalId = setInterval(() => this.doWork(), 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("  Good: Interval cleared");
    }
  }

  doWork() {
    console.log("  Working...");
  }
}

// 3.4 Leak: Detached DOM trees (conceptual)
console.log("\nLeak pattern 4 - Detached DOM trees:");
console.log("  Bad: Keeping reference to removed DOM element");
console.log("  Good: Nullify references when removing elements");

// 3.5 Leak: Closure capturing large objects
console.log("\nLeak pattern 5 - Closure capturing:");

function createLeakyClosure(largeData) {
  // Even small returned function keeps largeData alive
  return function smallFunction() {
    return largeData.length;
  };
}

function createOptimizedClosure(largeData) {
  // Extract needed data, don't capture entire object
  const length = largeData.length;
  return function smallFunction() {
    return length;
  };
}

const bigArray = new Array(1000000).fill(0);
const leakyFn = createLeakyClosure(bigArray);
const optimizedFn = createOptimizedClosure(bigArray);

console.log("  Bad: Closure captures entire largeData array");
console.log("  Good: Closure only captures needed primitive value");

// ============================================
// 3.6 END-TO-END LEAK DIAGNOSIS WALKTHROUGH (实战排查案例)
// ============================================
// 这是一个完整的内存泄漏排查演练：从"检测"→"定位"→"修复"→"验证"。
// 对应真实场景：大型 SPA 长时间运行后内存持续上涨、页面变卡。

console.log("\n=== 3.6 End-to-End Leak Diagnosis Walkthrough ===");
console.log(`
真实场景：一个任务看板页面运行 8 小时后，内存从 80MB 涨到 2.4GB，
Chrome 任务管理器提示"内存占用过高"，页面开始卡顿。
`);

// ---- 第 1 步：检测 - 确认是否真的泄漏，而不是正常波动 ----
console.log("步骤 1 检测（Diagnose）：");
console.log("- 用 Chrome DevTools Memory 面板看 Heap Snapshot 两次快照差");
console.log("- 或用 performance.measureUserAgentSpecificMemory()（cross-origin isolation）");
console.log("- 关键：GC 后堆大小是否回到基线。若 GC 后仍持续上涨，则是泄漏");

// 模拟：写一个会累积引用的"泄漏版"模块
function LeakyTodoStore() {
  this._completions = []; // 无限增长的数组
  this._onComplete = id => {
    // 闭包捕获 this，被反复注册
    this._completions.push(id);
  };
}
LeakyTodoStore.prototype.handleTask = function (id) {
  // 模拟每完成一个任务就注册一次监听且从不清理
  this._onComplete(id);
};

// ---- 第 2 步：定位 - 用堆快照找"不可达却仍被引用"的对象 ----
console.log("\n步骤 2 定位（Isolate）：");
console.log("- 打 3 次 Heap Snapshot，过滤 'retained size' 最大的对象");
console.log("- 关注泄漏版 store 的 _completions 数组 retained size 是否只增不减");
console.log("- 'Constructor' 视图按 retained size 排序，点开数组看引用链");

// ---- 第 3 步：修复 - 找到根因并改造 ----
function FixedTodoStore() {
  // 修复1：不再把回调永远 push 进数组，改为有界或事件式
  this._onComplete = null; // 只持有一个最新回调，避免无限累积
}
FixedTodoStore.prototype.handleTask = function (id, cb) {
  this._onComplete = cb || this._onComplete; // 覆盖式赋值，不累积
  // 用后即清，避免闭包捕获 this 太久
  const fn = this._onComplete;
  this._onComplete = null;
  return fn(id);
};

// ---- 第 4 步：验证 - 修复后内存是否回到基线 ----
console.log("\n步骤 4 验证（Verify）：");
console.log("- 跑同样的任务量，GC 后堆大小应回到基线");
console.log("- 连续 N 次 Heap Snapshot，retained size 不再单调上涨");
console.log("- 对比修复前后：修复前 _completions.length 无限增长，修复后为 0");

// 演示两种实现的差异
const leakyStore = new LeakyTodoStore();
const fixedStore = new FixedTodoStore();

// 泄漏版：数组持续累积
for (let i = 0; i < 5; i++) leakyStore.handleTask(i);
console.log(`\n❌ 泄漏版：_completions 累积了 ${leakyStore._completions.length} 条（只增不减）`);

// 修复版：不累积
let lastResult;
for (let i = 0; i < 5; i++) lastResult = fixedStore.handleTask(i, id => id * 2);
console.log(`✅ 修复版：_completions 不存在，最新结果 = ${lastResult}（不累积）`);

console.log("\n排查要点总结：");
console.log("1. 先确认再修：GC 后堆不回基线才是泄漏");
console.log("2. 优先看全局/闭包/事件监听这三大引用源");
console.log("3. 修复思路：有界容器、覆盖式赋值、用后即清、显式清理");
console.log("4. 改完必须验证内存回落到基线，避免盲目优化");

// ============================================
// 4. OBJECT POOLING
// ============================================
/**
 * Object Pooling - Reusing objects instead of creating new ones (ES6)
 *
 * Characteristics:
 * - Pre-allocate objects
 * - Borrow and return pattern
 * - Reduces GC pressure
 * - Improves performance for frequent alloc/dealloc
 *
 * Use Cases:
 * - Game entities
 * - Network connections
 * - Database connections
 * - Buffer allocations
 *
 * Common Pitfalls:
 * - Pool state contamination
 * - Fixed size limitations
 * - Complexity overhead
 */

console.log("\n=== 4. Object Pooling Demo ===");

// 4.1 Basic object pool
class ObjectPool {
  constructor(factory, resetFn, initialSize = 10) {
    this.factory = factory;
    this.resetFn = resetFn;
    this.available = [];
    this.inUse = new Set();

    // Pre-allocate
    for (let i = 0; i < initialSize; i++) {
      this.available.push(factory());
    }
  }

  acquire() {
    let obj;

    if (this.available.length > 0) {
      obj = this.available.pop();
    } else {
      obj = this.factory();
      console.log("  Pool expanded - created new object");
    }

    this.inUse.add(obj);
    return obj;
  }

  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj);
      this.resetFn(obj);
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

// 4.2 Example: Vector pool for games/math
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0, z: 0 }),
  vec => {
    vec.x = 0;
    vec.y = 0;
    vec.z = 0;
  },
  5
);

console.log("\nVector pool:");
console.log("Initial stats:", vectorPool.stats);

const v1 = vectorPool.acquire();
const v2 = vectorPool.acquire();
const v3 = vectorPool.acquire();

v1.x = 10;
v1.y = 20;
v1.z = 30;
v2.x = 5;
v2.y = 5;
v2.z = 5;

console.log("After acquiring 3 vectors:", vectorPool.stats);

vectorPool.release(v1);
console.log("After releasing v1:", vectorPool.stats);

const v4 = vectorPool.acquire();
console.log("Acquired v4 (reused v1):", vectorPool.stats);
console.log("v4 values:", v4); // Should be zeroed

// 4.3 Example: Buffer pool for I/O
class BufferPool {
  constructor(bufferSize = 1024, initialCount = 5) {
    this.bufferSize = bufferSize;
    this.available = [];

    for (let i = 0; i < initialCount; i++) {
      this.available.push(Buffer.alloc(bufferSize));
    }
  }

  acquire() {
    if (this.available.length > 0) {
      return this.available.pop();
    }
    return Buffer.alloc(this.bufferSize);
  }

  release(buffer) {
    buffer.fill(0); // Clear buffer
    this.available.push(buffer);
  }
}

const bufferPool = new BufferPool(256, 3);
console.log("\nBuffer pool created with 3 buffers");

const buf1 = bufferPool.acquire();
buf1.write("Hello");
console.log("buf1 content:", buf1.toString().trim());

bufferPool.release(buf1);
console.log("Buffer released and cleared");

// ============================================
// 5. GARBAGE COLLECTION BASICS
// ============================================
/**
 * Garbage Collection - Automatic memory management (Implementation-specific)
 *
 * Characteristics:
 * - Mark-and-sweep algorithm
 * - Generational collection
 * - Incremental collection
 * - Concurrent collection
 *
 * Use Cases:
 * - Understanding GC behavior
 * - Writing GC-friendly code
 * - Debugging memory issues
 *
 * Common Pitfalls:
 * - Assuming immediate collection
 * - Creating excessive short-lived objects
 * - Holding unnecessary references
 */

console.log("\n=== 5. Garbage Collection Basics Demo ===");

// 5.1 GC generations (conceptual)
console.log("\nGC Generations:");
console.log("  Young generation (Eden space): Short-lived objects");
console.log("  Old generation: Long-lived objects");
console.log(
  '  Code space / Large object space: V8-specific (no "Permanent generation" — that is JVM terminology)'
);

// 5.2 GC-friendly patterns
console.log("\nGC-friendly patterns:");

// Bad: Creating many temporary objects
function gcUnfriendly(n) {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += String.fromCharCode(65 + (i % 26));
    // Each concatenation creates a new string
  }
  return result;
}

// Good: Minimizing object creation
function gcFriendly(n) {
  const chars = [];
  for (let i = 0; i < n; i++) {
    chars.push(String.fromCharCode(65 + (i % 26)));
  }
  return chars.join("");
}

console.time("GC-unfriendly");
gcUnfriendly(10000);
console.timeEnd("GC-unfriendly");

console.time("GC-friendly");
gcFriendly(10000);
console.timeEnd("GC-friendly");

// 5.3 Explicit dereferencing
console.log("\nExplicit dereferencing:");

class DataProcessor {
  constructor(largeData) {
    this.data = largeData;
  }

  process() {
    console.log("  Processing data...");
    // After processing, explicitly clear reference
    this.data = null;
    console.log("  Data reference cleared");
  }
}

const processor = new DataProcessor(new Array(1000000).fill(0));
processor.process();

// ============================================
// 6. LARGE DATA HANDLING
// ============================================
/**
 * Large Data Handling - Memory-efficient processing (ES6+)
 *
 * Characteristics:
 * - Streaming/chunked processing
 * - Typed arrays for numeric data
 * - SharedArrayBuffer for workers
 * - Memory-mapped files (Node.js)
 *
 * Use Cases:
 * - Big data processing
 * - File uploads/downloads
 * - Video/audio processing
 * - Scientific computing
 *
 * Common Pitfalls:
 * - Loading entire dataset in memory
 * - Inefficient data structures
 * - Not using streaming APIs
 */

console.log("\n=== 6. Large Data Handling Demo ===");

// 6.1 Typed arrays for numeric data
console.log("\nTyped arrays:");

const regularArray = new Array(1000000);
for (let i = 0; i < 1000000; i++) {
  regularArray[i] = i;
}

const typedArray = new Float64Array(1000000);
for (let i = 0; i < 1000000; i++) {
  typedArray[i] = i;
}

// Note: this regular-array estimate assumes 8 bytes/element (a HeapNumber pointer),
// but V8 optimizes small-integer arrays with PACKED_SMI_ELEMENTS (~4 bytes/element),
// so the real ratio vs TypedArray is often closer to 1-2x, not 7x.
console.log(
  "Regular array size estimate (upper bound, 8 bytes/elem):",
  `${((regularArray.length * 8) / 1024 / 1024).toFixed(2)} MB`
);
console.log("TypedArray size:", `${(typedArray.byteLength / 1024 / 1024).toFixed(2)} MB`);
console.log("TypedArray wins most for fixed-encoding types (Int32=4 bytes, Float64=8 bytes)");

// 6.2 Chunked processing
console.log("\nChunked processing:");

async function processLargeFile(chunkSize = 10000) {
  const totalItems = 100000;
  const results = [];

  for (let i = 0; i < totalItems; i += chunkSize) {
    const chunk = [];
    const end = Math.min(i + chunkSize, totalItems);

    for (let j = i; j < end; j++) {
      chunk.push(j * 2);
    }

    // Process chunk
    const processed = chunk.map(x => x + 1);
    results.push(...processed);

    // Yield to event loop
    await new Promise(resolve => setTimeout(resolve, 0));

    console.log(`  Processed ${end}/${totalItems} items`);
  }

  return results;
}

processLargeFile(25000).then(results => {
  console.log(`  Total processed: ${results.length} items`);
});

// 6.3 Generator-based streaming
console.log("\nGenerator streaming:");

function* streamLargeData(total) {
  for (let i = 0; i < total; i++) {
    yield { id: i, data: `item-${i}` };
  }
}

function consumeStream(generator, limit = 5) {
  let count = 0;
  for (const item of generator) {
    if (count >= limit) break;
    console.log(`  Streamed: ${item.id}`);
    count++;
  }
}

consumeStream(streamLargeData(1000000), 5);

// ============================================
// 7. NODE.JS MEMORY CONSIDERATIONS
// ============================================
/**
 * Node.js Memory Considerations - Server-side memory management
 *
 * Characteristics:
 * - V8 old-space limit auto-tuned to physical memory (configurable via --max-old-space-size)
 * - Buffer allocation outside heap
 * - Worker threads isolation
 * - Cluster mode memory sharing
 *
 * Use Cases:
 * - Server applications
 * - Data processing pipelines
 * - Real-time applications
 *
 * Common Pitfalls:
 * - Hitting heap limits
 * - Buffer memory leaks
 * - Not monitoring memory usage
 */

console.log("\n=== 7. Node.js Memory Considerations Demo ===");

// 7.1 Memory usage inspection
if (typeof process !== "undefined" && process.memoryUsage) {
  console.log("\nCurrent memory usage:");
  const memUsage = process.memoryUsage();
  console.log("  Heap Used:", `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log("  Heap Total:", `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log("  RSS:", `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
}

// 7.2 Buffer memory (outside V8 heap)
console.log("\nBuffer allocation:");

const buffer1 = Buffer.alloc(1024 * 1024); // 1MB
console.log("Allocated 1MB buffer (outside V8 heap)");

// 7.3 Stream-based processing (memory efficient)
console.log("\nStream processing concept:");
console.log("  Bad: fs.readFileSync (loads entire file)");
console.log("  Good: fs.createReadStream (chunks data)");

// ============================================
// 8. BROWSER MEMORY CONSIDERATIONS
// ============================================
/**
 * Browser Memory Considerations - Client-side memory management
 *
 * Characteristics:
 * - Tab/process isolation
 * - DOM tree memory
 * - JavaScript heap
 * - GPU memory for rendering
 *
 * Use Cases:
 * - Single-page applications
 * - Complex UI components
 * - Media-heavy applications
 *
 * Common Pitfalls:
 * - DOM memory leaks
 * - Detached node references
 * - Unbounded event listeners
 */

console.log("\n=== 8. Browser Memory Considerations Demo ===");

// 8.1 DOM memory management (conceptual)
console.log("\nDOM memory patterns:");
console.log("  Bad: Keeping reference to removed element");
console.log("  Good: Nullify references on removal");

// 8.2 Image/video memory
console.log("\nMedia memory:");
console.log("  Bad: Loading full-resolution images unnecessarily");
console.log("  Good: Use responsive images, lazy loading");

// 8.3 Virtual scrolling pattern
console.log("\nVirtual scrolling concept:");

function virtualScrollPattern(totalItems, visibleRange) {
  const [start, end] = visibleRange;
  const itemsToRender = [];

  for (let i = start; i < end && i < totalItems; i++) {
    itemsToRender.push({ id: i, content: `Item ${i}` });
  }

  return itemsToRender;
}

const visibleItems = virtualScrollPattern(10000, [0, 20]);
console.log(`Rendering ${visibleItems.length} items out of 10000 total`);

// ============================================
// 9. MEMORY PROFILING TOOLS
// ============================================
/**
 * Memory Profiling Tools - Identifying memory issues
 *
 * Characteristics:
 * - Heap snapshots
 * - Allocation timelines
 * - Sampling profilers
 * - GC logs
 *
 * Use Cases:
 * - Finding memory leaks
 * - Optimizing allocations
 * - Understanding memory patterns
 *
 * Common Pitfalls:
 * - Not profiling in production-like conditions
 * - Ignoring GC pauses
 * - Over-optimizing prematurely
 */

console.log("\n=== 9. Memory Profiling Tools Demo ===");

// 9.1 Chrome DevTools memory panel
console.log("\nChrome DevTools memory tools:");
console.log("  1. Heap Snapshot - Point-in-time memory state");
console.log("  2. Allocation Timeline - Track allocations over time");
console.log("  3. Allocation Sampling - Statistical allocation view");

// 9.2 Node.js memory profiling
console.log("\nNode.js memory tools:");
console.log("  --inspect flag for DevTools connection");
console.log("  clinic.js for automated analysis");
console.log("  heapdump module for snapshots");

// 9.3 Simple allocation tracker
class AllocationTracker {
  constructor() {
    this.allocations = new Map();
    this.totalAllocations = 0;
  }

  track(label, size) {
    this.allocations.set(label, {
      size,
      timestamp: Date.now(),
    });
    this.totalAllocations++;
  }

  getReport() {
    const report = {
      totalAllocations: this.totalAllocations,
      currentAllocations: this.allocations.size,
      items: [],
    };

    this.allocations.forEach((info, label) => {
      report.items.push({ label, ...info });
    });

    return report;
  }
}

const tracker = new AllocationTracker();
tracker.track("userCache", 1024 * 1024);
tracker.track("sessionData", 512 * 1024);

console.log("\nAllocation tracker:");
console.log(tracker.getReport());

// ============================================
// 10. MEMORY OPTIMIZATION TECHNIQUES
// ============================================
/**
 * Memory Optimization Techniques - Practical strategies
 *
 * Characteristics:
 * - Data structure selection
 * - Lazy initialization
 * - Object reuse
 * - Reference management
 *
 * Use Cases:
 * - Performance-critical code
 * - Resource-constrained environments
 * - Long-running applications
 *
 * Common Pitfalls:
 * - Premature optimization
 * - Sacrificing readability
 * - Micro-optimizations
 */

console.log("\n=== 10. Memory Optimization Techniques Demo ===");

// 10.1 Choosing right data structure
console.log("\nData structure comparison:");

// Set vs Array for lookups
const lookupArray = Array.from({ length: 10000 }, (_, i) => i);
const lookupSet = new Set(lookupArray);

console.log("Array.includes() for lookup: O(n)");
console.log("Set.has() for lookup: O(1)");

// 10.2 Lazy initialization
class LazyInitialized {
  constructor() {
    this._expensiveData = null;
  }

  get expensiveData() {
    if (!this._expensiveData) {
      console.log("  Initializing expensive data...");
      this._expensiveData = new Array(100000).fill("data");
    }
    return this._expensiveData;
  }

  clearExpensiveData() {
    this._expensiveData = null;
    console.log("  Expensive data cleared");
  }
}

const lazy = new LazyInitialized();
console.log("\nLazy initialization:");
console.log("Object created, data not initialized yet");
lazy.expensiveData; // Now initialized
lazy.clearExpensiveData(); // Clean up

// 10.3 Slot-based object structure
console.log("\nObject shape optimization:");

// Bad: Different property ADDITION order creates different hidden classes
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 2, a: 1 }; // Different addition order → different hidden class

// Good: Consistent property addition order
const obj3 = { a: 1, b: 2 };
const obj4 = { a: 3, b: 4 }; // Same addition order → shared hidden class

// Pitfall: `delete` on an object transitions it to dictionary (slow) mode.
// Prefer setting to undefined/null over delete for frequently-accessed objects.

console.log("Consistent property order enables hidden class optimization");

// 10.4 Null vs undefined
console.log("\nNull vs Undefined:");
console.log('null: Explicit "no value" (use for clearing references)');
console.log("undefined: Default for uninitialized (don't assign manually)");

// ============================================
// BEST PRACTICES
// ============================================
/**
 * Memory Management Best Practices
 *
 * 1. USE WEAKREFS APPROPRIATELY
 *    - Caches that shouldn't prevent GC
 *    - DOM associations
 *    - Metadata storage
 *
 * 2. CLEAN UP RESOURCES
 *    - Remove event listeners
 *    - Clear intervals/timeouts
 *    - Nullify references when done
 *
 * 3. CHOOSE EFFICIENT DATA STRUCTURES
 *    - TypedArrays for numeric data
 *    - Map/Set for lookups
 *    - Generators for large sequences
 *
 * 4. MONITOR MEMORY USAGE
 *    - Profile regularly
 *    - Watch for growth patterns
 *    - Set up alerts for anomalies
 *
 * 5. PROCESS DATA IN CHUNKS
 *    - Stream large files
 *    - Paginate API responses
 *    - Use virtual scrolling
 */

console.log("\n=== Memory Management Best Practices Demo ===");

// Good: Complete resource lifecycle
class ResourceManager {
  constructor() {
    this.resources = new Map();
    this.cleanupCallbacks = new Map();
  }

  acquire(id, resource, cleanupFn) {
    this.resources.set(id, resource);
    this.cleanupCallbacks.set(id, cleanupFn);
    console.log(`Resource ${id} acquired`);
  }

  release(id) {
    const cleanup = this.cleanupCallbacks.get(id);
    if (cleanup) {
      cleanup();
      this.cleanupCallbacks.delete(id);
    }
    this.resources.delete(id);
    console.log(`Resource ${id} released`);
  }

  dispose() {
    this.resources.forEach((resource, id) => {
      const cleanup = this.cleanupCallbacks.get(id);
      if (cleanup) cleanup();
    });
    this.resources.clear();
    this.cleanupCallbacks.clear();
    console.log("All resources disposed");
  }
}

const rm = new ResourceManager();
rm.acquire("conn1", {}, () => console.log("  Cleaning connection"));
rm.release("conn1");

// ============================================
// SUMMARY
// ============================================
/**
 * Memory Management Summary
 *
 * Key Concepts:
 * 1. WeakRef/FinalizationRegistry for weak references
 * 2. WeakMap/WeakSet for automatic cleanup
 * 3. Recognizing memory leak patterns
 * 4. Object pooling for frequent allocation
 * 5. GC-aware coding practices
 * 6. Large data handling with streams
 * 7. Platform-specific considerations
 * 8. Profiling and monitoring
 *
 * When to Use:
 * - Long-running applications
 * - Large data processing
 * - Memory-constrained environments
 * - Performance-critical code
 *
 * When to Avoid:
 * - Simple scripts
 * - Premature optimization
 * - Without profiling first
 */

console.log("\n=== Memory Management Demo Complete ===");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 26-optimization-performance.js - Performance optimization");
console.log("📘 10-map-set.js - WeakMap and WeakSet");
console.log("📘 19-symbol-deep.js - Symbols and garbage collection");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 27-memory-management-ts-comparison.ts
*/
