// TypeScript vs JavaScript: Functions Comparison
// 📘 For JavaScript examples, see: 02-functions.js
// This file demonstrates key differences, pitfalls, and best practices

// Make this file a module to avoid global scope conflicts
export {};

// ============================================================================
// 1. FUNCTION TYPE ANNOTATIONS
// ============================================================================

// JavaScript: No type checking
// function jsAdd(a, b) {
//   return a + b;
// }
// jsAdd(5, "10"); // "510" - string concatenation (bug!)

// TypeScript: Parameter and return type annotations
function tsAdd(a: number, b: number): number {
  return a + b;
}
// tsAdd(5, "10"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'

console.log("=== Function Type Annotations ===");
console.log(tsAdd(5, 10)); // 15

// ⚠️ PITFALL: Return type inference vs explicit annotation
function inferredReturn(x: number) {
  return x * 2; // TypeScript infers return type as 'number'
}

function explicitReturn(x: number): number {
  return x * 2; // Explicitly typed return
}

// ✅ BEST PRACTICE: Always specify return types for public APIs
// - Prevents accidental return type changes
// - Better documentation
// - Catches errors earlier


// ============================================================================
// 2. OPTIONAL AND DEFAULT PARAMETERS
// ============================================================================

// JavaScript: Check for undefined manually
// function jsGreet(name, greeting) {
//   greeting = greeting || "Hello";
//   return `${greeting}, ${name}!`;
// }

