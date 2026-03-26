// JSON - Complete Demo
// 📘 For TypeScript comparison, see: 11-json-ts-comparison.ts
// 📘 javascript.info: "JSON methods, toJSON"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
// 📘 RFC 8259: The JavaScript Object Notation (JSON) Data Interchange Format
// 📌 ES5 (ES2009) Standardized

// ============================================
// Section 1: JSON.stringify() Basics
// ============================================

// JSON.stringify() - Convert JavaScript values to JSON strings
// - Used for data serialization, network transmission, storage
console.log("JSON.stringify() Basics:");

// Basic object serialization
const user = {
  name: "Alice",
  age: 30,
  isAdmin: false,
  hobbies: ["reading", "coding", "gaming"],
  address: {
    city: "New York",
    zip: "10001"
  },
  spouse: null
};

const jsonString = JSON.stringify(user);
console.log("  Original object:", user);
console.log("  JSON string:", jsonString);
console.log("  Type:", typeof jsonString); // "string"

// Array serialization
const arr = [1, 2, "three", { four: 4 }, null, true];
console.log("\n  Array serialization:", JSON.stringify(arr)); // [1,2,"three",{"four":4},null,true]

// Primitive type serialization
console.log("\n  Primitives:");
console.log("    String:", JSON.stringify("hello")); // "hello" (with quotes)
console.log("    Number:", JSON.stringify(42)); // 42
console.log("    Boolean:", JSON.stringify(true)); // true
console.log("    null:", JSON.stringify(null)); // null

// ============================================
// Section 2: JSON.parse() Basics
// ============================================

// JSON.parse() - Convert JSON strings back to JavaScript objects
console.log("\nJSON.parse() Basics:");

const parsed = JSON.parse(jsonString);
console.log("  Parsed result:", parsed);
console.log("  Type:", typeof parsed); // "object"
console.log("  Is new object:", parsed !== user); // true (deep copy)

// Parsing nested JSON
const nestedJson = '{"user":{"name":"Bob","scores":[1,2,3]}}';
const nestedObj = JSON.parse(nestedJson);
console.log("\n  Nested JSON:", nestedObj.user.name, nestedObj.user.scores); // Bob, [1,2,3]

// ============================================
// Section 3: stringify Options - space Parameter
// ============================================

// space parameter - Formatted output (pretty-print JSON)
console.log("\nFormatted Output (space parameter):");

// Numeric spaces (max 10)
const pretty2 = JSON.stringify(user, null, 2);
console.log("  2-space indent:");
console.log(pretty2.split("\n").slice(0, 5).join("\n  ") + "\n  ...");

// String indent (custom)
const prettyTab = JSON.stringify({ a: 1, b: 2 }, null, "\t");
console.log("\n  Tab indent:");
console.log("  " + prettyTab.replace("\n", "\n  "));

// Practical use case: logging output
function logObject(obj, label = "Object") {
  console.log(`\n  === ${label} ===`);
  console.log(JSON.stringify(obj, null, 2));
}
logObject({ status: "success", data: { id: 1, value: "test" } }, "API Response");

// ============================================
// Section 4: stringify Options - replacer Function
// ============================================

// replacer parameter - Filter and transform values to serialize
console.log("\nreplacer Function:");

// Array replacer - Whitelist (serialize only specified properties)
const whitelist = JSON.stringify(user, ["name", "age"], 2);
console.log("  Whitelist (name, age):");
console.log("  " + whitelist);

// Function replacer - Custom transformation
const objWithPrivate = {
  name: "Charlie",
  password: "secret123",
  apiKey: "sk-xxx",
  email: "charlie@example.com"
};

function replacer(key, value) {
  // Filter sensitive fields
  if (key === "password" || key === "apiKey") {
    return "***REDACTED***";
  }
  return value;
}

const sanitized = JSON.stringify(objWithPrivate, replacer, 2);
console.log("\n  Filter Sensitive Fields:");
console.log("  " + sanitized.replace(/\n/g, "\n  "));

// Type conversion replacer
const mixedObj = {
  date: new Date("2024-01-15"),
  regex: /test/g,
  func: function() { return 42; }
};

function typeReplacer(key, value) {
  if (value instanceof Date) {
    return { __type: "Date", value: value.toISOString() };
  }
  if (value instanceof RegExp) {
    return { __type: "RegExp", source: value.source, flags: value.flags };
  }
  if (typeof value === "function") {
    return { __type: "Function", toString: value.toString() };
  }
  return value;
}

const typed = JSON.stringify(mixedObj, typeReplacer, 2);
console.log("\n  Type Conversion:");
console.log("  " + typed.replace(/\n/g, "\n  "));

// ============================================
// Section 5: parse reviver Function
// ============================================

// reviver function - Transform values during parsing
console.log("\nparse reviver Function:");

