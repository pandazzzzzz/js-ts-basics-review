// ES2023 Features Demo
// 📘 For TypeScript comparison, see: 39.3-es2023-features-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
// 📘 TC39: https://github.com/tc39/proposals/blob/main/finished-proposals.md
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// Master ES2023 features:
// 1. Immutable array methods (toSorted, toReversed, with, toSpliced)
// 2. findLast and findLastIndex methods
// 3. Hashbang Grammar
// 4. Symbols as WeakMap keys
// 5. Change Array by Copy proposal overview

// ============================================
// Table of Contents
// ============================================
// 1. Immutable Array Methods
// 2. findLast() and findLastIndex()
// 3. Hashbang Grammar
// 4. Symbols as WeakMap Keys
// 5. Common Pitfalls
// 6. Best Practices
// 7. Cross-references

console.log("\n=== ES2023 Features ===\n");

// ============================================
// 1. Immutable Array Methods
// ============================================
console.log("\n--- 1. Immutable Array Methods ---\n");

// ES2023 introduces new immutable array methods that return copies instead of mutating
const arr = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("Original array:", arr);

// 1.1 toSorted() - Immutable sort
const sorted = arr.toSorted();
console.log("\ntoSorted():", sorted); // [1, 1, 2, 3, 4, 5, 6, 9]
console.log("Original unchanged:", arr); // [3, 1, 4, 1, 5, 9, 2, 6]

// 📘 Official MDN example (Array.toSorted):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted
const months = ["Mar", "Jan", "Feb", "Dec"];
const sortedMonths = months.toSorted();
console.log("MDN months:", sortedMonths); // ['Dec', 'Feb', 'Jan', 'Mar']
console.log("MDN original unchanged:", months); // ['Mar', 'Jan', 'Feb', 'Dec']

const values = [1, 10, 21, 2];
const sortedValues = values.toSorted((a, b) => a - b);
console.log("MDN values:", sortedValues); // [1, 2, 10, 21]
console.log("MDN values original unchanged:", values); // [1, 10, 21, 2]

// Custom comparator
const descending = arr.toSorted((a, b) => b - a);
console.log("toSorted(descending):", descending); // [9, 6, 5, 4, 3, 2, 1, 1]

// 1.2 toReversed() - Immutable reverse
const reversed = arr.toReversed();
console.log("\ntoReversed():", reversed); // [6, 2, 9, 5, 1, 4, 1, 3]
console.log("Original unchanged:", arr);

// 1.3 with() - Immutable update at index
const updated = arr.with(2, 42); // Update index 2 to 42
console.log("\nwith(2, 42):", updated); // [3, 1, 42, 1, 5, 9, 2, 6]
console.log("Original unchanged:", arr);

// Negative indices work too
const lastUpdated = arr.with(-1, 99);
console.log("with(-1, 99):", lastUpdated); // [3, 1, 4, 1, 5, 9, 2, 99]

// 1.4 toSpliced() - Immutable splice
// Syntax: toSpliced(start, deleteCount, ...items)
const spliced = arr.toSpliced(2, 3, "a", "b"); // Start at index 2, delete 3, insert "a", "b"
console.log("\ntoSpliced(2, 3, 'a', 'b'):", spliced); // [3, 1, "a", "b", 9, 2, 6]
console.log("Original unchanged:", arr);

// Delete only (no insert)
const deleted = arr.toSpliced(2, 3);
console.log("toSpliced(2, 3):", deleted); // [3, 1, 9, 2, 6]

// Insert only (delete 0)
const inserted = arr.toSpliced(2, 0, "inserted");
console.log("toSpliced(2, 0, 'inserted'):", inserted); // [3, 1, "inserted", 4, 1, 5, 9, 2, 6]

// Comparison with mutable methods
console.log("\nMutable vs Immutable comparison:");
const mutable = [...arr];
mutable.sort(); // Mutates the array
console.log("Mutable sort:", mutable);
console.log("Immutable toSorted: returns new array, original untouched");

// ============================================
// 2. findLast() and findLastIndex()
// ============================================
console.log("\n--- 2. findLast() and findLastIndex() ---\n");

/*
 * verification:
 *   feature: Array.prototype.findLast / findLastIndex
 *   status: ES2023
 *   stage4Date: 2022-06
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2022-06/june-13.md#arrayfindlast-and-arrayfindlastindex-for-stage-4
 */

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log("Array:", numbers);

