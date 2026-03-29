// WeakRef and FinalizationRegistry Demo
// 📘 javascript.info: "WeakRef and FinalizationRegistry"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef
// 📌 ES2021 (ES12)

// ============================================
// Section 1: Garbage Collection Basics Review
// ============================================

console.log("\n=== Garbage Collection Basics ===");

// JavaScript garbage collection mechanism
// - Automatic memory management
// - Based on reachability
// - Objects are kept in memory as long as they're reachable
// - Unreachable objects are garbage collected

// Strong reference - Prevents garbage collection
let strongRef = { data: "important" };
// Object is reachable via strongRef, won't be GC'd

// Weak reference - Doesn't prevent garbage collection
// - WeakMap, WeakSet, WeakRef
// - Object can be GC'd even if weakly referenced

console.log("Strong reference keeps object alive");
console.log("Weak reference allows garbage collection");

// WeakMap/WeakSet review (see 08-map-set.js)
const weakMap = new WeakMap();
let key = { id: 1 };
weakMap.set(key, "value");
// If key becomes unreachable, entry is automatically removed

const weakSet = new WeakSet();
let obj = { data: "test" };
weakSet.add(obj);
// If obj becomes unreachable, it's automatically removed

console.log("\nWeakMap/WeakSet:");
console.log("- Keys are weakly held");
console.log("- Don't prevent garbage collection");
console.log("- No iteration methods");
console.log("- Ideal for metadata and caches");

// ============================================
// Section 2: WeakRef
// ============================================

console.log("\n=== WeakRef ===");

// WeakRef - Weak reference to an object
// - Doesn't prevent garbage collection
// - Can be used to implement caches
// - deref() returns the object or undefined if GC'd

// Creating a WeakRef
let target = { name: "Alice", data: new Array(1000) };
const weakRef = new WeakRef(target);

// Accessing the target
console.log("Dereferencing:", weakRef.deref());
// { name: "Alice", data: [...] }

// Target is still reachable via 'target' variable
console.log("Target still exists:", weakRef.deref() !== undefined); // true

// If we remove the strong reference:
target = null;
// Now the object can be garbage collected
// weakRef.deref() may return undefined after GC

console.log("\nWeakRef behavior:");
console.log("- new WeakRef(target) creates weak reference");
console.log("- weakRef.deref() returns target or undefined");
console.log("- Target can be GC'd if no strong references exist");
console.log("- deref() timing is non-deterministic");

// Use case: Cache with automatic cleanup
class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, new WeakRef(value));
  }

  get(key) {
    const ref = this.cache.get(key);
    if (!ref) return undefined;
    
    const value = ref.deref();
    if (value === undefined) {
      // Object was garbage collected
      this.cache.delete(key);
    }
    return value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }
}

const cache = new Cache();
let largeObject = { data: new Array(10000) };
cache.set("key1", largeObject);

console.log("\nCache example:");
console.log("Has key1:", cache.has("key1")); // true

// If largeObject becomes unreachable:
largeObject = null;
// After GC, cache.get("key1") will return undefined

// ============================================
// Section 3: FinalizationRegistry
// ============================================

console.log("\n=== FinalizationRegistry ===");

// FinalizationRegistry - Notification when objects are GC'd
// - Register objects to be notified when they're collected
// - Callback receives "held value" (not the object itself)
// - Timing is non-deterministic

