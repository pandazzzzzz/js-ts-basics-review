// TypeScript vs JavaScript: Async Error Handling Comparison
// 📘 For JavaScript examples, see: 26-async-error-handling.js
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
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

async function safeFetchUser(id: number): Promise<Result<{ id: number; name: string }, string>> {
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
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

class ValidationError extends Error {
  override name = "ValidationError" as const;
  constructor(message: string, public field: string) {
    super(message);
  }
}

class AuthError extends Error {
  override name = "AuthError" as const;
  constructor(message: string, public reason: string) {
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
  resetTimeout: 5000
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
  constructor(
    message: string,
    options?: { cause?: unknown }
  ) {
    super(message, options);
    this.name = "DatabaseError";
  }
}

class ServiceError extends Error {
  constructor(
    message: string,
    options?: { cause?: unknown }
  ) {
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
  return error instanceof NetworkError ||
         (error instanceof Error && error.message.includes("timeout"));
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

console.log("\n📘 Key TypeScript Benefits:");
console.log("- Exhaustive error type checking");
console.log("- Type-safe error handling");
console.log("- Better IDE support for errors");
console.log("- Clear error propagation");
