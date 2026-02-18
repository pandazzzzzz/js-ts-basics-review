// TypeScript vs JavaScript: Control Flow Comparison
// This file demonstrates key differences, pitfalls, and best practices
// 📘 For JavaScript basics, see: 03-control-flow.js

// Make this file a module to avoid global scope conflicts
export {};

// ============================================
// 1. If/Else with Type Narrowing
// ============================================

// TypeScript provides type narrowing in conditional blocks
function processValue(value: string | number | null) {
  if (value === null) {
    // TypeScript knows value is null here
    console.log("Value is null");
    return;
  }
  
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log("String length:", value.length);
    console.log("Uppercase:", value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log("Number squared:", value ** 2);
    console.log("Fixed decimal:", value.toFixed(2));
  }
}

// Example usage
processValue("hello");
processValue(42);
processValue(null);

// ✅ BEST PRACTICE: Use type guards for complex types
interface User {
  name: string;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

function isAdmin(user: User | Admin): user is Admin {
  return "permissions" in user;
}

function handleUser(user: User | Admin) {
  console.log("User name:", user.name);
  
  if (isAdmin(user)) {
    // TypeScript knows user is Admin here
    console.log("Permissions:", user.permissions.join(", "));
  }
}

// Example usage
const regularUser: User = { name: "Alice", email: "alice@example.com" };
const adminUser: Admin = { name: "Bob", email: "bob@example.com", permissions: ["read", "write"] };
handleUser(regularUser);
handleUser(adminUser);

// ============================================
// 2. Switch with Exhaustiveness Checking
// ============================================

// TypeScript can enforce that all cases are handled with union types
type Status = "pending" | "approved" | "rejected";

function getStatusMessage(status: Status): string {
  switch (status) {
    case "pending":
      return "Waiting for approval";
    case "approved":
      return "Request approved";
    case "rejected":
      return "Request rejected";
    // If we add a new status to the union, TypeScript will error here
    // unless we add a case for it
  }
}

// Example usage
console.log("\nSwitch with exhaustiveness:");
console.log(getStatusMessage("pending"));
console.log(getStatusMessage("approved"));

// ✅ BEST PRACTICE: Use never type for exhaustiveness checking
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

function getStatusColor(status: Status): string {
  switch (status) {
    case "pending":
      return "yellow";
    case "approved":
      return "green";
    case "rejected":
      return "red";
    default:
      // If all cases are handled, this is unreachable
      // If we add a new status, TypeScript will error here
      return assertNever(status);
  }
}

console.log("Status color:", getStatusColor("approved"));

// ============================================
// 3. Discriminated Unions with Switch
// ============================================

// TypeScript's discriminated unions work perfectly with switch statements
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "rectangle"; width: number; height: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript knows shape has radius property
      return Math.PI * shape.radius ** 2;
    case "square":
      // TypeScript knows shape has size property
      return shape.size ** 2;
    case "rectangle":
      // TypeScript knows shape has width and height properties
      return shape.width * shape.height;
  }
}

// Example usage
console.log("\nDiscriminated unions:");
console.log("Circle area:", getArea({ kind: "circle", radius: 5 }));
console.log("Square area:", getArea({ kind: "square", size: 4 }));
console.log("Rectangle area:", getArea({ kind: "rectangle", width: 3, height: 6 }));

// ============================================
// 4. For Loops with Type Inference
// ============================================

// TypeScript infers types in for loops
const numbers: number[] = [1, 2, 3, 4, 5];

console.log("\nFor loop with type inference:");
for (let i = 0; i < numbers.length; i++) {
  // TypeScript knows numbers[i] is number
  const squared = numbers[i] ** 2;
  console.log(`${numbers[i]} squared is ${squared}`);
}

// for...of with type inference
const fruits: string[] = ["apple", "banana", "cherry"];

console.log("\nFor...of with type inference:");
for (const fruit of fruits) {
  // TypeScript knows fruit is string
  console.log("Fruit uppercase:", fruit.toUpperCase());
}

