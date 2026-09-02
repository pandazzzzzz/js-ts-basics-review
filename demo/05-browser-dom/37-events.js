// Event System Demo
// 📘 For TypeScript comparison, see: 37-events-ts-comparison.ts
// 📘 javascript.info Part 2 > "Introduction to Events", "UI Events"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/Events
// ⚠️ Browser environment only
// 🎯 Difficulty: Intermediate
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces the browser event system as the main way to respond to user interaction.
// The examples cover basic event binding, propagation, and common event patterns.

// ============================================
// Table of Contents
// ============================================
// 1. Event Basics
// 2. Event Bubbling and Capturing
// 3. Event Delegation
// 4. Browser Default Behavior
// 5. Common Event Types
// 6. Custom Events
// 7. Common Pitfalls
// 8. Best Practices & Summary

// 1. Event Basics
// Publish-subscribe model: multiple listeners, rich event object context
// Binding: addEventListener(type, handler, {capture, once, passive, signal}) is the modern way
// element.onclick = fn binds a single handler (later overwrites); inline HTML onclick is not recommended
// ⚠️ Watch `this` in handlers, remove listeners to avoid leaks

console.log("=== Section 1: Event Basics ===\n");

console.log("🎯 Three Ways to Bind Events:\n");

console.log("1. HTML Attribute Method (not recommended)");
console.log(`
// HTML: <button onclick="handleClick()">Click</button>
// Or inline code: <button onclick="alert('Hello')">Click</button>

// ❌ Drawbacks:
// - HTML mixed with JS, hard to maintain
// - Global function pollutes namespace
// - Can only bind one handler
`);

console.log("2. DOM Property Method (traditional way)");
console.log(`
// JavaScript:
element.onclick = function(event) {
  console.log('Clicked!');
};

// ❌ Drawbacks:
// - Can only bind one handler (later overwrites earlier)
// - Need to set to null when removing
// ✅ Benefits:
// - Simple and direct
`);

console.log("3. addEventListener (modern recommended method) - DOM Level 2+");
console.log(`
// Basic syntax
element.addEventListener(eventType, handler, options);

// Examples
element.addEventListener('click', handleClick);
element.addEventListener('click', handleClick, { once: true }); // Only execute once

// Options object (DOM API: capture/passive/once/signal)
element.addEventListener('click', handler, {
  capture: false,    // Whether to trigger in capture phase
  once: false,       // Whether to trigger only once
  passive: false     // Whether preventDefault() will not be called
});

// ✅ Benefits:
// - Can bind multiple handlers
// - Fine control over event behavior
// - Better memory management
`);

console.log("\n🔧 addEventListener / removeEventListener:\n");
console.log(`
// Add listener
element.addEventListener('click', onClick);

// Remove listener ⚠️ Must use same function reference!
element.removeEventListener('click', onClick);

// ❌ Wrong: Anonymous function cannot be removed
element.addEventListener('click', () => {});
element.removeEventListener('click', () => {}); // Different function, cannot remove!

// ✅ Correct: Use named function
function onClick(e) {
  console.log('clicked');
}
element.addEventListener('click', onClick);
element.removeEventListener('click', onClick);

// ✅ Or use AbortController (WHATWG DOM Living Standard, not ECMAScript)
const controller = new AbortController();
element.addEventListener('click', onClick, { signal: controller.signal });
controller.abort(); // Remove all listeners using this signal at once
`);

console.log("\n📦 Event Object (Event Object):\n");
console.log(`
// Event handler receives Event object as parameter
element.addEventListener('click', function(event) {
  // Common properties:
  event.type;           // "click" - Event type
  event.target;         // Actual element that triggered the event
  event.currentTarget;  // Element currently handling event (equals this)
  event.timeStamp;      // Timestamp when event occurred

  // Mouse event specific:
  event.clientX;        // Viewport X coordinate
  event.clientY;        // Viewport Y coordinate
  event.pageX;          // Page X coordinate (includes scroll)
  event.pageY;          // Page Y coordinate (includes scroll)
  event.button;         // 0=left, 1=middle, 2=right

  // Keyboard event specific:
  event.key;            // Key character (e.g., "Enter", "a")
  event.code;           // Physical key code (e.g., "KeyA", "Enter")
  event.ctrlKey;        // Ctrl key pressed?
  event.shiftKey;       // Shift key pressed?
  event.altKey;         // Alt key pressed?
  event.metaKey;        // Meta (Win/Cmd) key pressed?

  // Form event specific:
  event.target.value;   // Input value
});
`);