// findLast() - Find last element matching predicate
const lastEven = numbers.findLast(n => n % 2 === 0);
console.log("findLast even number:", lastEven); // 10

const lastGreaterThan5 = numbers.findLast(n => n > 5);
console.log("findLast >5:", lastGreaterThan5); // 10

// 📘 Official MDN example (Array.findLast):
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast
// Find last object in an array matching on element properties.
const inventory = [
  { name: "apples", quantity: 2 },
  { name: "bananas", quantity: 0 },
  { name: "fish", quantity: 1 },
  { name: "cherries", quantity: 5 },
];
function isNotEnough(item) {
  return item.quantity < 2;
}
console.log("MDN findLast (low stock):", inventory.findLast(isNotEnough));
// { name: "fish", quantity: 1 }

// findLastIndex() - Find index of last element matching predicate
const lastEvenIndex = numbers.findLastIndex(n => n % 2 === 0);
console.log("findLastIndex even number:", lastEvenIndex); // 9 (index of 10)
console.log("Value at that index:", numbers[lastEvenIndex]); // 10

// When no match found
const notFound = numbers.findLast(n => n > 100);
const notFoundIndex = numbers.findLastIndex(n => n > 100);
console.log("\nfindLast >100:", notFound); // undefined
console.log("findLastIndex >100:", notFoundIndex); // -1

// Compare with reverse() + find() (less efficient and mutates array if not copied)
console.log("\nComparison with reverse approach:");
const reverseFind = [...numbers].reverse().find(n => n % 2 === 0); // 10, but creates copy and reverses
console.log("reverse().find() even:", reverseFind); // 10, same result but less efficient
console.log("findLast() is O(n) same as find(), no extra copy needed");

// Use case: finding last occurrence in a list
const transactions = [
  { id: 1, type: "deposit", amount: 100 },
  { id: 2, type: "withdrawal", amount: 50 },
  { id: 3, type: "deposit", amount: 200 },
  { id: 4, type: "withdrawal", amount: 75 },
];

const lastDeposit = transactions.findLast(t => t.type === "deposit");
console.log("\nLast deposit transaction:", lastDeposit); // { id: 3, type: "deposit", amount: 200 }

// ============================================
// 3. Hashbang Grammar
// ============================================
console.log("\n--- 3. Hashbang Grammar ---\n");

/*
 * verification:
 *   feature: Hashbang Syntax
 *   status: ES2023
 *   stage4Date: 2022-07
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/notes/blob/main/meetings/2022-07/july-20.md#hashbang-grammar-for-stage-4
 */

// Hashbang (shebang) at the start of script files is now standardized
// Before ES2023, engines didn't handle this consistently
// Example script.js:
// #!/usr/bin/env node
// console.log("Hello from script");

// This can now be run directly:
// chmod +x script.js
// ./script.js

// The hashbang is treated as a comment by the JS engine
console.log("Hashbang #! at file start is now standardized for CLI scripts");
console.log("Allows direct execution of JS files on Unix-like systems");

// ============================================
// 4. Symbols as WeakMap Keys
// ============================================
console.log("\n--- 4. Symbols as WeakMap Keys ---\n");

// ES2023 allows Symbols to be used as keys in WeakMap and WeakSet
// Previously only objects were allowed

const key = Symbol("my-key");
const weakMap = new WeakMap();

// Now works in ES2023+
weakMap.set(key, "value associated with symbol");
console.log("WeakMap.get(key):", weakMap.get(key)); // "value associated with symbol"
console.log("WeakMap.has(key):", weakMap.has(key)); // true

// WeakSet also supports Symbols
const weakSet = new WeakSet();
const sym = Symbol("weak-set-key");
weakSet.add(sym);
console.log("\nWeakSet.has(sym):", weakSet.has(sym)); // true

// Why this is useful:
// 1. Symbols are unique and can't be accidentally duplicated
// 2. Perfect for metadata associated with symbols
// 3. Doesn't prevent garbage collection when symbol is no longer referenced

let ephemeralKey = Symbol("temporary");
weakMap.set(ephemeralKey, "temporary value");
console.log("\nBefore GC: weakMap.has(ephemeralKey):", weakMap.has(ephemeralKey)); // true

