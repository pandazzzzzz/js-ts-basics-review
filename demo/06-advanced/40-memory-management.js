// Memory Management - Comprehensive Guide
// 📘 For TypeScript comparison, see: 40-memory-management-ts-comparison.ts
// 📘 javascript.info: "Garbage collection", "WeakRef and FinalizationRegistry"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_management

// ============================================
// Section 1: Memory Lifecycle
// ============================================

console.log("\n=== Memory Lifecycle ===");

// Three phases of memory lifecycle:
// 1. Allocation - Memory is allocated for values
// 2. Use - Read and write to allocated memory
// 3. Release - Memory is freed when no longer needed

// JavaScript automatic memory management
// - No manual malloc/free like C/C++
// - Garbage collector automatically frees unused memory
// - Developer focuses on logic, not memory management

// Stack vs Heap memory:
// Stack: Primitive types (number, string, boolean, null, undefined, symbol, bigint)
//        - Fixed size, fast access
//        - Automatically managed by call stack
// Heap: Reference types (objects, arrays, functions)
//       - Dynamic size, slower access
//       - Managed by garbage collector

let primitive = 42;           // Stored on stack
let object = { value: 42 };   // Reference on stack, object on heap

console.log("Primitive (stack):", primitive);
console.log("Object (heap):", object);

// ============================================
// Section 2: Garbage Collection Algorithms
// ============================================

console.log("\n=== Garbage Collection Algorithms ===");

// Reachability - Core concept of GC
// - A value is "reachable" if it can be accessed or used
// - Reachable values are kept in memory
// - Unreachable values are garbage collected

// Roots - Starting points for reachability:
// 1. Global variables (window in browser, global in Node.js)
// 2. Currently executing function and its local variables
// 3. Call stack - all functions in the current call chain
// 4. Other internal references

// Example: Reachability
let user = { name: "Alice" };  // Reachable (referenced by 'user')
user = null;                   // Now unreachable, will be GC'd

let admin = { name: "Bob" };
let superAdmin = admin;        // Two references to same object
admin = null;                  // Still reachable via 'superAdmin'
superAdmin = null;             // Now unreachable, will be GC'd

// Mark-and-Sweep Algorithm
// - Most common GC algorithm in JavaScript engines
// - Two phases:
//   1. Mark: Start from roots, mark all reachable objects
//   2. Sweep: Remove all unmarked (unreachable) objects

console.log("Mark-and-Sweep process:");
console.log("1. Start from roots (global, stack)");
console.log("2. Mark all reachable objects recursively");
console.log("3. Sweep (delete) all unmarked objects");
console.log("4. Compact memory (optional)");

// Reference Counting (older approach)
// - Each object has a count of references to it
// - When count reaches 0, object is freed
// - Problem: Circular references cause memory leaks

// Circular reference example (problematic with reference counting):
function createCircular() {
  let obj1 = {};
  let obj2 = {};
  obj1.ref = obj2;  // obj1 references obj2
  obj2.ref = obj1;  // obj2 references obj1 (circular!)
  return "done";
}
createCircular();
// With reference counting: obj1 and obj2 never freed (leak!)
// With mark-and-sweep: Both are unreachable from roots, so they're freed ✓

// Generational GC
// - Optimization based on "generational hypothesis"
// - Most objects die young (short-lived)
// - Divides heap into generations:
//   - Young generation: New objects, frequent GC
//   - Old generation: Long-lived objects, infrequent GC
// - Faster than checking all objects every time

console.log("\nGenerational GC:");
console.log("- Young gen: Frequent, fast collection");
console.log("- Old gen: Infrequent, thorough collection");
console.log("- Objects promoted from young to old if they survive");

// ============================================
// Section 3: Common Memory Leak Patterns
// ============================================

console.log("\n=== Common Memory Leak Patterns ===");

// Pattern 1: Accidental global variables
function leakyFunction() {
  // Forgot 'let' or 'const' - creates global variable!
  leakedVariable = "I'm global now!";
}
leakyFunction();
console.log("Leaked global:", typeof leakedVariable); // "string"

