// Operators and Expressions Demo
// 📘 For TypeScript comparison, see: 02-operators-ts-comparison.ts

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
// Spread and Rest Operators
// ============================================

// Spread Operator (...) - Expands iterable into individual elements (ES2015)
// - Works with arrays, objects, strings, and any iterable
// - Use case: array/object copying, merging, function arguments
// - Common pitfall: creates shallow copy (nested objects are still referenced)
console.log("\nSpread Operator (...):");

// Array spreading
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
console.log("Combined arrays:", combined);

// Array copying (shallow)
const original = [1, 2, 3];
const copy = [...original];
console.log("Array copy:", copy); // [1, 2, 3]
console.log("Are they same?:", original === copy); // false (different references)

// Object spreading
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const mergedObj = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }
console.log("Merged objects:", mergedObj);

// Object spreading with override
const defaults = { theme: "light", lang: "en" };
const userPrefs = { theme: "dark" };
const finalPrefs = { ...defaults, ...userPrefs }; // theme: "dark" wins
console.log("Final preferences:", finalPrefs);

// Spread in function calls
const numbers = [5, 10, 15];
console.log("Math.max with spread:", Math.max(...numbers)); // 15

// String spreading
const str = "hello";
const chars = [...str]; // ['h', 'e', 'l', 'l', 'o']
console.log("String to array:", chars);

// Edge case: Shallow copy warning
const nested = { a: { b: 1 } };
const shallowCopy = { ...nested };
shallowCopy.a.b = 2;
console.log("Original nested.a.b:", nested.a.b); // 2 (modified!)
console.log("Shallow copy warning: nested objects are still referenced");

// Rest Parameters (...rest) - Collects remaining elements into array (ES2015)
// - Must be last parameter
// - Creates real array (unlike arguments object)
// - Use case: variable number of function arguments
console.log("\nRest Parameters (...):");

function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
console.log("sum(1, 2, 3, 4):", sum(1, 2, 3, 4)); // 10

function greet(greeting, ...names) {
  return `${greeting} ${names.join(", ")}!`;
}
console.log("greet('Hello', 'Alice', 'Bob'):", greet("Hello", "Alice", "Bob")); // "Hello Alice, Bob!"

// Rest in destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log("Destructuring with rest:", { first, second, rest }); // { first: 1, second: 2, rest: [3, 4, 5] }

const { x, y, ...remaining } = { x: 1, y: 2, z: 3, w: 4 };
console.log("Object destructuring with rest:", { x, y, remaining }); // { x: 1, y: 2, remaining: { z: 3, w: 4 } }

// ============================================
// Property Access Operators
// ============================================

// Optional Chaining (?.) - Safely access nested properties (ES2020)
// - Returns undefined if any part is null/undefined
// - Short-circuits: stops evaluation at first null/undefined
// - Use case: accessing deeply nested properties, optional method calls
// - Prevents "Cannot read property of undefined" errors
console.log("\nOptional Chaining (?.):");

const user = {
  name: "Alice",
  address: {
    city: "NYC",
    zip: "10001"
  },
  getEmail: function() {
    return "alice@example.com";
  }
};

// Safe property access
console.log("user?.address?.city:", user?.address?.city); // "NYC"
console.log("user?.contact?.email:", user?.contact?.email); // undefined (no error!)

// Optional method call
console.log("user.getEmail?.():", user.getEmail?.()); // "alice@example.com"
console.log("user.sendEmail?.():", user.sendEmail?.()); // undefined (method doesn't exist)

// Optional array indexing
const arr = [1, 2, 3];
console.log("arr?.[0]:", arr?.[0]); // 1
console.log("arr?.[10]:", arr?.[10]); // undefined

const nullArr = null;
console.log("nullArr?.[0]:", nullArr?.[0]); // undefined (no error!)

// Edge case: Optional chaining with function calls
const obj3 = {
  method: null
};
console.log("obj3.method?.():", obj3.method?.()); // undefined (method is null)
// console.log("obj3.method():", obj3.method()); // ❌ Error: obj3.method is not a function

// ============================================
// this Keyword
// ============================================

// this - References current execution context (ES1)
// - In methods: refers to the object
// - In functions: depends on how function is called
// - Arrow functions: inherit this from enclosing scope
// - Use case: accessing object properties, method context
// - Common pitfall: this changes based on call context
console.log("\nthis Keyword:");

