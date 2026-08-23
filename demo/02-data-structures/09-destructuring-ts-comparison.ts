// TypeScript vs JavaScript: Destructuring Comparison
// 📘 For JavaScript examples, see: 09-destructuring.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
export {};

// ============================================================================
// 1. ARRAY DESTRUCTURING WITH TYPE ANNOTATIONS
// ============================================================================

// JavaScript: No type checking, can destructure any iterable
// const [a, b, c] = [1, 2, 3]; // No type information
// const [x, y] = ["hello"]; // y is undefined, no error

// TypeScript: Type annotations ensure type safety
const [tsA, tsB, tsC]: [number, number, number] = [1, 2, 3];
console.log("=== Array Destructuring with Types ===");
console.log("Numbers:", { tsA, tsB, tsC }); // All typed as number

// Type inference works too
const [inferredA, inferredB] = [1, "hello"]; // [number, string]
console.log("Inferred:", { inferredA, inferredB });

// ⚠️ PITFALL: Destructuring beyond array length doesn't error at compile time
const [onlyOne] = [1, 2, 3]; // Only takes first element
const arrForDestr: number[] = [1, 2, 3];
const [first, second, third, fourth] = arrForDestr; // fourth is undefined
console.log("Beyond length:", { first, second, third, fourth });

// ✅ BEST PRACTICE: Use tuple types for fixed-length arrays
const tuple: [number, string, boolean] = [1, "hello", true];
const [tNum, tStr, tBool] = tuple;
console.log("Tuple destructuring:", { tNum, tStr, tBool });

// ============================================================================
// 2. OBJECT DESTRUCTURING WITH TYPE ANNOTATIONS
// ============================================================================

// JavaScript: No type checking on destructured properties
// const { name, age } = { name: "Alice", age: 30 };
// No way to enforce what properties should exist

// TypeScript: Destructuring with inline type annotation
const { name, age }: { name: string; age: number } = { name: "Alice", age: 30 };
console.log("\n=== Object Destructuring with Types ===");
console.log("Person:", { name, age });

// Using interface (preferred approach)
interface Person {
  name: string;
  age: number;
  city?: string;
}

const person: Person = { name: "Bob", age: 25, city: "NYC" };
const { name: personName, age: personAge, city } = person;
console.log("With interface:", { personName, personAge, city });

// ⚠️ CONFUSION POINT: Colon means renaming in destructuring, not type annotation
const obj = { value: 42 };
const { value: renamedValue }: { value: number } = obj;
// First colon is renaming, second colon (after destructuring) is type annotation
console.log("Renamed:", renamedValue);

// ============================================================================
// 3. DEFAULT VALUES WITH TYPES
// ============================================================================

// JavaScript: Default values work for undefined
// const [x = 10] = []; // x = 10
// const { name = "Guest" } = {}; // name = "Guest"

// TypeScript: Default values with proper typing
const [withDefault = 100]: [number?] = [];
console.log("\n=== Default Values with Types ===");
console.log("Array default:", withDefault); // 100

// Object destructuring with defaults
const {
  greeting = "Hello",
  target = "World",
}: { greeting?: string; target?: string } = { greeting: "Hi" };
console.log("Object defaults:", { greeting, target }); // "Hi", "World"

// Combining default with rename
const config: { port: number; host?: string } = { port: 3000 };
const { port: serverPort = 8080, host: serverHost = "localhost" } = config;
console.log("Renamed with defaults:", { serverPort, serverHost });

// ⚠️ PITFALL: null does not trigger default
const nullObj = { value: null };
const { value = "default" } = nullObj;
console.log("Null doesn't trigger default:", value); // null, not "default"

// ✅ SOLUTION: Use nullish coalescing or check explicitly
const safeValue = nullObj.value ?? "default";
console.log("With nullish coalescing:", safeValue);

// ============================================================================
// 4. REST ELEMENTS AND PROPERTIES TYPING
// ============================================================================

// JavaScript: Rest collects remaining items
// const [first, ...rest] = [1, 2, 3, 4, 5];

// TypeScript: Typed rest elements
const [restFirst, ...restElements]: [number, ...number[]] = [1, 2, 3, 4, 5];
console.log("\n=== Rest Elements Typing ===");
console.log("First:", restFirst); // 1 (number)
console.log("Rest:", restElements); // [2, 3, 4, 5] (number[])

// Rest with mixed types
const [strFirst, ...numRest]: [string, ...number[]] = ["start", 1, 2, 3];
console.log("Mixed rest:", { strFirst, numRest });

// Object rest properties (ES2018)
const fullObj = { a: 1, b: 2, c: 3, d: 4 };
const { a, ...remaining }: { a: number } & Record<string, number> = fullObj;
console.log("\n=== Rest Properties ===");
console.log("Extracted:", a);
console.log("Remaining:", remaining); // { b: 2, c: 3, d: 4 }

