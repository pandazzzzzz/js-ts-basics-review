// Async Error Handling Demo
// 📘 For TypeScript comparison, see: 34-async-error-handling-ts-comparison.ts


// ============================================
// 1. PROMISE ERROR HANDLING BASICS
// ============================================
/**
 * Promise Error Handling - Catching errors in promise chains (ES6)
 *
 * Characteristics:
 * - Errors propagate down the promise chain
 * - catch() handles rejected promises
 * - finally() runs regardless of outcome
 * - Unhandled rejections cause issues
 *
 * Use Cases:
 * - API error handling
 * - Async operation failures
 * - Cleanup after async operations
 *
 * Common Pitfalls:
 * - Forgetting to add catch handlers
 * - Swallowing errors silently
 * - Multiple catch handlers confusion
 */

console.log("=== 1. Promise Error Handling Basics Demo ===");

// 1.1 Basic promise error handling
function failingOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Operation failed')), 10);
  });
}

function successfulOperation() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('Success!'), 10);
  });
}

console.log("\nSuccessful promise:");
successfulOperation()
  .then(result => console.log('Result:', result))
  .catch(error => console.log('Error:', error.message))
  .finally(() => console.log('Finally called'));

console.log("\nFailed promise:");
failingOperation()
  .then(result => console.log('Result:', result))
  .catch(error => console.log('Error:', error.message))
  .finally(() => console.log('Finally called'));

// 1.2 Error propagation in chains
Promise.resolve(10)
  .then(x => x * 2)
  .then(x => x / 0) // Produces Infinity (does NOT throw)
  .then(x => console.log('Result:', x)) // Will run and print "Infinity"
  .catch(error => console.log('\nCaught error in chain:', error.message));

// 1.3 Multiple catch handlers (first matching wins)
Promise.reject(new Error('Initial error'))
  .catch(error => {
    console.log('\nFirst catch:', error.message);
    throw new Error('New error from first catch');
  })
  .catch(error => {
    console.log('Second catch:', error.message);
    return 'Recovered value';
  })
  .then(value => console.log('Then after recovery:', value));

// 1.4 Unhandled rejection warning (commented out to avoid warning)
// Promise.reject(new Error('This will cause unhandled rejection'));


// ============================================
// 2. ASYNC/AWAIT ERROR HANDLING
// ============================================
/**
 * Async/Await Error Handling - try/catch with async functions (ES8)
 *
 * Characteristics:
 * - Uses traditional try/catch syntax
 * - More readable than promise chains
 * - Errors become thrown exceptions
 * - Stack traces are clearer
 *
 * Use Cases:
 * - Sequential async operations
 * - Complex async logic
 * - Error recovery in async flows
 *
 * Common Pitfalls:
 * - Missing try/catch blocks
 * - Incorrect parallel execution
 * - Mixing promise and async/await styles
 */

console.log("\n=== 2. Async/Await Error Handling Demo ===");

// 2.1 Basic try/catch with async/await
async function basicAsyncError() {
  try {
    const result = await failingOperation();
    console.log('Result:', result);
  } catch (error) {
    console.log('Caught error:', error.message);
  }
}

basicAsyncError();

// 2.2 Multiple async operations with error handling
async function multipleOperations() {
  try {
    console.log('\nMultiple operations:');
    const a = await successfulOperation();
    console.log('First:', a);

    const b = await failingOperation(); // This will fail
    console.log('Second:', b); // Won't reach here

    const c = await successfulOperation();
    console.log('Third:', c);
  } catch (error) {
    console.log('Stopped at error:', error.message);
  }
}

multipleOperations();

// 2.3 Selective error handling
async function selectiveErrorHandling() {
  console.log('\nSelective error handling:');

  let result1;
  try {
    result1 = await successfulOperation();
    console.log('First succeeded:', result1);
  } catch (error) {
    console.log('First failed:', error.message);
  }

  let result2;
  try {
    result2 = await failingOperation();
    console.log('Second succeeded:', result2);
  } catch (error) {
    console.log('Second failed:', error.message);
  }
}

selectiveErrorHandling();

// 2.4 Finally with async/await
async function asyncWithFinally() {
  let resource;
  try {
    console.log('\nAcquiring resource...');
    resource = { name: 'temp' };
    console.log('Resource acquired:', resource);
    await failingOperation();
  } catch (error) {
    console.log('Error occurred:', error.message);
  } finally {
    if (resource) {
      console.log('Cleaning up resource...');
      resource = null;
    }
  }
}

