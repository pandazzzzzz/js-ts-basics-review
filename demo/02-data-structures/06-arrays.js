// Arrays - Complete Demo
// 📘 For TypeScript comparison, see: 06-arrays-ts-comparison.ts
//
// 📌 NOTE: This file is the consolidated "all-in-one" version of the Arrays topic.
// It has been split into focused sub-files for easier learning. Either version
// can be studied independently; the sub-files are the recommended path:
//   06-1-arrays-basics.js        → Creation, access, type checks, destructuring
//   06-2-arrays-iteration.js     → forEach/map/filter/reduce/flat/flatMap
//   06-3-arrays-search-sort.js   → find/findIndex/includes/some/every/sort
//   06-4-arrays-manipulation.js  → push/pop/splice/slice/concat/spread
//   06-5-typed-arrays.js         → TypedArray/ArrayBuffer/DataView basics
// The sub-files have their own -ts-comparison.ts counterparts.
// 🎯 Difficulty: Beginner
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces arrays as one of the most common data structures in JavaScript.
// The sections move from creation and access to iteration and manipulation so the patterns are easier to compare.

// ============================================
// Table of Contents
// ============================================

// 1. Array Creation and Basics
// 2. Array Iteration Methods (Non-Mutating)
// 3. Array Search Methods
// 4. Array Manipulation Methods (Mutating)
// 5. Array Manipulation Methods (Non-Mutating)
// 6. Typed Arrays - Numeric Arrays with Fixed Type
// 7. Array Destructuring (ES6/ES2015)

// ============================================

// ============================================
// 1. Array Creation and Basics
// ============================================

// Array literal - Most common way to create arrays (ES1)
// - Can contain mixed types (not recommended)
// - Zero-indexed: first element is at index 0
// - Dynamic size: grows/shrinks automatically
// - typeof returns "object" (arrays are objects)
const numbers = [1, 2, 3, 4, 5];

// Array constructor (ES1)
// - Pitfall: new Array(5) creates empty array with length 5
// - Pitfall: new Array(1, 2, 3) creates [1, 2, 3]
const arrayConstructor = new Array(1, 2, 3);

// Array.of() - Create array from arguments (ES6/ES2015)
// - Fixes Array constructor pitfall
// - Array.of(5) creates [5], not empty array of length 5
const arrayOf = Array.of(5);

// Array.from() - Create array from iterable or array-like object (ES6/ES2015)
// - Converts array-like objects to arrays
// - Can take mapping function as second argument
const arrayFrom = Array.from("hello"); // ['h', 'e', 'l', 'l', 'o']

console.log("Array Creation:");
console.log("Original:", numbers);
console.log("Constructor:", arrayConstructor);
console.log("Array.of(5):", arrayOf);
console.log("Array.from('hello'):", arrayFrom);

// Array.from() with mapping function
const arrayFromMap = Array.from({ length: 5 }, (_, i) => i * 2);
console.log("Array.from with map:", arrayFromMap); // [0, 2, 4, 6, 8]

// Array.isArray() - Check if value is an array (ES5)
// - Returns true only for arrays
// - typeof check is not enough (typeof [] === "object")
console.log("\nArray.isArray() - Type checking:");
console.log("Array.isArray([1, 2, 3]):", Array.isArray([1, 2, 3])); // true
console.log("Array.isArray({ length: 3 }):", Array.isArray({ length: 3 })); // false
console.log("Array.isArray('hello'):", Array.isArray("hello")); // false
console.log("Array.isArray(null):", Array.isArray(null)); // false
console.log("typeof []:", typeof []); // "object" (not reliable!)

// ============================================
// 2. Array Iteration Methods (Non-Mutating)
// ============================================

// forEach - Execute function for each element (ES5)
// - Returns undefined (not chainable)
// - Cannot break or return early
// - Use case: side effects (logging, DOM updates)
console.log("\nforEach - Iteration:");
numbers.forEach((num, index) => {
  console.log(`  Index ${index}: ${num}`);
});

