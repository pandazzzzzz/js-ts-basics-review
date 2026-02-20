// Numbers and Math Object Demo
// 📘 For TypeScript comparison, see: 05-numbers-math-ts-comparison.ts
// 📘 javascript.info: "Numbers"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number

// ============================================
// 1. Number Representation
// ============================================

// Decimal (base 10) - Most common
const decimal = 42;
const decimalFloat = 3.14159;

// Hexadecimal (base 16) - Prefix with 0x
// - Used for colors, memory addresses
// - Digits: 0-9, A-F (case insensitive)
const hex = 0xFF; // 255
const hexColor = 0x00FF00; // Green color

// Octal (base 8) - Prefix with 0o (ES6)
// - Digits: 0-7
// - Old syntax: 077 (deprecated in strict mode)
const octal = 0o77; // 63
const octalAlt = 0o755; // 493 (common for file permissions)

// Binary (base 2) - Prefix with 0b (ES6)
// - Digits: 0-1
// - Useful for bit flags
const binary = 0b1010; // 10
const binaryFlags = 0b11111111; // 255

console.log("=== Number Representation ===");
console.log("Decimal:", decimal);
console.log("Hex 0xFF:", hex);
console.log("Octal 0o77:", octal);
console.log("Binary 0b1010:", binary);

// Scientific notation (exponential)
// - e/E followed by exponent
// - Useful for very large or small numbers
const million = 1e6; // 1 * 10^6 = 1,000,000
const billion = 1e9; // 1,000,000,000
const micro = 1e-6; // 0.000001
const nano = 1.5e-9; // 0.0000000015

console.log("\n=== Scientific Notation ===");
console.log("1e6:", million);
console.log("1e9:", billion);
console.log("1e-6:", micro);
console.log("1.5e-9:", nano);

// Numeric separators (ES2021)
// - Improves readability for large numbers
// - Can use underscore _ anywhere between digits
// - Cannot start or end with _, or have multiple consecutive _
const largeNumber = 1_000_000; // 1 million
const billion2 = 1_000_000_000;
const creditCard = 1234_5678_9012_3456;
const bytes = 0xFF_FF_FF_FF; // 4,294,967,295
const binary2 = 0b1111_0000_1010_0101;

console.log("\n=== Numeric Separators (ES2021) ===");
console.log("1_000_000:", largeNumber);
console.log("Credit card:", creditCard);
console.log("Bytes:", bytes);

// IEEE 754 Double Precision
// - JavaScript uses 64-bit floating point (IEEE 754)
// - 1 sign bit, 11 exponent bits, 52 mantissa bits
// - Can represent integers exactly up to 2^53 - 1
// - Floating point has precision limitations
console.log("\n=== IEEE 754 Basics ===");
console.log("Max safe integer:", Number.MAX_SAFE_INTEGER); // 2^53 - 1
console.log("Min safe integer:", Number.MIN_SAFE_INTEGER); // -(2^53 - 1)
console.log("Max value:", Number.MAX_VALUE); // ~1.8e308
console.log("Min value:", Number.MIN_VALUE); // ~5e-324 (smallest positive)

// ============================================
// 2. Precision Issues
// ============================================

// The famous 0.1 + 0.2 problem
// - Binary floating point cannot represent 0.1 and 0.2 exactly
// - Results in tiny rounding errors
console.log("\n=== Floating Point Precision ===");
console.log("0.1 + 0.2 =", 0.1 + 0.2); // 0.30000000000000004
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3); // false

// Why this happens:
// 0.1 in binary is 0.0001100110011... (repeating)
// 0.2 in binary is 0.001100110011... (repeating)
// Cannot be represented exactly in finite bits

// Solution 1: toFixed() for display
// - Rounds to specified decimal places
// - Returns string, not number
const sum = 0.1 + 0.2;
console.log("\ntoFixed solution:");
console.log("(0.1 + 0.2).toFixed(2):", sum.toFixed(2)); // "0.30"
console.log("parseFloat((0.1 + 0.2).toFixed(10)):", parseFloat(sum.toFixed(10))); // 0.3

// Solution 2: Multiply, calculate, divide
// - Convert to integers, do math, convert back
// - Works for simple cases
console.log("\nInteger math solution:");
const result = (0.1 * 10 + 0.2 * 10) / 10;
console.log("(0.1 * 10 + 0.2 * 10) / 10:", result); // 0.3