// Fix: Use strict mode and proper declarations
"use strict";
function properFunction() {
  let properVariable = "I'm local";
  return properVariable;
}

// Pattern 2: Forgotten timers
let data = new Array(1000000).fill("data");
const intervalId = setInterval(() => {
  // This closure keeps 'data' in memory forever!
  console.log(data.length);
}, 1000);

// Fix: Clear timers when done
clearInterval(intervalId);

// Pattern 3: Closures holding large objects
function createClosure() {
  let largeArray = new Array(1000000).fill("data");

  return function() {
    // This closure keeps largeArray in memory
    // even if we only need one value
    return largeArray[0];
  };
}

const closure = createClosure();
// largeArray is kept in memory as long as closure exists

// Fix: Only capture what you need
function createBetterClosure() {
  let largeArray = new Array(1000000).fill("data");
  let firstItem = largeArray[0];  // Extract only what's needed
  largeArray = null;              // Allow GC of large array

  return function() {
    return firstItem;
  };
}

// Pattern 4: DOM references (browser)
// let elements = [];
// function addElement() {
//   let div = document.createElement('div');
//   document.body.appendChild(div);
//   elements.push(div);  // Keeps reference even if removed from DOM
// }
//
// // Later: remove from DOM but still in array
// document.body.removeChild(elements[0]);
// // elements[0] still prevents GC!

// Fix: Remove from array too, or use WeakMap/WeakSet

// Pattern 5: Event listeners not removed
// let button = document.getElementById('myButton');
// function handleClick() {
//   console.log('Clicked!');
// }
// button.addEventListener('click', handleClick);
//
// // If button is removed from DOM but listener not removed:
// // Both button and handleClick are kept in memory

// Fix: Remove listeners
// button.removeEventListener('click', handleClick);

// Pattern 6: Large objects not nullified
function processLargeData() {
  let largeData = new Array(10000000).fill({ data: "value" });

  // Process data...
  let result = largeData.length;

  // largeData is kept in memory until function returns
  // Fix: Set to null when done
  largeData = null;

  return result;
}

console.log("Memory leak patterns:");
console.log("1. Accidental globals");
console.log("2. Forgotten timers/intervals");
console.log("3. Closures holding large objects");
console.log("4. Detached DOM nodes");
console.log("5. Event listeners not removed");
console.log("6. Large objects not nullified");

// ============================================
// Section 4: WeakMap and WeakSet
// ============================================

console.log("\n=== WeakMap and WeakSet ===");

// WeakMap - Map with weak references to keys
// - Keys can be garbage collected
// - No iteration methods (can't enumerate weak references)
// - Ideal for metadata and caches

const weakMap = new WeakMap();
let wmKey = { id: 1 };
weakMap.set(wmKey, "metadata");
console.log("WeakMap entry:", weakMap.get(wmKey)); // "metadata"

// If key becomes unreachable:
wmKey = null;
// WeakMap entry is automatically removed when key is GC'd ✓

// WeakSet - Set with weak references
// - Objects can be garbage collected
// - No iteration methods
// - Ideal for tracking object relationships

const weakSet = new WeakSet();
let wsObj = { data: "test" };
weakSet.add(wsObj);
console.log("WeakSet has:", weakSet.has(wsObj)); // true

// If object becomes unreachable:
wsObj = null;
// Object removed from WeakSet when GC'd ✓

console.log("\nWeakMap/WeakSet benefits:");
console.log("- Keys/values can be garbage collected");
console.log("- Ideal for caches and metadata");
console.log("- No memory leaks from forgotten entries");
console.log("- No iteration methods (security/privacy)");

// Use case: Attaching metadata to objects
const metadataCache = new WeakMap();

function attachMetadata(obj, metadata) {
  metadataCache.set(obj, metadata);
}

function getMetadata(obj) {
  return metadataCache.get(obj);
}

let user1 = { name: "Alice" };
attachMetadata(user1, { role: "admin", created: new Date() });
console.log("User metadata:", getMetadata(user1));

