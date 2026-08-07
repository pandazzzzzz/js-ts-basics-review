// Arrays - Iteration Methods Demo
// 📘 For TypeScript comparison, see: 06.2-arrays-iteration-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers non-mutating array iteration methods:
// 1. forEach - Side-effect iteration
// 2. map - Element transformation
// 3. filter - Element selection
// 4. reduce / reduceRight - Accumulation
// 5. flat / flatMap - Flattening arrays

// ============================================
// Table of Contents
// ============================================

// 1. forEach - Iteration with Side Effects
// 2. map - Transform Each Element
// 3. filter - Select Matching Elements
// 4. reduce / reduceRight - Accumulate Values
// 5. flat / flatMap - Flatten Nested Arrays

// ============================================

const numbers = [1, 2, 3, 4, 5];

console.log("=== Arrays - Iteration Methods Demo ===\n");

// ============================================
// 1. forEach - Iteration with Side Effects
// ============================================
/**
 * forEach - Execute a function for each element (ES5)
 *
 * Characteristics:
 * - Returns undefined (not chainable)
 * - Cannot break or return early
 * - Takes callback with (element, index, array)
 * - Optional thisArg parameter
 *
 * Use Cases:
 * - Side effects (logging, DOM updates)
 * - When you don't need a return value
 *
 * Common Pitfalls:
 * - Cannot break early (use for...of or some() instead)
 * - Skips empty slots in sparse arrays
 * - Not await-friendly (use for...of with async)
 */

console.log("=== 1. forEach Demo ===");

// 1.1 Basic forEach
console.log("Basic forEach:");
numbers.forEach((num, index) => {
  console.log(`  Index ${index}: ${num}`);
});

// 1.2 forEach with thisArg parameter
const multiplier = { factor: 10 };
console.log("\nforEach with thisArg:");
numbers.forEach(function(num) {
  console.log(`  ${num} * ${this.factor} = ${num * this.factor}`);
}, multiplier);

// 1.3 forEach skips empty slots (sparse arrays)
const sparse = [1, , 3, , 5];
console.log("\nforEach with sparse array:");
console.log("Sparse array:", sparse);
console.log("Length:", sparse.length);
let count = 0;
sparse.forEach(() => count++);
console.log("forEach iterations:", count); // 3 (skips empty slots!)

// 1.4 When NOT to use forEach
console.log("\n⚠️  forEach limitations:");
console.log("- Cannot break early (use for...of or some())");
console.log("- Cannot return values (use map/filter/reduce)");
console.log("- Not async-friendly (use for...of with await)");

// ============================================
// 2. map - Transform Each Element
// ============================================
/**
 * map - Transform each element into a new array (ES5)
 *
 * Characteristics:
 * - Returns new array with same length
 * - Original array unchanged
 * - Callback: (element, index, array) => newElement
 *
 * Use Cases:
 * - Data transformation
 * - Extracting properties from objects
 * - Converting data formats
 *
 * Common Pitfalls:
 * - Using map when you don't use the returned array (use forEach)
 * - Forgetting to return a value from the callback
 */

console.log("\n=== 2. map Demo ===");

// 2.1 Basic map
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// 2.2 map with index and array parameters
const withIndex = numbers.map((num, index, arr) => ({
  value: num,
  index: index,
  isFirst: index === 0,
  isLast: index === arr.length - 1
}));
console.log("With index metadata:", withIndex);

// 2.3 Extracting properties from objects
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 }
];
const names = people.map(p => p.name);
console.log("Names extracted:", names); // ['Alice', 'Bob', 'Charlie']

// 2.4 Chaining map with other methods
const result = numbers
  .map(n => n * 2)
  .map(n => n + 1);
console.log("Chained map (double then add 1):", result);

// 2.5 Common pitfall: map with parseInt
// parseInt takes (string, radix) - map passes (element, index)
const strings = ["10", "20", "30"];
const wrongNumbers = strings.map(parseInt);
console.log("\n⚠️  Pitfall - map + parseInt:");
console.log("Wrong (parseInt as direct callback):", wrongNumbers); // [10, NaN, NaN]
const correctNumbers = strings.map(s => parseInt(s, 10));
console.log("Correct (wrap in function):", correctNumbers); // [10, 20, 30]

// ============================================
// 3. filter - Select Matching Elements
// ============================================
/**
 * filter - Select elements that pass a test (ES5)
 *
 * Characteristics:
 * - Returns new array (possibly empty)
 * - Original array unchanged
 * - Callback returns boolean (truthy/falsy)
 *
 * Use Cases:
 * - Data filtering
 * - Search and selection
 * - Removing unwanted elements
 *
 * Common Pitfalls:
 * - Confusing with find() (filter returns array, find returns element)
 * - Expecting mutation (it returns new array)
 */

