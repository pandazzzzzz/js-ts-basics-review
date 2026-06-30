// ============================================================================
// MEMORY MANAGEMENT - COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. WEAKREF AND FINALIZATIONREGISTRY
// ============================================================================
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

let targetObject = { data: 'important data' };
const weakRef = new WeakRef(targetObject);

console.log('Strong reference exists:', targetObject !== undefined);
console.log('WeakRef deref():', weakRef.deref());

// Clear strong reference
targetObject = null;

// Force garbage collection hint (only works with --expose-gc flag)
if (global.gc) {
  global.gc();
  console.log('After GC, WeakRef deref():', weakRef.deref());
} else {
  console.log('(Run with --expose-gc to see GC effect)');
}

// 1.2 FinalizationRegistry basics
console.log("\nFinalizationRegistry:");

// Note: FinalizationRegistry callbacks are non-deterministic — they may never
// fire (e.g. if the process exits before GC), so don't rely on them for
// critical cleanup. Use try/finally or `using` (ES2027) for deterministic cleanup.
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`  Cleanup callback: ${heldValue} was garbage collected`);
});

{
  let obj = { name: 'temporary' };
  registry.register(obj, 'obj-1');
  console.log('Registered obj-1 for finalization');
  obj = null; // Allow GC
}

// 1.3 WeakRef with caching pattern
class CacheWithWeakRefs {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry((key) => {
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
let cachedObj1 = { id: 1, data: 'large data' };
let cachedObj2 = { id: 2, data: 'more data' };

cache.set('obj1', cachedObj1);
cache.set('obj2', cachedObj2);

console.log('\nCache get obj1:', cache.get('obj1'));

cachedObj1 = null; // Allow GC


// ============================================================================
// 2. WEAKMAP AND WEAKSET PATTERNS
// ============================================================================
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
      createdAt: data?.createdAt
    };
  }
}

const secure = new SecureClass('my-secret-key');
console.log('Secret:', secure.getSecret());
console.log('Info:', secure.getInfo());

// 2.2 WeakMap for DOM associations (simulated)
console.log("\nWeakMap for DOM associations:");

const elementData = new WeakMap();

class DOMElementSimulator {
  constructor(id) {
    this.id = id;
  }
}

const button1 = new DOMElementSimulator('btn-1');
const button2 = new DOMElementSimulator('btn-2');

elementData.set(button1, { clickCount: 0, handler: () => {} });
elementData.set(button2, { clickCount: 5, handler: () => {} });

console.log('button1 data:', elementData.get(button1));

// When button1 is "removed" (dereferenced), its data becomes eligible for GC
const button1Ref = button1; // Keep reference for demo

// 2.3 WeakMap for memoization
console.log("\nWeakMap memoization:");

const memoCache = new WeakMap();

function memoizedMethod(obj, computeFn) {
  if (!memoCache.has(obj)) {
    console.log('  Computing result...');
    const result = computeFn(obj);
    memoCache.set(obj, result);
  } else {
    console.log('  Returning cached result...');
  }
  return memoCache.get(obj);
}

const target = { value: 42 };
console.log('First call:', memoizedMethod(target, (o) => o.value * 2));
console.log('Second call:', memoizedMethod(target, (o) => o.value * 2));

// 2.4 WeakSet for object tracking
console.log("\nWeakSet for tracking:");

const visitedObjects = new WeakSet();

function processObject(obj) {
  if (visitedObjects.has(obj)) {
    console.log('  Already processed, skipping circular reference');
    return;
  }

  visitedObjects.add(obj);
  console.log('  Processing object...');

  // Simulate processing nested objects
  if (obj.nested) {
    processObject(obj.nested);
  }
}

const circularObj = { name: 'root', nested: { name: 'child' } };
circularObj.nested.parent = circularObj; // Circular reference

processObject(circularObj);
processObject(circularObj.nested);
processObject(circularObj); // Will be skipped

// 2.5 Symbol as WeakMap key (ES2023)
console.log("\nSymbol as WeakMap key (ES2023):");

