// TypeScript vs JavaScript: Memory Management Comparison
// 📘 For JavaScript examples, see: 28-memory-management.js
// This file demonstrates TypeScript-specific memory management features

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
function processTypedArray<T extends TypedArray>(
  array: T,
  fn: (value: T[0], index: number) => T[0]
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

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Type-safe weak collections");
console.log("- Better memory usage tracking");
console.log("- Explicit resource management");
console.log("- Clear object lifecycle contracts");
