// DOM Manipulation Demo
// 📘 For TypeScript comparison, see: 36-dom-manipulation-ts-comparison.ts
// 📘 javascript.info Part 2 > "Modifying the document"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
// ⚠️ Browser environment only
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces DOM manipulation as the process of creating and updating page content dynamically.
// The examples progress from creating elements to updating attributes and structure.

// ============================================
// Table of Contents
// ============================================
// 1. Creating Elements
// 2. Inserting Elements
// 3. Removing Elements
// 4. Batch Operations and Performance
// 5. Special APIs for Tables and Lists
// 6. MutationObserver
// 7. Best Practices & Summary

// 1. Creating Elements
// createElement(tag), createTextNode(text) — text nodes auto-escape HTML
// cloneNode(deep) duplicates elements; ⚠️ does NOT copy event listeners
// DocumentFragment: lightweight container for batch DOM updates (single reflow)

console.log("=== Section 1: Creating Elements ===\n");

if (typeof document !== "undefined") {
  console.log(
    "✅ Browser environment detected, following code is executable:\n"
  );

  // 1.1 createElement - Create element node
  console.log("1. document.createElement(tagName)");
  const div = document.createElement("div");
  div.id = "myDiv";
  div.className = "container";
  div.textContent = "Hello, DOM!";
  console.log("Created element:", div.outerHTML);

  // Create namespaced element (SVG, MathML)
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  console.log("SVG element created:", svg.tagName);

  // 1.2 createTextNode - Create text node
  console.log("\n2. document.createTextNode(text)");
  const textNode = document.createTextNode('<script>alert("xss")</script>');
  console.log("Text content:", textNode.data);
  console.log("Note: HTML tags are treated as literal text, not executed!");

  // Comparison: innerHTML parses HTML
  const unsafeDiv = document.createElement("div");
  // unsafeDiv.innerHTML = '<script>alert("xss")</script>'; // ❌ XSS risk!

  // 1.3 cloneNode - Clone node
  console.log("\n3. elem.cloneNode(deep)");
  const original = document.createElement("div");
  original.innerHTML = "<p>Paragraph <span>with span</span></p>";

  // Shallow clone - Only clones element itself, doesn't include child nodes
  const shallowClone = original.cloneNode(false);
  console.log("Shallow clone:", shallowClone.outerHTML); // <div></div>

  // Deep clone - Clones element and all its descendants
  const deepClone = original.cloneNode(true);
  console.log("Deep clone:", deepClone.outerHTML);

  console.log(`
⚠️ cloneNode Notes:
- Does NOT copy event listeners added with addEventListener
- DOES copy inline handler attributes / IDL properties (e.g. el.onclick = fn)
- Does not copy JavaScript properties other than standard attributes
- id attribute is also copied, avoid duplicate IDs!
`);

  // Fix duplicate ID problem
  deepClone.id = "myDiv-clone-" + Date.now();

  // 1.4 DocumentFragment - Lightweight container
  console.log("\n4. DocumentFragment - Bulk operation optimization");
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= 5; i++) {
    const li = document.createElement("li");
    li.textContent = `Item ${i}`;
    fragment.appendChild(li);
  }

  console.log("Fragment children count:", fragment.childNodes.length);
  console.log("Fragment is not in DOM, no reflow yet!");

  // One-time insertion to DOM
  // ul.appendChild(fragment); // Only triggers one reflow!
  console.log(
    "After append, fragment becomes empty:",
    fragment.childNodes.length === 0
  );
} else {
  console.log(
    "\n⚠️ Non-browser environment, creating element examples shown in code form"
  );
}

// ============================================
// 2. Inserting Elements
// Modern: append/prepend/before/after/replaceWith — accept multiple nodes/strings, return undefined
// Traditional: appendChild/insertBefore/replaceChild — single node, return the node
// insertAdjacentHTML/Element/Text: precise position (beforebegin/afterbegin/beforeend/afterend)
// ⚠️ Appending an existing element moves it (removes from original position); use cloneNode to copy

