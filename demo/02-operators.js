// Operators and Expressions Demo
// 📘 For TypeScript comparison, see: 07-operators-ts-comparison.ts

// ============================================
// Arithmetic Operators
// ============================================

// Addition (+) - Adds numbers or concatenates strings (ES1)
// - For numbers: performs mathematical addition
// - For strings: concatenates (joins) strings
// - Mixed types: converts to string and concatenates
// - Use case: calculations, string building
const sum = 10 + 5; // 15
const concat = "Hello" + " " + "World"; // "Hello World"
const mixed = "Value: " + 42; // "Value: 42"

// Subtraction (-) - Subtracts numbers (ES1)
// - Converts operands to numbers
// - Returns NaN if conversion fails
// - Use case: calculations, decrements
const difference = 10 - 5; // 5
const stringMath = "10" - "5"; // 5 (strings converted to numbers)

// Multiplication (*) - Multiplies numbers (ES1)
// - Converts operands to numbers
// - Special cases: Infinity * 0 = NaN
// - Use case: calculations, scaling values
const product = 10 * 5; // 50

// Division (/) - Divides numbers (ES1)
// - Returns floating point result
// - Division by zero returns Infinity or -Infinity
// - 0 / 0 returns NaN
// - Use case: calculations, ratios
const quotient = 10 / 5; // 2
const divByZero = 10 / 0; // Infinity

// Modulus (%) - Returns remainder of division (ES1)
// - Sign of result matches sign of dividend
// - Use case: even/odd checks, cycling through ranges
// - Common pitfall: not the same as mathematical modulo for negatives
const remainder = 10 % 3; // 1
const negativeRemainder = -10 % 3; // -1 (not 2!)

// Exponentiation (**) - Raises to power (ES2016/ES7)
// - Right-associative: 2 ** 3 ** 2 = 2 ** (3 ** 2) = 512
// - Replaces Math.pow()
// - Use case: scientific calculations, compound interest
const power = 2 ** 3; // 8
const squared = 5 ** 2; // 25

console.log("Arithmetic Operators:");
console.log({ sum, difference, product, quotient, remainder, power });
console.log({ concat, mixed, divByZero, negativeRemainder });

// Unary Plus (+) and Unary Minus (-) (ES1)
// - Unary plus converts to number
// - Unary minus converts to number and negates
const strNum = "42";
const converted = +strNum; // 42 (number)
const negated = -strNum; // -42 (number)
const boolToNum = +true; // 1

console.log("\nUnary Operators:");
console.log({ converted, negated, boolToNum });

// Increment (++) and Decrement (--) (ES1)
// - Prefix: increments/decrements then returns value
// - Postfix: returns value then increments/decrements
// - Common pitfall: confusion between prefix and postfix
let x = 5;
console.log("\nIncrement/Decrement:");
console.log("x:", x); // 5
console.log("x++:", x++); // 5 (returns then increments)
console.log("x:", x); // 6
console.log("++x:", ++x); // 7 (increments then returns)
console.log("x:", x); // 7

// ============================================
// Comparison Operators
// ============================================

// Equality (==) - Loose equality with type coercion (ES1)
// - Converts operands to same type before comparing
// - Common pitfall: unexpected type conversions
// - Best practice: avoid in favor of ===
console.log("\nLoose Equality (==):");
console.log("5 == '5':", 5 == "5"); // true (string converted to number)
console.log("0 == false:", 0 == false); // true (false converted to 0)
console.log("null == undefined:", null == undefined); // true (special case)
console.log("'' == 0:", "" == 0); // true (empty string converted to 0)

// Strict Equality (===) - No type coercion (ES1)
// - Compares both value and type
// - Returns false if types differ
// - Best practice: use this by default
// - Use case: all comparisons except null/undefined checks
console.log("\nStrict Equality (===):");
console.log("5 === '5':", 5 === "5"); // false (different types)
console.log("5 === 5:", 5 === 5); // true
console.log("null === undefined:", null === undefined); // false

