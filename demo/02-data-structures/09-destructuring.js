// Destructuring Assignment - Complete Demo
// 📘 For TypeScript comparison, see: 09-destructuring-ts-comparison.ts
// 📘 javascript.info: "Destructuring assignment"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
// 📌 ES6 (ES2015)
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces destructuring as a concise way to unpack values from arrays and objects.
// The examples focus on the most common patterns first and then show how the same idea applies to rest syntax.

// ============================================
// Table of Contents
// ============================================
// 1. Array Destructuring
// 2. Object Destructuring
// 3. Function Parameter Destructuring
// 4. Advanced Usage
// 5. Common Pitfalls & Best Practices

// ============================================
// Section 1: Array Destructuring
// ============================================

// Basic syntax (ES6)
// - Extract values from arrays and assign to variables
// - Based on position, not names
const arr = [1, 2, 3];
const [a, b, c] = arr;
console.log("Array Destructuring - Basic Syntax:");
console.log("  a:", a, "b:", b, "c:", c); // 1, 2, 3

// Skipping elements
// - Use commas to skip unwanted elements
const [, , third] = ["first", "second", "third"];
console.log("\nSkipping Elements:");
console.log("  third:", third); // "third"

const [, second, , fourth] = [1, 2, 3, 4];
console.log("  second:", second, "fourth:", fourth); // 2, 4

// Rest elements - Rest pattern (ES6)
// - Use ... to collect remaining elements into a new array
// - rest must be the last element
const [first, ...rest] = ["Julius", "Caesar", "Consul", "Roman"];
console.log("\nRest Elements:");
console.log("  first:", first); // "Julius"
console.log("  rest:", rest); // ["Caesar", "Consul", "Roman"]

// Default values (ES6)
// - Used when array element is undefined
const [name = "Guest", surname = "Anonymous"] = ["Julius"];
console.log("\nDefault Values:");
console.log("  name:", name); // "Julius" (from array)
console.log("  surname:", surname); // "Anonymous" (default)

// Default values can be expressions (evaluated only when needed)
let promptCalled = false;
const [x = ((promptCalled = true), "default")] = ["provided"];
console.log("  Default value not evaluated:", !promptCalled); // true

// Swapping variables (ES6)
// - Swap without temporary variable
let x1 = 1,
  y1 = 2;
[x1, y1] = [y1, x1];
console.log("\nSwapping Variables:");
console.log("  x1:", x1, "y1:", y1); // 2, 1

// Nested destructuring (ES6)
// - Destructure nested arrays
const nested = [
  [1, 2],
  [3, 4],
];
const [[a1, b1], [c1, d1]] = nested;
console.log("\nNested Destructuring:");
console.log("  a1:", a1, "b1:", b1, "c1:", c1, "d1:", d1); // 1, 2, 3, 4

// Working with any iterable (ES6)
// - Not limited to arrays, works with any iterable object
console.log("\nWorking with Iterables:");

// String
const [char1, char2, ...remainingChars] = "Hello";
console.log("  String:", char1, char2, remainingChars); // "H", "e", ["l", "l", "o"]

// Set
const [setFirst, setSecond] = new Set([1, 2, 3]);
console.log("  Set:", setFirst, setSecond); // 1, 2

// Map (destructure entries)
const map = new Map([
  ["a", 1],
  ["b", 2],
]);
const [entry1, entry2] = map;
console.log("  Map entries:", entry1, entry2); // ["a", 1], ["b", 2]

// ============================================
// Section 2: Object Destructuring
// ============================================

// Basic syntax (ES6)
// - Extract properties from objects and assign to variables
// - Based on property names, not position
const user2 = { name: "Alice", age: 30, city: "New York" };
const { name: name2, age: age2, city: city2 } = user2;
console.log("\nObject Destructuring - Basic Syntax:");
console.log("  name:", name2, "age:", age2, "city:", city2);

// Renaming variables (ES6)
// - Syntax: { propertyName: newVariableName }
const { name: userName, age: userAge } = user2;
console.log("\nRenaming Variables:");
console.log("  userName:", userName, "userAge:", userAge);

// Default values (ES6)
// - Used when property value is undefined
const { name: n = "Guest", country = "Unknown" } = { name: "Bob" };
console.log("\nDefault Values:");
console.log("  n:", n, "country:", country); // "Bob", "Unknown"

// Renaming + default values (ES6)
const { name: fullName = "Anonymous" } = {};
console.log("  fullName:", fullName); // "Anonymous"

// Rest properties - Rest pattern (ES2018)
// - Collect remaining properties into a new object
const options = { title: "Menu", height: 200, width: 100 };
const { title, ...remainingProps } = options;
console.log("\nRest Properties (ES2018):");
console.log("  title:", title); // "Menu"
console.log("  remainingProps:", remainingProps); // { height: 200, width: 100 }

// Nested destructuring (ES6)
// - Destructure nested objects
const complexObj = {
  size: { width: 100, height: 200 },
  items: ["Cake", "Donut"],
  extra: true,
};
const {
  size: { width, height },
  items: [item1, item2],
  extra,
} = complexObj;
console.log("\nNested Destructuring:");
console.log("  width:", width, "height:", height); // 100, 200
console.log("  item1:", item1, "item2:", item2); // "Cake", "Donut"

// Deep nested + default values
const deepNested = { user: { profile: { email: "test@example.com" } } };
const {
  user: {
    profile: { email, phone = "N/A" },
  },
} = deepNested;
console.log("  email:", email, "phone:", phone); // "test@example.com", "N/A"

