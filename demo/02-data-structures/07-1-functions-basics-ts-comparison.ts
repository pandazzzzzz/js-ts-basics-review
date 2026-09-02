// Functions - Basics TypeScript Comparison
// 📘 Complementary to: 07-1-functions-basics.js

// 🎯 Difficulty: Beginner
export {};

console.log("=== Functions - Basics TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. FUNCTION DECLARATION TYPES
 *    JS:  function name() {} - Hoisted, has 'this' binding, 'arguments' object
 *    TS:  Type annotations on parameters and return, 'this' can be typed
 *
 * 2. ARROW FUNCTIONS
 *    JS:  () => {} - Lexical 'this', no 'arguments', no prototype
 *    TS:  'this' is typed as any (can be constrained), return type inferred
 *
 * 3. DEFAULT PARAMETERS
 *    JS:  function(param = default) {}
 *    TS:  Default values can be any type, type inferred from default
 *
 * 4. REST PARAMETERS
 *    JS:  function(...rest) {} - rest is array
 *    TS:  rest is typed array: ...rest: number[]
 */

// Example 1: Typed function declarations
console.log("1. Typed function declarations:");
function add(a: number, b: number): number {
  return a + b;
}
console.log("  add(5, 3):", add(5, 3));

interface User {
  id: number;
  name: string;
  age: number;
}

function createUser(name: string, age: number): User {
  return { id: Date.now(), name, age };
}
console.log("  createUser('Alice', 30):", createUser("Alice", 30));

// Example 2: Arrow functions with types
console.log("\n2. Arrow functions with types:");
const multiply = (a: number, b: number): number => a * b;
console.log("  multiply(4, 7):", multiply(4, 7));

const makeUser = (id: number, name: string, age: number): User => ({
  id,
  name,
  age,
});
console.log("  makeUser(1, 'Bob', 25):", makeUser(1, "Bob", 25));

// Example 3: Default parameters
console.log("\n3. Default parameters:");
function greet(name: string = "Guest", greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}
console.log("  greet():", greet());
console.log("  greet('Alice'):", greet("Alice"));
console.log("  greet('Bob', 'Hi'):", greet("Bob", "Hi"));

const getDefaultConfig = (): { port: number; host: string } => ({
  port: 3000,
  host: "localhost",
});
function createConfig(override: ReturnType<typeof getDefaultConfig> = getDefaultConfig()): void {
  console.log("  Config:", override);
}

// Example 4: Rest parameters
console.log("\n4. Rest parameters:");
function sum(first: number, second: number, ...rest: number[]): number {
  console.log("  rest:", rest);
  return first + second + rest.reduce((acc, n) => acc + n, 0);
}
console.log("  sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));

function processObject(params: { name: string; [key: string]: any }): void {
  const { name, ...otherInfo } = params;
  console.log("  Name:", name);
  console.log("  Other info:", otherInfo);
}

processObject({
  name: "Charlie",
  age: 28,
  city: "NYC",
});

// Example 5: Function types as values
console.log("\n5. Function types:");
type MathFn = (a: number, b: number) => number;
const subtract: MathFn = (a, b) => a - b;
console.log("  subtract(10, 3):", subtract(10, 3));

interface UserContext {
  name: string;
  greet: (greeting: string) => string;
}

const user: UserContext = {
  name: "Alice",
  greet(greeting: string): string {
    return `${greeting}, ${this.name}!`;
  },
};
console.log("  user.greet('Hello'):", user.greet("Hello"));

// Example 6: Overloading
console.log("\n6. Function overloading:");
function display(value: string): void;
function display(value: number): void;
function display(value: boolean): void;
function display(value: unknown[]): void;
function display(value: any): void {
  console.log("  display:", value);
}

display("hello");
display(42);
display(true);
display([1, 2, 3]);

// Example 7: Optional parameters
console.log("\n7. Optional parameters:");
function fetchData(url: string, timeout?: number): Promise<string> {
  console.log(`Fetching ${url}${timeout ? ` (timeout: ${timeout})` : ""}`);
  return Promise.resolve("data");
}

fetchData("https://api.example.com");
fetchData("https://api.example.com", 5000);

// Example 8: Return type inference
console.log("\n8. Return type inference:");
const getName = (id: number) => `User ${id}`;

const getUserById = (id: number): User => ({
  id,
  name: `User ${id}`,
  age: 0,
});

// Example 9: Void return type
console.log("\n9. Void return type:");
function logAndReturn(message: string): void {
  console.log(message);
}

// Example 10: Never return type
function throwError(message: string): never {
  throw new Error(message);
}

// Example 11: Async function types
console.log("\n11. Async function types:");
async function fetchUser<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as T;
}

/**
 * 📋 Key Takeaways:
 * - Function declarations support type annotations on parameters and return
 * - Arrow functions infer return types, need parentheses for object literals
 * - Default parameters can be typed, type inferred from default value
 * - Rest parameters are typed arrays: ...rest: number[]
 * - Function types can be defined and reused: type Fn = (a: A) => B
 */