// TypeScript: Optional parameters with ?
function tsGreetOptional(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

// TypeScript: Default parameters (same as JS but with types)
function tsGreetDefault(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log("\n=== Optional and Default Parameters ===");
console.log(tsGreetOptional("Alice")); // Hello, Alice!
console.log(tsGreetDefault("Bob", "Hi")); // Hi, Bob!

// ⚠️ CONFUSION POINT: Optional vs Default vs Undefined
function confusingParams(
  optional?: string,        // Can be omitted or undefined
  withDefault: string = "default",  // Has default value
  nullable: string | undefined = undefined  // Explicitly nullable
): void {
  console.log({ optional, withDefault, nullable });
}

confusingParams(); // { optional: undefined, withDefault: 'default', nullable: undefined }
confusingParams(undefined, undefined, undefined); // Same result

// ✅ BEST PRACTICE:
// - Use optional (?) for parameters that can be omitted
// - Use default values for parameters with fallback values
// - Use union with undefined for explicitly nullable parameters


// ============================================================================
// 3. REST PARAMETERS WITH TYPES
// ============================================================================

// JavaScript: Rest parameters are untyped
// function jsSum(...numbers) {
//   return numbers.reduce((a, b) => a + b, 0);
// }
// jsSum(1, 2, "3"); // "33" - type coercion bug!

// TypeScript: Typed rest parameters
function tsSum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

console.log("\n=== Rest Parameters ===");
console.log(tsSum(1, 2, 3, 4, 5)); // 15
// tsSum(1, 2, "3"); // ❌ Error: Argument of type 'string' is not assignable

// ⚠️ PITFALL: Rest parameter must be last
// function invalid(...rest: number[], last: string) {} // ❌ Error

// ✅ BEST PRACTICE: Always type rest parameters
function typedRest(first: string, ...rest: number[]): void {
  console.log(`First: ${first}, Rest: ${rest}`);
}


// ============================================================================
// 4. FUNCTION OVERLOADS (TS-Only Feature)
// ============================================================================

// JavaScript: Single function handles multiple types
// function jsFormat(input) {
//   if (typeof input === "string") return input.toUpperCase();
//   if (typeof input === "number") return input.toFixed(2);
//   return String(input);
// }

// TypeScript: Function overloads for better type safety
function tsFormat(input: string): string;
function tsFormat(input: number): string;
function tsFormat(input: boolean): string;
function tsFormat(input: string | number | boolean): string {
  if (typeof input === "string") return input.toUpperCase();
  if (typeof input === "number") return input.toFixed(2);
  return String(input);
}

console.log("\n=== Function Overloads ===");
console.log(tsFormat("hello")); // HELLO
console.log(tsFormat(42.567)); // 42.57
console.log(tsFormat(true)); // true

// ⚠️ CONFUSION POINT: Overload signatures vs implementation signature
// - Overload signatures define the public API
// - Implementation signature must be compatible with all overloads
// - Implementation signature is NOT part of the public API

// ❌ COMMON MISTAKE: Implementation signature too narrow
// function badOverload(x: string): string;
// function badOverload(x: number): number;
// function badOverload(x: string): string { // ❌ Error: doesn't match second overload
//   return x;
// }

// ✅ CORRECT: Implementation signature covers all overloads
function goodOverload(x: string): string;
function goodOverload(x: number): number;
function goodOverload(x: string | number): string | number {
  return x;
}


// ============================================================================
// 5. ARROW FUNCTIONS WITH TYPES
// ============================================================================

// JavaScript: Arrow functions without types
// const jsMultiply = (a, b) => a * b;

// TypeScript: Arrow functions with type annotations
const tsMultiply = (a: number, b: number): number => a * b;

// TypeScript: Arrow function with type alias
type MathOperation = (a: number, b: number) => number;
const divide: MathOperation = (a, b) => a / b;

console.log("\n=== Arrow Functions ===");
console.log(tsMultiply(4, 5)); // 20
console.log(divide(10, 2)); // 5

// ⚠️ PITFALL: Returning object literals
// const createUser = (name: string) => { name: name }; // ❌ Syntax error
const createUser = (name: string): { name: string } => ({ name }); // ✅ Correct

// ✅ BEST PRACTICE: Use type aliases for complex function types
type Callback = (error: Error | null, data?: string) => void;
const handleResult: Callback = (error, data) => {
  if (error) console.error(error);
  else console.log(data);
};


// ============================================================================
// 6. 'this' PARAMETER (TS-Only Feature)
// ============================================================================

// JavaScript: 'this' type is implicit and error-prone
// const jsObj = {
//   value: 42,
//   getValue: function() { return this.value; }
// };
// const jsGetValue = jsObj.getValue;
// jsGetValue(); // undefined - 'this' is lost!

// TypeScript: Explicit 'this' parameter for type safety
interface Counter {
  value: number;
  increment(this: Counter): void;
  getValue(this: Counter): number;
}

const tsCounter: Counter = {
  value: 0,
  increment(this: Counter) {
    this.value++;
  },
  getValue(this: Counter) {
    return this.value;
  }
};

console.log("\n=== 'this' Parameter ===");
tsCounter.increment();
console.log(tsCounter.getValue()); // 1

// ⚠️ PITFALL: Extracting methods loses 'this' context
// const extractedIncrement = tsCounter.increment;
// extractedIncrement(); // ❌ Error: The 'this' context of type 'void' is not assignable

// ✅ FIX: Use arrow functions or bind
const boundIncrement = tsCounter.increment.bind(tsCounter);
boundIncrement(); // ✅ OK

// ⚠️ NOTE: Arrow function properties in interfaces
// The interface defines increment as arrow function type, but implementation
// can be regular function due to structural typing. However, 'this' is only
// stable when called as obj.method(), not when extracted.
interface SafeCounter {
  value: number;
  increment: () => void;
}

// For truly stable 'this', use arrow function in implementation:
const safeCounter: SafeCounter = {
  value: 0,
  increment: function() {
    this.value++; // 'this' works when called as safeCounter.increment()
  }
};


// ============================================================================
// 7. VOID, NEVER, AND UNDEFINED RETURN TYPES
// ============================================================================

// JavaScript: All functions return something (undefined if no return)
// function jsNoReturn() {
//   console.log("No return");
// }
// const result = jsNoReturn(); // undefined

// TypeScript: void for functions that don't return a value
function tsVoidReturn(): void {
  console.log("No return value");
  // return undefined; // ✅ OK
  // return; // ✅ OK
  // return 42; // ❌ Error: Type 'number' is not assignable to type 'void'
}

// TypeScript: never for functions that never return
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}

// TypeScript: undefined as explicit return type
function explicitUndefined(): undefined {
  return undefined; // Must explicitly return undefined
  // return; // ❌ Error: A function whose declared type is neither 'void' nor 'any' must return a value
}

console.log("\n=== Return Types ===");
tsVoidReturn(); // No return value

// ⚠️ CONFUSION POINT: void vs undefined
// - void: Function doesn't return a meaningful value (can return undefined implicitly)
// - undefined: Function explicitly returns undefined
// - never: Function never returns (throws or infinite loop)

// ✅ BEST PRACTICE:
// - Use void for functions with side effects (console.log, DOM manipulation)
// - Use never for functions that throw or never exit
// - Rarely use undefined as return type (void is usually better)


// ============================================================================
// 8. FUNCTION TYPE EXPRESSIONS
// ============================================================================

// JavaScript: Functions are values, but no type checking
// const jsCallback = (fn) => fn();

// TypeScript: Function type expressions
type VoidFunction = () => void;
type NumberFunction = (x: number) => number;
type CallbackFunction = (error: Error | null, result?: string) => void;

function executeCallback(callback: VoidFunction): void {
  callback();
}

function transform(value: number, fn: NumberFunction): number {
  return fn(value);
}

console.log("\n=== Function Type Expressions ===");
executeCallback(() => console.log("Callback executed"));
console.log(transform(5, x => x * 2)); // 10

// ⚠️ PITFALL: Function type vs method signature
type FunctionType = (x: number) => number;
interface MethodSignature {
  (x: number): number; // Call signature
}

const fn1: FunctionType = x => x * 2;
const fn2: MethodSignature = x => x * 2;
// Both are equivalent, but call signatures allow overloads

// ✅ BEST PRACTICE: Use type aliases for reusable function types


// ============================================================================
// 9. GENERIC FUNCTIONS
// ============================================================================

// JavaScript: No generics, must handle any type
// function jsIdentity(value) {
//   return value;
// }
// const num = jsIdentity(42); // Type is 'any'
// const str = jsIdentity("hello"); // Type is 'any'

// TypeScript: Generic functions preserve type information
function tsIdentity<T>(value: T): T {
  return value;
}

const num = tsIdentity(42); // Type is 'number'
const str = tsIdentity("hello"); // Type is 'string'

console.log("\n=== Generic Functions ===");
console.log(num, str);

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Alice", age: 30 };
const personName = getProperty(person, "name"); // Type is 'string'
const personAge = getProperty(person, "age"); // Type is 'number'
// getProperty(person, "invalid"); // ❌ Error: Argument of type '"invalid"' is not assignable

console.log(personName, personAge);

// ⚠️ CONFUSION POINT: Generic inference vs explicit type arguments
function genericExample<T>(value: T): T[] {
  return [value];
}

const inferred = genericExample(42); // T inferred as number
const explicit = genericExample<string>("hello"); // T explicitly set to string

// ✅ BEST PRACTICE:
// - Let TypeScript infer generic types when possible
// - Use explicit type arguments when inference fails or for clarity
// - Use constraints (extends) to restrict generic types


// ============================================================================
// 10. ASYNC FUNCTIONS WITH TYPES
// ============================================================================

// JavaScript: Async functions return Promise, but no type checking
// async function jsFetchData() {
//   return { data: "value" };
// }
// const result = await jsFetchData(); // Type is 'any'

// TypeScript: Async functions with typed Promises
async function tsFetchData(): Promise<{ data: string }> {
  return { data: "value" };
}

async function tsFetchNumber(): Promise<number> {
  return 42;
}

console.log("\n=== Async Functions ===");
tsFetchData().then(result => {
  console.log(result.data); // Type is 'string'
});

// ⚠️ PITFALL: Forgetting Promise wrapper
// async function badAsync(): { data: string } { // ❌ Error: Return type is not a Promise
//   return { data: "value" };
// }

// ✅ CORRECT: Async functions always return Promise
async function goodAsync(): Promise<{ data: string }> {
  return { data: "value" };
}

// Generic async function
async function fetchGeneric<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json() as T;
}

