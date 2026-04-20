// TypeScript vs JavaScript: Event Loop and Callbacks Comparison
// 📘 For JavaScript examples, see: 29-event-loop-callbacks.js
// This file demonstrates TypeScript-specific typing for callbacks and timers

export {};

// ============================================================================
// 1. CALLBACK FUNCTION TYPES
// ============================================================================

// JavaScript: No type checking for callbacks
// function processData(data, callback) {
//   callback(data);
// }

// TypeScript: Explicit callback function type
type Callback<T> = (result: T) => void;

function processData(data: string, callback: Callback<string>): void {
  const result = data.toUpperCase();
  callback(result);
}

// Usage with type inference
processData("hello", (result) => {
  // result is typed as string
  console.log("Callback result:", result);
});

// Error-first callback pattern (Node.js style)
type ErrorFirstCallback<T> = (error: Error | null, result?: T) => void;

function fetchData(id: number, callback: ErrorFirstCallback<{ id: number; name: string }>): void {
  setTimeout(() => {
    if (id > 0) {
      callback(null, { id, name: "User" });
    } else {
      callback(new Error("Invalid ID"));
    }
  }, 100);
}

console.log("=== Callback Function Types ===");
fetchData(1, (error, data) => {
  if (error) {
    console.error("Error:", error.message);
  } else {
    // data is typed as { id: number; name: string }
    console.log("Data received:", data.name);
  }
});

// ============================================================================
// 2. FUNCTION TYPE DEFINITIONS
// ============================================================================

// Multiple ways to type callback functions

// Method 1: Type alias with function signature
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

// Method 2: Interface with call signature
interface StringProcessor {
  (input: string): string;
}

const toUpper: StringProcessor = (input) => input.toUpperCase();
const toLower: StringProcessor = (input) => input.toLowerCase();

// Method 3: Inline function type
function processArray(
  items: number[],
  transformer: (item: number) => number
): number[] {
  return items.map(transformer);
}

console.log("\n=== Function Type Definitions ===");
console.log("Add:", add(5, 3)); // 8
console.log("Multiply:", multiply(5, 3)); // 15
console.log("ToUpper:", toUpper("hello")); // "HELLO"
console.log("Process array:", processArray([1, 2, 3], x => x * 2)); // [2, 4, 6]

// ============================================================================
// 3. THIS TYPING IN CALLBACKS
// ============================================================================

// TypeScript: Explicit 'this' parameter typing
interface Processor {
  prefix: string;
  process: (this: Processor, value: string) => string;
}

const processor: Processor = {
  prefix: "Processed",
  process(value: string): string {
    // 'this' is typed as Processor
    return `${this.prefix}: ${value}`;
  }
};

// Explicit this binding
function createCounter() {
  let count = 0;
  return {
    increment: function(this: { count: number }): void {
      this.count++;
    },
    getCount: function(this: { count: number }): number {
      return this.count;
    }
  };
}

console.log("\n=== This Typing in Callbacks ===");
console.log("Processor:", processor.process("hello"));

// Arrow functions inherit 'this' from enclosing scope
class DataHandler {
  private data: string[] = [];

  // Arrow function preserves 'this'
  addAndProcess = (item: string): void => {
    this.data.push(item);
    // 'this' is correctly typed as DataHandler
    console.log("Data length:", this.data.length);
  };

  // Regular method with explicit this
  processAll(this: DataHandler): void {
    this.data.forEach(item => {
      // Arrow in method inherits 'this'
      console.log("Item:", item);
    });
  }
}

const handler = new DataHandler();
handler.addAndProcess("item1");
handler.addAndProcess("item2");
handler.processAll();

// ============================================================================
// 4. TIMER FUNCTION TYPES
// ============================================================================

// TypeScript: setTimeout and setInterval types

// setTimeout returns NodeJS.Timeout (Node.js) or number (browser)
// For cross-platform compatibility, use 'any' or specific type
const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
  console.log("Timeout executed");
}, 1000);

// clearTimeout accepts the timeout ID
clearTimeout(timeoutId);

// setInterval with typed callback
let intervalCount = 0;

const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
  intervalCount++;
  console.log("Interval tick:", intervalCount);

  if (intervalCount >= 3) {
    clearInterval(intervalId);
    console.log("Interval cleared");
  }
}, 100);

console.log("\n=== Timer Function Types ===");

// Typed setTimeout with Promise
function delay(ms: number, value?: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value ?? "delayed");
    }, ms);
  });
}

delay(100, "hello").then(result => {
  console.log("Delay resolved:", result);
});

// ============================================================================
// 5. GENERIC CALLBACK TYPES
// ============================================================================

// TypeScript: Generic callback types for reusability
type AsyncCallback<T> = (result: T) => Promise<void> | void;

function fetchWithCallback<T>(
  url: string,
  callback: AsyncCallback<T>
): void {
  // Simulated fetch
  setTimeout(() => {
    const mockData = { url, timestamp: Date.now() } as T;
    callback(mockData);
  }, 100);
}