console.log("\n=== Section 2: Inserting Elements ===\n");

console.log("🔧 Modern Insertion Methods (DOM / WHATWG Living Standard):\n");

console.log("1. parent.append(...nodesOrStrings)");
console.log("   - Adds at the end of parent element");
console.log("   - Can add multiple nodes or strings");
console.log("   - Returns undefined");
console.log(`
   parent.append(child);           // Single element
   parent.append(child1, child2);  // Multiple elements
   parent.append('text');          // Text node
   parent.append('Hello ', element, '!'); // Mixed
`);

console.log("\n2. parent.prepend(...nodesOrStrings)");
console.log("   - Adds at the beginning of parent element");
console.log("   - Can add multiple nodes or strings");
console.log(`
   parent.prepend(firstChild);
   parent.prepend('Header: ', titleElement);
`);

console.log("\n3. element.before(...nodesOrStrings)");
console.log("   - Inserts before current element (sibling)");
console.log("   - Can add multiple nodes or strings");
console.log(`
   target.before(newElement);
   target.before('<hr>'); // Automatically converted to text node
`);

console.log("\n4. element.after(...nodesOrStrings)");
console.log("   - Inserts after current element (sibling)");
console.log(`
   target.after(newElement);
`);

console.log("\n5. element.replaceWith(...nodesOrStrings)");
console.log("   - Replaces current element");
console.log(`
   oldElement.replaceWith(newElement);
   oldElement.replaceWith('text only now');
`);

console.log("\n📜 Traditional Insertion Methods:\n");

console.log("6. parent.appendChild(node)");
console.log("   - Adds at the end, single child node");
console.log("   - Returns added node");
console.log(
  "   - If node already exists, removes from original position (move operation)"
);
console.log(`
   const added = parent.appendChild(child);
   console.log(added === child); // true
`);

console.log("\n7. parent.insertBefore(newNode, referenceNode)");
console.log("   - Inserts before reference node");
console.log("   - referenceNode of null is equivalent to appendChild");
console.log(`
   parent.insertBefore(newChild, firstChild); // Insert at front
   parent.insertBefore(newChild, null);       // Append to end
`);

console.log("\n8. parent.replaceChild(newNode, oldNode)");
console.log("   - Replaces old node with new node");
console.log("   - Returns the replaced old node");
console.log(`
   const removed = parent.replaceChild(newNode, oldNode);
   // removed is the removed node, can be reused
`);

console.log("\n🎯 insertAdjacent* Methods - Precise Position Control:\n");
console.log(`
// Syntax: element.insertAdjacentHTML(position, htmlString)
//        element.insertAdjacentElement(position, element)
//        element.insertAdjacentText(position, text)

// Position options:
// ┌─────────────┬─────────────────────────────────────────┐
// │ beforebegin │ Element is before (sibling)              │
// │ afterbegin  │ Inside element, before first child      │
// │ beforeend   │ Inside element, after last child        │
// │ afterend    │ Element is after (sibling)                │
// └─────────────┴─────────────────────────────────────────┘

<!-- beforebegin -->
<div id="target">
  <!-- afterbegin -->
  <p>Existing content</p>
  <!-- beforeend -->
</div>
<!-- afterend -->

// Usage examples:
element.insertAdjacentHTML('beforeend', '<span>New</span>');
element.insertAdjacentElement('afterend', newElement);
element.insertAdjacentText('beforebegin', 'Prefix: ');
`);

