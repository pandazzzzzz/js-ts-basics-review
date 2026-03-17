// TypeScript vs JavaScript: WeakRef and FinalizationRegistry Comparison
// 📘 For JavaScript examples, see: 38-weakref-finalization.js
// This file demonstrates TypeScript-specific type features for weak references

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: WeakRef with Types
// ============================================

console.log("=== WeakRef with Types ===\n");

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
// Section 2: FinalizationRegistry with Types
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
// Section 3: Type-Safe Resource Tracking
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

  get size(): number {
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
// Section 4: Type-Safe Image Cache
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
// Section 5: Type-Safe Leak Detector
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
// Section 6: Disposable Pattern Integration
// ============================================

console.log("\n=== Disposable Pattern Integration ===\n");

// Combine WeakRef with Disposable pattern
interface Disposable {
  [Symbol.dispose](): void;
}

class ManagedResource implements Disposable {
  private static tracker = new ResourceTracker<ManagedResource, string>(
    (name) => console.warn(`Resource ${name} was not disposed properly`)
  );

  constructor(private name: string) {
    console.log(`Creating resource: ${name}`);
    ManagedResource.tracker.track(this, name);
  }

  use(): void {
    console.log(`Using resource: ${this.name}`);
  }

  [Symbol.dispose](): void {
    console.log(`Disposing resource: ${this.name}`);
    ManagedResource.tracker.untrack(this);
  }
}

// using declaration (ES2025/TS 5.2+)
// {
//   using resource = new ManagedResource("file.txt");
//   resource.use();
//   // Automatically disposed at end of block
// }

// ============================================
// Section 7: Type Guards and Utilities
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
// Section 8: Advanced Patterns
// ============================================

console.log("\n=== Advanced Patterns ===\n");

// Weak value map
class WeakValueMap<K, V extends object> {
  private map = new Map<K, WeakRef<V>>();
  private registry: FinalizationRegistry<K>;

  constructor() {
    this.registry = new FinalizationRegistry((key: K) => {
      this.map.delete(key);
    });
  }

  set(key: K, value: V): void {
    const ref = new WeakRef(value);
    this.map.set(key, ref);
    this.registry.register(value, key, ref);
  }

  get(key: K): V | undefined {
    const ref = this.map.get(key);
    if (!ref) return undefined;

    const value = ref.deref();
    if (value === undefined) {
      this.map.delete(key);
    }
    return value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    const ref = this.map.get(key);
    if (ref) {
      this.registry.unregister(ref);
      return this.map.delete(key);
    }
    return false;
  }

  clear(): void {
    this.map.clear();
  }

  get size(): number {
    return this.map.size;
  }
}

// Usage
const weakValueMap = new WeakValueMap<string, User>();
let mapUser: User = { id: 1, name: "Map User", data: [] };
weakValueMap.set("user1", mapUser);

console.log("Has user1:", weakValueMap.has("user1"));

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use WeakRef<T> generic type for type safety");
console.log("2. Use FinalizationRegistry<T> for typed held values");
console.log("3. Create type-safe wrapper classes");
console.log("4. Use type guards for runtime checks");
console.log("5. Combine with Disposable pattern when possible");
console.log("6. Use for diagnostics and caching only");

console.log("\n❌ DON'T:");
console.log("1. Don't use for critical resource cleanup");
console.log("2. Don't rely on finalization timing");
console.log("3. Don't use any type with WeakRef/FinalizationRegistry");
console.log("4. Don't forget that finalization is non-deterministic");
console.log("5. Don't use in hot paths (performance overhead)");

console.log("\n⚠️ Important Notes:");
console.log("- WeakRef<T> only accepts object types (not primitives)");
console.log("- deref() may return undefined at any time");
console.log("- FinalizationRegistry callbacks are non-deterministic");
console.log("- Use explicit cleanup (Disposable) for critical resources");
console.log("- TypeScript types don't change runtime behavior");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - WEAKREF/FINALIZATIONREGISTRY            │
├─────────────────────────────────────────────────────────────────────┤
│ WeakRef:                                                            │
│   JavaScript: WeakRef(target)                                       │
│   TypeScript: WeakRef<T>(target: T)                                 │
│                                                                     │
│ deref():                                                            │
│   JavaScript: Returns target or undefined                           │
│   TypeScript: Returns T | undefined                                 │
│                                                                     │
│ FinalizationRegistry:                                               │
│   JavaScript: FinalizationRegistry(callback)                        │
│   TypeScript: FinalizationRegistry<T>(callback: (held: T) => void) │
│                                                                     │
│ Held Value:                                                         │
│   JavaScript: Any type                                              │
│   TypeScript: Typed as T                                            │
│                                                                     │
│ Type Safety:                                                        │
│   JavaScript: Runtime only                                          │
│   TypeScript: Compile-time + runtime                                │
└─────────────────────────────────────────────────────────────────────┘
`);