asyncWithFinally();


// ============================================
// 3. ERROR CHAINING WITH ERROR.CAUSE
// ============================================
/**
 * Error Chaining - Preserving original error context (ES2022)
 *
 * Characteristics:
 * - Error.cause property holds original error
 * - Maintains error chain for debugging
 * - Better error context preservation
 * - Standardized in ES2022
 *
 * Use Cases:
 * - Error wrapping
 * - Library error handling
 * - Debugging complex systems
 *
 * Common Pitfalls:
 * - Not supported in older environments
 * - Can create deep error chains
 * - May expose internal details
 */

console.log("\n=== 3. Error Chaining with Error.cause Demo ===");

// 3.1 Creating errors with cause
function parseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    throw new Error(`Failed to parse JSON: "${str}"`, { cause: error });
  }
}

function processUserData(jsonString) {
  try {
    const data = parseJSON(jsonString);
    return { valid: true, data };
  } catch (error) {
    throw new Error('User data processing failed', { cause: error });
  }
}

console.log("Error with cause:");
try {
  processUserData('{ invalid json }');
} catch (error) {
  console.log('Top-level error:', error.message);
  console.log('Cause:', error.cause?.message);
  console.log('Original cause:', error.cause?.cause?.message);
}

// 3.2 Building error chains
class DatabaseError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'DatabaseError';
  }
}

class ServiceError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = 'ServiceError';
  }
}

async function dbQuery() {
  throw new Error('Connection timeout');
}

async function userService() {
  try {
    await dbQuery();
  } catch (error) {
    throw new DatabaseError('Database query failed', error);
  }
}

async function apiHandler() {
  try {
    await userService();
  } catch (error) {
    throw new ServiceError('API endpoint failed', error);
  }
}

apiHandler().catch(error => {
  console.log("\nError chain:");
  console.log('Error:', error.message, `(${error.name})`);
  console.log('Cause:', error.cause?.message, `(${error.cause?.name})`);
  console.log('Root cause:', error.cause?.cause?.message);
});

// 3.3 Polyfill for older environments
function createErrorWithCause(message, cause) {
  const error = new Error(message);
  error.cause = cause;
  return error;
}

const polyfilledError = createErrorWithCause('Outer error', new Error('Inner error'));
console.log("\nPolyfilled error.cause:", polyfilledError.cause?.message);


// ============================================
// 4. AGGREGATEERROR - HANDLING MULTIPLE ERRORS
// ============================================
/**
 * AggregateError - Representing multiple errors at once (ES2021)
 *
 * Characteristics:
 * - Contains array of errors
 * - Single error object for multiple failures
 * - Useful for parallel operations
 * - Standardized in ES2021
 *
 * Use Cases:
 * - Promise.all() failures
 * - Batch operation errors
 * - Validation with multiple failures
 *
 * Common Pitfalls:
 * - Not supported in older browsers
 * - Need to iterate errors array
 * - Can hide individual error details
 */

console.log("\n=== 4. AggregateError Demo ===");

// 4.1 Creating AggregateError
const errors = [
  new Error('First error'),
  new TypeError('Second error'),
  new RangeError('Third error')
];

const aggregate = new AggregateError(errors, 'Multiple operations failed');

console.log("AggregateError:");
console.log('Message:', aggregate.message);
console.log('Error count:', aggregate.errors.length);
aggregate.errors.forEach((err, i) => {
  console.log(`  Error ${i + 1}:`, err.message);
});

// 4.2 Promise.allSettled with AggregateError
async function processAll(items) {
  const results = await Promise.allSettled(
    items.map(item =>
      item.valid
        ? Promise.resolve(item.value)
        : Promise.reject(new Error(`Invalid: ${item.name}`))
    )
  );

  const failures = results
    .filter(r => r.status === 'rejected')
    .map(r => r.reason);

  if (failures.length > 0) {
    throw new AggregateError(failures, `${failures.length} operations failed`);
  }

  return results.filter(r => r.status === 'fulfilled').map(r => r.value);
}

const testItems = [
  { valid: true, name: 'Item 1', value: 1 },
  { valid: false, name: 'Item 2' },
  { valid: true, name: 'Item 3', value: 3 },
  { valid: false, name: 'Item 4' }
];

