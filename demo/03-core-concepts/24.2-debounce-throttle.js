// Function Patterns - Debounce & Throttle Demo
// 📘 For TypeScript comparison, see: 24.2-debounce-throttle-ts-comparison.ts

export {};

// ============================================
// Learning goals
// ============================================
// This file covers rate-limiting function patterns:
// 1. Debounce - delay execution until after a pause
// 2. Throttle - limit execution to once per period
// 3. Use cases and implementation variations
// 4. Common pitfalls to avoid

// ============================================
// Table of Contents
// ============================================

// 1. Debounce - Delay Execution
// 2. Throttle - Rate Limiting
// 3. Implementation Variations
// 4. Use Case Examples

// ============================================

console.log("=== Function Patterns - Debounce & Throttle Demo ===\n");

// ============================================
// 1. Debounce - Delay Execution
// ============================================
/**
 * Debounce - Delays function execution until after a pause
 *
 * Characteristics:
 * - Waits for a quiet period before executing
 * - Only the last call in a burst gets executed
 * - Great for search inputs (wait until user stops typing)
 *
 * Use Cases:
 * - Search inputs (typeahead/auto-complete)
 * - Window resize handling
 * - Autosave
 * - Form validation
 *
 * Common Pitfalls:
 * - Too short a delay causes multiple calls
 * - Too long a delay feels unresponsive
 * - Forgetting to cancel pending calls when no longer needed
 */

console.log("=== 1. Debounce Demo ===");

// 1.1 Basic debounce implementation
// - Debounce 延迟执行直到停顿，防抖核心模式 (ES5)，基于闭包 + setTimeout
function debounce(fn, delayMs) {
  let timeoutId = null;

  return function(...args) {
    // Cancel previous pending execution
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Schedule new execution
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delayMs);
  };
}

// 1.2 Immediate (leading) debounce
function debounceImmediate(fn, delayMs, immediate = false) {
  let timeoutId = null;

  return function(...args) {
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
  };
}

// 1.3 Search input simulation
const searchAPI = debounce((query) => {
  console.log(`Searching for: "${query}"`);
}, 300);

console.log("\nDebounce - Search simulation:");
searchAPI('a');
searchAPI('ab');
searchAPI('abc');
searchAPI('abcd');
// Only "abcd" will be searched after 300ms pause

// 1.4 Window resize handler (immediate)
const handleResize = debounceImmediate(() => {
  console.log('Resize handled (immediate)');
}, 250, true);

console.log("\nDebounce - Immediate resize simulation:");
handleResize(); // Executes immediately
handleResize();
handleResize();
// No more calls for 250ms

// 1.5 Cancelable debounce
function debounceCancelable(fn, delayMs) {
  let timeoutId = null;

  const debounced = function(...args) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delayMs);
  };

  debounced.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}

console.log("\nDebounce - Cancelable:");
const cancelableSearch = debounceCancelable((q) => {
  console.log(`Cancelable search for: "${q}"`);
}, 300);
cancelableSearch('test1');
cancelableSearch('test2');
cancelableSearch.cancel(); // Cancels pending call

// ============================================
// 2. Throttle - Rate Limiting
// ============================================
/**
 * Throttle - Limits function execution to once per period
 *
 * Characteristics:
 * - Guarantees at most one execution per interval
 * - First call executes immediately
 * - Subsequent calls within interval are either:
 *   - Trailing: One call at end of interval with latest args
 *   - Dropped: No calls between executions
 *
 * Use Cases:
 * - Scroll events
 * - Mousemove/touchmove
 * - Button click prevention (double-clicks)
 * - Rate-limiting API calls
 *
 * Common Pitfalls:
 * - Losing trailing state updates
 * - Incorrect timestamp handling
 * - Memory leaks with old timers
 */

console.log("\n=== 2. Throttle Demo ===");

// 2.1 Basic throttle (trailing)
// - Throttle 限流到每周期一次，节流核心模式 (ES5)，基于闭包 + Date.now
function throttle(fn, limitMs) {
  let lastCall = 0;
  let timeoutId = null;

  return function(...args) {
    const now = Date.now();

    if (now - lastCall >= limitMs) {
      // Time to execute
      fn.apply(this, args);
      lastCall = now;
    } else {
      // Schedule trailing call with latest args
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
        lastCall = Date.now();
        timeoutId = null;
      }, limitMs - (now - lastCall));
    }
  };
}

