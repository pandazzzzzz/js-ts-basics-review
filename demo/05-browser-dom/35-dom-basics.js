// DOM Basics Demo
// 📘 javascript.info Part 2 > Document
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
// ⚠️ Browser environment only — Must be included in HTML file or used with jsdom

// ============================================
// Section 1: DOM Tree Structure
// ============================================
// Description: The Document Object Model (DOM) is a programming interface for HTML/XML documents
// ES Spec: DOM Level 1 (1998), Living Standard
// Characteristics:
//   - Represents the document as a tree structure of nodes
//   - Each node has a specific type and set of properties
//   - Can be read and modified using JavaScript
// Use Cases: Dynamic web content, interactive applications, data visualization
// Common Pitfalls: Live collection traps, whitespace text nodes, attribute vs property confusion

console.log("=== Section 1: DOM Tree Structure ===\n");

// DOM Node Type Constants
console.log("DOM Node Type Constants:");
console.log(`Node.ELEMENT_NODE = ${Node?.ELEMENT_NODE ?? 1}`);           // 1 - Element node
console.log(`Node.TEXT_NODE = ${Node?.TEXT_NODE ?? 3}`);                 // 3 - Text node
console.log(`Node.COMMENT_NODE = ${Node?.COMMENT_NODE ?? 8}`);           // 8 - Comment node
console.log(`Node.DOCUMENT_NODE = ${Node?.DOCUMENT_NODE ?? 9}`);         // 9 - Document node
console.log(`Node.DOCUMENT_TYPE_NODE = ${Node?.DOCUMENT_TYPE_NODE ?? 10}`); // 10 - DOCTYPE

