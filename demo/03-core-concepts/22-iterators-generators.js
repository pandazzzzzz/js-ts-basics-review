// ============================================================================
// ITERATORS AND GENERATORS - COMPREHENSIVE GUIDE
// ============================================================================

// ============================================================================
// 1. ITERATOR PROTOCOL
// ============================================================================
/**
 * Iterator Protocol - Standard for defining iterable objects (ES6)
 *
 * Iterator Requirements:
 * - Object with next() method
 * - next() returns { value, done }
 * - value: Current value
 * - done: Boolean, true when finished
 *
 * Iterable Protocol:
 * - Object with Symbol.iterator method
 * - Symbol.iterator returns an iterator
 * - Enables for...of loop
 *
 * Built-in Iterables:
 * - Array, String, Map, Set
 * - Arguments, TypedArray
 * - NodeList (DOM)
 *
 * Common Pitfalls:
 * - Forgetting to return { value, done }
 * - Not implementing Symbol.iterator
 * - Iterator is single-use
 */

console.log("=== 1. Iterator Protocol Demo ===");

// 1.1 Manual iterator
let manualIterator = {
  current: 0,
  last: 5,

  next() {
    if (this.current <= this.last) {
      return { value: this.current++, done: false };
    }
    return { done: true };
  }
};

console.log("Manual iterator:");
console.log(manualIterator.next()); // { value: 0, done: false }
console.log(manualIterator.next()); // { value: 1, done: false }

// 1.2 Making object iterable with Symbol.iterator
let range = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    let current = this.from;
    let last = this.to;

    let iterator = {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };

    // Make iterator iterable (return itself)
    iterator[Symbol.iterator] = () => iterator;

    return iterator;
  }
};

