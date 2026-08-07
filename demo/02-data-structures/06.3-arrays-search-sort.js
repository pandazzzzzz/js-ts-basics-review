// Arrays - Search & Sort Demo
// 📘 For TypeScript comparison, see: 06.3-arrays-search-sort-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers array search and sorting methods:
// 1. Search methods (find, findIndex, includes, indexOf, some, every)
// 2. Sorting (sort with compare functions)
// 3. Immutable alternatives (toSorted, toReversed, with, toSpliced)

// ============================================
// Table of Contents
// ============================================

// 1. Array Search Methods
// 2. Array Sorting
// 3. Immutable Array Methods (ES2023)

// ============================================

const numbers = [1, 2, 3, 4, 5];

console.log("=== Arrays - Search & Sort Demo ===\n");

// ============================================
// 1. Array Search Methods
// ============================================
/**
 * Array Search - Finding elements and checking membership
 *
 * Methods by return type:
 * - Returns element: find(), findLast()
 * - Returns index: findIndex(), findLastIndex(), indexOf(), lastIndexOf()
 * - Returns boolean: includes(), some(), every()
 *
 * Key Distinction:
 * - Predicate-based: find, findIndex, some, every (take callback)
 * - Value-based: includes, indexOf, lastIndexOf (take value)
 */

console.log("=== 1. Array Search Methods ===");

// 1.1 find - Find first element matching condition (ES6/ES2015)
// - Returns element or undefined
// - Stops at first match
// - Use case: finding specific item
const found = numbers.find(n => n > 3);
console.log("find - First match:");
console.log("First > 3:", found); // 4

// find with objects
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];
const bob = people.find(p => p.name === "Bob");
console.log("find object:", bob); // { name: 'Bob', age: 30 }

// 1.2 findIndex - Find index of first match (ES6/ES2015)
// - Returns index or -1
const foundIndex = numbers.findIndex(n => n > 3);
console.log("\nfindIndex - Index of first match:");
console.log("Index of first > 3:", foundIndex); // 3

const notFoundIndex = numbers.findIndex(n => n > 100);
console.log("Index of > 100 (not found):", notFoundIndex); // -1

