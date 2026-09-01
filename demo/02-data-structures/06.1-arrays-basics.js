// Arrays - Basics Demo
// 📘 For TypeScript comparison, see: 06.1-arrays-basics-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers array fundamentals:
// 1. Array creation methods (literals, constructor, Array.of, Array.from)
// 2. Element access and basic properties
// 3. Type checking with Array.isArray
// 4. Array destructuring (ES6)

// ============================================
// Table of Contents
// ============================================

// 1. Array Creation Methods
// 2. Array Access and Properties
// 3. Array Type Checking
// 4. Array Destructuring

// ============================================

console.log("=== Arrays - Basics Demo ===\n");

// ============================================
// 1. Array Creation Methods
// ============================================
/**
 * Array Creation - Multiple ways to create arrays in JavaScript
 *
 * Methods:
 * - Array literal: Most common and recommended (ES1)
 * - Array constructor: Has known pitfalls (ES1)
 * - Array.of(): Fixes constructor ambiguity (ES6/ES2015)
 * - Array.from(): Creates from iterables/array-like objects (ES6/ES2015)
 *
 * Key Characteristics:
 * - Zero-indexed: first element is at index 0
 * - Dynamic size: grows/shrinks automatically
 * - Can contain mixed types (not recommended)
 * - typeof returns "object" (arrays are objects)
 */

console.log("=== 1. Array Creation Methods ===");

// 1.1 Array literal - Most common way (ES1)
const numbers = [1, 2, 3, 4, 5];
console.log("Array literal:", numbers);

// Mixed types (possible but not recommended)
const mixed = [1, "hello", true, null, { key: "value" }];
console.log("Mixed types array:", mixed);

// 1.2 Array constructor (ES1)
// - Pitfall: new Array(5) creates empty array with length 5
// - Pitfall: new Array(1, 2, 3) creates [1, 2, 3]
const arrayConstructor = new Array(1, 2, 3);
console.log("\nArray constructor:");
console.log("new Array(1, 2, 3):", arrayConstructor);
console.log("new Array(5):", new Array(5)); // [empty × 5] - tricky!

// 1.3 Array.of() - Create array from arguments (ES6/ES2015)
// - Fixes Array constructor pitfall
// - Array.of(5) creates [5], not empty array of length 5
const arrayOfSingle = Array.of(5);
const arrayOfMultiple = Array.of(1, 2, 3);
console.log("\nArray.of():");
console.log("Array.of(5):", arrayOfSingle); // [5]
console.log("Array.of(1, 2, 3):", arrayOfMultiple); // [1, 2, 3]

// 1.4 Array.from() - Create from iterable or array-like (ES6/ES2015)
// - Converts array-like objects to arrays
// - Can take mapping function as second argument
const arrayFromString = Array.from("hello");
console.log("\nArray.from():");
console.log("Array.from('hello'):", arrayFromString); // ['h', 'e', 'l', 'l', 'o']

// Array.from() with mapping function
const arrayFromMap = Array.from({ length: 5 }, (_, i) => i * 2);
console.log("Array.from with map:", arrayFromMap); // [0, 2, 4, 6, 8]

// Creating from array-like objects (arguments, NodeList, etc.)
function getArgs() {
  return Array.from(arguments);
}
console.log("Array.from(arguments):", getArgs(1, 2, 3)); // [1, 2, 3]

// 1.5 Empty arrays and sparse arrays
const emptyArray = [];
const sparseArray = [1, , 3]; // Note the empty slot
console.log("\nEmpty and sparse arrays:");
console.log("Empty array length:", emptyArray.length); // 0
console.log("Sparse array:", sparseArray);
console.log("Sparse array length:", sparseArray.length); // 3
console.log("Has index 1:", 1 in sparseArray); // false