// Inequality (!=) - Loose inequality with type coercion (ES1)
// - Opposite of ==
// - Same type coercion rules apply
console.log("\nLoose Inequality (!=):");
console.log("5 != '5':", 5 != "5"); // false (coerced to same value)
console.log("5 != 6:", 5 != 6); // true

// Strict Inequality (!==) - No type coercion (ES1)
// - Opposite of ===
// - Best practice: use this by default
console.log("\nStrict Inequality (!==):");
console.log("5 !== '5':", 5 !== "5"); // true (different types)
console.log("5 !== 5:", 5 !== 5); // false

// Relational Operators: <, >, <=, >= (ES1)
// - Compare numeric values
// - String comparison uses lexicographic (dictionary) order
// - Mixed types: converts to numbers
// - Use case: sorting, range checks, validation
console.log("\nRelational Operators:");
console.log("10 > 5:", 10 > 5); // true
console.log("10 < 5:", 10 < 5); // false
console.log("10 >= 10:", 10 >= 10); // true
console.log("10 <= 5:", 10 <= 5); // false
console.log("'apple' < 'banana':", "apple" < "banana"); // true (lexicographic)
console.log("'10' > '9':", "10" > "9"); // false (string comparison: '1' < '9')

// ============================================
// Logical Operators
// ============================================

// Logical AND (&&) - Returns first falsy value or last value (ES1)
// - Short-circuits: stops at first falsy value
// - Returns the actual value, not just true/false
// - Use case: conditional execution, null checks
// - Falsy values: false, 0, "", null, undefined, NaN
console.log("\nLogical AND (&&):");
console.log("true && true:", true && true); // true
console.log("true && false:", true && false); // false
console.log("5 && 10:", 5 && 10); // 10 (both truthy, returns last)
console.log("0 && 10:", 0 && 10); // 0 (first falsy)
console.log("null && 'hello':", null && "hello"); // null

// Logical OR (||) - Returns first truthy value or last value (ES1)
// - Short-circuits: stops at first truthy value
// - Returns the actual value, not just true/false
// - Use case: default values, fallbacks
console.log("\nLogical OR (||):");
console.log("false || true:", false || true); // true
console.log("false || false:", false || false); // false
console.log("0 || 10:", 0 || 10); // 10 (first truthy)
console.log("5 || 10:", 5 || 10); // 5 (stops at first truthy)
console.log("null || 'default':", null || "default"); // 'default'

// Logical NOT (!) - Inverts boolean value (ES1)
// - Converts to boolean then negates
// - Double NOT (!!) converts to boolean
// - Use case: boolean conversion, condition inversion
console.log("\nLogical NOT (!):");
console.log("!true:", !true); // false
console.log("!false:", !false); // true
console.log("!0:", !0); // true (0 is falsy)
console.log("!'hello':", !"hello"); // false ('hello' is truthy)
console.log("!!0:", !!0); // false (converts to boolean)
console.log("!!'hello':", !!"hello"); // true (converts to boolean)

// Nullish Coalescing (??) - Returns right side if left is null/undefined (ES2020)
// - Only checks for null or undefined (not all falsy values)
// - Use case: default values when 0 or "" are valid
// - Difference from ||: 0 ?? 10 returns 0, but 0 || 10 returns 10
console.log("\nNullish Coalescing (??):");
console.log("null ?? 'default':", null ?? "default"); // 'default'
console.log("undefined ?? 'default':", undefined ?? "default"); // 'default'
console.log("0 ?? 10:", 0 ?? 10); // 0 (0 is not null/undefined)
console.log("'' ?? 'default':", "" ?? "default"); // '' (empty string is not null/undefined)
console.log("false ?? true:", false ?? true); // false

// ============================================
// Assignment Operators
// ============================================

// Simple Assignment (=) - Assigns value to variable (ES1)
// - Right-to-left associativity
// - Returns the assigned value
let a = 10;
console.log("\nSimple Assignment:");
console.log("a = 10:", a); // 10

