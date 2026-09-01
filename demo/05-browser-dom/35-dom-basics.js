// DOM Basics Demo
// 📘 For TypeScript comparison, see: 35-dom-basics-ts-comparison.ts
// 📘 javascript.info Part 2 > Document
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
// ⚠️ Browser environment only — Must be included in HTML file or used with jsdom
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces the DOM as the browser representation of HTML and XML documents.
// The examples start with the tree structure and then show how to navigate and inspect nodes.

// ============================================
// Table of Contents
// ============================================
// 1. DOM Tree Structure
// 2. Searching and Getting Elements
// 3. Node Properties and Content
// 4. Attribute Operations
// 5. Styles and Classes
// 6. Common Pitfalls
// 7. Best Practices & Summary

// ============================================

// 1. DOM Tree Structure
// Nodes form a tree; key node types: ELEMENT_NODE=1, TEXT_NODE=3, COMMENT_NODE=8, DOCUMENT_NODE=9
// Navigate with: parentNode/childNodes/firstChild/nextSibling (all nodes) or parentElement/children/firstElementChild/nextElementSibling (elements only)
// Watch out for: whitespace text nodes, live collections auto-updating

console.log("=== Section 1: DOM Tree Structure ===\n");

// DOM Node Type Constants
console.log("DOM Node Type Constants:");
console.log(`Node.ELEMENT_NODE = ${typeof Node !== "undefined" ? Node.ELEMENT_NODE : 1}`); // 1 - Element node
console.log(`Node.TEXT_NODE = ${typeof Node !== "undefined" ? Node.TEXT_NODE : 3}`); // 3 - Text node
console.log(`Node.COMMENT_NODE = ${typeof Node !== "undefined" ? Node.COMMENT_NODE : 8}`); // 8 - Comment node
console.log(`Node.DOCUMENT_NODE = ${typeof Node !== "undefined" ? Node.DOCUMENT_NODE : 9}`); // 9 - Document node
console.log(
  `Node.DOCUMENT_TYPE_NODE = ${typeof Node !== "undefined" ? Node.DOCUMENT_TYPE_NODE : 10}`
); // 10 - DOCTYPE

// DOM navigation examples in browser environment (using conditional check for Node.js compatibility)
if (typeof document !== "undefined") {
  console.log("\n⚠️ Browser environment detected - DOM navigation examples:");

  // Root node access
  console.log("document.documentElement:", document.documentElement?.tagName); // <html>
  console.log("document.head:", document.head?.tagName); // <head>
  console.log("document.body:", document.body?.tagName); // <body>

  // Node hierarchy relationship example code (needs to run in actual HTML)
  console.log(`
// DOM hierarchy navigation properties examples:
// const elem = document.getElementById('myId');
//
// All nodes navigation (includes text nodes):
//   elem.parentNode          - Parent node
//   elem.childNodes          - All child nodes (NodeList, includes text nodes)
//   elem.firstChild          - First child node
//   elem.lastChild           - Last child node
//   elem.nextSibling         - Next sibling node
//   elem.previousSibling     - Previous sibling node
//
// Element-only navigation (skips text nodes):
//   elem.parentElement       - Parent element node
//   elem.children            - Child element nodes (HTMLCollection)
//   elem.firstElementChild   - First child element
//   elem.lastElementChild    - Last child element
//   elem.nextElementSibling  - Next sibling element
//   elem.previousElementSibling - Previous sibling element
  `);
} else {
  console.log("\n⚠️ Non-browser environment, DOM navigation examples cannot execute");
  console.log("Please run these examples in browser console or with jsdom");
}

// 2. Searching and Getting Elements
// getElementById/querySelector return single element; getElementsBy*/querySelectorAll return collections
// Live collections (HTMLCollection from getElementsBy*) auto-update — iterate over [...coll] to avoid skipping elements
// closest(selector) finds nearest ancestor matching selector; matches(selector) tests if element matches

console.log("\n=== Section 2: Searching and Getting Elements ===\n");

console.log("🔍 Element Search Methods Comparison:\n");

console.log("1. getElementById() - Fastest method");
console.log("   Syntax: document.getElementById(id)");
console.log("   Returns: Element | null");
console.log("   Note: ID should be unique in document\n");

console.log("2. querySelector() - Most flexible");
console.log("   Syntax: element.querySelector(selector)");
console.log("   Returns: Element | null");
console.log("   Supports: CSS selectors (#id, .class, [attr], :pseudo)\n");

console.log("3. querySelectorAll() - Static NodeList");
console.log("   Syntax: element.querySelectorAll(selector)");
console.log("   Returns: NodeList (static snapshot, doesn't change with DOM)");
console.log("   Iteration: forEach, for...of, [...nodeList]\n");