// ✅ BEST PRACTICE:
// - Always specify Promise return type for async functions
// - Use generics for flexible async functions
// - Handle errors with try-catch or .catch()


// ============================================================================
// 11. CALLBACK FUNCTIONS WITH TYPES
// ============================================================================

// JavaScript: Callbacks without type safety
// function jsMap(array, callback) {
//   return array.map(callback);
// }

// TypeScript: Typed callbacks
function tsMap<T, U>(array: T[], callback: (item: T, index: number) => U): U[] {
  return array.map(callback);
}

console.log("\n=== Callback Functions ===");
const numbers = [1, 2, 3, 4, 5];
const doubled = tsMap(numbers, (n) => n * 2); // Type is number[]
const strings = tsMap(numbers, (n) => `Number: ${n}`); // Type is string[]

console.log(doubled);
console.log(strings);

// ⚠️ PITFALL: Callback parameter types must match
// tsMap(numbers, (n: string) => n.toUpperCase()); // ❌ Error: Type mismatch

// ✅ BEST PRACTICE: Use generics for flexible callback types


// ============================================================================
// 12. FUNCTION DECLARATIONS VS EXPRESSIONS IN TS
// ============================================================================

// Both work in TypeScript, but with subtle differences

// Function declaration with types
function declaredFunction(x: number): number {
  return x * 2;
}

