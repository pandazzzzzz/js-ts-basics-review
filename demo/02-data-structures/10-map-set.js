// Map and Set - Complete Demo
// 📘 For TypeScript comparison, see: 10-map-set-ts-comparison.ts
// 📘 javascript.info: "Map and Set", "WeakMap and WeakSet"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
// 📌 ES6 (ES2015)
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces Map and Set as built-in collections with behavior that differs from plain objects.
// The examples highlight when to choose each collection and how their APIs compare.

// ============================================
// Table of Contents
// ============================================
// 1. Map Basics
// 2. Map Iteration
// 3. Objects as Map Keys
// 4. Set Basics
// 5. Set Iteration and Conversion
// 6. Map vs Object Comparison
// 7. Set vs Array Comparison
// 8. WeakMap and WeakSet
// 9. Practical Use Cases
// 10. Common Pitfalls
// 11. Best Practices

// ============================================
// 1. Map Basics
// ============================================

// Creating Map (ES6)
// - Map is a collection of key-value pairs
// - Keys can be any type (objects, functions, primitives)
// - Maintains insertion order
// - Better performance than Object for frequent add/remove operations
const map = new Map();
console.log("Map Basics:");
console.log("  Empty Map:", map);

// Creating Map from array
// - Pass array of [[key, value], ...] pairs
const mapFromArray = new Map([
  ["name", "Alice"],
  ["age", 30],
  [1, "one"],
  [true, "boolean"],
]);
console.log("\nCreating Map from Array:");
console.log("  mapFromArray:", Object.fromEntries(mapFromArray.entries()));

// Map basic methods (ES6)
const userMap = new Map();

// set(key, value) - Add/update key-value pair
// - Returns the Map itself, supports chaining
userMap.set("name", "Alice");
userMap.set("age", 30);
userMap.set("city", "New York");
console.log("\nset() Method:");
console.log("  userMap:", Object.fromEntries(userMap.entries()));

// Chaining
const chainedMap = new Map().set("a", 1).set("b", 2).set("c", 3);
console.log("  Chaining:", Object.fromEntries(chainedMap.entries()));

// get(key) - Get value by key
console.log("\nget() Method:");
console.log("  get('name'):", userMap.get("name")); // "Alice"
console.log("  get('age'):", userMap.get("age")); // 30
console.log("  get('missing'):", userMap.get("missing")); // undefined

// has(key) - Check if key exists
console.log("\nhas() Method:");
console.log("  has('name'):", userMap.has("name")); // true
console.log("  has('salary'):", userMap.has("salary")); // false

// delete(key) - Delete key-value pair
console.log("\ndelete() Method:");
userMap.delete("city");
console.log("  After deleting city:", Object.fromEntries(userMap.entries()));

// clear() - Clear all entries
const tempMap = new Map([
  ["a", 1],
  ["b", 2],
]);
console.log("\nclear() Method:");
console.log("  size before clear:", tempMap.size); // 2
tempMap.clear();
console.log("  size after clear:", tempMap.size); // 0

// size property - Get number of key-value pairs
const sizeMap = new Map([
  ["a", 1],
  ["b", 2],
  ["c", 3],
]);
console.log("\nsize Property:");
console.log("  size:", sizeMap.size); // 3

// ============================================
// 2. Map Iteration
// ============================================

const iterMap = new Map([
  ["mon", "Monday"],
  ["tue", "Tuesday"],
  ["wed", "Wednesday"],
]);

// keys() - Iterate over keys
console.log("\nMap Iteration - keys():");
for (const key of iterMap.keys()) {
  console.log(`  key: ${key}`);
}

// values() - Iterate over values
console.log("\nMap Iteration - values():");
for (const value of iterMap.values()) {
  console.log(`  value: ${value}`);
}

// entries() - Iterate over key-value pairs (default iterator)
console.log("\nMap Iteration - entries():");
for (const [key, value] of iterMap.entries()) {
  console.log(`  ${key}: ${value}`);
}

// Shorthand form (recommended)
console.log("\nMap Iteration - Shorthand:");
for (const [key, value] of iterMap) {
  console.log(`  ${key}: ${value}`);
}