// Solution 3: Epsilon comparison
// - Use Number.EPSILON for "close enough" comparisons
// - EPSILON is smallest difference between 1 and next representable number
console.log("\nEpsilon comparison:");
console.log("Number.EPSILON:", Number.EPSILON); // ~2.22e-16

function areEqual(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

console.log("areEqual(0.1 + 0.2, 0.3):", areEqual(0.1 + 0.2, 0.3)); // true

// More precision issues
console.log("\n=== More Precision Examples ===");
console.log("0.3 - 0.2:", 0.3 - 0.2); // 0.09999999999999998
console.log("0.3 - 0.1:", 0.3 - 0.1); // 0.19999999999999998
console.log("9007199254740992 + 1:", 9007199254740992 + 1); // 9007199254740992 (lost precision)
console.log("9007199254740992 + 2:", 9007199254740992 + 2); // 9007199254740994 (works)

// ============================================
// 3. Number Conversion and Parsing
// ============================================

// Number() - Strict conversion
// - Converts entire string to number
// - Returns NaN if string contains non-numeric characters
// - Handles whitespace, empty string, boolean, null
console.log("\n=== Number() Conversion ===");
console.log('Number("123"):', Number("123")); // 123
console.log('Number("  456  "):', Number("  456  ")); // 456 (trims whitespace)
console.log('Number(""):', Number("")); // 0 (empty string)
console.log('Number("123abc"):', Number("123abc")); // NaN
console.log("Number(true):", Number(true)); // 1
console.log("Number(false):", Number(false)); // 0
console.log("Number(null):", Number(null)); // 0
console.log("Number(undefined):", Number(undefined)); // NaN

// parseInt() - Parse integer
// - Parses until first non-digit character
// - Second parameter is radix (base)
// - Always specify radix to avoid confusion
console.log("\n=== parseInt() ===");
console.log('parseInt("123"):', parseInt("123")); // 123
console.log('parseInt("123.45"):', parseInt("123.45")); // 123 (stops at decimal)
console.log('parseInt("123abc"):', parseInt("123abc")); // 123 (stops at 'a')
console.log('parseInt("abc123"):', parseInt("abc123")); // NaN (starts with non-digit)
console.log('parseInt("  42  "):', parseInt("  42  ")); // 42 (trims whitespace)

// Radix parameter (base)
console.log("\n=== parseInt() with Radix ===");
console.log('parseInt("FF", 16):', parseInt("FF", 16)); // 255 (hex)
console.log('parseInt("77", 8):', parseInt("77", 8)); // 63 (octal)
console.log('parseInt("1010", 2):', parseInt("1010", 2)); // 10 (binary)
console.log('parseInt("123", 10):', parseInt("123", 10)); // 123 (decimal)

// parseFloat() - Parse floating point
// - Parses decimal numbers
// - Only works with base 10
// - No radix parameter
console.log("\n=== parseFloat() ===");
console.log('parseFloat("123.45"):', parseFloat("123.45")); // 123.45
console.log('parseFloat("123.45.67"):', parseFloat("123.45.67")); // 123.45 (stops at second dot)
console.log('parseFloat("3.14abc"):', parseFloat("3.14abc")); // 3.14
console.log('parseFloat("  2.5  "):', parseFloat("  2.5  ")); // 2.5

// Unary + operator - Quick conversion
// - Same as Number() but shorter
// - Commonly used in modern code
console.log("\n=== Unary + Operator ===");
console.log('+"123":', +"123"); // 123
console.log('+"  456  ":', +"  456  "); // 456
console.log('+"":', +""); // 0
console.log('+"123abc":', +"123abc"); // NaN
console.log("+true:", +true); // 1
console.log("+false:", +false); // 0

// Comparison of conversion methods
console.log("\n=== Conversion Comparison ===");
const testStr = "123.45abc";
console.log(`Input: "${testStr}"`);
console.log("Number():", Number(testStr)); // NaN
console.log("parseInt():", parseInt(testStr)); // 123
console.log("parseFloat():", parseFloat(testStr)); // 123.45
console.log("Unary +:", +testStr); // NaN

// ============================================
// 4. Special Values
// ============================================

// Infinity and -Infinity
// - Result of division by zero
// - Result of overflow
// - Larger/smaller than any number
console.log("\n=== Infinity ===");
console.log("1 / 0:", 1 / 0); // Infinity
console.log("-1 / 0:", -1 / 0); // -Infinity
console.log("Infinity + 1:", Infinity + 1); // Infinity
console.log("Infinity * 2:", Infinity * 2); // Infinity
console.log("Infinity / Infinity:", Infinity / Infinity); // NaN
console.log("1e309:", 1e309); // Infinity (overflow)

// NaN (Not a Number)
// - Result of invalid math operations
// - Only value that is not equal to itself
// - typeof NaN is "number"
console.log("\n=== NaN ===");
console.log("0 / 0:", 0 / 0); // NaN
console.log("Infinity - Infinity:", Infinity - Infinity); // NaN
console.log("Math.sqrt(-1):", Math.sqrt(-1)); // NaN
console.log('Number("abc"):', Number("abc")); // NaN
console.log("typeof NaN:", typeof NaN); // "number"
console.log("NaN === NaN:", NaN === NaN); // false (unique property!)

// isNaN() vs Number.isNaN()
// - Global isNaN() coerces to number first
// - Number.isNaN() checks if value is actually NaN
console.log("\n=== isNaN() vs Number.isNaN() ===");
console.log('isNaN("abc"):', isNaN("abc")); // true (coerces to NaN)
console.log('Number.isNaN("abc"):', Number.isNaN("abc")); // false (not NaN type)
console.log("isNaN(NaN):", isNaN(NaN)); // true
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
console.log('isNaN("123"):', isNaN("123")); // false (coerces to 123)
console.log('Number.isNaN("123"):', Number.isNaN("123")); // false

// isFinite() vs Number.isFinite()
// - Global isFinite() coerces to number first
// - Number.isFinite() checks if value is finite number
console.log("\n=== isFinite() vs Number.isFinite() ===");
console.log("isFinite(123):", isFinite(123)); // true
console.log("isFinite(Infinity):", isFinite(Infinity)); // false
console.log("isFinite(NaN):", isFinite(NaN)); // false
console.log('isFinite("123"):', isFinite("123")); // true (coerces)
console.log('Number.isFinite("123"):', Number.isFinite("123")); // false (not number type)

// Number.isInteger()
// - Checks if value is an integer
// - Returns false for non-numbers
console.log("\n=== Number.isInteger() ===");
console.log("Number.isInteger(123):", Number.isInteger(123)); // true
console.log("Number.isInteger(123.0):", Number.isInteger(123.0)); // true
console.log("Number.isInteger(123.45):", Number.isInteger(123.45)); // false
console.log('Number.isInteger("123"):', Number.isInteger("123")); // false

// Number.isSafeInteger()
// - Checks if value is safe integer (within ±2^53 - 1)
// - Safe integers can be represented exactly
console.log("\n=== Number.isSafeInteger() ===");
console.log("Number.isSafeInteger(123):", Number.isSafeInteger(123)); // true
console.log("Number.isSafeInteger(9007199254740991):", Number.isSafeInteger(9007199254740991)); // true (MAX_SAFE_INTEGER)
console.log("Number.isSafeInteger(9007199254740992):", Number.isSafeInteger(9007199254740992)); // false
console.log("Number.isSafeInteger(123.45):", Number.isSafeInteger(123.45)); // false

// ============================================
// 5. Number Methods
// ============================================

// toFixed(n) - Fixed decimal places
// - Rounds to n decimal places
// - Returns string
// - Useful for currency, display
const num = 123.456789;

console.log("\n=== toFixed() ===");
console.log("num:", num);
console.log("num.toFixed(0):", num.toFixed(0)); // "123"
console.log("num.toFixed(2):", num.toFixed(2)); // "123.46" (rounded)
console.log("num.toFixed(4):", num.toFixed(4)); // "123.4568"
console.log("(1.005).toFixed(2):", (1.005).toFixed(2)); // "1.01" (rounding quirk)

// toPrecision(n) - Fixed significant figures
// - Rounds to n significant digits
// - Returns string
// - May use exponential notation
console.log("\n=== toPrecision() ===");
console.log("num.toPrecision(3):", num.toPrecision(3)); // "123"
console.log("num.toPrecision(5):", num.toPrecision(5)); // "123.46"
console.log("num.toPrecision(8):", num.toPrecision(8)); // "123.45679"
console.log("(0.000123).toPrecision(2):", (0.000123).toPrecision(2)); // "0.00012"

// toString(base) - Convert to string with base
// - Default base is 10
// - Can specify base 2-36
// - Useful for debugging, display
console.log("\n=== toString() ===");
const n = 255;
console.log("n:", n);
console.log("n.toString():", n.toString()); // "255" (base 10)
console.log("n.toString(2):", n.toString(2)); // "11111111" (binary)
console.log("n.toString(8):", n.toString(8)); // "377" (octal)
console.log("n.toString(16):", n.toString(16)); // "ff" (hex)
console.log("n.toString(36):", n.toString(36)); // "73" (base 36, uses 0-9 and a-z)

// Direct method call on number literal
// - Need double dot or parentheses
console.log("\n=== Direct Method Calls ===");
console.log("123..toString():", 123..toString()); // "123"
console.log("(123).toString():", (123).toString()); // "123"
console.log("123 .toString():", 123 .toString()); // "123" (space works too)
// console.log("123.toString():", 123.toString()); // ❌ Syntax error (dot seen as decimal)

// ============================================
// 6. Math Object
// ============================================

// Math.round() - Round to nearest integer
// - .5 rounds up
console.log("\n=== Math.round() ===");
console.log("Math.round(4.4):", Math.round(4.4)); // 4
console.log("Math.round(4.5):", Math.round(4.5)); // 5
console.log("Math.round(4.6):", Math.round(4.6)); // 5
console.log("Math.round(-4.5):", Math.round(-4.5)); // -4 (rounds toward positive)

// Math.floor() - Round down
// - Always rounds toward negative infinity
console.log("\n=== Math.floor() ===");
console.log("Math.floor(4.9):", Math.floor(4.9)); // 4
console.log("Math.floor(4.1):", Math.floor(4.1)); // 4
console.log("Math.floor(-4.1):", Math.floor(-4.1)); // -5
console.log("Math.floor(-4.9):", Math.floor(-4.9)); // -5

// Math.ceil() - Round up
// - Always rounds toward positive infinity
console.log("\n=== Math.ceil() ===");
console.log("Math.ceil(4.1):", Math.ceil(4.1)); // 5
console.log("Math.ceil(4.9):", Math.ceil(4.9)); // 5
console.log("Math.ceil(-4.9):", Math.ceil(-4.9)); // -4
console.log("Math.ceil(-4.1):", Math.ceil(-4.1)); // -4

// Math.trunc() - Remove decimal part (ES6)
// - Simply removes fractional part
// - Different from floor for negative numbers
console.log("\n=== Math.trunc() ===");
console.log("Math.trunc(4.9):", Math.trunc(4.9)); // 4
console.log("Math.trunc(4.1):", Math.trunc(4.1)); // 4
console.log("Math.trunc(-4.9):", Math.trunc(-4.9)); // -4 (different from floor!)
console.log("Math.trunc(-4.1):", Math.trunc(-4.1)); // -4

// Rounding to decimal places
// - Multiply, round, divide
console.log("\n=== Round to Decimal Places ===");
const value = 1.2345;
console.log("Original:", value);
console.log("To 2 decimals:", Math.round(value * 100) / 100); // 1.23
console.log("To 3 decimals:", Math.round(value * 1000) / 1000); // 1.235

// Math.random() - Random number [0, 1)
// - Returns number >= 0 and < 1
// - Pseudo-random (not cryptographically secure)
console.log("\n=== Math.random() ===");
console.log("Math.random():", Math.random());
console.log("Math.random():", Math.random());
console.log("Math.random():", Math.random());

// Random integer in range [min, max]
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log("\n=== Random Integer in Range ===");
console.log("Random 1-6 (dice):", randomInt(1, 6));
console.log("Random 1-6 (dice):", randomInt(1, 6));
console.log("Random 1-6 (dice):", randomInt(1, 6));
console.log("Random 0-100:", randomInt(0, 100));

// Random float in range [min, max)
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

console.log("\n=== Random Float in Range ===");
console.log("Random 0-10:", randomFloat(0, 10));
console.log("Random 5-15:", randomFloat(5, 15));

// Math.max() / Math.min() - Maximum/minimum
// - Takes multiple arguments
// - Returns NaN if any argument is NaN
// - Use with spread operator for arrays
console.log("\n=== Math.max() / Math.min() ===");
console.log("Math.max(1, 5, 3):", Math.max(1, 5, 3)); // 5
console.log("Math.min(1, 5, 3):", Math.min(1, 5, 3)); // 1
console.log("Math.max(-1, -5, -3):", Math.max(-1, -5, -3)); // -1

const numbers = [1, 5, 3, 9, 2];
console.log("Array:", numbers);
console.log("Math.max(...numbers):", Math.max(...numbers)); // 9
console.log("Math.min(...numbers):", Math.min(...numbers)); // 1

// Math.pow() - Power
// - Math.pow(base, exponent)
// - Can also use ** operator (ES2016)
console.log("\n=== Math.pow() ===");
console.log("Math.pow(2, 3):", Math.pow(2, 3)); // 8
console.log("Math.pow(5, 2):", Math.pow(5, 2)); // 25
console.log("Math.pow(2, -1):", Math.pow(2, -1)); // 0.5
console.log("2 ** 3:", 2 ** 3); // 8 (ES2016 operator)

// Math.sqrt() - Square root
console.log("\n=== Math.sqrt() ===");
console.log("Math.sqrt(9):", Math.sqrt(9)); // 3
console.log("Math.sqrt(2):", Math.sqrt(2)); // 1.414...
console.log("Math.sqrt(-1):", Math.sqrt(-1)); // NaN

// Math.abs() - Absolute value
console.log("\n=== Math.abs() ===");
console.log("Math.abs(5):", Math.abs(5)); // 5
console.log("Math.abs(-5):", Math.abs(-5)); // 5
console.log("Math.abs(0):", Math.abs(0)); // 0

// Math.log() - Natural logarithm (base e)
// Math.log2() - Logarithm base 2 (ES6)
// Math.log10() - Logarithm base 10 (ES6)
console.log("\n=== Logarithms ===");
console.log("Math.log(Math.E):", Math.log(Math.E)); // 1
console.log("Math.log(10):", Math.log(10)); // 2.302...
console.log("Math.log2(8):", Math.log2(8)); // 3
console.log("Math.log2(1024):", Math.log2(1024)); // 10
console.log("Math.log10(100):", Math.log10(100)); // 2
console.log("Math.log10(1000):", Math.log10(1000)); // 3

// Math constants
console.log("\n=== Math Constants ===");
console.log("Math.PI:", Math.PI); // 3.141592653589793
console.log("Math.E:", Math.E); // 2.718281828459045
console.log("Math.LN2:", Math.LN2); // ln(2) = 0.693...
console.log("Math.LN10:", Math.LN10); // ln(10) = 2.302...
console.log("Math.LOG2E:", Math.LOG2E); // log2(e) = 1.442...
console.log("Math.LOG10E:", Math.LOG10E); // log10(e) = 0.434...
console.log("Math.SQRT2:", Math.SQRT2); // √2 = 1.414...
console.log("Math.SQRT1_2:", Math.SQRT1_2); // √(1/2) = 0.707...

// ES6 Math methods
console.log("\n=== ES6 Math Methods ===");

// Math.sign() - Sign of number
console.log("Math.sign(5):", Math.sign(5)); // 1
console.log("Math.sign(-5):", Math.sign(-5)); // -1
console.log("Math.sign(0):", Math.sign(0)); // 0
console.log("Math.sign(-0):", Math.sign(-0)); // -0

// Math.cbrt() - Cube root
console.log("Math.cbrt(8):", Math.cbrt(8)); // 2
console.log("Math.cbrt(27):", Math.cbrt(27)); // 3
console.log("Math.cbrt(-8):", Math.cbrt(-8)); // -2

// Math.hypot() - Hypotenuse (Pythagorean theorem)
console.log("Math.hypot(3, 4):", Math.hypot(3, 4)); // 5
console.log("Math.hypot(5, 12):", Math.hypot(5, 12)); // 13
console.log("Math.hypot(1, 2, 3):", Math.hypot(1, 2, 3)); // √14 = 3.741...

// Trigonometric functions
console.log("\n=== Trigonometric Functions ===");
console.log("Math.sin(Math.PI / 2):", Math.sin(Math.PI / 2)); // 1
console.log("Math.cos(0):", Math.cos(0)); // 1
console.log("Math.tan(Math.PI / 4):", Math.tan(Math.PI / 4)); // 1
console.log("Math.asin(1):", Math.asin(1)); // π/2
console.log("Math.acos(1):", Math.acos(1)); // 0
console.log("Math.atan(1):", Math.atan(1)); // π/4
console.log("Math.atan2(1, 1):", Math.atan2(1, 1)); // π/4

// Low-level Math methods (ES6)
console.log("\n=== Low-level Math Methods ===");

// Math.clz32() - Count leading zero bits in 32-bit integer
console.log("Math.clz32(1):", Math.clz32(1)); // 31
console.log("Math.clz32(1000):", Math.clz32(1000)); // 22

// Math.fround() - Round to 32-bit float
console.log("Math.fround(1.5):", Math.fround(1.5)); // 1.5
console.log("Math.fround(1.337):", Math.fround(1.337)); // 1.3370000123977661

// Math.imul() - 32-bit integer multiplication
console.log("Math.imul(2, 4):", Math.imul(2, 4)); // 8
console.log("Math.imul(0xffffffff, 5):", Math.imul(0xffffffff, 5)); // -5

// ============================================
// 7. BigInt (ES2020)
// ============================================

// BigInt creation
// - Append 'n' to integer literal
// - Use BigInt() constructor
// - Can represent arbitrarily large integers
console.log("\n=== BigInt Creation ===");
const bigInt1 = 123n;
const bigInt2 = BigInt("123");
const bigInt3 = BigInt(123);
const huge = 9007199254740991n; // MAX_SAFE_INTEGER
const huger = 9007199254740992n; // Beyond MAX_SAFE_INTEGER

console.log("123n:", bigInt1);
console.log('BigInt("123"):', bigInt2);
console.log("BigInt(123):", bigInt3);
console.log("Huge:", huge);
console.log("Huger:", huger);
console.log("typeof 123n:", typeof 123n); // "bigint"

// BigInt arithmetic
// - Supports +, -, *, /, %, **
// - Division truncates (no decimals)
console.log("\n=== BigInt Arithmetic ===");
console.log("10n + 20n:", 10n + 20n); // 30n
console.log("10n - 3n:", 10n - 3n); // 7n
console.log("10n * 3n:", 10n * 3n); // 30n
console.log("10n / 3n:", 10n / 3n); // 3n (truncated)
console.log("10n % 3n:", 10n % 3n); // 1n
console.log("2n ** 100n:", 2n ** 100n); // Very large number

// BigInt cannot mix with Number
// - Must convert explicitly
console.log("\n=== BigInt and Number ===");
// console.log("10n + 5:", 10n + 5); // ❌ TypeError: Cannot mix BigInt and other types
console.log("10n + BigInt(5):", 10n + BigInt(5)); // 15n (convert Number to BigInt)
console.log("Number(10n) + 5:", Number(10n) + 5); // 15 (convert BigInt to Number)

// BigInt comparison
// - Can compare with ==, but not ===
// - Can use <, >, <=, >=
console.log("\n=== BigInt Comparison ===");
console.log("10n == 10:", 10n == 10); // true (loose equality)
console.log("10n === 10:", 10n === 10); // false (different types)
console.log("10n === 10n:", 10n === 10n); // true
console.log("10n < 20:", 10n < 20); // true
console.log("10n > 5:", 10n > 5); // true

// BigInt limitations
console.log("\n=== BigInt Limitations ===");

// 1. Cannot use with Math methods
// console.log("Math.sqrt(4n):", Math.sqrt(4n)); // ❌ TypeError

// 2. Cannot use unary +
// console.log("+10n:", +10n); // ❌ TypeError
console.log("-10n:", -10n); // -10n (unary - works)

// 3. Cannot use with JSON.stringify directly
const obj = { value: 123n };
// console.log("JSON.stringify(obj):", JSON.stringify(obj)); // ❌ TypeError
console.log("Workaround:", JSON.stringify(obj, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
)); // {"value":"123"}

// 4. Division always truncates
console.log("10n / 3n:", 10n / 3n); // 3n (not 3.333...)

// BigInt use cases
console.log("\n=== BigInt Use Cases ===");

// 1. Large integer calculations
const factorial20 = 2432902008176640000n;
console.log("20! =", factorial20);

// 2. Precise integer arithmetic beyond Number.MAX_SAFE_INTEGER
const largeCalc = 9007199254740991n + 1n;
console.log("MAX_SAFE_INTEGER + 1 (BigInt):", largeCalc); // Exact

// 3. Cryptography, timestamps, IDs
const timestamp = BigInt(Date.now()) * 1000000n; // Nanosecond precision
console.log("Nanosecond timestamp:", timestamp);

// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Floating point precision
console.log("\n1. Floating point precision:");
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3); // false
console.log("Solution: Use epsilon or toFixed()");