// Creating a FinalizationRegistry
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with held value "${heldValue}" was garbage collected`);
});

// Registering objects
let obj1 = { name: "Object 1" };
let obj2 = { name: "Object 2" };

registry.register(obj1, "obj1-metadata");
registry.register(obj2, "obj2-metadata");

console.log("Objects registered for finalization");

// When obj1 becomes unreachable and is GC'd:
// obj1 = null;
// Eventually: "Object with held value "obj1-metadata" was garbage collected"

// Unregistering objects
const unregisterToken = { id: "token" };
let obj3 = { name: "Object 3" };
registry.register(obj3, "obj3-metadata", unregisterToken);

// Later, if we don't want notification:
registry.unregister(unregisterToken);
// Now obj3 won't trigger callback when GC'd

console.log("\nFinalizationRegistry behavior:");
console.log("- Callback is called after object is GC'd");
console.log("- Timing is non-deterministic");
console.log("- Callback receives held value, not the object");
console.log("- Can unregister with token");

// ============================================
// Section 4: Practical Applications
// ============================================

console.log("\n=== Practical Applications ===");

// Application 1: Weak reference cache
class ImageCache {
  constructor() {
    this.cache = new Map();
    this.registry = new FinalizationRegistry((url) => {
      console.log(`Image ${url} was garbage collected`);
      this.cache.delete(url);
    });
  }

  load(url) {
    // Check if cached
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
    const image = { url, data: new Array(1000) }; // Simulated image
    
    this.cache.set(url, new WeakRef(image));
    this.registry.register(image, url);
    
    return image;
  }
}

const imageCache = new ImageCache();
let img1 = imageCache.load("photo1.jpg");
let img2 = imageCache.load("photo1.jpg"); // Cache hit
console.log("Same image:", img1 === img2); // true

// Application 2: Resource cleanup tracking
class ResourceTracker {
  constructor() {
    this.registry = new FinalizationRegistry((resourceId) => {
      console.log(`Resource ${resourceId} was not properly closed!`);
      // Log warning, send telemetry, etc.
    });
  }

  track(resource, id) {
    this.registry.register(resource, id);
  }

  untrack(resource, token) {
    this.registry.unregister(token);
  }
}

const tracker = new ResourceTracker();

class FileHandle {
  constructor(filename) {
    this.filename = filename;
    this.closed = false;
    this.token = { filename };
    tracker.track(this, filename);
  }

  close() {
    if (!this.closed) {
      console.log(`Closing ${this.filename}`);
      this.closed = true;
      tracker.untrack(this, this.token);
    }
  }
}

let file = new FileHandle("data.txt");
file.close(); // Properly closed, no warning

let file2 = new FileHandle("temp.txt");
file2 = null; // Not closed! Will trigger warning after GC

// Application 3: Memory leak detection
class LeakDetector {
  constructor() {
    this.registry = new FinalizationRegistry((info) => {
      console.log(`Potential leak detected: ${info}`);
    });
    this.tracked = new Set();
  }

  track(obj, info) {
    this.tracked.add(info);
    this.registry.register(obj, info);
  }

  report() {
    console.log("Still tracked:", this.tracked.size);
  }
}

const detector = new LeakDetector();
let leakyObj = { data: "test" };
detector.track(leakyObj, "leakyObj");
detector.report(); // Still tracked: 1

// ============================================
// Section 5: Caveats and Best Practices
// ============================================

console.log("\n=== Caveats and Best Practices ===");

// Caveat 1: Non-deterministic timing
console.log("\n1. Non-deterministic timing:");
console.log("- GC timing is unpredictable");
console.log("- Don't rely on when callbacks fire");
console.log("- May not fire at all before program exit");

// Caveat 2: Don't use for critical logic
console.log("\n2. Don't use for critical logic:");
console.log("- Not suitable for resource cleanup");
console.log("- Use explicit cleanup (try/finally, using)");
console.log("- FinalizationRegistry is for diagnostics only");

// Caveat 3: Performance considerations
console.log("\n3. Performance considerations:");
console.log("- WeakRef.deref() has overhead");
console.log("- Don't use in hot paths");
console.log("- Cache deref() result if used multiple times");

// Best Practice 1: Explicit cleanup is better
console.log("\n4. Best practices:");
console.log("✓ Use explicit cleanup methods");
console.log("✓ Use try/finally for resources");
console.log("✓ Use WeakMap/WeakSet when possible");
console.log("✓ Use WeakRef for caches only");
console.log("✓ Use FinalizationRegistry for diagnostics");
console.log("✗ Don't rely on finalization for cleanup");

// Best Practice 2: When to use each
console.log("\n5. When to use:");
console.log("WeakMap/WeakSet:");
console.log("  - Metadata associated with objects");
console.log("  - Private data storage");
console.log("  - Simple caches");

console.log("\nWeakRef:");
console.log("  - Large object caches");
console.log("  - Optional references");
console.log("  - Memory-sensitive caches");

console.log("\nFinalizationRegistry:");
console.log("  - Debugging memory leaks");
console.log("  - Telemetry and logging");
console.log("  - Development warnings");
console.log("  - NOT for resource cleanup");

// Browser and Node.js support
console.log("\n6. Compatibility:");
console.log("- ES2021 feature");
console.log("- Modern browsers: Full support");
console.log("- Node.js: v14.6.0+");
console.log("- Check compatibility before using");

// Example: Proper resource management (without WeakRef)
class ProperResource {
  constructor(name) {
    this.name = name;
    console.log(`Opening ${name}`);
  }

  close() {
    console.log(`Closing ${this.name}`);
  }

  [Symbol.dispose]() {
    this.close();
  }
}

// Note: using declarations require ES2025 support
// Uncomment when available in your environment
// {
//   using resource = new ProperResource("file.txt");
//   // Automatically closed at end of block
// }

// Using try/finally (current approach - works everywhere)
const resource2 = new ProperResource("file.txt");
try {
  // Use resource2
  console.log(`Using ${resource2.name}`);
} finally {
  resource2.close(); // Always called
}

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. WEAKREF TYPING
   JS:  Runtime type checking only
   TS:  WeakRef<T> generic type
   TS:  deref() returns T | undefined
   TS:  Type-safe weak references

   Example:
   const ref: WeakRef<MyClass> = new WeakRef(obj);
   const value: MyClass | undefined = ref.deref();

2. FINALIZATIONREGISTRY TYPING
   TS:  FinalizationRegistry<T> generic
   TS:  T is the type of held value
   TS:  Callback parameter is typed as T

   Example:
   const registry = new FinalizationRegistry<string>((heldValue) => {
     // heldValue is typed as string
     console.log(heldValue);
   });

3. TYPE SAFETY
   TS:  Prevents passing primitives to WeakRef
   TS:  WeakRef only accepts objects
   TS:  Compile-time checks for proper usage

4. DISPOSABLE PATTERN (TS 5.2+)
   TS:  using / await using declarations
   TS:  Better alternative for resource management
   TS:  Explicit, deterministic cleanup

   Example:
   interface Disposable {
     [Symbol.dispose](): void;
   }
   
   class Resource implements Disposable {
     [Symbol.dispose]() {
       // Cleanup
     }
   }
   
   {
     using resource = new Resource();
     // Automatically disposed
   }

⚠️ IMPORTANT WARNINGS:

1. DON'T USE FOR RESOURCE CLEANUP
   - File handles: Use explicit close()
   - Database connections: Use explicit disconnect()
   - Network sockets: Use explicit close()
   - Locks: Use explicit release()
   
   Why? Finalization is non-deterministic and may not run!

2. DON'T RELY ON TIMING
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

🔧 RECOMMENDED ALTERNATIVES:

For resource management:
- try/finally blocks
- using declarations (ES2025/TS 5.2+)
- Explicit cleanup methods
- RAII patterns

For caching:
- WeakMap/WeakSet (simpler)
- LRU cache with size limits
- Time-based expiration
- Manual cache invalidation

For memory tracking:
- Chrome DevTools Memory profiler
- Node.js --inspect
- Heap snapshots
- Memory usage monitoring

📘 See related:
- 08-map-set.js (WeakMap/WeakSet)
- 35-memory-gc.js (Garbage collection)
- 33-es2022-plus-features.js (using declarations)
*/