// When user1 is GC'd, metadata is also GC'd automatically

// ============================================
// Section 5: WeakRef
// ============================================

console.log("\n=== WeakRef ===");

// WeakRef - Weak reference to an object
// - Doesn't prevent garbage collection
// - Can be used to implement caches
// - deref() returns the object or undefined if GC'd

// Creating a WeakRef
let target = { name: "Alice", data: new Array(1000) };
const weakRef = new WeakRef(target);

// Accessing target
console.log("Dereferencing:", weakRef.deref());
// { name: "Alice", data: [...] }

// Target is still reachable via 'target' variable
console.log("Target still exists:", weakRef.deref() !== undefined); // true

// If we remove the strong reference:
target = null;
// Now, object can be garbage collected
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
// Section 6: FinalizationRegistry
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
console.log("- Callback receives held value, not object");
console.log("- Can unregister with token");

// Use case: Image cache with cleanup
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

// ============================================
// Section 7: Memory Optimization Techniques
// ============================================

console.log("\n=== Memory Optimization Techniques ===");

// Technique 1: Nullify references when done
let cacheData = { data: new Array(1000000) };
// ... use cacheData ...
cacheData = null;  // Allow GC

// Technique 2: Use WeakMap/WeakSet for caches
// Regular Map keeps keeps keys alive:
const regularMap = new Map();
let rmKey = { id: 1 };
regularMap.set(rmKey, "value");
rmKey = null;  // Object still in Map, not GC'd!

// WeakMap allows GC:
const wm = new WeakMap();
let wmKey2 = { id: 1 };
wm.set(wmKey2, "value");
wmKey2 = null;  // Object can be GC'd now ✓

console.log("WeakMap/WeakSet benefits:");
console.log("- Keys can be garbage collected");
console.log("- Ideal for caches and metadata");
console.log("- No memory leaks from forgotten entries");

// Technique 3: Object pooling
// Reuse objects instead of creating new ones
class ObjectPool {
  constructor(createFn, resetFn) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
  }

  acquire() {
    return this.pool.pop() || this.createFn();
  }

  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Example: Pool of point objects
const pointPool = new ObjectPool(
  () => ({ x: 0, y: 0 }),
  (point) => { point.x = 0; point.y = 0; }
);

const point = pointPool.acquire();
point.x = 10;
point.y = 20;
// ... use point ...
pointPool.release(point);  // Reuse instead of GC

console.log("Object pooling benefits:");
console.log("- Reduces GC pressure");
console.log("- Faster than allocation");
console.log("- Good for frequently created/destroyed objects");

// Technique 4: Avoid temporary objects in hot paths
// Bad: Creates temporary array every call
function sumBad(a, b, c) {
  return [a, b, c].reduce((sum, n) => sum + n, 0);
}

// Good: No temporary objects
function sumGood(a, b, c) {
  return a + b + c;
}

// Technique 5: String interning concept
// JavaScript engines automatically intern string literals
const str1 = "hello";
const str2 = "hello";
console.log("\nString interning:");
console.log("str1 === str2:", str1 === str2);  // true (same reference)

// ============================================
// Section 8: Memory Leak Detection
// ============================================

console.log("\n=== Memory Leak Detection ===");

// Chrome DevTools Memory Panel
console.log("Chrome DevTools Memory tools:");
console.log("1. Heap Snapshot - Capture memory state");
console.log("   - Take snapshot, perform action, take another");
console.log("   - Compare snapshots to find leaks");
console.log("   - Look for objects that shouldn't exist");

console.log("\n2. Allocation Timeline");
console.log("   - Record memory allocations over time");
console.log("   - Blue bars = allocations");
console.log("   - Gray bars = garbage collected");
console.log("   - Persistent blue bars = potential leaks");

console.log("\n3. Allocation Sampling");
console.log("   - Lightweight profiling");
console.log("   - Shows which functions allocate memory");
console.log("   - Good for finding allocation hotspots");