// Addition Assignment (+=) - Adds and assigns (ES1)
// - Equivalent to: a = a + value
// - Works with numbers and strings
a += 5; // a = a + 5
console.log("a += 5:", a); // 15

// Subtraction Assignment (-=) - Subtracts and assigns (ES1)
a -= 3; // a = a - 3
console.log("a -= 3:", a); // 12

// Multiplication Assignment (*=) - Multiplies and assigns (ES1)
a *= 2; // a = a * 2
console.log("a *= 2:", a); // 24

// Division Assignment (/=) - Divides and assigns (ES1)
a /= 4; // a = a / 4
console.log("a /= 4:", a); // 6

// Modulus Assignment (%=) - Remainder and assigns (ES1)
a %= 4; // a = a % 4
console.log("a %= 4:", a); // 2

// Exponentiation Assignment (**=) - Exponentiation and assigns (ES2016/ES7)
a **= 3; // a = a ** 3
console.log("a **= 3:", a); // 8

// Logical AND Assignment (&&=) - Assigns if left is truthy (ES2021)
// - Only assigns if left side is truthy
// - Short-circuits like &&
let b = 10;
b &&= 20; // b = b && 20
console.log("\nLogical Assignment:");
console.log("b &&= 20:", b); // 20

let c = 0;
c &&= 20; // c is falsy, no assignment
console.log("c &&= 20:", c); // 0

// Logical OR Assignment (||=) - Assigns if left is falsy (ES2021)
let d = 0;
d ||= 10; // d = d || 10
console.log("d ||= 10:", d); // 10

let e = 5;
e ||= 10; // e is truthy, no assignment
console.log("e ||= 10:", e); // 5

// Nullish Coalescing Assignment (??=) - Assigns if left is null/undefined (ES2021)
let f = null;
f ??= 10; // f = f ?? 10
console.log("f ??= 10:", f); // 10

let g = 0;
g ??= 10; // g is not null/undefined, no assignment
console.log("g ??= 10:", g); // 0

// ============================================
// Ternary (Conditional) Operator
// ============================================

// Ternary Operator (? :) - Inline if-else (ES1)
// - Syntax: condition ? valueIfTrue : valueIfFalse
// - Only operator with three operands
// - Returns a value (unlike if statement)
// - Use case: simple conditional assignments
// - Common pitfall: nesting makes code hard to read
const age = 20;
const canVote = age >= 18 ? "Yes" : "No";
console.log("\nTernary Operator:");
console.log("Can vote:", canVote); // "Yes"

const score = 85;
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
console.log("Grade:", grade); // "B"

// Ternary with side effects
let count = 0;
const result = count > 0 ? count++ : count--;
console.log("Result:", result); // -1 (count was 0, so count-- executed)
console.log("Count:", count); // -1

// ============================================
// Bitwise Operators
// ============================================

// Bitwise operators work on 32-bit integers (ES1)
// - JavaScript converts numbers to 32-bit signed integers
// - Performs operation on binary representation
// - Converts back to number
// - Use case: flags, permissions, low-level operations

// Bitwise AND (&) - Returns 1 if both bits are 1 (ES1)
// - Use case: checking flags, masking bits
console.log("\nBitwise AND (&):");
console.log("5 & 3:", 5 & 3); // 1 (0101 & 0011 = 0001)
console.log("12 & 10:", 12 & 10); // 8 (1100 & 1010 = 1000)

// Bitwise OR (|) - Returns 1 if either bit is 1 (ES1)
// - Use case: setting flags, combining permissions
console.log("\nBitwise OR (|):");
console.log("5 | 3:", 5 | 3); // 7 (0101 | 0011 = 0111)
console.log("12 | 10:", 12 | 10); // 14 (1100 | 1010 = 1110)

