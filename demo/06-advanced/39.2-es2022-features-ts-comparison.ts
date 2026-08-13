// TypeScript vs JavaScript: ES2022 Features
// 📘 For JavaScript version, see: 39.2-es2022-features.js
/// <reference lib="es2022" />

export {}; // Module

console.log("\n=== TypeScript ES2022 Features Comparison ===\n");

// ============================================
// 1. Class Private Fields
// ============================================
console.log("\n--- 1. Class Private Fields ---\n");

// TypeScript enforces private field access at compile time
class User {
  #password: string; // Private field with type annotation
  public name: string;

  constructor(name: string, password: string) {
    this.name = name;
    this.#password = password;
  }

  verifyPassword(input: string): boolean {
    return this.#password === input;
  }
}

const user = new User("Alice", "secret123");
console.log("Public field user.name:", user.name);
console.log("verifyPassword('secret123'):", user.verifyPassword("secret123"));

// Compile-time error: Property '#password' is private and only accessible within class 'User'
// user.#password; // ❌ TypeScript error (caught before runtime!)

// Private fields are not part of the class type
type PublicUser = Omit<User, "#password">; // This doesn't work - #private fields are not in the type system
const publicUser: User = user; // Still includes private fields (enforced by compiler)

// Private methods
class Calculator {
  #add(a: number, b: number): number {
    return a + b;
  }

  sum(arr: number[]): number {
    return arr.reduce((total, num) => this.#add(total, num), 0);
  }
}

const calc = new Calculator();
console.log("Calculator sum([1,2,3]):", calc.sum([1,2,3])); // 6

// ============================================
// 2. Class Static Blocks
// ============================================
console.log("\n--- 2. Class Static Blocks ---\n");

// TypeScript fully supports static blocks with type checking
class Config {
  static apiUrl: string;
  static apiKey: string;
  static readonly timeout: number = 5000;

  static {
    // Type checking works inside static blocks
    const env = process?.env?.NODE_ENV || "development";
    this.apiUrl = env === "production" ? "https://api.prod.com" : "http://localhost:3000";
    this.apiKey = "default-key";
    // this.timeout = 10000; // ❌ Error: Cannot assign to 'timeout' because it is a read-only property
  }
}

console.log("Config.apiUrl:", Config.apiUrl);
console.log("Config.timeout:", Config.timeout);

// ============================================
// 3. .at() Method
// ============================================
console.log("\n--- 3. .at() Method ---\n");

// TypeScript provides proper types for .at() on arrays, strings, and TypedArrays
const arr: number[] = [10, 20, 30, 40, 50];
const first: number | undefined = arr.at(0); // Type is number | undefined
const last: number | undefined = arr.at(-1); // Type is number | undefined

console.log("First element:", first); // 10
console.log("Last element:", last); // 50

// Narrowing the type
if (last !== undefined) {
  console.log("Last element doubled:", last * 2); // ✅ No type error
}

// For strings
const str: string = "hello";
const char: string | undefined = str.at(-1);
console.log("Last character:", char); // "o"

// TypedArrays
const uint8: Uint8Array = new Uint8Array([1, 2, 3]);
const byte: number | undefined = uint8.at(-1);
console.log("Last byte:", byte); // 3

// ============================================
// 4. Object.hasOwn()
// ============================================
console.log("\n--- 4. Object.hasOwn() ---\n");

// TypeScript has strong typing for Object.hasOwn
interface UserData {
  name: string;
  age?: number;
}

const data: UserData = { name: "Alice", age: 30 };

// hasOwn acts as a type guard
if (Object.hasOwn(data, "age")) {
  // TypeScript narrows data.age to number (not undefined)
  console.log("Age:", data.age!.toFixed(0)); // ✅ Object.hasOwn confirms age exists
}

// Works with objects created from Object.create(null)
const nullObj = Object.create(null) as { [key: string]: any };
nullObj.x = 10;
console.log("Object.hasOwn(nullObj, 'x'):", Object.hasOwn(nullObj, "x")); // true

// Type narrowing for union types
type A = { type: "a"; a: string };
type B = { type: "b"; b: number };
type AB = A | B;

function processAB(ab: AB) {
  if (Object.hasOwn(ab, "a")) {
    console.log("Type A, a:", (ab as A).a); // ✅ cast to A after hasOwn check
  } else {
    console.log("Type B, b:", (ab as B).b); // ✅ cast to B
  }
}

processAB({ type: "a", a: "test" });
processAB({ type: "b", b: 42 });

// ============================================
// 5. Error.cause
// ============================================
console.log("\n--- 5. Error.cause ---\n");

// Error.cause is typed as unknown in TypeScript
function readConfig(path: string): never {
  try {
    throw new Error(`File not found: ${path}`);
  } catch (e) {
    // Cause is typed as unknown
    throw new Error("Failed to load configuration", { cause: e as Error });
  }
}

