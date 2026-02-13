// Error Handling Demo
// 📘 For TypeScript comparison, see: 10-error-handling-ts-comparison.ts

// ============================================
// Basic Error Handling - try/catch/finally
// ============================================

// try/catch - Basic error handling (ES3)
// - try block: Code that might throw an error
// - catch block: Handles the error if one occurs
// - Error object contains name, message, and stack properties
// - Use for: Handling expected errors, preventing crashes
console.log("=== Basic try/catch ===");

try {
  const result = riskyOperation();
  console.log("Success:", result);
} catch (error) {
  console.log("Caught error:", error.message);
}

function riskyOperation() {
  throw new Error("Something went wrong!");
}

// try/catch with error details
try {
  JSON.parse("invalid json");
} catch (error) {
  console.log("\nError details:");
  console.log("Name:", error.name); // "SyntaxError"
  console.log("Message:", error.message);
  console.log("Stack:", error.stack.split('\n')[0]); // First line of stack trace
}

// finally block - Always executes (ES3)
// - Runs regardless of whether error was thrown
// - Runs even if return statement in try/catch
// - Use for: Cleanup operations, closing resources
console.log("\n=== try/catch/finally ===");

function demonstrateFinally() {
  try {
    console.log("1. Try block executing");
    throw new Error("Oops!");
  } catch (error) {
    console.log("2. Catch block executing");
    return "Caught"; // finally still runs!
  } finally {
    console.log("3. Finally block executing (always runs)");
  }
}

const result = demonstrateFinally();
console.log("4. Function returned:", result);

// finally with resource cleanup
function readFile(filename) {
  let file = null;
  try {
    file = { name: filename, open: true }; // Simulated file
    console.log(`\nOpened file: ${filename}`);
    
    if (filename === "missing.txt") {
      throw new Error("File not found");
    }
    
    return `Contents of ${filename}`;
  } catch (error) {
    console.log("Error reading file:", error.message);
    return null;
  } finally {
    if (file && file.open) {
      file.open = false;
      console.log(`Closed file: ${filename}`);
    }
  }
}

readFile("data.txt");
readFile("missing.txt");

// ============================================
// Throwing Errors
// ============================================

// throw statement - Throw custom errors (ES3)
// - Can throw any value (string, number, object, Error)
// - Best practice: Always throw Error objects
// - Stops execution and jumps to nearest catch block
console.log("\n=== throw Statement ===");

function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

try {
  console.log("10 / 2 =", divide(10, 2)); // 5
  console.log("10 / 0 =", divide(10, 0)); // Throws error
  console.log("This won't execute");
} catch (error) {
  console.log("Caught:", error.message);
}

// Throwing different types (not recommended)
function demonstrateThrowTypes() {
  console.log("\n=== Throwing Different Types ===");
  
  // Throwing string (❌ Avoid)
  try {
    throw "This is a string error";
  } catch (error) {
    console.log("Caught string:", error);
    console.log("No stack trace available!");
  }
  
  // Throwing number (❌ Avoid)
  try {
    throw 404;
  } catch (error) {
    console.log("Caught number:", error);
  }
  
  // Throwing object (❌ Avoid)
  try {
    throw { code: 500, message: "Server error" };
  } catch (error) {
    console.log("Caught object:", error);
  }
  
  // Throwing Error object (✅ Recommended)
  try {
    throw new Error("Proper error with stack trace");
  } catch (error) {
    console.log("Caught Error:", error.message);
    console.log("Has stack:", !!error.stack);
  }
}

demonstrateThrowTypes();

// Conditional throwing
function validateAge(age) {
  if (typeof age !== 'number') {
    throw new TypeError("Age must be a number");
  }
  if (age < 0) {
    throw new RangeError("Age cannot be negative");
  }
  if (age < 18) {
    throw new Error("Must be 18 or older");
  }
  return true;
}