// forEach with thisArg parameter
const multiplier = { factor: 10 };
numbers.forEach(function (num) {
  console.log(`  ${num} * ${this.factor} = ${num * this.factor}`);
}, multiplier);

// map - Transform each element (ES5)
// - Returns new array with transformed elements
// - Original array unchanged
// - Use case: data transformation
const doubled = numbers.map(n => n * 2);
console.log("\nmap - Transform:");
console.log("Doubled:", doubled);

// map with index and array parameters
const withIndex = numbers.map((num, index, arr) => ({
  value: num,
  index: index,
  isLast: index === arr.length - 1,
}));
console.log("With index:", withIndex);

// filter - Select elements matching condition (ES5)
// - Returns new array with elements that pass test
// - Original array unchanged
// - Use case: data filtering, search
const evens = numbers.filter(n => n % 2 === 0);
console.log("\nfilter - Select:");
console.log("Evens:", evens);

// filter with complex conditions
const complexFilter = numbers.filter((num, index) => {
  return num > 2 && index < 4;
});
console.log("Complex filter:", complexFilter);

// reduce - Accumulate values (ES5)
// - Reduces array to single value
// - Takes accumulator and current value
// - Use case: sum, product, object building
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("\nreduce - Accumulate:");
console.log("Sum:", sum);

// reduce for more complex operations
const product = numbers.reduce((acc, n) => acc * n, 1);
console.log("Product:", product);

// reduce to build object
const numberMap = numbers.reduce((acc, num) => {
  acc[`num${num}`] = num * num;
  return acc;
}, {});
console.log("Number map:", numberMap);

// reduceRight - Reduce from right to left (ES5)
// - Same as reduce but processes from end to start
const rightReduce = [1, 2, 3, 4].reduceRight((acc, n) => acc + n, 0);
console.log("Right reduce:", rightReduce);

// ============================================
// 3. Array Search Methods
// ============================================

// find - Find first element matching condition (ES6/ES2015)
// - Returns element or undefined
// - Stops at first match
// - Use case: finding specific item
const found = numbers.find(n => n > 3);
console.log("\nfind - First match:");
console.log("First > 3:", found);

// findIndex - Find index of first match (ES6/ES2015)
// - Returns index or -1
// - Use case: locating item position
const foundIndex = numbers.findIndex(n => n > 3);
console.log("Index of first > 3:", foundIndex);

