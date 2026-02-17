// TypeScript vs JavaScript: Operators Comparison
// This file demonstrates key differences, pitfalls, and best practices
// 📘 For JavaScript basics, see: 02-operators.js

// Make this file a module to avoid global scope conflicts
export {};

// ============================================
// 1. Arithmetic Operators - Type Safety
// ============================================

// JavaScript: No type checking, allows mixed types
// let jsResult = 5 + "3"; // "53" (string concatenation)
// let jsCalc = "10" - 5; // 5 (implicit conversion)

// TypeScript: Type checking prevents common mistakes
let tsNumber1: number = 5;
let tsNumber2: number = 3;
let tsSum: number = tsNumber1 + tsNumber2; // ✅ OK: 8

// ❌ Type errors caught at compile time:
// let mixedSum: number = tsNumber1 + "3"; // Error: Type 'string' is not assignable to type 'number'
// let stringNum: number = "10" - 5; // Error: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type

// ✅ BEST PRACTICE: Be explicit with type conversions
let explicitSum: number = tsNumber1 + Number("3"); // ✅ OK: 8
let explicitString: string = tsNumber1.toString() + "3"; // ✅ OK: "53"

console.log("Arithmetic with type safety:");
console.log({ tsSum, explicitSum, explicitString });

// ⚠️ PITFALL: Exponentiation operator type inference
let power = 2 ** 3; // Type: number (inferred)
let typedPower: number = 2 ** 3; // Type: number (explicit)
// Both work, but explicit is clearer for complex expressions
console.log("Power examples:", { power, typedPower });

// ============================================
// 2. Comparison Operators - Type Narrowing
// ============================================

// TypeScript provides type narrowing with comparison operators
function processValue(value: string | number) {
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

processValue("hello"); // String operations available
processValue(42); // Number operations available

// ✅ BEST PRACTICE: Use type guards for type narrowing
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function safeProcess(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // ✅ TypeScript knows it's a string
  }
}

// Example usage
safeProcess("test");

// ⚠️ CONFUSION POINT: Strict equality with types
interface User {
  id: number;
  name: string;
}

const user1: User = { id: 1, name: "Alice" };
const user2: User = { id: 1, name: "Alice" };

console.log("\nObject comparison:");
console.log("user1 === user2:", user1 === user2); // false (different references)
console.log("user1.id === user2.id:", user1.id === user2.id); // true (same value)

// ============================================
// 3. Logical Operators - Type Narrowing
// ============================================

// TypeScript narrows types with logical operators
function getUserName(user: { name: string } | null): string {
  // Using && for type narrowing
  return user && user.name || "Guest";
}

// ✅ BETTER: Use optional chaining with nullish coalescing
function getBetterUserName(user: { name: string } | null): string {
  return user?.name ?? "Guest";
}

// Example usage
console.log("User name:", getUserName({ name: "Alice" }));
console.log("Better user name:", getBetterUserName(null));

// Type narrowing with ||
function getDefaultValue(value: string | null | undefined): string {
  return value || "default"; // Type: string
}

// Type narrowing with ??
function getNullishDefault(value: string | null | undefined): string {
  return value ?? "default"; // Type: string
}

console.log("\nLogical operators with type narrowing:");
console.log("With null:", getDefaultValue(null)); // "default"
console.log("With empty string:", getDefaultValue("")); // "default" (empty string is falsy)
console.log("Nullish with empty string:", getNullishDefault("")); // "" (empty string is not nullish)

// ⚠️ CRITICAL: Difference between || and ?? in TypeScript
const count1: number | null = 0;
const withOr = count1 || 10; // 10 (0 is falsy)
const withNullish = count1 ?? 10; // 0 (0 is not null/undefined)

console.log("|| with 0:", withOr); // 10
console.log("?? with 0:", withNullish); // 0

// ============================================
// 4. Nullish Coalescing - Type Safety
// ============================================

// TypeScript provides better type inference with ??
interface Config {
  port?: number;
  host?: string;
  timeout?: number;
}

const config: Config = {
  port: 0, // Valid port number
  timeout: undefined
};

// ✅ BEST PRACTICE: Use ?? for optional properties
const port = config.port ?? 3000; // Type: number, Value: 0
const host = config.host ?? "localhost"; // Type: string, Value: "localhost"
const timeout = config.timeout ?? 5000; // Type: number, Value: 5000

console.log("\nNullish coalescing with optional properties:");
console.log({ port, host, timeout });

// ⚠️ PITFALL: Using || with optional properties
const wrongPort = config.port || 3000; // 3000 (0 is falsy, but valid!)
console.log("Wrong port with ||:", wrongPort); // 3000 (incorrect!)