// for...of with tuples
const entries: [string, number][] = [
  ["apple", 5],
  ["banana", 3],
  ["cherry", 8]
];

console.log("\nFor...of with tuples:");
for (const [name, count] of entries) {
  // TypeScript knows name is string and count is number
  console.log(`${name}: ${count} items`);
}

// ============================================
// 5. For...in with Index Signatures
// ============================================

// TypeScript requires proper typing for for...in loops
interface StringMap {
  [key: string]: string;
}

const colors: StringMap = {
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF"
};

console.log("\nFor...in with index signature:");
for (const key in colors) {
  // TypeScript knows colors[key] is string
  console.log(`${key}: ${colors[key]}`);
}

// ⚠️ PITFALL: for...in with objects without index signature
interface Person {
  name: string;
  age: number;
}

const person: Person = {
  name: "Alice",
  age: 30
};

console.log("\nFor...in with typed object:");
for (const key in person) {
  // TypeScript knows key is "name" | "age"
  // But person[key] requires type assertion or proper handling
  console.log(`${key}: ${person[key as keyof Person]}`);
}

// ✅ BETTER: Use Object.entries() for type safety
console.log("\nObject.entries() for type safety:");
for (const [key, value] of Object.entries(person)) {
  console.log(`${key}: ${value}`);
}

// ============================================
// 6. While Loops with Type Narrowing
// ============================================

// TypeScript tracks type changes through while loops
function processQueue(queue: (string | number)[]): void {
  while (queue.length > 0) {
    const item = queue.shift();
    
    // TypeScript knows item is string | number | undefined
    if (item === undefined) {
      break;
    }
    
    // Type narrowing within while loop
    if (typeof item === "string") {
      console.log("String item:", item.toUpperCase());
    } else {
      console.log("Number item:", item.toFixed(2));
    }
  }
}

// Example usage
console.log("\nWhile loop with type narrowing:");
processQueue(["hello", 42, "world", 3.14]);

// ============================================
// 7. Control Flow Analysis
// ============================================

// TypeScript performs sophisticated control flow analysis
function example(x: string | number | boolean) {
  if (typeof x === "string") {
    // x is string
    console.log("String:", x.toUpperCase());
    return;
  }
  
  // x is number | boolean (string eliminated)
  if (typeof x === "number") {
    // x is number
    console.log("Number:", x.toFixed(2));
    return;
  }
  
  // x is boolean (string and number eliminated)
  console.log("Boolean:", x ? "true" : "false");
}

// Example usage
console.log("\nControl flow analysis:");
example("hello");
example(42);
example(true);

// ============================================
// 8. Nullable Types and Control Flow
// ============================================

// TypeScript tracks null/undefined through control flow
function getLength(value: string | null | undefined): number {
  // Early return pattern with type narrowing
  if (value === null) {
    console.log("Value is null");
    return 0;
  }
  
  if (value === undefined) {
    console.log("Value is undefined");
    return 0;
  }
  
  // TypeScript knows value is string here
  return value.length;
}

// Example usage
console.log("\nNullable types:");
console.log("Length:", getLength("hello"));
console.log("Length:", getLength(null));
console.log("Length:", getLength(undefined));

// ✅ BEST PRACTICE: Use optional chaining and nullish coalescing
function getLengthSafe(value: string | null | undefined): number {
  return value?.length ?? 0;
}

console.log("Safe length:", getLengthSafe("world"));
console.log("Safe length:", getLengthSafe(null));

// ============================================
// 9. Array Type Safety in Loops
// ============================================

// TypeScript ensures type safety when iterating arrays
interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "Laptop", price: 999 },
  { id: 2, name: "Mouse", price: 25 },
  { id: 3, name: "Keyboard", price: 75 }
];

console.log("\nArray type safety:");
for (const product of products) {
  // TypeScript knows product has id, name, and price
  console.log(`${product.name}: $${product.price.toFixed(2)}`);
}

// Type-safe filtering
const expensiveProducts = products.filter(p => p.price > 50);
console.log("Expensive products:", expensiveProducts.map(p => p.name));