console.log("\n📊 Insertion Method Comparison:\n");
console.log("┌────────────────────┬──────────────┬──────────┬────────────┐");
console.log("│ Method             │ Position     │ Multiple │ Return     │");
console.log("├────────────────────┼──────────────┼──────────┼────────────┤");
console.log("│ append()           │ End          │ ✅ Yes   │ undefined  │");
console.log("│ prepend()          │ Start        │ ✅ Yes   │ undefined  │");
console.log("│ before()           │ Before self  │ ✅ Yes   │ undefined  │");
console.log("│ after()            │ After self   │ ✅ Yes   │ undefined  │");
console.log("│ replaceWith()      │ Replace self │ ✅ Yes   │ undefined  │");
console.log("│ appendChild()      │ End          │ ❌ No    │ Node       │");
console.log("│ insertBefore()     │ Custom       │ ❌ No    │ Node       │");
console.log("│ replaceChild()     │ Replace      │ ❌ No    │ Old node   │");
console.log("│ insertAdjacent*    │ Precise      │ ❌ No    │ undefined  │");
console.log("└────────────────────┴──────────────┴──────────┴────────────┘\n");

console.log("⚠️ Important: Element Movement Behavior");
console.log(`
// Same element cannot be in two places simultaneously!
const elem = document.getElementById('myElem');

parent1.appendChild(elem); // elem moves to parent1
parent2.appendChild(elem); // elem removed from parent1, added to parent2

// If you want to copy instead of move, use cloneNode
parent2.appendChild(elem.cloneNode(true));

// After clone, element variable still points to cloned node
const cloned = elem.cloneNode(true);
cloned.textContent = 'Modified'; // Modifies the clone, not original
`);

// ============================================
// 3. Removing Elements
// Modern: element.remove() — no parent reference needed
// Traditional: parent.removeChild(child) — returns the removed node
// Removed nodes stay in memory if references exist; clean up event listeners to avoid leaks

console.log("\n=== Section 3: Removing Elements ===\n");

console.log("🗑️ Removal Methods:\n");

console.log("1. element.remove() - Modern method (DOM API)");
console.log("   - Removes element directly from DOM");
console.log("   - Simple and direct");
console.log("   - No parent element reference needed");
console.log(`
   const elem = document.getElementById('toRemove');
   elem.remove(); // Direct deletion
`);

console.log("\n2. parent.removeChild(child) - Traditional method");
console.log("   - Removes child element from parent");
console.log("   - Returns the removed child element");
console.log("   - Needs parent element reference");
console.log(`
   const child = document.getElementById('child');
   const removed = child.parentNode.removeChild(child);
   console.log(removed === child); // true
`);

console.log("\n3. parent.innerHTML = '' - Clear all child elements");
console.log("   - Quickly empty container");
console.log("   - ⚠️ Doesn't trigger child element removal events");
console.log("   - ⚠️ May cause memory leaks (event listeners not cleaned)");
console.log(`
   // ❌ Not recommended way
   container.innerHTML = '';

   // ✅ Better way - remove elements one by one
   while (container.firstChild) {
     container.firstChild.remove();
   }
`);

console.log("\n⚠️ Removal Considerations:\n");
console.log(`
1. Element remains in memory after removal (if there are references)
   const elem = document.getElementById('x');
   elem.remove();
   console.log(elem); // Still accessible!
   elem.textContent = 'Still here'; // Can be modified, but not in DOM

2. Event listeners are not automatically removed
   // Even after element is removed, event listeners may still be in memory
   // For frequently created/destroyed elements, consider using event delegation

3. Cleanup best practices
   function safeRemove(element) {
     // Clear custom data
     element.dataset.customData = '';
     // Remove element
     element.remove();
   }
`);

// 4. Batch Operations and Performance
// Minimize reflows: batch DOM writes before reads; use DocumentFragment for bulk insertions
// requestAnimationFrame for animations; virtual scrolling for very long lists
// Avoid layout thrashing (alternating read/write causes forced synchronous layouts)

console.log("\n=== Section 4: Batch Operations and Performance ===\n");

console.log("🚀 Performance Optimization Strategies:\n");

