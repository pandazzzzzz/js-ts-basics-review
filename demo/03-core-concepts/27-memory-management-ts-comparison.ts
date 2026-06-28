// TypeScript vs JavaScript: Memory Management Comparison
// 📘 For JavaScript examples, see: 27-memory-management.js
// This file demonstrates TypeScript-specific memory management features

// Minimal ambient declarations for the Node.js globals used below.
// The project has no @types/node, so these keep the Node-API demos type-safe.
declare const process: {
  memoryUsage(): {
    heapUsed: number;
    heapTotal: number;
    external: number;
    arrayBuffers: number;
  };
};
declare function setImmediate(callback: (value?: unknown) => void): void;

export {};

// ============================================================================
// 1. TYPED WEAKMAP AND WEAKSET
// ============================================================================

console.log("=== Typed WeakMap and WeakSet ===");

// TypeScript: Typed WeakMap with type parameters
interface User {
  id: number;
  name: string;
}

interface UserMetadata {
  createdAt: Date;
  lastLogin: Date;
}

// WeakMap<K, V> with specific types
const userMetadata = new WeakMap<User, UserMetadata>();

const user: User = { id: 1, name: "Alice" };
userMetadata.set(user, {
  createdAt: new Date(),
  lastLogin: new Date()
});

console.log("User metadata:", userMetadata.get(user));

// TypeScript: Typed WeakSet
const processedObjects = new WeakSet<object>();

function processObject(obj: object): void {
  if (processedObjects.has(obj)) {
    console.log("Already processed, skipping");
    return;
  }
  processedObjects.add(obj);
  console.log("Processing object...");
}

const obj1 = { id: 1 };
const obj2 = { id: 2 };
processObject(obj1);
processObject(obj1); // Already processed
processObject(obj2);


// ============================================================================
// 2. TYPED WEAKREF AND FINALIZATIONREGISTRY
// ============================================================================

console.log("\n=== Typed WeakRef and FinalizationRegistry ===");

// TypeScript: WeakRef<T> with type parameter
class ExpensiveResource {
  constructor(public name: string) {}
  cleanup(): void {
    console.log(`Cleaning up ${this.name}`);
  }
}

let resource = new ExpensiveResource("Database Connection");
const weakRef = new WeakRef(resource);

// Accessing the resource
const ref = weakRef.deref();
if (ref) {
  console.log("Resource still available:", ref.name);
} else {
  console.log("Resource has been garbage collected");
}

// TypeScript: FinalizationRegistry with type for held value
interface CleanupData {
  name: string;
  id: number;
}

const registry = new FinalizationRegistry<CleanupData>((heldValue) => {
  console.log(`Finalizing ${heldValue.name} (ID: ${heldValue.id})`);
});

let trackedResource = new ExpensiveResource("Temp File");
registry.register(trackedResource, { name: trackedResource.name, id: 1 });


// ============================================================================
// 3. TYPED OBJECT POOLING
// ============================================================================

console.log("\n=== Typed Object Pooling ===");

// TypeScript: Generic object pool with interface constraint
interface Resettable {
  reset(): void;
}

class MemoryPool<T extends Resettable> {
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
      total: this.available.length + this.inUse.size
    };
  }
}

// TypeScript: Buffer class for pooling
class PoolBuffer implements Resettable {
  public data: Uint8Array;

  constructor(public readonly size: number = 1024) {
    this.data = new Uint8Array(size);
  }

  reset(): void {
    this.data.fill(0);
  }
}

const bufferPool = new MemoryPool(() => new PoolBuffer(1024), 5);
console.log("Initial pool stats:", bufferPool.stats);

const buf1 = bufferPool.acquire();
buf1.data[0] = 42;
const buf2 = bufferPool.acquire();

console.log("After acquire stats:", bufferPool.stats);
bufferPool.release(buf1);
console.log("After release stats:", bufferPool.stats);


// ============================================================================
// 4. TYPED ARRAYS WITH STRONG TYPING
// ============================================================================