console.log("\n⚠️ `this` in Event Handlers:\n");
console.log(`
// Regular function: this = currentTarget
element.addEventListener('click', function(e) {
  console.log(this === e.currentTarget); // true
  console.log(this === element);         // true
});

// Arrow function: this = outer scope's this ⚠️
element.addEventListener('click', (e) => {
  console.log(this); // window or outer this, not element!
});
`);

console.log("\n📝 Multiple Handlers Execution Order:\n");
console.log(`
// Multiple handlers on same element, executed in order added
element.addEventListener('click', () => console.log('1'));
element.addEventListener('click', () => console.log('2'));
element.addEventListener('click', () => console.log('3'));
// Output: 1, 2, 3

// Using { once: true } for one-time listener
element.addEventListener('click', () => console.log('once'), { once: true });
`);

// 2. Event Propagation: Capturing → Target → Bubbling
// Most events bubble; default listeners run in the bubble phase, capture phase runs top-down first
// stopPropagation() halts further propagation (⚠️ use sparingly); stopImmediatePropagation() also stops other listeners
// Delegation relies on bubbling — a single parent listener handles events from many children

console.log("\n=== Section 2: Event Bubbling and Capturing ===\n");

console.log("🌊 Event Propagation Three Phases:\n");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│                     Event Propagation Flow                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                             │
│   1. CAPTURING PHASE (Capture phase)                       │
│      ↓                                                      │
│      window → document → html → body → div#parent → div#target │
│                                                             │
│   2. TARGET PHASE (Target phase)                                 │
│      ←←←←←←←←←←← div#target (actually clicked element)      │
│                                                             │
│   3. BUBBLING PHASE (Bubble phase)                               │
│      ↑                                                      │
│      div#target → div#parent → body → html → document → window │
│                                                             │
└─────────────────────────────────────────────────────────────────────┘

// By default, listeners only trigger in bubble phase
element.addEventListener('click', handler);        // Bubble phase
element.addEventListener('click', handler, false); // Same as above (explicit)

// Trigger in capture phase
element.addEventListener('click', handler, true);  // Capture phase
// Or
element.addEventListener('click', handler, { capture: true });
`);

console.log("\n🛑 Stop Event Propagation:\n");
console.log(`
// 1. stopPropagation() - Stop continuing propagation
//    But doesn't stop other listeners on current element
element.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('This executes, but doesn\'t bubble to parent');
});

element.addEventListener('click', () => {
  console.log('This also executes (other listener on same element)');
});

// 2. stopImmediatePropagation() - Complete stop
//    Prevents current element's subsequent listeners from executing
element.addEventListener('click', (e) => {
  e.stopImmediatePropagation();
  console.log('Only this will execute');
});

element.addEventListener('click', () => {
  console.log('This won\'t execute!');
});
`);

console.log("\n⚠️ Events That Don't Bubble:\n");
console.log(`
// Following events don't bubble, can't use event delegation:
// - focus
// - blur
// - mouseenter
// - mouseleave
// - unload
// - load (both window.load AND element load events on img/script/link do NOT bubble)

