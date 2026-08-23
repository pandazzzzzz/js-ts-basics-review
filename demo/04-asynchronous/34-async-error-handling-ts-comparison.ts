// TypeScript vs JavaScript: Async Error Handling Comparison
// 📘 For JavaScript examples, see: 34-async-error-handling.js
// This file demonstrates TypeScript-specific async error handling features

export {};

// ============================================================================
// 1. TYPED PROMISES AND ERROR HANDLING
// ============================================================================

console.log("=== Typed Promises and Error Handling ===");

// TypeScript: Promise with explicit result type
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  if (id < 0) {
    throw new Error("Invalid user ID");
  }
  return { id, name: "User " + id };
}

// TypeScript: Typed error handling with unknown
async function processUser(id: number): Promise<void> {
  try {
    const user = await fetchUser(id);
    console.log("User:", user);
  } catch (error: unknown) {
    // TypeScript requires type narrowing
    if (error instanceof Error) {
      console.log("Error:", error.message);
    } else {
      console.log("Unknown error");
    }
  }
}

processUser(123);
processUser(-1);

// ============================================================================
// 2. RESULT TYPE FOR EXPLICIT ERROR HANDLING
// ============================================================================

console.log("\n=== Result Type for Explicit Error Handling ===");

// TypeScript: Result type pattern
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

async function safeFetchUser(
  id: number
): Promise<Result<{ id: number; name: string }, string>> {
  try {
    if (id < 0) {
      return err("Invalid user ID");
    }
    return ok({ id, name: "User " + id });
  } catch (e) {
    return err(e instanceof Error ? e.message : "Unknown error");
  }
}

async function processWithResult(id: number): Promise<void> {
  const result = await safeFetchUser(id);
  if (result.ok) {
    console.log("Success:", result.value);
  } else {
    console.log("Failure:", result.error);
  }
}

processWithResult(123);
processWithResult(-1);

// ============================================================================
// 3. ERROR CLASSES WITH TYPE NARROWING
// ============================================================================

console.log("\n=== Error Classes with Type Narrowing ===");

// TypeScript: Custom error classes
class NetworkError extends Error {
  override name = "NetworkError" as const;
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
  }
}

class ValidationError extends Error {
  override name = "ValidationError" as const;
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
  }
}

class AuthError extends Error {
  override name = "AuthError" as const;
  constructor(
    message: string,
    public reason: string
  ) {
    super(message);
  }
}

// Type narrowing with custom errors
async function handleErrors(): Promise<void> {
  try {
    // Simulate different errors
    // throw new NetworkError("Connection failed", 503);
    // throw new ValidationError("Email required", "email");
    throw new AuthError("Token expired", "expired_token");
  } catch (error: unknown) {
    if (error instanceof NetworkError) {
      console.log("Network error:", error.message, "Status:", error.statusCode);
    } else if (error instanceof ValidationError) {
      console.log("Validation error:", error.field, "-", error.message);
    } else if (error instanceof AuthError) {
      console.log("Auth error:", error.reason, "-", error.message);
    } else if (error instanceof Error) {
      console.log("Generic error:", error.message);
    } else {
      console.log("Unknown error");
    }
  }
}

handleErrors();

// ============================================================================
// 4. TYPED CIRCUIT BREAKER
// ============================================================================

console.log("\n=== Typed Circuit Breaker ===");

// TypeScript: Typed circuit breaker
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

class TypedCircuitBreaker<T> {
  private state: CircuitState = "CLOSED";
  private failures = 0;
  private lastFailureTime = 0;

  constructor(
    private readonly fn: () => Promise<T>,
    private readonly options: {
      failureThreshold: number;
      resetTimeout: number;
    }
  ) {}

  async execute(): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.options.resetTimeout) {
        this.state = "HALF_OPEN";
        console.log("Circuit: HALF_OPEN");
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await this.fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = "CLOSED";
    console.log("Circuit: CLOSED");
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.options.failureThreshold) {
      this.state = "OPEN";
      console.log("Circuit: OPEN");
    }
  }
}

async function unstableService(): Promise<string> {
  throw new Error("Service unavailable");
}

const breaker = new TypedCircuitBreaker(unstableService, {
  failureThreshold: 3,
  resetTimeout: 5000,
});

// ============================================================================
// 5. TYPED AGGREGATEERROR
// ============================================================================

console.log("\n=== Typed AggregateError ===");

// TypeScript: Typed AggregateError with type guards
function isAggregateError(error: unknown): error is AggregateError {
  return error instanceof AggregateError;
}

async function processTasks(tasks: Array<() => Promise<void>>): Promise<void> {
  try {
    await Promise.all(tasks.map(task => task()));
  } catch (error: unknown) {
    if (isAggregateError(error)) {
      console.log("Aggregate error with", error.errors.length, "errors:");
      error.errors.forEach((err, i) => {
        if (err instanceof Error) {
          console.log(`  ${i + 1}:`, err.message);
        }
      });
    } else if (error instanceof Error) {
      console.log("Single error:", error.message);
    }
  }
}