console.log("4. getElementsByClassName() - Live HTMLCollection ⚠️");
console.log("   Syntax: element.getElementsByClassName(classNames)");
console.log("   Returns: HTMLCollection (live collection!)");
console.log("   ⚠️ Trap: Iterating live collection while modifying DOM will skip elements!\n");

console.log("5. getElementsByTagName() - Live HTMLCollection ⚠️");
console.log("   Syntax: element.getElementsByTagName(tagName)");
console.log("   Returns: HTMLCollection (live collection!)\n");

console.log("6. getElementsByName() - Mainly for forms");
console.log("   Syntax: document.getElementsByName(name)");
console.log("   Returns: NodeList\n");

console.log("7. closest() - Search upwards for ancestor (DOM / WHATWG Living Standard)");
console.log("   Syntax: element.closest(selector)");
console.log("   Returns: Element | null (includes itself)");
console.log("   Use case: Finding specific ancestor in event delegation\n");

console.log(
  "8. matches() / matchesSelector() - Match check (DOM / WHATWG; matchesSelector is the deprecated legacy alias)"
);
console.log("   Syntax: element.matches(selector)");
console.log("   Returns: boolean");
console.log("   Use case: Filtering target element in event delegation\n");

console.log("📊 Live Collections vs Static Collections:\n");
console.log("┌─────────────────────┬──────────────────┬──────────────────┐");
console.log("│ Method              │ Return Type      │ Live?            │");
console.log("├─────────────────────┼──────────────────┼──────────────────┤");
console.log("│ getElementById      │ Element/null     │ N/A              │");
console.log("│ querySelector       │ Element/null     │ N/A              │");
console.log("│ querySelectorAll    │ NodeList         │ ❌ Static        │");
console.log("│ getElementsByTagName│ HTMLCollection   │ ✅ Live          │");
console.log("│ getElementsByClass  │ HTMLCollection   │ ✅ Live          │");
console.log("│ getElementsByName   │ NodeList         │ ✅ Live          │");
console.log("│ children            │ HTMLCollection   │ ✅ Live          │");
console.log("│ childNodes          │ NodeList         │ ✅ Live          │");
console.log("└─────────────────────┴──────────────────┴──────────────────┘\n");

console.log("⚠️ Live Collection Trap Example:");
console.log(`
// ❌ Wrong: Iterating live collection and removing elements skips some items
const items = document.getElementsByClassName('item');
for (let i = 0; i < items.length; i++) {
  items[i].remove(); // Each removal shrinks collection, skips elements!
}

// ✅ Correct: Convert to array or iterate in reverse
const items = document.getElementsByClassName('item');
[...items].forEach(item => item.remove()); // Convert to static array first

// Or iterate in reverse
for (let i = items.length - 1; i >= 0; i--) {
  items[i].remove();
}
`);

// 3. Node Properties and Content
// innerHTML: parses HTML, ⚠️ XSS risk with untrusted content; textContent: plain text, safe, fast
// innerText: CSS-aware, triggers reflow (slow); outerHTML: includes element itself
// nodeValue/data: for text/comment nodes; hidden: HTML5 boolean (can be overridden by CSS)

console.log("\n=== Section 3: Node Properties and Content ===\n");

console.log("📝 Content Properties Comparison:\n");

console.log("1. innerHTML");
console.log("   - Gets/sets the HTML content of an element");
console.log("   - ⚠️ XSS security risk! Do not insert untrusted content");
console.log("   - Reparses HTML, has lower performance");
console.log("   Example: element.innerHTML = '<strong>Bold</strong>'\n");

console.log("2. textContent");
console.log("   - Gets/sets plain text content (doesn't include HTML tags)");
console.log("   - ✅ Safe: Treats value as plain text, never parsed as HTML (no script execution)");
console.log("   - ✅ Better performance: Doesn't trigger HTML parsing");
console.log("   - Returns content of hidden elements");
console.log("   Example: element.textContent = '<script>not executed</script>'\n");

console.log("3. innerText");
console.log("   - Similar to textContent, but considers CSS rendering");
console.log("   - Doesn't return content of hidden elements (display:none)");
console.log("   - ⚠️ Triggers reflow, has poor performance");
console.log("   - Preserves line formatting (based on CSS rendering result)\n");

console.log("4. outerHTML");
console.log("   - Includes the element's own HTML");
console.log("   - Setting replaces the entire element");
console.log("   Example:");
console.log(`
   // <div id="box">Content</div>
   box.outerHTML; // '<div id="box">Content</div>'
   box.outerHTML = '<p>New</p>'; // div is replaced with p
   // box variable now points to detached element!
`);