// DOM navigation examples in browser environment (using conditional check for Node.js compatibility)
if (typeof document !== 'undefined') {
  console.log("\n⚠️ Browser environment detected - DOM navigation examples:");

  // Root node access
  console.log("document.documentElement:", document.documentElement?.tagName); // <html>
  console.log("document.head:", document.head?.tagName);                       // <head>
  console.log("document.body:", document.body?.tagName);                       // <body>

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

// ============================================
// Section 2: Searching and Getting Elements
// ============================================
// Description: Methods for finding elements in the DOM
// ES Spec: DOM Selectors API Level 1/2
// Characteristics:
//   - Returns single element or collection of elements
//   - Distinction between live collections and static snapshots
// Use Cases: Accessing page elements for manipulation, event binding, style modification
// Common Pitfalls: Live collections auto-update causing element skips during iteration

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

console.log("8. matches() / matchesSelector() - Match check (DOM / WHATWG Living Standard)");
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

// ============================================
// Section 3: Node Properties and Content
// ============================================
// Description: Getting and setting element content and attributes
// ES Spec: DOM Parsing and Serialization, HTML5
// Characteristics:
//   - innerHTML parses HTML, textContent is plain text
//   - textContent has better performance than innerText
// Use Cases: Content updates, XSS protection, text extraction
// Common Pitfalls: innerHTML XSS risk, innerText triggers reflow

console.log("\n=== Section 3: Node Properties and Content ===\n");

console.log("📝 Content Properties Comparison:\n");

console.log("1. innerHTML");
console.log("   - Gets/sets the HTML content of an element");
console.log("   - ⚠️ XSS security risk! Do not insert untrusted content");
console.log("   - Reparses HTML, has lower performance");
console.log("   Example: element.innerHTML = '<strong>Bold</strong>'\n");

console.log("2. textContent");
console.log("   - Gets/sets plain text content (doesn't include HTML tags)");
console.log("   - ✅ Safe: Automatically escapes HTML special characters");
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
console.log("   - Equivalent to style.display = 'none'");
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

// ============================================
// Section 4: Attribute Operations
// ============================================
// Description: Difference between HTML attributes and DOM properties
// ES Spec: DOM Core, HTML5
// Characteristics:
//   - Standard attributes usually sync (e.g., id, class)
//   - Non-standard attributes need dataset or getAttribute
//   - Some attributes don't sync (e.g., href, value)
// Use Cases: Data storage, state marking, configuration passing
// Common Pitfalls: Confusing attribute vs property, href/value sync issues

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

// ============================================
// Section 5: Styles and Classes
// ============================================
// Description: Manipulating element classes and inline styles
// ES Spec: CSSOM, CSS Object Model
// Characteristics:
//   - classList is the modern recommended way to manipulate classes
//   - style object corresponds to inline styles, has highest priority
//   - getComputedStyle gets final calculated styles
// Use Cases: Theme switching, status indicators, animation effects
// Common Pitfalls: style only reads inline styles, getComputedStyle is read-only

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
// Best Practices & Summary
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
// TypeScript Comparison Notes
// ============================================
/*
🔍 TYPESCRIPT VS JAVASCRIPT - DOM TYPE DIFFERENCES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. DOM ELEMENT PRECISE TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const input = document.getElementById('name');
  input.value;  // ✅ May have no value property at runtime

TypeScript:
  const input = document.getElementById('name');           // HTMLElement | null
  input.value;                                             // ❌ Error: Property 'value' does not exist

  // Solution 1: Type assertion
  const input = document.getElementById('name') as HTMLInputElement;

  // Solution 2: Type guard
  const input = document.getElementById('name');
  if (input instanceof HTMLInputElement) {
    input.value;                                           // ✅ OK
  }

  // Solution 3: Generic selector (recommended)
  const input = document.querySelector<HTMLInputElement>('#name');

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. NULL SAFETY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const elem = document.getElementById('missing');
  elem.textContent = 'Hello';  // ⚠️ Runtime error!

TypeScript:
  const elem = document.getElementById('missing');
  elem.textContent = 'Hello';  // ❌ Error: Object is possibly null

  // Solution:
  if (elem) {
    elem.textContent = 'Hello';                            // ✅ OK
  }

  // Or optional chaining
  elem?.textContent = 'Hello';                             // ✅ OK

  // Or non-null assertion (when you're sure it exists)
  const elem = document.getElementById('must-exist')!;

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. EVENT TARGET TYPING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  form.addEventListener('submit', (e) => {
    e.target.value;  // ⚠️ May not have value
  });

TypeScript:
  form.addEventListener('submit', (e) => {
    e.target.value;                                        // ❌ Error
    (e.target as HTMLInputElement).value;                  // ✅ OK
  });

  // Better approach
  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    console.log(target.value);
  };

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. COMMON DOM TYPE REFERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generic types:
  Element          - Any element
  HTMLElement      - HTML element (distinct from SVGElement)
  Node             - Any node (includes text, comments)
  NodeList         - querySelectorAll return type
  HTMLCollection   - getElementsBy* return type

Form elements:
  HTMLInputElement      - <input>
  HTMLTextAreaElement   - <textarea>
  HTMLSelectElement     - <select>
  HTMLOptionElement     - <option>
  HTMLFormElement       - <form>
  HTMLButtonElement     - <button>

Media elements:
  HTMLImageElement      - <img>
  HTMLVideoElement      - <video>
  HTMLAudioElement      - <audio>
  HTMLCanvasElement     - <canvas>

Other common:
  HTMLAnchorElement     - <a>
  HTMLDivElement        - <div>
  HTMLSpanElement       - <span>
  HTMLUListElement      - <ul>
  HTMLLIElement         - <li>
  HTMLTableElement      - <table>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. CSS TYPE SUPPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TypeScript has complete type support for CSS properties:

  element.style.color = 'red';        // ✅ OK
  element.style.invalid = 'value';    // ❌ Error: Property 'invalid' does not exist

  // CSS variables support
  element.style.setProperty('--x', '10px');  // ✅ OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. TYPE-SAFE UTILITY FUNCTION EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Safe element retrieval
function getElement<T extends HTMLElement>(selector: string): T {
  const elem = document.querySelector<T>(selector);
  if (!elem) throw new Error(\`Element not found: \${selector}\`);
  return elem;
}

// Usage
const input = getElement<HTMLInputElement>('#username');
input.value;  // ✅ Type safe

// Optional element retrieval
function maybeGetElement<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector<T>(selector);
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 SUMMARY: TYPESCRIPT DOM BENEFITS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Compile-time capture of null reference errors
✅ Precise DOM element types
✅ Better IDE autocomplete and refactoring
✅ Prevents common runtime errors
✅ Self-documenting code

⚠️ Cases to handle:
  - Element may not exist (| null)
  - Need type assertion or guard
  - Third-party libraries may need type declarations

🎯 RECOMMENDATION: Use TypeScript for production code, especially for DOM manipulation!
*/