// findLast - Find last element matching condition (ES2023)
// - Returns element or undefined
// - Searches from end to start
/*
 * verification:
 *   feature: findLast
 *   status: ES2023
 *   stage4Date: 2022-06
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const findLastExample = [1, 2, 3, 4, 5, 4, 3].findLast(n => n === 4);
console.log("Last occurrence of 4:", findLastExample);

/*
 * verification:
 *   feature: findLastIndex
 *   status: ES2023
 *   stage4Date: 2022-06
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
// findLastIndex - Find index of last match (ES2023)
const findLastIndexExample = [1, 2, 3, 4, 5, 4, 3].findLastIndex(n => n === 4);
console.log("Last index of 4:", findLastIndexExample);

// some - Test if any element passes (ES5)
// - Returns boolean
// - Stops at first true
// - Use case: validation, existence check
const hasEven = numbers.some(n => n % 2 === 0);
console.log("\nsome - Any match:");
console.log("Has even:", hasEven);

// every - Test if all elements pass (ES5)
// - Returns boolean
// - Stops at first false
// - Use case: validation
const allPositive = numbers.every(n => n > 0);
console.log("\nevery - All match:");
console.log("All positive:", allPositive);

// includes - Check if value exists (ES7/ES2016)
// - Returns boolean
// - Uses SameValueZero comparison (NaN === NaN)
// - Can specify start index
const hasThree = numbers.includes(3);
console.log("\nincludes - Contains:");
console.log("Has 3:", hasThree);
console.log("Has 10:", numbers.includes(10));

// includes with fromIndex parameter
const withDuplicates = [1, 2, 3, 1, 2, 3];
console.log("\nincludes with fromIndex:");
console.log("includes(1):", withDuplicates.includes(1)); // true
console.log("includes(1, 2):", withDuplicates.includes(1, 2)); // true (search from index 2)
console.log("includes(1, 3):", withDuplicates.includes(1, 3)); // true (search from index 3)
console.log("includes(1, 4):", withDuplicates.includes(1, 4)); // false

// at() - Access elements with negative index (ES2022)
// - Returns element at given index
// - Supports negative indices (access from end)
// - Returns undefined for out of bounds
/*
 * verification:
 *   feature: at
 *   status: ES2022
 *   stage4Date: 2021-08
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const atArray = [10, 20, 30, 40, 50];
console.log("\nat() - Safe indexing:");
console.log("at(0):", atArray.at(0)); // 10
console.log("at(2):", atArray.at(2)); // 30
console.log("at(-1):", atArray.at(-1)); // 50 (last element)
console.log("at(-2):", atArray.at(-2)); // 40 (second to last)
console.log("at(99):", atArray.at(99)); // undefined
console.log("at(-99):", atArray.at(-99)); // undefined
console.log("Comparison: arr[arr.length-1] vs arr.at(-1):", [
  atArray[atArray.length - 1],
  atArray.at(-1),
]);

// indexOf - Find first index of value (ES5)
// - Returns index or -1
// - Uses strict equality (===)
// - Pitfall: cannot find NaN
const indexOfThree = numbers.indexOf(3);
console.log("\nindexOf - First index:");
console.log("Index of 3:", indexOfThree);

// lastIndexOf - Find last index of value (ES5)
// - Returns index or -1
// - Searches from end to start
const lastIndexExample = [1, 2, 3, 2, 1].lastIndexOf(2);
console.log("Last index of 2:", lastIndexExample);

// ============================================
// 4. Array Manipulation Methods (Mutating)
// ============================================

// sort - Sort array in place (ES1)
// - ⚠️ MUTATES original array
// - Default: converts to strings and sorts lexicographically
// - Pitfall: [1, 10, 2].sort() gives [1, 10, 2]
// - Use compare function for numbers
const unsorted = [3, 1, 4, 1, 5, 9, 2, 6];
console.log("\nsort - In-place sorting:");
console.log("Before sort:", [...unsorted]);

// Numeric sort ascending
const sortedAsc = [...unsorted].sort((a, b) => a - b);
console.log("Sorted ascending:", sortedAsc);

// Numeric sort descending
const sortedDesc = [...unsorted].sort((a, b) => b - a);
console.log("Sorted descending:", sortedDesc);

// Sort objects by property
const people = [
  { name: "Charlie", age: 35 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];
const sortedByAge = [...people].sort((a, b) => a.age - b.age);
console.log("Sorted by age:", sortedByAge);

// reverse - Reverse array in place (ES1)
// - ⚠️ MUTATES original array
const toReverse = [1, 2, 3, 4, 5];
console.log("\nreverse - In-place reversal:");
console.log("Before:", [...toReverse]);
const reversed = [...toReverse].reverse();
console.log("After:", reversed);

// splice - Add/remove elements (ES3)
// - ⚠️ MUTATES original array
// - Returns array of removed elements
// - splice(start, deleteCount, ...items)
const toSplice = [1, 2, 3, 4, 5];
console.log("\nsplice - Add/remove:");
console.log("Original:", [...toSplice]);

// Remove 2 elements starting at index 1
const removed = toSplice.splice(1, 2);
console.log("After splice(1, 2):", toSplice);
console.log("Removed:", removed);

// Insert elements
const toInsert = [1, 2, 5];
toInsert.splice(2, 0, 3, 4); // Insert 3, 4 at index 2
console.log("After insert:", toInsert);

// Replace elements
const toReplace = [1, 2, 3, 4, 5];
toReplace.splice(2, 2, 99, 100); // Replace 2 elements at index 2
console.log("After replace:", toReplace);

// push - Add to end (ES3)
// - ⚠️ MUTATES original array
// - Returns new length
const toPush = [1, 2, 3];
const newLength = toPush.push(4, 5);
console.log("\npush - Add to end:", toPush, "Length:", newLength);

// pop - Remove from end (ES3)
// - ⚠️ MUTATES original array
// - Returns removed element
const toPop = [1, 2, 3];
const popped = toPop.pop();
console.log("pop - Remove from end:", toPop, "Removed:", popped);

// unshift - Add to beginning (ES3)
// - ⚠️ MUTATES original array
// - Returns new length
const toUnshift = [3, 4, 5];
toUnshift.unshift(1, 2);
console.log("unshift - Add to beginning:", toUnshift);

// shift - Remove from beginning (ES3)
// - ⚠️ MUTATES original array
// - Returns removed element
const toShift = [1, 2, 3];
const shifted = toShift.shift();
console.log("shift - Remove from beginning:", toShift, "Removed:", shifted);

// fill - Fill with static value (ES6/ES2015)
// - ⚠️ MUTATES original array
// - fill(value, start, end)
const toFill = [1, 2, 3, 4, 5];
toFill.fill(0, 2, 4); // Fill with 0 from index 2 to 4
console.log("\nfill - Fill range:", toFill);

// copyWithin - Copy part of array to another location (ES6/ES2015)
// - ⚠️ MUTATES original array
// - copyWithin(target, start, end)
const toCopy = [1, 2, 3, 4, 5];
toCopy.copyWithin(0, 3, 5); // Copy elements 3-5 to position 0
console.log("copyWithin:", toCopy);

// ============================================
// 5. Array Manipulation Methods (Non-Mutating)
// ============================================

// slice - Extract portion (ES3)
// - Returns new array
// - Original unchanged
// - slice(start, end) - end not included
const toSlice = [1, 2, 3, 4, 5];
console.log("\nslice - Extract portion:");
console.log("Original:", toSlice);
console.log("slice(1, 3):", toSlice.slice(1, 3)); // [2, 3]
console.log("slice(2):", toSlice.slice(2)); // [3, 4, 5]
console.log("slice(-2):", toSlice.slice(-2)); // [4, 5]

// concat - Merge arrays (ES3)
// - Returns new array
// - Original unchanged
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];
console.log("\nconcat - Merge:");
console.log("Merged:", arr1.concat(arr2, arr3));
console.log("With values:", arr1.concat(99, arr2, 100));

// join - Create string from array (ES1)
// - Returns string
// - Original unchanged
const toJoin = ["Hello", "World", "!"];
console.log("\njoin - To string:");
console.log("With space:", toJoin.join(" "));
console.log("With comma:", toJoin.join(","));
console.log("No separator:", toJoin.join(""));

// flat - Flatten nested arrays (ES2019)
// - Returns new flattened array
// - Takes depth parameter (default 1)
const nested = [1, [2, 3], [4, [5, 6]]];
console.log("\nflat - Flatten:");
console.log("Original:", nested);
console.log("Depth 1:", nested.flat());
console.log("Depth 2:", nested.flat(2));
console.log("Infinity:", nested.flat(Infinity));

// flatMap - Map then flatten (ES2019)
// - Equivalent to map().flat()
// - More efficient than separate operations
// - Always flattens to depth 1
const toFlatMap = [1, 2, 3];
console.log("\nflatMap - Map and flatten:");
console.log("Original:", toFlatMap);
const flatMapped = toFlatMap.flatMap(n => [n, n * 2]);
console.log("FlatMapped:", flatMapped);

// with - Create copy with element replaced (ES2023)
// - Returns new array
// - Immutable alternative to bracket assignment
/*
 * verification:
 *   feature: with
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const original = [1, 2, 3, 4, 5];
const withReplaced = original.with(2, 99); // (ES2023)
console.log("\nwith - Immutable replace:");
console.log("Original:", original);
console.log("With replaced:", withReplaced);

// toReversed - Create reversed copy (ES2023)
// - Returns new array
// - Immutable alternative to reverse()
/*
 * verification:
 *   feature: toReversed
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const toReversedExample = [1, 2, 3, 4, 5];
console.log("\ntoReversed - Immutable reverse:");
console.log("Original:", toReversedExample);
console.log("Reversed:", toReversedExample.toReversed());

// toSorted - Create sorted copy (ES2023)
// - Returns new array
// - Immutable alternative to sort()
/*
 * verification:
 *   feature: toSorted
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const toSortedExample = [3, 1, 4, 1, 5];
console.log("\ntoSorted - Immutable sort:");
console.log("Original:", toSortedExample);
console.log(
  "Sorted:",
  toSortedExample.toSorted((a, b) => a - b)
);

// toSpliced - Create spliced copy (ES2023)
// - Returns new array
// - Immutable alternative to splice()
/*
 * verification:
 *   feature: toSpliced
 *   status: ES2023
 *   stage4Date: 2023-01
 *   lastVerified: 2026-09-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
const toSplicedExample = [1, 2, 3, 4, 5];
console.log("\ntoSpliced - Immutable splice:");
console.log("Original:", toSplicedExample);
console.log("Spliced:", toSplicedExample.toSpliced(2, 2, 99, 100));

// ============================================
// 6. Typed Arrays - Numeric Arrays with Fixed Type
// ============================================

// Typed Arrays - For high-performance numeric operations (ES6/ES2015)
// - Fixed element type (e.g., Int8, Float64)
// - Used for WebGL, binary data processing, audio/video
// - More memory efficient and faster than regular arrays
console.log("\nTyped Arrays:");

// Int8Array - 8-bit signed integers (-128 to 127)
const int8Array = new Int8Array([10, 20, 30]);
console.log("Int8Array:", int8Array);
console.log("Bytes per element:", int8Array.BYTES_PER_ELEMENT);

// Uint8Array - 8-bit unsigned integers (0 to 255)
const uint8Array = new Uint8Array(5); // Creates array of 5 zeros
console.log("\nUint8Array (empty, size 5):", uint8Array);
uint8Array[0] = 255; // Max value
uint8Array[1] = 300; // Wraps to 44 (overflow)
console.log("After setting 255 and 300:", uint8Array);

// Float64Array - 64-bit floating point numbers (standard JS number)
const float64Array = new Float64Array([1.1, 2.2, 3.3]);
console.log("\nFloat64Array:", float64Array);

// Creating from ArrayBuffer (shared memory)
const buffer = new ArrayBuffer(16); // 16 bytes
const view1 = new Int32Array(buffer, 0, 2); // First 8 bytes as 2 ints
const view2 = new Int8Array(buffer, 8, 8); // Next 8 bytes as 8 bytes
view1[0] = 1000;
view1[1] = 2000;
console.log("\nShared ArrayBuffer:");
console.log("Int32 view:", view1);
console.log("Int8 view:", view2);

// Common TypedArray types
console.log("\nCommon TypedArray Types:");
console.log("  Int8Array:", Int8Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Uint8Array:", Uint8Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Int16Array:", Int16Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Uint16Array:", Uint16Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Int32Array:", Int32Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Uint32Array:", Uint32Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Float32Array:", Float32Array.BYTES_PER_ELEMENT, "bytes");
console.log("  Float64Array:", Float64Array.BYTES_PER_ELEMENT, "bytes");

// TypedArray methods (similar to regular arrays)
console.log("\nTypedArray methods:");
const typedArr = new Int16Array([5, 3, 8, 1, 9, 4]);
console.log("  Original:", typedArr);
console.log("  sort:", typedArr.sort()); // Sorts in place
console.log(
  "  map:",
  typedArr.map(x => x * 2)
); // Returns same-typed TypedArray
console.log(
  "  filter:",
  typedArr.filter(x => x > 5)
); // Returns same-typed TypedArray

// ============================================
// 7. Array Destructuring (ES6/ES2015)
// ============================================

// Basic destructuring
const [first, second, ...rest] = numbers;
console.log("\nDestructuring:");
console.log({ first, second, rest });

// Skip elements
const [a, , c] = [1, 2, 3];
console.log("Skip middle:", { a, c });

// Default values
const [x = 10, y = 20] = [1];
console.log("With defaults:", { x, y });

// Nested destructuring
const nested2 = [1, [2, 3], 4];
const [n1, [n2, n3], n4] = nested2;
console.log("Nested:", { n1, n2, n3, n4 });

// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: sort() without compare function
const numberSort = [1, 10, 2, 20, 3];
console.log("\nPitfall - Default sort:");
console.log("Wrong:", [...numberSort].sort()); // [1, 10, 2, 20, 3]
console.log(
  "Correct:",
  [...numberSort].sort((a, b) => a - b)
);

// Pitfall 2: Mutating vs non-mutating methods
console.log("\nPitfall - Mutation:");
const mutatingExample = [1, 2, 3];
console.log("Before sort:", mutatingExample);
mutatingExample.sort();
console.log("After sort (mutated!):", mutatingExample);

const nonMutatingExample = [1, 2, 3];
const mapped = nonMutatingExample.map(n => n * 2);
console.log("Original (unchanged):", nonMutatingExample);
console.log("Mapped (new array):", mapped);

// Pitfall 3: indexOf cannot find NaN
console.log("\nPitfall - indexOf with NaN:");
const withNaN = [1, NaN, 3];
console.log("indexOf(NaN):", withNaN.indexOf(NaN)); // -1
console.log("includes(NaN):", withNaN.includes(NaN)); // true

// Pitfall 4: Array constructor ambiguity
console.log("\nPitfall - Array constructor:");
console.log("new Array(3):", new Array(3)); // [empty × 3]
console.log("new Array(1, 2, 3):", new Array(1, 2, 3)); // [1, 2, 3]
console.log("Array.of(3):", Array.of(3)); // [3]

// Pitfall 5: Sparse arrays
const sparse = [1, , 3]; // Note the empty slot
console.log("\nPitfall - Sparse arrays:");
console.log("Sparse:", sparse);
console.log("Length:", sparse.length); // 3
console.log("Has index 1:", 1 in sparse); // false

// Best Practice 1: Use const for arrays (prevents reassignment)
const bestPractice = [1, 2, 3];
// bestPractice = [4, 5, 6]; // Error!
bestPractice.push(4); // OK - modifying content

// Best Practice 2: Use spread for copying
const original2 = [1, 2, 3];
const copy = [...original2]; // Shallow copy
copy.push(4);
console.log("\nBest Practice - Copying:");
console.log("Original:", original2);
console.log("Copy:", copy);

// Best Practice 3: Use immutable methods when possible
const immutableExample = [1, 2, 3];
const sorted = [...immutableExample].sort(); // Copy first
console.log("Immutable approach:", { immutableExample, sorted });

// Best Practice 4: Use appropriate method for task
// - Use forEach for side effects
// - Use map for transformation
// - Use filter for selection
// - Use reduce for accumulation
// - Use find for single item
// - Use some/every for validation

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06-1-arrays-basics.js - Array basics");
console.log("📘 06-2-arrays-iteration.js - Array iteration methods");
console.log("📘 06-3-arrays-search-sort.js - Array search and sort");
console.log("📘 06-4-arrays-manipulation.js - Array manipulation methods");
console.log("📘 06-5-typed-arrays.js - Typed arrays and binary data");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06-arrays-ts-comparison.ts
*/
