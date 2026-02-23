// TypeScript Numbers and Math Comparison
// 📘 Companion to: 05-numbers-math.js

// Wrap in block scope to avoid conflicts with other files
{

// ============================================
// 1. Number Type Annotations
// ============================================

// Basic number type
const decimal: number = 42;
const decimalFloat: number = 3.14159;
const hex: number = 0xFF;
const octal: number = 0o77;
const binary: number = 0b1010;

console.log("=== Number Type Annotations ===");
console.log({ decimal, decimalFloat, hex, octal, binary });

// TypeScript's number type includes all numeric values
const infinity: number = Infinity;
const negInfinity: number = -Infinity;
const notANumber: number = NaN;

console.log("Special values:", { infinity, negInfinity, notANumber });

// Scientific notation with type annotation
const million: number = 1e6;
const micro: number = 1e-6;

// Numeric separators work in TypeScript
const largeNumber: number = 1_000_000;
const creditCard: number = 1234_5678_9012_3456;

console.log("\nNumeric separators:", { largeNumber, creditCard });

// ============================================
// 2. Numeric Literal Types
// ============================================

// Restrict to specific numeric values
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type Port = 80 | 443 | 3000 | 8080;

const roll: DiceRoll = 6; // ✅ OK
// const invalidRoll: DiceRoll = 7; // ❌ Error

const httpStatus: HttpStatus = 200; // ✅ OK
// const invalidStatus: HttpStatus = 999; // ❌ Error

console.log("\n=== Numeric Literal Types ===");
console.log("Dice roll:", roll);
console.log("HTTP status:", httpStatus);

// Function with numeric literal type
function setPort(port: Port): void {
  console.log(`Server running on port ${port}`);
}

setPort(3000); // ✅ OK
// setPort(9000); // ❌ Error

// Const assertions for literal types
const maxRetries = 3 as const; // Type: 3 (not number)
const timeout = 5000 as const; // Type: 5000

console.log("Max retries type:", maxRetries);
console.log("Timeout type:", timeout);

// ============================================
// 3. Type-Safe Number Operations
// ============================================

// Type inference with arithmetic
function add(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

console.log("\n=== Type-Safe Operations ===");
console.log("add(5, 3):", add(5, 3));
console.log("multiply(4, 7):", multiply(4, 7));

// Type guards for number checking
function isNumber(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value);
}

function processValue(value: unknown): number {
  if (isNumber(value)) {
    return value * 2;
  }
  return 0;
}

console.log("processValue(10):", processValue(10)); // 20
console.log("processValue('hello'):", processValue("hello")); // 0

// ============================================
// 4. Nullable Numbers
// ============================================

// Number with null/undefined
type NullableNumber = number | null;
type OptionalNumber = number | undefined;
type MaybeNumber = number | null | undefined;

function calculateTax(amount: NullableNumber, rate: number): number {
  if (amount === null) {
    return 0;
  }
  return amount * rate;
}

console.log("\n=== Nullable Numbers ===");
console.log("Tax on 100:", calculateTax(100, 0.1)); // 10
console.log("Tax on null:", calculateTax(null, 0.1)); // 0

// Optional chaining with numbers
function getSquare(num: MaybeNumber): number {
  return num ? num * num : 0;
}

console.log("Square of 5:", getSquare(5)); // 25
console.log("Square of null:", getSquare(null)); // 0

// Nullish coalescing
function getDefault(value: MaybeNumber): number {
  return value ?? 0;
}

console.log("getDefault(42):", getDefault(42)); // 42
console.log("getDefault(null):", getDefault(null)); // 0
console.log("getDefault(undefined):", getDefault(undefined)); // 0

// ============================================
// 5. Number Methods with Type Safety
// ============================================

// toFixed returns string
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

console.log("\n=== Type-Safe Number Methods ===");
console.log("Format 19.99:", formatCurrency(19.99)); // "$19.99"

// parseInt with proper types
function parseInteger(str: string, radix: number = 10): number {
  const result = parseInt(str, radix);
  if (isNaN(result)) {
    throw new Error(`Cannot parse "${str}" as integer`);
  }
  return result;
}

console.log('parseInteger("42"):', parseInteger("42")); // 42
console.log('parseInteger("FF", 16):', parseInteger("FF", 16)); // 255

// Type-safe conversion
function toNumber(value: string | number): number {
  if (typeof value === "number") {
    return value;
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Cannot convert "${value}" to number`);
  }
  return num;
}

console.log('toNumber("123"):', toNumber("123")); // 123
console.log("toNumber(456):", toNumber(456)); // 456

// ============================================
// 6. BigInt Type
// ============================================

// BigInt type annotation
const bigInt1: bigint = 123n;
const bigInt2: bigint = BigInt("123");
const bigInt3: bigint = BigInt(123);

console.log("\n=== BigInt Type ===");
console.log("bigInt1:", bigInt1);
console.log("typeof bigInt1:", typeof bigInt1); // "bigint"

// BigInt arithmetic with type safety
function addBigInts(a: bigint, b: bigint): bigint {
  return a + b;
}

console.log("addBigInts(10n, 20n):", addBigInts(10n, 20n)); // 30n

// Cannot mix number and bigint (compile-time error)
// const mixed = 10n + 5; // ❌ Error: Cannot mix BigInt and other types

// Type-safe conversion
function toBigInt(value: number | string | bigint): bigint {
  if (typeof value === "bigint") {
    return value;
  }
  return BigInt(value);
}

console.log("toBigInt(100):", toBigInt(100)); // 100n
console.log('toBigInt("200"):', toBigInt("200")); // 200n

// BigInt comparison types
// @ts-expect-error - Demonstrating that bigint can be compared with number using ==
const comparison1: boolean = 10n == 10; // true (loose equality)
const comparison2: boolean = 10n === 10n; // true (same type)
// const comparison3: boolean = 10n === 10; // ❌ Error: always false

console.log("10n == 10:", comparison1);
console.log("10n === 10n:", comparison2);

// ============================================
// 7. Branded Types for Numbers
// ============================================

// Create branded types for domain-specific numbers
type Percentage = number & { readonly __brand: "Percentage" };
type Celsius = number & { readonly __brand: "Celsius" };
type Fahrenheit = number & { readonly __brand: "Fahrenheit" };

function createPercentage(value: number): Percentage {
  if (value < 0 || value > 100) {
    throw new Error("Percentage must be between 0 and 100");
  }
  return value as Percentage;
}

function createCelsius(value: number): Celsius {
  return value as Celsius;
}

function createFahrenheit(value: number): Fahrenheit {
  return value as Fahrenheit;
}

function celsiusToFahrenheit(c: Celsius): Fahrenheit {
  return ((c * 9/5) + 32) as Fahrenheit;
}

console.log("\n=== Branded Number Types ===");
const discount = createPercentage(25);
const temp = createCelsius(20);
const tempF = celsiusToFahrenheit(temp);

console.log("Discount:", discount);
console.log("Temperature (C):", temp);
console.log("Temperature (F):", tempF);

// Type safety prevents mixing
// const wrong = celsiusToFahrenheit(tempF); // ❌ Error: Fahrenheit not assignable to Celsius

// ============================================
// 8. Utility Types for Numbers
// ============================================

// Range type (limited example)
type PositiveNumber = number; // In practice, would need runtime validation
type NegativeNumber = number;
type NonZeroNumber = number;

function assertPositive(value: number): asserts value is PositiveNumber {
  if (value <= 0) {
    throw new Error("Value must be positive");
  }
}

function processPositive(value: number): void {
  assertPositive(value);
  // TypeScript knows value is positive here
  console.log("Processing positive number:", value);
}

console.log("\n=== Utility Types ===");
processPositive(42);
// processPositive(-5); // Throws error at runtime

// Readonly number properties
interface Config {
  readonly maxRetries: number;
  readonly timeout: number;
  currentRetries: number;
}

const config: Config = {
  maxRetries: 3,
  timeout: 5000,
  currentRetries: 0
};

// config.maxRetries = 5; // ❌ Error: Cannot assign to readonly property
config.currentRetries = 1; // ✅ OK

console.log("Config:", config);

// ============================================
// 9. Generic Functions with Numbers
// ============================================

// Generic function with number constraint
function clamp<T extends number>(value: T, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

console.log("\n=== Generic Number Functions ===");
console.log("clamp(5, 0, 10):", clamp(5, 0, 10)); // 5
console.log("clamp(15, 0, 10):", clamp(15, 0, 10)); // 10
console.log("clamp(-5, 0, 10):", clamp(-5, 0, 10)); // 0

// Generic array operations
function sum<T extends number>(numbers: T[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

function average<T extends number>(numbers: T[]): number {
  return sum(numbers) / numbers.length;
}

const nums = [1, 2, 3, 4, 5];
console.log("sum([1,2,3,4,5]):", sum(nums)); // 15
console.log("average([1,2,3,4,5]):", average(nums)); // 3

// ============================================
// 10. Type-Safe Math Operations
// ============================================

// Wrapper for Math operations with type safety
class MathUtils {
  static round(value: number, decimals: number = 0): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

console.log("\n=== Type-Safe Math Utils ===");
console.log("round(1.2345, 2):", MathUtils.round(1.2345, 2)); // 1.23
console.log("randomInt(1, 6):", MathUtils.randomInt(1, 6));
console.log("clamp(15, 0, 10):", MathUtils.clamp(15, 0, 10)); // 10

// ============================================
// 11. Discriminated Unions with Numbers
// ============================================

// Type-safe state with numeric values
type LoadingProgress = 
  | { status: "idle"; progress: 0 }
  | { status: "loading"; progress: number }
  | { status: "complete"; progress: 100 };

function displayProgress(state: LoadingProgress): string {
  switch (state.status) {
    case "idle":
      return "Not started";
    case "loading":
      return `Loading: ${state.progress}%`;
    case "complete":
      return "Complete!";
  }
}

console.log("\n=== Discriminated Unions ===");
console.log(displayProgress({ status: "idle", progress: 0 }));
console.log(displayProgress({ status: "loading", progress: 50 }));
console.log(displayProgress({ status: "complete", progress: 100 }));

// ============================================
// 12. Const Enums for Numbers
// ============================================

// Const enum for numeric constants
const enum HttpStatusCode {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500
}

function handleResponse(status: HttpStatusCode): string {
  switch (status) {
    case HttpStatusCode.OK:
      return "Success";
    case HttpStatusCode.NotFound:
      return "Not Found";
    default:
      return "Error";
  }
}

console.log("\n=== Const Enums ===");
console.log("Status 200:", handleResponse(HttpStatusCode.OK));
console.log("Status 404:", handleResponse(HttpStatusCode.NotFound));

// Regular enum (not inlined)
enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4
}

function getPriorityName(priority: Priority): string {
  return Priority[priority];
}

console.log("Priority 3:", getPriorityName(Priority.High));

// ============================================
// 13. Template Literal Types with Numbers
// ============================================

// Combine numbers with strings in types
type Version = `${number}.${number}.${number}`;
type Port2 = `${number}`;
type Percentage2 = `${number}%`;

// These would need runtime validation
const version: Version = "1.2.3"; // ✅ OK (at type level)
const port: Port2 = "3000"; // ✅ OK
const percent: Percentage2 = "50%"; // ✅ OK

console.log("\n=== Template Literal Types ===");
console.log("Version:", version);
console.log("Port:", port);
console.log("Percentage:", percent);

// ============================================
// 14. Tuple Types with Numbers
// ============================================

// Fixed-length arrays with specific types
type Point2D = [number, number];
type Point3D = [number, number, number];
type RGB = [number, number, number];
type RGBA = [number, number, number, number];

const point: Point2D = [10, 20];
const color: RGB = [255, 0, 128];
const colorWithAlpha: RGBA = [255, 0, 128, 0.5];

console.log("\n=== Tuple Types ===");
console.log("Point:", point);
console.log("Color:", color);
console.log("Color with alpha:", colorWithAlpha);

// Function with tuple return
function getMinMax(numbers: number[]): [number, number] {
  return [Math.min(...numbers), Math.max(...numbers)];
}

const [min, max] = getMinMax([1, 5, 3, 9, 2]);
console.log("Min:", min, "Max:", max);

// ============================================
// 15. Readonly Number Arrays
// ============================================

// Immutable number arrays
const readonlyNumbers: readonly number[] = [1, 2, 3, 4, 5];
// readonlyNumbers.push(6); // ❌ Error: Property 'push' does not exist
// readonlyNumbers[0] = 10; // ❌ Error: Index signature only permits reading

console.log("\n=== Readonly Arrays ===");
console.log("Readonly numbers:", readonlyNumbers);

// ReadonlyArray type
const scores: ReadonlyArray<number> = [95, 87, 92, 88];
console.log("Scores:", scores);

// Const assertion for readonly
const constants = [Math.PI, Math.E, Math.SQRT2] as const;
// Type: readonly [3.141592653589793, 2.718281828459045, 1.4142135623730951]

console.log("Constants:", constants);

// ============================================
// 16. Number Validation with Type Predicates
// ============================================

// Type predicates for validation
function isPositive(value: number): value is PositiveNumber {
  return value > 0;
}

function isInteger(value: number): boolean {
  return Number.isInteger(value);
}

function isSafeInteger(value: number): boolean {
  return Number.isSafeInteger(value);
}

console.log("\n=== Number Validation ===");
console.log("isPositive(5):", isPositive(5)); // true
console.log("isPositive(-5):", isPositive(-5)); // false
console.log("isInteger(5):", isInteger(5)); // true
console.log("isInteger(5.5):", isInteger(5.5)); // false
console.log("isSafeInteger(9007199254740991):", isSafeInteger(9007199254740991)); // true

// ============================================
// 17. Mapped Types with Numbers
// ============================================

// Transform object values to numbers
type StringRecord = {
  width: string;
  height: string;
  depth: string;
};

type NumberRecord = {
  [K in keyof StringRecord]: number;
};

const dimensions: NumberRecord = {
  width: 100,
  height: 200,
  depth: 50
};

console.log("\n=== Mapped Types ===");
console.log("Dimensions:", dimensions);

// ============================================
// 18. Index Signatures with Numbers
// ============================================

// Object with numeric keys
interface ScoreMap {
  [userId: number]: number;
}

const scores2: ScoreMap = {
  1: 95,
  2: 87,
  3: 92
};

console.log("\n=== Index Signatures ===");
console.log("User 1 score:", scores2[1]);
console.log("User 2 score:", scores2[2]);

// Record utility type
type UserScores = Record<number, number>;

const userScores: UserScores = {
  101: 88,
  102: 94,
  103: 76
};

console.log("User scores:", userScores);

console.log("\n=== TypeScript Numbers and Math Complete ===");

} // End of block scope