// Computed property name destructuring (ES6)
// - Use [] syntax to destructure dynamic property names
const key = "dynamicKey";
const dynamicObj = { dynamicKey: "value123" };
const { [key]: dynamicValue } = dynamicObj;
console.log("\nComputed Property Name Destructuring:");
console.log("  dynamicValue:", dynamicValue); // "value123"

// ============================================
// Section 3: Function Parameter Destructuring
// ============================================

// Object parameter destructuring (ES6)
// - Extract object properties directly from parameters
function greetUser({ name, age }) {
  return `Hello, ${name}! You are ${age} years old.`;
}
console.log("\nFunction Parameter Destructuring - Object:");
console.log(" ", greetUser({ name: "Charlie", age: 25 }));

// Parameter destructuring with default values (ES6)
// - Provide defaults for both entire parameter and internal properties
function configure({ width = 100, height = 200, title = "Untitled" } = {}) {
  return { width, height, title };
}
console.log("\nParameter Destructuring with Default Values:");
console.log("  No args:", configure()); // { width: 100, height: 200, title: "Untitled" }
console.log("  Partial args:", configure({ width: 50 })); // { width: 50, height: 200, title: "Untitled" }
console.log("  Full override:", configure({ width: 50, height: 100, title: "Custom" }));

// Array parameter destructuring (ES6)
function sumPair([a, b]) {
  return a + b;
}
console.log("\nArray Parameter Destructuring:");
console.log("  sumPair([3, 4]):", sumPair([3, 4])); // 7

// Complex parameter destructuring - nested + defaults + renaming
function createUser({
  profile: { firstName: fn, lastName: ln } = {},
  settings: { theme = "light", notifications = true } = {},
} = {}) {
  return {
    fullName: `${fn || "Unknown"} ${ln || ""}`.trim(),
    theme,
    notifications,
  };
}
console.log("\nComplex Parameter Destructuring:");
console.log(
  " ",
  createUser({
    profile: { firstName: "John", lastName: "Doe" },
    settings: { theme: "dark" },
  })
);
// { fullName: "John Doe", theme: "dark", notifications: true }

// ============================================
// Section 4: Advanced Usage
// ============================================

// Destructuring to already declared variables (ES6)
// - Need parentheses, otherwise JS parses { as a block
let existingA, existingB;
({ a: existingA, b: existingB } = { a: 10, b: 20 });
console.log("\nDestructuring to Declared Variables:");
console.log("  existingA:", existingA, "existingB:", existingB); // 10, 20

// Destructuring in for...of loops (ES6)
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];
console.log("\nfor...of Loop Destructuring:");
for (const { id, name } of users) {
  console.log(`  User ${id}: ${name}`);
}

// Map.entries() destructuring (ES6)
const userMap = new Map([
  ["id", 1],
  ["name", "Alice"],
]);
console.log("\nMap.entries() Destructuring:");
for (const [mapKey, mapValue] of userMap) {
  console.log(`  ${mapKey}: ${mapValue}`);
}

// Array index destructuring (ES6)
const indexedArr = ["a", "b", "c"];
const { 0: firstElem, [indexedArr.length - 1]: lastElem } = indexedArr;
console.log("\nArray Index Destructuring:");
console.log("  firstElem:", firstElem, "lastElem:", lastElem); // "a", "c"

// Destructuring with JSON data (ES6)
const jsonData = JSON.stringify({
  users: [{ name: "Alice", posts: [{ title: "Hello" }] }],
});
const {
  users: [
    {
      name: userName2,
      posts: [{ title: firstPost }],
    },
  ],
} = JSON.parse(jsonData);
console.log("\nJSON Data Destructuring:");
console.log(`  User: ${userName2}, First post: ${firstPost}`);

// ============================================
// Section 5: Common Pitfalls & Best Practices
// ============================================

// Pitfall: Destructuring null/undefined throws error (ES6)
// - Must check first or use default values
console.log("\nCommon Pitfalls:");
try {
  const { prop } = null;
} catch (e) {
  console.log("  Destructuring null throws:", e.name); // TypeError
}

// Solution: Use default values
const safeObj = null;
const { prop: safeProp = "default" } = safeObj || {};
console.log("  Safe destructuring:", safeProp); // "default"

// Pitfall: Readability issues with deep nesting
// - More than 2-3 levels reduces readability
// Bad:
// const { a: { b: { c: { d } } } } = obj;
// Better: Destructure in steps or use helper functions

// Pitfall: Default values only apply for undefined
const { zero = 1 } = { zero: 0 };
const { empty = "default" } = { empty: "" };
const { nullish = "default" } = { nullish: null };
console.log("\nDefault Value Behavior:");
console.log("  0 does not trigger default:", zero); // 0
console.log("  Empty string does not trigger default:", empty); // ""
console.log("  null does not trigger default:", nullish); // null

// Best Practice: When to use destructuring
// 1. Function parameters - improves readability, clarifies required params
// 2. Swapping variables - concise and elegant
// 3. Extracting data from API responses
// 4. React hooks: const [state, setState] = useState()

// Best Practice: Configuration object pattern
function initApp({
  port = 3000,
  host = "localhost",
  debug = false,
  database = { url: "localhost", port: 5432 },
} = {}) {
  console.log("\nConfiguration Object Pattern Example:");
  console.log(`  Server: ${host}:${port}, Debug: ${debug}`);
  console.log(`  Database: ${database.url}:${database.port}`);
}
initApp({ port: 8080, debug: true });

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 06-1-arrays-basics.js - Array basics");
console.log("📘 08-objects.js - Objects and methods");
console.log("📘 07-1-functions-basics.js - Function parameters");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 09-destructuring-ts-comparison.ts
*/