// ============================================
// 2. Array Access and Properties
// ============================================
/**
 * Array Access - Accessing elements and reading properties
 *
 * Key Properties:
 * - length: Number of elements (highest index + 1 for sparse arrays)
 * - Bracket notation: arr[index] for access
 *
 * Common Pitfalls:
 * - Negative indices don't work with bracket notation (use at() instead)
 * - Out of bounds returns undefined (no error)
 */

console.log("\n=== 2. Array Access and Properties ===");

const fruits = ["apple", "banana", "cherry", "date"];

// 2.1 Bracket notation access
console.log("Bracket access:");
console.log("fruits[0]:", fruits[0]); // 'apple'
console.log("fruits[2]:", fruits[2]); // 'cherry'
console.log("fruits[99]:", fruits[99]); // undefined (no error!)

// 2.2 length property
console.log("\nLength property:");
console.log("fruits.length:", fruits.length); // 4

// Setting length truncates or extends the array
const truncatable = [1, 2, 3, 4, 5];
truncatable.length = 3;
console.log("After setting length=3:", truncatable); // [1, 2, 3]

const extendable = [1, 2, 3];
extendable.length = 5;
console.log("After setting length=5:", extendable); // [1, 2, 3, empty × 2]

// 2.3 at() - Access with negative index (ES2022)
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
const atExample = [10, 20, 30, 40, 50];
console.log("\nat() - Safe indexing:");
console.log("at(0):", atExample.at(0)); // 10
console.log("at(2):", atExample.at(2)); // 30
console.log("at(-1):", atExample.at(-1)); // 50 (last element)
console.log("at(-2):", atExample.at(-2)); // 40 (second to last)
console.log("at(99):", atExample.at(99)); // undefined
console.log("at(-99):", atExample.at(-99)); // undefined

// Traditional way vs at()
console.log("Comparison: arr[arr.length-1] vs arr.at(-1):", [
  atExample[atExample.length - 1],
  atExample.at(-1),
]);

// ============================================
// 3. Array Type Checking
// ============================================
/**
 * Array.isArray() - Check if a value is an array (ES5)
 *
 * Why not typeof?
 * - typeof [] returns "object" (arrays are objects)
 * - Need a dedicated check for arrays
 *
 * Methods that DON'T work reliably:
 * - typeof arr === "object" (true for all objects)
 * - arr instanceof Array (fails across realms/iframes)
 * - arr.constructor === Array (fails for custom subclasses)
 */

console.log("\n=== 3. Array Type Checking ===");

console.log("Array.isArray() examples:");
console.log("Array.isArray([1, 2, 3]):", Array.isArray([1, 2, 3])); // true
console.log("Array.isArray([]):", Array.isArray([])); // true
console.log("Array.isArray({ length: 3 }):", Array.isArray({ length: 3 })); // false
console.log("Array.isArray('hello'):", Array.isArray("hello")); // false
console.log("Array.isArray(null):", Array.isArray(null)); // false
console.log("Array.isArray(undefined):", Array.isArray(undefined)); // false

// Why typeof is unreliable
console.log("\nWhy typeof doesn't work:");
console.log("typeof []:", typeof []); // "object"
console.log("typeof {}:", typeof {}); // "object"
console.log("typeof null:", typeof null); // "object" (historical bug!)

// ============================================
// 4. Array Destructuring
// ============================================
/**
 * Array Destructuring - Unpack array values into variables (ES6/ES2015)
 *
 * Features:
 * - Extract multiple values in one line
 * - Skip elements with commas
 * - Default values when element is undefined
 * - Rest pattern with ...
 * - Nested destructuring
 *
 * Use Cases:
 * - Swapping variables without temp
 * - Function parameter unpacking
 * - Returning multiple values from functions
 */

console.log("\n=== 4. Array Destructuring ===");

// 4.1 Basic destructuring
const [first, second] = numbers;
console.log("Basic destructuring:");
console.log({ first, second });

