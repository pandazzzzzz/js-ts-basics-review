// TypeScript vs JavaScript: Error Handling Comparison
// 📘 For JavaScript examples, see: 20-error-handling.js
// This file demonstrates TypeScript-specific typing for error handling

export {};

// ============================================================================
// 1. ERROR TYPE ANNOTATIONS
// ============================================================================

// JavaScript: catch clause variable is untyped (any)
// try {
//   riskyOperation();
// } catch (error) {
//   console.log(error.message); // Works but no type checking
// }

// TypeScript 4.4+: catch clause variable defaults to unknown
try {
  throw new Error("Something went wrong");
} catch (error: unknown) {
  // error is unknown - must narrow before accessing properties
  if (error instanceof Error) {
    console.log("=== Error Type Annotations ===");
    console.log(`Error: ${error.message}`);
  }
}

// ✅ BEST PRACTICE: Always type catch variables as unknown
function safeJsonParse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      console.log(`JSON Parse Error: ${error.message}`);
      return null;
    }
    throw error;
  }
}

// ============================================================================
// 2. CUSTOM ERROR TYPES WITH PROPERTIES
// ============================================================================

// JavaScript: Custom error classes without type safety
// class ValidationError extends Error {
//   constructor(message, field) {
//     super(message);
//     this.name = "ValidationError";
//     this.field = field;
//   }
// }

// TypeScript: Typed custom error classes
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code?: string
  ) {
    super(message);
    this.name = "ValidationError";

    // Fix prototype chain (required for ES5 compilation target)
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public query?: string,
    public timestamp: Date = new Date()
  ) {
    super(message);
    this.name = "DatabaseError";
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  toString(): string {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
}

console.log("\n=== Custom Error Types ===");
try {
  throw new ValidationError("Invalid email format", "email", "VALIDATION_001");
} catch (error: unknown) {
  if (error instanceof ValidationError) {
    console.log(`Field: ${error.field}, Code: ${error.code}`);
  }
}

// ============================================================================
// 3. ERROR UNION TYPES
// ============================================================================

// TypeScript: Result/Either pattern with union types
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function divide(a: number, b: number): Result<number, { type: string; message: string }> {
  if (b === 0) {
    return {
      ok: false,
      error: { type: "DivisionByZero", message: "Cannot divide by zero" },
    };
  }
  return { ok: true, value: a / b };
}

console.log("\n=== Error Union Types ===");
const result1 = divide(10, 2);
if (result1.ok) {
  console.log(`Result: ${result1.value}`);
}

const result2 = divide(10, 0);
if (result2.ok === false) {
  console.log(`Error type: ${result2.error.type}`);
} else {
  console.log(`Result: ${result2.value}`);
}

// ============================================================================
// 4. TYPE GUARDS FOR ERRORS
// ============================================================================

// TypeScript: Type guard functions for errors
function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

function handleError(error: unknown): void {
  console.log("\n=== Type Guards for Errors ===");

  if (isHttpError(error)) {
    console.log(`HTTP ${error.statusCode}: ${error.message}`);
  } else if (isNetworkError(error)) {
    console.log(`Network error: ${error.message}`);
  } else if (error instanceof Error) {
    console.log(`Generic error: ${error.message}`);
  } else {
    console.log(`Unknown error type: ${error}`);
  }
}

// Error hierarchy
class ApplicationError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = "ApplicationError";
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
}

class HttpError extends ApplicationError {
  constructor(
    message: string,
    public statusCode: number,
    public endpoint?: string
  ) {
    super(message, `HTTP_${statusCode}`);
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }

  isClientError(): boolean {
    return this.statusCode >= 400 && this.statusCode < 500;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }
}

class NetworkError extends ApplicationError {
  constructor(
    message: string,
    public isTimeout: boolean = false
  ) {
    super(message, "NETWORK");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

try {
  throw new HttpError("Not found", 404, "/api/users");
} catch (error: unknown) {
  handleError(error);
}

// ============================================================================
// 5. NEVER TYPE FOR FUNCTIONS THAT THROW
// ============================================================================

// TypeScript: never return type for functions that never return normally
function fail(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}

// Use in exhaustive checks
type Shape = Circle | Square | Triangle;

interface Circle {
  kind: "circle";
  radius: number;
}
interface Square {
  kind: "square";
  side: number;
}
interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.side ** 2;
    case "triangle":
      return 0.5 * shape.base * shape.height;
    default:
      return fail(`Unhandled shape: ${shape}`);
  }
}

console.log("\n=== Never Type ===");
console.log(`Circle area: ${getArea({ kind: "circle", radius: 5 }).toFixed(2)}`);

// ============================================================================
// 6. ASSERTION FUNCTIONS
// ============================================================================

// TypeScript: Assertion functions for type narrowing
function assertIsDefined<T>(value: T | null | undefined): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error("Value is null or undefined");
  }
}

function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? "Assertion failed");
  }
}

function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new TypeError(`Expected string, got ${typeof value}`);
  }
}