console.log("\n5. nodeValue / data (Text node specific)");
console.log("   - Used for text and comment nodes");
console.log("   - Element node's nodeValue is null");
console.log(`
   const textNode = document.createTextNode('hello');
   textNode.nodeValue; // 'hello'
   textNode.data;      // 'hello' (synonym)
`);

console.log("\n6. hidden property");
console.log("   - HTML5 boolean attribute");
console.log(
  "   - Applies display:none via user-agent stylesheet, but CAN be overridden by author CSS (e.g. display:block)"
);
console.log("   - Can be customized with CSS [hidden] { display: none }");
console.log(`
   element.hidden = true;  // Hide
   element.hidden = false; // Show
`);

console.log("\n📊 Content Properties Comparison Table:\n");
console.log("┌─────────────┬──────────┬──────────┬──────────┬──────────┐");
console.log("│ Property    │ HTML tags │ Security │ Performance│ Hidden    │");
console.log("├─────────────┼──────────┼──────────┼──────────┼──────────┤");
console.log("│ innerHTML   │ ✅ Kept  │ ⚠️ Risk  │ Slow(parse)│ ✅ Inc.  │");
console.log("│ textContent │ ❌ Escaped│ ✅ Safe   │ Fast      │ ✅ Inc.  │");
console.log("│ innerText   │ ❌ Escaped│ ✅ Safe   │ Slow(reflow)│ ❌ Excl.  │");
console.log("│ outerHTML   │ ✅ Kept  │ ⚠️ Risk  │ Slow      │ ✅ Inc.  │");
console.log("└─────────────┴──────────┴──────────┴──────────┴──────────┘\n");

// 4. Attribute Operations
// HTML attribute vs DOM property: attributes are strings in HTML; properties are on the JS object (any type)
// Standard attributes (id, class) auto-sync; non-standard use getAttribute/setAttribute or dataset for data-*
// ⚠️ input.value property reflects current typed value; getAttribute('value') returns the initial HTML value
// className maps to `class` attribute; htmlFor maps to `for`; classList provides add/remove/toggle/contains

console.log("\n=== Section 4: Attribute Operations ===\n");

console.log("📖 HTML Attribute vs DOM Property:\n");
console.log("- HTML Attribute: String written in HTML tag");
console.log("- DOM Property: Property on JavaScript object (can be any type)\n");

console.log("🔗 Standard Attributes Usually Auto-Sync:");
console.log(`
// HTML: <input id="name" class="field" value="John">
const input = document.getElementById('name');

// Attribute → Property (auto-sync)
input.id;           // "name" (string)
input.className;    // "field" (note: not class!)
input.value;        // "John"

// Property → Attribute (usually also syncs)
input.id = 'newId'; // HTML becomes: <input id="newId" ...>
`);

console.log("⚠️ Important Difference - value property:");
console.log(`
// HTML: <input value="initial">
const input = document.querySelector('input');

input.getAttribute('value'); // "initial" (always initial value!)
input.value = 'typed';       // After user types
input.getAttribute('value'); // Still "initial"
input.value;                 // "typed" (current value)
`);

console.log("\n🔧 Attribute Manipulation Methods:\n");

console.log("1. getAttribute(name)");
console.log("   - Gets HTML attribute value (string)");
console.log("   - Can get non-standard attributes");
console.log("   Example: elem.getAttribute('data-id')\n");

console.log("2. setAttribute(name, value)");
console.log("   - Sets HTML attribute");
console.log("   - Value is converted to string");
console.log("   Example: elem.setAttribute('data-id', '123')\n");

console.log("3. removeAttribute(name)");
console.log("   - Removes HTML attribute");
console.log("   Example: elem.removeAttribute('disabled')\n");

console.log("4. hasAttribute(name)");
console.log("   - Checks if attribute exists");
console.log("   Example: elem.hasAttribute('required')\n");

console.log("5. attributes collection");
console.log("   - Read-only NamedNodeMap");
console.log("   - Contains all attribute nodes");
console.log(`
   for (let attr of element.attributes) {
     console.log(attr.name, attr.value);
   }
`);

console.log("\n📦 data-* Attributes and dataset:");
console.log(`
// HTML: <div id="user" data-id="123" data-user-role="admin">
const user = document.getElementById('user');

// Get data-* attributes
user.dataset.id;        // "123"
user.dataset.userRole;  // "admin" (auto camelCase)

// Set data-* attributes
user.dataset.status = 'active'; // HTML: data-status="active"

// Notes:
// - Only works for data-* attributes
// - Names auto-convert: data-user-role → dataset.userRole
// - Values are strings, need manual conversion for numbers/booleans
`);