console.log("\n=== Typed Arrays with Strong Typing ===");

// TypeScript: All typed array types with full type support
const buffers = {
  int8: new Int8Array(100),
  uint8: new Uint8Array(100),
  uint8Clamped: new Uint8ClampedArray(100),
  int16: new Int16Array(100),
  uint16: new Uint16Array(100),
  int32: new Int32Array(100),
  uint32: new Uint32Array(100),
  float32: new Float32Array(100),
  float64: new Float64Array(100),
  bigInt64: new BigInt64Array(100),
  bigUint64: new BigUint64Array(100)
};

// TypeScript: Generic function for typed arrays
// Note: Use a union of typed array types since there is no single TypedArray type
type TypedArrayLike = Int8Array | Uint8Array | Int16Array | Uint16Array |
  Int32Array | Uint32Array | Float32Array | Float64Array;

function processTypedArray<T extends TypedArrayLike>(
  array: T,
  fn: (value: number, index: number) => number
): T {
  for (let i = 0; i < array.length; i++) {
    array[i] = fn(array[i], i);
  }
  return array;
}

const numbers = new Float64Array([1, 2, 3, 4, 5]);
const doubled = processTypedArray(numbers, x => x * 2);
console.log("Doubled typed array:", [...doubled]);

// TypeScript: DataView with types
const buffer = new ArrayBuffer(16);
const view = new DataView(buffer);
view.setInt32(0, 123456, true);
view.setFloat64(8, Math.PI, true);
console.log("DataView int32:", view.getInt32(0, true));
console.log("DataView float64:", view.getFloat64(8, true));


// ============================================================================
// 5. BRANDED TYPES FOR OBJECT TRACKING
// ============================================================================

console.log("\n=== Branded Types for Object Tracking ===");

// TypeScript: Branded types for object identity
type ManagedObject = object & { readonly __brand: unique symbol };

const ManagedObjectSymbol = Symbol('ManagedObject');

function createManaged<T extends object>(obj: T): T & ManagedObject {
  return Object.defineProperty(obj, '__brand', {
    value: ManagedObjectSymbol,
    enumerable: false
  }) as T & ManagedObject;
}

function isManaged(obj: object): obj is ManagedObject {
  return '__brand' in obj;
}

const tracked = createManaged({ id: 1, data: 'test' });
const untracked = { id: 2, data: 'test' };

console.log("isManaged(tracked):", isManaged(tracked));
console.log("isManaged(untracked):", isManaged(untracked));


// ============================================================================
// 6. TYPED MEMORY USAGE MONITORING
// ============================================================================

console.log("\n=== Typed Memory Usage Monitoring ===");

// TypeScript: Typed memory snapshot
interface MemorySnapshot {
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  arrayBuffers: number;
}

class MemoryTracker {
  private snapshots: MemorySnapshot[] = [];

  takeSnapshot(): MemorySnapshot {
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      heapUsed: 0,
      heapTotal: 0,
      external: 0,
      arrayBuffers: 0
    };

    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      snapshot.heapUsed = usage.heapUsed;
      snapshot.heapTotal = usage.heapTotal;
      snapshot.external = usage.external;
      snapshot.arrayBuffers = usage.arrayBuffers;
    }

    this.snapshots.push(snapshot);
    return snapshot;
  }

  getTrend(): { increase: number; percentage: number } | null {
    if (this.snapshots.length < 2) return null;

    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];
    const increase = last.heapUsed - first.heapUsed;
    const percentage = (increase / first.heapUsed) * 100;

    return { increase, percentage };
  }
}

const tracker = new MemoryTracker();
tracker.takeSnapshot();
const largeArray = new Array(1000000).fill(0);
const snapshot = tracker.takeSnapshot();
console.log("Memory snapshot taken at:", snapshot.timestamp);


// ============================================================================
// 7. DISCRIMINATED UNIONS FOR OBJECT TYPES
// ============================================================================

console.log("\n=== Discriminated Unions for Object Types ===");