// 2.2 Throttle - no trailing (only first call)
function throttleNoTrailing(fn, limitMs) {
  let lastCall = 0;

  return function(...args) {
    const now = Date.now();

    if (now - lastCall >= limitMs) {
      fn.apply(this, args);
      lastCall = now;
    }
    // Dropped otherwise
  };
}

// 2.3 Scroll handler simulation
const scrollHandler = throttle((scrollY) => {
  console.log(`Scroll handled at: ${scrollY}px`);
}, 200);

console.log("\nThrottle - Scroll simulation:");
scrollHandler(100); // Executes
scrollHandler(200); // Throttled
scrollHandler(300); // Throttled
scrollHandler(400); // Throttled, but will have trailing call
// One call immediately, one trailing after 200ms

// 2.4 Button click protection (no trailing)
const clickHandler = throttleNoTrailing(() => {
  console.log('Button clicked (protected)');
}, 1000);

console.log("\nThrottle - Click protection:");
clickHandler(); // Executes
clickHandler(); // Dropped
clickHandler(); // Dropped

// 2.5 Cancelable throttle
function throttleCancelable(fn, limitMs) {
  let lastCall = 0;
  let timeoutId = null;

  const throttled = function(...args) {
    const now = Date.now();

    if (now - lastCall >= limitMs) {
      fn.apply(this, args);
      lastCall = now;
    } else {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
        lastCall = Date.now();
        timeoutId = null;
      }, limitMs - (now - lastCall));
    }
  };

  throttled.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return throttled;
}

// ============================================
// 3. Implementation Variations
// ============================================
console.log("\n=== 3. Implementation Variations ===");

// 3.1 Promise-based debounce (returns promise)
function debouncePromise(fn, delayMs) {
  let timeoutId = null;

  return function(...args) {
    return new Promise((resolve) => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const result = fn.apply(this, args);
        resolve(result);
        timeoutId = null;
      }, delayMs);
    });
  };
}

console.log("\nPromise-based debounce:");
const delayedAdd = debouncePromise((a, b) => a + b, 100);
delayedAdd(5, 3).then(result => {
  console.log("Delayed add result:", result); // 8
});

// 3.2 Debounce with max wait (guaranteed execution)
function debounceWithMaxWait(fn, delayMs, maxWaitMs) {
  let timeoutId = null;
  let lastCallTime = 0;

  const execute = (context, args) => {
    fn.apply(context, args);
    lastCallTime = Date.now();
  };

  return function(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    if (lastCallTime === 0 || timeSinceLastCall >= maxWaitMs) {
      execute(this, args);
    } else {
      timeoutId = setTimeout(() => {
        execute(this, args);
        timeoutId = null;
      }, Math.min(delayMs, maxWaitMs - timeSinceLastCall));
    }
  };
}

console.log("\nDebounce with max wait:");
const maxWaitSearch = debounceWithMaxWait(
  (q) => console.log(`Max wait search: "${q}"`),
  300,
  1000
);
maxWaitSearch('a');
maxWaitSearch('b');
maxWaitSearch('c');
// Will execute after 300ms OR 1000ms after first call (whichever comes first)

// 3.3 Throttle with leading + trailing options
function throttleOptions(fn, limitMs, { leading = true, trailing = true } = {}) {
  let lastCall = 0;
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  const execute = () => {
    if (lastArgs && lastThis) {
      fn.apply(lastThis, lastArgs);
      lastCall = Date.now();
      lastArgs = null;
      lastThis = null;
    }
  };

  const throttled = function(...args) {
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
        timeoutId = null;
        lastCall = Date.now();
      }, remaining);
    }
  };

  throttled.cancel = function() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastCall = 0;
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}

console.log("\nThrottle with options:");
const trailingOnly = throttleOptions((v) => console.log('Trailing:', v), 200, { leading: false, trailing: true });
trailingOnly('a');
trailingOnly('b');
trailingOnly('c');