// Bitwise XOR (^) - Returns 1 if bits are different (ES1)
// - Use case: toggling flags, simple encryption
console.log("\nBitwise XOR (^):");
console.log("5 ^ 3:", 5 ^ 3); // 6 (0101 ^ 0011 = 0110)
console.log("12 ^ 10:", 12 ^ 10); // 6 (1100 ^ 1010 = 0110)

// Bitwise NOT (~) - Inverts all bits (ES1)
// - Equivalent to -(n + 1)
// - Use case: bitwise operations, indexOf checks
console.log("\nBitwise NOT (~):");
console.log("~5:", ~5); // -6 (inverts 0101 to 1010 in 32-bit)
console.log("~-1:", ~-1); // 0
console.log("~0:", ~0); // -1

// Left Shift (<<) - Shifts bits left, fills with zeros (ES1)
// - Equivalent to multiplying by 2^n
// - Use case: fast multiplication by powers of 2
console.log("\nLeft Shift (<<):");
console.log("5 << 1:", 5 << 1); // 10 (0101 << 1 = 1010)
console.log("5 << 2:", 5 << 2); // 20 (multiply by 4)
console.log("3 << 3:", 3 << 3); // 24 (multiply by 8)

// Sign-propagating Right Shift (>>) - Shifts right, preserves sign (ES1)
// - Equivalent to dividing by 2^n (rounds toward negative infinity)
// - Use case: fast division by powers of 2
console.log("\nSign-propagating Right Shift (>>):");
console.log("20 >> 1:", 20 >> 1); // 10 (divide by 2)
console.log("20 >> 2:", 20 >> 2); // 5 (divide by 4)
console.log("-20 >> 2:", -20 >> 2); // -5 (preserves sign)

// Zero-fill Right Shift (>>>) - Shifts right, fills with zeros (ES1)
// - Always produces positive result
// - Use case: unsigned integer operations
console.log("\nZero-fill Right Shift (>>>):");
console.log("20 >>> 1:", 20 >>> 1); // 10
console.log("-20 >>> 1:", -20 >>> 1); // 2147483638 (treats as unsigned)
console.log("5 >>> 0:", 5 >>> 0); // 5 (trick to convert to 32-bit unsigned)

// ============================================
// Operator Precedence Examples
// ============================================

// Operator precedence determines evaluation order (ES1)
// - Higher precedence operators execute first
// - Use parentheses for clarity
// - Common pitfall: unexpected order of operations

console.log("\nOperator Precedence:");
console.log("2 + 3 * 4:", 2 + 3 * 4); // 14 (not 20, * before +)
console.log("(2 + 3) * 4:", (2 + 3) * 4); // 20 (parentheses first)
console.log("10 - 5 - 2:", 10 - 5 - 2); // 3 (left-to-right)
console.log("2 ** 3 ** 2:", 2 ** 3 ** 2); // 512 (right-to-left for **)
console.log("true || false && false:", true || false && false); // true (&& before ||)
console.log("(true || false) && false:", (true || false) && false); // false

// ============================================
// typeof and instanceof Operators
// ============================================

// typeof - Returns string indicating type (ES1)
// - Returns: "string", "number", "boolean", "undefined", "object", "function", "symbol", "bigint"
// - Common pitfall: typeof null === "object"
// - Use case: type checking, validation
console.log("\ntypeof Operator:");
console.log("typeof 'hello':", typeof "hello"); // "string"
console.log("typeof 42:", typeof 42); // "number"
console.log("typeof true:", typeof true); // "boolean"
console.log("typeof undefined:", typeof undefined); // "undefined"
console.log("typeof null:", typeof null); // "object" (historical bug!)
console.log("typeof {}:", typeof {}); // "object"
console.log("typeof []:", typeof []); // "object" (arrays are objects)
console.log("typeof function(){}:", typeof function () {}); // "function"
console.log("typeof Symbol():", typeof Symbol()); // "symbol"
console.log("typeof 10n:", typeof 10n); // "bigint"