processAll(testItems)
  .then(results => console.log('Results:', results))
  .catch(error => {
    if (error instanceof AggregateError) {
      console.log('\nAggregateError caught:');
      console.log('Message:', error.message);
      error.errors.forEach((err, i) => {
        console.log(`  Failure ${i + 1}:`, err.message);
      });
    }
  });

// 4.3 Validation with AggregateError
class ValidationError extends Error {
  constructor(errors) {
    super(errors.length === 1
      ? errors[0].message
      : `${errors.length} validation errors occurred`
    );
    this.errors = errors;
    this.name = 'ValidationError';
  }
}

function validateUser(user) {
  const errors = [];

  if (!user.name || user.name.length < 2) {
    errors.push(new Error('Name must be at least 2 characters'));
  }

  if (!user.email || !user.email.includes('@')) {
    errors.push(new Error('Valid email required'));
  }

  if (!user.age || user.age < 18) {
    errors.push(new Error('Must be 18 or older'));
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return { valid: true, user };
}

console.log("\nValidation example:");
try {
  validateUser({ name: 'A', email: '', age: 15 });
} catch (error) {
  if (error instanceof ValidationError) {
    console.log('Validation failed with', error.errors.length, 'errors:');
    error.errors.forEach(err => console.log('  -', err.message));
  }
}


// ============================================
// 4.4 Promise.any() - First success or all failure (ES2021)
// ============================================
/**
 * Promise.any() - Returns the FIRST fulfilled promise, or AggregateError if ALL reject (ES2021)
 *
 * Comparison with other Promise methods:
 * - Promise.all(): All must succeed (or any rejects)
 * - Promise.race(): First settled (whether success or failure)
 * - Promise.any(): First success (or all fail)
 * - Promise.allSettled(): Wait for all, get results/reasons
 *
 * Use Cases:
 * - Multiple redundant APIs (try fastest responding)
 * - Fallback data sources
 * - Competitive race for first success
 *
 * Common Pitfalls:
 * - Different from Promise.race() which takes ANY first settled
 * - AggregateError contains ALL rejection reasons
 */

console.log("\n=== 4.4 Promise.any() Demo ===");

// 4.4.1 Basic Promise.any() - first success
async function fetchFromMultipleSources() {
  const sources = [
    new Promise((_, reject) => setTimeout(() => reject(new Error('Source 1 down')), 100)),
    new Promise(resolve => setTimeout(() => resolve('Data from Source 2'), 200)),
    new Promise(resolve => setTimeout(() => resolve('Data from Source 3'), 300))
  ];

  try {
    const result = await Promise.any(sources);
    console.log('Promise.any() - First success:', result);
    return result;
  } catch (error) {
    if (error instanceof AggregateError) {
      console.log('All sources failed:', error.errors.map(e => e.message));
    }
    throw error;
  }
}

// 4.4.2 All promises reject - AggregateError
async function allFail() {
  const promises = [
    Promise.reject(new Error('Failed 1')),
    Promise.reject(new Error('Failed 2')),
    Promise.reject(new Error('Failed 3'))
  ];

  try {
    await Promise.any(promises);
  } catch (error) {
    console.log('Promise.any() - All rejected:');
    console.log('  Error count:', error.errors.length);
    error.errors.forEach((err, i) => {
      console.log(`  ${i + 1}:`, err.message);
    });
  }
}

// 4.4.3 Comparison: Promise.any() vs Promise.race()
async function compareRaceVsAny() {
  console.log("\nComparing Promise.any() vs Promise.race():");

  const promises = [
    Promise.reject(new Error('Fast failure')),
    new Promise(resolve => setTimeout(() => resolve('Slow success'), 50))
  ];

  // Promise.race() takes first settled, even if rejected
  try {
    const raceResult = await Promise.race([...promises]);
    console.log('Promise.race() result:', raceResult);
  } catch (error) {
    console.log('Promise.race() got first (rejected):', error.message);
  }

  // Promise.any() waits for first success
  try {
    const anyResult = await Promise.any([...promises]);
    console.log('Promise.any() got first success:', anyResult);
  } catch (error) {
    console.log('Promise.any() all rejected:', error.message);
  }
}

// Run demos
Promise.all([
  fetchFromMultipleSources(),
  allFail(),
  compareRaceVsAny()
]).catch(() => {});


// ============================================
// 5. CIRCUIT BREAKER PATTERN
// ============================================
/**
 * Circuit Breaker - Preventing cascade failures (ES6)
 *
 * Characteristics:
 * - Three states: Closed, Open, Half-Open
 * - Opens after failure threshold
 * - Half-open tests recovery
 * - Prevents system overload
 *
 * Use Cases:
 * - External API calls
 * - Database connections
 * - Microservice communication
 *
 * Common Pitfalls:
 * - Wrong threshold values
 * - Not handling half-open state
 * - Ignoring reset timeout
 */

console.log("\n=== 5. Circuit Breaker Pattern Demo ===");

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeout = options.resetTimeout || 5000;
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = null;
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        console.log('Circuit breaker: Moving to HALF-OPEN state');
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN - request rejected');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = 'CLOSED';
    console.log('Circuit breaker: Success - state CLOSED');
  }

  onFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      console.log(`Circuit breaker: ${this.failures} failures - state OPEN`);
    } else {
      console.log(`Circuit breaker: ${this.failures} failures`);
    }
  }
}