// 4.2 Rest pattern with ...
const [head, ...tail] = numbers;
console.log("\nRest pattern:");
console.log({ head, tail }); // head: 1, tail: [2, 3, 4, 5]

// 4.3 Skip elements
const [a, , c] = [1, 2, 3];
console.log("\nSkip middle element:");
console.log({ a, c }); // a: 1, c: 3

const [, , third] = ["x", "y", "z"];
console.log("Skip first two:", { third }); // third: 'z'

// 4.4 Default values
const [x = 10, y = 20] = [1];
console.log("\nDefault values:");
console.log({ x, y }); // x: 1, y: 20

// Default only applies to undefined (not null!)
const [val1 = "default", val2 = "default"] = [null, undefined];
console.log("null vs undefined:", { val1, val2 }); // val1: null, val2: 'default'

// 4.5 Nested destructuring
const nested = [1, [2, 3], 4];
const [n1, [n2, n3], n4] = nested;
console.log("\nNested destructuring:");
console.log({ n1, n2, n3, n4 }); // n1: 1, n2: 2, n3: 3, n4: 4

// 4.6 Swapping variables (classic use case)
let left = 10;
let right = 20;
console.log("\nSwapping variables:");
console.log("Before:", { left, right });
[left, right] = [right, left];
console.log("After:", { left, right });

// 4.7 Destructuring with function return values
function getMinMax(arr) {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9, 2, 6]);
console.log("\nFunction return destructuring:");
console.log({ min, max }); // min: 1, max: 9

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Array constructor ambiguity
console.log("\nPitfall 1 - Array constructor:");
console.log("new Array(3):", new Array(3)); // [empty × 3]
console.log("new Array(1, 2, 3):", new Array(1, 2, 3)); // [1, 2, 3]
console.log("✅ Use Array.of(3) instead:", Array.of(3)); // [3]

// Pitfall 2: Sparse arrays and holes
console.log("\nPitfall 2 - Sparse arrays:");
const sparse = [1, , 3];
console.log("Sparse array:", sparse);
console.log("Length:", sparse.length); // 3
console.log("sparse[1]:", sparse[1]); // undefined (but index doesn't exist!)
console.log("1 in sparse:", 1 in sparse); // false

// Pitfall 3: Negative indices with bracket notation
console.log("\nPitfall 3 - Negative indices:");
const arr = [10, 20, 30];
console.log("arr[-1]:", arr[-1]); // undefined (NOT the last element!)
console.log("arr.at(-1):", arr.at(-1)); // 30 ✅

// Pitfall 4: typeof arrays is "object"
console.log("\nPitfall 4 - typeof check:");
console.log("typeof [] === 'object':", typeof [] === "object"); // true (misleading)
console.log("✅ Use Array.isArray([]):", Array.isArray([])); // true

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Prefer array literals [] over new Array()");
console.log("✅ Use Array.of() for creating arrays from a single number");
console.log("✅ Use Array.from() for converting iterables to arrays");
console.log("✅ Use at() for negative index access (ES2022+)");
console.log("✅ Use Array.isArray() for type checking");
console.log("✅ Use destructuring to unpack array values cleanly");
console.log("✅ Use const for arrays (prevents reassignment, still allows mutation)");
console.log("⚠️  Be careful with sparse arrays (holes can cause unexpected behavior)");
console.log("⚠️  Setting length directly can truncate data unexpectedly");
console.log("⚠️  Default values in destructuring only apply to undefined, not null");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06.2-arrays-iteration.js - Array iteration methods (map, filter, reduce)");
console.log("📘 06.3-arrays-search-sort.js - Search and sort methods");
console.log("📘 06.4-arrays-manipulation.js - Array manipulation methods");
console.log("📘 06.5-typed-arrays.js - Typed arrays and ArrayBuffer");
console.log("📘 09-destructuring.js - Full destructuring guide (objects + arrays)");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06.1-arrays-basics-ts-comparison.ts
*/