// Function expression with types
const expressedFunction = function(x: number): number {
  return x * 2;
};

// Arrow function with types
const arrowFunction = (x: number): number => x * 2;

// ⚠️ CONFUSION POINT: Type inference in function expressions
const inferredExpression = (x: number) => x * 2; // Return type inferred as number
const explicitExpression = (x: number): number => x * 2; // Return type explicit

// ✅ BEST PRACTICE:
// - Use function declarations for top-level functions
// - Use arrow functions for callbacks and short functions
// - Always type function parameters
// - Specify return types for public APIs


// ============================================================================
// 13. COMMON PITFALLS: JS vs TS FUNCTIONS
// ============================================================================

console.log("\n=== Common Pitfalls ===");

// PITFALL 1: Optional parameters must come after required parameters
// function badOrder(optional?: string, required: string) {} // ❌ Error
function goodOrder(required: string, optional?: string): void {
  console.log(required, optional);
}

// PITFALL 2: Rest parameters must be last
// function badRest(...rest: number[], last: string) {} // ❌ Error
function goodRest(first: string, ...rest: number[]): void {
  console.log(first, rest);
}

// PITFALL 3: 'this' in arrow functions
const obj = {
  value: 42,
  regularMethod: function() {
    return this.value; // 'this' refers to obj
  },
  arrowMethod: () => {
    // return this.value; // ❌ Error: 'this' implicitly has type 'any'
  }
};

console.log(obj.regularMethod()); // 42

// PITFALL 4: Function overloads order matters
function overloadOrder(x: string): string;
function overloadOrder(x: string | number): string; // ⚠️ Less specific, only matches numbers in practice
function overloadOrder(x: string | number): string {
  return String(x);
}
// ✅ FIX: Put more specific overloads first (string before string | number)

// PITFALL 5: Async function without await
async function forgotAwait(): Promise<number> {
  const promise = Promise.resolve(42);
  return promise; // ✅ OK, Promise is automatically awaited on return
  // return await promise; // ✅ Use 'await' in try-catch for proper error handling
}