// Restore Date objects
const dateJson = '{"title":"Meeting","date":"2024-06-15T10:00:00.000Z"}';

const meetup = JSON.parse(dateJson, function(key, value) {
  if (key === "date") {
    return new Date(value);
  }
  return value;
});

console.log("  Restore Date:");
console.log("    meetup.date:", meetup.date); // Date object
console.log("    getDate():", meetup.date.getDate()); // 15
console.log("    instanceof Date:", meetup.date instanceof Date); // true

// Restore nested Dates
const scheduleJson = `{
  "meetups": [
    {"title":"Tech Talk","date":"2024-06-15T10:00:00.000Z"},
    {"title":"Dinner","date":"2024-06-15T18:00:00.000Z"}
  ]
}`;

const schedule = JSON.parse(scheduleJson, function(key, value) {
  if (key === "date") {
    return new Date(value);
  }
  return value;
});

console.log("\n  Nested Date Restoration:");
console.log("    First event:", schedule.meetups[0].title);
console.log("    Date:", schedule.meetups[0].date.toDateString());

// Generic reviver - Restore type-tagged values
function genericReviver(key, value) {
  if (value && typeof value === "object" && value.__type) {
    switch (value.__type) {
      case "Date":
        return new Date(value.value);
      case "RegExp":
        return new RegExp(value.source, value.flags);
      case "Set":
        return new Set(value.values);
      case "Map":
        return new Map(value.entries);
      default:
        return value;
    }
  }
  return value;
}

const complexJson = JSON.stringify({
  created: { __type: "Date", value: "2024-01-15T10:00:00.000Z" },
  pattern: { __type: "RegExp", source: "test", flags: "g" },
  tags: { __type: "Set", values: ["a", "b", "c"] }
}, null, 2);

console.log("\n  Generic reviver parsing:");
const restored = JSON.parse(complexJson, genericReviver);
console.log("    created:", restored.created.toDateString());
console.log("    pattern:", restored.pattern);
console.log("    tags:", restored.tags);

// ============================================
// Section 6: Special Value Handling
// ============================================

// Values not supported by JSON are omitted or converted
console.log("\nSpecial Value Handling:");

// BigInt needs custom toJSON to serialize
if (typeof BigInt.prototype.toJSON === "undefined") {
  BigInt.prototype.toJSON = function() {
    return { __type: "BigInt", value: this.toString() };
  };
}

const specialObj = {
  a: undefined,
  b: function() { return 42; },
  c: Symbol("test"),
  d: null,
  e: "normal",
  f: 123n
};

console.log("  Original object:", specialObj);
console.log("  After stringify:", JSON.stringify(specialObj));
console.log("  Note: undefined, function, symbol omitted, BigInt needs toJSON");

// Special values in arrays
const specialArr = [1, undefined, function() {}, null, "test", Symbol("s")];
console.log("\n  Special Values in Array:");
console.log("  Original:", specialArr);
console.log("  stringify:", JSON.stringify(specialArr));
console.log("  Note: undefined/function/symbol in array become null");

// toJSON method - Custom serialization
const customObj = {
  name: "Custom",
  value: 42,
  toJSON() {
    return { name: this.name, serialized: true };
  }
};

console.log("\n  toJSON Custom Serialization:");
console.log("  ", JSON.stringify(customObj)); // {"name":"Custom","serialized":true}

// Date built-in toJSON
console.log("\n  Date.toJSON():");
console.log("  ", JSON.stringify(new Date("2024-06-15T10:00:00Z")));

// ============================================
// Section 7: Date Serialization Patterns
// ============================================

console.log("\nDate Serialization Patterns:");

// Pattern 1: ISO string (recommended)
const event = {
  title: "Meeting",
  date: new Date("2024-06-15T10:00:00Z")
};
const eventJson = JSON.stringify(event);
console.log("  ISO String:", eventJson);

// Restore during parsing
const parsedEvent = JSON.parse(eventJson, (k, v) => {
  if (k === "date" && typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
    return new Date(v);
  }
  return v;
});
console.log("  After restoration date type:", parsedEvent.date instanceof Date);

// Pattern 2: Timestamp
const timestampObj = {
  title: "Event",
  timestamp: Date.now()
};
console.log("\n  Timestamp:", JSON.stringify(timestampObj));

// Pattern 3: Type-tagged (for complex scenarios)
const taggedDate = {
  __type: "Date",
  iso: new Date().toISOString()
};
console.log("\n  Type-tagged:", JSON.stringify(taggedDate));

// ============================================
// Section 8: Common Pitfalls
// ============================================

console.log("\nCommon Pitfalls:");

// Pitfall 1: Circular references
const circular = { name: "Circular" };
circular.self = circular;