// Node.js memory monitoring
if (typeof process !== 'undefined') {
  const memUsage = process.memoryUsage();
  console.log("\nNode.js memory usage:");
  console.log("RSS:", Math.round(memUsage.rss / 1024 / 1024), "MB");
  console.log("Heap Total:", Math.round(memUsage.heapTotal / 1024 / 1024), "MB");
  console.log("Heap Used:", Math.round(memUsage.heapUsed / 1024 / 1024), "MB");
  console.log("External:", Math.round(memUsage.external / 1024 / 1024), "MB");
}

// Node.js debugging with Chrome DevTools
console.log("\nNode.js debugging:");
console.log("1. Run: node --inspect app.js");
console.log("2. Open chrome://inspect in Chrome");
console.log("3. Click 'inspect' on your Node process");
console.log("4. Use Memory panel like browser debugging");

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Assuming immediate garbage collection
console.log("\nPitfall 1: Assuming immediate garbage collection");
console.log("  Setting objects to null doesn't guarantee immediate GC.");
console.log("  JS engines decide when to run GC based on heuristics.");
console.log("  Fix: Don't rely on immediate cleanup. Use explicit cleanup for resources.");

// Pitfall 2: Memory leaks in closures
console.log("\nPitfall 2: Memory leaks in closures");
console.log("  Closures capture and retain references from their lexical scope.");
console.log("  If a closure is long-lived, it keeps all captured objects alive.");
console.log("  Fix: Only capture what you need; nullify large references when done.");

// Pitfall 3: Not clearing timers/intervals
console.log("\nPitfall 3: Not clearing timers/intervals");
console.log("  setInterval and setTimeout callbacks keep their scope alive.");
console.log("  Forgotten timers prevent garbage collection of enclosed objects.");
console.log("  Fix: Always store timer IDs and call clearTimeout/clearInterval.");

// Pitfall 4: Event listeners not removed
console.log("\nPitfall 4: Event listeners not removed");
console.log("  Event listeners with closures hold references to DOM elements.");
console.log("  If elements are removed but listeners stay, memory leaks occur.");
console.log("  Fix: Always remove event listeners when elements are removed.");

// Pitfall 5: Using Map/Set for object caches
console.log("\nPitfall 5: Using Map/Set for object caches");
console.log("  Regular Map/Set keep strong references to keys.");
console.log("  Cached objects cannot be garbage collected while in Map.");
console.log("  Fix: Use WeakMap/WeakSet for object caches and metadata.");

// Pitfall 6: Detached DOM nodes
console.log("\nPitfall 6: Detached DOM nodes");
console.log("  DOM nodes removed from document but referenced in arrays.");
console.log("  These detached nodes and their subtrees are kept in memory.");
console.log("  Fix: Clear arrays/objects holding DOM references.");

// Pitfall 7: Non-deterministic finalization
console.log("\nPitfall 7: Non-deterministic cleanup timing");
console.log("  Finalizer callbacks run at GC discretion.");
console.log("  Can be delayed or never called in some cases.");
console.log("  Fix: Use for cleanup hints, not critical logic.");

// Pitfall 8: WeakRef deref() returning undefined
console.log("\nPitfall 8: WeakRef.deref() returns undefined");
console.log("  Object may be collected between check and use.");
console.log("  deref() can fail even if checked immediately before.");
console.log("  Fix: Always handle undefined case.");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("\n✅ DO:");
console.log("1. Use WeakMap/WeakSet for caches and metadata attached to objects.");
console.log("2. Always clear timers and intervals when no longer needed.");
console.log("3. Remove event listeners before removing DOM elements.");
console.log("4. Nullify large object references when you're done with them.");
console.log("5. Use strict mode to catch accidental global variables.");
console.log("6. Profile memory with DevTools to identify leaks early.");
console.log("7. Use object pooling for frequently created/destroyed objects.");
console.log("8. Be mindful of closures capturing large objects.");
console.log("9. Use WeakRef for optional caches only, not critical data.");
console.log("10. Always check if deref() returns undefined when using WeakRef.");