console.log("\n=== 3. filter Demo ===");

// 3.1 Basic filter
const evens = numbers.filter(n => n % 2 === 0);
const odds = numbers.filter(n => n % 2 !== 0);
console.log("Evens:", evens);
console.log("Odds:", odds);

// 3.2 Filter with complex conditions
const complexFilter = numbers.filter((num, index) => {
  return num > 2 && index < 4;
});
console.log("Complex filter (num > 2 && index < 4):", complexFilter); // [3, 4]

// 3.3 Filtering objects
const adults = people.filter(p => p.age >= 30);
console.log("Adults (age >= 30):", adults);

// 3.4 Removing falsy values
const withFalsy = [0, 1, "", "hello", false, true, null, undefined, NaN];
const truthyOnly = withFalsy.filter(Boolean);
console.log("Truthy values only:", truthyOnly); // [1, 'hello', true]

// 3.5 Chaining filter + map
const doubledEvens = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2);
console.log("Filter then map (doubled evens):", doubledEvens);

// 3.6 Finding unique values
const duplicates = [1, 2, 2, 3, 3, 3, 4, 5, 5];
const unique = duplicates.filter((val, index, arr) => arr.indexOf(val) === index);
console.log("Unique values:", unique); // [1, 2, 3, 4, 5]
// Note: Set is more efficient for this: [...new Set(duplicates)]

// ============================================
// 4. reduce / reduceRight - Accumulate Values
// ============================================
/**
 * reduce - Reduce array to a single value (ES5)
 *
 * Characteristics:
 * - Most powerful array method (can implement map, filter, etc.)
 * - Takes accumulator and current value
 * - Optional initial value (highly recommended!)
 *
 * Callback signature: (accumulator, currentValue, index, array) => nextAccumulator
 *
 * Use Cases:
 * - Sum, product, average
 * - Building objects from arrays
 * - Flattening arrays
 * - Grouping data
 *
 * Common Pitfalls:
 * - Forgetting initial value (first element becomes accumulator)
 * - Not returning from the callback
 * - Overusing when simpler method exists
 */

console.log("\n=== 4. reduce Demo ===");

// 4.1 Sum with reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum); // 15

// 4.2 Product with reduce
const product = numbers.reduce((acc, n) => acc * n, 1);
console.log("Product:", product); // 120

// 4.3 Finding max/min
const maxVal = numbers.reduce((max, n) => Math.max(max, n), -Infinity);
console.log("Max value:", maxVal); // 5
// Note: Math.max(...numbers) is simpler for this case

// 4.4 Building an object from array
const numberMap = numbers.reduce((acc, num) => {
  acc[`num${num}`] = num * num;
  return acc;
}, {});
console.log("Object built from array:", numberMap);

// 4.5 Grouping by property
const items = [
  { type: "fruit", name: "apple" },
  { type: "vegetable", name: "carrot" },
  { type: "fruit", name: "banana" },
  { type: "vegetable", name: "broccoli" },
  { type: "fruit", name: "orange" }
];

const groupedByType = items.reduce((acc, item) => {
  if (!acc[item.type]) {
    acc[item.type] = [];
  }
  acc[item.type].push(item.name);
  return acc;
}, {});
console.log("Grouped by type:", groupedByType);

// 4.6 Counting occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const fruitCount = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log("Fruit count:", fruitCount);

// 4.7 reduceRight - Reduce from right to left (ES5)
const rightReduce = [1, 2, 3, 4].reduceRight((acc, n) => acc + n, 0);
console.log("\nreduceRight (sum from right):", rightReduce); // 10

// Difference matters when order matters
const rightConcat = ["a", "b", "c"].reduceRight((acc, s) => acc + s, "");
console.log("reduceRight concat:", rightConcat); // "cba"

// 4.8 Average calculation
const average = numbers.reduce((acc, n, index, arr) => {
  acc += n;
  if (index === arr.length - 1) {
    return acc / arr.length;
  }
  return acc;
}, 0);
console.log("Average:", average); // 3

// ============================================
// 5. flat / flatMap - Flatten Nested Arrays
// ============================================
/**
 * flat - Flatten nested arrays (ES2019)
 *
 * Characteristics:
 * - Takes optional depth parameter (default 1)
 * - Removes empty slots (flattens sparse arrays)
 * - Returns new flattened array
 *
 * flatMap - Map then flatten (ES2019)
 * - Equivalent to map().flat(1)
 * - More efficient than separate operations
 * - Always flattens to depth 1
 *
 * Common Pitfalls:
 * - flat() without depth only flattens one level
 * - flatMap only flattens depth 1
 */