// ============================================
// 5. Optional Chaining - Type Safety
// ============================================

interface Address {
  street: string;
  city: string;
  zipCode?: string;
}

interface Person {
  name: string;
  age: number;
  address?: Address;
  getEmail?: () => string;
}

const person: Person = {
  name: "Alice",
  age: 30,
  address: {
    street: "123 Main St",
    city: "NYC"
  }
};

// ✅ TypeScript provides type safety with optional chaining
const city = person.address?.city; // Type: string | undefined
const zipCode = person.address?.zipCode; // Type: string | undefined
const email = person.getEmail?.(); // Type: string | undefined

console.log("\nOptional chaining with type safety:");
console.log({ city, zipCode, email });

// ⚠️ CONFUSION POINT: Optional chaining vs non-null assertion
const personWithoutAddress: Person = { name: "Bob", age: 25 };

// Safe way:
const safeCity = personWithoutAddress.address?.city; // undefined
console.log("Safe city access:", safeCity);

// Dangerous way (non-null assertion):
// const dangerousCity = personWithoutAddress.address!.city; // Runtime error!

// ✅ BEST PRACTICE: Use optional chaining, avoid non-null assertion

// ============================================
// 6. Typeof Operator - Type Guards
// ============================================

// TypeScript uses typeof for type narrowing
function processInput(input: string | number | boolean) {
  if (typeof input === "string") {
    // TypeScript knows input is string
    console.log("String:", input.toUpperCase());
  } else if (typeof input === "number") {
    // TypeScript knows input is number
    console.log("Number:", input.toFixed(2));
  } else {
    // TypeScript knows input is boolean
    console.log("Boolean:", input ? "true" : "false");
  }
}

// Example usage
processInput("hello");
processInput(42);

// ⚠️ PITFALL: typeof null === "object"
function checkNull(value: string | null) {
  if (typeof value === "object") {
    // This includes null! TypeScript knows this
    console.log("Value is null or object");
  }
  
  // ✅ CORRECT: Check for null explicitly
  if (value === null) {
    console.log("Value is null");
  } else {
    console.log("Value is string:", value.toUpperCase());
  }
}

// Example usage
checkNull(null);
checkNull("test");

// ============================================
// 7. Instanceof Operator - Type Guards
// ============================================

class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  speak(): string {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  breed: string;
  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }
  speak(): string {
    return `${this.name} barks!`;
  }
  fetch(): string {
    return `${this.name} fetches the ball`;
  }
}

function handleAnimal(animal: Animal) {
  console.log(animal.speak());
  
  // TypeScript narrows type with instanceof
  if (animal instanceof Dog) {
    // TypeScript knows animal is Dog here
    console.log(animal.fetch()); // ✅ OK
    console.log("Breed:", animal.breed); // ✅ OK
  }
}

const dog = new Dog("Rex", "Labrador");
handleAnimal(dog);

// ⚠️ CONFUSION POINT: instanceof with primitives
console.log("\ninstanceof with primitives:");
// @ts-expect-error - Demonstrating that primitives are not instances
console.log("'hello' instanceof String:", "hello" instanceof String); // false (primitive)
console.log("new String('hello') instanceof String:", new String("hello") instanceof String); // true (object)

// ============================================
// 8. Spread and Rest - Type Safety
// ============================================

// Spread with typed arrays
const numbers1: number[] = [1, 2, 3];
const numbers2: number[] = [4, 5, 6];
const combined: number[] = [...numbers1, ...numbers2]; // Type: number[]
console.log("Combined:", combined);

// ❌ Type error with mixed types:
// const mixed: number[] = [...numbers1, "string"]; // Error: Type 'string' is not assignable to type 'number'

// Spread with typed objects
interface BaseConfig {
  host: string;
  port: number;
}

interface ExtendedConfig extends BaseConfig {
  timeout: number;
  retries: number;
}

const baseConfig: BaseConfig = { host: "localhost", port: 3000 };
const extendedConfig: ExtendedConfig = {
  ...baseConfig,
  timeout: 5000,
  retries: 3
}; // ✅ OK

console.log("\nSpread with type safety:", extendedConfig);

// Rest parameters with types
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log("sum(1, 2, 3, 4):", sum(1, 2, 3, 4)); // ✅ OK
// sum(1, 2, "3"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

// ✅ BEST PRACTICE: Use rest parameters with explicit types
function greet(greeting: string, ...names: string[]): string {
  return `${greeting} ${names.join(", ")}!`;
}

// Example usage
console.log(greet("Hello", "Alice", "Bob"));