// ============================================================================
// 6. ERROR CAUSE WITH TYPES
// ============================================================================

console.log("\n=== Error Cause with Types ===");

// TypeScript: Error.cause typing (TypeScript 4.6+)
class DatabaseError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "DatabaseError";
  }
}

class ServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "ServiceError";
  }
}

async function queryDatabase(): Promise<void> {
  throw new DatabaseError("Connection failed");
}

async function serviceCall(): Promise<void> {
  try {
    await queryDatabase();
  } catch (cause: unknown) {
    throw new ServiceError("Database operation failed", { cause });
  }
}

async function handleChainedError(): Promise<void> {
  try {
    await serviceCall();
  } catch (error: unknown) {
    if (error instanceof ServiceError) {
      console.log("Top error:", error.message);
      if (error.cause instanceof DatabaseError) {
        console.log("Caused by:", error.cause.message);
      }
    }
  }
}

handleChainedError();

// ============================================================================
// 7. TYPED RETRY WITH GENERICS
// ============================================================================

console.log("\n=== Typed Retry with Generics ===");

// TypeScript: Generic retry function
function isRetryable(error: unknown): boolean {
  return (
    error instanceof NetworkError ||
    (error instanceof Error && error.message.includes("timeout"))
  );
}

async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries: number;
    baseDelayMs: number;
    shouldRetry?: (error: unknown) => boolean;
  }
): Promise<T> {
  const { maxRetries, baseDelayMs, shouldRetry = isRetryable } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        break;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.log(`Retry ${attempt}/${maxRetries} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// ============================================================================
// 8. TYPED TIMEOUT AND CANCELLATION
// ============================================================================

console.log("\n=== Typed Timeout and Cancellation ===");

// TypeScript: Typed timeout wrapper
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage = "Operation timed out"
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });

  return Promise.race([promise, timeout]);
}

async function slowOperation(): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return "Completed";
}

console.log("Timeout wrapper:");
withTimeout(slowOperation(), 100)
  .then(result => console.log("Result:", result))
  .catch(error => console.log("Error:", error.message));

// TypeScript: AbortController with types
async function cancellableOperation(signal: AbortSignal): Promise<string> {
  for (let i = 0; i < 10; i++) {
    if (signal.aborted) {
      throw new Error("Operation cancelled");
    }
    console.log(`Progress: ${i * 10}%`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return "Complete";
}

console.log("\nCancellable operation:");
const controller = new AbortController();

cancellableOperation(controller.signal)
  .then(result => console.log("Result:", result))
  .catch(error => console.log("Cancelled:", error.message));

// Cancel after 300ms
setTimeout(() => {
  controller.abort();
  console.log("Operation aborted by user");
}, 300);

// ============================================================================
// 9. TYPED ERROR CONTEXT PRESERVATION
// ============================================================================

console.log("\n=== Typed Error Context Preservation ===");

// TypeScript: Enhanced error class with typed context
interface ErrorContext {
  [key: string]: unknown;
}

class TypedAppError extends Error {
  public readonly timestamp: Date;
  public readonly context: Readonly<ErrorContext>;

  constructor(message: string, context: ErrorContext = {}) {
    super(message);
    this.name = "TypedAppError";
    this.timestamp = new Date();
    this.context = context;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON(): {
    name: string;
    message: string;
    timestamp: number;
    context: ErrorContext;
    stack?: string;
  } {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.getTime(),
      context: this.context,
      stack: this.stack,
    };
  }
}

// TypeScript: Domain-specific errors with typed fields
class DatabaseConnectionError extends TypedAppError {
  constructor(
    public readonly host: string,
    public readonly port: number,
    originalError?: Error
  ) {
    super(`Failed to connect to database at ${host}:${port}`, {
      host,
      port,
      errorCode: originalError?.message,
      retryable: true,
    });
    this.name = "DatabaseConnectionError";
  }
}

class UserValidationError extends TypedAppError {
  constructor(
    public readonly field: string,
    public readonly value: unknown,
    public readonly reason: string
  ) {
    super(`Validation failed for field "${field}"`, {
      field,
      value,
      reason,
      type: "VALIDATION_ERROR",
    });
    this.name = "UserValidationError";
  }
}

// Usage examples
console.log("Enhanced typed errors:");

try {
  throw new DatabaseConnectionError(
    "localhost",
    5432,
    new Error("ECONNREFUSED")
  );
} catch (error) {
  if (error instanceof TypedAppError) {
    console.log("\nDatabase error:", error.toJSON());
  }
}

try {
  throw new UserValidationError(
    "email",
    "invalid",
    "Must be valid email format"
  );
} catch (error) {
  if (error instanceof UserValidationError) {
    console.log("\nValidation error:", error.toJSON());
  }
}

// ============================================================================
// 10. TYPED ERROR MIDDLEWARE PATTERNS
// ============================================================================

console.log("\n=== Typed Error Middleware Patterns ===");

// TypeScript: Generic error middleware pipeline
type Middleware<T> = (data: T) => Promise<T>;
type ErrorMiddleware = (error: unknown) => Promise<unknown>;

class TypedPipeline<T, R> {
  private readonly handlers: Array<Middleware<T | R>> = [];
  private readonly errorHandlers: ErrorMiddleware[] = [];

  use(handler: Middleware<T | R>): this {
    this.handlers.push(handler);
    return this;
  }

  useError(handler: ErrorMiddleware): this {
    this.errorHandlers.push(handler);
    return this;
  }

  async execute(input: T): Promise<R> {
    try {
      let result: T | R = input;
      for (const handler of this.handlers) {
        result = await handler(result);
      }
      return result as R;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async handleError(error: unknown): Promise<never> {
    let handledError = error;

    for (const handler of this.errorHandlers) {
      handledError = await handler(handledError);
    }

    throw handledError;
  }
}

// TypeScript: Typed middleware
interface ProcessingData {
  name?: string;
  [key: string]: unknown;
}

interface ProcessedData extends ProcessingData {
  transformed: boolean;
}

const typedLoggingMiddleware = async (
  data: ProcessingData
): Promise<ProcessingData> => {
  console.log("Processing:", data);
  return data;
};

const typedValidationMiddleware = async (
  data: ProcessingData
): Promise<ProcessingData> => {
  if (!data || typeof data !== "object" || !data.name) {
    throw new Error("Invalid data format: name required");
  }
  return data;
};

const typedTransformationMiddleware = async (
  data: ProcessingData
): Promise<ProcessedData> => {
  return { ...data, transformed: true };
};

// TypeScript: Typed error handlers
interface ClientErrorResponse {
  success: false;
  error: {
    message: string;
    type: string;
  };
}

const typedFormatErrorHandler = async (
  error: unknown
): Promise<ClientErrorResponse> => {
  return {
    success: false,
    error: {
      message: error instanceof Error ? error.message : "Unknown error",
      type: error instanceof Error ? error.constructor.name : "UnknownError",
    },
  };
};

const typedLoggingErrorHandler = async (error: unknown): Promise<unknown> => {
  if (error instanceof Error) {
    console.log("Error logged:", error.message);
  }
  return error;
};

// Build and run typed pipeline
const typedPipeline = new TypedPipeline<
  ProcessingData,
  ProcessedData | ClientErrorResponse
>();
typedPipeline
  .use(
    typedLoggingMiddleware as Middleware<
      ProcessingData | ProcessedData | ClientErrorResponse
    >
  )
  .use(
    typedValidationMiddleware as Middleware<
      ProcessingData | ProcessedData | ClientErrorResponse
    >
  )
  .use(
    typedTransformationMiddleware as Middleware<
      ProcessingData | ProcessedData | ClientErrorResponse
    >
  )
  .useError(typedLoggingErrorHandler)
  .useError(typedFormatErrorHandler);

console.log("\nTyped pipeline execution:");
typedPipeline
  .execute({ name: "test" })
  .then(result => console.log("Success:", result))
  .catch(error => console.log("Final error:", error));

// ============================================================================
// 11. TYPED GLOBAL ERROR HANDLING
// ============================================================================

console.log("\n=== Typed Global Error Handling ===");

// TypeScript: Safe function wrapper with types
function safeExecute<T extends (...args: any[]) => Promise<R>, R>(
  fn: T,
  fallback: ((error: unknown) => R) | R = null as R
): (...args: Parameters<T>) => Promise<R> {
  return async (...args: Parameters<T>): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.log(
        "Safe execute caught:",
        error instanceof Error ? error.message : String(error)
      );
      return typeof fallback === "function"
        ? (fallback as (error: unknown) => R)(error)
        : fallback;
    }
  };
}

// The demo intentionally returns a number on success and a structured error
// object on failure, so the result type is the union of both shapes.
const typedSafeDivide = safeExecute<
  (a: number, b: number) => Promise<number | { error: string; result: number }>,
  number | { error: string; result: number }
>(
  async (a: number, b: number) => {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
  },
  (error: unknown) => ({
    error: error instanceof Error ? error.message : "Unknown error",
    result: 0,
  })
);

console.log("\nTyped safe execute:");
typedSafeDivide(10, 2).then(result => console.log("10 / 2 =", result));
typedSafeDivide(10, 0).then(result => console.log("10 / 0 =", result));

// ============================================================================
// SUMMARY
// ============================================================================

console.log("\n=== TypeScript Async Error Handling Summary ===");
console.log("1. Typed Promises and try/catch with unknown");
console.log("2. Result type for explicit error handling");
console.log("3. Custom error classes with type narrowing");
console.log("4. Typed circuit breaker");
console.log("5. AggregateError with type guards");
console.log("6. Error cause typing");
console.log("7. Generic retry function");
console.log("8. Typed timeout and cancellation (AbortSignal)");
console.log("9. Typed error context preservation");
console.log("10. Typed error middleware patterns");
console.log("11. Typed global error handling");

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Exhaustive error type checking");
console.log("- Type-safe error handling");
console.log("- Better IDE support for errors");
console.log("- Clear error propagation");
