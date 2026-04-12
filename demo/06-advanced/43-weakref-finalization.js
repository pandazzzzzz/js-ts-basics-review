// WeakRef and FinalizationRegistry Demo
// 📘 For TypeScript comparison, see: 43-weakref-finalization-ts-comparison.ts
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
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Non-deterministic cleanup
console.log("\nPitfall 1: Non-deterministic cleanup timing");
console.log("  Finalizer callbacks run at GC discretion");
console.log("  Can be delayed or never called in some cases");
console.log("  Fix: Use for cleanup hints, not critical logic");

// Pitfall 2: WeakRef deref() returning undefined
console.log("\nPitfall 2: WeakRef.deref() returns undefined");
console.log("  Object may be collected between check and use");
console.log("  deref() can fail even if checked immediately before");
console.log("  Fix: Always handle undefined case");

// Pitfall 3: Memory leaks in cache with WeakRef
console.log("\nPitfall 3: Key leaks in WeakRef cache");
console.log("  WeakRef allows value GC, but key may remain");
console.log("  Map keys are strong references");
console.log("  Fix: Use FinalizationRegistry to clean up keys");

// Pitfall 4: Finalizer callback errors
console.log("\nPitfall 4: Finalizer callback errors");
console.log("  Errors in finalizer are silently ignored");
console.log("  No way to catch or handle finalizer errors");
console.log("  Fix: Make finalizers robust");

// Pitfall 5: Re-registering same object
console.log("\nPitfall 5: Re-registering with FinalizationRegistry");
console.log("  Can register same object multiple times");
console.log("  Multiple callbacks for same object");
console.log("  Fix: Track registration or use unique handles");

// Pitfall 6: Using WeakRef for critical data
console.log("\nPitfall 6: WeakRef for critical data");
console.log("  Data may be collected unexpectedly");
console.log("  Not suitable for essential information");
console.log("  Fix: Use only for cache/optimization");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Use WeakRef for optional caches only");
console.log("2. Use FinalizationRegistry for cleanup hints");
console.log("3. Always check if deref() returns undefined");
console.log("4. Implement proper cache key cleanup");
console.log("5. Make finalizer callbacks robust");
console.log("6. Consider using/await using instead (ES2025)");
console.log("7. Test finalizer behavior (can be flaky)");
console.log("8. Use try/finally as fallback");
console.log("9. Document WeakRef usage clearly");
console.log("10. Profile memory before and after");

console.log("\n❌ DON'T:");
console.log("1. Don't rely on immediate finalization");
console.log("2. Don't use for critical resource cleanup");
console.log("3. Don't assume deref() succeeds");
console.log("4. Don't register same object multiple times");
console.log("5. Don't throw in finalizer callbacks");
console.log("6. Don't use without fallback");
console.log("7. Don't expect predictable cleanup order");
console.log("8. Don't use for required application data");
console.log("9. Don't forget to unregister if possible");
console.log("10. Don't overuse - has performance overhead");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Non-deterministic finalization");
console.log("2. Browser support (ES2021)");
console.log("3. Key leaks in caches");
console.log("4. Finalizer callback reliability");
console.log("5. Multiple registrations");
console.log("6. Performance impact");
console.log("7. Memory pressure effects");
console.log("8. Testing difficulties");

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