// 1.3 findLast / findLastIndex - Search from end (ES2023)
/*
 * verification:
 *   feature: findLast
 *   status: ES2023
 *   stage4Date: 2022-06
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const findLastExample = [1, 2, 3, 4, 5, 4, 3].findLast(n => n === 4);
console.log("\nfindLast - Last match (ES2023):");
console.log("Last occurrence of 4:", findLastExample); // 4

/*
 * verification:
 *   feature: findLastIndex
 *   status: ES2023
 *   stage4Date: 2022-06
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const findLastIndexExample = [1, 2, 3, 4, 5, 4, 3].findLastIndex(n => n === 4);
console.log("findLastIndex - Last index (ES2023):");
console.log("Last index of 4:", findLastIndexExample); // 5

// 1.4 some - Test if any element passes (ES5)
// - Returns boolean
// - Stops at first true (short-circuit)
// - Use case: existence check, validation
const hasEven = numbers.some(n => n % 2 === 0);
console.log("\nsome - Any match:");
console.log("Has even number:", hasEven); // true

const hasNegative = numbers.some(n => n < 0);
console.log("Has negative number:", hasNegative); // false

// 1.5 every - Test if all elements pass (ES5)
// - Returns boolean
// - Stops at first false (short-circuit)
const allPositive = numbers.every(n => n > 0);
console.log("\nevery - All match:");
console.log("All positive:", allPositive); // true

const allEven = numbers.every(n => n % 2 === 0);
console.log("All even:", allEven); // false

// 1.6 includes - Check if value exists (ES7/ES2016)
// - Returns boolean
// - Uses SameValueZero comparison (NaN === NaN)
// - Can specify start index with fromIndex
const hasThree = numbers.includes(3);
console.log("\nincludes - Contains:");
console.log("Has 3:", hasThree); // true
console.log("Has 10:", numbers.includes(10)); // false

// includes finds NaN (unlike indexOf!)
const withNaN = [1, NaN, 3];
console.log("includes(NaN):", withNaN.includes(NaN)); // true
console.log("indexOf(NaN):", withNaN.indexOf(NaN)); // -1

// includes with fromIndex parameter
const withDuplicates = [1, 2, 3, 1, 2, 3];
console.log("\nincludes with fromIndex:");
console.log("includes(1):", withDuplicates.includes(1)); // true
console.log("includes(1, 2):", withDuplicates.includes(1, 2)); // true (search from index 2)
console.log("includes(1, 3):", withDuplicates.includes(1, 3)); // true (search from index 3)
console.log("includes(1, 4):", withDuplicates.includes(1, 4)); // false

// 1.7 indexOf / lastIndexOf - Find index by value (ES5)
// - Uses strict equality (===)
// - Returns index or -1
const indexOfThree = numbers.indexOf(3);
console.log("\nindexOf - First index by value:");
console.log("Index of 3:", indexOfThree); // 2
console.log("Index of 10:", numbers.indexOf(10)); // -1

const lastIndexExample = [1, 2, 3, 2, 1].lastIndexOf(2);
console.log("lastIndexOf - Last index by value:");
console.log("Last index of 2:", lastIndexExample); // 3

// indexOf pitfall: cannot find NaN
console.log("\n⚠️  Pitfall - indexOf can't find NaN:");
console.log("[1, NaN, 3].indexOf(NaN):", withNaN.indexOf(NaN)); // -1
console.log("Use includes() or find() instead");

// 1.8 Search method selection guide
console.log("\n📋 Search method guide:");
console.log("  Find element by condition  → find()");
console.log("  Find index by condition    → findIndex()");
console.log("  Find last by condition     → findLast() / findLastIndex()");
console.log("  Check if value exists      → includes()");
console.log("  Find index by value        → indexOf() / lastIndexOf()");
console.log("  Check if ANY match         → some()");
console.log("  Check if ALL match         → every()");

// ============================================
// 2. Array Sorting
// ============================================
/**
 * sort - Sort array in place (ES1)
 *
 * Characteristics:
 * - ⚠️ MUTATES original array
 * - Default: converts to strings, sorts lexicographically
 * - Returns the sorted array (same reference)
 *
 * Compare function:
 * - Negative: a comes before b
 * - Zero: order unchanged (relative order NOT guaranteed pre-ES2019)
 * - Positive: b comes before a
 *
 * Common Pitfalls:
 * - Forgetting compare function for numbers
 * - Assuming stable sort (ES2019+ guarantees stability)
 * - Mutating original array accidentally
 */

console.log("\n=== 2. Array Sorting ===");

// 2.1 Default sort (string comparison) - Pitfall!
const mixedNumbers = [3, 1, 4, 1, 5, 9, 2, 6, 10, 20];
console.log("Default sort (string comparison - WRONG for numbers!):");
console.log("Original:", [...mixedNumbers]);
console.log("Sorted:", [...mixedNumbers].sort()); // [1, 10, 2, 20, 3, 4, 5, 6, 9]
console.log("⚠️  Default sort is lexicographic, NOT numeric!");

// 2.2 Numeric sort ascending
const sortedAsc = [...mixedNumbers].sort((a, b) => a - b);
console.log("\nNumeric sort ascending:");
console.log("Sorted:", sortedAsc); // [1, 2, 3, 4, 5, 6, 9, 10, 20]

// 2.3 Numeric sort descending
const sortedDesc = [...mixedNumbers].sort((a, b) => b - a);
console.log("Numeric sort descending:");
console.log("Sorted:", sortedDesc); // [20, 10, 9, 6, 5, 4, 3, 2, 1]

// 2.4 Sort objects by property
const peopleForSort = [
  { name: "Charlie", age: 35 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "alice", age: 28 }
];

// Sort by number (age)
const sortedByAge = [...peopleForSort].sort((a, b) => a.age - b.age);
console.log("\nSort objects by age:");
console.log("By age:", sortedByAge.map(p => `${p.name} (${p.age})`));