console.log("1. Use DocumentFragment for bulk insertions");
console.log(`
// Scenario: Need to insert 100 list items

// ❌ Slow: 100 reflows
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  container.appendChild(div);  // Triggers reflow every time
}

// ✅ Fast: 1 reflow
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);  // Not in DOM, no reflow
}
container.appendChild(fragment); // One-time insertion
`);

console.log("\n2. Use innerHTML for massive replacement");
console.log(`
// Good for completely replacing content
const items = ['Apple', 'Banana', 'Cherry'];
container.innerHTML = items.map(item =>
  \`<li class="item">\${item}</li>\`
).join('');

// ⚠️ Note XSS risk! Make sure to escape data
`);

console.log("\n3. cloneNode for template reuse");
console.log(`
// Predefine template
const template = document.createElement('div');
template.className = 'card';
template.innerHTML = '<h3></h3><p></p>';

// Clone and fill
const card1 = template.cloneNode(true);
card1.querySelector('h3').textContent = 'Title 1';

const card2 = template.cloneNode(true);
card2.querySelector('h3').textContent = 'Title 2';
`);

console.log("\n4. Offline operations (detached from DOM)");
console.log(`
// ❌ When operating in document triggers multiple reflows
const elem = document.getElementById('target');
elem.style.width = '100px';  // Reflow
elem.style.height = '100px'; // Reflow
elem.style.color = 'red';    // Reflow

// ✅ Detach from document first, modify, then re-insert
const parent = elem.parentNode;
const nextSibling = elem.nextSibling;
parent.removeChild(elem);

// Now can safely perform multiple modifications
elem.style.width = '100px';
elem.style.height = '100px';
elem.style.color = 'red';

parent.insertBefore(elem, nextSibling); // Re-insert
`);

console.log("\n5. Use requestAnimationFrame for animation optimization");
console.log(`
// Concentrate DOM updates into next frame
function smoothUpdate(element, changes) {
  requestAnimationFrame(() => {
    Object.assign(element.style, changes);
  });
}

// Throttle high-frequency updates
let pendingUpdate = null;
function throttledUpdate(fn) {
  if (pendingUpdate) cancelAnimationFrame(pendingUpdate);
  pendingUpdate = requestAnimationFrame(fn);
}
`);

console.log("\n6. Avoid forced synchronous layout");
console.log(`
// ❌ Wrong: Read/write alternation causes forced reflow
for (let i = 0; i < elements.length; i++) {
  const height = elements[i].offsetHeight; // Read (calculates style)
  elements[i].style.height = height * 2 + 'px'; // Write (forces reflow)
}

// ✅ Correct: Batch reads, then batch writes
const heights = elements.map(el => el.offsetHeight); // Batch reads
elements.forEach((el, i) => {                         // Batch writes
  el.style.height = heights[i] * 2 + 'px';
});
`);

console.log("\n💡 Virtual DOM Concept:");
console.log(
  "  React/Vue core idea: represent the DOM as JS objects, diff changes in memory, then batch-apply to the real DOM"
);
console.log(
  "  Solves: direct DOM manipulation is slow (reflow/repaint overhead), so minimize real DOM mutations"
);
console.log(
  "  Flow: vNode (JS object) → diff() → patch() applies only the minimal real DOM changes"
);

// 5. Special APIs for Tables and Lists
// HTMLTableElement: table.rows/caption/tBodies/tHead; insertRow/deleteRow; row.insertCell/deleteCell
// HTMLSelectElement: select.options/add/remove; option.value/text/selected; selectedIndex/value
// These specialized APIs provide convenient shortcuts for common table/select operations

console.log("\n=== Section 5: Special APIs for Tables and Lists ===\n");