// instanceof - Tests if object is instance of constructor (ES3)
// - Checks prototype chain
// - Use case: type checking for objects
// - Common pitfall: doesn't work across different execution contexts (iframes)
console.log("\ninstanceof Operator:");
console.log("[] instanceof Array:", [] instanceof Array); // true
console.log("{} instanceof Object:", {} instanceof Object); // true
console.log("[] instanceof Object:", [] instanceof Object); // true (Array extends Object)
console.log("'hello' instanceof String:", "hello" instanceof String); // false (primitive)
console.log("new String('hello') instanceof String:", new String("hello") instanceof String); // true (object)

// ============================================
// Other Operators
// ============================================

// Comma Operator (,) - Evaluates each operand, returns last (ES1)
// - Use case: multiple expressions in one statement (rare)
// - Common in for loops
console.log("\nComma Operator:");
let h = (1, 2, 3); // evaluates 1, 2, 3, returns 3
console.log("h = (1, 2, 3):", h); // 3

// Grouping Operator () - Controls evaluation order (ES1)
// - Highest precedence
// - Use case: override default precedence
const grouped = (2 + 3) * 4;
console.log("(2 + 3) * 4:", grouped); // 20

// Void Operator - Evaluates expression, returns undefined (ES1)
// - Use case: force undefined return, prevent navigation in links
console.log("\nvoid Operator:");
console.log("void 0:", void 0); // undefined
console.log("void (2 + 2):", void (2 + 2)); // undefined (expression evaluated but returns undefined)

// Delete Operator - Removes property from object (ES1)
// - Returns true if successful
// - Cannot delete variables or functions
// - Use case: removing object properties
const obj = { a: 1, b: 2 };
console.log("\ndelete Operator:");
console.log("Before delete:", obj); // { a: 1, b: 2 }
console.log("delete obj.a:", delete obj.a); // true
console.log("After delete:", obj); // { b: 2 }

// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: == vs === (type coercion)
console.log("\nPitfall 1: == vs ===");
console.log("0 == false:", 0 == false); // true (type coercion)
console.log("0 === false:", 0 === false); // false (different types)
console.log("'' == 0:", "" == 0); // true (both convert to 0)
console.log("'' === 0:", "" === 0); // false
// Best Practice: Always use === and !== unless you specifically need type coercion

// Pitfall 2: Operator precedence confusion
console.log("\nPitfall 2: Operator Precedence");
console.log("5 + 10 * 2:", 5 + 10 * 2); // 25 (not 30)
console.log("true || false && false:", true || false && false); // true (not false)
// Best Practice: Use parentheses for clarity, even if not strictly needed

// Pitfall 3: NaN comparisons
console.log("\nPitfall 3: NaN Comparisons");
console.log("NaN == NaN:", NaN == NaN); // false
console.log("NaN === NaN:", NaN === NaN); // false
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
// Best Practice: Use Number.isNaN() to check for NaN