// Sort by string (name) - with localeCompare
const sortedByName = [...peopleForSort].sort((a, b) =>
  a.name.localeCompare(b.name)
);
console.log("Sort by name (localeCompare):");
console.log("By name:", sortedByName.map(p => p.name));

// Case-insensitive sort
const sortedByNameCI = [...peopleForSort].sort((a, b) =>
  a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
);
console.log("Case-insensitive sort:", sortedByNameCI.map(p => p.name));

// 2.5 Multi-key sorting
const multiSort = [...peopleForSort].sort((a, b) => {
  // First sort by age
  if (a.age !== b.age) return a.age - b.age;
  // Then by name
  return a.name.localeCompare(b.name);
});
console.log("\nMulti-key sort (age, then name):");
console.log(multiSort.map(p => `${p.name} (${p.age})`));

// 2.6 reverse - Reverse array in place (ES1)
// - ⚠️ MUTATES original array
const toReverse = [1, 2, 3, 4, 5];
console.log("\nreverse - In-place reversal:");
console.log("Before:", [...toReverse]);
const reversed = [...toReverse].reverse();
console.log("After:", reversed);

// 2.7 Stability note (ES2019+)
console.log("\n📋 Sort stability:");
console.log("  ES2019+: sort is guaranteed to be stable");
console.log("  Elements with equal compare value maintain relative order");
console.log("  Before ES2019: stability was engine-dependent");

// ============================================
// 3. Immutable Array Methods (ES2023)
// ============================================
/**
 * Immutable Array Methods - Non-mutating alternatives (ES2023)
 *
 * Mutating → Immutable:
 * - sort()    → toSorted()
 * - reverse() → toReversed()
 * - splice()  → toSpliced()
 * - arr[i] = v → with()
 *
 * All return new arrays, leaving original unchanged.
 */

console.log("\n=== 3. Immutable Array Methods (ES2023) ===");

