// Event System Demo
// 📘 For TypeScript comparison, see: 37-events-ts-comparison.ts
// 📘 javascript.info Part 2 > "Introduction to Events", "UI Events"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/Events
// ⚠️ Browser environment only

// ============================================
// Section 1: Event Basics
// ============================================
// Description: The DOM event system is the core mechanism for user interaction and programmatic response
// ES Spec: DOM Level 2 Events, DOM Living Standard
// Characteristics:
//   - Based on publish-subscribe pattern
//   - Supports multiple listeners
//   - Event objects contain rich context information
// Use Cases: User interaction, state synchronization, component communication
// Common Pitfalls: `this` pointing issues, memory leaks, event delegation misuse

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

// ============================================
// Section 2: Event Bubbling and Capturing
// ============================================
// Description: The three-phase mechanism for event propagation
// ES Spec: DOM Level 3 Events
// Characteristics:
//   - Default triggers in bubble phase
//   Capture phase is rarely used directly
//   - Propagation can be stopped
// Use Cases: Event delegation relies on bubbling, capture for special interception
// Common Pitfalls: stopPropagation abuse affecting other logic

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

// ============================================
// Section 3: Event Delegation
// ============================================
// Description: Using bubbling mechanism to handle child elements' events on parent
// Pattern: Behavior pattern, data-driven
// Characteristics:
//   - Reduces memory usage
//   - Automatically supports dynamically added elements
//   - Needs target element filtering
// Use Cases: List operations, dynamic content, table interactions
// Common Pitfalls: target selector inaccurate, ignoring non-target elements

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

// ============================================
// Section 4: Browser Default Behavior
// ============================================
// Description: Browser built-in interaction behaviors and how to control them
// ES Spec: DOM Living Standard
// Characteristics:
//   - Most are cancelable
//   - passive option optimizes scroll performance
//   - Should not be over-prevented
// Use Cases: Form validation, SPA navigation, custom controls
// Common Pitfalls: Forgetting to check defaultPrevented, passive listeners calling preventDefault

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
│ wheel / scroll       │ Scroll page                          │
│ touchmove            │ Pan/scroll on touch devices        │
│ beforeunload         │ Show "Leave site?" confirmation    │
└──────────────────────┴─────────────────────────────────┘
`);

// ============================================
// Section 5: Common Event Types
// ============================================
// Description: Various standard events and their properties
// ES Spec: UI Events, Input Events, etc.
// Characteristics:
//   - Different event types have different event object properties
//   - Some events have specific methods
// Use Cases: Comprehensive coverage of user interaction scenarios
// Common Pitfalls: Confusing mouseover/mouseenter, input/change

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
`);

console.log("\n📝 Drag and Drop API:\n");
console.log(`
// Native drag-and-drop. Make element draggable: element.draggable = true
// Drag source: dragstart, drag, dragend
// Drop target: dragenter, dragover (must preventDefault), dragleave, drop
// Use e.dataTransfer.setData/getData for data sharing
`);


// ============================================
// Section 6: Custom Events
// ============================================
// Description: Creating and triggering custom events for component communication
// ES Spec: DOM Level 4
// Characteristics:
//   - CustomEvent can carry arbitrary data
//   - Supports bubbling and capturing
//   - Fully type-safe (in TS）
// Use Cases: Component decoupled communication, plugin system, status notifications
// Common Pitfalls: Forgetting to set bubbles, object reference issues in detail

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
// Best Practices & Summary
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
// TypeScript Comparison Notes
// ============================================
/*
🔍 TYPESCRIPT VS JAVASCRIPT - EVENT SYSTEM TYPE DIFFERENCES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. PRECISE EVENT TYPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  element.addEventListener('click', (e) => {
    e.clientX;  // ✅ Available but no type checking
  });

TypeScript:
  // Auto-infers event type
  element.addEventListener('click', (e: MouseEvent) => {
    e.clientX;  // ✅ Precise type
    e.key;      // ❌ Error: Property 'key' does not exist on MouseEvent
  });

  // Available precise event types:
  // MouseEvent, KeyboardEvent, FocusEvent, InputEvent, WheelEvent,
  // TouchEvent, DragEvent, ClipboardEvent, AnimationEvent, TransitionEvent

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2. GENERIC SELECTOR METHODS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JavaScript:
  const input = document.querySelector('#name');
  input.value;  // Runtime error possible

TypeScript:
  const input = document.querySelector<HTMLInputElement>('#name');
  // input: HTMLInputElement | null

  if (input) {
    input.value;  // ✅ Type safe
  }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3. EventListener INTERFACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Function form
type ClickHandler = (event: MouseEvent) => void;
const handler: ClickHandler = (e) => {
  console.log(e.clientX);
};

// Object form (handleEvent method）
const listenerObject: EventListenerObject = {
  handleEvent(e: Event) {
    console.log(e.type);
  }
};

element.addEventListener('click', listenerObject);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
4. CUSTOM EVENT TYPE SAFETY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Define event data interface
interface LoginDetail {
  userId: number;
  username: string;
}

// Type-safe custom event
const loginEvent = new CustomEvent<LoginDetail>('login', {
  detail: { userId:1, username: 'john' }
});

// Listening with type inference
document.addEventListener('login', (e: CustomEvent<LoginDetail>) => {
  e.detail.userId;      // ✅ number
  e.detail.username;    // ✅ string
  e.detail.nonexistent; // ❌ Error
});

// Extend HTMLElementEventMap for global type support
declare global {
  interface HTMLElementEventMap {
    'user:login': CustomEvent<LoginDetail>;
  }
}

// Now addEventListener auto-recognizes type
document.addEventListener('user:login', (e) => {
  e.detail.username;  // Auto-inferred as string
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
5. EVENT DELEGATION TYPE SAFETY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Type-safe event delegation utility
function delegate<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement
>(
  parent: HTMLElement,
  eventType: K,
  selector: string,
  handler: (event: HTMLElementEventMap[K], target: T) => void
) {
  parent.addEventListener(eventType, (e) => {
    const target = (e.target as HTMLElement).closest(selector);
    if (target) {
      handler(e as HTMLElementEventMap[K], target as T);
    }
  });
}

// Usage
delegate(document, 'click', '.btn', (e, target) => {
  // e: MouseEvent
  // target: HTMLElement (based on selector can be more precise)
  console.log(target.textContent);
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
6. THIS TYPE ISSUES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ❌ Arrow function: this is not element
element.addEventListener('click', (e) => {
  this;  // Outer this, not element
});

// ✅ Regular function: this is element (needs type assertion）
element.addEventListener('click', function(this: HTMLElement, e) {
  this.classList.add('active');  // ✅ this is HTMLElement
});

// ✅ Or use currentTarget
element.addEventListener('click', (e) => {
  const target = e.currentTarget as HTMLElement;
  target.classList.add('active');
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📘 SUMMARY: TYPESCRIPT EVENT SYSTEM ADVANTAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Compile-time catches event type errors
✅ Precise DOM element types
✅ Custom event type safety
✅ Better IDE completion
✅ Refactoring is safer

⚠️ Notes:
  - Note null checks (querySelector returns possibly null）
  - Correct use type assertions for event.target
  - Arrow function's `this` issues

🎯 RECOMMENDATION: Complex interactive applications strongly recommend TypeScript!
*/