// Alternative: Use focusin/focusout instead of focus/blur (they bubble)
// - Use mouseover/mouseout instead of mouseenter/mouseleave
`);

// 3. Event Delegation
// Bind one listener on a parent, use event.target to find the clicked child (reduces listeners, supports dynamic content)
// Use closest(selector) to filter targets; ⚠️ guard against clicks outside the target area

console.log("\n=== Section 3: Event Delegation ===\n");

console.log("💡 Event Delegation Principle:\n");
console.log(`
// Traditional approach: Bind event for each button (100 buttons = 100 listeners）
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// Event delegation: Bind one listener on parent element
container.addEventListener('click', (e) => {
  if (e.target.matches('.btn')) {
    handleClick(e);
  }
});
// ✅ Regardless of how many buttons, only one listener
// ✅ Dynamically added buttons also work automatically
`);

console.log("\n🎯 event.target vs event.currentTarget:\n");
console.log(`
<ul id="list">
  <li>Item 1 <button>Delete</button></li>
  <li>Item 2 <button>Delete</button></li>
</ul>

<script>
list.addEventListener('click', (e) => {
  // event.target: Actually clicked element (could be button or li）
  console.log(e.target.tagName);      // "BUTTON" or "LI"

  // event.currentTarget: Element with bound listener (list）
  console.log(e.currentTarget.id);    // "list"

  // Find nearest matching ancestor (search from target upward）
  const li = e.target.closest('li');  // Find closest <li>
});
</script>
`);

console.log("\n🏗️ Complete Event Delegation Example:\n");
console.log(`
// HTML:
// <table id="data-table">
//   <tr><td>Row 1</td><td><button data-action="edit">Edit</button></td></tr>
//   <tr><td>Row 2</td><td><button data-action="delete">Delete</button></td></tr>
// </table>

const table = document.getElementById('data-table');

table.addEventListener('click', (e) => {
  // Method 1: Use matches check
  if (e.target.matches('button[data-action]')) {
    const action = e.target.dataset.action;
    const row = e.target.closest('tr');

    switch (action) {
      case 'edit':
        editRow(row);
        break;
      case 'delete':
        deleteRow(row);
        break;
    }
  }

  // Method 2: Use closest (more robust, handles child element clicks）
  const button = e.target.closest('button[data-action]');
  if (button) {
    const action = button.dataset.action;
    // ...
  }
});

function editRow(row) {
  console.log('Editing:', row.cells[0].textContent);
}

function deleteRow(row) {
  row.remove();
}
`);

console.log("\n✨ data-action Behavior Pattern:\n");
console.log(`
<!-- HTML: Declarative behavior markup -->
<div id="toolbar">
  <button data-action="save">Save</button>
  <button data-action="load">Load</button>
  <button data-action="reset">Reset</button>
</div>

<script>
// JavaScript: Behavior mapping
const actions = {
  save: () => console.log('Saving...'),
  load: () => console.log('Loading...'),
  reset: () => console.log('Resetting...')
};

toolbar.addEventListener('click', (e) => {
  const button = e.target.closest('[data-action]');
  if (!button) return;

  const actionName = button.dataset.action;
  const action = actions[actionName];

  if (action) {
    action();
  } else {
    console.warn('Unknown action:', actionName);
  }
});
</script>
`);

// 4. Browser Default Behavior
// preventDefault() cancels built-in behavior (link navigation, form submit, context menu)
// Many events are cancelable; check event.defaultPrevented to detect if a listener already canceled
// passive: true listeners cannot cancel the event — preventDefault() is ignored
// (with a console warning), it does not throw; good for scroll performance

console.log("\n=== Section 4: Browser Default Behavior ===\n");

console.log("🚫 Prevent Default Behavior:\n");
console.log(`
// Common default behaviors:
// - Click on link navigates to href
// - Submit form reloads page
// - Right-click shows menu
// - Drag opens file

// Prevent default behavior
link.addEventListener('click', (e) => {
  e.preventDefault();  // Stop link navigation
  console.log('Link clicked but not navigated');
});

form.addEventListener('submit', (e) => {
  if (!isValid) {
    e.preventDefault();  // Stop form submission
    showErrors();
  }
});