// TypeScript: Discriminated unions for different object types
type ResourceType =
  | { type: 'buffer'; buffer: ArrayBuffer; size: number }
  | { type: 'canvas'; canvas: object; width: number; height: number }
  | { type: 'worker'; worker: object; url: string };

class ResourceManager {
  private readonly resources = new Map<number, ResourceType>();
  private nextId = 1;

  add(resource: ResourceType): number {
    const id = this.nextId++;
    this.resources.set(id, resource);
    return id;
  }

  getTotalSize(): number {
    let total = 0;
    for (const resource of this.resources.values()) {
      switch (resource.type) {
        case 'buffer':
          total += resource.size;
          break;
        case 'canvas':
          total += resource.width * resource.height * 4;
          break;
        case 'worker':
          total += 1024;
          break;
      }
    }
    return total;
  }
}

const manager = new ResourceManager();
manager.add({ type: 'buffer', buffer: new ArrayBuffer(1024), size: 1024 });
manager.add({ type: 'canvas', canvas: {}, width: 100, height: 100 });
console.log("Total estimated memory:", manager.getTotalSize());


// ============================================================================
// 8. TYPED MEMORY LEAK PATTERNS
// ============================================================================

console.log("\n=== Typed Memory Leak Patterns ===");

// TypeScript: Type-safe event listener management
interface EventListener {
  callback: (data: unknown) => void;
  once: boolean;
}

class TypedEventEmitter {
  private readonly listeners: Map<string, EventListener[]> = new Map();

  on(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push({ callback, once: false });

    // Return cleanup function
    return () => this.off(event, callback);
  }

  once(event: string, callback: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push({ callback, once: true });

    return () => this.off(event, callback);
  }

  off(event: string, callback?: (data: unknown) => void): void {
    if (!this.listeners.has(event)) return;

    const listeners = this.listeners.get(event)!;
    if (callback) {
      this.listeners.set(event, listeners.filter(l => l.callback !== callback));
    } else {
      this.listeners.set(event, []);
    }
  }

  emit(event: string, data: unknown): void {
    const listeners = this.listeners.get(event);
    if (!listeners) return;

    listeners.forEach(l => {
      l.callback(data);
      if (l.once) this.off(event, l.callback);
    });
  }
}

const typedEmitter = new TypedEventEmitter();
const cleanup = typedEmitter.on('data', (data) => console.log('Received:', data));
typedEmitter.emit('data', 'test');
cleanup(); // Properly remove listener

// TypeScript: Type-safe timer management
class TimerManager {
  private readonly timers: Map<number, ReturnType<typeof setTimeout>> = new Map();
  private readonly intervals: Map<number, ReturnType<typeof setInterval>> = new Map();
  private nextId = 0;

  setTimeout(callback: () => void, delay: number): number {
    const id = this.nextId++;
    const timer = setTimeout(() => {
      callback();
      this.timers.delete(id);
    }, delay);
    this.timers.set(id, timer);
    return id;
  }

  setInterval(callback: () => void, interval: number): number {
    const id = this.nextId++;
    const timer = setInterval(callback, interval);
    this.intervals.set(id, timer);
    return id;
  }

  clearTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  clearInterval(id: number): void {
    const timer = this.intervals.get(id);
    if (timer) {
      clearInterval(timer);
      this.intervals.delete(id);
    }
  }

  clearAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.intervals.forEach(timer => clearInterval(timer));
    this.timers.clear();
    this.intervals.clear();
  }

  get stats(): { timeouts: number; intervals: number } {
    return {
      timeouts: this.timers.size,
      intervals: this.intervals.size
    };
  }
}

const timerManager = new TimerManager();
const timerId = timerManager.setTimeout(() => console.log('Timer fired'), 1000);
console.log('Active timers:', timerManager.stats);


// ============================================================================
// 9. TYPED GARBAGE COLLECTION CONCEPTS
// ============================================================================

console.log("\n=== Typed Garbage Collection Concepts ===");

// TypeScript: GC-friendly pattern with types
interface GCFriendlyCache<K extends object, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  clear(): void;
}

