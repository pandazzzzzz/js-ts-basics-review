// Arrays - Basics TypeScript Comparison
// 📘 Complementary to: 06.1-arrays-basics.js

export {};

console.log("=== Arrays - Basics TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. TYPED ARRAYS
 *    JS:  Arrays can hold mixed types, typeof returns "object"
 *    TS:  Arrays are homogeneous by default: number[], string[], etc.
 *         Union types for mixed: (string | number)[]
 *
 * 2. TYPE INFERENCE
 *    JS:  Type determined at runtime
 *    TS:  Type inferred from initial values, checked at compile time
 *
 * 3. ARRAY METHODS TYPE SAFETY
 *    JS:  Methods work dynamically, errors at runtime
 *    TS:  Method signatures checked, element types enforced
 *
 * 4. TYPED ARRAY CONSTRUCTORS
 *    JS:  new Array(5) creates empty array or array of length 5
 *    TS:  new Array<number>(5) creates typed array, better clarity
 *
 * 5. READONLY ARRAYS
 *    TS:  readonly number[] or ReadonlyArray<number> prevents mutation
 *         Use for function parameters that should not be modified
 */

// Example 1: Typed array declarations
console.log("1. Typed array declarations:");
const numbers: number[] = [1, 2, 3, 4, 5];
const strings: string[] = ["hello", "world"];
const mixed: (string | number | boolean)[] = [1, "hello", true];
console.log("  numbers:", numbers);
console.log("  strings:", strings);
console.log("  mixed:", mixed);

// Example 2: Type inference
console.log("\n2. Type inference:");
const inferred = [1, 2, 3]; // Type: number[]
console.log("  inferred is number[]");
const objects = [{ name: "Alice" }, { name: "Bob" }]; // Type: { name: string }[]
console.log("  objects is { name: string }[]");

// Example 3: Array constructor with types
console.log("\n3. Array constructor:");
const typedArray: number[] = new Array<number>(5).fill(0);
console.log("  new Array<number>(5):", typedArray);
const fromLength: number[] = Array.from({ length: 5 }, (_, i) => i);
console.log("  Array.from with type:", fromLength);

// Example 4: Readonly arrays
console.log("\n4. Readonly arrays:");
const readonlyArr: readonly number[] = [1, 2, 3];
console.log("  readonly number[]:", readonlyArr);
// readonlyArr.push(4); // ❌ Error: push doesn't exist on readonly
// readonlyArr[0] = 10; // ❌ Error: index signature is readonly

// Example 5: Type-safe array methods
console.log("\n5. Type-safe array methods:");
const nums: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = nums.map(n => n * 2); // Type preserved
console.log("  map preserves type: doubled is number[]");

const evens: number[] = nums.filter(n => n % 2 === 0);
console.log("  filter preserves type: evens is number[]");

// Example 6: Array destructuring with types
console.log("\n6. Array destructuring:");
const [first, second, ...rest]: [number, number, ...number[]] = [1, 2, 3, 4, 5];
console.log("  first:", first);
console.log("  second:", second);
console.log("  rest:", rest);

// Example 7: at() method with negative indices
console.log("\n7. at() method (ES2022+):");
const atExample: number[] = [10, 20, 30, 40, 50];
console.log("  at(-1):", atExample.at(-1)); // 50
console.log("  at(99):", atExample.at(99)); // undefined

// Example 8: Array.isArray with type guards
console.log("\n8. Type guard with Array.isArray:");
function process(value: unknown): number[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is number => typeof item === "number");
  }
  return [];
}
console.log("  process([1, 'a', 2]):", process([1, "a", 2]));

/**
 * 📋 Key Takeaways:
 * - Typed arrays enforce element types at compile time
 * - Use union types for mixed-type arrays when needed
 * - readonly arrays prevent accidental mutation
 * - Array methods preserve type information
 * - Array.isArray creates type guards for unknown values
 * - at() method works with TypeScript's type system
 */