console.log("📊 Table API (HTMLTableElement):\n");
console.log(`
// Assume HTML:
// <table id="myTable">
//   <thead>...</thead>
//   <tbody>
//     <tr><td>A1</td><td>B1</td></tr>
//     <tr><td>A2</td><td>B2</td></tr>
//   </tbody>
// </table>

const table = document.getElementById('myTable');

// Shortcut access
table.rows;              // HTMLCollection of all rows
table.tBodies;           // HTMLCollection of tbody elements
table.tHead;             // thead element or null
table.tFoot;             // tfoot element or null

// Row operations
table.insertRow();       // Insert new row at end
table.insertRow(0);      // Insert row at specified index
table.deleteRow(0);      // Delete row at specified index

// Row-specific operations
const row = table.rows[0];
row.cells;               // HTMLCollection of cells in this row
row.insertCell();        // Insert new cell (td)
row.insertCell(0);       // Insert cell at specified position
row.deleteCell(0);       // Delete cell at specified position

// Full example: Add a row of data
function addRow(table, dataArray) {
  const row = table.insertRow();
  dataArray.forEach(text => {
    const cell = row.insertCell();
    cell.textContent = text;
  });
  return row;
}

addRow(table, ['John', '30', 'Engineer']);
`);

console.log("\n🔽 Select API (HTMLSelectElement):\n");
console.log(`
// Assume HTML:
// <select id="country">
//   <option value="cn">China</option>
//   <option value="us">USA</option>
// </select>

const select = document.getElementById('country');

// Properties
select.options;          // HTMLOptionsCollection
select.length;           // Number of options
select.selectedIndex;    // Index of selected item (-1 if none)
select.value;            // Selected item's value

// Methods
select.add(option);                    // Add option at end
select.add(option, index);             // Add option at specified position
select.add(option, existingOption);    // Add option before specified option
select.remove(index);                  // Delete option at specified index

// Create option
// Option constructor: new Option(text, value, defaultSelected, selected)
const option1 = new Option('Japan', 'jp');
const option2 = new Option('Korea', 'kr', false, true); // Selected by default

select.add(option1);
select.add(option2, 0); // Insert at beginning

// Multiple select
// <select multiple>
// Get all selected items
const selected = Array.from(select.options).filter(opt => opt.selected);
`);

console.log("\n📋 Other Form Element Shortcuts:\n");
console.log(`
// Form element
form.elements;           // All controls in form
form.elements['name'];   // Access by name
form.length;             // Number of controls
form.submit();           // Submit form
form.reset();            // Reset form

// Input element
input.value;             // Current value
input.checked;           // Whether checked (checkbox/radio)
input.disabled;          // Whether disabled
input.readOnly;          // Whether read-only
input.select();           // Select text
input.focus();           // Get focus
input.blur();            // Lose focus

// Textarea
textarea.value;           // Current value
textarea.selectionStart; // Selection start position
textarea.selectionEnd;   // Selection end position
textarea.setSelectionRange(start, end);

// Table: rows, cells
// Select: options, selectedIndex
// Form: elements, length, submit(), reset()
`);

// ============================================
// Best Practices & Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Prefer modern methods (append/prepend/before/after/remove)");
console.log("2. Use DocumentFragment for bulk operations");
console.log("3. Detach element before complex operations (if possible)");
console.log("4. Use cloneNode to duplicate template structures");
console.log("5. Read/write separation, avoid forced synchronous layout");
console.log("6. Use CSS class toggles instead of multiple style modifications");
console.log("7. Use requestAnimationFrame for DOM updates in animations\n");

console.log("❌ DON'T:\n");
console.log("1. Don't frequently manipulate DOM in loops");
console.log("2. Don't use innerHTML for complex construction (XSS risk)");
console.log("3. Don't forget to modify id after cloneNode (duplicate IDs)");
console.log(
  "4. innerHTML = '' to empty container: modern engines GC removed children and their listeners (only leaks if you retain JS references to them)"
);
console.log("5. Don't mix reads and writes of styles in tight loops");
console.log(
  "6. Don't use anonymous functions for event listeners (can't remove)\n"
);