console.log("\n=== Conditional Throwing ===");
try {
  validateAge("25"); // TypeError
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

try {
  validateAge(-5); // RangeError
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

try {
  validateAge(15); // Error
} catch (error) {
  console.log(`${error.name}: ${error.message}`);
}

// ============================================
// Built-in Error Types
// ============================================

console.log("\n=== Built-in Error Types ===");

// Error - Generic error (ES3)
// - Base class for all errors
// - Use when no specific error type fits
// - Properties: name, message, stack
const genericError = new Error("Generic error message");
console.log("\n1. Error:");
console.log("   Name:", genericError.name); // "Error"
console.log("   Message:", genericError.message);

// TypeError - Type-related errors (ES3)
// - Thrown when value is not of expected type
// - Common: calling non-function, accessing property of null/undefined
// - Use for: Type validation, type checking
console.log("\n2. TypeError:");
try {
  const obj = null;
  obj.property; // Accessing property of null
} catch (error) {
  console.log("   Caught:", error.name);
  console.log("   Message:", error.message);
}

try {
  const notAFunction = "string";
  notAFunction(); // Calling non-function
} catch (error) {
  console.log("   Caught:", error.name);
  console.log("   Message:", error.message);
}

// Manual TypeError
try {
  function greet(name) {
    if (typeof name !== 'string') {
      throw new TypeError("Name must be a string");
    }
    return `Hello, ${name}!`;
  }
  greet(123);
} catch (error) {
  console.log("   Manual:", error.message);
}

// ReferenceError - Reference to undefined variable (ES3)
// - Thrown when accessing undeclared variable
// - Common: typos in variable names
// - Use for: Variable existence checks
console.log("\n3. ReferenceError:");
try {
  console.log(undeclaredVariable); // Variable doesn't exist
} catch (error) {
  console.log("   Caught:", error.name);
  console.log("   Message:", error.message);
}

// Manual ReferenceError
try {
  function checkVariable(name) {
    if (typeof window !== 'undefined' && !(name in window)) {
      throw new ReferenceError(`${name} is not defined`);
    }
  }
  checkVariable("nonExistentVar");
} catch (error) {
  console.log("   Manual:", error.message);
}

// SyntaxError - Syntax errors (ES3)
// - Thrown when parsing invalid code
// - Common: JSON.parse with invalid JSON, eval with bad syntax
// - Cannot be caught if in source code (compile-time error)
// - Can be caught when parsing strings
console.log("\n4. SyntaxError:");
try {
  JSON.parse("{ invalid json }");
} catch (error) {
  console.log("   Caught:", error.name);
  console.log("   Message:", error.message);
}

try {
  eval("const x = ;"); // Invalid syntax
} catch (error) {
  console.log("   Eval error:", error.name);
}

// Manual SyntaxError
try {
  function parseExpression(expr) {
    if (!expr.includes('=')) {
      throw new SyntaxError("Expression must contain '='");
    }
  }
  parseExpression("invalid");
} catch (error) {
  console.log("   Manual:", error.message);
}

// RangeError - Value out of range (ES3)
// - Thrown when value is outside allowed range
// - Common: array length, number methods, recursion depth
// - Use for: Range validation, bounds checking
console.log("\n5. RangeError:");
try {
  const arr = new Array(-1); // Negative array length
} catch (error) {
  console.log("   Caught:", error.name);
  console.log("   Message:", error.message);
}

try {
  const num = 123.456;
  num.toFixed(101); // Precision out of range (0-100)
} catch (error) {
  console.log("   toFixed error:", error.message);
}

// Manual RangeError
try {
  function setVolume(level) {
    if (level < 0 || level > 100) {
      throw new RangeError("Volume must be between 0 and 100");
    }
    return level;
  }
  setVolume(150);
} catch (error) {
  console.log("   Manual:", error.message);
}

// Stack overflow (RangeError)
try {
  function infiniteRecursion() {
    infiniteRecursion();
  }
  infiniteRecursion();
} catch (error) {
  console.log("   Stack overflow:", error.name);
}

// Other built-in errors (less common)
console.log("\n6. Other Error Types:");

// URIError - Invalid URI handling
try {
  decodeURIComponent('%'); // Invalid URI component
} catch (error) {
  console.log("   URIError:", error.message);
}

// EvalError - Errors in eval() (rarely used in modern JS)
// Note: Modern JavaScript doesn't throw EvalError, but it exists
const evalError = new EvalError("Eval error example");
console.log("   EvalError exists:", evalError.name);

// ============================================
// Custom Error Classes
// ============================================

console.log("\n=== Custom Error Classes ===");

// Basic custom error (ES6/ES2015)
// - Extend Error class
// - Set name property
// - Call super() with message
// - Use for: Domain-specific errors, better error handling
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Invalid input data");
} catch (error) {
  console.log("\nCustom error:");
  console.log("Name:", error.name);
  console.log("Message:", error.message);
  console.log("Is Error:", error instanceof Error); // true
  console.log("Is ValidationError:", error instanceof ValidationError); // true
}

// Custom error with additional properties
class DatabaseError extends Error {
  constructor(message, code, query) {
    super(message);
    this.name = "DatabaseError";
    this.code = code;
    this.query = query;
    this.timestamp = new Date();
  }
  
  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}

try {
  throw new DatabaseError(
    "Connection failed",
    "DB_CONN_001",
    "SELECT * FROM users"
  );
} catch (error) {
  console.log("\nDatabase error:");
  console.log("Name:", error.name);
  console.log("Code:", error.code);
  console.log("Query:", error.query);
  console.log("Time:", error.timestamp.toISOString());
  console.log("toString:", error.toString());
}

// HTTP error with status codes
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
  
  static badRequest(message = "Bad Request") {
    return new HttpError(400, message);
  }
  
  static unauthorized(message = "Unauthorized") {
    return new HttpError(401, message);
  }
  
  static notFound(message = "Not Found") {
    return new HttpError(404, message);
  }
  
  static serverError(message = "Internal Server Error") {
    return new HttpError(500, message);
  }
}

