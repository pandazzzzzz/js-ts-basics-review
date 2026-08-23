// TypeScript vs JavaScript: Iterators and Generators Comparison
// 📘 For JavaScript examples, see: 22-iterators-generators.js
// This file demonstrates TypeScript-specific typing for iterators and generators

export {};

// ============================================================================
// 1. ITERATOR<T> INTERFACE
// ============================================================================

// JavaScript: Iterator without type checking
// const iterator = {
//   current: 0,
//   last: 5,
//   next() {
//     if (this.current <= this.last) {
//       return { value: this.current++, done: false };
//     }
//     return { done: true };
//   }
// };

// TypeScript: Iterator<T> interface with proper typing
const typedIterator: Iterator<number> = (() => {
  let current = 0;
  const last = 5;
  return {
    next(): IteratorResult<number> {
      if (current <= last) {
        return { value: current++, done: false };
      }
      return { done: true, value: undefined };
    },
  };
})();

console.log("=== Iterator<T> Interface ===");
console.log(typedIterator.next()); // { value: 0, done: false }
console.log(typedIterator.next()); // { value: 1, done: false }

// ============================================================================
// 2. GENERATOR<T, TReturn, TNext> TYPE
// ============================================================================

// TypeScript: Full generator type signature
function* numberGenerator(): Generator<number, string, boolean> {
  let count = 0;

  while (true) {
    const shouldContinue: boolean | undefined = yield count++;

    if (shouldContinue === false) {
      return "finished";
    }
  }
}

console.log("\n=== Generator<T, TReturn, TNext> Type ===");
const gen = numberGenerator();
console.log(gen.next()); // { value: 0, done: false }
console.log(gen.next(true)); // { value: 1, done: false }
console.log(gen.next(false)); // { value: "finished", done: true }

// ============================================================================
// 3. ASYNC ITERATOR AND GENERATOR TYPES
// ============================================================================

// TypeScript: AsyncIterator<T> and AsyncGenerator<T> types
async function* asyncNumberGenerator(): AsyncGenerator<number, void, unknown> {
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 10));
    yield i;
  }
}

// Custom async iterator
class AsyncRange implements AsyncIterable<number> {
  constructor(
    private from: number,
    private to: number,
    private delay: number = 10
  ) {}