console.log("  Pitfall 1 - Circular Reference:");
try {
  JSON.stringify(circular);
} catch (e) {
  console.log("    Error:", e.name, "-", e.message.slice(0, 50));
}

// Solution: Use replacer to handle circular references
function safeStringify(obj, indent = 2) {
  let cache = new Set();
  const val = JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (cache.has(value)) {
        return "[Circular]";
      }
      cache.add(value);
    }
    return value;
  }, indent);
  cache = null;
  return val;
}

console.log("  Safe serialization:", safeStringify(circular));

// Pitfall 2: Method loss
class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

const person = new Person("Alice");
const personJson = JSON.stringify(person);
const parsedPerson = JSON.parse(personJson);

console.log("\n  Pitfall 2 - Method Loss:");
console.log("    Original:", person.greet());
console.log("    After parse:", typeof parsedPerson.greet); // undefined
console.log("    Note: Prototype chain methods lost during serialization");

// Pitfall 3: undefined omitted
const objWithUndefined = {
  defined: "value",
  undefined: undefined
};
console.log("\n  Pitfall 3 - undefined:");
console.log("    stringify:", JSON.stringify(objWithUndefined));
console.log("    has undefined after parse:", "undefined" in JSON.parse(JSON.stringify(objWithUndefined)));

// Pitfall 4: Large number precision loss
const bigNum = {
  id: 9007199254740993n, // Exceeds Number.MAX_SAFE_INTEGER
  safe: 9007199254740991
};

console.log("\n  Pitfall 4 - Large Number Precision:");
console.log("    BigInt stringify:", JSON.stringify(bigNum));
console.log("    Safe integer:", JSON.stringify({ safe: bigNum.safe }));

// ============================================
// Section 9: Practical Use Cases
// ============================================

console.log("\nPractical Use Cases:");

// Use case 1: API communication
const apiRequest = {
  method: "POST",
  endpoint: "/api/users",
  body: {
    name: "New User",
    email: "user@example.com"
  }
};

const requestJson = JSON.stringify(apiRequest);
console.log("  API Request:");
console.log("  ", requestJson);

// Simulated server response
const serverResponse = '{"status":"success","data":{"id":123,"name":"New User"}}';
const response = JSON.parse(serverResponse);
console.log("  API Response:", response.status, "- ID:", response.data.id);

// Use case 2: localStorage storage (simulated with Map in Node.js)
const storage = {
  theme: "dark",
  language: "zh-CN",
  notifications: true
};

// Node.js doesn't have localStorage, using Map to simulate
const storageMap = new Map();
storageMap.set("userSettings", JSON.stringify(storage));
const loaded = JSON.parse(storageMap.get("userSettings"));
console.log("\n  localStorage Simulation:");
console.log("    Stored:", JSON.stringify(storage));
console.log("    Loaded:", JSON.stringify(loaded));

// Use case 3: Deep copy (simple objects)
const original = {
  name: "Original",
  nested: { value: 42 },
  arr: [1, 2, 3]
};
const deepCopy = JSON.parse(JSON.stringify(original));
deepCopy.nested.value = 100;
deepCopy.arr[0] = 999;

console.log("\n  Deep Copy:");
console.log("    original:", JSON.stringify(original));
console.log("    deepCopy:", JSON.stringify(deepCopy));
console.log("    Is independent:", original.nested.value !== deepCopy.nested.value);

// Use case 4: Configuration serialization
const config = {
  version: "1.0.0",
  features: {
    darkMode: true,
    beta: false
  },
  limits: {
    maxUsers: 100,
    timeout: 30000
  }
};

const configJson = JSON.stringify(config, null, 2);
console.log("\n  Configuration Serialization:");
console.log("  " + configJson.replace(/\n/g, "\n  "));

// Use case 5: Data validation
function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

console.log("\n  JSON Validation:");
console.log("    Valid:", isValidJSON('{"a": 1}'));
console.log("    Invalid:", isValidJSON('{a: 1}')); // JSON requires double quotes

// ============================================
// Section 10: Error Handling
// ============================================

console.log("\nError Handling:");

// Invalid JSON parsing
const invalidJson = '{"name": "Alice", age: 30}'; // Missing quotes
const malformedJson = '{"name": "Bob",}'; // Trailing comma

function safeParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch (e) {
    console.log(`  Parse error: ${e.name} - ${e.message.slice(0, 30)}`);
    return fallback;
  }
}

console.log("  Invalid JSON:", safeParse(invalidJson));
console.log("  Malformed JSON:", safeParse(malformedJson));

// Safe parsing with logging
function parseWithLogging(json, source = "unknown") {
  try {
    const result = JSON.parse(json);
    console.log(`  [OK] ${source}: Parse successful`);
    return result;
  } catch (e) {
    console.log(`  [ERROR] ${source}: ${e.name} - ${e.message.slice(0, 40)}`);
    throw e;
  }
}