// forEach() - Callback iteration
console.log("\nMap Iteration - forEach():");
iterMap.forEach((value, key) => {
  console.log(`  ${key} -> ${value}`);
});

// Spread operator conversion (ES6)
const mapToObj = Object.fromEntries(iterMap);
const mapToArray = [...iterMap];
console.log("\nMap Conversion:");
console.log("  Map -> Object:", mapToObj);
console.log("  Map -> Array:", mapToArray);

// ============================================
// 3. Objects as Map Keys
// ============================================

// Object keys (based on reference comparison)
const keyObj1 = { id: 1 };
const keyObj2 = { id: 1 };
const objKeyMap = new Map();

objKeyMap.set(keyObj1, "First object");
objKeyMap.set(keyObj2, "Second object");

console.log("\nObjects as Keys:");
console.log("  size (two different objects):", objKeyMap.size); // 2
console.log("  get(keyObj1):", objKeyMap.get(keyObj1)); // "First object"
console.log("  get(keyObj2):", objKeyMap.get(keyObj2)); // "Second object"
console.log("  get({id: 1}):", objKeyMap.get({ id: 1 })); // undefined (new object)

// 📘 Official MDN examples (Map):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
// A Map's keys can be ANY value (functions, objects, primitives); an Object's
// keys must be Strings or Symbols. Maps also perform better with frequent
// additions/removals of key-value pairs.
const myMap = new Map();
const keyString = "a string";
const keyFunc = () => {};

myMap.set(keyString, "value associated with 'a string'");
myMap.set(keyObj1, "value associated with keyObj");
myMap.set(keyFunc, "value associated with keyFunc");

console.log("  MDN three key types — size:", myMap.size); // 3
console.log("  get('a string'):", myMap.get("a string")); // by string identity
console.log("  get({}):", myMap.get({})); // undefined — keyObj1 !== {}
console.log("  get(keyFunc):", myMap.get(keyFunc)); // by function reference
console.log(
  "  get(() => {}):",
  myMap.get(() => {})
); // undefined — new function

// Practical example: storing DOM element metadata
// const elementData = new Map();
// elementData.set(document.querySelector('#btn'), { clicked: false });

// ============================================
// 4. Set Basics
// ============================================

// Creating Set (ES6)
// - Set is a collection of unique values
// - Automatically deduplicates
// - Maintains insertion order
const set = new Set();
console.log("\nSet Basics:");
console.log("  Empty Set:", set);

// Creating from array/string
const setFromArray = new Set([1, 2, 2, 3, 3, 3]);
const setFromString = new Set("hello");
console.log("\nCreating Set from Array/String:");
console.log("  Array deduplication:", [...setFromArray]); // [1, 2, 3]
console.log("  String deduplication:", [...setFromString]); // ['h', 'e', 'l', 'o']

// Set basic methods (ES6)
const userSet = new Set();

// add(value) - Add value
// - Returns the Set itself, supports chaining
userSet.add(1);
userSet.add(2);
userSet.add(3);
userSet.add(2); // Duplicate, won't be added
console.log("\nSet add() Method:");
console.log("  After add:", [...userSet]); // [1, 2, 3]
console.log("  size:", userSet.size); // 3

// Chaining
const chainedSet = new Set().add("a").add("b").add("c");
console.log("  Chaining:", [...chainedSet]);

// has(value) - Check if value exists
console.log("\nSet has() Method:");
console.log("  has(2):", userSet.has(2)); // true
console.log("  has(4):", userSet.has(4)); // false

// delete(value) - Delete value
console.log("\nSet delete() Method:");
userSet.delete(2);
console.log("  After deleting 2:", [...userSet]); // [1, 3]

// clear() - Clear all entries
console.log("\nSet clear() Method:");
userSet.clear();
console.log("  size after clear:", userSet.size); // 0

// ============================================
// 5. Set Iteration and Conversion
// ============================================

const iterSet = new Set(["apple", "banana", "cherry"]);

// values() / keys() - Same in Set
console.log("\nSet Iteration - values():");
for (const value of iterSet.values()) {
  console.log(`  ${value}`);
}