// ⚠️ PITFALL: Rest elements must be last
// const [...all, last] = [1, 2, 3]; // ❌ Error: Rest element must be last

// ============================================================================
// 5. FUNCTION PARAMETER DESTRUCTURING TYPING
// ============================================================================

// JavaScript: Destructure in parameters without types
// function greet({ name, age }) {
//   return `Hello ${name}, you are ${age}`;
// }

// TypeScript: Inline type annotation for destructured parameters
function greetPerson({ name, age }: { name: string; age: number }): string {
  return `Hello ${name}, you are ${age} years old`;
}

console.log("\n=== Function Parameter Destructuring ===");
console.log(greetPerson({ name: "Alice", age: 30 }));

// Using interface (cleaner for complex cases)
interface UserConfig {
  username: string;
  isActive: boolean;
  role?: string;
}

function configureUser({
  username,
  isActive,
  role = "user",
}: UserConfig): string {
  return `${username} (${role}) - ${isActive ? "active" : "inactive"}`;
}

console.log(configureUser({ username: "bob", isActive: true }));
console.log(
  configureUser({ username: "alice", isActive: false, role: "admin" })
);

// Array parameter destructuring
function sumPair([a, b]: [number, number]): number {
  return a + b;
}

console.log("Sum pair:", sumPair([10, 20]));

// Complex nested destructuring
interface ComplexUser {
  profile: {
    firstName: string;
    lastName: string;
  };
  settings: {
    theme: string;
    notifications: boolean;
  };
}

function getUserDisplayName({
  profile: { firstName, lastName },
}: ComplexUser): string {
  return `${firstName} ${lastName}`;
}

const complexUser: ComplexUser = {
  profile: { firstName: "John", lastName: "Doe" },
  settings: { theme: "dark", notifications: true },
};

console.log("Display name:", getUserDisplayName(complexUser));

// ============================================================================
// 6. TUPLE DESTRUCTURING
// ============================================================================

// JavaScript: Arrays have no fixed length or position types
// const coords = [10, 20]; // Could have more elements

// TypeScript: Tuple types enforce structure
type Point2D = [number, number];
type Point3D = [number, number, number];

const point2D: Point2D = [10, 20];
const [x2d, y2d] = point2D;
console.log("\n=== Tuple Destructuring ===");
console.log("2D Point:", { x2d, y2d });

const point3D: Point3D = [10, 20, 30];
const [x3d, y3d, z3d] = point3D;
console.log("3D Point:", { x3d, y3d, z3d });

// Named tuple elements (TypeScript 4.0+)
type RGB = [red: number, green: number, blue: number];
const color: RGB = [255, 128, 0];
const [red, green, blue] = color;
console.log("RGB:", { red, green, blue });

// Optional tuple elements
type OptionalCoords = [number, number, number?];
const coords2D: OptionalCoords = [10, 20];
const coords3D: OptionalCoords = [10, 20, 30];
const [cx, cy, cz] = coords2D; // cz: number | undefined
console.log("Optional coords:", { cx, cy, cz });

// ⚠️ PITFALL: Tuple push/pop is not type-safe
const mutableTuple: [number, string] = [1, "hello"];
mutableTuple.push(999); // ⚠️ Allowed but breaks tuple contract!
console.log("After push:", mutableTuple); // [1, "hello", 999]

// ✅ SOLUTION: Use readonly tuples
const readonlyTuple: readonly [number, string] = [1, "hello"];
// readonlyTuple.push(999); // ❌ Error: Property 'push' does not exist

// ============================================================================
// 7. COMPUTED PROPERTY NAME DESTRUCTURING
// ============================================================================

// JavaScript: Dynamic property names with bracket notation
// const key = "dynamicKey";
// const { [key]: value } = { dynamicKey: "value123" };

// TypeScript: Computed properties need type assertions or index signatures
const dynamicKey = "value";
const dynamicObj: Record<string, string> = { value: "dynamic value" };
const { [dynamicKey]: dynamicValue } = dynamicObj;
console.log("\n=== Computed Property Destructuring ===");
console.log("Dynamic value:", dynamicValue);

// With known keys using type assertion
interface KnownKeys {
  value1: string;
  value2: string;
}

const knownObj: KnownKeys = { value1: "first", value2: "second" };
const selectedKey: keyof KnownKeys = "value1";
const { [selectedKey]: selectedValue } = knownObj;
console.log("Selected:", selectedValue);

// ============================================================================
// 8. NESTED DESTRUCTURING PATTERNS
// ============================================================================

// JavaScript: Can destructure nested structures
// const { a: { b: { c } } } = { a: { b: { c: 42 } } };

