// Arrays - Manipulation TypeScript Comparison
// 📘 Complementary to: 06-4-arrays-manipulation.js

// 🎯 Difficulty: Beginner
export {};

console.log("=== Arrays - Manipulation TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. MUTATING METHOD TYPES
 *    JS:  Methods work dynamically, errors at runtime
 *    TS:  Method signatures checked at compile time, element types enforced
 *
 * 2. SPREAD OPERATOR TYPE PRESERVATION
 *    JS:  [...arr] creates shallow copy, types inferred
 *    TS:  [...arr] preserves array type, creates new typed array
 *
 * 3. TUPLE TYPES FOR FIXED-LENGTH ARRAYS
 *    JS:  Arrays are dynamic, length not enforced
 *    TS:  Tuples enforce fixed length and specific element types
 *
 * 4. SPREAD WITH TUPLES
 *    TS:  Spread with tuples creates tuples with known structure
 *
 * 5. READONLY ARRAYS
 *    TS:  readonly T[] or ReadonlyArray<T> prevents mutation
 */

// Example 1: Type-safe mutating methods
console.log("1. Type-safe mutating methods:");
const stack: number[] = [1, 2, 3];
const newLength: number = stack.push(4, 5);
console.log("  after push:", stack, "length:", newLength);

const popped: number | undefined = stack.pop();
console.log("  pop result:", popped, "array:", stack);

const unshiftLen: number = stack.unshift(0);
console.log("  after unshift(0):", stack, "length:", unshiftLen);

const shifted: number | undefined = stack.shift();
console.log("  shift result:", shifted, "array:", stack);

// Example 2: Splice with types
console.log("\n2. Splice with types:");
const spliceArr: number[] = [1, 2, 3, 4, 5];
const removed: number[] = spliceArr.splice(1, 2);
console.log("  removed:", removed, "array:", spliceArr);

const insertArr: number[] = [1, 2, 5];
insertArr.splice(2, 0, 3, 4);
console.log("  after insert splice:", insertArr);

// Example 3: Non-mutating methods
console.log("\n3. Non-mutating methods:");
const sliceArr: number[] = [1, 2, 3, 4, 5];
const sliceCopy: number[] = sliceArr.slice(1, 3);
console.log("  slice(1, 3):", sliceCopy, "original:", sliceArr);

const concatArr1: number[] = [1, 2];
const concatArr2: number[] = [3, 4];
const merged: number[] = concatArr1.concat(concatArr2);
console.log("  concat result:", merged);

// Example 4: Spread operator
console.log("\n4. Spread operator:");
const original: number[] = [1, 2, 3];
const spreadCopy: number[] = [...original];
console.log("  spread copy:", spreadCopy);

// Spread merging
const arr1: number[] = [1, 2];
const arr2: number[] = [3, 4];
const arr3: number[] = [5, 6];
const spreadMerged: number[] = [...arr1, ...arr2, ...arr3];
console.log("  merged:", spreadMerged);

// Spread with insertion
const withInsert: number[] = [...arr1, 99, ...arr2];
console.log("  with insert:", withInsert);

// Example 5: Tuple types
console.log("\n5. Tuple types:");
const tuple: [string, number, boolean] = ["hello", 42, true];
console.log("  tuple:", tuple);
console.log("  tuple[0]:", tuple[0]); // string
console.log("  tuple[1]:", tuple[1]); // number

// Named tuple elements
const namedTuple: [name: string, age: number, active: boolean] = ["Alice", 30, true];
console.log("  named tuple:", namedTuple);

// Example 6: Spread with tuples
console.log("\n6. Spread with tuples:");
const t1: [number, string] = [1, "a"];
const t2: [number, string] = [2, "b"];
const combined: [number, string, number, string] = [...t1, ...t2];
console.log("  combined:", combined);

// Example 7: Readonly arrays
console.log("\n7. Readonly arrays:");
const readonlyArr: readonly number[] = [1, 2, 3];
console.log("  readonly number[]:", readonlyArr);
// readonlyArr.push(4); // ❌ Error
// readonlyArr[0] = 10; // ❌ Error

// ReadonlyArray type
const readonlyArray: ReadonlyArray<number> = [4, 5, 6];
console.log("  ReadonlyArray<number>:", readonlyArray);
// readonlyArray.push(7); // ❌ Error

// Example 8: Readonly with as const
console.log("\n8. as const for literal types:");
const config = {
  port: 8080,
  host: "localhost",
} as const;
console.log("  config.port:", config.port); // Type is 8080 (not number)
console.log("  config.host:", config.host); // Type is "localhost" (not string)

// Example 9: Join with types
console.log("\n9. Join with types:");
const words: string[] = ["Hello", "World", "!"];
const joined: string = words.join(" ");
console.log("  joined:", joined);

// Example 10: Fill with types
console.log("\n10. Fill with types:");
const fillArr: number[] = new Array(5);
fillArr.fill(0);
console.log("  filled array:", fillArr);

const partialFill: number[] = [1, 2, 3, 4, 5];
partialFill.fill(0, 2, 4);
console.log("  partial fill:", partialFill);

// Example 11: copyWithin with types
console.log("\n11. copyWithin:");
const copyArr: number[] = [1, 2, 3, 4, 5];
copyArr.copyWithin(0, 3, 5);
console.log("  after copyWithin:", copyArr);

// Example 12: Type-safe queue implementation
console.log("\n12. Type-safe queue:");
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }
}

const stringQueue = new Queue<string>();
stringQueue.enqueue("first");
stringQueue.enqueue("second");
console.log("  queue size:", stringQueue.size);
console.log("  dequeue:", stringQueue.dequeue());
console.log("  peek:", stringQueue.peek());

// Example 13: Type-safe stack implementation
console.log("\n13. Type-safe stack:");
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log("  stack size:", numberStack.size);
console.log("  pop:", numberStack.pop());
console.log("  peek:", numberStack.peek());

/**
 * 📋 Key Takeaways:
 * - Mutating methods (push/pop/shift/unshift/splice) are type-safe
 * - Spread operator preserves array types and creates new arrays
 * - Tuples enforce fixed-length arrays with specific types
 * - Readonly arrays prevent accidental mutation
 * - as const narrows literal types for config-like objects
 * - Generic collections (Queue<T>, Stack<T>) provide type-safe data structures
 */