// entries() - Returns [value, value]
console.log("\nSet Iteration - entries():");
for (const entry of iterSet.entries()) {
  console.log(`  ${JSON.stringify(entry)}`); // ["apple", "apple"], ...
}

// forEach()
console.log("\nSet Iteration - forEach():");
iterSet.forEach(value => {
  console.log(`  ${value}`);
});

// Set conversion
console.log("\nSet Conversion:");
const setArray = [...iterSet];
console.log("  Set -> Array:", setArray);

const setObj = Object.fromEntries([...iterSet].map(item => [item, true]));
console.log("  Set -> Object:", setObj);

// Array deduplication utility function
function unique(arr) {
  return [...new Set(arr)];
}
console.log("\nArray Deduplication Utility:");
console.log("  unique([1,2,2,3,3,3]):", unique([1, 2, 2, 3, 3, 3])); // [1, 2, 3]

// ============================================
// 6. Map vs Object Comparison
// ============================================

console.log("\nMap vs Object Comparison:");

// Key types
const typeMap = new Map();
typeMap.set("string", "string key");
typeMap.set(123, "number key");
typeMap.set(true, "boolean key");
typeMap.set({}, "object key");
typeMap.set(() => {}, "function key");
console.log("  Map key types: any type ✓");

const typeObj = {};
typeObj["string"] = "string key";
typeObj[123] = "number key (converted to string)";
console.log("  Object key types: string/Symbol only");

// Iteration order
const orderMap = new Map();
orderMap.set("c", 3);
orderMap.set("a", 1);
orderMap.set("b", 2);
console.log("\n  Map iteration order (insertion order):");
for (const k of orderMap.keys()) console.log(`    ${k}`); // c, a, b

// Performance comparison (large size scenario)
const perfMap = new Map();
const perfObj = {};
const SIZE = 10000;

for (let i = 0; i < SIZE; i++) {
  perfMap.set(`key${i}`, i);
  perfObj[`key${i}`] = i;
}

console.log(`\n  Performance Test (${SIZE} items):`);
const mapStart = performance.now();
for (let i = 0; i < SIZE; i++) perfMap.get(`key${i}`);
const mapTime = performance.now() - mapStart;

const objStart = performance.now();
for (let i = 0; i < SIZE; i++) perfObj[`key${i}`];
const objTime = performance.now() - objStart;

console.log(`    Map.get: ${mapTime.toFixed(2)}ms`);
console.log(`    Object.get: ${objTime.toFixed(2)}ms`);

// When to use Map
// ✓ Need non-string keys
// ✓ Need frequent add/remove operations
// ✓ Need to maintain insertion order
// ✓ Need size property
// ✓ Need true iterators

// When to use Object
// ✓ Simple key-value storage
// ✓ Need JSON serialization
// ✓ Need prototype chain methods
// ✓ Configuration/options objects

// ============================================
// 7. Set vs Array Comparison
// ============================================

console.log("\nSet vs Array Comparison:");

// Uniqueness
const dupArray = [1, 2, 2, 3, 3, 3];
const uniqueSet = new Set(dupArray);
console.log("  Array allows duplicates:", dupArray); // [1, 2, 2, 3, 3, 3]
console.log("  Set auto-deduplicates:", [...uniqueSet]); // [1, 2, 3]

// Lookup performance
const lookupArray = Array.from({ length: 1000 }, (_, i) => i);
const lookupSet = new Set(lookupArray);

const arrayStart = performance.now();
lookupArray.includes(999);
const arrayTime = performance.now() - arrayStart;

const setStart = performance.now();
lookupSet.has(999);
const setTime = performance.now() - setStart;

console.log(`\n  Lookup Performance (1000 items):`);
console.log(`    Array.includes: ${arrayTime.toFixed(3)}ms (O(n))`);
console.log(`    Set.has: ${setTime.toFixed(3)}ms (O(1))`);

// When to use Set
// ✓ Need unique value collection
// ✓ Need frequent membership checks
// ✓ Need set operations (union, intersection, difference)