// Pitfall 4: Floating point precision
console.log("\nPitfall 4: Floating Point Precision");
console.log("0.1 + 0.2:", 0.1 + 0.2); // 0.30000000000000004
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3); // false
console.log("Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON:", Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
// Best Practice: Use epsilon comparison for floating point equality

// Pitfall 5: String + Number concatenation
console.log("\nPitfall 5: String + Number");
console.log("'5' + 3:", "5" + 3); // "53" (concatenation)
console.log("'5' - 3:", "5" - 3); // 2 (subtraction converts to number)
console.log("'5' * 3:", "5" * 3); // 15 (multiplication converts to number)
// Best Practice: Explicitly convert types with Number() or String()

// Pitfall 6: Truthy/Falsy confusion
console.log("\nPitfall 6: Truthy/Falsy Values");
console.log("Boolean(0):", Boolean(0)); // false
console.log("Boolean(''):", Boolean("")); // false
console.log("Boolean('0'):", Boolean("0")); // true (non-empty string)
console.log("Boolean([]):", Boolean([])); // true (empty array is truthy!)
console.log("Boolean({}):", Boolean({})); // true (empty object is truthy!)
// Best Practice: Be explicit with comparisons, don't rely on implicit coercion

// Pitfall 7: || vs ?? for default values
console.log("\nPitfall 7: || vs ?? for Defaults");
const value1 = 0;
const value2 = null;
console.log("0 || 'default':", value1 || "default"); // "default" (0 is falsy)
console.log("0 ?? 'default':", value1 ?? "default"); // 0 (0 is not null/undefined)
console.log("null || 'default':", value2 || "default"); // "default"
console.log("null ?? 'default':", value2 ?? "default"); // "default"
// Best Practice: Use ?? when 0, false, or "" are valid values

// Pitfall 8: Postfix vs Prefix increment
console.log("\nPitfall 8: Postfix vs Prefix");
let i = 5;
console.log("i++:", i++); // 5 (returns then increments)
console.log("i:", i); // 6
console.log("++i:", ++i); // 7 (increments then returns)
console.log("i:", i); // 7
// Best Practice: Use on separate line to avoid confusion

// Pitfall 9: Bitwise operators on negative numbers
console.log("\nPitfall 9: Bitwise on Negatives");
console.log("~-1:", ~-1); // 0
console.log("-5 >> 1:", -5 >> 1); // -3 (sign-propagating)
console.log("-5 >>> 1:", -5 >>> 1); // 2147483645 (zero-fill)
// Best Practice: Be careful with bitwise operators on negative numbers

// Pitfall 10: typeof null
console.log("\nPitfall 10: typeof null");
console.log("typeof null:", typeof null); // "object" (historical bug)
console.log("null === null:", null === null); // true (use this instead)
// Best Practice: Use === null to check for null specifically

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. STRICT EQUALITY ENFORCEMENT
   JS:  Can use == or === (both compile)
   TS:  ESLint rules often enforce === only
   TS:  @typescript-eslint/no-implicit-coercion warns about ==

2. TYPE-SAFE OPERATORS
   JS:  let x = 5 + "3"; // "53" (allowed)
   TS:  let x: number = 5 + "3"; // ❌ Error: Type 'string' is not assignable to type 'number'
   TS:  Catches type mismatches at compile time

3. NULLISH COALESCING WITH STRICT NULL CHECKS
   JS:  value ?? default (ES2020+)
   TS:  Same syntax, but with strictNullChecks, provides better type narrowing
   TS:  let x: string | null = null; let y = x ?? "default"; // y is string

4. OPTIONAL CHAINING
   JS:  obj?.prop (ES2020+)
   TS:  Same syntax, but provides type safety
   TS:  Type narrows to exclude null/undefined after check

5. BITWISE OPERATORS
   JS:  Works on any number
   TS:  Can enforce integer types with custom types
   TS:  type Int32 = number & { __int32: never }; (branded types)

6. TYPEOF TYPE GUARDS
   JS:  typeof x === "string" (runtime check)
   TS:  Same syntax, but TypeScript narrows type in if block
   TS:  if (typeof x === "string") { x.toUpperCase(); // x is string here }

7. INSTANCEOF TYPE GUARDS
   JS:  obj instanceof Class (runtime check)
   TS:  Same syntax, but TypeScript narrows type
   TS:  if (obj instanceof Error) { console.log(obj.message); // obj is Error }

8. OPERATOR OVERLOADING
   JS:  No operator overloading
   TS:  No operator overloading (same as JS)
   TS:  Must use methods for custom types

⚠️ COMMON CONFUSION POINTS:
- TypeScript doesn't change runtime behavior of operators
- === is enforced by linters, not the compiler
- Type coercion still happens at runtime
- Bitwise operators still convert to 32-bit integers
- typeof and instanceof work the same, but provide type narrowing
- Operator precedence is identical to JavaScript

📘 See 07-operators-ts-comparison.ts for detailed examples!
*/