// ============================================
// 9. Assignment Operators - Type Safety
// ============================================

// TypeScript ensures type consistency with assignment operators
let typedNumber: number = 10;
typedNumber += 5; // ✅ OK: 15
typedNumber *= 2; // ✅ OK: 30
// typedNumber += "5"; // ❌ Error: Type 'string' is not assignable to type 'number'

// Logical assignment operators with type narrowing
interface Settings {
  theme?: "light" | "dark";
  fontSize?: number;
  autoSave?: boolean;
}

const settings: Settings = {};

// ??= with type safety
settings.theme ??= "light"; // Type: "light" | "dark" | undefined
settings.fontSize ??= 14; // Type: number | undefined
settings.autoSave ??= true; // Type: boolean | undefined

console.log("\nLogical assignment with types:", settings);

// ⚠️ PITFALL: ||= vs ??= with optional properties
const config2: { count?: number } = { count: 0 };
config2.count ||= 10; // 10 (0 is falsy)
console.log("||= with 0:", config2.count); // 10 (wrong!)

const config3: { count?: number } = { count: 0 };
config3.count ??= 10; // 0 (0 is not nullish)
console.log("??= with 0:", config3.count); // 0 (correct!)

// ============================================
// 10. Ternary Operator - Type Inference
// ============================================

// TypeScript infers union types from ternary expressions
const age = 20;
const status = age >= 18 ? "adult" : "minor"; // Type: "adult" | "minor"
console.log("Status:", status);

// With different types
const value1 = true ? 42 : "string"; // Type: number | string
const value2 = false ? 42 : "string"; // Type: number | string (same union type)
console.log("Values:", value1, value2);

// ✅ BEST PRACTICE: Use explicit types for clarity
const explicitStatus: string = age >= 18 ? "adult" : "minor"; // Type: string
console.log("Explicit status:", explicitStatus);

// Type narrowing with ternary
function getLength(value: string | null): number {
  return value ? value.length : 0; // TypeScript narrows type
}

console.log("Length:", getLength("test"));

// ============================================
// 11. Bitwise Operators - Type Safety
// ============================================

// TypeScript ensures bitwise operations on numbers
let bits1: number = 5;
let bits2: number = 3;

const bitwiseAnd = bits1 & bits2; // Type: number
const bitwiseOr = bits1 | bits2; // Type: number
const bitwiseXor = bits1 ^ bits2; // Type: number

// ❌ Type error with non-numbers:
// const wrongBitwise = "5" & 3; // Error: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type

console.log("\nBitwise operations with type safety:");
console.log({ bitwiseAnd, bitwiseOr, bitwiseXor });

// ⚠️ PITFALL: Bitwise operators convert to 32-bit integers
const largeNumber: number = 2147483648; // Larger than 32-bit max
const bitwiseResult = largeNumber | 0; // Converts to 32-bit: -2147483648
console.log("Bitwise conversion:", bitwiseResult);

// ============================================
// 12. Delete Operator - Type Safety
// ============================================

// TypeScript tracks property existence
interface Product {
  id: number;
  name: string;
  description?: string; // Optional property
}

const product: Product = {
  id: 1,
  name: "Widget",
  description: "A useful widget"
};

// ✅ Can delete optional properties
delete product.description; // OK

// ❌ Cannot delete required properties (with strict mode)
// delete product.name; // Error: The operand of a 'delete' operator must be optional

console.log("\nAfter delete:", product);

// ⚠️ PITFALL: delete with dynamic properties
const dynamicObj: { [key: string]: any } = { a: 1, b: 2 };
delete dynamicObj.a; // ✅ OK with index signature

// ============================================
// 13. Common Pitfalls: JS vs TS Operators
// ============================================

console.log("\n=== Common Pitfalls ===\n");

// PITFALL 1: Type coercion still happens at runtime
const runtimeSum = 5 + ("3" as any); // "53" at runtime (TypeScript can't prevent this with 'any')
console.log("Runtime coercion:", runtimeSum);

// PITFALL 2: NaN is type number
const notANumber: number = NaN; // ✅ OK in TypeScript
console.log("typeof NaN:", typeof notANumber); // "number"
// @ts-expect-error - Demonstrating that NaN is never equal to itself
console.log("NaN === NaN:", NaN === NaN); // false

// PITFALL 3: Comparison operators don't prevent logic errors
const comparison1 = 10 > 5; // true
const comparison2 = "10" > "5"; // false (string comparison)
// TypeScript allows both, but results differ!
console.log("Comparisons:", comparison1, comparison2);