// Stop right-click menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  showCustomMenu();
});
`);

console.log("\n✅ Check Default Behavior Prevention:\n");
console.log(`
link.addEventListener('click', (e) => {
  e.preventDefault();
  console.log(e.defaultPrevented);  // true
});

// Another listener can check
link.addEventListener('click', (e) => {
  if (e.defaultPrevented) {
    console.log('Already handled by other listener');
    return;
  }
});
`);

console.log("\n🚀 passive Option for Scroll Performance:\n");
console.log(`
// Problem: Scroll event listener might block main thread
// Solution: { passive: true }

// ❌ May cause lag (browser waits if you'll call preventDefault）
document.addEventListener('scroll', onScroll);

// ✅ Smooth scroll (tell browser you won't prevent default）
document.addEventListener('scroll', onScroll, { passive: true });

// ⚠️ Passive listeners cannot call preventDefault!
document.addEventListener('touchstart', (e) => {
  e.preventDefault();  // ❌ Ignored, console warning
}, { passive: true });

// Chrome treats touchstart/touchmove/wheel as passive by default, but ONLY for
// listeners on document/window/document.body (not other elements).
// If you need to prevent, explicitly set passive: false.
document.addEventListener('wheel', (e) => {
  e.preventDefault();  // ✅ Valid
}, { passive: false });
`);

console.log("\n📋 Common Cancelable Default Behaviors:\n");
console.log(`
┌──────────────────────┬─────────────────────────────────┐
│ Event                │ Default Behavior                    │
├──────────────────────┼─────────────────────────────────┤
│ click (on <a>)       │ Navigate to href                   │
│ submit (on <form>)   │ Submit form, reload page          │
│ keydown (Tab)        │ Move focus to next element          │
│ contextmenu          │ Show browser context menu            │
│ dragstart            │ Start drag and drop operation       │
│ wheel / scroll       │ Scroll page (only wheel is cancelable) │
│ touchmove            │ Pan/scroll on touch devices        │
│ beforeunload         │ Show "Leave site?" confirmation    │
└──────────────────────┴─────────────────────────────────┘
`);

// 5. Common Event Types
// Mouse: click/dblclick/mouseover (bubbles, includes children) vs mouseenter (no bubble, self only)
// Keyboard: keydown/keyup (any key, keyCode)/keypress (char only, deprecated); input (any change) vs change (fires on blur for text)
// Focus: focus/blur (no bubble) vs focusin/focusout (bubble); scroll (no bubble) vs wheel; load/DOMContentLoaded
// Pointer Events unify mouse/touch/pen: pointerdown/up/move/enter/leave

console.log("\n=== Section 5: Common Event Types ===\n");

console.log("🖱️ Mouse Events:\n");
console.log(`
// Basic click events
click       - Single click (press and release）
dblclick    - Double click

// Press/release (order: mousedown → mouseup → click）
mousedown   - Mouse button pressed
mouseup     - Mouse button released

// Movement related
mousemove   - Mouse moves (triggers frequently, needs throttling）
mouseover   - Enter element (bubbles）
mouseout    - Leave element (bubbles）
mouseenter  - Enter element (doesn't bubble）⚠️
mouseleave  - Leave element (doesn't bubble）⚠️

// Others
contextmenu - Right-click menu (can be blocked）
wheel       - Scroll wheel

// Mouse event object properties
element.addEventListener('click', (e) => {
  e.clientX, e.clientY;  // Relative to viewport
  e.pageX, e.pageY;      // Relative to page (including scroll）
  e.offsetX, e.offsetY;  // Relative to target element
  e.button;              // 0=left, 1=middle, 2=right
  e.buttons;             // Bitmask indicating which buttons pressed
  e.ctrlKey, e.shiftKey; // Modifier key states
  e.target;              // Clicked target element
});
`);

console.log("\n⌨️ Keyboard Events:\n");
console.log(`
// Event order: keydown → keypress (deprecated）→ keyup
keydown   - Key pressed (repeats while held）
keyup     - Key released

// ⚠️ keypress is deprecated, don't use!

// Keyboard event object properties
document.addEventListener('keydown', (e) => {
  // key: Character value (considers layout）
  e.key;        // "a", "A", "Enter", "ArrowUp", "Escape"

  // code: Physical position (doesn't consider layout）
  e.code;       // "KeyA", "Enter", "ArrowUp"

  // Modifier keys
  e.ctrlKey;    // Ctrl pressed
  e.shiftKey;   // Shift pressed
  e.altKey;     // Alt pressed
  e.metaKey;    // Win/Cmd pressed

  // Whether repeated (held down）
  e.repeat;     // true/false

  // Combination keys example
  if (e.ctrlKey && e.key === 's') {
    e.preventDefault();  // Stop page save
    saveDocument();
  }
});

// Input restriction example (numbers only）
input.addEventListener('keydown', (e) => {
  if (!/[0-9]/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
});
`);

console.log("\n📝 Form Events:\n");
console.log(`
// Focus events
focus       - Element gets focus (doesn't bubble）
blur        - Element loses focus (doesn't bubble）
focusin      - Element gets focus (bubbles）✨
focusout     - Element loses focus (bubbles）✨

// Input events
input       - Value changes (real-time, every input triggers）
change      - Value changes and loses focus (or dropdown selects immediately）

// Form submit
submit      - Form submit (click submit button or press Enter）
reset       - Form reset

// Form event examples
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  // Submit data...
});

input.addEventListener('input', (e) => {
  // Real-time validation
  validateRealTime(e.target.value);
});

input.addEventListener('change', (e) => {
  // Final validation
  validateFinal(e.target.value);
});

// Difference: input vs change
// <input type="text">
//   input:  Triggers for each character entered
//   change: Triggers when focus lost and value changed
// <select>
//   input:  Option changes immediately
//   change: Option changes immediately (same）
`);

console.log("\n📜 Scroll Events:\n");
console.log(`
// Page scroll
window.addEventListener('scroll', () => {
  console.log(window.scrollY);  // Vertical scroll distance
  console.log(window.scrollX);  // Horizontal scroll distance
});

// Element scroll
element.addEventListener('scroll', () => {
  console.log(element.scrollTop);   // Element internal scroll distance
  console.log(element.scrollHeight); // Total scroll height
});

// Use passive for optimization
window.addEventListener('scroll', handleScroll, { passive: true });
`);

console.log("\n🔄 Page Lifecycle Events:\n");
console.log(`
// Document loading state
document.readyState:
  - "loading"   - DOM is loading
  - "interactive" - DOM is ready, images etc. still loading
  - "complete"  - All resources loaded

// Key events
DOMContentLoaded  - DOM parsed, can safely manipulate DOM
load              - All resources loaded (images, styles, etc.）
beforeunload      - Page about to unload (can show confirmation dialog）
unload            - Page is unloading (cleanup work）
visibilitychange  - Page visibility changes (switching tabs）

// Usage examples
document.addEventListener('DOMContentLoaded', () => {
  // DOM ready, initialize code
  initializeApp();
});

window.addEventListener('load', () => {
  // All resources loaded
  hideLoader();
});

// beforeunload: setting e.returnValue (or returning a string) is the cross-browser
// requirement; preventDefault() alone is not reliably honored in Chromium.
// Custom messages are no longer shown in modern browsers (generic dialog only).
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';  // Required for cross-browser behavior
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    pauseVideo();
  } else {
    resumeVideo();
  }
});
`);

console.log("\n📝 Pointer Events (Unified Input):\n");
console.log(`
// Pointer Events — Unified API for mouse, touch, and pen input
// Replaces separate mouse + touch event handling
// pointerdown, pointermove, pointerup, pointercancel
// PointerEvent properties: pointerId, pointerType, pressure
// Set pointer capture: element.setPointerCapture(e.pointerId);

// Pointer event object properties
element.addEventListener('pointerdown', (e) => {
  e.pointerId;     // Unique identifier for this pointer (multi-touch)
  e.pointerType;   // "mouse" | "touch" | "pen"
  e.pressure;      // 0 (no pressure) to 1 (max); 0.5 for mouse with button held
  e.isPrimary;     // true for the first/primary pointer
  e.width, e.height; // Contact geometry (touch) in CSS pixels
});

// Pointer capture — keep receiving events even if pointer leaves the element
element.addEventListener('pointerdown', (e) => {
  element.setPointerCapture(e.pointerId); // track this pointer
});

// Coalesced events — combine rapid moves for performance
element.addEventListener('pointermove', (e) => {
  const events = e.getCoalescedEvents(); // batched move events
});

// ⚠️ pointer events vs mouse events:
//   - Use pointer events for new code (unify mouse/touch/pen)
//   - Mouse events still fire for compatibility
//   - Disable touch-action to prevent gestures conflicting with pointer handlers
`);

console.log("\n🖱️ Wheel Events:\n");
console.log(`
// wheel — mouse wheel / trackpad (DOES bubble; fires on the element under the
// pointer, which may differ from the element that actually scrolls)
element.addEventListener('wheel', (e) => {
  e.deltaY;    // Vertical scroll amount (+ down, - up)
  e.deltaX;    // Horizontal scroll amount
  e.deltaMode; // 0 = pixels, 1 = lines, 2 = pages
  // Note: delta values vary by platform/browser — normalize before using
});

// ⚠️ Chrome treats wheel/touchstart/touchmove listeners on window/document/body
// as passive by default (since Chrome 73/56); most other browsers now do too.
// If you do need preventDefault on those targets, pass { passive: false } explicitly:
window.addEventListener('wheel', handler, { passive: false });

// Do NOT use wheel to implement custom scrolling on a scrollable element —
// it conflicts with native scroll. Use native scroll + scroll events instead.
`);

console.log("\n🖱️ Drag and Drop API:\n");
console.log(`
// Native drag-and-drop. Make element draggable: element.draggable = true
// Drag source: dragstart, drag, dragend
// Drop target: dragenter, dragover (must preventDefault), dragleave, drop
// Use e.dataTransfer.setData/getData for data sharing

// Draggable source
element.draggable = true;
element.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', element.id); // share data
  e.dataTransfer.effectAllowed = 'move'; // 'copy' | 'move' | 'link'
});

// Drop target — must preventDefault on dragover to allow drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();               // REQUIRED to allow drop
  e.dataTransfer.dropEffect = 'move';
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  const dragged = document.getElementById(id);
  dropZone.appendChild(dragged);
});

// Drag end (on the source)
element.addEventListener('dragend', (e) => {
  // e.dataTransfer.dropEffect tells whether drop succeeded
});
`);

// 6. Custom Events
// new Event(name, {bubbles, cancelable}) or new CustomEvent(name, {detail}) to carry data
// Dispatch with element.dispatchEvent(event); listen like any native event
// ⚠️ Set bubbles:true if you need delegation; detail is read-only

console.log("\n=== Section 6: Custom Events ===\n");

console.log("🎨 Create Custom Events:\n");
console.log(`
// 1. Basic custom event
const myEvent = new Event('myevent', {
  bubbles: true,      // Whether to bubble
  cancelable: true    // Whether preventDefault can be called
});

// 2. Custom event with data (recommended）
const userEvent = new CustomEvent('user:login', {
  bubbles: true,
  cancelable: true,
  detail: {           // Data to pass
    userId: 123,
    username: 'john',
    timestamp: Date.now()
  }
});
`);

console.log("\n📢 Trigger Custom Events:\n");
console.log(`
// Trigger custom event
element.dispatchEvent(myEvent);

// Complete example
class UserManager extends EventTarget {
  login(userData) {
    // Login logic...

    // Trigger login success event
    this.dispatchEvent(new CustomEvent('login', {
      detail: userData
    }));
  }

  logout() {
    // Logout logic...

    this.dispatchEvent(new CustomEvent('logout'));
  }
}

const userManager = new UserManager();

// Listen to event
userManager.addEventListener('login', (e) => {
  console.log('User logged in:', e.detail.username);
  updateUI(e.detail);
});

userManager.addEventListener('logout', () => {
  console.log('User logged out');
  clearUI();
});

// Use
userManager.login({ userId: 1, username: 'john' });
`);

console.log("\n🔗 Component Communication Example:\n");
console.log(`
// Cart component publishes events
class ShoppingCart {
  addItem(product) {
    this.items.push(product);

    document.dispatchEvent(new CustomEvent('cart:updated', {
      bubbles: true,
      detail: {
        items: this.items,
        total: this.calculateTotal()
      }
    }));
  }
}

// Other components listen to event
// Header component updates cart count
document.addEventListener('cart:updated', (e) => {
  badge.textContent = e.detail.items.length;
});

// Sidebar component updates total price
document.addEventListener('cart:updated', (e) => {
  totalElement.textContent = '$' + e.detail.total;
});

// Toast component shows notification
document.addEventListener('cart:updated', (e) => {
  showToast(\`Added! \${e.detail.items.length} items in cart\`);
});
`);

// ============================================
// 7. Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===\n");

console.log("\nPitfall 1: Forgetting to remove event listeners");
console.log("  Listeners on removed elements can leak memory.");
console.log("  Fix: Use AbortController or store handler references to remove.");

console.log("\nPitfall 2: Using onclick instead of addEventListener");
console.log("  onclick overwrites the previous handler.");
console.log("  Fix: Always use addEventListener for multiple handlers.");

console.log("\nPitfall 3: Anonymous functions can't be removed");
console.log("  removeEventListener needs the same function reference.");
console.log("  Fix: Name the handler or keep a reference.");

console.log("\nPitfall 4: Ignoring event object properties");
console.log("  e.target vs e.currentTarget differ during bubbling.");
console.log("  Fix: currentTarget is the listener element, target is the origin.");

console.log("\nPitfall 5: Adding too many listeners on similar elements");
console.log("  Hundreds of listeners hurt performance and memory.");
console.log("  Fix: Use event delegation on a common ancestor.");

console.log("\nPitfall 6: Event propagation surprises");
console.log("  preventDefault() does NOT stop propagation.");
console.log("  Fix: Use stopPropagation/stopImmediatePropagation explicitly.");

// ============================================
// 8. Best Practices & Summary
// ============================================

console.log("\n=== Best Practices & Summary ===\n");

console.log("✅ DO:\n");
console.log("1. Always use addEventListener instead of onclick");
console.log("2. Use event delegation for many similar elements");
console.log("3. Use { passive: true } for scroll/touch events");
console.log("4. Remove event listeners when no longer needed");
console.log("5. Use AbortController to batch manage listeners");
console.log("6. Use custom events for component decoupling");
console.log("7. Use stopPropagation carefully to avoid breaking other logic");
console.log("8. Use closest() for event delegation target filtering\n");

console.log("❌ DON'T:\n");
console.log("1. Don't bind events in loops for each element");
console.log("2. Don't forget to remove listeners causing memory leaks");
console.log("3. Don't call preventDefault() in passive listeners");
console.log("4. Don't overuse stopPropagation");
console.log("5. Don't use anonymous functions as listeners (can't remove）");
console.log("6. Don't confuse target and currentTarget");
console.log("7. Don't forget old browser compatibility (if needed）\n");

console.log("📚 Reference Documentation:\n");
console.log("- MDN: https://developer.mozilla.org/en-US/docs/Web/Events");
console.log("- javascript.info: https://javascript.info/events");
console.log("- UI Events: https://www.w3.org/TR/uievents/");
console.log("- Custom Events: https://dom.spec.whatwg.org/#interface-customevent\n");

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 35-dom-basics.js - DOM basics");
console.log("📘 36-dom-manipulation.js - DOM manipulation");
console.log("📘 38-forms-validation.js - Forms and validation");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 37-events-ts-comparison.ts
*/
