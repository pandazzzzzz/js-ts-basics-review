// Arrays - Manipulation Demo
// 📘 For TypeScript comparison, see: 06-4-arrays-manipulation-ts-comparison.ts

// 🎯 Difficulty: Beginner
export {};

// ============================================
// Learning goals
// ============================================
// This file covers array manipulation methods:
// 1. Mutating methods (push/pop/unshift/shift/splice/fill/copyWithin)
// 2. Non-mutating methods (slice/concat/join)
// 3. Common pitfalls and best practices

// ============================================
// Table of Contents
// ============================================

// 1. Mutating Methods - Adding and Removing Elements
// 2. Mutating Methods - Splice, Fill, CopyWithin
// 3. Non-Mutating Methods - Slice, Concat, Join
// 4. Array Spreading and Rest

// ============================================

console.log("=== Arrays - Manipulation Demo ===\n");

// ============================================
// 1. Mutating Methods - Adding and Removing Elements
// ============================================
/**
 * Stack/Queue Operations - Add and remove from ends
 *
 * ⚠️ All methods in this section MUTATE the original array!
 *
 * Methods:
 * - push:    Add to end       → returns new length
 * - pop:     Remove from end  → returns removed element
 * - unshift: Add to beginning → returns new length
 * - shift:   Remove from start→ returns removed element
 *
 * Performance:
 * - push/pop: O(1) - fast (operate on end)
 * - unshift/shift: O(n) - slow (reindex all elements)
 */

console.log("=== 1. Stack/Queue Operations (Mutating) ===");

// 1.1 push - Add to end (ES3)
// - Returns new length
const pushArr = [1, 2, 3];
const newLength = pushArr.push(4, 5);
console.log("push - Add to end:");
console.log("Array:", pushArr); // [1, 2, 3, 4, 5]
console.log("Returned length:", newLength); // 5

// 1.2 pop - Remove from end (ES3)
// - Returns removed element
// - Returns undefined if array is empty
const popArr = [1, 2, 3];
const popped = popArr.pop();
console.log("\npop - Remove from end:");
console.log("Array:", popArr); // [1, 2]
console.log("Removed element:", popped); // 3

// Empty array pop
const emptyPop = [];
console.log("pop on empty:", emptyPop.pop()); // undefined

// 1.3 unshift - Add to beginning (ES3)
// - Returns new length
// - O(n) operation (all elements reindexed)
const unshiftArr = [3, 4, 5];
const unshiftLen = unshiftArr.unshift(1, 2);
console.log("\nunshift - Add to beginning:");
console.log("Array:", unshiftArr); // [1, 2, 3, 4, 5]
console.log("Returned length:", unshiftLen); // 5

// 1.4 shift - Remove from beginning (ES3)
// - Returns removed element
// - O(n) operation
const shiftArr = [1, 2, 3];
const shifted = shiftArr.shift();
console.log("\nshift - Remove from beginning:");
console.log("Array:", shiftArr); // [2, 3]
console.log("Removed element:", shifted); // 1

// 1.5 Stack pattern (LIFO - Last In First Out)
console.log("\n📋 Stack pattern (LIFO):");
const stack = [];
stack.push("first");
stack.push("second");
stack.push("third");
console.log("Stack after pushes:", stack);
console.log("Pop:", stack.pop()); // 'third'
console.log("Pop:", stack.pop()); // 'second'
console.log("Stack after pops:", stack);

// 1.6 Queue pattern (FIFO - First In First Out)
console.log("\n📋 Queue pattern (FIFO):");
const queue = [];
queue.push("first");
queue.push("second");
queue.push("third");
console.log("Queue after pushes:", queue);
console.log("Shift:", queue.shift()); // 'first'
console.log("Shift:", queue.shift()); // 'second'
console.log("Queue after shifts:", queue);
console.log("⚠️  Note: shift() is O(n) - use Deque for large queues");

// ============================================
// 2. Mutating Methods - Splice, Fill, CopyWithin
// ============================================
/**
 * Advanced Mutating Methods
 *
 * splice: Add/remove/replace elements at any position (ES3)
 * fill: Fill range with static value (ES6)
 * copyWithin: Copy section within array (ES6)
 *
 * All mutate the original array.
 */

console.log("\n=== 2. Advanced Mutating Methods ===");

// 2.1 splice - Add/remove/replace elements (ES3)
// - splice(start, deleteCount, ...itemsToAdd)
// - Returns array of removed elements
// - Very versatile but mutates
const spliceArr = [1, 2, 3, 4, 5];
console.log("splice operations:");
console.log("Original:", [...spliceArr]);

// Remove elements
const removed = spliceArr.splice(1, 2);
console.log("After splice(1, 2) - remove 2 at index 1:");
console.log("  Array:", spliceArr); // [1, 4, 5]
console.log("  Removed:", removed); // [2, 3]

// Insert elements (deleteCount = 0)
const insertArr = [1, 2, 5];
insertArr.splice(2, 0, 3, 4);
console.log("\nInsert with splice(2, 0, 3, 4):");
console.log("  Array:", insertArr); // [1, 2, 3, 4, 5]

