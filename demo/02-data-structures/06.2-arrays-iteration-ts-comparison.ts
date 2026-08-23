// Arrays - Iteration TypeScript Comparison
// 📘 Complementary to: 06.2-arrays-iteration.js

export {};

console.log("=== Arrays - Iteration TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. TYPE-PRESERVING ITERATION METHODS
 *    JS:  Methods work dynamically, types inferred from runtime values
 *    TS:  Each method preserves/enhances type information:
 *         - map: transforms element types
 *         - filter: narrows types via type guards
 *         - reduce: infers accumulator type
 *
 * 2. CALLBACK TYPE SIGNATURES
 *    JS:  (element, index, array) => any
 *    TS:  (element: T, index: number, array: T[]) => U
 *
 * 3. FILTER TYPE GUARDS
 *    TS:  filter with type guard predicate narrows array type
 *         arr.filter((x): x is Type => predicate)
 *
 * 4. REDUCE TYPE INFERENCE
 *    JS:  Initial value determines accumulator type at runtime
 *    TS:  Initial value type determines accumulator type at compile time
 */

// Example 1: Type-preserving map
console.log("1. Type-preserving map:");
const numbers: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = numbers.map(n => n * 2);
const strings: string[] = numbers.map(n => n.toString());
const objects: { value: number; index: number }[] = numbers.map((n, i) => ({
  value: n,
  index: i,
}));
console.log("  doubled (number[]):", doubled);
console.log("  strings (string[]):", strings);
console.log("  objects:", objects);

// Example 2: Filter with type guards
console.log("\n2. Filter with type guards:");
const mixed: (string | number)[] = [1, "hello", 2, "world", 3];
const nums: number[] = mixed.filter((x): x is number => typeof x === "number");
const strs: string[] = mixed.filter((x): x is string => typeof x === "string");
console.log("  numbers:", nums);
console.log("  strings:", strs);

// Example 3: Filter with complex type guards
console.log("\n3. Complex type guards:");
interface User {
  id: number;
  name: string;
  email?: string;
}
const users: (User | null)[] = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  null,
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie", email: "charlie@example.com" },
];
const validUsers: User[] = users.filter((u): u is User => u !== null);
console.log("  validUsers:", validUsers);

// Example 4: Type-safe reduce
console.log("\n4. Type-safe reduce:");
const sum: number = numbers.reduce((acc, n) => acc + n, 0);
console.log("  sum:", sum);

// Reduce with explicit accumulator type
const sumSquared: number = numbers.reduce<number>((acc, n) => acc + n * n, 0);
console.log("  sumSquared:", sumSquared);

// Example 5: Reduce for object construction
console.log("\n5. Reduce to object:");
const numberMap: Record<string, number> = numbers.reduce<Record<string, number>>((acc, num) => {
  acc[`num${num}`] = num * num;
  return acc;
}, {});
console.log("  numberMap:", numberMap);

// Example 6: forEach with thisArg
console.log("\n6. forEach with thisArg:");
const multiplier = { factor: 10 };
numbers.forEach(function (this: typeof multiplier, num) {
  console.log(`  ${num} * ${this.factor} = ${num * this.factor}`);
}, multiplier);

// Example 7: flat and flatMap type preservation
console.log("\n7. flat and flatMap:");
const nested: number[][] = [[1, 2], [3, 4], [5]];
const flattened: number[] = nested.flat();
console.log("  nested.flat():", flattened);

const words: string[] = ["hello world", "good morning"];
const allWords: string[] = words.flatMap(phrase => phrase.split(" "));
console.log("  flatMap result:", allWords);

// Example 8: FlatMap for filtering + transforming
console.log("\n8. flatMap for filter+transform:");
const evensDoubled: number[] = numbers.flatMap(n => {
  if (n % 2 === 0) return [n * 10];
  return [];
});
console.log("  evensDoubled:", evensDoubled);

// Example 9: Generic iteration utilities
console.log("\n9. Generic utilities:");
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

const doubledGeneric = mapArray(numbers, n => n * 2);
const evenGeneric = filterArray(numbers, n => n % 2 === 0);
console.log("  mapArray result:", doubledGeneric);
console.log("  filterArray result:", evenGeneric);

// Example 10: Type-safe filter for filtering objects
console.log("\n10. Filter objects by property:");
interface Person {
  name: string;
  age: number;
  email: string;
}
const people: Person[] = [
  { name: "Alice", age: 25, email: "alice@example.com" },
  { name: "Bob", age: 30, email: "bob@example.com" },
  { name: "Charlie", age: 35, email: "charlie@example.com" },
];

const adults: Person[] = people.filter(p => p.age >= 30);
console.log("  adults:", adults);

// Example 11: Find with type narrowing
console.log("\n11. Find with type narrowing:");
const foundPerson: Person | undefined = people.find(p => p.name === "Bob");
if (foundPerson) {
  console.log("  foundPerson.age:", foundPerson.age); // Type narrowed to Person
}

/**
 * 📋 Key Takeaways:
 * - map transforms element types, filter narrows via type guards
 * - Use type guards (x is T) in filter to narrow array types
 * - reduce infers accumulator type from initial value
 * - flat/flatMap preserve type information through transformation
 * - Generic utilities enable reusable type-safe operations
 * - find/findIndex return undefined for not found (use type guards)
 */