// 6. MutationObserver
// Watches DOM changes (childList, attributes, characterData, subtree) and delivers batches asynchronously
// Use cases: auto-save on contenteditable, detecting third-party DOM changes
// ⚠️ subtree:true is expensive on large DOM; always disconnect() to avoid leaks; callbacks are batched (microtask)

console.log("\n=== Section 6: MutationObserver Demo ===\n");

if (typeof MutationObserver === "undefined") {
  console.log(
    "⚠️ Non-browser environment, MutationObserver examples shown in code form"
  );

  console.log(`
// Basic usage: watch for changes to an element
const target = document.querySelector('#watched');

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    switch (mutation.type) {
      case 'childList':
        console.log('Added nodes:', mutation.addedNodes.length);
        console.log('Removed nodes:', mutation.removedNodes.length);
        if (mutation.addedNodes.length > 0) {
          // New nodes appeared — e.g. lazy-init content
        }
        break;
      case 'attributes':
        console.log('Attribute changed:', mutation.attributeName);
        console.log('Old value:', mutation.oldValue);
        console.log('New value:', mutation.target.getAttribute(mutation.attributeName));
        break;
      case 'characterData':
        console.log('Text changed from', mutation.oldValue, 'to', mutation.target.textContent);
        break;
    }
  }
});

// Configuration options (all booleans, default false unless noted):
observer.observe(target, {
  childList: true,            // Watch for added/removed child nodes
  attributes: true,           // Watch attribute changes
  characterData: true,        // Watch text content changes
  subtree: true,              // Watch ALL descendants too (costly!)
  attributeOldValue: true,    // Record previous attribute value in mutation.oldValue
  characterDataOldValue: true,// Record previous text in mutation.oldValue
  attributeFilter: ['class', 'id'],  // Only watch specific attributes (omit = all)
});

// Stop observing and flush pending records
observer.disconnect();

// Take records without waiting for callback (e.g. before cleanup)
const pending = observer.takeRecords();
`);
} else {
  // Browser environment demo (runnable with a real DOM)
  console.log(
    "✅ Browser environment detected — running MutationObserver demo"
  );

  // Create a target element if document exists
  const target = document.createElement("div");
  target.id = "watched";
  document.body?.appendChild(target);

  const mutationsLog = [];
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m =>
      mutationsLog.push({
        type: m.type,
        attributeName: m.attributeName,
        addedCount: m.addedNodes?.length || 0,
        removedCount: m.removedNodes?.length || 0,
      })
    );
  });

  observer.observe(target, {
    childList: true,
    attributes: true,
    attributeOldValue: true,
  });

  // Trigger mutations
  const child = document.createElement("span");
  child.textContent = "Hello";
  target.appendChild(child); // childList mutation
  target.setAttribute("class", "active"); // attributes mutation
  child.textContent = "World"; // characterData (NOT observed without subtree)

  // Force flush by disconnecting
  observer.disconnect();

  console.log("Mutations recorded:", mutationsLog.length);
  mutationsLog.forEach(m => console.log(" -", m));

  target.remove(); // cleanup
}

console.log("\n💡 MutationObserver vs other APIs:");
console.log("- Use IntersectionObserver for visibility (scroll/lazy-load)");
console.log("- Use ResizeObserver for size changes");
console.log("- Use MutationObserver for structural/attribute changes");
console.log("- Avoid polling with setInterval for DOM changes\n");

console.log("📚 Reference Documentation:\n");
console.log(
  "- MDN: https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement"
);
console.log("- javascript.info: https://javascript.info/modifying-document");
console.log("- DOM Living Standard: https://dom.spec.whatwg.org/");
console.log(
  "- High Performance Animations: https://web.dev/animations-guide/\n"
);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 35-dom-basics.js - DOM basics");
console.log("📘 37-events.js - Event handling");
console.log("📘 45-web-apis.js - Advanced Web APIs");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 36-dom-manipulation-ts-comparison.ts
*/