const person = {
  name: "Bob",
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  },
  greetArrow: () => {
    console.log(`Arrow function this:`, this); // inherits from outer scope
  }
};

person.greet(); // "Hello, I'm Bob" (this = person)

// this in different contexts
function regularFunction() {
  console.log("Regular function this:", this); // depends on call context
}

const arrowFunction = () => {
  console.log("Arrow function inherits this from enclosing scope");
};

// Binding this
const boundGreet = person.greet.bind(person);
boundGreet(); // "Hello, I'm Bob" (this is bound to person)

// ============================================
// super Keyword
// ============================================

// super - Calls parent class methods (ES2015)
// - Used in class inheritance
// - super() calls parent constructor (must be called before using this)
// - super.method() calls parent method
// - Use case: extending classes, calling parent functionality
console.log("\nsuper Keyword:");

class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Must call super() before using this
    this.breed = breed;
  }
  
  speak() {
    const parentSpeak = super.speak(); // Call parent method
    return `${parentSpeak} and barks!`;
  }
}

const dog = new Dog("Rex", "Labrador");
console.log("dog.speak():", dog.speak()); // "Rex makes a sound and barks!"
console.log("dog.name:", dog.name); // "Rex"
console.log("dog.breed:", dog.breed); // "Labrador"

// ============================================
// Other Operators
// ============================================

// Comma Operator (,) - Evaluates each operand, returns last (ES1)
// - Use case: multiple expressions in one statement (rare)
// - Common in for loops
// - Common pitfall: lowest precedence, can cause confusion
console.log("\nComma Operator:");
let h = (1, 2, 3); // evaluates 1, 2, 3, returns 3
console.log("h = (1, 2, 3):", h); // 3

// Comma in for loops
for (let i = 0, j = 10; i < 5; i++, j--) {
  console.log(`i: ${i}, j: ${j}`);
}

// Edge case: Comma operator precedence
let commaTest = (5, 10); // 10
console.log("Comma with parentheses:", commaTest); // 10
// let commaTest2 = 5, 10; // ❌ Syntax error without parentheses

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
// - Returns true if successful (even if property doesn't exist!)
// - Cannot delete variables or functions
// - Use case: removing object properties
// - Common pitfall: returns true even if property doesn't exist
const obj = { a: 1, b: 2 };
console.log("\ndelete Operator:");
console.log("Before delete:", obj); // { a: 1, b: 2 }
console.log("delete obj.a:", delete obj.a); // true
console.log("After delete:", obj); // { b: 2 }
console.log("delete obj.nonexistent:", delete obj.nonexistent); // true (even though it doesn't exist!)

// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls & Edge Cases ===");

// Pitfall 1: NaN comparison behavior
console.log("\nPitfall 1: NaN Comparison Behavior");
console.log("NaN == NaN:", NaN == NaN); // false
console.log("NaN === NaN:", NaN === NaN); // false
console.log("NaN !== NaN:", NaN !== NaN); // true (only value not equal to itself!)
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
console.log("Number.isNaN('hello'):", Number.isNaN("hello")); // false (not NaN, just not a number)
console.log("isNaN('hello'):", isNaN("hello")); // true (legacy, converts to number first)
// Best Practice: Use Number.isNaN() to check for NaN, not === or ==