try {
  throw HttpError.notFound("User not found");
} catch (error) {
  console.log("\nHTTP error:");
  console.log("Status:", error.statusCode);
  console.log("Message:", error.message);
}

// Application-specific error hierarchy
class ApplicationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApplicationError";
  }
}

class AuthenticationError extends ApplicationError {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class AuthorizationError extends ApplicationError {
  constructor(message) {
    super(message);
    this.name = "AuthorizationError";
  }
}

class NotFoundError extends ApplicationError {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
    this.resource = resource;
  }
}

// Using error hierarchy
function handleError(error) {
  console.log("\nHandling error:");
  
  if (error instanceof AuthenticationError) {
    console.log("→ Redirect to login");
  } else if (error instanceof AuthorizationError) {
    console.log("→ Show access denied page");
  } else if (error instanceof NotFoundError) {
    console.log(`→ Show 404 for ${error.resource}`);
  } else if (error instanceof ApplicationError) {
    console.log("→ Show generic error page");
  } else {
    console.log("→ Unknown error, log and alert admin");
  }
}

try {
  throw new AuthenticationError("Session expired");
} catch (error) {
  handleError(error);
}

try {
  throw new NotFoundError("User profile");
} catch (error) {
  handleError(error);
}

// ============================================
// Error Propagation
// ============================================

console.log("\n=== Error Propagation ===");

// Errors bubble up the call stack
function level3() {
  throw new Error("Error at level 3");
}

function level2() {
  console.log("Level 2: calling level 3");
  level3(); // Error thrown here
  console.log("Level 2: this won't execute");
}

function level1() {
  console.log("Level 1: calling level 2");
  try {
    level2();
  } catch (error) {
    console.log("Level 1: caught error from level 3");
    console.log("Message:", error.message);
  }
  console.log("Level 1: continuing after catch");
}

level1();

// Re-throwing errors
function processData(data) {
  try {
    if (!data) {
      throw new Error("No data provided");
    }
    // Process data...
    return data.toUpperCase();
  } catch (error) {
    console.log("\nprocessData: Logging error");
    throw error; // Re-throw to caller
  }
}

function handleRequest() {
  try {
    const result = processData(null);
    console.log("Result:", result);
  } catch (error) {
    console.log("handleRequest: Caught re-thrown error");
    console.log("Message:", error.message);
  }
}

handleRequest();

// Wrapping errors with context
function fetchUserData(userId) {
  try {
    if (userId < 0) {
      throw new Error("Invalid user ID");
    }
    // Simulate API call
    throw new Error("Network timeout");
  } catch (error) {
    // Wrap original error with more context
    throw new Error(`Failed to fetch user ${userId}: ${error.message}`);
  }
}