// ============================================
// 10. Break and Continue with Type Safety
// ============================================

// TypeScript ensures type safety even with break/continue
function findFirstEven(numbers: number[]): number | undefined {
  for (const num of numbers) {
    if (num % 2 === 0) {
      return num; // TypeScript knows return type is number
    }
  }
  return undefined; // TypeScript knows return type can be undefined
}

// Example usage
console.log("\nFind first even:");
console.log("First even:", findFirstEven([1, 3, 5, 8, 9]));
console.log("First even:", findFirstEven([1, 3, 5, 7]));

// ============================================
// 11. Const Assertions in Loops
// ============================================

// TypeScript's const assertions work with loops
const statusList = ["pending", "approved", "rejected"] as const;
type StatusType = typeof statusList[number]; // "pending" | "approved" | "rejected"

console.log("\nConst assertions:");
for (const status of statusList) {
  // TypeScript knows status is "pending" | "approved" | "rejected"
  console.log("Status:", status);
}

// ============================================
// 12. Generic Functions with Control Flow
// ============================================

// TypeScript generics work with control flow
function findItem<T>(items: T[], predicate: (item: T) => boolean): T | undefined {
  for (const item of items) {
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}

// Example usage with type inference
console.log("\nGeneric find:");
const foundNumber = findItem([1, 2, 3, 4, 5], n => n > 3);
console.log("Found number:", foundNumber); // Type: number | undefined

const foundString = findItem(["apple", "banana", "cherry"], s => s.startsWith("b"));
console.log("Found string:", foundString); // Type: string | undefined

// ============================================
// 13. Enum with Switch Statements
// ============================================

// TypeScript enums work well with switch statements
enum Direction {
  North = "NORTH",
  South = "SOUTH",
  East = "EAST",
  West = "WEST"
}

function getOpposite(direction: Direction): Direction {
  switch (direction) {
    case Direction.North:
      return Direction.South;
    case Direction.South:
      return Direction.North;
    case Direction.East:
      return Direction.West;
    case Direction.West:
      return Direction.East;
  }
}

// Example usage
console.log("\nEnum with switch:");
console.log("Opposite of North:", getOpposite(Direction.North));
console.log("Opposite of East:", getOpposite(Direction.East));

// ============================================
// 14. Type Predicates in Conditions
// ============================================

// Type predicates provide powerful type narrowing
interface Cat {
  type: "cat";
  meow: () => void;
}

interface Dog {
  type: "dog";
  bark: () => void;
}

type Animal = Cat | Dog;

function isCat(animal: Animal): animal is Cat {
  return animal.type === "cat";
}

function isDog(animal: Animal): animal is Dog {
  return animal.type === "dog";
}

function makeSound(animal: Animal) {
  if (isCat(animal)) {
    // TypeScript knows animal is Cat
    animal.meow();
  } else if (isDog(animal)) {
    // TypeScript knows animal is Dog
    animal.bark();
  }
}

// Example usage
const cat: Cat = { type: "cat", meow: () => console.log("Meow!") };
const dog: Dog = { type: "dog", bark: () => console.log("Woof!") };

console.log("\nType predicates:");
makeSound(cat);
makeSound(dog);

// ============================================
// 15. Readonly Arrays in Loops
// ============================================

// TypeScript's readonly arrays prevent modification
function sumArray(numbers: readonly number[]): number {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
    // numbers.push(1); // ❌ Error: Cannot modify readonly array
  }
  return sum;
}

// Example usage
console.log("\nReadonly arrays:");
const readonlyNumbers: readonly number[] = [1, 2, 3, 4, 5];
console.log("Sum:", sumArray(readonlyNumbers));

// ============================================
// Common Pitfalls: JS vs TS Control Flow
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// PITFALL 1: Type narrowing doesn't persist across function calls
function pitfall1(value: string | number) {
  if (typeof value === "string") {
    // value is string here
    console.log("Before function call:", value.toUpperCase());
    
    // After any function call, TypeScript "forgets" the narrowing
    console.log("Some function call");
    
    // value is still string | number (narrowing lost)
    // console.log(value.toUpperCase()); // ❌ Error in strict mode
    
    // Need to narrow again
    if (typeof value === "string") {
      console.log("After re-narrowing:", value.toUpperCase());
    }
  }
}