// 3.1 toSorted - Create sorted copy (ES2023)
/*
 * verification:
 *   feature: toSorted
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const toSortedExample = [3, 1, 4, 1, 5];
const sortedCopy = toSortedExample.toSorted((a, b) => a - b);
console.log("toSorted - Immutable sort:");
console.log("Original:", toSortedExample); // [3, 1, 4, 1, 5] (unchanged!)
console.log("Sorted:", sortedCopy); // [1, 1, 3, 4, 5]

// 3.2 toReversed - Create reversed copy (ES2023)
/*
 * verification:
 *   feature: toReversed
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const toReversedExample = [1, 2, 3, 4, 5];
const reversedCopy = toReversedExample.toReversed();
console.log("\ntoReversed - Immutable reverse:");
console.log("Original:", toReversedExample); // [1, 2, 3, 4, 5] (unchanged!)
console.log("Reversed:", reversedCopy); // [5, 4, 3, 2, 1]

// 3.3 with - Create copy with element replaced (ES2023)
/*
 * verification:
 *   feature: with
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const withOriginal = [1, 2, 3, 4, 5];
const withReplaced = withOriginal.with(2, 99);
console.log("\nwith - Immutable replace:");
console.log("Original:", withOriginal); // [1, 2, 3, 4, 5] (unchanged!)
console.log("With index 2 = 99:", withReplaced); // [1, 2, 99, 4, 5]

// with supports negative indices
const withNegative = withOriginal.with(-1, 100);
console.log("With at(-1) = 100:", withNegative); // [1, 2, 3, 4, 100]

// 3.4 toSpliced - Create spliced copy (ES2023)
/*
 * verification:
 *   feature: toSpliced
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-07-31
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const toSplicedExample = [1, 2, 3, 4, 5];
const splicedCopy = toSplicedExample.toSpliced(2, 2, 99, 100);
console.log("\ntoSpliced - Immutable splice:");
console.log("Original:", toSplicedExample); // [1, 2, 3, 4, 5] (unchanged!)
console.log("Spliced (remove 2 at index 2, insert 99, 100):", splicedCopy); // [1, 2, 99, 100, 5]

// 3.5 Chaining immutable methods
const pipelineResult = [3, 1, 4, 1, 5]
  .toSorted((a, b) => a - b)
  .with(0, 0)
  .toReversed();
console.log("\nChaining immutable methods:");
console.log("Result:", pipelineResult); // [5, 4, 3, 1, 0]

// 3.6 Use cases for immutable methods
console.log("\n📋 When to use immutable methods:");
console.log("  ✅ React state updates");
console.log("  ✅ Redux/Vuex state management");
console.log("  ✅ Functional programming patterns");
console.log("  ✅ Debugging (easy to track changes)");
console.log("  ⚠️  Slight performance cost (new array allocation)");

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: sort() without compare function for numbers
console.log("\nPitfall 1 - Default sort:");
console.log("❌ Wrong: [1, 10, 2].sort() → [1, 10, 2]");
console.log("✅ Correct: [1, 10, 2].sort((a, b) => a - b) → [1, 2, 10]");

// Pitfall 2: indexOf cannot find NaN
console.log("\nPitfall 2 - indexOf with NaN:");
console.log("❌ [1, NaN, 3].indexOf(NaN) → -1");
console.log("✅ [1, NaN, 3].includes(NaN) → true");
console.log("✅ [1, NaN, 3].find(x => Number.isNaN(x)) → NaN");

// Pitfall 3: Mutating methods
console.log("\nPitfall 3 - Accidental mutation:");
const original = [3, 1, 2];
const sorted = original.sort(); // Mutates original!
console.log("Original after sort():", original); // [1, 2, 3] ❌
console.log("✅ Use toSorted() or [...arr].sort() for immutable sort");

// Pitfall 4: find returns undefined for not found
console.log("\nPitfall 4 - find returning undefined:");
const result = numbers.find(n => n > 100);
console.log("find for > 100:", result); // undefined
console.log("⚠️  Can't distinguish 'found undefined' from 'not found'");
console.log("✅ Use findIndex if you need to know if it was found");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use includes() for simple existence checks");
console.log("✅ Use find()/findIndex() for condition-based search");
console.log("✅ Use some()/every() for validation");
console.log("✅ Always provide compare function for numeric sort");
console.log("✅ Use localeCompare for string sorting");
console.log("✅ Use toSorted/toReversed/with/toSpliced for immutable updates");
console.log("✅ Use findLast/findLastIndex for searching from end (ES2023+)");
console.log("⚠️  Remember: sort() mutates the original array");
console.log("⚠️  indexOf can't find NaN - use includes or Number.isNaN with find");
console.log("⚠️  Multi-key sorting: sort by secondary key first, then primary");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌───────────────┬─────────────────┬──────────┬──────────┐
│ Method        │ Returns         │ Callback │ ES Ver   │
├───────────────┼─────────────────┼──────────┼──────────┤
│ find          │ element/undef   │ yes      │ ES6      │
│ findLast      │ element/undef   │ yes      │ ES2023   │
│ findIndex     │ number/-1       │ yes      │ ES6      │
│ findLastIndex │ number/-1       │ yes      │ ES2023   │
│ includes      │ boolean         │ no       │ ES2016   │
│ indexOf       │ number/-1       │ no       │ ES5      │
│ some          │ boolean         │ yes      │ ES5      │
│ every         │ boolean         │ yes      │ ES5      │
│ sort          │ array (mutates) │ yes      │ ES1      │
│ toSorted      │ new array       │ yes      │ ES2023   │
│ toReversed    │ new array       │ no       │ ES2023   │
│ with          │ new array       │ no       │ ES2023   │
│ toSpliced     │ new array       │ no       │ ES2023   │
└───────────────┴─────────────────┴──────────┴──────────┘
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06.1-arrays-basics.js - Array creation and basics");
console.log("📘 06.2-arrays-iteration.js - Array iteration methods");
console.log("📘 06.4-arrays-manipulation.js - Array manipulation methods");
console.log("📘 06.5-typed-arrays.js - Typed arrays");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06.3-arrays-search-sort-ts-comparison.ts
*/