// Pitfall 2: parseInt without radix
console.log("\n2. parseInt without radix:");
console.log('parseInt("08"):', parseInt("08")); // 8 (modern browsers)
console.log('parseInt("08", 10):', parseInt("08", 10)); // 8 (explicit)
console.log("Always specify radix!");

// Pitfall 3: typeof NaN
console.log("\n3. typeof NaN:");
console.log("typeof NaN:", typeof NaN); // "number" (confusing!)
console.log("Use Number.isNaN() to check");

// Pitfall 4: MAX_SAFE_INTEGER
console.log("\n4. MAX_SAFE_INTEGER:");
console.log("9007199254740992 === 9007199254740993:", 
  9007199254740992 === 9007199254740993); // true (precision lost!)
console.log("Use BigInt for large integers");

// Pitfall 5: Math.random() is not cryptographically secure
console.log("\n5. Math.random() security:");
console.log("Math.random() is NOT secure for cryptography");
console.log("Use crypto.getRandomValues() for security");

// Pitfall 6: Negative zero
console.log("\n6. Negative zero:");
console.log("-0 === 0:", -0 === 0); // true
console.log("Object.is(-0, 0):", Object.is(-0, 0)); // false
console.log("1 / -0:", 1 / -0); // -Infinity
console.log("1 / 0:", 1 / 0); // Infinity

