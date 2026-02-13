// Arrays Demo
// 📘 For TypeScript comparison, see TypeScript notes at the end

// ============================================
// Array Creation and Basics
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

// Array.from() - Create array from iterable (ES6/ES2015)
// - Converts array-like objects to arrays
// - Can take mapping function as second argument
const arrayFrom = Array.from("hello"); // ['h', 'e', 'l', 'l', 'o']

console.log("Array Creation:");
console.log("Original:", numbers);
console.log("Constructor:", arrayConstructor);
console.log("Array.of(5):", arrayOf);
console.log("Array.from('hello'):", arrayFrom);

// ============================================
// Array Iteration Methods (Non-Mutating)
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
numbers.forEach(function(num) {
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
  isLast: index === arr.length - 1
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
// Array Search Methods
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
const findLastExample = [1, 2, 3, 4, 5, 4, 3].findLast(n => n === 4);
console.log("Last occurrence of 4:", findLastExample);

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
// Array Manipulation Methods (Mutating)
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
  { name: "Bob", age: 30 }
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
// Array Manipulation Methods (Non-Mutating)
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
const original = [1, 2, 3, 4, 5];
const withReplaced = original.with(2, 99);
console.log("\nwith - Immutable replace:");
console.log("Original:", original);
console.log("With replaced:", withReplaced);

// toReversed - Create reversed copy (ES2023)
// - Returns new array
// - Immutable alternative to reverse()
const toReversedExample = [1, 2, 3, 4, 5];
console.log("\ntoReversed - Immutable reverse:");
console.log("Original:", toReversedExample);
console.log("Reversed:", toReversedExample.toReversed());

// toSorted - Create sorted copy (ES2023)
// - Returns new array
// - Immutable alternative to sort()
const toSortedExample = [3, 1, 4, 1, 5];
console.log("\ntoSorted - Immutable sort:");
console.log("Original:", toSortedExample);
console.log("Sorted:", toSortedExample.toSorted((a, b) => a - b));

// toSpliced - Create spliced copy (ES2023)
// - Returns new array
// - Immutable alternative to splice()
const toSplicedExample = [1, 2, 3, 4, 5];
console.log("\ntoSpliced - Immutable splice:");
console.log("Original:", toSplicedExample);
console.log("Spliced:", toSplicedExample.toSpliced(2, 2, 99, 100));

// ============================================
// Array Destructuring (ES6/ES2015)
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
console.log("Correct:", [...numberSort].sort((a, b) => a - b));

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
// TypeScript Comparison & Common Pitfalls
// ============================================
/*
🔍 TYPESCRIPT VS JAVASCRIPT - KEY DIFFERENCES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. TYPE ANNOTATIONS & INFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const numbers = [1, 2, 3];           // No type checking
  numbers.push("four");                // ✅ Allowed (runtime error risk)

TypeScript:
  const numbers: number[] = [1, 2, 3]; // Explicit type
  numbers.push("four");                // ❌ Error: Argument of type 'string' is not assignable

  // Alternative syntax (equivalent):
  const numbers: Array<number> = [1, 2, 3];

  // Type inference (recommended):
  const numbers = [1, 2, 3];           // Inferred as number[]
  numbers.push(4);                     // ✅ OK
  numbers.push("four");                // ❌ Error

⚠️ PITFALL: Mixed type arrays
  JS:  const mixed = [1, "two", true];     // ✅ Allowed
  TS:  const mixed = [1, "two", true];     // Inferred as (number | string | boolean)[]
  TS:  mixed.push(null);                   // ❌ Error: null not in union type

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. READONLY ARRAYS - IMMUTABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const numbers = [1, 2, 3];
  numbers.push(4);                     // ✅ Allowed (const only prevents reassignment)
  numbers[0] = 99;                     // ✅ Allowed

TypeScript:
  const numbers: readonly number[] = [1, 2, 3];
  numbers.push(4);                     // ❌ Error: Property 'push' does not exist
  numbers[0] = 99;                     // ❌ Error: Index signature is readonly

  // Alternative syntax:
  const numbers: ReadonlyArray<number> = [1, 2, 3];

⚠️ PITFALL: readonly is shallow
  const nested: readonly number[][] = [[1, 2], [3, 4]];
  nested.push([5, 6]);                 // ❌ Error: Cannot push
  nested[0].push(99);                  // ✅ Allowed! Inner array is mutable

  // Solution: Deep readonly
  const nested: readonly (readonly number[])[] = [[1, 2], [3, 4]];
  nested[0].push(99);                  // ❌ Error: Now inner arrays are readonly too

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. TUPLE TYPES - FIXED LENGTH & TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const pair = [1, "hello"];           // Just an array
  pair.push(true);                     // ✅ Allowed
  const [num, str] = pair;             // No type checking

TypeScript:
  const pair: [number, string] = [1, "hello"];
  pair.push(true);                     // ⚠️ Allowed! (TypeScript limitation)
  const [num, str] = pair;             // num: number, str: string

  // Readonly tuple (prevents push):
  const pair: readonly [number, string] = [1, "hello"];
  pair.push(true);                     // ❌ Error: Property 'push' does not exist

⚠️ PITFALL: Tuple length not enforced with push/pop
  const tuple: [number, string] = [1, "hello"];
  tuple.push(999);                     // ✅ Allowed (TypeScript bug/limitation)
  console.log(tuple);                  // [1, "hello", 999] - breaks tuple contract!

  // Solution: Use readonly tuples or avoid mutation
  const tuple: readonly [number, string] = [1, "hello"];

⚠️ PITFALL: Optional tuple elements
  type Point = [number, number, number?]; // z is optional
  const point2D: Point = [1, 2];       // ✅ OK
  const point3D: Point = [1, 2, 3];    // ✅ OK
  const [x, y, z] = point2D;           // z: number | undefined

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. ARRAY METHOD TYPE SAFETY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

map() - Type transformation:
  JS:  const numbers = [1, 2, 3];
       const strings = numbers.map(n => n.toString());

  TS:  const numbers: number[] = [1, 2, 3];
       const strings = numbers.map(n => n.toString()); // Inferred as string[]
       const wrong = numbers.map(n => n.toUpperCase()); // ❌ Error

filter() - Type narrowing:
  JS:  const mixed = [1, "two", 3, "four"];
       const numbers = mixed.filter(x => typeof x === "number");

  TS:  const mixed: (number | string)[] = [1, "two", 3, "four"];
       const numbers = mixed.filter(x => typeof x === "number"); // Still (number | string)[]
       
       // Type guard needed:
       const numbers = mixed.filter((x): x is number => typeof x === "number"); // number[]

⚠️ PITFALL: filter() doesn't narrow types automatically
  const mixed: (number | string)[] = [1, "two", 3];
  const numbers = mixed.filter(x => typeof x === "number");
  numbers[0].toFixed(2);               // ❌ Error: toFixed may not exist
  
  // Solution: Use type predicate
  const isNumber = (x: any): x is number => typeof x === "number";
  const numbers = mixed.filter(isNumber); // Now number[]
  numbers[0].toFixed(2);               // ✅ OK

reduce() - Accumulator type inference:
  TS:  const numbers = [1, 2, 3];
       const sum = numbers.reduce((acc, n) => acc + n, 0); // number
       const obj = numbers.reduce((acc, n) => {
         acc[n] = n * 2;
         return acc;
       }, {} as Record<number, number>); // Need type assertion for empty object

find() - Returns T | undefined:
  TS:  const numbers: number[] = [1, 2, 3];
       const found = numbers.find(n => n > 2); // number | undefined
       found.toFixed(2);                // ❌ Error: Object is possibly undefined
       found?.toFixed(2);               // ✅ OK: Optional chaining
       
       if (found !== undefined) {
         found.toFixed(2);              // ✅ OK: Type narrowed to number
       }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. COMMON CONFUSION POINTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ Array<T> vs T[] - They're equivalent!
  type Numbers1 = Array<number>;       // Same as...
  type Numbers2 = number[];            // ...this
  
  // Preference: Use T[] for simple types, Array<T> for complex types
  const simple: number[] = [1, 2, 3];
  const complex: Array<Promise<string>> = [Promise.resolve("hello")];

⚠️ Empty array initialization
  JS:  const arr = [];                 // No type info
       arr.push(1);                    // ✅ OK
       arr.push("two");                // ✅ OK

  TS:  const arr = [];                 // Inferred as any[]
       arr.push(1);                    // ✅ OK
       arr.push("two");                // ✅ OK (any allows anything)

       // Better: Specify type
       const arr: number[] = [];
       arr.push(1);                    // ✅ OK
       arr.push("two");                // ❌ Error

⚠️ Array destructuring with rest
  TS:  const [first, ...rest]: [number, ...number[]] = [1, 2, 3, 4];
       // first: number, rest: number[]

       const [a, b, ...c]: [string, string, ...boolean[]] = ["x", "y", true, false];
       // a: string, b: string, c: boolean[]

⚠️ Const assertions for literal types
  JS:  const arr = [1, 2, 3];          // Mutable array

  TS:  const arr = [1, 2, 3];          // number[]
       const arr = [1, 2, 3] as const; // readonly [1, 2, 3] (literal types!)
       
       arr[0] = 99;                    // ❌ Error: Cannot assign to readonly
       type First = typeof arr[0];     // 1 (literal type, not number)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. ADVANCED TYPESCRIPT PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Non-empty arrays:
  type NonEmptyArray<T> = [T, ...T[]];
  
  const valid: NonEmptyArray<number> = [1, 2, 3]; // ✅ OK
  const invalid: NonEmptyArray<number> = [];      // ❌ Error: Source has 0 elements

Array length constraints:
  type Pair<T> = [T, T];
  type Triple<T> = [T, T, T];
  
  const pair: Pair<number> = [1, 2];   // ✅ OK
  const triple: Triple<string> = ["a", "b", "c"]; // ✅ OK

Variadic tuple types:
  type Concat<T extends any[], U extends any[]> = [...T, ...U];
  
  type Result = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
7. MIGRATION TIPS: JS → TS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Add basic type annotations
  // Before (JS)
  const numbers = [1, 2, 3];
  
  // After (TS)
  const numbers: number[] = [1, 2, 3];

Step 2: Use type inference where possible
  // Verbose
  const doubled: number[] = numbers.map((n: number): number => n * 2);
  
  // Better (inference works)
  const doubled = numbers.map(n => n * 2); // Inferred as number[]

Step 3: Add readonly for immutable data
  // Before
  const config = [1, 2, 3];
  
  // After
  const config: readonly number[] = [1, 2, 3];

Step 4: Use tuples for fixed structures
  // Before
  const point = [10, 20];
  
  // After
  const point: [number, number] = [10, 20];

Step 5: Add type guards for filtering
  // Before
  const numbers = mixed.filter(x => typeof x === "number");
  
  // After
  const numbers = mixed.filter((x): x is number => typeof x === "number");

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
8. PERFORMANCE CONSIDERATIONS (SAME IN JS & TS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript types are erased at runtime - no performance impact!

However, type safety can prevent runtime errors:
  // JS: Runtime error
  const numbers = [1, 2, 3];
  numbers.push("four");
  const sum = numbers.reduce((a, b) => a + b, 0); // NaN (1 + 2 + 3 + "four")

  // TS: Compile-time error (prevents runtime issue)
  const numbers: number[] = [1, 2, 3];
  numbers.push("four");                // ❌ Error caught at compile time!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 SUMMARY: TYPESCRIPT BENEFITS FOR ARRAYS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Compile-time type safety
✅ Better IDE autocomplete and refactoring
✅ Prevents common runtime errors
✅ Self-documenting code
✅ Easier to maintain large codebases
✅ No runtime performance cost

⚠️ Learning curve for advanced types
⚠️ Requires build step
⚠️ Some edge cases (tuple push, etc.)

🎯 RECOMMENDATION: Use TypeScript for production code, especially in teams!
*/
