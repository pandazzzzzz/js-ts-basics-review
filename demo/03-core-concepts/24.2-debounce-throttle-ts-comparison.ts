// Function Patterns - Debounce & Throttle TypeScript Comparison
// 📘 Complementary to: 24.2-debounce-throttle.js

// 🎯 Difficulty: Intermediate
export {};

console.log("=== Function Patterns - Debounce & Throttle TypeScript Comparison ===\n");

/**
 * 🔍 Key Differences in TypeScript:
 *
 * 1. DEBOUNCE/THROTTLE FUNCTION TYPES
 *    JS:  Returns function with setTimeout types mixed
 *    TS:  Can type the debounced/throttled function signature
 *
 * 2. TIMERS
 *    JS:  setTimeout/setInterval return number, any type accepted
 *    TS:  setTimeout/setInterval return NodeJS.Timeout, clear timers correctly
 *
 * 3. CANCELABLE DEBOUNCE/THROTTLE
 *    JS:  Add .cancel() method to returned function
 *    TS:  Can type the cancel method on the returned function
 *
 * 4. THIS CONTEXT
 *    JS:  'this' binding matters for debounced functions
 *    TS:  'this' can be typed with generic 'this' parameters
 */

// Example 1: Typed debounce
console.log("1. Typed debounce:");
type AnyFn = (...args: any[]) => any;

function debounce<T extends AnyFn>(fn: T, delayMs: number): T {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: any[]): any {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delayMs);
  } as any as T;
}

const searchAPI = debounce((query: string) => {
  console.log(`Searching for: "${query}"`);
}, 300);
searchAPI("test query");

// Example 2: Debounce with immediate option
console.log("\n2. Debounce with immediate:");
function debounceImmediate<T extends AnyFn>(
  fn: T,
  delayMs: number,
  immediate: boolean = false
): T & { cancel(): void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const debounced = function (this: any, ...args: any[]): any {
    const callNow = immediate && !timeoutId;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        fn.apply(this, args);
      }
    }, delayMs);

    if (callNow) {
      fn.apply(this, args);
    }
  } as any as T;

  (debounced as any).cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced as any;
}

// Example 3: Typed throttle
console.log("\n3. Typed throttle:");
function throttle<T extends AnyFn>(fn: T, limitMs: number): T {
  let lastCall: number = 0;
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: any[]): any {
    const now = Date.now();

    if (now - lastCall >= limitMs) {
      fn.apply(this, args);
      lastCall = now;
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(
        () => {
          fn.apply(this, args);
          lastCall = Date.now();
          timeoutId = null;
        },
        limitMs - (now - lastCall)
      );
    }
  } as any as T;
}

const scrollHandler = throttle((scrollY: number) => {
  console.log(`Scroll handled at: ${scrollY}px`);
}, 200);
scrollHandler(100);

// Example 4: Throttle with options
console.log("\n4. Throttle with options:");
interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

function throttleWithOptions<T extends AnyFn>(
  fn: T,
  limitMs: number,
  options: ThrottleOptions = {}
): T & { cancel(): void } {
  let lastCall: number = 0;
  let timeoutId: NodeJS.Timeout | null = null;
  let lastArgs: any[] | null = null;
  let lastThis: any = null;

  const { leading = true, trailing = true } = options;

  const execute = (): void => {
    if (lastArgs && lastThis) {
      fn.apply(lastThis, lastArgs);
      lastCall = Date.now();
      lastArgs = null;
      lastThis = null;
    }
  };

  const throttled = function (this: any, ...args: any[]): any {
    const now = Date.now();

    if (!lastCall && !leading) {
      lastCall = now;
    }

    const remaining = limitMs - (now - lastCall);

    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > limitMs) {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      execute();
      lastCall = now;
    } else if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        execute();
        lastCall = Date.now();
        timeoutId = null;
      }, remaining);
    }
  } as any as T;

  (throttled as any).cancel = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastCall = 0;
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
  };

  return throttled as any;
}

// Example 5: Typed event handler
console.log("\n5. Typed event handler:");
interface EventHandler {
  (event: Event): void;
}

function createDebouncedHandler<T extends EventHandler>(fn: T, delayMs: number): T {
  return debounce(fn, delayMs);
}

const handleResize = (event: Event) => {
  console.log("Resize handled:", event);
};

const debouncedResize = createDebouncedHandler(handleResize, 250);
// window.addEventListener('resize', debouncedResize);  // Commented out for Node.js environment

// Example 6: Promise-based debounce
console.log("\n6. Promise-based debounce:");
function debouncePromise<T extends any[], R>(
  fn: (...args: T) => R,
  delayMs: number
): (...args: T) => Promise<R> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: T): Promise<R> => {
    return new Promise<R>(resolve => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const result = fn(...args);
        resolve(result);
        timeoutId = null;
      }, delayMs);
    });
  };
}

// Example 7: Function type guards for throttle/debounce
console.log("\n7. Function type guards:");
type DebouncedFunction<T> = T & { cancel(): void };

function isDebounced<T>(fn: unknown): fn is DebouncedFunction<T> {
  return typeof fn === "function" && "cancel" in fn;
}

// Example 8: Generic rate limiter
console.log("\n8. Generic rate limiter:");
type RateLimiter<T extends AnyFn> = T & { cancel(): void };

function createRateLimiter<T extends AnyFn>(
  fn: T,
  options: { interval?: number; debounce?: number }
): RateLimiter<T> {
  if (options.debounce) {
    return debounce(fn, options.debounce) as any;
  }
  return throttle(fn, options.interval || 100) as any;
}

/**
 * 📋 Key Takeaways:
 * - Debounced/throttled functions can preserve original function signature with generics
 * - setTimeout/setInterval return NodeJS.Timeout (not number) for proper typing
 * - Cancelable versions can be typed: T & { cancel(): void }
 * - Promise-based debounce returns Promise<R> with correct type
 * - Event handlers can be typed with interfaces: (event: Event) => void
 * - Function type guards: isDebounced<T>(fn) checks for cancel method
 * - Generic rate limiters can return typed union types
 */