try {
  fetchUserData(123);
} catch (error) {
  console.log("\nWrapped error:", error.message);
}

// Error propagation with async code (preview)
console.log("\n=== Error Propagation in Callbacks ===");

function asyncOperation(callback) {
  setTimeout(() => {
    try {
      throw new Error("Async error");
    } catch (error) {
      callback(error, null); // Pass error to callback
    }
  }, 0);
}

asyncOperation((error, result) => {
  if (error) {
    console.log("Callback received error:", error.message);
  } else {
    console.log("Result:", result);
  }
});

// Synchronous wait for demonstration
setTimeout(() => {
  console.log("\n=== Error Propagation Complete ===");
}, 100);


// ============================================
// Common Pitfalls & Best Practices
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Swallowing errors (Silent failures)
// ❌ BAD: Empty catch block
function badErrorHandling1() {
  try {
    throw new Error("Important error");
  } catch (error) {
    // Silent failure - error is lost!
  }
  console.log("Pitfall 1: Error was swallowed");
}

badErrorHandling1();

// ✅ GOOD: At least log the error
function goodErrorHandling1() {
  try {
    throw new Error("Important error");
  } catch (error) {
    console.error("Error occurred:", error.message);
    // Or re-throw, or handle appropriately
  }
}

goodErrorHandling1();

// Pitfall 2: Catching errors you can't handle
// ❌ BAD: Catching everything without discrimination
function badErrorHandling2() {
  try {
    JSON.parse("invalid");
  } catch (error) {
    console.log("Pitfall 2: Caught error but can't fix it");
    // What now? Can't recover from syntax error
  }
}

badErrorHandling2();

// ✅ GOOD: Only catch errors you can handle
function goodErrorHandling2(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log("Invalid JSON, returning default");
      return {}; // Provide fallback
    }
    throw error; // Re-throw unexpected errors
  }
}

console.log("Good handling:", goodErrorHandling2("invalid"));

// Pitfall 3: Finally block execution order
console.log("\n=== Pitfall 3: Finally Execution Order ===");

function finallyPitfall() {
  try {
    console.log("1. Try block");
    return "try return";
  } catch (error) {
    console.log("2. Catch block");
    return "catch return";
  } finally {
    console.log("3. Finally block (runs before return!)");
    // ⚠️ Return in finally overrides try/catch return!
    // return "finally return"; // Uncomment to see override
  }
}

const finallyResult = finallyPitfall();
console.log("4. Returned:", finallyResult);

// Finally with exceptions
function finallyWithException() {
  try {
    console.log("\n1. Try block");
    throw new Error("Try error");
  } finally {
    console.log("2. Finally runs even with uncaught error");
    // If finally throws, it replaces the original error!
  }
}

try {
  finallyWithException();
} catch (error) {
  console.log("3. Caught:", error.message);
}

// Pitfall 4: Not using Error objects
console.log("\n=== Pitfall 4: Not Using Error Objects ===");

// ❌ BAD: Throwing strings
try {
  throw "Something went wrong";
} catch (error) {
  console.log("Caught string:", error);
  console.log("No stack trace:", !error.stack);
  console.log("No error name:", !error.name);
}

// ✅ GOOD: Throwing Error objects
try {
  throw new Error("Something went wrong");
} catch (error) {
  console.log("\nCaught Error:", error.message);
  console.log("Has stack trace:", !!error.stack);
  console.log("Has name:", error.name);
}

// Pitfall 5: Modifying error objects incorrectly
console.log("\n=== Pitfall 5: Error Object Modification ===");

// ❌ BAD: Losing stack trace
const error1 = new Error("Original error");
error1.message = "Modified message";
// Stack trace still shows original location, message is confusing

// ✅ GOOD: Create new error or wrap
const error2 = new Error("Original error");
const wrappedError = new Error(`Wrapped: ${error2.message}`);
console.log("Wrapped error:", wrappedError.message);

// Pitfall 6: Async error handling (preview)
console.log("\n=== Pitfall 6: Async Errors ===");

// ❌ BAD: try/catch doesn't catch async errors
try {
  setTimeout(() => {
    // This error won't be caught by outer try/catch
    // (Commented out to prevent crash)
    // throw new Error("Async error");
  }, 0);
  console.log("Try block completed (async error would not be caught)");
} catch (error) {
  console.log("This won't catch the async error");
}