// When to use Array
// ✓ Need index access
// ✓ Need rich array methods (map, filter, reduce)
// ✓ Allow duplicate values
// ✓ Need JSON serialization

// ============================================
// 8. WeakMap and WeakSet
// ============================================

console.log("\nWeakMap and WeakSet:");

// WeakMap (ES6)
// - Keys must be objects (not primitives)
// - Weak reference: automatically GC'd when key has no other references
// - Not iterable, no size property, no clear()
const weakMap = new WeakMap();
const objKey = { id: "weak-key" };
weakMap.set(objKey, "WeakMap value");
console.log("  WeakMap.set() successful");
console.log("  WeakMap.get(objKey):", weakMap.get(objKey));

// WeakMap use case: caching metadata associated with objects
// - Does not prevent object from being GC
// - Avoids memory leaks
const cacheMap = new WeakMap();
function processData(obj) {
  if (!cacheMap.has(obj)) {
    cacheMap.set(obj, { processed: true, timestamp: Date.now() });
  }
  return cacheMap.get(obj);
}
const dataObj = { content: "data" };
console.log("  WeakMap caching example:", processData(dataObj));

// WeakSet (ES6)
// - Values must be objects
// - Weak reference: automatically GC'd when value has no other references
// - Not iterable, no size property
const weakSet = new WeakSet();
const objValue = { id: "weak-value" };
weakSet.add(objValue);
console.log("\nWeakSet.add() successful");
console.log("  WeakSet.has(objValue):", weakSet.has(objValue));

// WeakSet use case: marking objects
// - Mark processed objects
// - Mark visited DOM nodes
const visitedSet = new WeakSet();
function markVisited(element) {
  visitedSet.add(element);
}
function isVisited(element) {
  return visitedSet.has(element);
}
const element = { tag: "div", id: "test" };
markVisited(element);
console.log("  WeakSet marking example:", isVisited(element));

// WeakMap/WeakSet vs Map/Set comparison
console.log("\nWeakMap/WeakSet vs Map/Set:");
console.log("  Iterable: Map✓ Set✓ WeakMap✗ WeakSet✗");
console.log("  size property: Map✓ Set✓ WeakMap✗ WeakSet✗");
console.log("  clear(): Map✓ Set✓ WeakMap✗ WeakSet✗");
console.log(
  "  Key/Value types: any/any Map, any Set, object/symbol WeakMap, object/symbol WeakSet (ES2023+)"
);
console.log("  Weak reference: Map✗ Set✗ WeakMap✓ WeakSet✓");

// ============================================
// 9. Practical Use Cases
// ============================================

console.log("\nPractical Use Cases:");

// Use case 1: Caching (Memoization)
function createMemoizedFn(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("    [Cache hit]");
      return cache.get(key);
    }
    console.log("    [Cache miss]");
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const memoizedAdd = createMemoizedFn((a, b) => a + b);
console.log("  Caching Example:");
console.log("    memoizedAdd(2, 3):", memoizedAdd(2, 3)); // 5 (miss)
console.log("    memoizedAdd(2, 3):", memoizedAdd(2, 3)); // 5 (hit)

// Use case 2: Counting/frequency statistics
function countOccurrences(arr) {
  const counts = new Map();
  for (const item of arr) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  return counts;
}
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const fruitCounts = countOccurrences(fruits);
console.log("\nCounting Example:");
for (const [fruit, count] of fruitCounts) {
  console.log(`    ${fruit}: ${count}`);
}

// Use case 3: Associating data
const userData = new Map();
const user1 = { id: 1, name: "Alice" };
const user2 = { id: 2, name: "Bob" };
userData.set(user1, { role: "admin", permissions: ["read", "write"] });
userData.set(user2, { role: "user", permissions: ["read"] });
console.log("\nAssociating Data Example:");
console.log(`    ${user1.name} permissions:`, userData.get(user1).permissions);

// Use case 4: Array deduplication
const arrayWithDups = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const uniqueArray = [...new Set(arrayWithDups)];
console.log("\nDeduplication Example:");
console.log("  Original:", arrayWithDups);
console.log("  Deduplicated:", uniqueArray);