try {
  readConfig("config.json");
} catch (e) {
  const error = e as Error;
  console.log("Error message:", error.message);
  // Need to narrow cause type
  if (error.cause instanceof Error) {
    console.log("Cause message:", error.cause.message); // ✅ Type safe
  }
}

// Custom error with typed cause
class AppError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message, { cause });
    this.name = "AppError";
  }
}

try {
  throw new AppError("Operation failed", new Error("Network timeout"));
} catch (e) {
  const err = e as AppError;
  console.log("\nAppError:", err.message);
  if (err.cause) {
    console.log("Cause:", err.cause.message); // ✅ No type checking needed, cause is typed as Error | undefined
  }
}

// ============================================
// 6. Top-level await
// ============================================
console.log("\n--- 6. Top-level await ---\n");

// TypeScript supports top-level await when module is set to ESNext or higher
// Example (in module context):
// interface Config { apiUrl: string; apiKey: string }
// const config: Config = await import("./config.js");
// console.log("Config loaded:", config.apiUrl);

// Type inference works with top-level await
// const data = await fetch("/api/data").then(res => res.json());
// data is typed as any (or the type from fetch response)

// ============================================
// 7. RegExp Match Indices (/d flag)
// ============================================
console.log("\n--- 7. RegExp Match Indices ---\n");

// TypeScript properly types the indices array when using /d flag
const text = "Hello TypeScript!";
const regex = /Hello (\w+)/d;
const match = regex.exec(text);

if (match) {
  console.log("Full match:", match[0]);
  console.log("Group 1:", match[1]);
  const indices = match.indices!;
  console.log("Indices type:", typeof indices); // object
  console.log("Full match start:", indices[0][0]); // 0
  console.log("Full match end:", indices[0][1]); // 16
  console.log("Group 1 start:", indices[1][0]); // 6
  console.log("Group 1 end:", indices[1][1]); // 16
}

// Named capture groups with indices
const namedRegex = /Hello (?<lang>\w+)/d;
const namedMatch = namedRegex.exec(text);

if (namedMatch?.groups?.lang) {
  console.log("\nNamed group 'lang':", namedMatch.groups.lang);
  console.log("Named group indices:", namedMatch.indices!.groups?.lang); // [6, 16]
}

// ============================================
// 8. Ergonomic Brand Checks
// ============================================
console.log("\n--- 8. Ergonomic Brand Checks ---\n");

// TypeScript supports '#field in obj' checks with type narrowing
class User2 {
  #id: number;

  constructor(id: number) {
    this.#id = id;
  }

  static isUser(obj: unknown): obj is User2 {
    // Type guard: returns type predicate 'obj is User2'
    return #id in (obj as object);
  }

  getId(): number {
    return this.#id;
  }
}

const alice = new User2(1);
const bob = { name: "Bob" };

console.log("User2.isUser(alice):", User2.isUser(alice)); // true
console.log("User2.isUser(bob):", User2.isUser(bob)); // false

// Type narrowing works
function processUser(obj: unknown) {
  if (User2.isUser(obj)) {
    // obj is now typed as User2
    console.log("User ID:", obj.getId()); // ✅ No type error
  } else {
    console.log("Not a User2 object");
  }
}

processUser(alice);
processUser(bob);

// ============================================
// 9. TypeScript-specific Enhancements
// ============================================
console.log("\n--- 9. TypeScript-specific Enhancements ---\n");

// 1. Private field type checking
class TypeSafeClass {
  #value: number;

  constructor(value: number) {
    this.#value = value;
    // this.#value = "string"; // ❌ Error: Type 'string' is not assignable to type 'number'
  }
}

// 2. Exact optional property checks with hasOwn
interface Options {
  enabled?: boolean;
  timeout?: number;
}

function configure(options: Options) {
  if (Object.hasOwn(options, "enabled")) {
    // options.enabled is boolean | undefined (exact type)
    console.log("Enabled explicitly set to:", options.enabled);
  } else {
    console.log("Enabled not set, using default");
  }
}

configure({ enabled: true });
configure({});

// 3. Class field initialization checks (strictPropertyInitialization)
class StrictClass {
  // Must be initialized in constructor or definitely assigned
  name!: string; // ! = definite assignment assertion
  age: number;

  constructor(name?: string) {
    if (name) this.name = name;
    this.age = 30;
  }
}

// ============================================
// 10. Configuration
// ============================================
console.log("\n--- 10. tsconfig.json Configuration ---\n");
console.log("To use ES2022 features in TypeScript:");
console.log('1. Set "target": "ES2022" or higher');
console.log('2. Add "ES2022" to "lib" array if target is lower');
console.log('3. For top-level await: set "module": "ESNext" or "NodeNext"');
console.log('4. For private fields: no special config needed (supported since TS 3.8)');

console.log("\n✅ ES2022 TypeScript comparison completed");