// Usage with different types
interface UserData {
  id: number;
  name: string;
}

fetchWithCallback<UserData>("/api/users", (result) => {
  // result is typed as UserData
  console.log("User data:", result.name);
});

fetchWithCallback<{ url: string; timestamp: number }>("/api/posts", (result) => {
  // result is typed as { url: string; timestamp: number }
  console.log("Post data:", result.url);
});

console.log("\n=== Generic Callback Types ===");

// ============================================================================
// 6. UNION TYPES IN CALLBACKS
// ============================================================================

// TypeScript: Union types for flexible callback parameters
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

type ResultCallback<T> = (result: Result<T>) => void;

function asyncOperation(
  shouldSucceed: boolean,
  callback: ResultCallback<string>
): void {
  setTimeout(() => {
    if (shouldSucceed) {
      callback({ success: true, data: "Operation succeeded" });
    } else {
      callback({ success: false, error: new Error("Operation failed") });
    }
  }, 100);
}

// Usage with type guard
asyncOperation(true, (result) => {
  if (result.success) {
    // TypeScript knows result.data exists
    console.log("Success data:", result.data);
  } else {
    // Use type narrowing - result is { success: false; error: Error }
    const errorMsg = "error" in result && result.error instanceof Error
      ? result.error.message
      : String(result);
    console.log("Error:", errorMsg);
  }
});

console.log("\n=== Union Types in Callbacks ===");

// ============================================================================
// 7. OVERLOAD SIGNATURES FOR CALLBACKS
// ============================================================================

// TypeScript: Function overloads with callbacks
function fetchDataWithOverload(callback: (data: string) => void): void;
function fetchDataWithOverload(id: number, callback: (data: { id: number; name: string }) => void): void;
function fetchDataWithOverload(
  idOrCallback: number | ((data: string) => void),
  callback?: (data: { id: number; name: string }) => void
): void {
  if (typeof idOrCallback === "function") {
    // No ID provided, return string
    idOrCallback("default data");
  } else {
    // ID provided, return object
    callback?.({ id: idOrCallback, name: "User" });
  }
}

// Usage - TypeScript infers correct callback type
fetchDataWithOverload((data: string) => {
  // data is typed as string
  console.log("Default data:", data);
});

fetchDataWithOverload(1, (data: { id: number; name: string }) => {
  // data is typed as { id: number; name: string }
  console.log("User data:", data.name);
});

console.log("\n=== Overload Signatures for Callbacks ===");

// ============================================================================
// 8. VOID VS NEVER IN CALLBACKS
// ============================================================================

// TypeScript: void vs never return types

// void - function doesn't return meaningful value
type VoidCallback = () => void;

const logCallback: VoidCallback = () => {
  console.log("Logging...");
  // Implicitly returns undefined
};

// never - function never returns (throws or infinite loop)
type NeverCallback = () => never;

const errorCallback: NeverCallback = () => {
  throw new Error("This always throws");
};

// Practical difference
function executeCallback(
  callback: VoidCallback,
  shouldThrow: boolean = false
): void {
  if (shouldThrow) {
    // Can't call never-returning function directly
    // Would need special handling
    try {
      errorCallback();
    } catch (error) {
      console.log("Caught error from never callback");
    }
  } else {
    callback(); // Normal void callback
  }
}

console.log("\n=== Void vs Never in Callbacks ===");
executeCallback(logCallback);
executeCallback(logCallback, true);

// ============================================================================
// 9. PARTIAL AND OPTIONAL CALLBACKS
// ============================================================================

// TypeScript: Optional callback parameters
type OptionalCallback<T> = (result?: T) => void;

function optionalExecution(callback?: OptionalCallback<string>): void {
  if (callback) {
    callback("result");
  } else {
    console.log("No callback provided");
  }
}

// Usage
optionalExecution((result) => {
  // result is typed as string | undefined
  if (result !== undefined) {
    console.log("Result:", result);
  }
});

optionalExecution(); // No callback

// Partial types for complex callbacks
interface EventData {
  type: string;
  target: EventTarget | null;
  timestamp: number;
  bubbles: boolean;
}

type PartialEventCallback = (event: Partial<EventData>) => void;

const handleEvent: PartialEventCallback = (event) => {
  // All properties are optional
  console.log("Event type:", event.type);
  console.log("Has target:", event.target !== null);
};

console.log("\n=== Partial and Optional Callbacks ===");
handleEvent({ type: "click" }); // Only type provided

// ============================================================================
// 10. ASYNC CALLBACK TYPES
// ============================================================================

// TypeScript: Async callback return types (renamed to avoid duplicate with section 5)
type SyncCallbackType<T> = (data: T) => T;
type AsyncCallbackType<T> = (data: T) => Promise<T>;

// Function that accepts both sync and async callbacks
function processMaybeAsync<T>(
  data: T,
  callback: SyncCallbackType<T> | AsyncCallbackType<T>
): T | Promise<T> {
  const result = callback(data);
  if (result instanceof Promise) {
    return result;
  }
  return result;
}

