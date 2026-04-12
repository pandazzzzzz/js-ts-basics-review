// Debugging and Testing Basics Demo
// 📘 For TypeScript comparison, see: 39-debugging-testing-ts-comparison.ts
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
// Section 6: Jest/Vitest Practical Examples
// ============================================

console.log("\n=== Jest/Vitest Practical Examples ===");

// Jest/Vitest Configuration
// jest.config.js or vitest.config.ts
/*
export default {
  testEnvironment: 'node', // or 'jsdom' for browser
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**\/*.{js,ts}',
    '!src/**\/*.test.{js,ts}'
  ]
};
*/

// Test Suite Structure with describe() and test()
/*
describe('Calculator', () => {
  beforeEach(() => {
    // Setup before each test
    console.log('Setting up test');
  });

  afterEach(() => {
    // Cleanup after each test
    console.log('Cleaning up test');
  });

  test('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('should multiply two numbers', () => {
    expect(multiply(2, 3)).toBe(6);
  });
});
*/

// Mock Functions - jest.fn() / vi.fn()
console.log("\nMock Functions:");
console.log("- Track function calls");
console.log("- Control return values");
console.log("- Verify call arguments");

/*
// Create mock function
const mockFn = jest.fn(); // or vi.fn() in Vitest

// Mock implementation
mockFn.mockImplementation((x) => x * 2);
mockFn.mockReturnValue(42);
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);

// Call mock
mockFn(5); // returns 10 (from implementation)

// Verify calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(1);
expect(mockFn).toHaveBeenCalledWith(5);
expect(mockFn).toHaveBeenLastCalledWith(5);

// Access call data
console.log(mockFn.mock.calls); // [[5]]
console.log(mockFn.mock.results); // [{ type: 'return', value: 10 }]
*/

// Mock Modules - jest.mock() / vi.mock()
console.log("\nMock Modules:");
console.log("- Replace entire modules");
console.log("- Mock specific exports");
console.log("- Isolate unit tests");

/*
// Mock entire module
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'Alice' }),
  createUser: jest.fn().mockResolvedValue({ id: 2, name: 'Bob' })
}));

// Vitest equivalent
vi.mock('./api', () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Alice' }),
  createUser: vi.fn().mockResolvedValue({ id: 2, name: 'Bob' })
}));

// Partial mock (keep some real implementations)
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn().mockReturnValue('2024-01-01')
}));
*/

// Mock Timers - jest.useFakeTimers()
console.log("\nMock Timers:");
console.log("- Control setTimeout/setInterval");
console.log("- Fast-forward time");
console.log("- Test time-dependent code");

/*
jest.useFakeTimers(); // or vi.useFakeTimers()

function delayedGreeting(callback) {
  setTimeout(() => callback('Hello'), 1000);
}

test('should call callback after 1 second', () => {
  const callback = jest.fn();
  delayedGreeting(callback);
  
  // Fast-forward time
  jest.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalledWith('Hello');
});

jest.useRealTimers(); // Restore real timers
*/

// Async Testing - Promises
console.log("\nAsync Testing with Promises:");
console.log("- Use async/await in tests");
console.log("- Use resolves/rejects matchers");
console.log("- Return promises from tests");

/*
// Method 1: async/await
test('should fetch user data', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});

// Method 2: resolves matcher
test('should fetch user data', () => {
  return expect(fetchUser(1)).resolves.toEqual({ id: 1, name: 'Alice' });
});

// Method 3: rejects matcher for errors
test('should reject with error', () => {
  return expect(fetchUser(-1)).rejects.toThrow('User not found');
});

// Method 4: async/await with try/catch
test('should handle errors', async () => {
  try {
    await fetchUser(-1);
    fail('Should have thrown error');
  } catch (error) {
    expect(error.message).toBe('User not found');
  }
});
*/

// Callback Testing with done()
console.log("\nCallback Testing:");
console.log("- Use done() parameter");
console.log("- Call done() when async operation completes");
console.log("- Test will timeout if done() not called");

/*
test('should call callback', (done) => {
  function fetchData(callback) {
    setTimeout(() => {
      callback('data');
    }, 100);
  }
  
  fetchData((data) => {
    expect(data).toBe('data');
    done(); // Signal test completion
  });
});
*/

// Snapshot Testing
console.log("\nSnapshot Testing:");
console.log("- Capture component/data snapshots");
console.log("- Detect unexpected changes");
console.log("- Update with -u flag");

/*
// toMatchSnapshot() - External snapshot file
test('should match snapshot', () => {
  const data = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com'
  };
  expect(data).toMatchSnapshot();
});

// toMatchInlineSnapshot() - Inline snapshot
test('should match inline snapshot', () => {
  const data = { id: 1, name: 'Alice' };
  expect(data).toMatchInlineSnapshot(`
    {
      "id": 1,
      "name": "Alice",
    }
  `);
});

// Update snapshots: npm test -- -u
*/