// TypeScript: Nested destructuring with full type safety
interface NestedStructure {
  outer: {
    inner: {
      value: number;
      name: string;
    };
    metadata: {
      created: Date;
    };
  };
}

const nestedData: NestedStructure = {
  outer: {
    inner: { value: 42, name: "answer" },
    metadata: { created: new Date() },
  },
};

// Deep destructuring
const {
  outer: {
    inner: { value: nestedValue, name: nestedName },
    metadata: { created },
  },
} = nestedData;

console.log("\n=== Nested Destructuring ===");
console.log("Nested values:", { nestedValue, nestedName, created });

// Mixed array and object nesting
interface MixedNested {
  users: Array<{ id: number; name: string }>;
  settings: { active: boolean };
}

const mixedData: MixedNested = {
  users: [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ],
  settings: { active: true },
};

const {
  users: [firstUser, secondUser],
  settings: { active },
} = mixedData;

console.log("Mixed nested:", { firstUser, secondUser, active });

// ⚠️ PITFALL: Deep destructuring reduces readability
// Consider using intermediate variables for deeply nested structures

// ============================================================================
// 9. DESTRUCTURING WITH ITERABLES
// ============================================================================

// JavaScript: Works with any iterable
// const [char1, char2] = "Hello";
// const [setItem] = new Set([1, 2, 3]);

// TypeScript: Type inference from iterables
const [char1, char2, ...restChars] = "Hello";
console.log("\n=== Destructuring Iterables ===");
console.log("String chars:", { char1, char2, restChars });

// Set destructuring
const [setFirst, setSecond] = new Set([1, 2, 3]);
console.log("Set items:", { setFirst, setSecond });

// Map entries destructuring
const userMap = new Map<string, string | number>([
  ["id", 1],
  ["name", "Alice"],
]);
const [[firstKey, firstValue], [secondKey, secondValue]] = userMap;
console.log("Map entries:", { firstKey, firstValue, secondKey, secondValue });

// ============================================================================
// 10. DESTRUCTURING TO DECLARED VARIABLES
// ============================================================================

// JavaScript: Need parentheses when assigning to existing variables
// let a, b;
// ({ a, b } = { a: 1, b: 2 });

// TypeScript: Same syntax with type safety
let existingA: number;
let existingB: string;
({ a: existingA, b: existingB } = { a: 10, b: "hello" });
console.log("\n=== Destructuring to Declared Variables ===");
console.log("Existing:", { existingA, existingB });

// Array destructuring to existing variables
let arrX: number, arrY: number;
[arrX, arrY] = [100, 200];
console.log("Array to existing:", { arrX, arrY });

// ============================================================================
// 11. SWAPPING VARIABLES
// ============================================================================

// JavaScript: Array destructuring swap
// let x = 1, y = 2;
// [x, y] = [y, x];

// TypeScript: Type-safe swap (types must match)
let swapA: number = 1;
let swapB: number = 2;
[swapA, swapB] = [swapB, swapA];
console.log("\n=== Swapping Variables ===");
console.log("After swap:", { swapA, swapB });

// Works with any type
let swapX: string = "first";
let swapY: string = "second";
[swapX, swapY] = [swapY, swapX];
console.log("String swap:", { swapX, swapY });

// ============================================================================
// 12. FOR...OF LOOP DESTRUCTURING
// ============================================================================

// JavaScript: Destructure in for...of
// for (const { id, name } of users) { ... }

// TypeScript: Fully typed destructuring in loops
interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

console.log("\n=== for...of Destructuring ===");
for (const { id, name } of users) {
  console.log(`  User ${id}: ${name}`);
}

// With Map entries
const configMap = new Map<string, string | number>([
  ["host", "localhost"],
  ["port", 3000],
]);
console.log("\nMap iteration:");
for (const [key, value] of configMap) {
  console.log(`  ${key}: ${value}`);
}

// With entries() for index access
const items = ["a", "b", "c"];
console.log("\nWith index:");
for (const [index, value] of items.entries()) {
  console.log(`  ${index}: ${value}`);
}

// ============================================================================
// 13. COMMON PITFALLS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Destructuring null/undefined throws error
// const { prop } = null; // Runtime error!

// ✅ SOLUTION: Use default value with nullish coalescing
const safeNull: { value?: string } | null = null;
const { value: safeValue1 = "default" } = safeNull ?? {};
console.log("Safe destructuring:", safeValue1);

// PITFALL 2: Shallow readonly doesn't protect nested structures
const shallowReadonly: readonly { name: string }[] = [{ name: "Alice" }];
// shallowReadonly.push({ name: "Bob" }); // ❌ Error
shallowReadonly[0].name = "Bob"; // ✅ Allowed! Shallow readonly
console.log("Shallow readonly mutated:", shallowReadonly);

// PITFALL 3: Type narrowing doesn't work with destructured union types
type Animal =
  { kind: "dog"; bark: () => void } | { kind: "cat"; meow: () => void };