console.log("\n📊 Common Attributes Mapping Table:\n");
console.log("┌────────────────┬─────────────────────┬─────────────────────┐");
console.log("│ Concept        │ Attribute           │ Property            │");
console.log("├────────────────┼─────────────────────┼─────────────────────┤");
console.log("│ Class name     │ class               │ className           │");
console.log("│ Label for      │ for                 │ htmlFor             │");
console.log("│ Readonly        │ readonly            │ readOnly            │");
console.log("│ Max value      │ maxlength           │ maxLength           │");
console.log("│ Cell span      │ colspan/rowspan     │ colSpan/rowSpan     │");
console.log("│ Content edit.  │ contenteditable     │ contentEditable     │");
console.log("└────────────────┴─────────────────────┴─────────────────────┘\n");

// 5. Styles and Classes
// classList: add/remove/toggle/contains/replace — preferred over className string manipulation
// element.style: inline styles only (camelCase: backgroundColor); cssText for bulk set
// getComputedStyle(el): read-only computed values (resolved units, includes CSS rules); accepts ::after/::before
// CSS custom properties: element.style.setProperty('--name', val); getComputedStyle(el).getPropertyValue('--name')

console.log("\n=== Section 5: Styles and Classes ===\n");

console.log("🏷️ className vs classList:\n");

console.log("1. className (string manipulation)");
console.log(`
// Get/set complete class name string
element.className;           // "btn primary large"
element.className = 'btn';   // Replaces all classes!

// String manipulation to add class (old way, not recommended)
if (!element.className.includes('active')) {
  element.className += ' active';
}
`);

console.log("\n2. classList (modern recommended way) - DOM API");
console.log(`
// Methods:
element.classList.add('active', 'highlight');      // Add classes
element.classList.remove('active', 'old');         // Remove classes
element.classList.toggle('active');                // Toggle class
element.classList.toggle('active', condition);     // Conditional toggle
element.classList.contains('active');              // Check class (returns boolean)
element.classList.replace('old', 'new');           // Replace class (DOM API)

// Iteration:
for (let className of element.classList) {
  console.log(className);
}
`);

console.log("\n🎨 Inline Style Operations (style):\n");

console.log("1. style property");
console.log(`
// Set individual styles
element.style.color = 'red';
element.style.backgroundColor = '#f0f0f0'; // camelCase naming!
element.style.fontSize = '16px';

// Note: Values must be strings with units
element.style.width = '100px';  // ✅
element.style.width = 100;      // ❌ Invalid

// Remove styles
element.style.color = '';       // Set empty string to remove
`);

console.log("\n2. cssText (bulk setting)");
console.log(`
// Set multiple styles (overwrites existing inline styles)
element.style.cssText = \`
  color: red;
  background: blue;
  font-size: 14px;
\`;

// Append styles (keeps existing)
element.style.cssText += 'border: 1px solid black;';
`);

console.log("\n3. setProperty / getPropertyValue (CSS variables)");
console.log(`
// Standard CSS properties
element.style.setProperty('color', 'blue');
element.style.getPropertyValue('color');      // "blue"
element.style.removeProperty('color');

// CSS custom properties (variables) ✨
element.style.setProperty('--theme-color', '#ff6600');
const color = getComputedStyle(element).getPropertyValue('--theme-color');
`);

console.log("\n👁️ getComputedStyle - Get Computed Styles:\n");
console.log(`
// Get element's final applied styles (including CSS files and inline styles)
const styles = getComputedStyle(element);

// Returned values are calculated absolute values
styles.width;        // "100px" (even if CSS wrote 50%)
styles.color; // "rgb(255, 0, 0)" (normalized format)

// Get pseudo-element styles
const afterStyles = getComputedStyle(element, '::after');

// ⚠️ Notes:
// - Read-only, cannot modify
// - Returns resolved values, not computed values
// - For shorthand properties (like margin), may return empty string
`);

console.log("\n🎯 CSS Variables and JavaScript Interaction:\n");
console.log(`
// Define CSS variables
// :root {
//   --primary-color: #007bff;
//   --spacing: 1rem;
// }

// JavaScript read
const rootStyles = getComputedStyle(document.documentElement);
const primary = rootStyles.getPropertyValue('--primary-color').trim();

// JavaScript set
document.documentElement.style.setProperty('--primary-color', '#ff6600');

// Utility function
function setCSSVariable(name, value) {
  document.documentElement.style.setProperty(\`--\${name}\`, value);
}

function getCSSVariable(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(\`--\${name}\`).trim();
}
`);