// Use case 5: Set operations
const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([4, 5, 6, 7, 8]);

// Union
const union = new Set([...setA, ...setB]);
console.log("\nSet Operations:");
console.log("  Union A∪B:", [...union]); // [1, 2, 3, 4, 5, 6, 7, 8]

// Intersection
const intersection = new Set([...setA].filter(x => setB.has(x)));
console.log("  Intersection A∩B:", [...intersection]); // [4, 5]

// Difference (A - B)
const difference = new Set([...setA].filter(x => !setB.has(x)));
console.log("  Difference A-B:", [...difference]); // [1, 2, 3]

// ES2025 Set Methods (Supported in modern engines)
/*
 * verification:
 *   feature: Set methods
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nES2025 Set Methods:");

// First, polyfill if not available (per MDN: coerce `other` to a Set to support set-like objects)
if (typeof Set.prototype.union !== "function") {
  Set.prototype.union = function (other) {
    other = new Set(other); // set-like or iterable
    const result = new Set(this);
    for (const item of other) result.add(item);
    return result;
  };
  Set.prototype.intersection = function (other) {
    other = new Set(other); // set-like or iterable
    const result = new Set();
    for (const item of other) if (this.has(item)) result.add(item);
    return result;
  };
  Set.prototype.difference = function (other) {
    other = new Set(other); // set-like or iterable
    const result = new Set(this);
    for (const item of other) result.delete(item);
    return result;
  };
  Set.prototype.symmetricDifference = function (other) {
    other = new Set(other); // set-like or iterable
    const result = new Set(this);
    for (const item of other) {
      if (this.has(item)) result.delete(item);
      else result.add(item);
    }
    return result;
  };
  Set.prototype.isSubsetOf = function (other) {
    other = new Set(other); // set-like or iterable
    for (const item of this) if (!other.has(item)) return false;
    return true;
  };
  Set.prototype.isSupersetOf = function (other) {
    other = new Set(other); // set-like or iterable
    for (const item of other) if (!this.has(item)) return false;
    return true;
  };
  Set.prototype.isDisjointFrom = function (other) {
    other = new Set(other); // set-like or iterable
    for (const item of this) if (other.has(item)) return false;
    return true;
  };
}

const set1 = new Set([1, 2, 3, 4, 5]);
const set2 = new Set([4, 5, 6, 7, 8]);
const set3 = new Set([1, 2]);

// union() - Returns new Set with elements from both
console.log("\n  union():", [...set1.union(set2)]); // [1, 2, 3, 4, 5, 6, 7, 8]

// intersection() - Returns new Set with elements present in both
console.log("  intersection():", [...set1.intersection(set2)]); // [4, 5]

// difference() - Returns new Set with elements from this but not other
console.log("  difference():", [...set1.difference(set2)]); // [1, 2, 3]

// symmetricDifference() - Returns new Set with elements from either but not both
console.log("  symmetricDifference():", [...set1.symmetricDifference(set2)]); // [1, 2, 3, 6, 7, 8]

// isSubsetOf() - Returns true if all elements are in other
console.log("  isSubsetOf():", set3.isSubsetOf(set1)); // true
console.log("  isSubsetOf():", set1.isSubsetOf(set2)); // false

// isSupersetOf() - Returns true if this contains all elements of other
console.log("  isSupersetOf():", set1.isSupersetOf(set3)); // true
console.log("  isSupersetOf():", set2.isSupersetOf(set1)); // false

// isDisjointFrom() - Returns true if no elements in common
const set4 = new Set([9, 10]);
console.log("  isDisjointFrom():", set1.isDisjointFrom(set4)); // true
console.log("  isDisjointFrom():", set1.isDisjointFrom(set2)); // false

// 📘 Official MDN example (Set.prototype.union):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union
// Computes the union between the set of even numbers (<10) and perfect squares (<10).
const evens = new Set([2, 4, 6, 8]);
const squares = new Set([1, 4, 9]);
console.log("  MDN union example:", evens.union(squares)); // Set(6) { 2, 4, 6, 8, 1, 9 }

// Map.groupBy() - ES2024 array grouping (similar to Object.groupBy)
/*
 * verification:
 *   feature: Map.groupBy
 *   status: ES2024
 *   stage4Date: 2023-11
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
console.log("\nMap.groupBy() - ES2024:");
const scores = [90, 85, 95, 70, 80, 65];
try {
  if (typeof Map.groupBy === "function") {
    const scoresGrouped = Map.groupBy(scores, score =>
      score >= 85 ? "A" : score >= 70 ? "B" : "C"
    );
    console.log("  Scores grouped by grade:", scoresGrouped);
  } else {
    console.log("  Map.groupBy() not available (ES2024)");
  }
} catch (e) {
  console.log("  Map.groupBy() not available in current environment");
}

// ============================================
// 10. Common Pitfalls
// ============================================

console.log("\nCommon Pitfalls:");

// Pitfall 1: Object key reference comparison
const refMap = new Map();
const keyObj = { id: 1 };
refMap.set(keyObj, "value");
console.log("  Pitfall 1 - Object key reference:");
console.log("    get({id: 1}):", refMap.get({ id: 1 })); // undefined
console.log("    get(keyObj):", refMap.get(keyObj)); // "value"

// Pitfall 2: NaN equality
const nanSet = new Set();
nanSet.add(NaN);
console.log("\n  Pitfall 2 - NaN:");
console.log("    Set.has(NaN):", nanSet.has(NaN)); // true (Set special handling)
console.log("    NaN === NaN:", NaN === NaN); // false

// Pitfall 3: Modifying during iteration
const modSet = new Set([1, 2, 3]);
console.log("\n  Pitfall 3 - Modifying during iteration:");
try {
  for (const item of modSet) {
    modSet.add(item + 10);
    if (item > 5) break; // Need termination condition
  }
  console.log("    Set after modification:", [...modSet]);
} catch (e) {
  console.log("    Error:", e.message);
}

// Pitfall 4: JSON serialization
const mapToJson = new Map([
  ["a", 1],
  ["b", 2],
]);
console.log("\n  Pitfall 4 - JSON serialization:");
console.log("    JSON.stringify(Map):", JSON.stringify(mapToJson)); // {}
console.log(
  "    Correct: JSON.stringify(Object.fromEntries(map)):",
  JSON.stringify(Object.fromEntries(mapToJson))
);

// Pitfall 5: Map key equality (SameValueZero algorithm)
// - Map uses SameValueZero for key comparison
// - Same as === except: NaN === NaN (true in Map) and 0 === -0 (true in Map)
// - Unlike Object.is: 0 and -0 are considered the same in Map
const eqMap = new Map();
eqMap.set(0, "zero");
eqMap.set(-0, "minus zero"); // Overwrites 0!
eqMap.set(NaN, "not a number");
console.log("\n  Pitfall 5 - Key equality (SameValueZero):");
console.log("    0 and -0 same in Map:", eqMap.get(0)); // "minus zero"
console.log("    NaN accessible in Map:", eqMap.get(NaN)); // "not a number"
console.log("    SameValueZero rules:");
console.log("      - Object.is(NaN, NaN) → true (Map uses)");
console.log("      - Object.is(0, -0) → false (Map treats as same!)");
console.log("      - Map uses SameValueZero = Object.is for NaN, but 0 === -0");

// ============================================
// 11. Best Practices
// ============================================

console.log("\nBest Practices:");
console.log("  1. Use Map when keys are non-strings or order matters");
console.log("  2. Use Set for uniqueness checks (faster than array.indexOf)");
console.log("  3. Prefer Object.fromEntries() to convert Map back to plain object");
console.log("  4. Use WeakMap/WeakSet for memory-safe caches and event listeners");
console.log("  5. Check Map.size/Set.size instead of .length (undefined)");
console.log("  6. Use Set for de-duplicating arrays: [...new Set(arr)]");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 08-objects.js - Objects and methods");
console.log("📘 11-json.js - JSON operations");
console.log("📘 27-memory-management.js - Memory management and WeakMap");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 10-map-set-ts-comparison.ts
*/