// ✅ GOOD: Handle errors in async context
setTimeout(() => {
  try {
    throw new Error("Async error");
  } catch (error) {
    console.log("Caught in async context:", error.message);
  }
}, 50);

// Pitfall 7: Not checking error types
console.log("\n=== Pitfall 7: Error Type Checking ===");

function riskyFunction() {
  const random = Math.random();
  if (random < 0.33) {
    throw new TypeError("Type error");
  } else if (random < 0.66) {
    throw new RangeError("Range error");
  } else {
    throw new Error("Generic error");
  }
}

// ❌ BAD: Treating all errors the same
try {
  riskyFunction();
} catch (error) {
  console.log("Caught error:", error.message);
  // Can't handle different errors appropriately
}

// ✅ GOOD: Check error types
try {
  riskyFunction();
} catch (error) {
  if (error instanceof TypeError) {
    console.log("Handle type error specifically");
  } else if (error instanceof RangeError) {
    console.log("Handle range error specifically");
  } else {
    console.log("Handle generic error");
  }
}

// Pitfall 8: Forgetting to return after throw
console.log("\n=== Pitfall 8: Code After Throw ===");

function validateInput(input) {
  if (!input) {
    throw new Error("Input required");
    console.log("This never executes"); // Unreachable code
  }
  return input.toUpperCase();
}

// Note: throw stops execution, no return needed
// But be aware of unreachable code

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

// 1. Always use Error objects
console.log("\n1. Use Error Objects:");
// ✅ Good
try {
  throw new Error("Descriptive error message");
} catch (error) {
  console.log("   Has stack:", !!error.stack);
}

// 2. Create custom error classes for domain logic
console.log("\n2. Custom Error Classes:");
class PaymentError extends Error {
  constructor(message, transactionId) {
    super(message);
    this.name = "PaymentError";
    this.transactionId = transactionId;
  }
}

try {
  throw new PaymentError("Payment failed", "TXN-12345");
} catch (error) {
  console.log(`   ${error.name}: ${error.message}`);
  console.log(`   Transaction: ${error.transactionId}`);
}

// 3. Provide context in error messages
console.log("\n3. Contextual Error Messages:");
function processOrder(orderId, items) {
  if (!items || items.length === 0) {
    // ❌ Bad: throw new Error("No items");
    // ✅ Good: Include context
    throw new Error(`Order ${orderId}: No items in order`);
  }
}

try {
  processOrder("ORD-789", []);
} catch (error) {
  console.log("   " + error.message);
}

// 4. Use specific error types
console.log("\n4. Specific Error Types:");
function withdraw(amount, balance) {
  if (typeof amount !== 'number') {
    throw new TypeError("Amount must be a number");
  }
  if (amount < 0) {
    throw new RangeError("Amount cannot be negative");
  }
  if (amount > balance) {
    throw new Error("Insufficient funds");
  }
  return balance - amount;
}

try {
  withdraw("100", 500);
} catch (error) {
  console.log(`   ${error.name}: ${error.message}`);
}

// 5. Handle errors at appropriate level
console.log("\n5. Error Handling Level:");

function lowLevelFunction() {
  // Don't catch here if you can't handle it
  throw new Error("Low level error");
}

function midLevelFunction() {
  // Pass through if can't handle
  return lowLevelFunction();
}

function highLevelFunction() {
  // Handle at level where you have context
  try {
    return midLevelFunction();
  } catch (error) {
    console.log("   Handled at high level:", error.message);
    return null; // Provide fallback
  }
}

highLevelFunction();

// 6. Log errors before re-throwing
console.log("\n6. Log Before Re-throw:");
function apiCall() {
  try {
    throw new Error("API failed");
  } catch (error) {
    console.error("   [LOG] API error:", error.message);
    throw error; // Re-throw for caller to handle
  }
}

try {
  apiCall();
} catch (error) {
  console.log("   Caller handles:", error.message);
}