console.log("\n=== 5. flat / flatMap Demo ===");

// 5.1 flat - basic flattening
const nested = [1, [2, 3], [4, [5, 6]]];
console.log("Nested array:", nested);
console.log("flat() depth 1:", nested.flat()); // [1, 2, 3, 4, [5, 6]]
console.log("flat(2) depth 2:", nested.flat(2)); // [1, 2, 3, 4, 5, 6]
console.log("flat(Infinity) fully flat:", nested.flat(Infinity)); // [1, 2, 3, 4, 5, 6]

// 5.2 flat removes empty slots
const sparseNested = [1, , [2, , 3], 4];
console.log("\nflat removes holes:");
console.log("Original sparse:", sparseNested);
console.log("After flat():", sparseNested.flat()); // [1, 2, 3, 4]

// 5.3 flatMap - Map then flatten
const words = ["hello world", "good morning", "nice day"];
console.log("\nflatMap:");
console.log("Original phrases:", words);

// Map gives nested array, flatMap flattens
const allWords = words.flatMap(phrase => phrase.split(" "));
console.log("All words (flatMap):", allWords);
// Equivalent to: words.map(phrase => phrase.split(" ")).flat()

// 5.4 flatMap for filtering + transforming
// Return [] to remove element, [value] to include
const filteredTransformed = numbers.flatMap(n => {
  if (n % 2 === 0) return [n * 10]; // Include (wrapped in array)
  return []; // Exclude
});
console.log("flatMap for filter+transform:", filteredTransformed); // [20, 40]

// 5.5 flatMap vs map + flat performance
// flatMap is more efficient because it's a single pass
const bigArray = Array.from({ length: 1000 }, (_, i) => i);
console.log("\nPerformance note: flatMap is more efficient than map().flat()");
console.log("(single pass instead of two passes)");

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Using map without using the return value
console.log("\nPitfall 1 - map for side effects:");
console.log("❌ Bad: Use map when you don't need the result (wastes memory)");
console.log("✅ Good: Use forEach for side effects");

// Pitfall 2: reduce without initial value
console.log("\nPitfall 2 - reduce without initial value:");
const singleElement = [42];
const noInitial = singleElement.reduce((acc, n) => acc + n);
console.log("Single element, no initial:", noInitial); // 42 (callback never called!)
console.log("✅ Good: Always provide an initial value");

// Pitfall 3: parseInt with map
console.log("\nPitfall 3 - parseInt with map:");
console.log("❌ ['1','2','3'].map(parseInt) gives [1, NaN, NaN]");
console.log("✅ ['1','2','3'].map(s => parseInt(s, 10)) gives [1, 2, 3]");

// Pitfall 4: Overusing reduce
console.log("\nPitfall 4 - Overusing reduce:");
console.log("❌ Bad: Using reduce when filter/map is clearer");
console.log("✅ Good: Use the simplest method for the job");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use forEach for side effects (logging, DOM)");
console.log("✅ Use map for one-to-one transformation");
console.log("✅ Use filter for selecting elements");
console.log("✅ Use reduce for accumulation and complex aggregations");
console.log("✅ Always provide an initial value to reduce");
console.log("✅ Use flatMap for map + flat(1) operations");
console.log("✅ Chain methods for readable data pipelines");
console.log("✅ Use the simplest method for the job");
console.log("⚠️  Don't use map when you don't use the return value");
console.log("⚠️  Be careful with parseInt as a direct map callback");
console.log("⚠️  forEach cannot break early - use for...of or some()");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────┬───────────────────────┬───────────┐
│ Method      │ Purpose               │ Returns   │
├─────────────┼───────────────────────┼───────────┤
│ forEach     │ Side effects          │ undefined │
│ map         │ Transform each item   │ new array │
│ filter      │ Select matching items │ new array │
│ reduce      │ Accumulate to one     │ any value │
│ flat        │ Flatten nested arrays │ new array │
│ flatMap     │ Map then flat(1)      │ new array │
└─────────────┴───────────────────────┴───────────┘

All methods are NON-MUTATING - original array stays the same.
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06.1-arrays-basics.js - Array creation and basics");
console.log("📘 06.3-arrays-search-sort.js - Search and sort methods");
console.log("📘 06.4-arrays-manipulation.js - Array manipulation methods");
console.log("📘 24.1-function-composition.js - Function composition patterns");
console.log("📘 09-destructuring.js - Destructuring patterns");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06.2-arrays-iteration-ts-comparison.ts
*/