// PITFALL 6: Void return type doesn't prevent returning values
function voidReturn(): void {
  return undefined; // ✅ OK
  // return 42; // ❌ Error
}

// But callbacks with void return type can return values!
function executeCallback2(callback: () => void): void {
  callback();
}

executeCallback2(() => 42); // ✅ OK! Return value is ignored
executeCallback2(() => "hello"); // ✅ OK! Return value is ignored

// This is intentional for flexibility with callbacks


// ============================================================================
// 14. BEST PRACTICES SUMMARY
// ============================================================================

/*
✅ DO:
1. Always type function parameters
2. Specify return types for public APIs
3. Use generics for reusable, type-safe functions
4. Use function overloads for multiple signatures
5. Use 'this' parameter for methods that depend on context
6. Use void for functions with side effects
7. Use never for functions that throw or never return
8. Use optional parameters (?) for truly optional values
9. Use default parameters for fallback values
10. Type rest parameters with array types

❌ DON'T:
1. Use 'any' for function parameters or return types
2. Forget to type async function return values (Promise<T>)
3. Put optional parameters before required ones
4. Use function overloads when union types suffice
5. Ignore 'this' context in methods
6. Mix up void, undefined, and never
7. Forget that arrow functions don't have their own 'this'
8. Use type assertions instead of proper typing
9. Create overly complex generic constraints
10. Forget to handle errors in async functions

⚠️ WATCH OUT FOR:
1. Optional parameters must come after required ones
2. Rest parameters must be last
3. Arrow functions inherit 'this' from enclosing scope
4. Function overload order matters (most specific first)
5. Async functions always return Promise
6. Void callbacks can return values (by design)
7. Generic type inference vs explicit type arguments
8. 'this' parameter is not a real parameter (it's erased at runtime)
9. Function type expressions vs call signatures
10. Implementation signature must cover all overloads
*/


// ============================================================================
// 15. ADVANCED: FUNCTION TYPES AND UTILITY TYPES
// ============================================================================

// Extract parameter types
type Params = Parameters<typeof tsAdd>; // [number, number]

// Extract return type
type Return = ReturnType<typeof tsAdd>; // number

// Construct function type
type ConstructedFunction = (...args: Params) => Return;

// ThisParameterType and OmitThisParameter
function withThis(this: { value: number }, x: number): number {
  return this.value + x;
}

type ThisType = ThisParameterType<typeof withThis>; // { value: number }
type WithoutThis = OmitThisParameter<typeof withThis>; // (x: number) => number

console.log("\n=== Utility Types ===");
console.log("Parameters:", typeof tsAdd);
console.log("ReturnType:", typeof tsAdd);

// ✅ BEST PRACTICE: Use utility types for type transformations


// ============================================================================
// 16. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript Functions ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Parameter types            │       ✗         │       ✓         │
│ Return type annotations    │       ✗         │       ✓         │
│ Function overloads         │       ✗         │       ✓         │
│ Generic functions          │       ✗         │       ✓         │
│ 'this' parameter           │       ✗         │       ✓         │
│ Optional parameters (?)    │       ✗         │       ✓         │
│ Type inference             │       ✗         │       ✓         │
│ Compile-time type checking │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Function hoisting          │       ✓         │       ✓         │
│ Arrow functions            │       ✓         │       ✓         │
│ Async/await                │       ✓         │       ✓         │
│ Default parameters         │       ✓         │       ✓         │
│ Rest parameters            │       ✓         │       ✓         │
│ Destructuring              │       ✓         │       ✓         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript adds type safety to JavaScript functions
2. Runtime behavior is identical to JavaScript
3. Type annotations are erased during compilation
4. TypeScript catches type errors at compile time
5. Use TypeScript features for better code quality and maintainability
`);

console.log("\n=== TypeScript provides type safety at compile time ===");
console.log("=== But runtime behavior follows JavaScript rules ===");