  [Symbol.asyncIterator](): AsyncIterator<number> {
    let current = this.from;
    const to = this.to;
    const delay = this.delay;

    return {
      next: async (): Promise<IteratorResult<number>> => {
        if (current <= to) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return { value: current++, done: false };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

console.log("\n=== Async Iterator and Generator Types ===");
(async () => {
  for await (const num of asyncNumberGenerator()) {
    console.log(num);
  }
})();

// ============================================================================
// 4. ITERABLE<T> INTERFACE
// ============================================================================

// TypeScript: Iterable<T> interface implementation
class CustomCollection implements Iterable<string> {
  private items: string[] = [];

  add(item: string): void {
    this.items.push(item);
  }

  [Symbol.iterator](): Iterator<string> {
    let index = 0;
    const items = this.items;

    return {
      next(): IteratorResult<string> {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

console.log("\n=== Iterable<T> Interface ===");
const collection = new CustomCollection();
collection.add("apple");
collection.add("banana");
collection.add("cherry");

for (const item of collection) {
  console.log(item);
}

// ============================================================================
// 5. SYMBOL.ITERATOR TYPING
// ============================================================================

// TypeScript: Symbol.iterator method typing
class Range implements Iterable<number> {
  constructor(
    public from: number,
    public to: number
  ) {}

  [Symbol.iterator](): Iterator<number> {
    let current = this.from;
    const last = this.to;

    return {
      next(): IteratorResult<number> {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true, value: undefined };
      },
    };
  }
}

console.log("\n=== Symbol.iterator Typing ===");
const range = new Range(1, 5);
console.log([...range]); // [1, 2, 3, 4, 5]

// ============================================================================
// 6. ITERATOR RESULT UTILITIES
// ============================================================================

// TypeScript: IteratorResult type helpers
type YieldResult<T> = IteratorYieldResult<T>;
type ReturnResult<T> = IteratorReturnResult<T>;

function createIteratorHelper<T>() {
  return {
    asYield(value: T): YieldResult<T> {
      return { done: false, value };
    },
    asReturn<R>(value: R): ReturnResult<R> {
      return { done: true, value };
    },
  };
}

const helper = createIteratorHelper<number>();
console.log("\n=== Iterator Result Utilities ===");
console.log(helper.asYield(42)); // { done: false, value: 42 }
console.log(helper.asReturn("done")); // { done: true, value: "done" }

// ============================================================================
// 7. GENERATOR DELEGATION WITH YIELD*
// ============================================================================

// TypeScript: Typed yield* delegation
function* letters(): Generator<string, void, unknown> {
  yield "a";
  yield "b";
  yield "c";
}

function* numbers(): Generator<number, void, unknown> {
  yield 1;
  yield 2;
  yield 3;
}

function* combined(): Generator<string | number, void, unknown> {
  yield* letters();
  yield* numbers();
}

console.log("\n=== Generator Delegation with yield* ===");
console.log([...combined()]); // ['a', 'b', 'c', 1, 2, 3]

// ============================================================================
// 8. GENERIC ITERATORS
// ============================================================================

// TypeScript: Generic iterator utilities
function mapIterator<T, U>(
  iterator: Iterator<T>,
  mapper: (item: T, index: number) => U
): Iterator<U> {
  let index = 0;

  return {
    next(): IteratorResult<U> {
      const result = iterator.next();
      if (result.done) {
        return { done: true, value: undefined };
      }
      return {
        done: false,
        value: mapper(result.value, index++),
      };
    },
  };
}

function filterIterator<T>(
  iterator: Iterator<T>,
  predicate: (item: T) => boolean
): Iterator<T> {
  return {
    next(): IteratorResult<T> {
      while (true) {
        const result = iterator.next();
        if (result.done) {
          return { done: true, value: undefined };
        }
        if (predicate(result.value)) {
          return result;
        }
      }
    },
  };
}

console.log("\n=== Generic Iterators ===");
const numIterator = [1, 2, 3, 4, 5][Symbol.iterator]();
const doubled = mapIterator(numIterator, n => n * 2);
console.log(
  Array.from({ length: 5 }, () => doubled.next())
    .filter(r => !r.done)
    .map(r => r.value!)
);

// ============================================================================
// 9. CUSTOM ITERATOR STATE MACHINE
// ============================================================================

// TypeScript: Typed state machine iterator
type TreeState = "enter" | "process" | "exit";

interface TreeNode {
  value: string;
  children: TreeNode[];
}

class TreeIterator implements Iterator<[TreeState, TreeNode]> {
  private stack: Array<{ node: TreeNode; state: TreeState; index: number }> =
    [];

  constructor(root: TreeNode) {
    this.stack.push({ node: root, state: "enter", index: 0 });
  }

  next(): IteratorResult<[TreeState, TreeNode]> {
    while (this.stack.length > 0) {
      const frame = this.stack[this.stack.length - 1];

      if (frame.state === "enter") {
        frame.state = "process";
        return { done: false, value: ["enter", frame.node] };
      }

      if (frame.index < frame.node.children.length) {
        const child = frame.node.children[frame.index++];
        this.stack.push({ node: child, state: "enter", index: 0 });
        continue;
      }

      this.stack.pop();
      return { done: false, value: ["exit", frame.node] };
    }

    return { done: true, value: undefined };
  }
}

console.log("\n=== Custom Iterator State Machine ===");

// ============================================================================
// 10. ASYNC ITERABLE UTILITIES
// ============================================================================

// TypeScript: Async iterable utility functions
async function collectAsync<T>(asyncIterable: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const item of asyncIterable) {
    result.push(item);
  }
  return result;
}

async function* filterAsync<T>(
  asyncIterable: AsyncIterable<T>,
  predicate: (item: T) => boolean | Promise<boolean>
): AsyncGenerator<T> {
  for await (const item of asyncIterable) {
    if (await predicate(item)) {
      yield item;
    }
  }
}

async function* mapAsync<T, U>(
  asyncIterable: AsyncIterable<T>,
  mapper: (item: T) => U | Promise<U>
): AsyncGenerator<U> {
  for await (const item of asyncIterable) {
    yield await mapper(item);
  }
}

console.log("\n=== Async Iterable Utilities ===");
(async () => {
  const asyncRange = new AsyncRange(1, 5, 10);
  const collected = await collectAsync(asyncRange);
  console.log(collected);
})();

// ============================================================================
// 11. TYPE INFERENCE FOR GENERATORS
// ============================================================================

// TypeScript can often infer generator types
function* simpleRange(start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
  // Inferred: Generator<number, void, unknown>
}

function* take<T>(iterator: Iterator<T>, n: number): Generator<T> {
  let count = 0;
  while (count < n) {
    const result = iterator.next();
    if (result.done) break;
    yield result.value;
    count++;
  }
}

console.log("\n=== Type Inference for Generators ===");
const taken = take([1, 2, 3, 4, 5][Symbol.iterator](), 3);
console.log(
  Array.from({ length: 3 }, () => taken.next())
    .filter(r => !r.done)
    .map(r => r.value!)
);

// ============================================================================
// 12. COMPARISON TABLE
// ============================================================================

console.log("\n=== JavaScript vs TypeScript: Iterators & Generators ===");
console.log(`
┌────────────────────────────┬─────────────────┬─────────────────┐
│ Feature                    │   JavaScript    │   TypeScript    │
├────────────────────────────┼─────────────────┼─────────────────┤
│ Iterator<T> interface      │       ✗         │       ✓         │
│ Generator<T,R,N> type      │       ✗         │       ✓         │
│ AsyncIterator<T>           │       ✗         │       ✓         │
│ AsyncGenerator<T>          │       ✗         │       ✓         │
│ Iterable<T> interface      │       ✗         │       ✓         │
│ Symbol.iterator typing     │       ✗         │       ✓         │
│ IteratorResult types       │  Runtime only   │  Typed         │
│ Type inference             │       ✗         │       ✓         │
│ Runtime behavior           │    Same         │    Same         │
│ Generator mechanics        │    Same         │    Same         │
└────────────────────────────┴─────────────────┴─────────────────┘

KEY TAKEAWAYS:
1. TypeScript provides full iterator type hierarchy
2. Generator types track yield/return/next types
3. Async iterators have complete type support
4. Iterable interface enables for...of typing
5. Runtime iterator behavior follows JavaScript rules
`);

console.log(
  "=== TypeScript provides type safety without changing runtime behavior ==="
);