// 7. Use finally for cleanup
console.log("\n7. Finally for Cleanup:");
function withCleanup() {
  const resource = { name: "Database", connected: true };
  try {
    console.log("   Using resource:", resource.name);
    throw new Error("Operation failed");
  } catch (error) {
    console.log("   Error:", error.message);
  } finally {
    resource.connected = false;
    console.log("   Cleaned up:", resource.name);
  }
}

withCleanup();

// 8. Validate early, fail fast
console.log("\n8. Fail Fast:");
function createUser(username, email, age) {
  // Validate all inputs at start
  if (!username) throw new Error("Username required");
  if (!email) throw new Error("Email required");
  if (!email.includes('@')) throw new Error("Invalid email");
  if (age < 18) throw new Error("Must be 18+");
  
  // Proceed with valid data
  return { username, email, age };
}

try {
  createUser("john", "invalid-email", 25);
} catch (error) {
  console.log("   Validation failed:", error.message);
}

// 9. Don't catch errors you can't handle
console.log("\n9. Only Catch Handleable Errors:");
function parseConfig(json) {
  try {
    return JSON.parse(json);
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Can handle: provide default config
      console.log("   Invalid config, using defaults");
      return { default: true };
    }
    // Can't handle: re-throw
    throw error;
  }
}

console.log("   Result:", parseConfig("invalid"));

// 10. Use error boundaries in applications
console.log("\n10. Error Boundaries (Concept):");
// In real applications, implement error boundaries
// to catch and handle errors at component/module level
function errorBoundary(fn) {
  try {
    return fn();
  } catch (error) {
    console.error("   [ERROR BOUNDARY] Caught:", error.message);
    // Log to monitoring service
    // Show user-friendly error message
    // Prevent app crash
    return null;
  }
}

const result1 = errorBoundary(() => {
  throw new Error("Something broke");
});
console.log("   App continues:", result1);

// ============================================
// Real-World Examples
// ============================================

console.log("\n=== Real-World Examples ===");

// Example 1: Form validation
console.log("\n1. Form Validation:");
class FormValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.name = "FormValidationError";
    this.field = field;
  }
}

function validateForm(formData) {
  const errors = [];
  
  try {
    if (!formData.email) {
      throw new FormValidationError("email", "Email is required");
    }
    if (!formData.email.includes('@')) {
      throw new FormValidationError("email", "Invalid email format");
    }
    if (!formData.password) {
      throw new FormValidationError("password", "Password is required");
    }
    if (formData.password.length < 8) {
      throw new FormValidationError("password", "Password must be 8+ characters");
    }
    
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof FormValidationError) {
      return { valid: false, errors: [{ field: error.field, message: error.message }] };
    }
    throw error;
  }
}

const formResult = validateForm({ email: "test", password: "123" });
console.log("   Valid:", formResult.valid);
console.log("   Errors:", formResult.errors);

// Example 2: API error handling
console.log("\n2. API Error Handling:");
class ApiError extends Error {
  constructor(statusCode, message, endpoint) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.endpoint = endpoint;
  }
  
  isClientError() {
    return this.statusCode >= 400 && this.statusCode < 500;
  }
  
  isServerError() {
    return this.statusCode >= 500;
  }
}

function handleApiError(error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      console.log("   → Redirect to login");
    } else if (error.statusCode === 404) {
      console.log("   → Show not found page");
    } else if (error.isServerError()) {
      console.log("   → Show server error, retry later");
    } else {
      console.log("   → Show generic error");
    }
  }
}

try {
  throw new ApiError(404, "User not found", "/api/users/123");
} catch (error) {
  handleApiError(error);
}