console.log("\nIterable with for...of:");
for (let num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 1.3 Iterator is single-use
console.log("\nIterator is single-use:");
let iter = range[Symbol.iterator]();
console.log("First loop:");
for (let num of iter) {
  console.log(num);
}
console.log("Second loop (empty):");
for (let num of iter) {
  console.log(num); // Nothing - iterator exhausted
}

// 1.4 Array is already iterable
let arr = [1, 2, 3];
let arrIter = arr[Symbol.iterator]();
console.log("\nArray iterator:");
console.log(arrIter.next()); // { value: 1, done: false }
console.log(arrIter.next()); // { value: 2, done: false }
console.log(arrIter.next()); // { value: 3, done: false }
console.log(arrIter.next()); // { done: true }

// 1.5 String is iterable
let str = "abc";
console.log("\nString iterator:");
for (let char of str) {
  console.log(char); // a, b, c
}

// 1.6 Custom iterable that returns new iterator each time
let reusableRange = {
  from: 1,
  to: 5,

  [Symbol.iterator]() {
    // Return new iterator each time
    return {
      current: this.from,
      last: this.to,

      next() {
        if (this.current <= this.last) {
          return { value: this.current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

console.log("\nReusable iterable:");
console.log("First loop:");
for (let num of reusableRange) console.log(num);
console.log("Second loop:");
for (let num of reusableRange) console.log(num);


// ============================================================================
// 2. CUSTOM ITERATORS
// ============================================================================
/**
 * Custom Iterators - Creating your own iteration logic
 *
 * Use Cases:
 * - Custom data structures
 * - Filtering during iteration
 * - Transforming values
 * - Infinite sequences
 *
 * Best Practices:
 * - Return new iterator for reusability
 * - Follow iterator protocol exactly
 * - Document iteration order
 *
 * Common Pitfalls:
 * - Not handling edge cases
 * - Modifying collection during iteration
 * - Forgetting done: true
 */

console.log("\n=== 2. Custom Iterators Demo ===");

// 2.1 Iterable string container
class UniqueChars {
  constructor(str) {
    this.str = str;
  }

  [Symbol.iterator]() {
    let index = 0;
    let seen = new Set();

    return {
      next: () => {
        while (index < this.str.length) {
          let char = this.str[index++];
          if (!seen.has(char)) {
            seen.add(char);
            return { value: char, done: false };
          }
        }
        return { done: true };
      }
    };
  }
}

console.log("Unique characters:");
for (let char of new UniqueChars("hello world")) {
  console.log(char); // h, e, l, o,  , w, r, d
}

// 2.2 Reverse array iterator
class ReverseIterable {
  constructor(arr) {
    this.arr = arr;
  }

  [Symbol.iterator]() {
    let index = this.arr.length - 1;

    return {
      next: () => {
        if (index >= 0) {
          return { value: this.arr[index--], done: false };
        }
        return { done: true };
      }
    };
  }
}

console.log("\nReverse iteration:");
for (let item of new ReverseIterable([1, 2, 3, 4])) {
  console.log(item); // 4, 3, 2, 1
}

// 2.3 Filtered iterator
class FilteredIterable {
  constructor(arr, predicate) {
    this.arr = arr;
    this.predicate = predicate;
  }

  [Symbol.iterator]() {
    let index = 0;

    return {
      next: () => {
        while (index < this.arr.length) {
          let value = this.arr[index++];
          if (this.predicate(value)) {
            return { value, done: false };
          }
        }
        return { done: true };
      }
    };
  }
}

console.log("\nFiltered iteration (even numbers):");
for (let num of new FilteredIterable([1, 2, 3, 4, 5, 6], n => n % 2 === 0)) {
  console.log(num); // 2, 4, 6
}

// 2.4 Infinite iterator
function createCounter(start = 0) {
  return {
    [Symbol.iterator]() {
      let count = start;
      return {
        next() {
          return { value: count++, done: false };
        }
      };
    }
  };
}

console.log("\nInfinite iterator (first 5):");
let counter = createCounter(10);
let count = 0;
for (let num of counter) {
  if (count++ >= 5) break;
  console.log(num); // 10, 11, 12, 13, 14
}


// ============================================================================
// 3. GENERATOR FUNCTIONS
// ============================================================================
/**
 * Generator Functions - Special functions that can pause/resume (ES6)
 *
 * Syntax:
 * - function* gen() { } - Generator declaration
 * - const gen = function*() { } - Generator expression
 * - const obj = { *method() { } } - Generator method
 * - yield - Pause and return value
 *
 * Characteristics:
 * - Returns Generator object
 * - Execution pauses at yield
 * - Can yield multiple times
 * - Maintains state between calls
 *
 * Common Pitfalls:
 * - yield only in generator functions
 * - Arrow functions can't be generators
 * - Generator is also an iterator
 */

console.log("\n=== 3. Generator Functions Demo ===");

// 3.1 Basic generator
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

console.log("Basic generator:");
let gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { done: true }

// 3.2 Generator with for...of
console.log("\nGenerator with for...of:");
for (let value of simpleGenerator()) {
  console.log(value); // 1, 2, 3
}

// 3.3 Generator with spread operator
console.log("\nGenerator with spread:", [...simpleGenerator()]); // [1, 2, 3]

// 3.4 Generator function with parameters
function* rangeGenerator(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

console.log("\nRange generator:");
for (let num of rangeGenerator(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 3.5 Generator method in object
let obj = {
  *generatorMethod() {
    yield "a";
    yield "b";
    yield "c";
  }
};

console.log("\nGenerator method:");
for (let value of obj.generatorMethod()) {
  console.log(value); // a, b, c
}

// 3.6 Generator expression (not declaration)
const genExpr = function*() {
  yield 1;
  yield 2;
};

console.log("\nGenerator expression:");
console.log([...genExpr()]); // [1, 2]

// 3.7 Generator state is preserved
function* statefulGen() {
  let count = 0;
  while (true) {
    yield ++count;
  }
}

console.log("\nStateful generator:");
let stateGen = statefulGen();
console.log(stateGen.next().value); // 1
console.log(stateGen.next().value); // 2
console.log(stateGen.next().value); // 3


// ============================================================================
// 4. GENERATOR METHODS
// ============================================================================
/**
 * Generator Methods - next(), return(), throw()
 *
 * next(value):
 * - Resumes execution
 * - Optional value becomes yield expression result
 * - Returns { value, done }
 *
 * return(value):
 * - Terminates generator
 * - Returns { value, done: true }
 * - finally block executes
 *
 * throw(error):
 * - Throws error at yield point
 * - Can be caught inside generator
 * - Terminates if not caught
 *
 * Common Pitfalls:
 * - next() value goes to yield, not parameter
 * - throw() can terminate generator
 * - return() ends iteration
 */

console.log("\n=== 4. Generator Methods Demo ===");

// 4.1 next() with value
function* bidirectionalGenerator() {
  let result = yield 1;
  console.log("Received:", result);
  result = yield 2;
  console.log("Received again:", result);
  yield 3;
}

console.log("next() with value:");
let biGen = bidirectionalGenerator();
console.log(biGen.next().value); // 1
console.log(biGen.next("hello").value); // Logs "Received: hello", returns 2
console.log(biGen.next("world").value); // Logs "Received again: world", returns 3

// 4.2 return() method
function* normalGen() {
  yield 1;
  yield 2;
  yield 3;
}

console.log("\nreturn() method:");
let retGen = normalGen();
console.log(retGen.next()); // { value: 1, done: false }
console.log(retGen.return(999)); // { value: 999, done: true }
console.log(retGen.next()); // { done: true }

// 4.3 throw() method
function* throwGen() {
  yield 1;
  yield 2;
  yield 3;
}

console.log("\nthrow() method:");
let throwGenInst = throwGen();
console.log(throwGenInst.next()); // { value: 1, done: false }
try {
  throwGenInst.throw(new Error("Oops")); // Throws error
} catch (e) {
  console.log("Caught error:", e.message);
}

// 4.4 catch inside generator
function* catchGen() {
  try {
    yield 1;
    yield 2;
  } catch (e) {
    console.log("Caught inside generator:", e.message);
    yield "recovered";
  }
  yield 3;
}

console.log("\nCatch inside generator:");
let catchGenInst = catchGen();
console.log(catchGenInst.next().value); // 1
console.log(catchGenInst.next().value); // 2
console.log(catchGenInst.throw(new Error("test")).value); // "recovered"
console.log(catchGenInst.next().value); // 3


// ============================================================================
// 5. YIELD* DELEGATION
// ============================================================================
/**
 * yield* - Delegate to Another Iterable (ES6)
 *
 * Syntax:
 * - yield* iterable
 * - Delegates iteration to another iterable
 * - Returns the return value of delegated generator
 *
 * Use Cases:
 * - Composing generators
 * - Reusing generator logic
 * - Tree/graph traversal
 *
 * Common Pitfalls:
 * - yield* returns generator's return value
 * - Works with any iterable, not just generators
 * - Different from yield
 */

console.log("\n=== 5. yield* Delegation Demo ===");

// 5.1 Basic yield*
function* letters() {
  yield "a";
  yield "b";
  yield "c";
}

function* combined() {
  yield 1;
  yield* letters();
  yield 2;
}

console.log("yield* basic:");
console.log([...combined()]); // [1, 'a', 'b', 'c', 2]

// 5.2 yield* with string (any iterable)
function* withString() {
  yield* "hello";
}

console.log("\nyield* with string:");
console.log([...withString()]); // ['h', 'e', 'l', 'l', 'o']

// 5.3 yield* with array
function* withArray() {
  yield* [1, 2, 3];
}

console.log("\nyield* with array:");
console.log([...withArray()]); // [1, 2, 3]

// 5.4 yield* with return value
function* inner() {
  yield 1;
  yield 2;
  return "done";
}

function* outer() {
  let result = yield* inner();
  console.log("Inner returned:", result);
  yield 3;
}

console.log("\nyield* with return value:");
for (let value of outer()) {
  console.log(value); // 1, 2, logs "Inner returned: done", 3
}

// 5.5 yield* for tree traversal
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }

  addChild(node) {
    this.children.push(node);
    return node;
  }

  *traverse() {
    yield this.value;
    for (let child of this.children) {
      yield* child.traverse();
    }
  }
}

let root = new TreeNode("A");
let child1 = root.addChild(new TreeNode("B"));
let child2 = root.addChild(new TreeNode("C"));
child1.addChild(new TreeNode("D"));
child1.addChild(new TreeNode("E"));

console.log("\nTree traversal:");
console.log([...root.traverse()]); // ['A', 'B', 'D', 'E', 'C']


// ============================================================================
// 6. PRACTICAL USE CASES
// ============================================================================
/**
 * Generator Practical Use Cases
 *
 * Common Patterns:
 * - Infinite sequences
 * - Lazy evaluation
 * - State machines
 * - Data streaming
 * - Pagination
 *
 * Benefits:
 * - Memory efficient
 * - Lazy computation
 * - Clean async code
 *
 * Common Pitfalls:
 * - Not all iterables need generators
 * - Debugging can be tricky
 * - State management complexity
 */

console.log("\n=== 6. Practical Use Cases Demo ===");

// 6.1 Fibonacci sequence (infinite)
function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

console.log("Fibonacci (first 10):");
let fib = fibonacci();
let fibResult = [];
for (let i = 0; i < 10; i++) {
  fibResult.push(fib.next().value);
}
console.log(fibResult); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// 6.2 Lazy evaluation (compute only when needed)
function* lazySquares(arr) {
  for (let item of arr) {
    console.log(`Computing square of ${item}`);
    yield item * item;
  }
}

console.log("\nLazy evaluation:");
let lazy = lazySquares([1, 2, 3, 4, 5]);
console.log("Iterator created (no computation yet)");
console.log("First value:", lazy.next().value); // Only computes first
console.log("Second value:", lazy.next().value); // Computes second

// 6.3 State machine
function* lightSwitch() {
  let state = "off";
  while (true) {
    if (state === "off") {
      state = "on";
      yield "turning on";
    } else {
      state = "off";
      yield "turning off";
    }
  }
}

console.log("\nState machine:");
let light = lightSwitch();
console.log(light.next().value); // "turning on"
console.log(light.next().value); // "turning off"
console.log(light.next().value); // "turning on"

// 6.4 Paginated data fetcher (simulation)
function* paginate(data, pageSize) {
  for (let i = 0; i < data.length; i += pageSize) {
    yield data.slice(i, i + pageSize);
  }
}

console.log("\nPagination:");
let allData = Array.from({ length: 15 }, (_, i) => i + 1);
for (let page of paginate(allData, 5)) {
  console.log("Page:", page);
}

// 6.5 ID generator
function* idGenerator(prefix = "id") {
  let id = 0;
  while (true) {
    yield `${prefix}-${++id}`;
  }
}

console.log("\nID generator:");
let ids = idGenerator("user");
console.log(ids.next().value); // user-1
console.log(ids.next().value); // user-2
console.log(ids.next().value); // user-3


// ============================================================================
// 7. ASYNC ITERATORS
// ============================================================================
/**
 * Async Iterators - For asynchronous data sources (ES2018)
 *
 * Async Iterator Protocol:
 * - [Symbol.asyncIterator]() method
 * - Returns iterator with async next()
 * - next() returns Promise<{ value, done }>
 *
 * Async Generator:
 * - async function* gen() { }
 * - yield await promise
 * - for await...of consumption
 *
 * Use Cases:
 * - Reading streams
 * - Fetching paginated API data
 * - File reading
 * - Database queries
 *
 * Common Pitfalls:
 * - Requires ES2018+
 * - Only works in async functions
 * - Error handling is async
 */

console.log("\n=== 7. Async Iterators Demo ===");

// 7.1 Async iterator (manual implementation)
let asyncRange = {
  from: 1,
  to: 5,

  [Symbol.asyncIterator]() {
    return {
      current: this.from,
      last: this.to,

      async next() {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 10));

        if (this.current <= this.last) {
          return { value: this.current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

console.log("Async iterator with for await...of:");
(async () => {
  for await (let num of asyncRange) {
    console.log(num); // 1, 2, 3, 4, 5
  }
})();

// 7.2 Async generator
async function* asyncGen() {
  for (let i = 1; i <= 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 10));
    yield i;
  }
}

console.log("\nAsync generator:");
(async () => {
  for await (let num of asyncGen()) {
    console.log(num); // 1, 2, 3
  }
})();

// 7.3 Async generator for data fetching
async function* fetchData(urls) {
  for (let url of urls) {
    // Simulate fetch
    await new Promise(resolve => setTimeout(resolve, 10));
    yield `Data from ${url}`;
  }
}

console.log("\nAsync data fetching:");
(async () => {
  const urls = ["url1", "url2", "url3"];
  for await (let data of fetchData(urls)) {
    console.log(data);
  }
})();

// 7.4 Collect all async values
async function collectAsync(asyncIterable) {
  let result = [];
  for await (let item of asyncIterable) {
    result.push(item);
  }
  return result;
}

console.log("\nCollect async values:");
(async () => {
  let collected = await collectAsync(asyncGen());
  console.log(collected); // [1, 2, 3]
})();


// ============================================================================
// 8. COMMON PATTERNS
// ============================================================================
/**
 * Common Iterator/Generator Patterns
 *
 * Patterns:
 * 1. Infinite sequences
 * 2. Lazy evaluation
 * 3. Data transformation pipeline
 * 4. Coroutine-like behavior
 * 5. Backpressure handling
 *
 * Best Practices:
 * - Use generators for stateful iteration
 * - Use async for I/O operations
 * - Keep generators focused
 * - Document yield values
 */

console.log("\n=== 8. Common Patterns Demo ===");

// 8.1 Data transformation pipeline
function* map(iterable, fn) {
  for (let item of iterable) {
    yield fn(item);
  }
}

function* filter(iterable, predicate) {
  for (let item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* take(iterable, n) {
  let count = 0;
  for (let item of iterable) {
    if (count++ >= n) break;
    yield item;
  }
}

console.log("Pipeline (take 3 of even squares):");
let pipeline = take(
  filter(
    map([1, 2, 3, 4, 5, 6, 7, 8], x => x * x),
    x => x % 2 === 0
  ),
  3
);
console.log([...pipeline]); // [4, 16, 36]

// 8.2 Zip multiple iterables
function* zip(...iterables) {
  const iterators = iterables.map(i => i[Symbol.iterator]());

  while (true) {
    const results = iterators.map(it => it.next());
    if (results.some(r => r.done)) break;
    yield results.map(r => r.value);
  }
}

console.log("\nZip:");
for (let [a, b] of zip([1, 2, 3], ["a", "b", "c"])) {
  console.log(a, b); // 1 a, 2 b, 3 c
}

// 8.3 Chain iterables
function* chain(...iterables) {
  for (let iterable of iterables) {
    yield* iterable;
  }
}

console.log("\nChain:");
console.log([...chain([1, 2], [3, 4], [5, 6])]); // [1, 2, 3, 4, 5, 6]


// ============================================================================
// 9. COMMON PITFALLS
// ============================================================================
console.log("\n=== 9. Common Pitfalls Demo ===");

// 9.1 Generator is single-use
function* singleGen() {
  yield 1;
  yield 2;
}

let sg = singleGen();
console.log("First consumption:", [...sg]); // [1, 2]
console.log("Second consumption:", [...sg]); // [] - empty!

// 9.2 Arrow functions can't be generators
// const badGen = () => { yield 1; }; // SyntaxError!

// 9.3 yield only in generator
function notGenerator() {
  // yield 1; // SyntaxError!
  console.log("Can't use yield in regular function");
}

// 9.4 next() value goes to yield, not parameter
function* paramGen(x) {
  console.log("Parameter x:", x);
  let received = yield x;
  console.log("Received:", received);
}

console.log("\nnext() value to yield:");
let pg = paramGen(10);
pg.next(); // Parameter x: 10
pg.next(20); // Received: 20

// 9.5 Generator return in finally
function* finallyGen() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("Cleanup!");
    return "cleaned";
  }
}

console.log("\nReturn in finally:");
let fg = finallyGen();
console.log(fg.next()); // { value: 1, done: false }
console.log(fg.return()); // Logs "Cleanup!", { value: "cleaned", done: true }


// ============================================================================
// 9b. ITERATOR HELPERS (ES2025)
// ============================================================================
/**
 * Iterator Helpers (ES2025) - Functional-style methods on iterators
 *
 * Before ES2025, iterators had no built-in transformation methods.
 * You had to convert to array (consuming the iterator) to use map/filter/etc.
 *
 * ES2025 adds Iterator.prototype methods:
 * - .map(fn)        — Transform each value
 * - .filter(fn)     — Keep only matching values
 * - .take(n)        — Take first n values
 * - .drop(n)        — Skip first n values
 * - .flatMap(fn)    — Map and flatten
 * - .reduce(fn, initial) — Reduce values
 * - .toArray()      — Convert to array
 * - .forEach(fn)    — Execute for each value
 * - .some(fn)       — Check if any value matches
 * - .every(fn)      — Check if all values match
 * - .find(fn)       — Find first matching value
 *
 * Also adds Iterator.from(iterable) static method to get an Iterator from any iterable.
 */

console.log("\n=== 9b. Iterator Helpers (ES2025) ===");

// Iterator.from() — Get an Iterator from any iterable
console.log("\nIterator.from():");
const fromIter = Iterator.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
console.log("Iterator.from([1..10]).next():", fromIter.next()); // { value: 1, done: false }

// Simulating iterator helpers for environments that don't yet support them
// (These show the equivalent behavior using generator functions)
function* mapIterator(iterator, fn) {
  for (const value of iterator) {
    yield fn(value);
  }
}

function* filterIterator(iterator, fn) {
  for (const value of iterator) {
    if (fn(value)) yield value;
  }
}

function* takeIterator(iterator, n) {
  let count = 0;
  for (const value of iterator) {
    if (count++ >= n) break;
    yield value;
  }
}

function* dropIterator(iterator, n) {
  let count = 0;
  for (const value of iterator) {
    if (count++ < n) continue;
    yield value;
  }
}

// map — Transform values
const numbers_iter = [1, 2, 3, 4, 5];
console.log("\nmap — double each value:");
const doubled = mapIterator(numbers_iter[Symbol.iterator](), x => x * 2);
console.log([...doubled]); // [2, 4, 6, 8, 10]

// filter — Keep even numbers
console.log("\nfilter — keep even numbers:");
const evens = filterIterator([1, 2, 3, 4, 5, 6][Symbol.iterator](), x => x % 2 === 0);
console.log([...evens]); // [2, 4, 6]

// take — First 3 values
console.log("\ntake — first 3 values:");
const first3 = takeIterator([10, 20, 30, 40, 50][Symbol.iterator](), 3);
console.log([...first3]); // [10, 20, 30]

// drop — Skip first 3 values
console.log("\ndrop — skip first 3 values:");
const after3 = dropIterator([10, 20, 30, 40, 50][Symbol.iterator](), 3);
console.log([...after3]); // [40, 50]

// Chaining operations — the power of iterator helpers
console.log("\nChaining: take → filter → map:");
const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// Take first 8 → filter even → double
let chainResult = takeIterator(source[Symbol.iterator](), 8);
chainResult = filterIterator(chainResult, x => x % 2 === 0);
chainResult = mapIterator(chainResult, x => x * 2);
console.log([...chainResult]); // [4, 8, 12, 16]

// With native support (ES2025+), the same would be:
// Iterator.from([1..10]).take(8).filter(x => x%2===0).map(x => x*2).toArray()

// Iterator.from() with other iterables
console.log("\nIterator.from() with Set:");
const set = new Set(["a", "b", "c"]);
const setIter = Iterator.from(set);
console.log(setIter.next()); // { value: 'a', done: false }

console.log("\nIterator.from() with Map:");
const sampleMap = new Map([["x", 1], ["y", 2]]);
const mapIter2 = Iterator.from(sampleMap);
console.log(mapIter2.next()); // { value: ['x', 1], done: false }

// 9b.1 Native Iterator Helper chaining (ES2025)
/*
 * verification:
 *   feature: Iterator helpers
 *   status: ES2025
 *   stage4Date: 2024-10
 *   lastVerified: 2026-06-19
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
// The generator-based helpers above emulate the API. ES2025 ships the real
// methods on Iterator.prototype. Each method returns a new lazy Iterator, so
// the chain is NOT evaluated until a terminal step (.toArray(), .forEach(),
// .reduce(), etc.) pulls values — nothing runs eagerly.

console.log("\n=== 9b.1 Native Iterator Helper Chaining (ES2025) ===");

if (Iterator.prototype && typeof Iterator.prototype.map === "function") {
  // Same pipeline the generators emulated: double → keep >4 → take 2 → array
  const nativeChain = Iterator.from([1, 2, 3, 4, 5])
    .map(x => x * 2)      // [2, 4, 6, 8, 10]
    .filter(x => x > 4)   // [6, 8, 10]
    .take(2)              // [6, 8]   (lazy: stops pulling after 2 values)
    .toArray();           // terminal — materializes [6, 8]
  console.log("native chain result:", nativeChain); // [6, 8]

  // Laziness proof: a side-effect in map only runs for values actually pulled.
  // take(1) means map never even sees the 3rd value onward.
  let mapCalls = 0;
  const lazy = Iterator.from([10, 20, 30, 40])
    .map(x => { mapCalls++; return x; })
    .take(1)
    .toArray();
  console.log("lazy take(1) result:", lazy, "| map invoked", mapCalls, "time(s)"); // [10] | 1

  // drop + reduce (a non-array terminal)
  const sum = Iterator.from([1, 2, 3, 4, 5])
    .drop(2)              // [3, 4, 5]
    .reduce((acc, x) => acc + x, 0);
  console.log("drop(2).reduce sum:", sum); // 12

  // Direct lazy use: an infinite-style iterator without materializing a giant array
  const firstBigEven = Iterator.from([1, 3, 5, 8, 11, 14])
    .filter(x => x % 2 === 0)
    .find(x => x > 10);
  console.log("first even > 10:", firstBigEven); // 14
} else {
  console.log("Native Iterator helpers not supported in this runtime (needs Node 22+ / ES2025)");
  console.log("Expected: Iterator.from([1,2,3,4,5]).map(x=>x*2).filter(x=>x>4).take(2).toArray() -> [6,8]");
}


// ============================================================================
// 10. TYPESCRIPT TYPES
// ============================================================================
/**
 * TypeScript Iterator/Generator Types
 *
 * Types:
 * - Iterator<T> - Iterator interface
 * - Iterable<T> - Iterable interface
 * - Generator<T, TReturn, TNext> - Generator interface
 * - AsyncIterator<T> - Async iterator interface
 * - AsyncIterable<T> - Async iterable interface
 *
 * Type Annotations:
 * - function* gen(): Generator<number>
 * - async function* gen(): AsyncGenerator<number>
 *
 * Common Pitfalls:
 * - Generic type parameters order
 * - Return type vs yielded type
 */

console.log("\n=== 10. TypeScript Types Demo ===");

// In TypeScript:
// function* numbers(): Generator<number, void, unknown> {
//   yield 1;
//   yield 2;
// }

// async function* asyncNumbers(): AsyncGenerator<number, void, unknown> {
//   yield 1;
//   yield 2;
// }

// interface CustomIterable<T> extends Iterable<T> {
//   [Symbol.iterator](): Iterator<T>;
// }

console.log("TypeScript provides built-in types for iterators and generators");
console.log("See TypeScript documentation for full type definitions");

console.log("\n=== Iterators and Generators Demo Complete ===");


// ============================================================================
// SUMMARY
// ============================================================================
/**
 * Iterators and Generators Summary
 *
 * Key Concepts:
 * 1. Iterator protocol: next() returns { value, done }
 * 2. Iterable protocol: Symbol.iterator returns iterator
 * 3. Generator functions: function* with yield
 * 4. Generator methods: next(), return(), throw()
 * 5. yield* delegation
 * 6. Async iterators: Symbol.asyncIterator
 * 7. for await...of for async iteration
 *
 * When to Use:
 * - Custom iteration logic
 * - Lazy evaluation
 * - Infinite sequences
 * - Async data streams
 *
 * When to Avoid:
 * - Simple array iteration (use for...of)
 * - When Array methods suffice (map, filter)
 * - Unnecessary complexity
 */


// ============================================================================
// TypeScript Comparison Notes
// ============================================================================
/*
🔍 Key Differences in TypeScript:

1. ITERATOR TYPE
   JS:  let iter = obj[Symbol.iterator]();
   TS:  let iter: Iterator<number> = obj[Symbol.iterator]();

2. GENERATOR TYPE
   JS:  function* gen() { yield 1; }
   TS:  function* gen(): Generator<number, void, unknown> { yield 1; }
   TS:  Generator<T, TReturn, TNext>

3. ASYNC ITERATOR TYPE
   JS:  async function* gen() { yield 1; }
   TS:  async function* gen(): AsyncGenerator<number, void, unknown>

4. ITERABLE TYPE
   TS:  interface CustomIterable<T> extends Iterable<T>
   TS:  function process<T>(iter: Iterable<T>): void

5. TYPE INFERENCE
   TS:  TypeScript can often infer iterator types

   TypeScript example:
   function* range(start: number, end: number) {
     for (let i = start; i <= end; i++) {
       yield i;
     }
   }
   // Inferred: Generator<number, void, unknown>

📘 See related: 19-symbol-deep.js (Symbol.iterator)
📘 See related: 04-asynchronous/ for async patterns
*/
// ============================================================================
// CROSS-REFERENCES
// ============================================================================
console.log(`
📘 See related files for additional patterns:

Iterators & Generators:
- 26-optimization-performance.js (lazy evaluation with generators)
- 27-memory-management.js (large data handling with generators)
`);