console.log("\n📊 Style Operation Methods Comparison:\n");
console.log("┌────────────────────┬──────────────┬──────────┬────────────┐");
console.log("│ Method             │ Modify       │ Read     │ Priority   │ CSS Files  │");
console.log("├────────────────────┼──────────────┼──────────┼────────────┤");
console.log("│ element.style.xxx  │ ✅ Yes       │ ⚠️ Inline│ Highest    │ ❌ No      │");
console.log("│ getComputedStyle   │ ❌ No        │ ✅ All    │ N/A        │ ✅ Yes     │");
console.log("│ classList          │ ✅ Yes       │ ✅ Yes    │ Varies     │ N/A        │");
console.log("└────────────────────┴──────────────┴──────────┴────────────┘\n");

// ============================================
// 6. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===\n");

console.log("\nPitfall 1: Confusing attribute vs property");
console.log("  element.getAttribute('value') vs element.value");
console.log("  Attribute is initial HTML, property is current state.");
console.log("  Fix: Use properties for current values, attributes for HTML state.");

console.log("\nPitfall 2: innerHTML XSS risk");
console.log("  Inserting user input into innerHTML can execute scripts.");
console.log("  Fix: Use textContent for text, createElement/textNode for structure.");

console.log("\nPitfall 3: Modifying DOM while iterating a live HTMLCollection");
console.log("  Mutating the DOM invalidates the collection's indices.");
console.log("  Fix: Iterate backwards, or convert to a static array first.");

console.log("\nPitfall 4: DOM queries in a loop");
console.log("  querySelector inside a loop re-scans the document each time.");
console.log("  Fix: Cache the query result outside the loop.");

console.log("\nPitfall 5: Overusing getComputedStyle");
console.log("  Forces reflow, hurting performance.");
console.log("  Fix: Batch style reads, avoid alternating read/write.");

console.log("\nPitfall 6: Assuming NodeList is an Array");
console.log("  NodeList lacks map/filter without Array.from().");
console.log("  Fix: Use Array.from(nodeList) or spread [...nodeList].");

// ============================================
// 7. Best Practices & Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Prefer querySelector/querySelectorAll for complex selection");
console.log("2. Use textContent instead of innerText (better performance)");
console.log("3. Use classList instead of className for class manipulation");
console.log("4. Use dataset to manage data-* attributes");
console.log("5. Use DocumentFragment when manipulating large amounts of DOM");
console.log("6. Cache query results to avoid repeated queries");
console.log("7. Use event delegation to reduce number of listeners\n");

console.log("📐 Element Geometry & Positioning:\n");
console.log(`
// getBoundingClientRect() — Get element position and size relative to viewport
const rect = element.getBoundingClientRect();
// Returns: { top, right, bottom, left, width, height, x, y }

// scrollIntoView() — Scroll element into visible area
element.scrollIntoView({ behavior: 'smooth', block: 'center' });

// Other key geometry properties:
// offsetTop/Left — relative to offsetParent
// offsetWidth/Height — including border + padding
// clientWidth/Height — content + padding (no border/scrollbar)
// scrollTop/Left — scroll position
// scrollWidth/Height — total scrollable content size
// isConnected — true if element is in the DOM tree
`);

console.log("🎨 Shadow DOM Overview:\n");
console.log(`
// Shadow DOM — style and DOM encapsulation
const host = document.getElementById('host');
const shadow = host.attachShadow({ mode: 'open' }); // or 'closed'

shadow.innerHTML = '<style>p { color: blue; }</style><p>Scoped content</p><slot></slot>';

// Benefits: CSS scoping, DOM isolation, slot-based composition
// Used by <video>, <input>, and Web Components internally
`);

console.log("❌ DON'T:\n");
console.log("1. Don't insert user input directly into innerHTML (XSS risk)");
console.log("2. Don't use innerHTML for string concatenation in loops");
console.log("3. Don't confuse attribute and property");
console.log("4. Don't modify DOM while iterating live HTMLCollection");
console.log("5. Don't overuse getComputedStyle (triggers reflow)");
console.log("6. Don't rely on input.getAttribute('value') to get current value\n");

console.log("📚 Reference Documentation:\n");
console.log("- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model");
console.log("- javascript.info: https://javascript.info/document");
console.log("- DOM Living Standard: https://dom.spec.whatwg.org/");
console.log("- CSSOM: https://www.w3.org/TR/cssom-1/\n");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 36-dom-manipulation.js - DOM manipulation");
console.log("📘 37-events.js - Event handling");
console.log("📘 43-storage-network.js - Storage and network");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 35-dom-basics-ts-comparison.ts
*/
