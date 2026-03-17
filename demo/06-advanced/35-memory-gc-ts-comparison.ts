// TypeScript vs JavaScript: Memory and GC Comparison
// 📘 For JavaScript examples, see: 35-memory-gc.js
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
// Section 2: Disposable Pattern (TS 5.2+)
// ============================================

console.log("\n=== Disposable Pattern (TS 5.2+) ===\n");

// Disposable interface for automatic resource cleanup (requires ESNext lib)
// Note: Symbol.dispose requires lib: ["ESNext"] in tsconfig.json
// interface Disposable {
//   [Symbol.dispose](): void;
// }

// interface AsyncDisposable {
//   [Symbol.asyncDispose](): Promise<void>;
// }

// Type-safe resource with automatic cleanup (example - requires ESNext)
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

// await using for async resources
// async function queryDatabase() {
//   await using db = new DatabaseConnection("localhost:5432");
//   await db.query("SELECT * FROM users");
//   // db is automatically disposed (async) at end of block
// }

// ============================================
// Section 3: WeakMap/WeakSet with Types
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

interface User {
  id: number;
  name: string;
}

let user: User = { id: 1, name: "Alice" };
userMetadata.set(user, {
  lastAccessed: new Date(),
  accessCount: 1
});

console.log("Metadata:", userMetadata.get(user));

// When user is no longer referenced, metadata is automatically GC'd
user = null as any;

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
// Section 4: Memory Leak Prevention
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

// Pattern 2: Type-safe timer cleanup (requires @types/node for NodeJS namespace)
console.log(`
TimerManager example (Node.js environment):

class TimerManager {
  private timers = new Set<ReturnType<typeof setTimeout>>();

  setTimeout(callback: () => void, delay: number) {
    const timer = setTimeout(() => {
      callback();
      this.timers.delete(timer);
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  clearAll(): void {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
  }
}
`);

// Pattern 3: Type-safe closure management
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
// Section 5: Object Pooling with Types
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
// Section 6: Resource Tracking
// ============================================

console.log("\n=== Resource Tracking ===\n");

// Type-safe resource tracker
class ResourceTracker<T extends object> {
  private resources = new WeakMap<T, string>();
  private registry = new FinalizationRegistry<string>((resourceId) => {
    console.warn(`Resource ${resourceId} was not properly closed!`);
  });

  track(resource: T, id: string): void {
    this.resources.set(resource, id);
    this.registry.register(resource, id, resource);
  }

  untrack(resource: T): void {
    this.registry.unregister(resource);
  }
}

// Resource tracking example (requires ESNext lib)
console.log(`
ManagedFileHandle example (requires ESNext lib):

class ManagedFileHandle implements Disposable {
  close(): void {
    console.log('Closing file');
  }

  [Symbol.dispose](): void {
    this.close();
  }
}
`);

// ============================================
// Section 7: Memory Profiling Types
// ============================================

console.log("\n=== Memory Profiling Types ===\n");

// Type-safe memory usage tracking (Node.js environment)
// Note: Requires @types/node for process.memoryUsage()
console.log(`
Memory profiling example (Node.js):

interface MemoryUsage {
  rss: number;        // Resident Set Size
  heapTotal: number;  // Total heap size
  heapUsed: number;   // Used heap size
  external: number;   // External memory
}

function getMemoryUsage(): MemoryUsage | null {
  if (typeof process !== "undefined" && process.memoryUsage) {
    return process.memoryUsage();
  }
  return null;
}

function formatBytes(bytes: number): string {
  return \`\${Math.round(bytes / 1024 / 1024)} MB\`;
}
`);

// ============================================
// Section 8: Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use Disposable interface for resource management");
console.log("2. Enable strict null checks in tsconfig.json");
console.log("3. Use WeakMap/WeakSet with proper types");
console.log("4. Implement type-safe object pools");
console.log("5. Use const by default to prevent reassignment");
console.log("6. Leverage type system to enforce cleanup patterns");
console.log("7. Use ResourceTracker for debugging leaks");

console.log("\n❌ DON'T:");
console.log("1. Don't rely on types to prevent runtime memory leaks");
console.log("2. Don't forget that types are erased at runtime");
console.log("3. Don't use any type (loses type safety)");
console.log("4. Don't ignore cleanup in async operations");
console.log("5. Don't create unbounded caches without size limits");

console.log("\n🔧 TypeScript-Specific Tips:");
console.log("- Use using/await using for automatic cleanup (TS 5.2+)");
console.log("- Implement Disposable interface for resources");
console.log("- Use strict mode to catch potential leaks");
console.log("- Leverage type system for cleanup enforcement");
console.log("- Use WeakMap<K extends object, V> for type safety");
console.log("- Create type-safe wrappers for resource management");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - MEMORY MANAGEMENT                       │
├─────────────────────────────────────────────────────────────────────┤
│ Runtime Behavior:                                                   │
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
└─────────────────────────────────────────────────────────────────────┘
`);