// Simulated failing service
let callCount = 0;
async function unstableService() {
  callCount++;
  if (callCount <= 5) {
    throw new Error('Service temporarily unavailable');
  }
  return 'Service response';
}

const breaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 100 });

async function testCircuitBreaker() {
  console.log('Testing circuit breaker:\n');

  for (let i = 0; i < 8; i++) {
    console.log(`\nCall ${i + 1}:`);
    try {
      const result = await breaker.execute(unstableService);
      console.log('Result:', result);
    } catch (error) {
      console.log('Error:', error.message);
    }
    await new Promise(r => setTimeout(r, 50));
  }
}

testCircuitBreaker();


// ============================================
// 6. RETRY WITH EXPONENTIAL BACKOFF
// ============================================
/**
 * Retry with Backoff - Intelligent retry mechanism (ES6)
 *
 * Characteristics:
 * - Increases delay between retries
 * - Prevents overwhelming services
 * - Configurable max retries
 * - Jitter for distributed systems
 *
 * Use Cases:
 * - Network requests
 * - Transient failures
 * - Rate-limited APIs
 *
 * Common Pitfalls:
 * - Infinite retry loops
 * - Too aggressive backoff
 * - Not handling permanent errors
 */

console.log("\n=== 6. Retry with Exponential Backoff Demo ===");