// Best Practices
console.log("\n=== Best Practices ===");

// 1. Use Number.isNaN() instead of isNaN()
console.log("\n1. Use Number.isNaN():");
console.log('isNaN("abc"):', isNaN("abc")); // true (coerces)
console.log('Number.isNaN("abc"):', Number.isNaN("abc")); // false (correct)

// 2. Use Number.isFinite() instead of isFinite()
console.log("\n2. Use Number.isFinite():");
console.log('isFinite("123"):', isFinite("123")); // true (coerces)
console.log('Number.isFinite("123"):', Number.isFinite("123")); // false (correct)

// 3. Always specify radix in parseInt()
console.log("\n3. Always specify radix:");
console.log('parseInt("10", 10):', parseInt("10", 10)); // 10
console.log('parseInt("10", 2):', parseInt("10", 2)); // 2

// 4. Use toFixed() for display, not calculations
console.log("\n4. Use toFixed() for display:");
const price = 19.99;
console.log("Display:", price.toFixed(2)); // "19.99"
console.log("Calculate:", price * 1.1); // 21.989

// 5. Use BigInt for large integers
console.log("\n5. Use BigInt for large integers:");
console.log("Number:", 9007199254740992 + 1); // 9007199254740992 (wrong!)
console.log("BigInt:", 9007199254740992n + 1n); // 9007199254740993n (correct!)