console.log("\n❌ DON'T:");
console.log("1. Don't assume GC runs immediately after setting references to null.");
console.log("2. Don't create unnecessary temporary objects in hot loops.");
console.log("3. Don't forget to clean up event listeners and timers.");
console.log("4. Don't use regular Map for caching objects that should be GC'd.");
console.log("5. Don't ignore memory warnings from DevTools.");
console.log("6. Don't create global variables unintentionally (use strict mode).");
console.log("7. Don't rely on WeakRef/FinalizationRegistry for critical cleanup.");
console.log("8. Don't assume deref() succeeds with WeakRef.");
console.log("9. Don't use WeakRef for essential application data.");
console.log("10. Don't throw errors in FinalizationRegistry callbacks.");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Closures can unexpectedly keep objects alive longer than intended.");
console.log("2. Event listeners with anonymous functions are hard to remove.");
console.log("3. Circular references (handled by modern GC but worth knowing).");
console.log("4. Memory leaks in long-running applications accumulate over time.");
console.log("5. Large objects don't GC when you expect without explicit cleanup.");
console.log("6. Detached DOM nodes are a common source of leaks in browsers.");
console.log("7. Non-deterministic finalization makes WeakRef/FinalizationRegistry tricky.");
console.log("8. Browser support varies - check before using WeakRef/FinalizationRegistry.");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. NO RUNTIME DIFFERENCE
   TS:  TypeScript doesn't change JavaScript's memory management
   TS:  Type information is erased at compile time
   TS:  No impact on garbage collection behavior
   TS:  Same memory lifecycle as JavaScript

2. WEAKREF TYPING
   JS:  Runtime type checking only
   TS:  WeakRef<T> generic type
   TS:  deref() returns T | undefined
   TS:  Type-safe weak references

   Example:
   const ref: WeakRef<MyClass> = new WeakRef(obj);
   const value: MyClass | undefined = ref.deref();

3. FINALIZATIONREGISTRY TYPING
   TS:  FinalizationRegistry<T> generic
   TS:  T is the type of held value
   TS:  Callback parameter is typed as T

   Example:
   const registry = new FinalizationRegistry<string>((heldValue) => {
     // heldValue is typed as string
     console.log(heldValue);
   });

4. WEAKMAP/WEAKSET TYPING
   TS:  WeakMap<K extends object, V>
   TS:  WeakSet<T extends object>
   TS:  Type system enforces object keys only

5. DISPOSABLE PATTERN (TS 5.2+)
   TS:  using / await using declarations
   TS:  Disposable / AsyncDisposable interfaces
   TS:  Automatic resource cleanup
   TS:  Reduces risk of memory leaks

   Example:
   interface Disposable {
     [Symbol.dispose](): void;
   }

   class Resource implements Disposable {
     [Symbol.dispose]() {
       // Cleanup logic
     }
   }

   {
     using resource = new Resource();
     // Automatically disposed at end of block
   }

6. TYPE SAFETY HELPS PREVENT LEAKS
   TS:  Strict null checks catch potential issues
   TS:  Type system enforces cleanup patterns
   TS:  Better IDE support for finding unused variables

⚠️ MEMORY BEST PRACTICES:
- Use const by default (prevents accidental reassignment)
- Nullify large objects when done
- Clear timers and intervals
- Remove event listeners
- Use WeakMap/WeakSet for caches
- Avoid closures capturing large objects
- Profile memory usage regularly
- Use object pooling for frequently created objects
- Be careful with global variables
- Use strict mode to catch accidental globals

🔧 DEBUGGING TIPS:
- Take heap snapshots before and after operations
- Look for unexpected object retention
- Check for detached DOM nodes (browser)
- Monitor memory usage over time
- Use allocation timeline to find leaks
- Test with realistic data volumes
- Profile in production-like environment

⚠️ IMPORTANT WARNINGS:

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

📘 See related:
- demo/02-data-structures/10-map-set.js (WeakMap/WeakSet)
- demo/03-core-concepts/13-scope-closures.js (Closures and memory)
- demo/05-browser-dom/36-events.js (Event listener cleanup)
- demo/06-advanced/38-es2022-plus-features.js (using/await using)
*/