// Replace elements
const replaceArr = [1, 2, 3, 4, 5];
replaceArr.splice(2, 2, 99, 100);
console.log("\nReplace with splice(2, 2, 99, 100):");
console.log("  Array:", replaceArr); // [1, 2, 99, 100, 5]

// Negative start index
const negSplice = [1, 2, 3, 4, 5];
negSplice.splice(-2, 1);
console.log("\nNegative start splice(-2, 1):");
console.log("  Array:", negSplice); // [1, 2, 3, 5]

// 2.2 fill - Fill with static value (ES6/ES2015)
// - fill(value, start, end)
// - end not included
const fillArr = [1, 2, 3, 4, 5];
console.log("\nfill - Fill range:");
console.log("Original:", [...fillArr]);

// Fill part of array
fillArr.fill(0, 2, 4);
console.log("After fill(0, 2, 4):", fillArr); // [1, 2, 0, 0, 5]

// Fill entire array
const allFill = new Array(5);
allFill.fill("x");
console.log("Fill entire array:", allFill); // ['x', 'x', 'x', 'x', 'x']

// 2.3 copyWithin - Copy part of array (ES6/ES2015)
// - copyWithin(target, start, end)
// - Copies elements from [start, end) to target position
// - Array length stays the same
const copyArr = [1, 2, 3, 4, 5];
console.log("\ncopyWithin - Copy within array:");
console.log("Original:", [...copyArr]);

copyArr.copyWithin(0, 3, 5); // Copy elements 3-5 to position 0
console.log("After copyWithin(0, 3, 5):", copyArr); // [4, 5, 3, 4, 5]

const copyArr2 = [1, 2, 3, 4, 5];
copyArr2.copyWithin(2, 0); // Copy from index 0 to end, paste at 2
console.log("After copyWithin(2, 0):", copyArr2); // [1, 2, 1, 2, 3]

// ============================================
// 3. Non-Mutating Methods - Slice, Concat, Join
// ============================================
/**
 * Non-Mutating Methods - Return new arrays or strings
 *
 * slice: Extract portion of array
 * concat: Merge arrays/values
 * join: Join elements into string
 *
 * All leave the original array unchanged.
 */

console.log("\n=== 3. Non-Mutating Methods ===");

// 3.1 slice - Extract portion (ES3)
// - slice(start, end) - end not included
// - Returns new array
// - Supports negative indices
const sliceArr = [1, 2, 3, 4, 5];
console.log("slice - Extract portion:");
console.log("Original:", sliceArr); // unchanged
console.log("slice(1, 3):", sliceArr.slice(1, 3)); // [2, 3]
console.log("slice(2):", sliceArr.slice(2)); // [3, 4, 5]
console.log("slice(0, 3):", sliceArr.slice(0, 3)); // [1, 2, 3]
console.log("slice(-2):", sliceArr.slice(-2)); // [4, 5]
console.log("slice(-3, -1):", sliceArr.slice(-3, -1)); // [3, 4]

// Copy entire array (shallow copy)
const copy = sliceArr.slice();
console.log("slice() - shallow copy:", copy);

// 3.2 concat - Merge arrays (ES3)
// - Returns new array
// - Can take multiple arrays and values
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];

console.log("\nconcat - Merge:");
console.log("Two arrays:", arr1.concat(arr2)); // [1, 2, 3, 4]
console.log("Three arrays:", arr1.concat(arr2, arr3)); // [1, 2, 3, 4, 5, 6]
console.log("Mixed values:", arr1.concat(99, arr2, 100)); // [1, 2, 99, 3, 4, 100]
console.log("Original arr1 unchanged:", arr1); // [1, 2]

// 3.3 join - Create string from array (ES1)
// - Returns string
// - Default separator is comma
const words = ["Hello", "World", "!"];
console.log("\njoin - To string:");
console.log("With space:", words.join(" ")); // 'Hello World !'
console.log("With comma:", words.join(",")); // 'Hello,World,!'
console.log("No separator:", words.join("")); // 'HelloWorld!'
console.log("Default (comma):", words.join()); // 'Hello,World,!'

// Use case: building URLs/paths
const pathParts = ["users", "123", "profile"];
const urlPath = "/" + pathParts.join("/");
console.log("URL path:", urlPath); // '/users/123/profile'

// ============================================
// 4. Array Spreading and Rest
// ============================================
/**
 * Spread Operator (...) - Expand array elements (ES6/ES2015)
 *
 * Uses:
 * - Copying arrays (shallow)
 * - Merging arrays
 * - Passing array elements as function arguments
 * - Converting iterables to arrays
 *
 * Rest parameter: Collect multiple arguments into array
 */

console.log("\n=== 4. Spread and Rest Operators ===");

// 4.1 Spread for copying
const original = [1, 2, 3];
const spreadCopy = [...original];
console.log("Spread copy:");
console.log("Original:", original);
console.log("Copy:", spreadCopy);
console.log("Same reference?", original === spreadCopy); // false

