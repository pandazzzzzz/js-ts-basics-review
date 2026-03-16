// Debugging and Testing Basics Demo
// 📘 javascript.info Part 1 > "Code quality" (6 chapters)
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools

// ============================================
// Section 1: Console Methods
// ============================================

console.log("\n=== Console Methods ===");

// Basic logging methods
console.log("Standard log message");
console.info("Informational message");
console.warn("Warning message");
console.error("Error message");

// console.table() - Display data in table format
const users = [
  { id: 1, name: "Alice", role: "Admin" },
  { id: 2, name: "Bob", role: "User" },
  { id: 3, name: "Charlie", role: "User" }
];
console.table(users);

// console.dir() - Display object structure
const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
console.dir(obj, { depth: null }); // Show all nested levels

// console.time() / console.timeEnd() - Performance timing
console.time("loop");
for (let i = 0; i < 1000000; i++) {
  // Some operation
}
console.timeEnd("loop"); // Outputs: loop: X.XXms

// console.count() / console.countReset() - Call counting
function processItem(item) {
  console.count("processItem called");
  return item * 2;
}
processItem(1); // processItem called: 1
processItem(2); // processItem called: 2
processItem(3); // processItem called: 3
console.countReset("processItem");
processItem(4); // processItem called: 1 (reset)

// console.group() / console.groupEnd() - Grouped output
console.group("User Details");
console.log("Name: Alice");
console.log("Age: 30");
console.group("Address");
console.log("City: New York");
console.log("Country: USA");
console.groupEnd();
console.groupEnd();

// console.trace() - Stack trace
function outer() {
  function inner() {
    console.trace("Trace from inner function");
  }
  inner();
}
outer();

// console.assert() - Conditional assertion
const x = 5;
console.assert(x > 10, "x should be greater than 10"); // Assertion failed
console.assert(x > 0, "x should be positive"); // No output (passes)

// ============================================
// Section 2: Debugging Techniques
// ============================================

console.log("\n=== Debugging Techniques ===");

// debugger statement - Pauses execution in DevTools
function calculateTotal(items) {
  let total = 0;
  // debugger; // Uncomment to pause execution here
  for (const item of items) {
    total += item.price;
  }
  return total;
}

const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
console.log("Total:", calculateTotal(items));

// Breakpoint types in browser DevTools:
// 1. Line breakpoints - Click line number in Sources panel
// 2. Conditional breakpoints - Right-click line, add condition
// 3. DOM breakpoints - Break on subtree modifications, attribute changes, node removal
// 4. Event listener breakpoints - Break on specific events (click, keypress, etc.)
// 5. XHR/Fetch breakpoints - Break on network requests

// Reading the Call Stack:
// - Shows function call hierarchy
// - Top = current function, bottom = entry point
// - Click stack frame to see local variables

// Watch expressions:
// - Monitor variable values during debugging
// - Add expressions in Watch panel
// - Updates automatically as you step through code

// Scope panel:
// - Local: Variables in current function
// - Closure: Variables from outer scopes
// - Global: Global variables

console.log("Debugging tips:");
console.log("- Use meaningful variable names");
console.log("- Add console.log at key points");
console.log("- Use debugger statement strategically");
console.log("- Check Network panel for API issues");

// ============================================
// Section 3: Error Tracking and Handling
// ============================================

console.log("\n=== Error Tracking ===");

// Error object properties
try {
  throw new Error("Something went wrong");
} catch (error) {
  console.log("Error message:", error.message);
  console.log("Error name:", error.name);
  console.log("Error stack:", error.stack);
}

// Custom error types
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateAge(age) {
  if (age < 0) {
    throw new ValidationError("Age cannot be negative");
  }
  if (age > 150) {
    throw new ValidationError("Age seems unrealistic");
  }
  return true;
}

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
  } else {
    console.log("Unexpected error:", error);
  }
}

// Global error handlers (Browser)
// window.onerror = function(message, source, lineno, colno, error) {
//   console.log("Global error caught:", message);
//   return true; // Prevents default error handling
// };

// Unhandled promise rejection handler (Browser)
// window.addEventListener('unhandledrejection', event => {
//   console.log("Unhandled promise rejection:", event.reason);
//   event.preventDefault();
// });

// Node.js error handlers
// process.on('uncaughtException', (error) => {
//   console.error("Uncaught exception:", error);
//   process.exit(1);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error("Unhandled rejection at:", promise, "reason:", reason);
// });

// Source Maps
// - Map minified/transpiled code back to original source
// - Enable in DevTools settings
// - Generated by build tools (Webpack, Vite, etc.)
// - File extension: .js.map
// - Comment in JS file: //# sourceMappingURL=file.js.map

console.log("Source maps allow debugging original code in production");

// ============================================
// Section 4: Testing Basics
// ============================================

console.log("\n=== Testing Basics ===");

// Why automated testing?
// - Catch bugs early
// - Prevent regressions
// - Document expected behavior
// - Enable refactoring with confidence
// - Faster than manual testing

// Test types:
// 1. Unit tests - Test individual functions/components
// 2. Integration tests - Test multiple components together
// 3. End-to-end (E2E) tests - Test complete user workflows

// Simple hand-written test function
function test(description, fn) {
  try {
    fn();
    console.log(`✓ ${description}`);
  } catch (error) {
    console.error(`✗ ${description}`);
    console.error(`  ${error.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected} but got ${actual}`);
      }
    },
    toEqual(expected) {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
      }
    },
    toThrow() {
      try {
        actual();
        throw new Error("Expected function to throw");
      } catch (error) {
        // Expected
      }
    }
  };
}