// Coverage Configuration
console.log("\nCoverage Configuration:");
console.log("- Run with --coverage flag");
console.log("- Set coverage thresholds");
console.log("- Exclude files from coverage");

/*
// Run coverage
npm test -- --coverage

// Coverage thresholds in config
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80
  },
  './src/utils/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90
  }
}

// Exclude from coverage
coveragePathIgnorePatterns: [
  '/node_modules/',
  '/tests/',
  '/*.test.js$'
]

// Coverage reporters
coverageReporters: ['text', 'lcov', 'html']
*/

// Mock API Requests (MSW - Mock Service Worker)
console.log("\nMock API Requests:");
console.log("- Intercept network requests");
console.log("- Return mock responses");
console.log("- Test without real API");

/*
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Setup mock server
const server = setupServer(
  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.json({ id: Number(id), name: 'Alice' })
    );
  }),
  
  rest.post('/api/users', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ id: 1, ...body })
    );
  })
);

// Start server before tests
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Test with mocked API
test('should fetch user', async () => {
  const response = await fetch('/api/users/1');
  const user = await response.json();
  expect(user.name).toBe('Alice');
});
*/

// Test Organization Best Practices
console.log("\nTest Organization:");
console.log("- One test file per source file");
console.log("- Name: filename.test.js or filename.spec.js");
console.log("- Group related tests with describe()");
console.log("- Use beforeEach/afterEach for setup/cleanup");
console.log("- Keep tests independent");
console.log("- Test one thing per test");

// Common Testing Patterns
console.log("\nCommon Testing Patterns:");
console.log("- AAA: Arrange, Act, Assert");
console.log("- Given-When-Then");
console.log("- Test edge cases and error conditions");
console.log("- Use descriptive test names");
console.log("- Avoid testing implementation details");

/*
// AAA Pattern
test('should calculate total price', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 20, quantity: 1 }
  ];
  
  // Act
  const total = calculateTotal(items);
  
  // Assert
  expect(total).toBe(40);
});

// Given-When-Then Pattern
test('given items in cart, when calculating total, then returns sum', () => {
  // Given
  const items = [{ price: 10 }, { price: 20 }];
  
  // When
  const total = calculateTotal(items);
  
  // Then
  expect(total).toBe(30);
});
*/

console.log("\n✅ Jest/Vitest practical examples complete");
console.log("Run tests: npm test or npm run test:coverage");

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Using console.log for everything
console.log("\nPitfall 1: Using console.log for everything");
console.log("  console.log is great but has limitations.");
console.log("  Doesn't show line numbers consistently, no object expansion by default.");
console.log("  Fix: Use console.table for arrays, console.dir for objects.");

// Pitfall 2: Not handling errors in tests
console.log("\nPitfall 2: Not handling errors in tests");
console.log("  Tests that don't catch expected errors fail unexpectedly.");
console.log("  async/await errors without expect().rejects fail tests.");
console.log("  Fix: Use expect().rejects.toThrow() or try/catch with assert.rejects.");

// Pitfall 3: Test dependencies affecting each other
console.log("\nPitfall 3: Test dependencies affecting each other");
console.log("  Tests that modify shared state cause flaky tests.");
console.log("  Test order shouldn't matter but does with shared mutations.");
console.log("  Fix: Use beforeEach/afterEach for isolation, reset state.");

// Pitfall 4: Not cleaning up in tests
console.log("\nPitfall 4: Not cleaning up in tests");
console.log("  Timers, event listeners, and mock data accumulate.");
console.log("  Can cause memory leaks and interfere with other tests.");
console.log("  Fix: Use afterEach to clear timeouts, remove listeners.");

// Pitfall 5: Using debugger instead of proper breakpoints
console.log("\nPitfall 5: Using debugger statements in code");
console.log("  debugger; statements stop execution but are inflexible.");
console.log("  You have to modify code to change breakpoints.");
console.log("  Fix: Use DevTools source maps and breakpoints UI.");

// Pitfall 6: Not using source maps
console.log("\nPitfall 6: Not using source maps");
console.log("  Debugging transpiled code is confusing and ineffective.");
console.log("  Error stack traces point to bundled files, not source.");
console.log("  Fix: Generate source maps in build tools (webpack, Vite).");

// Pitfall 7: Overusing try/catch for flow control
console.log("\nPitfall 7: Overusing try/catch for flow control");
console.log("  try/catch is for exceptional cases, not normal flow.");
console.log("  Using it for expected conditions hides real errors.");
console.log("  Fix: Use conditional checks, early returns for normal flows.");

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