// ============================================
// 4. Use Case Examples
// ============================================
console.log("\n=== 4. Use Case Examples ===");

// 4.1 Autosave form
console.log("\n4.1 Autosave:");
const saveDraft = debounce((content) => {
  console.log(`Auto-saving draft: "${content.substring(0, 20)}..."`);
}, 500);
saveDraft('Hello world');
saveDraft('Hello world, how are');
saveDraft('Hello world, how are you?');

// 4.2 Infinite scroll
console.log("\n4.2 Infinite scroll:");
const checkScroll = throttle((scrollTop, clientHeight, scrollHeight) => {
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    console.log('Loading more items...');
  }
}, 150);
checkScroll(500, 800, 2000);
checkScroll(600, 800, 2000);
checkScroll(1150, 800, 2000); // Triggers load

// 4.3 Mousemove/touch handler
console.log("\n4.3 Mousemove:");
const updatePosition = throttle((x, y) => {
  console.log(`Cursor at: (${x}, ${y})`);
}, 50);
updatePosition(10, 20);
updatePosition(15, 25);
updatePosition(20, 30);

// 4.4 Double-click prevention
console.log("\n4.4 Double-click prevention:");
const purchase = throttleNoTrailing(() => {
  console.log('Purchase submitted (once)');
}, 1000);
purchase(); // Submitted
purchase(); // Ignored
purchase(); // Ignored

// ============================================
// Common Pitfalls
// ============================================
console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Forgetting to cancel debounced functions in cleanups
console.log("\nPitfall 1 - Memory leaks:");
console.log("❌ Bad: Not canceling debounced timers in component unmounts");
console.log("✅ Good: Always cancel debounced/throttled functions when no longer needed");

// Pitfall 2: Too short/long delays
console.log("\nPitfall 2 - Bad delay values:");
console.log("❌ Bad: Search debounce at 50ms (too short)");
console.log("❌ Bad: Search debounce at 2000ms (too slow)");
console.log("✅ Good: Search debounce at 200-500ms (balance)");

// Pitfall 3: Creating new debounced functions on every render
console.log("\nPitfall 3 - Re-creating debounced functions:");
const badSearch = () => {
  // ❌ Bad: Creates new debounced function every call
  const debounced = debounce(() => {}, 300);
  debounced(); // Never gets combined - new function each time
};
console.log("❌ Bad: Re-creating debounced functions (loses debouncing)");
console.log("✅ Good: Memoize debounced/throttled functions");

// ============================================
// Best Practices
// ============================================
console.log("\n=== Best Practices ===");

console.log("✅ Use debounce for: Search inputs, resize, autosave");
console.log("✅ Use throttle for: Scroll, mousemove, button protection");
console.log("✅ Use cancelable versions for cleanup");
console.log("✅ Choose delay based on use case: 200-500ms for search, 100-200ms for scroll");
console.log("✅ Consider max wait for debounce to guarantee updates");
console.log("⚠️  Always clean up timers to avoid memory leaks");
console.log("⚠️  Beware of 'this' context - bind or use arrow functions carefully");
console.log("⚠️  Test edge cases (rapid fire, component unmount mid-delay)");

// ============================================
// Summary
// ============================================
console.log("\n=== Summary ===");
console.log(`
┌─────────────────┬─────────────────┬─────────────────┐
│ Pattern         │ Executes       │ Good For        │
├─────────────────┼─────────────────┼─────────────────┤
│ Debounce        │ After pause    │ Search, resize  │
│ Throttle        │ At interval    │ Scroll, mousemove│
└─────────────────┴─────────────────┴─────────────────┘

Recommended delays:
- Search: 200-500ms
- Resize: 100-200ms
- Scroll: 50-150ms
- Autosave: 300-1000ms
`);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 24.1-function-composition.js - Composition and currying");
console.log("📘 24.3-memoization-cache.js - Memoization and caching patterns");
console.log("📘 07.3-functions-patterns.js - Function pattern basics");
console.log("📘 26-optimization-performance.js - Performance optimization");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 24.2-debounce-throttle-ts-comparison.ts
*/