function makeSound(animal: Animal): void {
  // Direct property access with type guard works
  if (animal.kind === "dog") {
    animal.bark();
  } else {
    animal.meow();
  }
}

// After destructuring, type guards need careful handling
function makeSoundDestructured(animal: Animal): void {
  const { kind } = animal;
  if (kind === "dog") {
    // animal is narrowed, but kind alone doesn't narrow
    (animal as Extract<Animal, { kind: "dog" }>).bark();
  }
}

// PITFALL 4: Destructuring creates new bindings, not references
let originalX = 10;
let originalY = 20;
const coordObj = { x: originalX, y: originalY };
let { x: refX, y: refY } = coordObj;
refX = 100; // Only changes refX, not coordObj.x or originalX
console.log("\nReference vs value:", { refX, originalX, objX: coordObj.x });

// ============================================================================
// 14. BEST PRACTICES SUMMARY
// ============================================================================

/*
✅ DO:
1. Use explicit type annotations for destructured function parameters
2. Define interfaces for complex destructuring patterns
3. Use readonly tuples for fixed-length, immutable arrays
4. Provide default values for potentially undefined properties
5. Use named tuple elements for clarity: [x: number, y: number]
6. Destructure iterables directly in for...of loops
7. Use Record<string, T> for dynamic property access
8. Combine destructuring with nullish coalescing for safety
9. Use optional tuple elements: [number, number, number?]
10. Prefer interfaces over inline type annotations for reusability

❌ DON'T:
1. Destructure beyond 2-3 levels deep (reduces readability)
2. Forget that null doesn't trigger default values
3. Use mutable tuples when immutability is required
4. Ignore that readonly is shallow for nested structures
5. Rely on type inference when the source type is unclear
6. Use destructuring when you need the original reference
7. Forget to handle undefined from optional properties
8. Mix renaming and type annotations confusingly
9. Use any[] instead of proper tuple types
10. Destructure without checking for null/undefined in unsafe contexts

⚠️ WATCH OUT FOR:
1. Destructuring null/undefined throws TypeError
2. Default values only work for undefined, not null
3. Tuple push/pop bypasses length constraints
4. Deep destructuring hurts readability
5. Shallow readonly allows nested mutation
6. Type narrowing with destructured discriminant properties
7. Array index destructuring creates undefined for missing elements
8. Object rest collects all enumerable own properties
9. Computed property destructuring requires index signatures
10. Colon in destructuring means rename, not type (type comes after pattern)

🎯 MIGRATION TIPS: JS → TS
1. Add types to all destructured function parameters
2. Convert fixed-length arrays to tuples: [number, number]
3. Add readonly for immutable arrays
4. Use interfaces for object destructuring patterns
5. Handle null/undefined explicitly with default values
6. Replace deep destructuring with intermediate variables + types
7. Use named tuple elements for coordinate pairs
8. Add type guards when destructuring union types
9. Use Record<K, V> for dynamic key access
10. Enable strictNullChecks for better safety

📘 SUMMARY: TYPESCRIPT BENEFITS FOR DESTRUCTURING
✅ Compile-time type safety for destructured values
✅ Better IDE autocomplete for destructured properties
✅ Tuple types enforce array structure
✅ Interface reuse across multiple destructuring sites
✅ Type narrowing with discriminated unions
✅ Catch undefined access at compile time
✅ Self-documenting code with explicit types
✅ Refactoring support across the codebase

⚠️ Learning curve for complex generic patterns
⚠️ Some edge cases (tuple mutation, shallow readonly)
⚠️ Verbose syntax for complex nested structures

🎯 RECOMMENDATION: Use TypeScript for all production code!
*/

// ============================================================================
// 15. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript Destructuring ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Basic destructuring        │       ✓         │       ✓         │
│ Type annotations           │       ✗         │       ✓         │
│ Tuple types                │       ✗         │       ✓         │
│ Named tuple elements       │       ✗         │       ✓         │
│ Readonly arrays            │       ✗         │       ✓         │
│ Interface-based patterns   │       ✗         │       ✓         │
│ Compile-time safety        │       ✗         │       ✓         │
│ IDE autocomplete           │       ✗         │       ✓         │
│ Type inference             │       ✗         │       ✓         │
│ Rest elements typing       │       ✗         │       ✓         │
│ Default value checking     │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds type safety to JavaScript destructuring
2. Tuple types provide fixed-length array safety
3. Interfaces enable reusable destructuring patterns
4. Runtime behavior is identical to JavaScript
5. Type annotations are erased during compilation
6. Use TypeScript for better code quality and maintainability
`);

console.log("\n=== TypeScript provides type safety at compile time ===");
console.log("=== But runtime behavior follows JavaScript rules ===");