try {
  parseWithLogging('{"valid": true}', "Test 1");
  parseWithLogging(invalidJson, "Test 2");
} catch (e) {
  console.log("  Exception caught");
}

// ============================================
// Section 11: Performance Considerations
// ============================================

console.log("\nPerformance Considerations:");

// Large object serialization performance
const largeObj = {};
for (let i = 0; i < 1000; i++) {
  largeObj[`key${i}`] = { value: i, nested: { data: `item${i}` } };
}

const stringifyStart = performance.now();
const largeJson = JSON.stringify(largeObj);
const stringifyTime = performance.now() - stringifyStart;

const parseStart = performance.now();
JSON.parse(largeJson);
const parseTime = performance.now() - parseStart;

console.log(`  Large object (1000 items):`);
console.log(`    stringify: ${stringifyTime.toFixed(2)}ms`);
console.log(`    parse: ${parseTime.toFixed(2)}ms`);
console.log(`    JSON size: ${(largeJson.length / 1024).toFixed(2)}KB`);

// ============================================
// Section 12: ES2019 JSON Improvements
// ============================================

console.log("\nES2019 JSON Improvements:");

// 1. Well-formed JSON.stringify (ES2019)
// - Ensures output is valid UTF-8
// - Escapes lone surrogates (U+D800 to U+DFFF)
// - Previously, lone surrogates could break JSON.parse
const withLoneSurrogate = {
  loneSurrogate: "\uD800" // Lone high surrogate
};

console.log("  Well-formed JSON.stringify (ES2019):");
const jsonStringWithSurrogate = JSON.stringify(withLoneSurrogate);
console.log("    Lone surrogate escaped:", jsonStringWithSurrogate);
// Output: {"loneSurrogate":"\\ud800"} (escaped properly)

// Before ES2019, this could cause issues
// Now it's always safe to parse back
const parsedBack = JSON.parse(jsonStringWithSurrogate);
console.log("    Parsed back successfully:", parsedBack);

// 2. JSON Superset (ES2019)
// - JSON strings can now contain unescaped U+2028 (LINE SEPARATOR)
// - JSON strings can now contain unescaped U+2029 (PARAGRAPH SEPARATOR)
// - These were previously syntax errors in JS but valid in JSON
console.log("\n  JSON Superset (ES2019):");

// Before ES2019, these characters required escaping
// Now they're valid in JSON strings
const withLineSeparators = {
  message: "Hello\u2028World", // LINE SEPARATOR
  text: "Paragraph\u2029End"   // PARAGRAPH SEPARATOR
};

const jsonWithSeparators = JSON.stringify(withLineSeparators);
console.log("    JSON with line/paragraph separators:", jsonWithSeparators);

// This is now valid JavaScript
const parsedWithSeparators = JSON.parse(jsonWithSeparators);
console.log("    Parsed successfully:", parsedWithSeparators);

// 3. JSON.stringify() with Symbol keys (ES2019 behavior)
// - Symbol keys are silently ignored in JSON.stringify
const objWithSymbols = {
  [Symbol("id")]: 123,
  name: "Test"
};
console.log("\n  Symbol keys in JSON.stringify:");
console.log("    Object:", objWithSymbols);
console.log("    JSON:", JSON.stringify(objWithSymbols)); // Symbol keys ignored

// 4. JSON source text access (ES2019)
// - JSON.parse() now exposes raw source text in reviver
console.log("\n  JSON.parse reviver - source access:");
function reviverWithSource(key, value) {
  if (key === "created") {
    console.log(`    Reviver called for '${key}'`);
    // Value is already parsed, but we know the original text
    return new Date(value);
  }
  return value;
}

const jsonWithDate = '{"created":"2024-06-15T10:00:00Z"}';
const parsedDate = JSON.parse(jsonWithDate, reviverWithSource);
console.log("    Result:", parsedDate.created instanceof Date);

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. TYPE INFERENCE FROM PARSED JSON
   TS:  interface User { name: string; age: number }
   TS:  const user = JSON.parse(jsonString) as User;
   TS:  Or use type guards for runtime validation

2. TYPE GUARDS FOR JSON VALIDATION
   TS:  function isUser(obj: unknown): obj is User {
          return typeof obj === "object" && obj !== null &&
                 "name" in obj && typeof (obj as User).name === "string";
        }

3. JSON.STRINGIFY RETURN TYPE
   TS:  JSON.stringify(obj): string
   TS:  Always returns string type

4. PARTIAL SERIALIZATION
   TS:  interface Serializable {
          toJSON(): string;
        }

5. UTILITY TYPES
   TS:  type Jsonify<T> = { /* Serializable version of T *\/ }

📘 See related: 08-objects.js (objects), 27-fetch-api.js (network requests)
*/