console.log("\n=== Assertion Functions ===");
const maybeString: string | null = "hello";
assertIsDefined(maybeString);
// Now TypeScript knows maybeString is string

const testValue: unknown = "test";
assertString(testValue);
console.log(testValue.toUpperCase()); // ✅ OK after assertion

// ============================================================================
// 7. STRICT NULL CHECKS IN ERROR HANDLING
// ============================================================================

// TypeScript: Optional chaining and nullish coalescing for safer code
interface ApiResponse {
  data?: {
    user?: {
      name: string;
      email: string;
    };
  };
  error?: {
    message: string;
    code: number;
  };
}

function handleResponse(response: ApiResponse): string {
  // Safe navigation with optional chaining
  const userName = response.data?.user?.name ?? "Anonymous";

  // Check for error
  if (response.error) {
    throw new Error(`API Error ${response.error.code}: ${response.error.message}`);
  }

  return userName;
}

console.log("\n=== Strict Null Checks ===");
console.log(
  handleResponse({
    data: { user: { name: "Alice", email: "alice@example.com" } },
  })
);
console.log(handleResponse({})); // Returns "Anonymous"

// ============================================================================
// 8. ERROR FACTORY FUNCTIONS
// ============================================================================

// TypeScript: Typed error factory functions
class ApiErrorFactory {
  static badRequest(message: string = "Bad Request"): HttpError {
    return new HttpError(message, 400);
  }

  static unauthorized(message: string = "Unauthorized"): HttpError {
    return new HttpError(message, 401);
  }

  static notFound(resource?: string): HttpError {
    const message = resource ? `${resource} not found` : "Not Found";
    return new HttpError(message, 404);
  }

  static serverError(message: string = "Internal Server Error"): HttpError {
    return new HttpError(message, 500);
  }
}

console.log("\n=== Error Factory Functions ===");
try {
  throw ApiErrorFactory.notFound("User");
} catch (error: unknown) {
  if (error instanceof HttpError) {
    console.log(`${error.name}: ${error.message} (Status: ${error.statusCode})`);
  }
}

// ============================================================================
// 9. ASYNC ERROR HANDLING WITH TYPES
// ============================================================================

// TypeScript: Typed async error handling
async function fetchUserData(userId: number): Promise<Result<{ id: number; name: string }, Error>> {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      return {
        ok: false,
        error: new Error(`HTTP ${response.status}`),
      };
    }

    const data = await response.json();
    return { ok: true, value: data };
  } catch (error: unknown) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

// Typed error boundaries
async function withErrorBoundary<T>(
  operation: () => Promise<T>
): Promise<[T | null, Error | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error: unknown) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
}

console.log("\n=== Async Error Handling ===");

// ============================================================================
// 10. ERROR INTERFACES VS CLASSES
// ============================================================================

// TypeScript: Error interfaces for duck typing
interface SerializableError {
  name: string;
  message: string;
  stack?: string;
  code?: string | number;
}

// Type guard: narrows an unknown value to one carrying a numeric/string `code`.
// Avoids triple type assertion (`as unknown as Record<...> as ...`).
function hasCode(e: unknown): e is { code: string | number } {
  if (typeof e !== "object" || e === null || !("code" in e)) return false;
  return (
    typeof (e as Record<string, unknown>).code === "string" ||
    typeof (e as Record<string, unknown>).code === "number"
  );
}

function serializeError(error: unknown): SerializableError {
  if (error instanceof Error) {
    const result: SerializableError = {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
    // Error may carry extra `code` at runtime (e.g. Node's SystemError);
    // narrow with a type guard rather than a triple cast.
    if (hasCode(error)) {
      result.code = error.code;
    }
    return result;
  }

  if (typeof error === "object" && error !== null) {
    const result: SerializableError = {
      name: "UnknownError",
      message: String(error),
    };
    if (hasCode(error)) {
      result.code = error.code;
    }
    return result;
  }

  return {
    name: "UnknownError",
    message: String(error),
  };
}

console.log("\n=== Error Interfaces ===");
const serialized = serializeError(new Error("Test"));
console.log(serialized);

// ============================================================================
// 11. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Error Handling ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Catch variable typing      │       any       │     unknown     │
│ Custom error types         │  Runtime only   │  Typed + Runtime│
│ Error union types          │       ✗         │       ✓         │
│ Error type guards          │  instanceof     │  Type predicates│
│ never return type          │       ✗         │       ✓         │
│ Assertion functions        │       ✗         │       ✓         │
│ Strict null checks         │       ✗         │       ✓         │
│ Error factories            │  Pattern only   │  Typed         │
│ Runtime behavior           │    Same         │    Same         │
│ Error propagation          │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript 4.4+ defaults catch variables to unknown
2. Custom errors need proper prototype chain setup
3. Result/Either pattern for functional error handling
4. Assertion functions enable type narrowing
5. Runtime error behavior follows JavaScript rules
`);

console.log("=== TypeScript provides type safety without changing runtime behavior ===");