// PITFALL 4: Optional chaining returns undefined
interface Data {
  value?: {
    nested?: {
      deep?: number;
    };
  };
}

const data: Data = {};
const deepValue = data.value?.nested?.deep; // Type: number | undefined
// const calculation = deepValue + 10; // ❌ Error: Object is possibly 'undefined'

// ✅ FIX: Handle undefined explicitly
const safeCalculation = (deepValue ?? 0) + 10; // ✅ OK
console.log("Safe calculation:", safeCalculation);

// ============================================
// 14. Best Practices Summary
// ============================================

/*
✅ DO:
1. Use strict equality (===) always
2. Use ?? for null/undefined checks, || for falsy checks
3. Use optional chaining (?.) for safe property access
4. Use type guards (typeof, instanceof) for type narrowing
5. Be explicit with type conversions (Number(), String())
6. Use rest parameters with explicit types
7. Prefer ?? over || for default values with optional properties
8. Use type guards instead of type assertions
9. Handle undefined from optional chaining explicitly
10. Use literal types for fixed sets of values

❌ DON'T:
1. Use == or != (use === and !==)
2. Mix types in arithmetic operations without explicit conversion
3. Use non-null assertion (!) unless absolutely necessary
4. Rely on implicit type coercion
5. Use 'any' to bypass type checking
6. Ignore TypeScript errors about possibly undefined values
7. Use || when 0, false, or "" are valid values
8. Delete required properties from objects
9. Use bitwise operators without understanding 32-bit conversion
10. Assume TypeScript prevents all runtime errors

⚠️ WATCH OUT FOR:
1. typeof null === "object" (both JS and TS)
2. NaN === NaN is false (use Number.isNaN)
3. Optional chaining returns undefined (handle it!)
4. ?? vs || behavior with falsy values
5. Bitwise operators convert to 32-bit integers
6. String comparison is lexicographic ("10" < "9" is true)
7. Type assertions don't perform runtime checks
8. Spread creates shallow copies
9. Delete operator return value (always true, even if property doesn't exist)
10. Operator precedence (use parentheses for clarity)
*/

// ============================================
// 15. Advanced: Branded Types for Operators
// ============================================

// TypeScript allows creating branded types for safer operations
type PositiveNumber = number & { __brand: "positive" };
type NegativeNumber = number & { __brand: "negative" };

function makePositive(n: number): PositiveNumber {
  if (n <= 0) throw new Error("Number must be positive");
  return n as PositiveNumber;
}

function makeNegative(n: number): NegativeNumber {
  if (n >= 0) throw new Error("Number must be negative");
  return n as NegativeNumber;
}

// Example usage
try {
  const neg1 = makeNegative(-5);
  console.log("Negative number:", neg1);
} catch (e) {
  console.error("Error creating negative number");
}

// ✅ Type-safe operations with branded types
function addPositives(a: PositiveNumber, b: PositiveNumber): PositiveNumber {
  return (a + b) as PositiveNumber; // Safe because both are positive
}

const pos1 = makePositive(5);
const pos2 = makePositive(10);
const sum2 = addPositives(pos1, pos2);
console.log("\nBranded type sum:", sum2);

// ❌ Type error with wrong types:
// const neg1 = makeNegative(-5);
// const wrongSum = addPositives(pos1, neg1); // Error: Argument of type 'NegativeNumber' is not assignable to parameter of type 'PositiveNumber'

// ============================================
// 16. TypeScript-Specific: Non-null Assertion
// ============================================

// Non-null assertion operator (!) tells TypeScript "trust me"
interface User2 {
  name: string;
  email?: string;
}

function getUser(): User2 | null {
  return { name: "Alice", email: "alice@example.com" };
}

const user = getUser();

// Without assertion:
// const email1 = user.email; // ❌ Error: Object is possibly 'null'

// With optional chaining:
const email2 = user?.email; // ✅ Safe: string | undefined
console.log("Email with optional chaining:", email2);

// With non-null assertion (dangerous!):
const email3 = user!.email; // ⚠️ Tells TS "user is not null"
console.log("Email with non-null assertion:", email3);

// ⚠️ CRITICAL: Non-null assertion can cause runtime errors
// If getUser() returns null, email3 access will crash!

// ✅ BEST PRACTICE: Use optional chaining or explicit checks
if (user !== null) {
  const email4 = user.email; // ✅ Safe: TypeScript knows user is not null
  console.log("Safe email access:", email4);
}

console.log("\n=== TypeScript provides compile-time type safety ===");
console.log("=== Runtime behavior still follows JavaScript rules ===");
console.log("=== Use TypeScript features to catch errors early! ===");