// Example 3: Retry logic with errors
console.log("\n3. Retry Logic:");
function retryOperation(operation, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`   Attempt ${attempt}/${maxRetries}`);
      return operation();
    } catch (error) {
      lastError = error;
      console.log(`   Failed: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
    }
  }
}

let attemptCount = 0;
try {
  retryOperation(() => {
    attemptCount++;
    if (attemptCount < 3) {
      throw new Error("Temporary failure");
    }
    return "Success!";
  });
  console.log("   Operation succeeded");
} catch (error) {
  console.log("   Final error:", error.message);
}

// Example 4: Resource management
console.log("\n4. Resource Management:");
class ResourceError extends Error {
  constructor(message, resourceType) {
    super(message);
    this.name = "ResourceError";
    this.resourceType = resourceType;
  }
}

function useResource(resourceType) {
  const resource = { type: resourceType, acquired: true };
  
  try {
    console.log(`   Acquired ${resourceType}`);
    
    if (Math.random() > 0.5) {
      throw new ResourceError("Operation failed", resourceType);
    }
    
    return "Success";
  } catch (error) {
    console.log(`   Error with ${resourceType}:`, error.message);
    throw error;
  } finally {
    resource.acquired = false;
    console.log(`   Released ${resourceType}`);
  }
}

try {
  useResource("Database Connection");
} catch (error) {
  console.log("   Handled at caller level");
}

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. ERROR TYPE ANNOTATIONS
   JS:  catch (error) { }
   TS:  catch (error: unknown) { }
        // TypeScript 4.4+ defaults to unknown
   
   Benefits:
   - Forces type checking before using error
   - Prevents assuming error is Error object
   - More type-safe error handling

2. CUSTOM ERROR TYPES
   JS:  class MyError extends Error { }
   TS:  class MyError extends Error {
          constructor(public code: string, message: string) {
            super(message);
            this.name = "MyError";
          }
        }
   
   Benefits:
   - Type-safe error properties
   - Better IDE autocomplete
   - Compile-time property checking

3. ERROR UNION TYPES
   JS:  function doSomething() { }
   TS:  function doSomething(): string | Error {
          if (condition) return "success";
          return new Error("failed");
        }
   
   Benefits:
   - Explicit error handling in return types
   - Alternative to throwing exceptions
   - Functional error handling pattern

4. TYPE GUARDS FOR ERRORS
   JS:  if (error instanceof MyError) { }
   TS:  function isMyError(error: unknown): error is MyError {
          return error instanceof MyError;
        }
   
   Benefits:
   - Type narrowing in catch blocks
   - Reusable type checking
   - Better type inference

5. NEVER TYPE FOR FUNCTIONS THAT THROW
   JS:  function fail(message) { throw new Error(message); }
   TS:  function fail(message: string): never {
          throw new Error(message);
        }
   
   Benefits:
   - Indicates function never returns normally
   - Better control flow analysis
   - Clearer function intent

6. STRICT NULL CHECKS
   JS:  const value = obj.property;
   TS:  const value = obj?.property; // Optional chaining
        const value = obj.property!; // Non-null assertion
   
   Benefits:
   - Prevents null/undefined errors at compile time
   - Forces explicit null handling
   - Reduces runtime errors

7. RESULT TYPE PATTERN
   JS:  // No built-in support
   TS:  type Result<T, E = Error> = 
          | { ok: true; value: T }
          | { ok: false; error: E };
        
        function divide(a: number, b: number): Result<number> {
          if (b === 0) {
            return { ok: false, error: new Error("Division by zero") };
          }
          return { ok: true, value: a / b };
        }
   
   Benefits:
   - Explicit error handling
   - No exceptions thrown
   - Functional programming style

8. ASSERTION FUNCTIONS
   TS:  function assert(condition: unknown): asserts condition {
          if (!condition) throw new Error("Assertion failed");
        }
        
        const value: unknown = "hello";
        assert(typeof value === "string");
        // TypeScript now knows value is string
   
   Benefits:
   - Type narrowing with assertions
   - Runtime + compile-time checking
   - Better type inference

⚠️ COMMON CONFUSION POINTS:

1. CATCH CLAUSE TYPES
   - JS: catch (error) - error is any
   - TS 4.0-4.3: catch (error: any) - default
   - TS 4.4+: catch (error: unknown) - default
   
   Must check type before using:
   catch (error: unknown) {
     if (error instanceof Error) {
       console.log(error.message); // ✅ OK
     }
   }

2. THROWING NON-ERROR VALUES
   - TypeScript allows throwing any value
   - But catch clause is still unknown/any
   - Best practice: always throw Error objects

3. ERROR SUBCLASSING
   - Must call super() in constructor
   - Must set this.name manually
   - Stack trace may need adjustment

4. ASYNC ERROR HANDLING
   - try/catch works with async/await
   - Promise rejections need .catch()
   - Unhandled rejections are runtime errors

📘 See 10-error-handling-ts-comparison.ts for detailed examples!
*/
