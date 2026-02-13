// Variables and Data Types Demo
// 📘 For TypeScript comparison, see: 01-variables-ts-comparison.ts

// ============================================
// Variable Declarations
// ============================================

// var - Function-scoped or globally-scoped (ES5)
// - Hoisted to the top of function/global scope
// - Can be redeclared and updated
// - No block scope (ignores if, for, while blocks)
// - Common pitfall: accessible before declaration (undefined)
var oldStyle = "var is function-scoped";

// let - Block-scoped (ES6/ES2015)
// - Only accessible within the block {...} where it's defined
// - Cannot be redeclared in the same scope
// - Temporal Dead Zone: cannot access before declaration (ReferenceError)
// - Preferred for variables that will change
let modernStyle = "let is block-scoped";

// const - Block-scoped constant (ES6/ES2015)
// - Must be initialized at declaration
// - Cannot be reassigned (but object properties can be modified)
// - Use for values that shouldn't change
// - Best practice: use const by default, let when needed
const constant = "const cannot be reassigned";

// ============================================
// Primitive Data Types (7 types in ES2020+)
// ============================================

// 1. String - Text data (ES1)
// - Immutable sequence of characters
// - Can use single quotes, double quotes, or backticks
// - typeof returns "string"
const stringType = "Hello World";

// 2. Number - Numeric data (ES1)
// - 64-bit floating point (IEEE 754)
// - Range: ±(2^-1074 to 2^1024)
// - Special values: Infinity, -Infinity, NaN
// - Pitfall: 0.1 + 0.2 !== 0.3 (floating point precision)
// - typeof returns "number"
const numberType = 42;

// 3. Boolean - Logical data (ES1)
// - Only two values: true or false
// - Used in conditional statements
// - Falsy values: false, 0, "", null, undefined, NaN
// - typeof returns "boolean"
const booleanType = true;

// 4. Null - Intentional absence of value (ES1)
// - Represents "nothing" or "empty"
// - Must be assigned explicitly
// - typeof returns "object" (historical bug in JavaScript)
// - Use for: explicitly setting "no value"
const nullType = null;

// 5. Undefined - Uninitialized variable (ES1)
// - Default value for uninitialized variables
// - Function returns undefined if no return statement
// - typeof returns "undefined"
// - Difference from null: undefined = not assigned, null = intentionally empty
const undefinedType = undefined;

// 6. Symbol - Unique identifier (ES6/ES2015)
// - Always unique, even with same description
// - Used for object property keys to avoid name collisions
// - Not enumerable in for...in loops
// - typeof returns "symbol"
// - Use case: private object properties, unique constants
const symbolType = Symbol("unique");

// 7. BigInt - Large integers (ES2020)
// - Can represent integers larger than 2^53 - 1
// - Created by appending 'n' to integer or BigInt() constructor
// - Cannot mix with regular numbers in operations
// - typeof returns "bigint"
// - Use case: cryptography, precise large number calculations
const bigIntType = 9007199254740991n;

console.log("Variables Demo:");
console.log({ stringType, numberType, booleanType });
console.log({ nullType, undefinedType, symbolType, bigIntType });


// ============================================
// Common Pitfalls & Best Practices
// ============================================

// Pitfall 1: typeof null returns "object" (historical bug)
console.log("\nCommon Pitfalls:");
console.log("typeof null:", typeof nullType); // "object" (not "null"!)

// Pitfall 2: NaN is a number type
console.log("typeof NaN:", typeof NaN); // "number"
console.log("NaN === NaN:", NaN === NaN); // false (use Number.isNaN() instead)

// Pitfall 3: var hoisting
console.log("\nVar Hoisting:");
console.log("Before declaration:", typeof hoistedVar); // "undefined" (not error!)
var hoistedVar = "I'm hoisted";
console.log("After declaration:", hoistedVar);

// Pitfall 4: Temporal Dead Zone with let/const
// Uncommenting below will cause ReferenceError:
// console.log(temporalDeadZone); // ReferenceError!
// let temporalDeadZone = "Cannot access before initialization";

// Best Practice 1: Use const by default
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

// Best Practice 2: Use let for variables that change
let counter = 0;
counter++; // OK

// Best Practice 3: Avoid var in modern JavaScript
// Use let/const for better scoping and fewer bugs

// Best Practice 4: Check for null/undefined safely
const value = null;
console.log("\nSafe null checks:");
console.log("value == null:", value == null); // true (checks both null and undefined)
console.log("value === null:", value === null); // true (strict check)
console.log("value === undefined:", value === undefined); // false

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE ANNOTATIONS
   JS:  let x = 42;
   TS:  let x: number = 42;

2. NULL/UNDEFINED HANDLING (strictNullChecks)
   JS:  let x = null; // Always OK
   TS:  let x: number = null; // ❌ Error with strictNullChecks
   TS:  let x: number | null = null; // ✅ OK with union type

3. TYPE SAFETY
   JS:  No compile-time type checking
   TS:  Catches type errors before runtime

4. SPECIAL TYPES
   - any: Disables type checking (avoid!)
   - unknown: Type-safe alternative to any
   - never: For functions that never return

5. OPTIONAL CHAINING & NULLISH COALESCING
   Both JS (ES2020+) and TS support:
   - obj?.prop (optional chaining)
   - value ?? defaultValue (nullish coalescing)

⚠️ COMMON CONFUSION POINTS:
- typeof null === "object" (same in both JS and TS)
- strictNullChecks changes null/undefined behavior
- Type assertions don't perform runtime checks
- 'any' defeats TypeScript's purpose

📘 See 01-variables-ts-comparison.ts for detailed examples!
*/

