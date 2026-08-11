#!/usr/bin/env node
// Batch standardize TS comparison section at end of JS files
// Replaces old detailed TS comparison blocks with standard reference format
// and adds Cross-references section before it

const fs = require('fs');
const path = require('path');

// Cross-reference mapping: each file points to 2-4 related files
const crossRefs = {
  '01-variables.js': [
    ['02-operators.js', 'Operators and expressions'],
    ['03-control-flow.js', 'Control flow and conditionals'],
    ['13.1-scope-basics.js', 'Scope fundamentals'],
  ],
  '02-operators.js': [
    ['01-variables.js', 'Variables and data types'],
    ['03-control-flow.js', 'Control flow and conditionals'],
    ['18-es6-plus-syntax.js', 'ES6+ syntax features'],
  ],
  '03-control-flow.js': [
    ['01-variables.js', 'Variables and data types'],
    ['02-operators.js', 'Operators and expressions'],
    ['20-error-handling.js', 'Error handling patterns'],
  ],
  '04-strings.js': [
    ['01-variables.js', 'Variables and data types'],
    ['06.1-arrays-basics.js', 'Array basics'],
    ['21-regex.js', 'Regular expressions'],
  ],
  '05-numbers-math.js': [
    ['01-variables.js', 'Variables and data types'],
    ['02-operators.js', 'Arithmetic operators'],
    ['12-date-time.js', 'Date and time'],
  ],
  '06-arrays.js': [
    ['06.1-arrays-basics.js', 'Array basics'],
    ['06.2-arrays-iteration.js', 'Array iteration methods'],
    ['06.3-arrays-search-sort.js', 'Array search and sort'],
    ['06.4-arrays-manipulation.js', 'Array manipulation methods'],
  ],
  '07-functions.js': [
    ['07.1-functions-basics.js', 'Function basics'],
    ['07.2-functions-advanced.js', 'Advanced functions'],
    ['07.3-functions-patterns.js', 'Function patterns'],
    ['24.1-function-composition.js', 'Function composition'],
  ],
  '08-objects.js': [
    ['06.1-arrays-basics.js', 'Array basics'],
    ['10-map-set.js', 'Map and Set'],
    ['15-prototypes-inheritance.js', 'Prototypes and inheritance'],
  ],
  '09-destructuring.js': [
    ['06.1-arrays-basics.js', 'Array basics'],
    ['08-objects.js', 'Objects and methods'],
    ['07.1-functions-basics.js', 'Function parameters'],
  ],
  '10-map-set.js': [
    ['08-objects.js', 'Objects and methods'],
    ['11-json.js', 'JSON operations'],
    ['27-memory-management.js', 'Memory management and WeakMap'],
  ],
  '11-json.js': [
    ['08-objects.js', 'Objects and methods'],
    ['10-map-set.js', 'Map and Set'],
    ['32-modules.js', 'ES Modules and import/export'],
  ],
  '12-date-time.js': [
    ['05-numbers-math.js', 'Numbers and Math'],
    ['42-intl-api.js', 'Internationalization API'],
    ['50-reserved.js', 'Temporal API (ES2027)'],
  ],
  '13-scope-closures.js': [
    ['13.1-scope-basics.js', 'Scope basics'],
    ['13.2-scope-tdz-strict.js', 'TDZ and strict mode'],
    ['13.3-closures-basics.js', 'Closures basics'],
    ['13.4-closures-patterns.js', 'Closures patterns'],
  ],
  '14-this-keyword.js': [
    ['13.1-scope-basics.js', 'Scope fundamentals'],
    ['15-prototypes-inheritance.js', 'Prototypes and inheritance'],
    ['16-classes.js', 'Classes and this'],
  ],
  '15-prototypes-inheritance.js': [
    ['14-this-keyword.js', 'this keyword'],
    ['16-classes.js', 'Classes and inheritance'],
    ['25-inheritance-patterns.js', 'Inheritance patterns'],
  ],
  '16-classes.js': [
    ['14-this-keyword.js', 'this keyword'],
    ['15-prototypes-inheritance.js', 'Prototypes'],
    ['25-inheritance-patterns.js', 'Inheritance patterns'],
  ],
  '17-property-descriptors.js': [
    ['08-objects.js', 'Objects and properties'],
    ['19-symbol-deep.js', 'Symbol deep dive'],
    ['23-proxy-reflect.js', 'Proxy and Reflect'],
  ],
  '18-es6-plus-syntax.js': [
    ['09-destructuring.js', 'Destructuring assignment'],
    ['16-classes.js', 'Classes'],
    ['32-modules.js', 'ES Modules'],
  ],
  '19-symbol-deep.js': [
    ['17-property-descriptors.js', 'Property descriptors'],
    ['22-iterators-generators.js', 'Iterators and generators'],
    ['23-proxy-reflect.js', 'Proxy and Reflect'],
  ],
  '20-error-handling.js': [
    ['03-control-flow.js', 'Control flow'],
    ['31-async-await.js', 'Async/await error handling'],
    ['34-async-error-handling.js', 'Advanced async error handling'],
  ],
  '21-regex.js': [
    ['04-strings.js', 'Strings and string methods'],
    ['22-iterators-generators.js', 'Iterators and generators'],
  ],
  '22-iterators-generators.js': [
    ['19-symbol-deep.js', 'Symbol.iterator'],
    ['21-regex.js', 'Regular expressions'],
    ['31-async-await.js', 'Async iterators'],
  ],
  '23-proxy-reflect.js': [
    ['17-property-descriptors.js', 'Property descriptors'],
    ['19-symbol-deep.js', 'Well-known Symbols'],
    ['24.1-function-composition.js', 'Function composition and decorators'],
  ],
  '24-function-patterns-advanced.js': [
    ['24.1-function-composition.js', 'Function composition'],
    ['24.2-debounce-throttle.js', 'Debounce and throttle'],
    ['24.3-memoization-cache.js', 'Memoization and cache'],
  ],
  '25-inheritance-patterns.js': [
    ['15-prototypes-inheritance.js', 'Prototypes'],
    ['16-classes.js', 'Classes'],
    ['44-design-patterns.js', 'Design patterns'],
  ],
  '26-optimization-performance.js': [
    ['24.2-debounce-throttle.js', 'Debounce and throttle'],
    ['27-memory-management.js', 'Memory management'],
    ['46-performance.js', 'Performance optimization'],
  ],
  '27-memory-management.js': [
    ['26-optimization-performance.js', 'Performance optimization'],
    ['10-map-set.js', 'WeakMap and WeakSet'],
    ['19-symbol-deep.js', 'Symbols and garbage collection'],
  ],
  '29-event-loop-callbacks.js': [
    ['30-promises.js', 'Promises'],
    ['31-async-await.js', 'Async/await'],
    ['33.1-fetch-basics.js', 'Fetch API basics'],
  ],
  '30-promises.js': [
    ['29-event-loop-callbacks.js', 'Event loop'],
    ['31-async-await.js', 'Async/await'],
    ['33.2-fetch-error-handling.js', 'Fetch error handling'],
  ],
  '31-async-await.js': [
    ['30-promises.js', 'Promises'],
    ['33.2-fetch-error-handling.js', 'Fetch with async/await'],
    ['34-async-error-handling.js', 'Async error handling'],
  ],
  '32-modules.js': [
    ['18-es6-plus-syntax.js', 'ES6+ syntax'],
    ['33.3-fetch-practical-patterns.js', 'Dynamic imports'],
    ['49-build-tools.js', 'Build tools and bundling'],
  ],
  '33-fetch-api.js': [
    ['33.1-fetch-basics.js', 'Fetch basics'],
    ['33.2-fetch-error-handling.js', 'Error handling'],
    ['33.3-fetch-practical-patterns.js', 'Advanced patterns'],
    ['33.4-fetch-streams-advanced.js', 'Stream API'],
  ],
  '34-async-error-handling.js': [
    ['33.2-fetch-error-handling.js', 'Fetch error handling'],
    ['33.3-fetch-practical-patterns.js', 'Retry patterns'],
    ['30-promises.js', 'Promise error handling'],
  ],
  '35-dom-basics.js': [
    ['36-dom-manipulation.js', 'DOM manipulation'],
    ['37-events.js', 'Event handling'],
    ['43-storage-network.js', 'Storage and network'],
  ],
  '36-dom-manipulation.js': [
    ['35-dom-basics.js', 'DOM basics'],
    ['37-events.js', 'Event handling'],
    ['45-web-apis.js', 'Advanced Web APIs'],
  ],
  '37-events.js': [
    ['35-dom-basics.js', 'DOM basics'],
    ['36-dom-manipulation.js', 'DOM manipulation'],
    ['38-forms-validation.js', 'Forms and validation'],
  ],
  '38-forms-validation.js': [
    ['37-events.js', 'Event handling'],
    ['43-storage-network.js', 'Storage and network'],
    ['48-security.js', 'Security and input validation'],
  ],
  '39-es2022-plus-features.js': [
    ['39.1-es2021-features.js', 'ES2021 features'],
    ['39.2-es2022-features.js', 'ES2022 features'],
    ['39.3-es2023-features.js', 'ES2023 features'],
  ],
  '40-debugging-testing.js': [
    ['20-error-handling.js', 'Error handling'],
    ['27-memory-management.js', 'Memory debugging'],
    ['48-security.js', 'Security testing'],
  ],
  '41-typed-arrays.js': [
    ['06.5-typed-arrays.js', 'Typed arrays basics'],
    ['27-memory-management.js', 'Memory management'],
    ['43-storage-network.js', 'Binary data and storage'],
  ],
  '42-intl-api.js': [
    ['12-date-time.js', 'Date and time formatting'],
    ['04-strings.js', 'String comparison'],
    ['50-reserved.js', 'Temporal API'],
  ],
  '43-storage-network.js': [
    ['35-dom-basics.js', 'DOM basics'],
    ['38-forms-validation.js', 'Forms and validation'],
    ['45-web-apis.js', 'Web APIs'],
  ],
  '44-design-patterns.js': [
    ['25-inheritance-patterns.js', 'Inheritance patterns'],
    ['24.1-function-composition.js', 'Function composition'],
    ['23-proxy-reflect.js', 'Proxy patterns'],
  ],
  '45-web-apis.js': [
    ['35-dom-basics.js', 'DOM basics'],
    ['43-storage-network.js', 'Storage and network'],
    ['46-performance.js', 'Performance optimization'],
  ],
  '46-performance.js': [
    ['26-optimization-performance.js', 'Optimization patterns'],
    ['27-memory-management.js', 'Memory management'],
    ['45-web-apis.js', 'Web APIs'],
  ],
  '47-typescript-advanced.js': [
    ['24.1-function-composition.ts', 'Function composition TS'],
    ['23-proxy-reflect.ts', 'Proxy TS comparison'],
    ['48-security.js', 'Type-safe security'],
  ],
  '48-security.js': [
    ['38-forms-validation.js', 'Input validation'],
    ['33.3-fetch-practical-patterns.js', 'Secure fetch patterns'],
    ['43-storage-network.js', 'Secure storage'],
  ],
  '49-build-tools.js': [
    ['32-modules.js', 'ES Modules'],
    ['47-typescript-advanced.js', 'TypeScript tooling'],
  ],
  '50-reserved.js': [
    ['39.7-es2027-future.js', 'ES2027 and future proposals'],
    ['42-intl-api.js', 'Internationalization API'],
  ],
};

function standardizeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const refs = crossRefs[fileName];

  if (!refs) {
    console.log(`  ⚠️ No cross-ref mapping for ${fileName}`);
    return false;
  }

  // Check if already has Cross-references section
  if (content.includes('Cross-references') || content.includes('Cross References')) {
    console.log(`  ℹ️ Already has Cross-references: ${fileName}`);
    return false;
  }

  // Build the standard ending
  const tsFileName = fileName.replace('.js', '-ts-comparison.ts');
  const refLines = refs.map(([file, desc]) =>
    `console.log("📘 ${file} - ${desc}");`
  ).join('\n');

  const standardEnding = `
// ============================================
// Cross-references
// ============================================
console.log("\\n=== Cross-references ===");
${refLines}

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: ${tsFileName}
*/
`;

  // Find and replace the old TS comparison section
  // Pattern: // ============================================
  //          // TypeScript Comparison (or similar)
  //          // ============================================
  //          ... everything after that to end of file
  const tsSectionPattern = /\/\/ ={44}\s*\n\/\/ (?:See TypeScript|TypeScript (?:Comparison|Notes)|TS Comparison|TS Notes).*?\n\/\/ ={44}[\s\S]*$/m;

  let newContent;
  let changed = false;

  if (tsSectionPattern.test(content)) {
    newContent = content.replace(tsSectionPattern, standardEnding.trim() + '\n');
    changed = true;
    console.log(`  ✅ Replaced TS section and added Cross-refs: ${fileName}`);
  } else {
    // No TS section found - just append both sections
    newContent = content.trimEnd() + '\n\n' + standardEnding;
    changed = true;
    console.log(`  ✅ Appended Cross-refs and TS ref: ${fileName}`);
  }

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
  }

  return changed;
}

// Main
const demoDir = path.join(__dirname, '..', 'demo');
let totalChanged = 0;

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      if (standardizeFile(fullPath)) {
        totalChanged++;
      }
    }
  }
}

console.log('=== Standardizing TS comparison and Cross-references ===\n');
processDir(demoDir);
console.log(`\nTotal files updated: ${totalChanged}`);