// Example tests
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

test("add() should sum two numbers", () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
});

test("multiply() should multiply two numbers", () => {
  expect(multiply(2, 3)).toBe(6);
  expect(multiply(-2, 3)).toBe(-6);
});

test("add() with objects", () => {
  const result = { sum: add(2, 3) };
  expect(result).toEqual({ sum: 5 });
});

// Testing frameworks comparison:
console.log("\nPopular testing frameworks:");
console.log("- Jest: Full-featured, zero-config, built-in mocking");
console.log("- Vitest: Fast, Vite-native, Jest-compatible API");
console.log("- Mocha: Flexible, requires separate assertion library");
console.log("- Jasmine: Behavior-driven, no dependencies");

// Common assertions:
// expect(value).toBe(expected)           - Strict equality (===)
// expect(value).toEqual(expected)        - Deep equality
// expect(value).toBeTruthy()             - Truthy value
// expect(value).toBeFalsy()              - Falsy value
// expect(value).toBeNull()               - null
// expect(value).toBeUndefined()          - undefined
// expect(value).toBeDefined()            - Not undefined
// expect(value).toBeGreaterThan(n)       - > n
// expect(value).toBeLessThan(n)          - < n
// expect(value).toContain(item)          - Array/string contains
// expect(fn).toThrow()                   - Function throws error
// expect(fn).toThrow(ErrorType)          - Throws specific error
// expect(fn).toThrow("message")          - Throws with message

// ============================================
// Section 5: Code Quality Tools
// ============================================

console.log("\n=== Code Quality Tools ===");

// ESLint - Linting and code style enforcement
// - Catches potential bugs
// - Enforces coding standards
// - Configurable rules
// - Plugin ecosystem
// Configuration: .eslintrc.js or .eslintrc.json

console.log("ESLint example rules:");
console.log("- no-unused-vars: Disallow unused variables");
console.log("- no-console: Warn on console statements");
console.log("- eqeqeq: Require === instead of ==");
console.log("- semi: Require semicolons");

// Prettier - Code formatting
// - Opinionated formatter
// - Consistent style across team
// - Integrates with editors
// - Works with ESLint
// Configuration: .prettierrc

console.log("\nPrettier formatting options:");
console.log("- printWidth: Line length limit");
console.log("- tabWidth: Spaces per indentation");
console.log("- semi: Add semicolons");
console.log("- singleQuote: Use single quotes");
console.log("- trailingComma: Add trailing commas");

// Popular style guides:
console.log("\nPopular JavaScript style guides:");
console.log("- Airbnb: Most popular, strict rules");
console.log("- Standard: No semicolons, no config needed");
console.log("- Google: Google's internal style guide");

// JSDoc - Documentation comments
/**
 * Calculates the sum of two numbers
 * @param {number} a - The first number
 * @param {number} b - The second number
 * @returns {number} The sum of a and b
 * @example
 * sum(2, 3) // returns 5
 */
function sum(a, b) {
  return a + b;
}

/**
 * Represents a user
 * @typedef {Object} User
 * @property {number} id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 */

/**
 * Fetches a user by ID
 * @param {number} id - User ID
 * @returns {Promise<User>} User object
 * @throws {Error} If user not found
 */
async function fetchUser(id) {
  // Implementation
  return { id, name: "Alice", email: "alice@example.com" };
}

console.log("\nJSDoc benefits:");
console.log("- Type hints in editors");
console.log("- Auto-generated documentation");
console.log("- Better code understanding");
console.log("- TypeScript-like type checking (with @ts-check)");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE-LEVEL DEBUGGING
   JS:  Runtime errors only
   TS:  Compile-time type errors catch issues before runtime
   TS:  Editor shows type errors immediately
   TS:  Hover over variables to see inferred types

2. TESTING WITH TYPES
   JS:  Test runtime behavior only
   TS:  Can test types with expectTypeOf (Vitest)
   TS:  @ts-expect-error to test type errors
   TS:  Example: expectTypeOf(value).toBeNumber()

3. SOURCE MAPS
   JS:  Optional, mainly for minified code
   TS:  Essential for debugging TypeScript
   TS:  Enable in tsconfig.json: "sourceMap": true
   TS:  Maps compiled JS back to TS source

4. JSDOC VS TYPESCRIPT
   JS:  JSDoc provides type hints via comments
   TS:  Native type system, no comments needed
   TS:  More powerful type features (generics, unions, etc.)
   TS:  Better tooling and refactoring support

5. LINTING
   JS:  ESLint with JavaScript rules
   TS:  @typescript-eslint/eslint-plugin
   TS:  Additional type-aware rules
   TS:  Example: @typescript-eslint/no-floating-promises

6. TESTING FRAMEWORKS
   Both JS and TS use same frameworks (Jest, Vitest, Mocha)
   TS:  Requires ts-jest or similar for TypeScript support
   TS:  Type-safe mocks and assertions
   TS:  Better autocomplete in test files

⚠️ DEBUGGING BEST PRACTICES:
- Use descriptive variable and function names
- Add console.log strategically, not everywhere
- Use debugger statement for complex issues
- Check Network panel for API problems
- Read error messages carefully
- Use source maps in production for better error tracking
- Set up error monitoring (Sentry, Rollbar, etc.)

📘 See related:
- 12-error-handling.js (Error handling patterns)
- 28-events.js (Event debugging)
*/