// 4.2 Spread for merging
const merged = [...arr1, ...arr2, ...arr3];
console.log("\nSpread merge:", merged); // [1, 2, 3, 4, 5, 6]

// Insert at any position
const withInsert = [...arr1, "middle", ...arr2];
console.log("Spread with insert:", withInsert); // [1, 2, 'middle', 3, 4]

// 4.3 Spread as function arguments (apply alternative)
const nums = [3, 1, 4, 1, 5, 9, 2, 6];
const max = Math.max(...nums);
const min = Math.min(...nums);
console.log("\nSpread in function calls:");
console.log("Math.max(...nums):", max); // 9
console.log("Math.min(...nums):", min); // 1
// Equivalent to: Math.max.apply(null, nums)

// 4.4 Spread to convert iterables
const strSpread = [..."hello"];
console.log("\nSpread string to array:", strSpread); // ['h', 'e', 'l', 'l', 'o']

const setSpread = [...new Set([1, 2, 2, 3, 3, 3])];
console.log("Spread Set to array (deduplicate):", setSpread); // [1, 2, 3]

// 4.5 Rest parameter (collect arguments into array)
function sumAll(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
console.log("\nRest parameter:");
console.log("sumAll(1, 2, 3):", sumAll(1, 2, 3)); // 6
console.log("sumAll(1, 2, 3, 4, 5):", sumAll(1, 2, 3, 4, 5)); // 15

// Rest with destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log("Rest in destructuring:");
console.log({ first, second, rest }); // first: 1, second: 2, rest: [3, 4, 5]

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Accidental mutation
console.log("\nPitfall 1 - Accidental mutation:");
const arr = [3, 1, 2];
const result = arr.sort(); // Mutates original!
console.log("Original after sort():", arr); // [1, 2, 3] ❌
console.log("✅ Use toSorted() or [...arr].sort() for immutable sort");

// Pitfall 2: Confusing splice and slice
console.log("\nPitfall 2 - splice vs slice:");
console.log("splice: MUTATES, returns removed elements");
console.log("slice:  non-mutating, returns extracted portion");
console.log("Mnemonic: splice has a 'p' for 'permanent change'");

// Pitfall 3: Shallow copy limitation
console.log("\nPitfall 3 - Shallow copy:");
const nested = [{ a: 1 }, { b: 2 }];
const shallowCopy = [...nested];
shallowCopy[0].a = 99; // Modifies original too!
console.log("Original nested[0].a:", nested[0].a); // 99 ❌
console.log("✅ Use structuredClone() for deep copies");

// Pitfall 4: push returns length, not array
console.log("\nPitfall 4 - push return value:");
const testArr = [1, 2];
const pushResult = testArr.push(3);
console.log("push returns:", pushResult); // 3 (length), NOT the array
console.log("Can't chain: arr.push(3).push(4) would error");

// Pitfall 5: Sparse arrays with fill
console.log("\nPitfall 5 - fill with objects:");
const filled = new Array(3).fill({ count: 0 });
filled[0].count = 5; // Modifies all! (same object reference)
console.log("After modifying filled[0]:", filled);
console.log("All elements reference the same object!");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use push/pop for stack operations (O(1))");
console.log("✅ Use slice() or spread for shallow copying");
console.log("✅ Use splice for precise array manipulation");
console.log("✅ Use spread for merging arrays (clean syntax)");
console.log("✅ Use join for string building from arrays");
console.log("✅ Prefer non-mutating methods when immutability matters");
console.log("✅ Use toSorted/toSpliced/etc. for immutable updates (ES2023+)");
console.log("⚠️  shift/unshift are O(n) - avoid for large arrays");
console.log("⚠️  Spread and slice create shallow copies only");
console.log("⚠️  fill() with objects creates shared references");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────┬─────────────┬──────────────────┐
│ Method      │ Mutates?    │ Returns          │
├─────────────┼─────────────┼──────────────────┤
│ push        │ YES         │ new length       │
│ pop         │ YES         │ removed element  │
│ unshift     │ YES         │ new length       │
│ shift       │ YES         │ removed element  │
│ splice      │ YES         │ removed elements │
│ fill        │ YES         │ the array        │
│ copyWithin  │ YES         │ the array        │
├─────────────┼─────────────┼──────────────────┤
│ slice       │ NO          │ new array        │
│ concat      │ NO          │ new array        │
│ join        │ NO          │ string           │
│ spread (...)│ NO          │ new array        │
└─────────────┴─────────────┴──────────────────┘
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06-1-arrays-basics.js - Array creation and basics");
console.log("📘 06-2-arrays-iteration.js - Array iteration methods");
console.log("📘 06-3-arrays-search-sort.js - Search and sort methods");
console.log("📘 09-destructuring.js - Destructuring patterns");
console.log("📘 27-memory-management.js - Shallow vs deep copies");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 06-4-arrays-manipulation-ts-comparison.ts
*/