// Before ES2023, WeakMap keys had to be objects. ES2023 (Symbols as WeakMap
// keys proposal) allows registered Symbols to be used as keys in WeakMap,
// WeakSet, WeakRef, and FinalizationRegistry — useful for keyed metadata
// without needing an object identity.
/*
 * verification:
 *   feature: Symbols as WeakMap keys
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-06-29
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const wm = new WeakMap();
const s = Symbol("k");
wm.set(s, "v");
console.log('  wm.get(s):', wm.get(s)); // 'v'


// ============================================================================
// 3. COMMON MEMORY LEAK PATTERNS
// ============================================================================
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
  console.log('  Bad: window.leakyData = largeArray');
  console.log('  Good: Use local variables or clean up globals');
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
  const handler = (data) => console.log('Handler called:', data);
  emitter.addListener(handler);
  // Problem: Never removing listener when component unmounts
  console.log('  Bad: Listener added, never removed');
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
    console.log('  Proper handler:', data);
  }

  destroy() {
    this.emitter.removeListener(this.handler);
    console.log('  Good: Listener removed on destroy');
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
    console.log('  Bad: setInterval without clearInterval');
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
      console.log('  Good: Interval cleared');
    }
  }

  doWork() {
    console.log('  Working...');
  }
}

// 3.4 Leak: Detached DOM trees (conceptual)
console.log("\nLeak pattern 4 - Detached DOM trees:");
console.log('  Bad: Keeping reference to removed DOM element');
console.log('  Good: Nullify references when removing elements');

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

console.log('  Bad: Closure captures entire largeData array');
console.log('  Good: Closure only captures needed primitive value');


// ============================================================================
// 4. OBJECT POOLING
// ============================================================================
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
      console.log('  Pool expanded - created new object');
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
      total: this.available.length + this.inUse.size
    };
  }
}

// 4.2 Example: Vector pool for games/math
const vectorPool = new ObjectPool(
  () => ({ x: 0, y: 0, z: 0 }),
  (vec) => { vec.x = 0; vec.y = 0; vec.z = 0; },
  5
);

console.log("\nVector pool:");
console.log('Initial stats:', vectorPool.stats);

const v1 = vectorPool.acquire();
const v2 = vectorPool.acquire();
const v3 = vectorPool.acquire();

v1.x = 10; v1.y = 20; v1.z = 30;
v2.x = 5; v2.y = 5; v2.z = 5;

console.log('After acquiring 3 vectors:', vectorPool.stats);

vectorPool.release(v1);
console.log('After releasing v1:', vectorPool.stats);

const v4 = vectorPool.acquire();
console.log('Acquired v4 (reused v1):', vectorPool.stats);
console.log('v4 values:', v4); // Should be zeroed

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
buf1.write('Hello');
console.log('buf1 content:', buf1.toString().trim());

bufferPool.release(buf1);
console.log('Buffer released and cleared');


// ============================================================================
// 5. GARBAGE COLLECTION BASICS
// ============================================================================
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
console.log('  Young generation (Eden space): Short-lived objects');
console.log('  Old generation: Long-lived objects');
console.log('  Code space / Large object space: V8-specific (no "Permanent generation" — that is JVM terminology)');

// 5.2 GC-friendly patterns
console.log("\nGC-friendly patterns:");

// Bad: Creating many temporary objects
function gcUnfriendly(n) {
  let result = '';
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
  return chars.join('');
}

console.time('GC-unfriendly');
gcUnfriendly(10000);
console.timeEnd('GC-unfriendly');

console.time('GC-friendly');
gcFriendly(10000);
console.timeEnd('GC-friendly');

// 5.3 Explicit dereferencing
console.log("\nExplicit dereferencing:");

class DataProcessor {
  constructor(largeData) {
    this.data = largeData;
  }

  process() {
    console.log('  Processing data...');
    // After processing, explicitly clear reference
    this.data = null;
    console.log('  Data reference cleared');
  }
}

const processor = new DataProcessor(new Array(1000000).fill(0));
processor.process();


// ============================================================================
// 6. LARGE DATA HANDLING
// ============================================================================
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
console.log('Regular array size estimate (upper bound, 8 bytes/elem):', `${(regularArray.length * 8 / 1024 / 1024).toFixed(2)} MB`);
console.log('TypedArray size:', `${(typedArray.byteLength / 1024 / 1024).toFixed(2)} MB`);
console.log('TypedArray wins most for fixed-encoding types (Int32=4 bytes, Float64=8 bytes)');

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


// ============================================================================
// 7. NODE.JS MEMORY CONSIDERATIONS
// ============================================================================
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
if (typeof process !== 'undefined' && process.memoryUsage) {
  console.log("\nCurrent memory usage:");
  const memUsage = process.memoryUsage();
  console.log('  Heap Used:', `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log('  Heap Total:', `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
  console.log('  RSS:', `${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
}

// 7.2 Buffer memory (outside V8 heap)
console.log("\nBuffer allocation:");

const buffer1 = Buffer.alloc(1024 * 1024); // 1MB
console.log('Allocated 1MB buffer (outside V8 heap)');

// 7.3 Stream-based processing (memory efficient)
console.log("\nStream processing concept:");
console.log('  Bad: fs.readFileSync (loads entire file)');
console.log('  Good: fs.createReadStream (chunks data)');


// ============================================================================
// 8. BROWSER MEMORY CONSIDERATIONS
// ============================================================================
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
console.log('  Bad: Keeping reference to removed element');
console.log('  Good: Nullify references on removal');

// 8.2 Image/video memory
console.log("\nMedia memory:");
console.log('  Bad: Loading full-resolution images unnecessarily');
console.log('  Good: Use responsive images, lazy loading');

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


// ============================================================================
// 9. MEMORY PROFILING TOOLS
// ============================================================================
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
console.log('  1. Heap Snapshot - Point-in-time memory state');
console.log('  2. Allocation Timeline - Track allocations over time');
console.log('  3. Allocation Sampling - Statistical allocation view');

// 9.2 Node.js memory profiling
console.log("\nNode.js memory tools:");
console.log('  --inspect flag for DevTools connection');
console.log('  clinic.js for automated analysis');
console.log('  heapdump module for snapshots');

// 9.3 Simple allocation tracker
class AllocationTracker {
  constructor() {
    this.allocations = new Map();
    this.totalAllocations = 0;
  }

  track(label, size) {
    this.allocations.set(label, {
      size,
      timestamp: Date.now()
    });
    this.totalAllocations++;
  }

  getReport() {
    const report = {
      totalAllocations: this.totalAllocations,
      currentAllocations: this.allocations.size,
      items: []
    };

    this.allocations.forEach((info, label) => {
      report.items.push({ label, ...info });
    });

    return report;
  }
}

const tracker = new AllocationTracker();
tracker.track('userCache', 1024 * 1024);
tracker.track('sessionData', 512 * 1024);

console.log("\nAllocation tracker:");
console.log(tracker.getReport());


// ============================================================================
// 10. MEMORY OPTIMIZATION TECHNIQUES
// ============================================================================
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

console.log('Array.includes() for lookup: O(n)');
console.log('Set.has() for lookup: O(1)');

// 10.2 Lazy initialization
class LazyInitialized {
  constructor() {
    this._expensiveData = null;
  }

  get expensiveData() {
    if (!this._expensiveData) {
      console.log('  Initializing expensive data...');
      this._expensiveData = new Array(100000).fill('data');
    }
    return this._expensiveData;
  }

  clearExpensiveData() {
    this._expensiveData = null;
    console.log('  Expensive data cleared');
  }
}

const lazy = new LazyInitialized();
console.log('\nLazy initialization:');
console.log('Object created, data not initialized yet');
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

console.log('Consistent property order enables hidden class optimization');

// 10.4 Null vs undefined
console.log("\nNull vs Undefined:");
console.log('null: Explicit "no value" (use for clearing references)');
console.log('undefined: Default for uninitialized (don\'t assign manually)');


// ============================================================================
// BEST PRACTICES
// ============================================================================
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
    console.log('All resources disposed');
  }
}

const rm = new ResourceManager();
rm.acquire('conn1', {}, () => console.log('  Cleaning connection'));
rm.release('conn1');


// ============================================================================
// SUMMARY
// ============================================================================
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


// ============================================================================
// TypeScript Comparison Notes
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. TYPED WEAKMAP
   TS:  const privateData = new WeakMap<object, any>();

   TypeScript example:
   interface PrivateData {
     secret: string;
     createdAt: Date;
   }

   const privateData = new WeakMap<object, PrivateData>();

2. WEAKREF TYPING
   TS:  const weakRef = new WeakRef<MyClass>(instance);

   TypeScript example:
   class MyClass {
     data: string;
   }

   const weakRef: WeakRef<MyClass> = new WeakRef(new MyClass());
   const instance = weakRef.deref(); // MyClass | undefined

3. FINALIZATIONREGISTRY TYPE
   TS:  const registry = new FinalizationRegistry<string>((key) => { ... });

   TypeScript example:
   interface CacheEntry {
     data: unknown;
   }

   const registry = new FinalizationRegistry<string>((key: string) => {
     console.log(`${key} was garbage collected`);
   });

4. TYPED ARRAYS
   TS:  const arr = new Float64Array(1000);

   TypeScript example:
   const int8 = new Int8Array(100);
   const uint16 = new Uint16Array(100);
   const float64 = new Float64Array(100);

5. BUFFER TYPE (NODE.JS)
   TS:  const buf: Buffer = Buffer.alloc(1024);

   TypeScript example:
   import { Buffer } from 'buffer';

   const buf: Buffer = Buffer.alloc(1024, 0);
   const fromString: Buffer = Buffer.from('hello');

📘 See related files:
- 19-symbol-deep.js (WeakMap/WeakSet basics)
- 26-optimization-performance.js (performance optimization)
- 22-iterators-generators.js (generators for streaming)
*/

// ============================================================================
// CROSS-REFERENCES
// ============================================================================
console.log(`
📘 See related files for additional patterns:

Memory Management:
- 19-symbol-deep.js (WeakMap, WeakSet basics)
- 26-optimization-performance.js (memory-efficient patterns)
- 24-function-patterns-advanced.js (memoization cache management)
`);