// 6. Use Math.trunc() instead of parseInt() for truncation
console.log("\n6. Use Math.trunc() for truncation:");
console.log("Math.trunc(4.9):", Math.trunc(4.9)); // 4
console.log("parseInt(4.9):", parseInt(4.9)); // 4 (works but less clear)

// 7. Use ** operator instead of Math.pow()
console.log("\n7. Use ** operator:");
console.log("2 ** 3:", 2 ** 3); // 8 (cleaner)
console.log("Math.pow(2, 3):", Math.pow(2, 3)); // 8 (verbose)

// 8. Use Number() or unary + for conversion
console.log("\n8. Use Number() or + for conversion:");
console.log('Number("123"):', Number("123")); // 123
console.log('+"123":', +"123"); // 123 (shorter)

// 9. Check for safe integers
console.log("\n9. Check for safe integers:");
const bigNum = 9007199254740992;
console.log("Number.isSafeInteger(bigNum):", Number.isSafeInteger(bigNum)); // false
console.log("Use BigInt if not safe");

// 10. Use numeric separators for readability
console.log("\n10. Use numeric separators:");
const million2 = 1_000_000;
const billion3 = 1_000_000_000;
console.log("Million:", million2);
console.log("Billion:", billion3);

console.log("\n=== Numbers and Math Demo Complete ===");