// Usage
const syncResult = processMaybeAsync(5, (x: number) => x * 2);
console.log("Sync result:", syncResult);

const asyncResult = processMaybeAsync(5, async (x: number) => x * 2);
Promise.resolve(asyncResult).then(result => {
  console.log("Async result:", result);
});

console.log("\n=== Async Callback Types ===");

// ============================================================================
// 11. EVENT HANDLER TYPING
// ============================================================================

// TypeScript: Event handler types
type EventHandler<T extends Event = Event> = (event: T) => void;

// Mouse event handler
const mouseHandler: EventHandler<MouseEvent> = (event) => {
  console.log("Mouse at:", event.clientX, event.clientY);
};

// Keyboard event handler
const keyboardHandler: EventHandler<KeyboardEvent> = (event) => {
  console.log("Key pressed:", event.key);
};

// Custom event handler
interface CustomEventDetail {
  userId: number;
  action: string;
}

type CustomEventHandler = EventHandler<CustomEvent & { detail: CustomEventDetail }>;

const customHandler: CustomEventHandler = (event) => {
  console.log("User", event.detail.userId, "performed", event.detail.action);
};

console.log("\n=== Event Handler Typing ===");

// ============================================================================
// 12. COMPOSED CALLBACK TYPES
// ============================================================================

// TypeScript: Composing multiple callback types
type TransformCallback<T, U> = (input: T, done: (output: U) => void) => void;

// Chain of transformations
function createTransformer<T, U, V>(
  transform1: TransformCallback<T, U>,
  transform2: TransformCallback<U, V>
): TransformCallback<T, V> {
  return (input: T, done: (output: V) => void) => {
    transform1(input, (intermediate) => {
      transform2(intermediate, done);
    });
  };
}

// Usage
const stringToNumber: TransformCallback<string, number> = (input, done) => {
  done(parseInt(input, 10));
};

const numberToString: TransformCallback<number, string> = (input, done) => {
  done(input.toString());
};

const composed = createTransformer(stringToNumber, numberToString);
composed("42", (result) => {
  console.log("Composed result:", result); // "42"
});

console.log("\n=== Composed Callback Types ===");

// ============================================================================
// 13. NARROWING AND TYPE GUARDS IN CALLBACKS
// ============================================================================

// TypeScript: Type guards for callback results
type ApiResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "pending" };

function isApiSuccess<T>(result: ApiResult<T>): result is { status: "success"; data: T } {
  return result.status === "success";
}

function isApiError<T>(result: ApiResult<T>): result is { status: "error"; message: string } {
  return result.status === "error";
}

// Usage with type narrowing
function handleApiResult(result: ApiResult<string>): void {
  if (isApiSuccess(result)) {
    // TypeScript knows result has 'data' property
    console.log("Success data:", result.data);
  } else if (isApiError(result)) {
    // TypeScript knows result has 'message' property
    console.log("Error message:", result.message);
  } else {
    // status is "pending"
    console.log("Pending...");
  }
}

console.log("\n=== Narrowing and Type Guards ===");
handleApiResult({ status: "success", data: "hello" });
handleApiResult({ status: "error", message: "Failed" });
handleApiResult({ status: "pending" });

// ============================================================================
// 14. CURRIED CALLBACK TYPES
// ============================================================================

// TypeScript: Curried function types
type CurriedCallback<T> = (arg1: number) => (arg2: number) => (arg3: T) => void;

const curriedCallback: CurriedCallback<string> =
  (arg1: number) =>
  (arg2: number) =>
  (arg3: string) => {
    console.log(`Curried: ${arg1}, ${arg2}, ${arg3}`);
  };

// Partial application
const step1 = curriedCallback(1);
const step2 = step1(2);
step2("hello"); // Full application

// Or all at once
curriedCallback(1)(2)("world");

console.log("\n=== Curried Callback Types ===");

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

console.log("\n=== TypeScript Best Practices for Callbacks ===\n");
console.log(`
1. ALWAYS type callback parameters and return values
2. Use generic callback types for reusability
3. Use union types for flexible callback results
4. Type 'this' explicitly in callbacks
5. Use type guards for narrowing union types
6. Prefer AsyncCallback<T> for async operations
7. Use ErrorFirstCallback<T> for Node.js style
8. Type event handlers with specific event types
9. Use Partial<T> for optional callback data
10. Consider function overloads for different callback signatures

⚠️ COMMON PITFALLS:

1. Forgetting to type callback parameters
   - Parameters default to 'any' without explicit types

2. Not handling 'this' binding
   - Use arrow functions or explicit 'this' parameter

3. Using 'any' instead of 'unknown'
   - 'unknown' is type-safe, requires type guards

4. Ignoring void vs never difference
   - void: returns undefined
   - never: never returns

5. Not using type guards for unions
   - TypeScript can't narrow automatically

📘 See 29-event-loop-callbacks.js for JavaScript fundamentals!
`);
