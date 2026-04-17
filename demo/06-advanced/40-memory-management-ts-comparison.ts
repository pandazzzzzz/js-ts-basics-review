// TypeScript vs JavaScript: Memory Management Comparison
// 📘 For JavaScript examples, see: 40-memory-management.js
// This file demonstrates TypeScript-specific memory management patterns

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: TypeScript and Memory Management
// ============================================

console.log("=== TypeScript and Memory Management ===\n");

console.log(`
TypeScript does NOT change JavaScript's memory management:
- Type information is erased at compile time
- No impact on garbage collection behavior
- Same memory lifecycle as JavaScript
- Types are purely for development time

However, TypeScript can help prevent memory leaks through:
- Strict null checks
- Type system enforcing cleanup patterns
- Better IDE support for finding unused variables
`);

// ============================================
// Section 2: WeakRef with Types
// ============================================

console.log("\n=== WeakRef with Types ===\n");

// WeakRef is generic in TypeScript
interface User {
  id: number;
  name: string;
  data: number[];
}

let target: User = { id: 1, name: "Alice", data: new Array(1000) };

// WeakRef<T> provides type safety
const weakRef: WeakRef<User> = new WeakRef(target);

// deref() returns T | undefined
const derefed: User | undefined = weakRef.deref();

if (derefed) {
  // TypeScript knows derefed is User here
  const id: number = derefed.id;
  const name: string = derefed.name;
  console.log("User:", id, name);
}

// Type-safe cache with WeakRef
class TypedCache<K extends string, V extends object> {
  private cache = new Map<K, WeakRef<V>>();

  set(key: K, value: V): void {
    this.cache.set(key, new WeakRef(value));
  }