// Pitfall 2: Floating point precision
console.log("\nPitfall 2: Floating Point Precision");
console.log("0.1 + 0.2:", 0.1 + 0.2); // 0.30000000000000004
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3); // false
console.log("Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON:", Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true
console.log("0.3 - 0.2:", 0.3 - 0.2); // 0.09999999999999998
console.log("0.3 - 0.1:", 0.3 - 0.1); // 0.19999999999999998
// Best Practice: Use epsilon comparison for floating point equality, or work with integers

// Pitfall 3: Type coercion with addition
console.log("\nPitfall 3: Type Coercion with Addition");
console.log("1 + 2:", 1 + 2); // 3 (number + number)
console.log("'1' + 2:", "1" + 2); // "12" (string + number = string concatenation)
console.log("1 + '2':", 1 + "2"); // "12" (number + string = string concatenation)
console.log("'1' + '2':", "1" + "2"); // "12" (string + string)
console.log("1 + 2 + '3':", 1 + 2 + "3"); // "33" (left-to-right: (1+2)+'3' = 3+'3')
console.log("'1' + 2 + 3:", "1" + 2 + 3); // "123" (left-to-right: ('1'+2)+3 = '12'+3)
// Best Practice: Explicitly convert types with Number() or String()

// Pitfall 4: Division by zero
console.log("\nPitfall 4: Division by Zero");
console.log("1 / 0:", 1 / 0); // Infinity
console.log("-1 / 0:", -1 / 0); // -Infinity
console.log("0 / 0:", 0 / 0); // NaN
console.log("Infinity + 1:", Infinity + 1); // Infinity
console.log("Infinity - Infinity:", Infinity - Infinity); // NaN
console.log("Infinity * 0:", Infinity * 0); // NaN
// Best Practice: Check for zero before division, or handle Infinity/NaN appropriately

// Pitfall 5: Bitwise operations on negative numbers
console.log("\nPitfall 5: Bitwise on Negative Numbers");
console.log("~5:", ~5); // -6 (bitwise NOT)
console.log("~-1:", ~-1); // 0
console.log("-5 >> 1:", -5 >> 1); // -3 (sign-propagating right shift)
console.log("-5 >>> 1:", -5 >>> 1); // 2147483645 (zero-fill right shift, treats as unsigned)
console.log("-1 >>> 0:", -1 >>> 0); // 4294967295 (converts to unsigned 32-bit)
// Best Practice: Be careful with bitwise operators on negative numbers, understand two's complement

// Pitfall 6: Operator precedence gotchas
console.log("\nPitfall 6: Operator Precedence");
console.log("2 + 3 * 4:", 2 + 3 * 4); // 14 (not 20, * before +)
console.log("(2 + 3) * 4:", (2 + 3) * 4); // 20 (parentheses first)
console.log("true || false && false:", true || false && false); // true (&& before ||)
console.log("(true || false) && false:", (true || false) && false); // false
console.log("2 ** 3 ** 2:", 2 ** 3 ** 2); // 512 (right-to-left: 2 ** (3 ** 2))
console.log("(2 ** 3) ** 2:", (2 ** 3) ** 2); // 64
// Best Practice: Use parentheses for clarity, even if not strictly needed

// Pitfall 7: Prefix vs postfix increment
console.log("\nPitfall 7: Prefix vs Postfix Increment");
let prefixTest = 5;
console.log("prefixTest:", prefixTest); // 5
console.log("prefixTest++:", prefixTest++); // 5 (returns then increments)
console.log("prefixTest:", prefixTest); // 6
console.log("++prefixTest:", ++prefixTest); // 7 (increments then returns)
console.log("prefixTest:", prefixTest); // 7
// Best Practice: Use on separate line to avoid confusion

// Pitfall 8: Loose equality coercion
console.log("\nPitfall 8: Loose Equality Coercion");
console.log("0 == false:", 0 == false); // true
console.log("'' == false:", "" == false); // true
console.log("null == undefined:", null == undefined); // true
console.log("[] == false:", [] == false); // true (array converts to empty string)
console.log("[] == ![]:", [] == ![]); // true (bizarre but true!)
console.log("'0' == false:", "0" == false); // true
// Best Practice: Always use === and !== unless you specifically need type coercion

// Pitfall 9: Nullish coalescing vs logical OR
console.log("\nPitfall 9: Nullish Coalescing vs Logical OR");
console.log("0 ?? 10:", 0 ?? 10); // 0 (0 is not null/undefined)
console.log("0 || 10:", 0 || 10); // 10 (0 is falsy)
console.log("'' ?? 'default':", "" ?? "default"); // '' (empty string is not null/undefined)
console.log("'' || 'default':", "" || "default"); // 'default' (empty string is falsy)
console.log("false ?? true:", false ?? true); // false (false is not null/undefined)
console.log("false || true:", false || true); // true (false is falsy)
// Best Practice: Use ?? when 0, false, or "" are valid values

// Pitfall 10: Optional chaining with function calls
console.log("\nPitfall 10: Optional Chaining with Function Calls");
const optionalObj = {
  method: null,
  validMethod: () => "success"
};
console.log("optionalObj.method?.():", optionalObj.method?.()); // undefined (method is null)
console.log("optionalObj.validMethod?.():", optionalObj.validMethod?.()); // "success"
console.log("optionalObj.nonexistent?.():", optionalObj.nonexistent?.()); // undefined
// Without optional chaining: optionalObj.method() would throw error
// Best Practice: Use ?. when accessing properties or methods that might not exist

// Pitfall 11: String comparison is lexicographic
console.log("\nPitfall 11: String Comparison");
console.log("'10' < '9':", "10" < "9"); // true ('1' < '9' in Unicode)
console.log("'apple' < 'banana':", "apple" < "banana"); // true
console.log("'Apple' < 'apple':", "Apple" < "apple"); // true (uppercase comes before lowercase)
console.log("10 < 9:", 10 < 9); // false (numeric comparison)
// Best Practice: Convert to numbers for numeric comparison, use localeCompare for proper string sorting

// Pitfall 12: Delete operator return value
console.log("\nPitfall 12: Delete Operator Return Value");
const deleteTest = { x: 1 };
console.log("delete deleteTest.x:", delete deleteTest.x); // true
console.log("delete deleteTest.nonexistent:", delete deleteTest.nonexistent); // true (even though it doesn't exist!)
console.log("deleteTest:", deleteTest); // {}
// Best Practice: Don't rely on delete return value to check if property existed

console.log("\n=== Best Practices Summary ===");

// Best Practice 1: Use strict equality
console.log("\nBest Practice: Use Strict Equality (=== and !==)");
console.log("Always use === instead of ==");
console.log("Always use !== instead of !=");
console.log("Reason: Avoids unexpected type coercion and makes code more predictable");
// Good: if (x === 5) { }
// Bad:  if (x == 5) { }

// Best Practice 2: Use optional chaining for nested access
console.log("\nBest Practice: Use Optional Chaining for Nested Access");
console.log("Use ?. to safely access nested properties");
console.log("Prevents 'Cannot read property of undefined' errors");
// Good: const city = user?.address?.city;
// Bad:  const city = user && user.address && user.address.city;

// Best Practice 3: Use nullish coalescing for default values
console.log("\nBest Practice: Use Nullish Coalescing for Default Values");
console.log("Prefer ?? over || when 0, false, or '' are valid values");
console.log("Reason: ?? only treats null/undefined as nullish");
// Good: const count = userInput ?? 10;
// Bad:  const count = userInput || 10; // treats 0 as invalid

// Best Practice 4: Avoid implicit type coercion
console.log("\nBest Practice: Avoid Implicit Type Coercion");
console.log("Be explicit about type conversions");
console.log("Reason: Makes code more readable and prevents bugs");
// Good: const num = Number("42");
// Bad:  const num = +"42";

// Best Practice 5: Use parentheses for clarity
console.log("\nBest Practice: Use Parentheses for Clarity");
console.log("Add parentheses to make operator precedence explicit");
console.log("Reason: Improves readability and prevents precedence-related bugs");
// Good: const result = (a + b) * c;
// Bad:  const result = a + b * c; // unclear intent

// Best Practice 6: Use logical assignment operators
console.log("\nBest Practice: Use Logical Assignment Operators");
console.log("Use &&=, ||=, ??= for conditional assignment");
console.log("Reason: More concise and expressive than traditional patterns");
// Good: obj.prop ??= defaultValue;
// Bad:  if (!obj.prop) obj.prop = defaultValue;

// Best Practice 7: Use typeof carefully
console.log("\nBest Practice: Use typeof Carefully");
console.log("Remember typeof null === 'object'");
console.log("Use appropriate checks for different types");
// Good: if (x !== null && typeof x === "object") { }
// Bad:  if (typeof x === "object") { } // includes null

// Best Practice 8: Prefer exponentiation operator
console.log("\nBest Practice: Prefer Exponentiation Operator");
console.log("Use ** instead of Math.pow()");
console.log("Reason: More concise and readable");
// Good: const square = x ** 2;
// Bad:  const square = Math.pow(x, 2);

// Best Practice 9: Be careful with delete
console.log("\nBest Practice: Be Careful with delete");
console.log("Understand delete behavior and consider alternatives");
console.log("Reason: delete can cause performance issues");
// Consider: obj.prop = undefined; // or use Map for dynamic keys

// Best Practice 10: Avoid comma operator
console.log("\nBest Practice: Avoid Comma Operator");
console.log("Avoid using comma operator except in for loops");
console.log("Reason: Comma operator is confusing and rarely necessary");
// Good: a++; b++; let x = c;
// Bad:  let x = (a++, b++, c);
