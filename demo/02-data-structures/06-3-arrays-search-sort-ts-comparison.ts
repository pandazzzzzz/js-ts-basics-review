// Arrays - Search & Sort TypeScript Comparison
// 📘 Complementary to: 06-3-arrays-search-sort.js

// 🎯 Difficulty: Beginner
export {};

console.log("=== Arrays - Search & Sort TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. SEARCH METHOD RETURN TYPES
 *    JS:  find returns element or undefined, types unknown
 *    TS:  find returns T | undefined, requires type guard for safe access
 *
 * 2. COMPARE FUNCTION TYPES
 *    JS:  (a, b) => number - runtime only
 *    TS:  (a: T, b: T) => number - type-safe comparison
 *
 * 3. PREDICATE FUNCTIONS
 *    JS:  (element) => boolean - runtime check
 *    TS:  (element: T) => element is U - type guard predicate
 *
 * 4. IMMUTABLE METHODS (ES2023+)
 *    JS:  toSorted() returns a NEW array (does not mutate original)
 *    TS:  toSorted() returns new array with same type
 */

// Example 1: Type-safe search methods
console.log("1. Type-safe search methods:");
const numbers: number[] = [1, 2, 3, 4, 5];
const found: number | undefined = numbers.find(n => n > 3);
const foundIndex: number = numbers.findIndex(n => n > 3);
const hasThree: boolean = numbers.includes(3);
const indexOfThree: number = numbers.indexOf(3);

console.log("  find(>3):", found);
console.log("  findIndex(>3):", foundIndex);
console.log("  includes(3):", hasThree);
console.log("  indexOf(3):", indexOfThree);

// Example 2: Find with type guard
console.log("\n2. Find with type guard:");
interface User {
  id: number;
  name: string;
  email?: string;
}
const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

// Find user with email
const userWithEmail: User | undefined = users.find((u): u is User & { email: string } => !!u.email);
console.log("  userWithEmail:", userWithEmail);

// Example 3: Type-safe sorting
console.log("\n3. Type-safe sorting:");
const unsorted: number[] = [3, 1, 4, 1, 5, 9, 2, 6, 10, 20];
const sortedAsc: number[] = [...unsorted].sort((a, b) => a - b);
const sortedDesc: number[] = [...unsorted].sort((a, b) => b - a);

console.log("  sortedAsc:", sortedAsc);
console.log("  sortedDesc:", sortedDesc);

// Example 4: Sort objects by property
console.log("\n4. Sort objects:");
const people: { name: string; age: number }[] = [
  { name: "Charlie", age: 35 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

const sortedByAge = [...people].sort((a, b) => a.age - b.age);
const sortedByName = [...people].sort((a, b) => a.name.localeCompare(b.name));

console.log(
  "  sortedByAge:",
  sortedByAge.map(p => `${p.name}(${p.age})`)
);
console.log(
  "  sortedByName:",
  sortedByName.map(p => p.name)
);

// Example 5: Multi-key sorting
console.log("\n5. Multi-key sorting:");
interface Product {
  category: string;
  name: string;
  price: number;
}
const products: Product[] = [
  { category: "electronics", name: "Phone", price: 999 },
  { category: "books", name: "Novel", price: 20 },
  { category: "electronics", name: "Laptop", price: 1299 },
];

const multiSorted = [...products].sort((a, b) => {
  if (a.category !== b.category) {
    return a.category.localeCompare(b.category);
  }
  return a.price - b.price;
});
console.log("  multiSorted:", multiSorted);

// Example 6: Immutable methods (ES2023+)
console.log("\n6. Immutable methods (ES2023+):");
const toSortedExample: number[] = [3, 1, 4, 1, 5];
const sortedCopy: number[] = toSortedExample.toSorted((a, b) => a - b);
console.log("  original:", toSortedExample);
console.log("  toSorted:", sortedCopy);

const toReversedExample: number[] = [1, 2, 3, 4, 5];
const reversedCopy: number[] = toReversedExample.toReversed();
console.log("  toReversed:", reversedCopy);

const withExample: number[] = [1, 2, 3, 4, 5];
const withReplaced: number[] = withExample.with(2, 99);
console.log("  with(2, 99):", withReplaced);

// Example 7: findLast / findLastIndex (ES2023+)
console.log("\n7. findLast / findLastIndex (ES2023+):");
const findLastArr: number[] = [1, 2, 3, 4, 5, 4, 3];
const lastMatch: number | undefined = findLastArr.findLast(n => n === 4);
const lastMatchIndex: number = findLastArr.findLastIndex(n => n === 4);
console.log("  findLast(===4):", lastMatch);
console.log("  findLastIndex(===4):", lastMatchIndex);

// Example 8: some / every with type guards
console.log("\n8. some / every:");
const hasEven: boolean = numbers.some(n => n % 2 === 0);
const allPositive: boolean = numbers.every(n => n > 0);

console.log("  some(n % 2 === 0):", hasEven);
console.log("  every(n > 0):", allPositive);

// Example 9: Search in object arrays
console.log("\n9. Search in object arrays:");
const foundUser: User | undefined = users.find(u => u.id === 2);
if (foundUser) {
  console.log("  foundUser:", foundUser);
}

const userIndex: number = users.findIndex(u => u.name === "Alice");
console.log("  findIndex('Alice'):", userIndex);

// Example 10: Generic search utility
console.log("\n10. Generic search utility:");
function findByProperty<T, K extends keyof T>(arr: T[], property: K, value: T[K]): T | undefined {
  return arr.find(item => item[property] === value);
}

const byId: User | undefined = findByProperty(users, "id", 1);
const byName: User | undefined = findByProperty(users, "name", "Bob");
console.log("  findById(1):", byId);
console.log("  findByName('Bob'):", byName);

// Example 11: Type-safe includes check
console.log("\n11. Type-safe includes:");
const keys = ["name", "age", "email"] as const; // literal union type
const key: string = "name";
if ((keys as readonly string[]).includes(key)) {
  console.log("  key 'name' is valid");
}

/**
 * 📋 Key Takeaways:
 * - find/findBy return T | undefined, use type guards for safe access
 * - Sort compare functions maintain type safety for array elements
 * - Type guard predicates (x is T) in filter/find narrow types
 * - ES2023+ immutable methods (toSorted, toReversed, with) preserve types
 * - findLast/findLastIndex work with TypeScript's type system
 * - some/every boolean return values are type-safe
 */