  get(key: K): V | undefined {
    const ref = this.cache.get(key);
    if (!ref) return undefined;

    const value = ref.deref();
    if (value === undefined) {
      this.cache.delete(key);
    }
    return value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Usage
const cache = new TypedCache<string, User>();
let user: User = { id: 1, name: "Bob", data: [] };
cache.set("user1", user);

console.log("Has user1:", cache.has("user1"));

console.log(`
TypeScript WeakRef benefits:
- WeakRef<T> generic type
- deref() returns T | undefined
- Type-safe cache implementations
- Compile-time type checking
`);

// ============================================
// Section 3: FinalizationRegistry with Types
// ============================================

console.log("\n=== FinalizationRegistry with Types ===\n");

// FinalizationRegistry is generic in TypeScript
type ResourceMetadata = {
  id: string;
  type: string;
  timestamp: number;
};

// FinalizationRegistry<T> where T is the held value type
const registry: FinalizationRegistry<ResourceMetadata> = new FinalizationRegistry(
  (heldValue: ResourceMetadata) => {
    console.log(`Resource ${heldValue.id} (${heldValue.type}) was garbage collected`);
    console.log(`Created at: ${new Date(heldValue.timestamp).toISOString()}`);
  }
);

// Register with type-safe metadata
let obj1: User = { id: 1, name: "Object 1", data: [] };
registry.register(obj1, {
  id: "obj1",
  type: "User",
  timestamp: Date.now()
});

// Unregister with typed token
interface UnregisterToken {
  id: string;
}

const token: UnregisterToken = { id: "token1" };
let obj2: User = { id: 2, name: "Object 2", data: [] };
registry.register(obj2, { id: "obj2", type: "User", timestamp: Date.now() }, token);

// Unregister is type-safe
registry.unregister(token);

console.log(`
TypeScript FinalizationRegistry benefits:
- FinalizationRegistry<T> generic type
- Type-safe held values
- Type-safe unregister tokens
- Callback parameter is typed as T
`);

// ============================================
// Section 4: WeakMap/WeakSet with Types
// ============================================

console.log("\n=== WeakMap/WeakSet with Types ===\n");

// Type-safe WeakMap
class MetadataStore<K extends object, V> {
  private weakMap = new WeakMap<K, V>();

  set(key: K, value: V): void {
    this.weakMap.set(key, value);
  }

  get(key: K): V | undefined {
    return this.weakMap.get(key);
  }

  has(key: K): boolean {
    return this.weakMap.has(key);
  }

  delete(key: K): boolean {
    return this.weakMap.delete(key);
  }
}

// Usage
interface UserMetadata {
  lastAccessed: Date;
  accessCount: number;
}

const userMetadata = new MetadataStore<User, UserMetadata>();

let userForMeta: User = { id: 1, name: "Alice", data: [] };
userMetadata.set(userForMeta, {
  lastAccessed: new Date(),
  accessCount: 1
});

console.log("Metadata:", userMetadata.get(userForMeta));

// When userForMeta is no longer referenced, metadata is automatically GC'd
userForMeta = null as any;

// Type-safe WeakSet
class ObjectTracker<T extends object> {
  private weakSet = new WeakSet<T>();

  track(obj: T): void {
    this.weakSet.add(obj);
  }

  isTracked(obj: T): boolean {
    return this.weakSet.has(obj);
  }
}

// ============================================
// Section 5: Disposable Pattern (TS 5.2+)
// ============================================

console.log("\n=== Disposable Pattern (TS 5.2+) ===\n");

// Disposable interface for automatic resource cleanup (requires ESNext lib)
// Note: Symbol.dispose requires lib: ["ESNext"] in tsconfig.json
console.log(`
FileHandle example (requires ESNext lib):

class FileHandle implements Disposable {
  constructor(private filename: string) {
    console.log(\`Opening file: \${filename}\`);
  }

  write(data: string): void {
    console.log(\`Writing to \${this.filename}: \${data}\`);
  }

  [Symbol.dispose](): void {
    console.log(\`Closing file: \${this.filename}\`);
  }
}
`);

// using declaration (ES2025/TS 5.2+)
// {
//   using file = new FileHandle("data.txt");
//   file.write("Hello, World!");
//   // file is automatically disposed at end of block
// }

console.log(`
using declaration syntax:
{
  using resource = new Resource();
  // Use resource
  // Automatically calls [Symbol.dispose]() at end of block
}

Benefits:
- Deterministic cleanup
- No memory leaks from forgotten cleanup
- Exception-safe (cleanup happens even if error thrown)
- Type-safe resource management
`);

// Async disposal example (requires ESNext lib)
console.log(`
DatabaseConnection example (requires ESNext lib):

class DatabaseConnection implements AsyncDisposable {
  async query(sql: string): Promise<unknown[]> {
    console.log(\`Executing: \${sql}\`);
    return [];
  }

  async [Symbol.asyncDispose](): Promise<void> {
    console.log('Disconnecting from database');
  }
}
`);

// ============================================
// Section 6: Type-Safe Resource Tracking
// ============================================

console.log("\n=== Type-Safe Resource Tracking ===\n");

// Generic resource tracker
class ResourceTracker<T extends object, M = string> {
  private registry: FinalizationRegistry<M>;
  private tracked = new Map<T, M>();

  constructor(
    private onFinalize: (metadata: M) => void
  ) {
    this.registry = new FinalizationRegistry(onFinalize);
  }

  track(resource: T, metadata: M): void {
    this.tracked.set(resource, metadata);
    this.registry.register(resource, metadata, resource);
  }

  untrack(resource: T): void {
    this.tracked.delete(resource);
    this.registry.unregister(resource);
  }

  getMetadata(resource: T): M | undefined {
    return this.tracked.get(resource);
  }

  get size(): number() {
    return this.tracked.size;
  }
}

// Usage with typed metadata
interface FileMetadata {
  filename: string;
  openedAt: Date;
  size: number;
}

class FileHandle {
  private static tracker = new ResourceTracker<FileHandle, FileMetadata>(
    (metadata) => {
      console.warn(`File ${metadata.filename} was not properly closed!`);
      console.warn(`Opened at: ${metadata.openedAt.toISOString()}`);
      console.warn(`Size: ${metadata.size} bytes`);
    }
  );

  constructor(
    private filename: string,
    private size: number = 0
  ) {
    FileHandle.tracker.track(this, {
      filename,
      openedAt: new Date(),
      size
    });
  }

  close(): void {
    console.log(`Closing ${this.filename}`);
    FileHandle.tracker.untrack(this);
  }
}

// ============================================
// Section 7: Object Pooling with Types
// ============================================

console.log("\n=== Object Pooling with Types ===\n");

// Type-safe object pool
class ObjectPool<T> {
  private pool: T[] = [];

  constructor(
    private createFn: () => T,
    private resetFn: (obj: T) => void,
    private maxSize: number = 100
  ) {}

  acquire(): T {
    return this.pool.pop() ?? this.createFn();
  }

  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  clear(): void {
    this.pool = [];
  }

  get size(): number {
    return this.pool.length;
  }
}

// Usage
interface Point {
  x: number;
  y: number;
}

const pointPool = new ObjectPool<Point>(
  () => ({ x: 0, y: 0 }),
  (point) => {
    point.x = 0;
    point.y = 0;
  },
  50
);

const point = pointPool.acquire();
point.x = 10;
point.y = 20;
// Use point...
pointPool.release(point);

console.log("Object pool benefits:");
console.log("- Reduces GC pressure");
console.log("- Type-safe acquire/release");
console.log("- Bounded pool size");

// ============================================
// Section 8: Type-Safe Image Cache
// ============================================

console.log("\n=== Type-Safe Image Cache ===\n");

// Image data interface
interface ImageData {
  url: string;
  width: number;
  height: number;
  data: Uint8Array;
}

class ImageCache {
  private cache = new Map<string, WeakRef<ImageData>>();
  private registry: FinalizationRegistry<string>;

  constructor() {
    this.registry = new FinalizationRegistry((url: string) => {
      console.log(`Image ${url} was garbage collected`);
      this.cache.delete(url);
    });
  }

  load(url: string): ImageData {
    // Check cache
    const cached = this.cache.get(url);
    if (cached) {
      const image = cached.deref();
      if (image) {
        console.log(`Cache hit: ${url}`);
        return image;
      }
    }

    // Load new image
    console.log(`Loading: ${url}`);
    const image: ImageData = {
      url,
      width: 800,
      height: 600,
      data: new Uint8Array(800 * 600 * 4)
    };

    this.cache.set(url, new WeakRef(image));
    this.registry.register(image, url);

    return image;
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// ============================================
// Section 9: Type-Safe Leak Detector
// ============================================

console.log("\n=== Type-Safe Leak Detector ===\n");

// Leak detection metadata
interface LeakInfo {
  name: string;
  type: string;
  createdAt: Date;
  stackTrace?: string;
}

class LeakDetector<T extends object> {
  private registry: FinalizationRegistry<LeakInfo>;
  private tracked = new Set<string>();

  constructor() {
    this.registry = new FinalizationRegistry((info: LeakInfo) => {
      this.tracked.delete(info.name);
      const lifetime = Date.now() - info.createdAt.getTime();
      console.log(`Object ${info.name} (${info.type}) collected after ${lifetime}ms`);
    });
  }

  track(obj: T, info: LeakInfo): void {
    this.tracked.add(info.name);
    this.registry.register(obj, info);
  }

  report(): void {
    console.log(`Still tracked: ${this.tracked.size} objects`);
    if (this.tracked.size > 0) {
      console.log("Potential leaks:", Array.from(this.tracked));
    }
  }

  get trackedCount(): number {
    return this.tracked.size;
  }
}

// Usage
const detector = new LeakDetector<User>();
let leakyObj: User = { id: 1, name: "Leaky", data: [] };
detector.track(leakyObj, {
  name: "leakyObj",
  type: "User",
  createdAt: new Date()
});

detector.report();

// ============================================
// Section 10: Memory Leak Prevention with Types
// ============================================

console.log("\n=== Memory Leak Prevention with Types ===\n");

// Pattern 1: Strict null checks prevent accidental globals
// tsconfig.json: "strict": true

// ❌ JavaScript - accidental global
// function leaky() {
//   leakedVariable = "I'm global!"; // No error in JS
// }

// ✅ TypeScript - caught at compile time
// function safe() {
//   leakedVariable = "I'm global!"; // Error: Cannot find name 'leakedVariable'
// }

// Pattern 2: Type-safe cache with size limits
interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

class SmartCache<K extends string, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  set(key: K, value: V): void {
    // Prevent unbounded growth
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: K): V | undefined {
    return this.cache.get(key)?.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

// ============================================
// Section 11: Type Guards and Utilities
// ============================================

console.log("\n=== Type Guards and Utilities ===\n");

// Type guard for WeakRef
function isWeakRef<T extends object>(value: unknown): value is WeakRef<T> {
  return value instanceof WeakRef;
}

// Type guard for FinalizationRegistry
function isFinalizationRegistry<T>(
  value: unknown
): value is FinalizationRegistry<T> {
  return value instanceof FinalizationRegistry;
}

// Utility to create typed WeakRef
function createWeakRef<T extends object>(target: T): WeakRef<T> {
  return new WeakRef(target);
}

// Utility to safely deref
function safeDeref<T extends object>(ref: WeakRef<T>): T | null {
  return ref.deref() ?? null;
}

// Usage
const userRef = createWeakRef(target);
const dereferencedUser = safeDeref(userRef);

if (dereferencedUser) {
  console.log("User still alive:", dereferencedUser.name);
}

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use WeakRef<T> generic type for type safety");
console.log("2. Use FinalizationRegistry<T> for typed held values");
console.log("3. Use Disposable interface for resource management");
console.log("4. Enable strict null checks in tsconfig.json");
console.log("5. Use WeakMap/WeakSet with proper types");
console.log("6. Implement type-safe object pools");
console.log("7. Use const by default to prevent reassignment");
console.log("8. Leverage type system to enforce cleanup patterns");
console.log("9. Use ResourceTracker for debugging leaks");
console.log("10. Create type-safe wrappers for resource management");

console.log("\n❌ DON'T:");
console.log("1. Don't rely on types to prevent runtime memory leaks");
console.log("2. Don't forget that types are erased at runtime");
console.log("3. Don't use any type (loses type safety)");
console.log("4. Don't ignore cleanup in async operations");
console.log("5. Don't create unbounded caches without size limits");
console.log("6. Don't use WeakRef/FinalizationRegistry for critical cleanup");
console.log("7. Don't rely on finalization timing");
console.log("8. Don't use any type with WeakRef/FinalizationRegistry");

console.log("\n🔧 TypeScript-Specific Tips:");
console.log("- Use using/await using for automatic cleanup (TS 5.2+)");
console.log("- Implement Disposable interface for resources");
console.log("- Use strict mode to catch potential leaks");
console.log("- Leverage type system for cleanup enforcement");
console.log("- Use WeakMap<K extends object, V> for type safety");
console.log("- Create type-safe wrappers for resource management");

console.log("\n⚠️ IMPORTANT WARNINGS:");

console.log(`
1. DON'T USE WeakRef/FinalizationRegistry FOR RESOURCE CLEANUP
   - File handles: Use explicit close()
   - Database connections: Use explicit disconnect()
   - Network sockets: Use explicit close()
   - Locks: Use explicit release()

   Why? Finalization is non-deterministic and may not run!

2. DON'T RELY ON FINALIZATION TIMING
   - GC runs when it wants
   - May not run before program exit
   - Different in different engines
   - Different in different environments

3. PERFORMANCE IMPACT
   - WeakRef.deref() is not free
   - FinalizationRegistry has overhead
   - Use sparingly
   - Profile before using in hot paths

4. DEBUGGING CHALLENGES
   - Hard to test GC behavior
   - Non-reproducible timing
   - Different in dev vs production
   - Use for diagnostics, not logic
`);

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - MEMORY MANAGEMENT                       │
├─────────────────────────────────────────────────────────────────────┤
│ Runtime Behavior:                                                 │
│   JavaScript: Manual cleanup, easy to forget                       │
│   TypeScript: Same runtime, but types help enforce patterns        │
│                                                                     │
│ Compile-Time Safety:                                               │
│   JavaScript: No compile-time checks                               │
│   TypeScript: Strict null checks, type enforcement                 │
│                                                                     │
│ Resource Management:                                               │
│   JavaScript: try/finally, manual cleanup                          │
│   TypeScript: Disposable interface, using declarations             │
│                                                                     │
│ Leak Detection:                                                     │
│   JavaScript: Runtime profiling only                               │
│   TypeScript: Type system + runtime profiling                      │
│                                                                     │
│ WeakMap/WeakSet:                                                    │
│   JavaScript: WeakMap, WeakSet (untyped keys)                      │
│   TypeScript: WeakMap<K extends object, V> (type-safe)             │
│                                                                     │
│ WeakRef:                                                           │
│   JavaScript: WeakRef(target)                                      │
│   TypeScript: WeakRef<T>(target: T)                                │
│                                                                     │   │
│ deref():                                                            │
│   JavaScript: Returns target or undefined                        │
│   TypeScript: Returns T | undefined                           │
│                                                                     │
│ FinalizationRegistry:                                               │
│   JavaScript: FinalizationRegistry(callback)                        │
│   TypeScript: FinalizationRegistry<T>(callback: (held: T) => void) │
│                                                                     │
│ Type Safety:                                                        │
│   JavaScript: Runtime only                                          │
│   TypeScript: Compile-time + runtime                                │
└─────────────────────────────────────────────────────────────────────┘
`);