pitfall1("hello");

// PITFALL 2: for...in still returns string keys
const obj = { a: 1, b: 2, c: 3 };

console.log("\nfor...in returns strings:");
for (const key in obj) {
  console.log(`Key type: ${typeof key}`); // "string"
  // key is string, not "a" | "b" | "c"
}

// PITFALL 3: Array methods don't narrow types automatically
const mixed: (string | number)[] = ["hello", 42, "world"];

console.log("\nArray methods don't auto-narrow:");
for (const item of mixed) {
  // item is string | number, not narrowed
  // item.toUpperCase(); // ❌ Error
  
  // Need explicit narrowing
  if (typeof item === "string") {
    console.log("String:", item.toUpperCase());
  }
}

// PITFALL 4: Switch doesn't narrow without discriminant
interface Circle {
  radius: number;
}

interface Square {
  size: number;
}

type ShapeUnion = Circle | Square;

function getAreaPitfall(shape: ShapeUnion): number {
  // ❌ This doesn't work - no discriminant property
  // switch (shape) {
  //   case shape.radius !== undefined:
  //     return Math.PI * shape.radius ** 2;
  //   case shape.size !== undefined:
  //     return shape.size ** 2;
  // }
  
  // ✅ Use type guards instead
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.size ** 2;
  }
}

console.log("Area with type guard:", getAreaPitfall({ radius: 5 }));

// ============================================
// Best Practices Summary
// ============================================

console.log("\n=== Best Practices ===\n");

/*
✅ DO:
1. Use type guards for complex type narrowing
2. Leverage discriminated unions with switch statements
3. Use const assertions for literal types
4. Prefer for...of over for...in for arrays
5. Use Object.entries() for type-safe object iteration
6. Implement exhaustiveness checking with never type
7. Use type predicates for reusable type narrowing
8. Leverage control flow analysis for type safety
9. Use readonly for arrays that shouldn't be modified
10. Prefer early returns over deep nesting

❌ DON'T:
1. Rely on type narrowing across function calls
2. Use for...in for arrays (use for...of instead)
3. Forget default case in switch with union types
4. Ignore TypeScript's exhaustiveness checking
5. Use type assertions to bypass type narrowing
6. Modify arrays during iteration
7. Use any to bypass control flow analysis
8. Forget to handle null/undefined cases
9. Use non-discriminated unions with switch
10. Nest conditionals too deeply

⚠️ WATCH OUT FOR:
1. Type narrowing is lost after function calls
2. for...in returns string keys, not literal types
3. Array methods don't automatically narrow types
4. Switch needs discriminant property for type narrowing
5. Break/continue affect control flow analysis
6. Readonly doesn't prevent nested property modification
7. Type guards must return boolean
8. Exhaustiveness checking requires proper return types
9. Optional chaining returns undefined
10. Nullish coalescing only checks null/undefined
*/

// Example: Comprehensive type-safe control flow
interface Success<T> {
  status: "success";
  data: T;
}

interface Error {
  status: "error";
  message: string;
}

type Result<T> = Success<T> | Error;

function handleResult<T>(result: Result<T>): void {
  switch (result.status) {
    case "success":
      // TypeScript knows result has data property
      console.log("Success:", result.data);
      break;
    case "error":
      // TypeScript knows result has message property
      console.log("Error:", result.message);
      break;
    default:
      // Exhaustiveness check
      const _exhaustive: never = result;
      throw new Error(`Unhandled result: ${_exhaustive}`);
  }
}

// Example usage
console.log("\nType-safe result handling:");
handleResult({ status: "success", data: { id: 1, name: "Test" } });
handleResult({ status: "error", message: "Something went wrong" });

console.log("\n=== TypeScript provides compile-time type safety ===");
console.log("=== Runtime behavior follows JavaScript rules ===");
console.log("=== Use TypeScript features for better control flow! ===");