// 6.1 Basic retry implementation
async function retry(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    jitter = true
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const exponentialDelay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      const randomJitter = jitter ? Math.random() * 0.3 * exponentialDelay : 0;
      const delay = exponentialDelay + randomJitter;

      console.log(`Attempt ${attempt} failed. Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Wrap in a new Error (with cause) instead of mutating lastError in place
  const wrapped = new Error('Retries exhausted');
  wrapped.retriesExhausted = true;
  wrapped.cause = lastError;
  throw wrapped;
}

// 6.2 Test retry with simulated flaky service
let flakyCallCount = 0;
async function flakyService() {
  flakyCallCount++;
  if (flakyCallCount < 3) {
    throw new Error('Temporary network error');
  }
  return 'Success on attempt ' + flakyCallCount;
}

console.log('Retry with backoff:');
retry(() => flakyService(), { maxRetries: 5, baseDelay: 100 })
  .then(result => console.log('Final result:', result))
  .catch(error => console.log('All retries exhausted:', error.message));

// 6.3 Retry only on specific errors
function isRetryableError(error) {
  const retryableCodes = ['ECONNRESET', 'ETIMEDOUT', 'ECONNREFUSED'];
  return retryableCodes.includes(error.code) ||
         error.message.includes('timeout') ||
         error.message.includes('network');
}

async function retryOnlyRetryable(fn, options = {}) {
  const { maxRetries = 3, baseDelay = 1000 } = options;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error)) {
        console.log('Non-retryable error, not retrying');
        throw error;
      }

      if (attempt === maxRetries) break;

      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Retryable error. Attempt ${attempt + 1} in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw lastError;
}


// ============================================
// 7. TIMEOUT AND CANCELLATION
// ============================================
/**
 * Timeout & Cancellation - Controlling async operation lifetime (ES6+)
 *
 * Characteristics:
 * - AbortController for cancellation
 * - Timeout wrappers for promises
 * - Race conditions handling
 * - Resource cleanup on cancel
 *
 * Use Cases:
 * - HTTP request timeouts
 * - Long-running operations
 * - User-initiated cancellations
 *
 * Common Pitfalls:
 * - Not cleaning up resources
 * - Ignored abort signals
 * - Memory leaks from dangling promises
 */

console.log("\n=== 7. Timeout and Cancellation Demo ===");

// 7.1 Promise with timeout
function withTimeout(promise, ms, errorMessage = 'Operation timed out') {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });

  return Promise.race([promise, timeout]);
}

async function slowOperation() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 'Completed';
}

console.log('Timeout wrapper:');
withTimeout(slowOperation(), 100)
  .then(result => console.log('Result:', result))
  .catch(error => console.log('Error:', error.message));

// 7.2 AbortController for cancellation
async function cancellableOperation(signal) {
  for (let i = 0; i < 10; i++) {
    if (signal.aborted) {
      throw new Error('Operation cancelled');
    }
    console.log(`Progress: ${i * 10}%`);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return 'Complete';
}

console.log('\nCancellable operation:');
const controller = new AbortController();

cancellableOperation(controller.signal)
  .then(result => console.log('Result:', result))
  .catch(error => console.log('Cancelled:', error.message));

// Cancel after 300ms
setTimeout(() => {
  controller.abort();
  console.log('Operation aborted by user');
}, 300);

// 7.3 Fetch with timeout and abort
async function fetchWithTimeout(url, options = {}) {
  const { timeout = 5000, ...fetchOptions } = options;
  const controller = new AbortController();

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}


// ============================================
// 8. ERROR CONTEXT PRESERVATION
// ============================================
/**
 * Error Context Preservation - Maintaining debugging information (ES6+)
 *
 * Characteristics:
 * - Attach metadata to errors
 * - Preserve stack traces
 * - Include operation context
 * - Structured error objects
 *
 * Use Cases:
 * - Production debugging
 * - Error logging systems
 * - User-friendly error messages
 *
 * Common Pitfalls:
 * - Exposing sensitive data
 * - Large error objects
 * - Losing original stack trace
 */

console.log("\n=== 8. Error Context Preservation Demo ===");

// 8.1 Enhanced error class with context
class AppError extends Error {
  constructor(message, context = {}) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date().toISOString();
    this.context = context;
    // Note: super(message) already captured the throw-site stack; do NOT
    // overwrite with `new Error().stack` (would lose the original throw frame).
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }
}

// 8.2 Domain-specific errors
class DatabaseConnectionError extends AppError {
  constructor(host, port, originalError) {
    super(`Failed to connect to database at ${host}:${port}`, {
      host,
      port,
      errorCode: originalError?.code,
      retryable: true
    });
  }
}

class UserValidationError extends AppError {
  constructor(field, value, reason) {
    super(`Validation failed for field "${field}"`, {
      field,
      value,
      reason,
      type: 'VALIDATION_ERROR'
    });
  }
}

class AuthorizationError extends AppError {
  constructor(resource, userId) {
    super(`Unauthorized access to ${resource}`, {
      resource,
      userId,
      type: 'AUTHORIZATION_ERROR'
    });
  }
}

// 8.3 Usage examples
console.log('Enhanced errors:');

try {
  throw new DatabaseConnectionError('localhost', 5432, new Error('ECONNREFUSED'));
} catch (error) {
  console.log('\nDatabase error:', error.toJSON());
}

try {
  throw new UserValidationError('email', 'invalid', 'Must be valid email format');
} catch (error) {
  console.log('\nValidation error:', error.toJSON());
}

// 8.4 Error logger utility
class ErrorLogger {
  static log(error, metadata = {}) {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: error.context
      },
      metadata
    };

    console.log('\n=== Error Log Entry ===');
    console.log(JSON.stringify(logEntry, null, 2));

    // In production, send to logging service
    // sentry.captureException(error, { extra: metadata });
  }
}

ErrorLogger.log(
  new AppError('Something went wrong', { userId: 123 }),
  { action: 'create_user', requestId: 'abc-123' }
);


// ============================================
// 9. ERROR MIDDLEWARE PATTERNS
// ============================================
/**
 * Error Middleware - Centralized error handling (ES6)
 *
 * Characteristics:
 * - Intercepts errors in pipeline
 * - Transforms errors for clients
 * - Logging and monitoring hooks
 * - Consistent error responses
 *
 * Use Cases:
 * - Express.js error handlers
 * - API error responses
 * - Global error boundaries
 *
 * Common Pitfalls:
 * - Swallowing errors silently
 * - Not re-throwing when needed
 * - Overly generic handlers
 */

console.log("\n=== 9. Error Middleware Patterns Demo ===");

// 9.1 Simple error middleware pipeline
class Pipeline {
  constructor() {
    this.handlers = [];
    this.errorHandlers = [];
  }

  use(handler) {
    this.handlers.push(handler);
    return this;
  }

  useError(handler) {
    this.errorHandlers.push(handler);
    return this;
  }

  async execute(input) {
    try {
      let result = input;
      for (const handler of this.handlers) {
        result = await handler(result);
      }
      return result;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async handleError(error) {
    let handledError = error;

    for (const handler of this.errorHandlers) {
      handledError = await handler(handledError);
    }

    throw handledError;
  }
}

// 9.2 Example middleware
const loggingMiddleware = async (data) => {
  console.log('Processing:', data);
  return data;
};

const validationMiddleware = async (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data format');
  }
  return data;
};

const transformationMiddleware = async (data) => {
  return { ...data, transformed: true };
};

// 9.3 Error handlers
const formatErrorHandler = async (error) => {
  return {
    success: false,
    error: {
      message: error.message,
      type: error.constructor.name
    }
  };
};

const loggingErrorHandler = async (error) => {
  console.log('Error logged:', error.message);
  return error;
};

// 9.4 Build and run pipeline
const pipeline = new Pipeline();
pipeline
  .use(loggingMiddleware)
  .use(validationMiddleware)
  .use(transformationMiddleware)
  .useError(loggingErrorHandler)
  .useError(formatErrorHandler);

console.log('\nPipeline execution:');
pipeline.execute({ name: 'test' })
  .then(result => console.log('Success:', result))
  .catch(error => console.log('Final error:', error));

// Test with invalid input
console.log('\nPipeline with error:');
pipeline.execute(null)
  .then(result => console.log('Result:', result));


// ============================================
// 10. GLOBAL ERROR HANDLING
// ============================================
/**
 * Global Error Handling - Catching unhandled errors (ES6)
 *
 * Characteristics:
 * - process.uncaughtException (Node.js)
 * - process.unhandledRejection (Node.js)
 * - window.onerror (Browser)
 * - Last resort error catching
 *
 * Use Cases:
 * - Production error monitoring
 * - Graceful shutdown
 * - Error reporting services
 *
 * Common Pitfalls:
 * - Using as primary error handling
 * - Continuing after uncaught exceptions
 * - Not logging before exit
 */

console.log("\n=== 10. Global Error Handling Demo ===");

// 10.1 Node.js global handlers (only run in Node.js)
if (typeof process !== 'undefined' && process.versions?.node) {
  // Log unhandled rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.log('\n=== Unhandled Rejection ===');
    console.log('Reason:', reason);
    console.log('Promise:', promise);
  });

  // Log uncaught exceptions
  process.on('uncaughtException', (error) => {
    console.log('\n=== Uncaught Exception ===');
    console.log('Error:', error.message);
    // In production: log and gracefully exit
    // process.exit(1);
  });
}

// 10.2 Safe function wrapper
function safeExecute(fn, fallback = null) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.log('Safe execute caught:', error.message);
      return typeof fallback === 'function' ? fallback(error) : fallback;
    }
  };
}

const safeDivide = safeExecute(
  (a, b) => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
  },
  (error) => ({ error: error.message, result: 0 })
);

console.log('\nSafe execute:');
console.log('10 / 2 =', safeDivide(10, 2));
console.log('10 / 0 =', safeDivide(10, 0));


// ============================================
// BEST PRACTICES
// ============================================
/**
 * Async Error Handling Best Practices
 *
 * 1. ALWAYS HANDLE PROMISE REJECTIONS
 *    - Add .catch() to promise chains
 *    - Wrap await in try/catch
 *    - Use global handlers as backup
 *
 * 2. USE ERROR.CAUSE FOR CHAINING
 *    - Preserve original errors
 *    - Add context at each layer
 *    - Help debugging
 *
 * 3. IMPLEMENT CIRCUIT BREAKERS
 *    - Protect against cascade failures
 *    - Allow services to recover
 *    - Fail fast when appropriate
 *
 * 4. RETRY WITH INTELLIGENCE
 *    - Use exponential backoff
 *    - Only retry transient errors
 *    - Set reasonable limits
 *
 * 5. PRESERVE ERROR CONTEXT
 *    - Include relevant metadata
 *    - Maintain stack traces
 *    - Structure for logging
 */

console.log("\n=== Async Error Handling Best Practices Demo ===");

// Good: Comprehensive error handling
async function robustOperation() {
  const breaker = new CircuitBreaker({ failureThreshold: 3 });

  try {
    return await breaker.execute(async () => {
      return await retry(
        async () => {
          return await withTimeout(slowOperation(), 5000);
        },
        { maxRetries: 3, baseDelay: 100 }
      );
    });
  } catch (error) {
    throw new AppError('Robust operation failed', {
      operation: 'robust_operation',
      originalError: error.message
    });
  }
}


// ============================================
// COMMON PITFALLS
// ============================================
console.log("\n=== Async Error Handling Common Pitfalls Demo ===");

// Pitfall 1: Forgotten catch handler
console.log("\nPitfall 1 - Forgotten catch:");
console.log("Always add .catch() or use try/catch with await");

// Pitfall 2: Silent failures
console.log("\nPitfall 2 - Silent failures:");
console.log("Never swallow errors without logging");

// Pitfall 3: Infinite retries
console.log("\nPitfall 3 - Infinite retries:");
console.log("Always set maxRetries limit");

// Pitfall 4: Ignoring Error.cause
console.log("\nPitfall 4 - Ignoring Error.cause:");
console.log("Preserve original errors for debugging");


// ============================================
// SUMMARY
// ============================================
/**
 * Async Error Handling Summary
 *
 * Key Concepts:
 * 1. Promise .catch() and .finally()
 * 2. Async/await try/catch
 * 3. Error.cause for chaining
 * 4. AggregateError for multiple failures
 * 5. Circuit breaker for resilience
 * 6. Retry with exponential backoff
 * 7. Timeout and cancellation
 * 8. Error context preservation
 *
 * When to Use:
 * - Any async operation needs error handling
 * - External service calls need resilience
 * - Production code needs observability
 *
 * When to Avoid:
 * - Don't over-engineer simple cases
 * - Don't retry non-transient errors
 */

console.log("\n=== Async Error Handling Advanced Demo Complete ===");


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPED ERROR HANDLING
   TS:  catch (error: unknown) { ... }
   TS:  Type guards needed for error properties

   TypeScript example:
   try {
     await someAsyncOperation();
   } catch (error: unknown) {
     if (error instanceof Error) {
       console.log(error.message);
     }
   }

2. CUSTOM ERROR CLASSES
   TS:  class AppError extends Error { ... }

   TypeScript example:
   class DatabaseError extends Error {
     constructor(
       message: string,
       public readonly code: string,
       cause?: Error
     ) {
       super(message);
       this.name = 'DatabaseError';
     }
   }

3. RESULT TYPE PATTERN
   TS:  type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

   TypeScript example:
   type Result<T, E = Error> =
     | { ok: true; value: T }
     | { ok: false; error: E };

   async function safeFetch<T>(url: string): Promise<Result<T>> {
     try {
       const response = await fetch(url);
       return { ok: true, value: await response.json() };
     } catch (error) {
       return { ok: false, error: error as Error };
     }
   }

4. AGGREGATEERROR TYPING
   TS:  new AggregateError(errors: Error[], message: string)

   TypeScript example:
   const errors: Error[] = [new Error('First'), new Error('Second')];
   const aggregate = new AggregateError(errors, 'Multiple failures');

5. ABORTSIGNAL TYPING
   TS:  signal: AbortSignal

   TypeScript example:
   async function fetchData(
     url: string,
     signal: AbortSignal
   ): Promise<Response> {
     return fetch(url, { signal });
   }

6. CIRCUIT BREAKER WITH GENERICS
   TS:  class CircuitBreaker<T> { execute(fn: () => Promise<T>): Promise<T> }

   TypeScript example:
   class CircuitBreaker<T> {
     async execute(fn: () => Promise<T>): Promise<T> {
       // Implementation
     }
   }

📘 See related files:
- 20-error-handling.js (synchronous errors)
- 24-function-patterns-advanced.js (retry patterns)
- 26-optimization-performance.js (timeout optimization)
*/

// ============================================
// CROSS-REFERENCES
// ============================================
console.log(`
📘 See related files for additional patterns:

Async Error Handling:
- 20-error-handling.js (synchronous error handling)
- 24-function-patterns-advanced.js (retry and debounce)
- 26-optimization-performance.js (promise performance)
`);