// WeakMap-based cache (GC-friendly)
class WeakCache<K extends object, V> implements GCFriendlyCache<K, V> {
  private readonly cache = new WeakMap<K, V>();

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    // WeakMap cannot be cleared or iterated; throw rather than silently no-op
    // (callers must drop all key references and let GC reclaim entries).
    throw new Error("WeakCache.clear() is unsupported: WeakMap is not iterable");
  }
}

// TypeScript: Memory monitoring with types
interface MemoryThresholds {
  warnMB: number;
  errorMB: number;
}

interface MemoryStats {
  heapUsedMB: number;
  heapTotalMB: number;
  externalMB: number;
  arrayBuffersMB: number;
}

class TypedMemoryMonitor {
  private readonly thresholds: MemoryThresholds;

  constructor(thresholds: MemoryThresholds = { warnMB: 100, errorMB: 500 }) {
    this.thresholds = thresholds;
  }

  getStats(): MemoryStats {
    const usage = process.memoryUsage();
    return {
      heapUsedMB: usage.heapUsed / 1024 / 1024,
      heapTotalMB: usage.heapTotal / 1024 / 1024,
      externalMB: usage.external / 1024 / 1024,
      arrayBuffersMB: usage.arrayBuffers / 1024 / 1024
    };
  }

  checkThresholds(): 'ok' | 'warn' | 'error' {
    const stats = this.getStats();
    if (stats.heapUsedMB > this.thresholds.errorMB) return 'error';
    if (stats.heapUsedMB > this.thresholds.warnMB) return 'warn';
    return 'ok';
  }
}

const monitor = new TypedMemoryMonitor({ warnMB: 50, errorMB: 200 });
const memStats = monitor.getStats();
console.log('Memory stats:', memStats);
console.log('Threshold status:', monitor.checkThresholds());


// ============================================================================
// 10. TYPED LARGE DATA HANDLING
// ============================================================================

console.log("\n=== Typed Large Data Handling ===");

// TypeScript: Generic chunk processor
interface ChunkProcessor<T, R> {
  process(chunk: T[]): R[];
}

class DataStreamProcessor<T, R> {
  constructor(
    private readonly chunkSize: number,
    private readonly processor: ChunkProcessor<T, R>
  ) {}

  async processData(data: T[]): Promise<R[]> {
    const results: R[] = [];
    const totalChunks = Math.ceil(data.length / this.chunkSize);

    for (let i = 0; i < data.length; i += this.chunkSize) {
      const chunk = data.slice(i, i + this.chunkSize);
      const processed = this.processor.process(chunk);
      results.push(...processed);

      // Yield to event loop
      await new Promise(resolve => setImmediate(resolve));
    }

    return results;
  }
}

// TypeScript: Generator-based stream with types
function* typedStreamGenerator<T>(
  generator: (index: number) => T,
  total: number
): Generator<T> {
  for (let i = 0; i < total; i++) {
    yield generator(i);
  }
}

interface StreamItem {
  id: number;
  timestamp: number;
  value: string;
}

const dataStream = typedStreamGenerator<StreamItem>(
  (i) => ({ id: i, timestamp: Date.now(), value: `item-${i}` }),
  10
);

console.log('Streaming typed data:');
for (const item of dataStream) {
  console.log(`  Item ${item.id}: ${item.value}`);
}


// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== TypeScript Memory Management Summary ===");
console.log("1. Typed WeakMap and WeakSet");
console.log("2. Typed WeakRef and FinalizationRegistry");
console.log("3. Typed object pooling");
console.log("4. Typed arrays with strong typing");
console.log("5. Branded types for object tracking");
console.log("6. Typed memory usage monitoring");
console.log("7. Discriminated unions for object types");
console.log("8. Typed memory leak patterns");
console.log("9. Typed garbage collection concepts");
console.log("10. Typed large data handling");

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Type-safe weak collections");
console.log("- Better memory usage tracking");
console.log("- Explicit resource management");
console.log("- Clear object lifecycle contracts");