// If we remove the reference, the entry can be GC'd
ephemeralKey = null;
console.log("After removing reference: entry may be GC'd");

// ============================================
// 5. Common Pitfalls
// ============================================
console.log("\n--- 5. Common Pitfalls ---\n");

// Pitfall 1: Assuming toSorted() sorts numbers correctly by default
const nums = [10, 2, 1, 20];
console.log("nums.toSorted():", nums.toSorted()); // [1, 10, 2, 20] ❌ lexicographical sort
console.log(
  "nums.toSorted((a,b) => a - b):",
  nums.toSorted((a, b) => a - b)
); // [1, 2, 10, 20] ✅ numeric sort

// Pitfall 2: Forgetting that with() returns a new array
const arr1 = [1, 2, 3];
const arr2 = arr1.with(0, 99);
console.log("\narr1:", arr1); // [1,2,3] unchanged
console.log("arr2:", arr2); // [99,2,3] new array

// Pitfall 3: findLast() returns undefined when no match
const result = [1, 2, 3].findLast(n => n > 5);
console.log("\nfindLast >5:", result); // undefined (not null)
if (result === undefined) {
  console.log("No match found");
}

// Pitfall 4: Symbols in WeakMap still need to be kept as references
let mySym = Symbol("test");
const wm = new WeakMap();
wm.set(mySym, "test value");
const ref = mySym;
mySym = null; // Reference still exists in 'ref'
console.log("\nWeakMap still has value:", wm.get(ref)); // "test value"
// ref is now the only reference; when ref goes out of scope, the entry can be GC'd

// ============================================
// 6. Best Practices
// ============================================
console.log("\n--- 6. Best Practices ---\n");

console.log(
  "✅ Use immutable array methods (toSorted/toReversed/with/toSpliced) for pure functions"
);
console.log(
  "✅ Use findLast/findLastIndex instead of reversing and finding for better performance"
);
console.log("✅ Add hashbang to CLI scripts for better cross-engine compatibility");
console.log("✅ Use Symbols as WeakMap keys when you need unique, garbage-collectable keys");
console.log("⚠️  Remember that all immutable array methods return shallow copies");
console.log("⚠️  Always provide a comparator function to toSorted() for numeric arrays");
console.log("✅ Prefer these methods over mutable ones in React/Vue state updates");

// React state update example:
// const [items, setItems] = useState([3,1,2]);
// const sorted = () => setItems(prev => prev.toSorted()); // No need for spread!

// ============================================
// 7. Cross-references
// ============================================
console.log("\n--- 7. Cross-references ---\n");

console.log("📘 Array Methods: 06-arrays.js");
console.log("📘 Symbols: 19-symbol-deep.js");
console.log("📘 WeakMap/WeakSet: 10-map-set.js");
console.log("📘 Garbage Collection: 27-memory-management.js");
console.log("📘 Immutability Patterns: 24-function-patterns-advanced.js");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 39.3-es2023-features-ts-comparison.ts
*/

// == verification block ==
// feature: Symbols as WeakMap keys
// stage4Date: 2023-01
// stage4DateType: exact
// source: https://github.com/tc39/proposal-symbols-as-weakmap-keys
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: toSorted
// stage4Date: 2023-01
// stage4DateType: exact
// source: https://github.com/tc39/proposal-change-array-by-copy
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: toReversed
// stage4Date: 2023-01
// stage4DateType: exact
// source: https://github.com/tc39/proposal-change-array-by-copy
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: with
// stage4Date: 2023-01
// stage4DateType: exact
// source: https://github.com/tc39/proposal-change-array-by-copy
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: toSpliced
// stage4Date: 2023-01
// stage4DateType: exact
// source: https://github.com/tc39/proposal-change-array-by-copy
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: findLast
// stage4Date: 2022-06
// stage4DateType: exact
// source: https://github.com/tc39/proposal-array-find-from-last
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: findLastIndex
// stage4Date: 2022-06
// stage4DateType: exact
// source: https://github.com/tc39/proposal-array-find-from-last
// lastVerified: 2026-09-01
// == end verification block ==

// == verification block ==
// feature: Hashbang Syntax
// stage4Date: 2022-07
// stage4DateType: exact
// source: https://github.com/tc39/proposal-hashbang
// lastVerified: 2026-09-01
// == end verification block ==
