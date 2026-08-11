// Storage and Advanced Network Requests Demo
// 📘 For TypeScript comparison, see: 43-storage-network-ts-comparison.ts
// 📘 javascript.info Part 3 > "Storing data", "Network requests"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
// ⚠️ Most content is browser-specific

// ============================================
// Learning goals
// ============================================
// This file introduces browser storage and advanced network patterns that are common in modern web applications.
// The sections move from simple storage APIs to more advanced network communication techniques.

// ============================================
// Table of Contents
// ============================================

// 1. localStorage & sessionStorage
// 2. Cookies
// 3. IndexedDB
// 4. History API (Browser Navigation)
// 5. Fetch Advanced (Complements 33-fetch-api.js)
// 6. WebSocket
// 7. Server-Sent Events (SSE) - DETAILED
// 8. BroadcastChannel API

// ============================================

// ============================================
// Section 1: localStorage & sessionStorage
// ============================================

console.log("\n=== localStorage & sessionStorage ===");

// Web Storage API - Simple key-value storage
// - localStorage: Persists across browser sessions
// - sessionStorage: Cleared when tab/window closes

// Browser-only code (commented for Node.js compatibility):
// localStorage.setItem('username', 'Alice');
// console.log('Get item:', localStorage.getItem('username')); // "Alice"
// localStorage.removeItem('username');
// localStorage.clear(); // Remove all items

// sessionStorage.setItem('sessionId', '12345');
// console.log('Session:', sessionStorage.getItem('sessionId'));

console.log("localStorage:");
console.log("- Persists across browser sessions");
console.log("- Shared across all tabs/windows of same origin");
console.log("- ~5-10MB storage limit (varies by browser)");
console.log("- Synchronous API");
console.log("- Only stores strings");

console.log("\nsessionStorage:");
console.log("- Cleared when tab/window closes");
console.log("- Separate for each tab/window");
console.log("- Same storage limit as localStorage");
console.log("- Useful for temporary data");

// Storing objects (requires JSON serialization)
const user = { name: "Alice", age: 30, roles: ["admin", "user"] };
// localStorage.setItem('user', JSON.stringify(user));
// const retrieved = JSON.parse(localStorage.getItem('user'));
console.log("\nStoring objects:");
console.log("- Use JSON.stringify() to store");
console.log("- Use JSON.parse() to retrieve");
console.log("- Be careful with circular references");

// Storage event - Cross-tab communication
// window.addEventListener('storage', (e) => {
//   console.log('Storage changed:');
//   console.log('Key:', e.key);
//   console.log('Old value:', e.oldValue);
//   console.log('New value:', e.newValue);
//   console.log('URL:', e.url);
//   console.log('Storage area:', e.storageArea);
// });

console.log("\nStorage event:");
console.log("- Fires when storage changes in OTHER tabs");
console.log("- Doesn't fire in the tab that made the change");
console.log("- Useful for syncing state across tabs");

// ============================================
// Section 2: Cookies
// ============================================

console.log("\n=== Cookies ===");

// Cookies - Small text data stored by browser
// - Sent with every HTTP request to the domain
// - Can be set by server (Set-Cookie header) or client (document.cookie)

// Reading cookies (browser):
// console.log('All cookies:', document.cookie);
// Returns: "name1=value1; name2=value2; name3=value3"

// Writing cookies (browser):
// document.cookie = "username=Alice";
// document.cookie = "theme=dark; max-age=3600"; // Expires in 1 hour

console.log("Cookie attributes:");
console.log("\n1. path=/");
console.log("   - Cookie available for this path and subpaths");
console.log("   - Default: current path");

console.log("\n2. domain=example.com");
console.log("   - Cookie available for this domain and subdomains");
console.log("   - Default: current domain only");

console.log("\n3. expires=<date>");
console.log("   - Absolute expiration date");
console.log("   - Example: expires=Wed, 31 Dec 2025 23:59:59 GMT");

console.log("\n4. max-age=<seconds>");
console.log("   - Relative expiration time");
console.log("   - Example: max-age=3600 (1 hour)");
console.log("   - Overrides expires if both present");

console.log("\n5. secure");
console.log("   - Only sent over HTTPS");
console.log("   - Required for sensitive data");

console.log("\n6. httpOnly");
console.log("   - Not accessible via JavaScript");
console.log("   - Only sent in HTTP requests");
console.log("   - Prevents XSS attacks");
console.log("   - Can only be set by server");

console.log("\n7. samesite=<strict|lax|none>");
console.log("   - strict: Only sent for same-site requests");
console.log("   - lax: Sent for top-level navigation");
console.log("   - none: Sent for all requests (requires secure)");
console.log("   - Prevents CSRF attacks");

// Example: Setting a cookie with attributes
// document.cookie = "sessionId=abc123; path=/; max-age=3600; secure; samesite=strict";

// Cookie limitations
console.log("\nCookie limitations:");
console.log("- ~4KB size limit per cookie");
console.log("- ~20-50 cookies per domain (varies)");
console.log("- Sent with every request (bandwidth overhead)");
console.log("- Can be disabled by user");

// localStorage vs Cookies
console.log("\nlocalStorage vs Cookies:");
console.log("localStorage:");
console.log("  ✓ Larger storage (~5MB)");
console.log("  ✓ Not sent with requests");
console.log("  ✓ Simpler API");
console.log("  ✗ No expiration");
console.log("  ✗ No server access");

console.log("\nCookies:");
console.log("  ✓ Sent with requests (server access)");
console.log("  ✓ Expiration control");
console.log("  ✓ httpOnly for security");
console.log("  ✗ Smaller size (~4KB)");
console.log("  ✗ Bandwidth overhead");

// ============================================
// Section 3: IndexedDB
// ============================================

console.log("\n=== IndexedDB ===");

// IndexedDB - Low-level API for client-side storage
// - NoSQL database in the browser
// - Stores large amounts of structured data
// - Supports indexes for fast queries
// - Asynchronous API (event-based or Promise-based)

console.log("IndexedDB concepts:");
console.log("- Database: Container for object stores");
console.log("- Object Store: Like a table in SQL");
console.log("- Index: Fast lookup by property");
console.log("- Transaction: Atomic operations");
console.log("- Cursor: Iterate through records");

// Opening a database (browser):
// const request = indexedDB.open('MyDatabase', 1);
// 
// request.onerror = (event) => {
//   console.error('Database error:', event.target.error);
// };
// 
// request.onsuccess = (event) => {
//   const db = event.target.result;
//   console.log('Database opened:', db);
// };
// 
// request.onupgradeneeded = (event) => {
//   const db = event.target.result;
//   
//   // Create object store
//   const objectStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
//   
//   // Create indexes
//   objectStore.createIndex('name', 'name', { unique: false });
//   objectStore.createIndex('email', 'email', { unique: true });
// };

// CRUD operations (browser):
// function addUser(db, user) {
//   const transaction = db.transaction(['users'], 'readwrite');
//   const objectStore = transaction.objectStore('users');
//   const request = objectStore.add(user);
//   
//   request.onsuccess = () => {
//     console.log('User added:', request.result);
//   };
// }
// 
// function getUser(db, id) {
//   const transaction = db.transaction(['users'], 'readonly');
//   const objectStore = transaction.objectStore('users');
//   const request = objectStore.get(id);
//   
//   request.onsuccess = () => {
//     console.log('User:', request.result);
//   };
// }
// 
// function updateUser(db, user) {
//   const transaction = db.transaction(['users'], 'readwrite');
//   const objectStore = transaction.objectStore('users');
//   const request = objectStore.put(user);
//   
//   request.onsuccess = () => {
//     console.log('User updated');
//   };
// }
// 
// function deleteUser(db, id) {
//   const transaction = db.transaction(['users'], 'readwrite');
//   const objectStore = transaction.objectStore('users');
//   const request = objectStore.delete(id);
//   
//   request.onsuccess = () => {
//     console.log('User deleted');
//   };
// }

// Using cursors to iterate (browser):
// function getAllUsers(db) {
//   const transaction = db.transaction(['users'], 'readonly');
//   const objectStore = transaction.objectStore('users');
//   const request = objectStore.openCursor();
//   
//   request.onsuccess = (event) => {
//     const cursor = event.target.result;
//     if (cursor) {
//       console.log('User:', cursor.value);
//       cursor.continue(); // Move to next record
//     }
//   };
// }

console.log("\nIndexedDB vs localStorage:");
console.log("IndexedDB:");
console.log("  ✓ Large storage (hundreds of MB)");
console.log("  ✓ Structured data with indexes");
console.log("  ✓ Asynchronous (non-blocking)");
console.log("  ✓ Transactions");
console.log("  ✗ Complex API");

console.log("\nlocalStorage:");
console.log("  ✓ Simple API");
console.log("  ✓ Synchronous");
console.log("  ✗ Limited storage (~5MB)");
console.log("  ✗ Only key-value pairs");
console.log("  ✗ No indexes");

// ============================================
// Section 4: History API (Browser Navigation)
// ============================================

console.log("\n=== History API ===");

/**
 * History API - Manipulate browser history
 * 
 * Methods:
 * - pushState(): Add new history entry
 * - replaceState(): Modify current history entry
 * - back(), forward(), go(): Navigate history
 * 
 * Events:
 * - popstate: Fired when active history entry changes
 * 
 * Use Cases:
 * - Single Page Applications (SPA)
 * - Client-side routing
 * - Preserving application state
 * - Deep linking
 */

console.log("History API methods:");
console.log("- history.pushState(state, title, url)");
console.log("- history.replaceState(state, title, url)");
console.log("- history.back()");
console.log("- history.forward()");
console.log("- history.go(delta)");
console.log("- history.state (current state object)");
console.log("- history.length (number of entries)");

// pushState() - Add new history entry
console.log("\npushState() - Add new history entry:");
console.log(`
// Navigate to new URL without page reload
history.pushState(
  { page: 'profile', userId: 123 },  // State object
  '',                                 // Title (usually ignored)
  '/profile/123'                      // URL
);

// Browser URL changes to /profile/123
// Page doesn't reload
// Back button now works
`);

// replaceState() - Modify current entry
console.log("\nreplaceState() - Modify current entry:");
console.log(`
// Update current history entry
history.replaceState(
  { page: 'profile', userId: 123, tab: 'settings' },
  '',
  '/profile/123?tab=settings'
);

// URL changes but no new history entry
// Back button goes to previous page (not previous state)
`);

// popstate event - Handle back/forward
console.log("\npopstate event - Handle navigation:");
console.log(`
window.addEventListener('popstate', (event) => {
  console.log('State:', event.state);
  console.log('URL:', location.pathname);
  
  // Render appropriate content based on state
  if (event.state?.page === 'profile') {
    renderProfile(event.state.userId);
  } else if (event.state?.page === 'home') {
    renderHome();
  }
});
`);

// ============================================
// Section 4.1: Single Page Application Routing
// ============================================

console.log("\n=== SPA Routing Implementation ===");

console.log("\nSimple Router Class:");
console.log(`
class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    
    // Handle popstate (back/forward buttons)
    window.addEventListener('popstate', (event) => {
      this.handleRoute(location.pathname, event.state);
    });
    
    // Handle link clicks
    document.addEventListener('click', (event) => {
      if (event.target.matches('[data-link]')) {
        event.preventDefault();
        this.navigate(event.target.href);
      }
    });
  }
  
  // Register route
  route(path, handler) {
    this.routes.set(path, handler);
  }
  
  // Navigate to route
  navigate(path, state = {}) {
    history.pushState(state, '', path);
    this.handleRoute(path, state);
  }
  
  // Handle route change
  handleRoute(path, state) {
    const handler = this.routes.get(path);
    if (handler) {
      this.currentRoute = path;
      handler(state);
    } else {
      this.handle404();
    }
  }
  
  // 404 handler
  handle404() {
    console.log('404 - Page not found');
  }
  
  // Initial route
  init() {
    this.handleRoute(location.pathname, history.state);
  }
}

// Usage
const router = new Router();

router.route('/', () => {
  document.getElementById('app').innerHTML = '<h1>Home</h1>';
});

router.route('/about', () => {
  document.getElementById('app').innerHTML = '<h1>About</h1>';
});

router.route('/profile/:id', (state) => {
  const id = state.userId || location.pathname.split('/')[2];
  document.getElementById('app').innerHTML = 
    \`<h1>Profile \${id}</h1>\`;
});

router.init();

// Navigate programmatically
router.navigate('/about');
`);

// Advanced routing patterns
console.log("\nAdvanced Routing Patterns:");
console.log(`
// 1. Route parameters
router.route('/users/:id', (params) => {
  const userId = params.id;
  fetchUser(userId).then(renderUser);
});

// 2. Query parameters
router.route('/search', () => {
  const params = new URLSearchParams(location.search);
  const query = params.get('q');
  performSearch(query);
});

// 3. Hash routing (alternative)
window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1); // Remove #
  handleRoute(hash);
});

// 4. Nested routes
router.route('/dashboard', () => {
  renderDashboard();
  
  // Sub-router for dashboard sections
  const subRouter = new Router();
  subRouter.route('/dashboard/overview', renderOverview);
  subRouter.route('/dashboard/settings', renderSettings);
});

// 5. Route guards (authentication)
router.beforeEach((to, from, next) => {
  if (to.requiresAuth && !isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});
`);

// Browser history management
console.log("\nBrowser History Management:");
console.log(`
// Navigate back
history.back();
// Equivalent to:
history.go(-1);

// Navigate forward
history.forward();
// Equivalent to:
history.go(1);

// Navigate to specific position
history.go(-2); // Go back 2 pages
history.go(3);  // Go forward 3 pages

// Check history length
console.log('History entries:', history.length);

// Get current state
console.log('Current state:', history.state);

// Scroll restoration
history.scrollRestoration = 'manual'; // or 'auto'
`);

// State management with History API
console.log("\nState Management:");
console.log(`
// Store complex state
const state = {
  page: 'product',
  productId: 123,
  filters: { category: 'electronics', price: 'low' },
  scrollPosition: window.scrollY,
  timestamp: Date.now()
};

history.pushState(state, '', '/products/123');

// Restore state on popstate
window.addEventListener('popstate', (event) => {
  if (event.state) {
    // Restore filters
    applyFilters(event.state.filters);
    
    // Restore scroll position
    window.scrollTo(0, event.state.scrollPosition);
    
    // Render product
    renderProduct(event.state.productId);
  }
});
`);

// Best practices
console.log("\nHistory API Best Practices:");
console.log("  ✅ Always provide meaningful state objects");
console.log("  ✅ Handle popstate event for back/forward");
console.log("  ✅ Use replaceState for URL updates without history");
console.log("  ✅ Preserve scroll position in state");
console.log("  ✅ Implement 404 handling");
console.log("  ✅ Use data-link attribute for SPA links");
console.log("  ✅ Test with browser back/forward buttons");
console.log("  ⚠️ Don't use title parameter (browsers ignore it)");
console.log("  ⚠️ Be careful with state size (browsers have limits)");
console.log("  ⚠️ Handle initial page load separately\n");

// ============================================
// Section 5: Fetch Advanced (Complements 33-fetch-api.js)
// ============================================

console.log("\n=== Fetch Advanced ===");

// AbortController - Cancel requests
const controller = new AbortController();
const signal = controller.signal;

// fetch('https://api.example.com/data', { signal })
//   .then(response => response.json())
//   .then(data => console.log(data))
//   .catch(error => {
//     if (error.name === 'AbortError') {
//       console.log('Fetch aborted');
//     }
//   });
// 
// // Cancel the request
// controller.abort();

console.log("AbortController:");
console.log("- Cancel fetch requests");
console.log("- Useful for search-as-you-type");
console.log("- Cleanup on component unmount");
console.log("- Timeout implementation");

// Timeout example
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Upload progress with ReadableStream
console.log("\nUpload progress:");
console.log("- Use ReadableStream for progress tracking");
console.log("- Monitor bytes sent");
console.log("- Update progress bar");

// FormData for file uploads
console.log("\nFormData:");
console.log("- Upload files and form data");
console.log("- Multipart/form-data encoding");
console.log("- Works with fetch API");

// const formData = new FormData();
// formData.append('username', 'Alice');
// formData.append('file', fileInput.files[0]);
// 
// fetch('/upload', {
//   method: 'POST',
//   body: formData
// });

// CORS (Cross-Origin Resource Sharing)
console.log("\nCORS:");
console.log("- Browser security feature");
console.log("- Restricts cross-origin requests");
console.log("- Server must send CORS headers");
console.log("- Access-Control-Allow-Origin");
console.log("- Preflight requests for complex requests");

// ============================================
// Section 6: WebSocket
// ============================================

console.log("\n=== WebSocket ===");

// WebSocket - Full-duplex communication
// - Persistent connection
// - Real-time bidirectional data
// - Lower latency than HTTP polling

// Creating WebSocket connection (browser/Node.js):
// const ws = new WebSocket('ws://localhost:8080');
// 
// ws.addEventListener('open', (event) => {
//   console.log('Connected to server');
//   ws.send('Hello Server!');
// });
// 
// ws.addEventListener('message', (event) => {
//   console.log('Message from server:', event.data);
// });
// 
// ws.addEventListener('close', (event) => {
//   console.log('Disconnected:', event.code, event.reason);
// });
// 
// ws.addEventListener('error', (event) => {
//   console.error('WebSocket error:', event);
// });

// Sending data
// ws.send('text message');                    // Text
// ws.send(JSON.stringify({ type: 'ping' })); // JSON
// ws.send(new Uint8Array([1, 2, 3]));        // Binary

// Connection states
console.log("\nWebSocket states:");
console.log("- CONNECTING (0): Connection not yet established");
console.log("- OPEN (1): Connection established, can send data");
console.log("- CLOSING (2): Connection closing");
console.log("- CLOSED (3): Connection closed");

// Heartbeat mechanism
console.log("\nHeartbeat pattern:");
console.log("- Send ping messages periodically");
console.log("- Detect connection loss");
console.log("- Prevent timeout");

// let heartbeatInterval;
// ws.addEventListener('open', () => {
//   heartbeatInterval = setInterval(() => {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ type: 'ping' }));
//     }
//   }, 30000); // Every 30 seconds
// });
// 
// ws.addEventListener('close', () => {
//   clearInterval(heartbeatInterval);
// });

// Reconnection strategy
console.log("\nReconnection strategy:");
console.log("- Exponential backoff");
console.log("- Maximum retry attempts");
console.log("- Connection state management");

// function connectWebSocket() {
//   const ws = new WebSocket('ws://localhost:8080');
//   let reconnectAttempts = 0;
//   const maxReconnectAttempts = 5;
//   
//   ws.addEventListener('close', () => {
//     if (reconnectAttempts < maxReconnectAttempts) {
//       const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
//       console.log(`Reconnecting in ${delay}ms...`);
//       setTimeout(() => {
//         reconnectAttempts++;
//         connectWebSocket();
//       }, delay);
//     }
//   });
// }

// WebSocket vs HTTP polling vs SSE
console.log("\nComparison:");
console.log("WebSocket:");
console.log("  ✓ Full-duplex (bidirectional)");
console.log("  ✓ Low latency");
console.log("  ✓ Efficient for frequent updates");
console.log("  ✗ More complex");
console.log("  ✗ Requires WebSocket server");

console.log("\nHTTP Polling:");
console.log("  ✓ Simple");
console.log("  ✓ Works with any HTTP server");
console.log("  ✗ High latency");
console.log("  ✗ Inefficient (many requests)");

console.log("\nSSE (Server-Sent Events):");
console.log("  ✓ Simple");
console.log("  ✓ Automatic reconnection");
console.log("  ✓ Event-based");
console.log("  ✗ Unidirectional (server to client)");
console.log("  ✗ HTTP/1.1 connection limit");

// ============================================
// Section 7: Server-Sent Events (SSE) - DETAILED
// ============================================

console.log("\n=== Server-Sent Events (SSE) - Detailed ===");

/**
 * Server-Sent Events (SSE) - Unidirectional server push
 * 
 * Characteristics:
 * - Unidirectional (server to client only)
 * - Automatic reconnection
 * - Text-based protocol
 * - Uses HTTP (no special protocol)
 * - Event-based API
 * - Built-in event ID for resume
 * 
 * Use Cases:
 * - Real-time notifications
 * - Live feeds (news, social media)
 * - Stock tickers
 * - Server monitoring dashboards
 * - Progress updates
 * - Chat (server to client messages)
 */

console.log("SSE vs WebSocket vs HTTP Polling:");
console.log("\nServer-Sent Events:");
console.log("  ✓ Unidirectional (server → client)");
console.log("  ✓ Automatic reconnection");
console.log("  ✓ Event-based");
console.log("  ✓ Simple HTTP protocol");
console.log("  ✓ Built-in event IDs");
console.log("  ✗ Text only (no binary)");
console.log("  ✗ HTTP/1.1 connection limit (6 per domain)");
console.log("  ✗ No client → server messages");

console.log("\nWebSocket:");
console.log("  ✓ Bidirectional");
console.log("  ✓ Binary support");
console.log("  ✓ No connection limit");
console.log("  ✓ Lower latency");
console.log("  ✗ Manual reconnection");
console.log("  ✗ More complex");
console.log("  ✗ Requires WebSocket server");

console.log("\nHTTP Polling:");
console.log("  ✓ Simple");
console.log("  ✓ Works everywhere");
console.log("  ✗ High latency");
console.log("  ✗ Inefficient (many requests)");
console.log("  ✗ Server load");

// ============================================
// Section 7.1: EventSource API
// ============================================

console.log("\n--- EventSource API ---\n");

// Creating EventSource connection
console.log("Creating EventSource:");
console.log(`
const eventSource = new EventSource('/events');

// Connection states
console.log(eventSource.readyState);
// 0 = CONNECTING
// 1 = OPEN
// 2 = CLOSED

// Connection URL
console.log(eventSource.url); // '/events'

// Reconnection behavior
console.log(eventSource.withCredentials); // false (default)
`);

// Event listeners
console.log("\nEventSource Event Listeners:");
console.log(`
// 1. open event - Connection established
eventSource.addEventListener('open', (event) => {
  console.log('Connection opened');
});

// 2. message event - Default event type
eventSource.addEventListener('message', (event) => {
  console.log('Message:', event.data);
  console.log('Last Event ID:', event.lastEventId);
  console.log('Origin:', event.origin);
});

// 3. error event - Connection error or closed
eventSource.addEventListener('error', (event) => {
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('Connection closed');
  } else {
    console.log('Connection error, will retry');
  }
});

// 4. Custom event types
eventSource.addEventListener('userJoined', (event) => {
  const user = JSON.parse(event.data);
  console.log('User joined:', user.name);
});

eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data);
  showNotification(notification);
});
`);

// Closing connection
console.log("\nClosing EventSource:");
console.log(`
// Close connection (no automatic reconnection)
eventSource.close();

// Check if closed
if (eventSource.readyState === EventSource.CLOSED) {
  console.log('Connection is closed');
}
`);

// ============================================
// Section 7.2: Server-Side Implementation
// ============================================

console.log("\n--- Server-Side Implementation ---\n");

console.log("SSE Response Format:");
console.log(`
// HTTP Headers
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Access-Control-Allow-Origin: * (for CORS)

// Event format
data: This is a message\\n\\n

// Multi-line message
data: First line\\n
data: Second line\\n\\n

// Custom event type
event: userJoined\\n
data: {"name":"Alice","id":123}\\n\\n

// With event ID (for reconnection)
id: 1234\\n
data: Message with ID\\n\\n

// Retry interval (milliseconds)
retry: 5000\\n\\n

// Comment (ignored by client)
: This is a comment\\n\\n
`);

console.log("Node.js Server Example:");
console.log(`
// Express.js
app.get('/events', (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Send initial message
  res.write('data: Connected\\n\\n');
  
  // Send message every 5 seconds
  const intervalId = setInterval(() => {
    const data = {
      time: new Date().toISOString(),
      message: 'Hello from server'
    };
    res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
  }, 5000);
  
  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(intervalId);
    res.end();
  });
});

// Send custom event
function sendCustomEvent(res, eventType, data) {
  res.write(\`event: \${eventType}\\n\`);
  res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
}

// Send with event ID
function sendWithId(res, id, data) {
  res.write(\`id: \${id}\\n\`);
  res.write(\`data: \${JSON.stringify(data)}\\n\\n\`);
}

// Set retry interval
function setRetryInterval(res, ms) {
  res.write(\`retry: \${ms}\\n\\n\`);
}
`);

// ============================================
// Section 7.3: Practical Examples
// ============================================

console.log("\n--- Practical Examples ---\n");

console.log("1. Real-time Notifications:");
console.log(`
// Client
const notifications = new EventSource('/api/notifications');

notifications.addEventListener('notification', (event) => {
  const data = JSON.parse(event.data);
  showNotification(data.title, data.message);
});

// Server
app.get('/api/notifications', (req, res) => {
  setupSSE(res);
  
  // Subscribe to notification events
  notificationEmitter.on('new', (notification) => {
    res.write(\`event: notification\\n\`);
    res.write(\`data: \${JSON.stringify(notification)}\\n\\n\`);
  });
});
`);

console.log("\n2. Live Feed (News/Social):");
console.log(`
// Client
const feed = new EventSource('/api/feed');

feed.addEventListener('post', (event) => {
  const post = JSON.parse(event.data);
  prependPost(post);
});

feed.addEventListener('update', (event) => {
  const update = JSON.parse(event.data);
  updatePost(update.id, update.data);
});

// Server
app.get('/api/feed', (req, res) => {
  setupSSE(res);
  
  // New post
  postEmitter.on('created', (post) => {
    res.write(\`event: post\\n\`);
    res.write(\`id: \${post.id}\\n\`);
    res.write(\`data: \${JSON.stringify(post)}\\n\\n\`);
  });
  
  // Post updated
  postEmitter.on('updated', (post) => {
    res.write(\`event: update\\n\`);
    res.write(\`data: \${JSON.stringify(post)}\\n\\n\`);
  });
});
`);

console.log("\n3. Stock Ticker:");
console.log(`
// Client
const ticker = new EventSource('/api/stocks');

ticker.addEventListener('price', (event) => {
  const data = JSON.parse(event.data);
  updateStockPrice(data.symbol, data.price, data.change);
});

// Server
app.get('/api/stocks', (req, res) => {
  setupSSE(res);
  
  // Send price updates every second
  const intervalId = setInterval(() => {
    const prices = getLatestPrices();
    prices.forEach(stock => {
      res.write(\`event: price\\n\`);
      res.write(\`data: \${JSON.stringify(stock)}\\n\\n\`);
    });
  }, 1000);
  
  req.on('close', () => clearInterval(intervalId));
});
`);

console.log("\n4. Progress Updates:");
console.log(`
// Client
const progress = new EventSource(\`/api/jobs/\${jobId}/progress\`);

progress.addEventListener('progress', (event) => {
  const data = JSON.parse(event.data);
  updateProgressBar(data.percent);
});

progress.addEventListener('complete', (event) => {
  const result = JSON.parse(event.data);
  showResult(result);
  progress.close();
});

// Server
app.get('/api/jobs/:id/progress', (req, res) => {
  setupSSE(res);
  const jobId = req.params.id;
  
  // Listen for job progress
  jobEmitter.on(\`progress:\${jobId}\`, (percent) => {
    res.write(\`event: progress\\n\`);
    res.write(\`data: \${JSON.stringify({ percent })}\\n\\n\`);
  });
  
  jobEmitter.on(\`complete:\${jobId}\`, (result) => {
    res.write(\`event: complete\\n\`);
    res.write(\`data: \${JSON.stringify(result)}\\n\\n\`);
  });
});
`);

console.log("\n5. Server Monitoring Dashboard:");
console.log(`
// Client
const monitor = new EventSource('/api/monitor');

monitor.addEventListener('metrics', (event) => {
  const metrics = JSON.parse(event.data);
  updateDashboard(metrics);
});

monitor.addEventListener('alert', (event) => {
  const alert = JSON.parse(event.data);
  showAlert(alert.level, alert.message);
});

// Server
app.get('/api/monitor', (req, res) => {
  setupSSE(res);
  
  // Send metrics every 5 seconds
  const intervalId = setInterval(() => {
    const metrics = collectMetrics();
    res.write(\`event: metrics\\n\`);
    res.write(\`data: \${JSON.stringify(metrics)}\\n\\n\`);
  }, 5000);
  
  // Send alerts
  alertEmitter.on('alert', (alert) => {
    res.write(\`event: alert\\n\`);
    res.write(\`data: \${JSON.stringify(alert)}\\n\\n\`);
  });
  
  req.on('close', () => clearInterval(intervalId));
});
`);

// ============================================
// Section 7.4: Reconnection and Error Handling
// ============================================

console.log("\n--- Reconnection and Error Handling ---\n");

console.log("Automatic Reconnection:");
console.log(`
// EventSource automatically reconnects
const eventSource = new EventSource('/events');

eventSource.addEventListener('error', (event) => {
  if (eventSource.readyState === EventSource.CONNECTING) {
    console.log('Reconnecting...');
  } else if (eventSource.readyState === EventSource.CLOSED) {
    console.log('Connection closed permanently');
  }
});

// Server can set retry interval
// retry: 5000 (5 seconds)

// Client resumes from last event ID
// Server receives Last-Event-ID header
`);

console.log("\nResume from Last Event:");
console.log(`
// Server
app.get('/events', (req, res) => {
  setupSSE(res);
  
  // Get last event ID from client
  const lastEventId = req.headers['last-event-id'];
  
  if (lastEventId) {
    // Send missed events since lastEventId
    const missedEvents = getEventsSince(lastEventId);
    missedEvents.forEach(event => {
      res.write(\`id: \${event.id}\\n\`);
      res.write(\`data: \${JSON.stringify(event.data)}\\n\\n\`);
    });
  }
  
  // Continue with live events
  // ...
});
`);

console.log("\nManual Reconnection:");
console.log(`
let eventSource;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connect() {
  eventSource = new EventSource('/events');
  
  eventSource.addEventListener('open', () => {
    console.log('Connected');
    reconnectAttempts = 0;
  });
  
  eventSource.addEventListener('error', () => {
    eventSource.close();
    
    if (reconnectAttempts < maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      console.log(\`Reconnecting in \${delay}ms...\`);
      setTimeout(connect, delay);
      reconnectAttempts++;
    } else {
      console.log('Max reconnection attempts reached');
    }
  });
}

connect();
`);

// ============================================
// Section 7.5: Best Practices
// ============================================

console.log("\n--- SSE Best Practices ---\n");

console.log("Client-side:");
console.log("  ✅ Always handle error events");
console.log("  ✅ Close connection when no longer needed");
console.log("  ✅ Use custom event types for different messages");
console.log("  ✅ Parse JSON data safely (try/catch)");
console.log("  ✅ Implement reconnection limits");
console.log("  ✅ Show connection status to user");
console.log("  ⚠️ Be aware of HTTP/1.1 connection limit (6 per domain)");
console.log("  ⚠️ Consider using HTTP/2 for multiple SSE connections");

console.log("\nServer-side:");
console.log("  ✅ Set correct headers (Content-Type, Cache-Control)");
console.log("  ✅ Handle client disconnection (cleanup)");
console.log("  ✅ Use event IDs for resumable connections");
console.log("  ✅ Set appropriate retry interval");
console.log("  ✅ Implement authentication/authorization");
console.log("  ✅ Use compression (gzip) for text data");
console.log("  ✅ Monitor active connections");
console.log("  ⚠️ Be careful with memory leaks (event listeners)");
console.log("  ⚠️ Implement rate limiting");
console.log("  ⚠️ Handle server restarts gracefully");

console.log("\nWhen to use SSE:");
console.log("  ✓ Real-time notifications");
console.log("  ✓ Live feeds and updates");
console.log("  ✓ Server monitoring");
console.log("  ✓ Progress tracking");
console.log("  ✓ One-way data flow (server → client)");

console.log("\nWhen to use WebSocket instead:");
console.log("  ✓ Bidirectional communication");
console.log("  ✓ Binary data");
console.log("  ✓ Low latency requirements");
console.log("  ✓ Gaming, chat, collaboration");
console.log("  ✓ Many concurrent connections\n");

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: localStorage synchronous blocking
console.log("\nPitfall 1: localStorage is synchronous");
console.log("  Blocks main thread during read/write");
console.log("  Can cause UI jank with large data");
console.log("  Fix: Use IndexedDB for large data");

// Pitfall 2: Storage quota limits
console.log("\nPitfall 2: Storage quota limits");
console.log("  localStorage: ~5-10MB per origin");
console.log("  IndexedDB: Larger but still limited");
console.log("  QuotaExceededError when full");
console.log("  Fix: Monitor usage, implement cleanup");

// Pitfall 3: JSON.stringify limitations
console.log("\nPitfall 3: JSON.stringify limitations");
console.log("  Cannot serialize Date, Map, Set, undefined, functions");
console.log("  Date becomes ISO string (needs parsing)");
console.log("  Fix: Use custom serialization");

// Pitfall 4: CORS preflight caching
console.log("\nPitfall 4: CORS preflight requests");
console.log("  Complex requests trigger OPTIONS preflight");
console.log("  Preflight can be cached but timing varies");
console.log("  Fix: Use simple requests when possible");

// Pitfall 5: WebSocket connection handling
console.log("\nPitfall 5: WebSocket connection lifecycle");
console.log("  Connection can drop unexpectedly");
console.log("  Need manual reconnection logic");
console.log("  Fix: Implement exponential backoff");

// Pitfall 6: SSE reconnection timing
console.log("\nPitfall 6: SSE automatic reconnection");
console.log("  Reconnects after 'retry' milliseconds");
console.log("  Default is 1000ms if not specified");
console.log("  Fix: Set appropriate retry interval");

// Pitfall 7: Cookie size limits
console.log("\nPitfall 7: Cookie size limits");
console.log("  Maximum 4KB per cookie");
console.log("  Sent with every HTTP request");
console.log("  Fix: Store minimal data in cookies");

// Pitfall 8: Memory leaks with event listeners
console.log("\nPitfall 8: Event listener memory leaks");
console.log("  WebSocket/SSE need explicit cleanup");
console.log("  Forgot to close = memory leak");
console.log("  Fix: Always clean up in unload/destroy");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("✅ DO:");
console.log("1. Use localStorage for small, synchronous data");
console.log("2. Use IndexedDB for large or complex data");
console.log("3. Use sessionStorage for tab-specific data");
console.log("4. Implement storage quota monitoring");
console.log("5. Use JSON.parse/stringify carefully");
console.log("6. Handle CORS properly on server side");
console.log("7. Implement WebSocket reconnection logic");
console.log("8. Set appropriate SSE retry intervals");
console.log("9. Use httpOnly cookies for sensitive data");
console.log("10. Clean up all event listeners and connections");
console.log("11. Use AbortController for fetch cancellation");
console.log("12. Validate all user input before storage");

console.log("\n❌ DON'T:");
console.log("1. Don't store sensitive data in localStorage");
console.log("2. Don't store large objects in localStorage");
console.log("3. Don't block main thread with storage operations");
console.log("4. Don't forget CORS credentials option");
console.log("5. Don't assume WebSocket stays connected");
console.log("6. Don't forget to close connections on cleanup");
console.log("7. Don't store too much in cookies (4KB limit)");
console.log("8. Don't use cookies for non-essential data");
console.log("9. Don't forget error handling");
console.log("10. Don't ignore network status changes");
console.log("11. Don't forget HTTPS for security-sensitive APIs");
console.log("12. Don't trust client-side storage for critical data");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Storage quota exceeded errors");
console.log("2. localStorage synchronous blocking");
console.log("3. JSON serialization edge cases");
console.log("4. CORS preflight complexity");
console.log("5. WebSocket disconnections");
console.log("6. SSE reconnection loops");
console.log("7. Cookie size and count limits");
console.log("8. Memory leaks from unclosed connections");
console.log("9. Cross-tab synchronization issues");
console.log("10. Private browsing storage restrictions");
console.log("11. Browser-specific implementation differences");
console.log("12. Security implications of each storage type");


// ============================================
// Section 8: BroadcastChannel API
// ============================================
/**
 * BroadcastChannel API — Simple cross-tab/window/iframe communication
 *
 * Allows same-origin browsing contexts to communicate via messages
 * without shared storage polling or Service Worker postMessage.
 *
 * Key features:
 * - Simple pub/sub model via channel names
 * - Works across tabs, windows, iframes (same origin)
 * - No polling needed (unlike localStorage Storage events)
 * - Messages are not persisted (unlike localStorage)
 * - postMessage() is fire-and-forget
 *
 * Use cases:
 * - Sync login/logout state across tabs
 * - Notify other tabs of data changes
 * - Coordinate between multiple open windows
 * - Broadcast theme/preference changes
 */

console.log("\n=== Section 8: BroadcastChannel API ===");

console.log(`
// Create or join a channel (same name = same channel)
const channel = new BroadcastChannel('app_state');

// Send a message to all other contexts on this channel
channel.postMessage({
  type: 'LOGOUT',
  timestamp: Date.now()
});

// Receive messages from other contexts
channel.onmessage = (event) => {
  console.log('Received from another tab:', event.data);
  // event.origin is always same-origin
  // event.source is null (not a window reference like postMessage)
};

// Alternative: addEventListener
channel.addEventListener('message', (event) => {
  if (event.data.type === 'LOGOUT') {
    // Clear session, redirect to login
    console.log('User logged out in another tab');
  }
});

// Close the channel when done
channel.close();

// Practical example: login state synchronization
// Tab A: user logs in
const loginChannel = new BroadcastChannel('auth');
loginChannel.postMessage({ type: 'LOGIN', user: 'Alice' });

// Tab B: receives login notification
const sameChannel = new BroadcastChannel('auth');
sameChannel.onmessage = (e) => {
  if (e.data.type === 'LOGIN') {
    console.log(\`User \${e.data.user} logged in from another tab\`);
    // Update UI, refresh data, etc.
  }
};

// Comparison with alternatives:
// - localStorage Storage event: only fires when OTHER tabs write, not same tab
// - SharedWorker: more complex setup, shared state
// - Service Worker postMessage: requires SW registration
// - window.postMessage: for cross-origin iframes, not same-origin tabs
// - BroadcastChannel: simplest for same-origin cross-tab communication

// Browser support: Chrome 54+, Firefox 38+, Safari 15.4+, Edge 79+
console.log("BroadcastChannel provides simple same-origin cross-tab messaging");
`);


// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. STORAGE TYPING
   JS:  Storage interface (localStorage/sessionStorage)
   TS:  Storage interface with typed methods
   TS:  Type-safe wrapper classes

   Example:
   class TypedStorage<T> {
     get(key: string): T | null {
       const item = localStorage.getItem(key);
       return item ? JSON.parse(item) : null;
     }
     set(key: string, value: T): void {
       localStorage.setItem(key, JSON.stringify(value));
     }
   }

2. WEBSOCKET TYPING
   TS:  WebSocket interface fully typed
   TS:  MessageEvent<T> generic type
   TS:  CloseEvent, ErrorEvent types
   TS:  WebSocketEventMap for addEventListener

   Example:
   const ws: WebSocket = new WebSocket('ws://localhost');
   ws.addEventListener('message', (event: MessageEvent) => {
     console.log(event.data);
   });

3. INDEXEDDB TYPING
   TS:  IDBDatabase, IDBObjectStore, IDBTransaction
   TS:  IDBRequest<T> generic type
   TS:  Community libraries: idb (Promise wrapper)

   Example:
   import { openDB, DBSchema } from 'idb';
   
   interface MyDB extends DBSchema {
     users: {
       key: number;
       value: { name: string; email: string };
       indexes: { 'by-email': string };
     };
   }
   
   const db = await openDB<MyDB>('my-db', 1);

4. FETCH TYPING
   TS:  RequestInit, Response, Headers types
   TS:  AbortController, AbortSignal types
   TS:  Type-safe response parsing

   Example:
   interface User {
     id: number;
     name: string;
   }
   
   const response = await fetch('/api/user');
   const user: User = await response.json();

5. EVENTSOURCE TYPING
   TS:  EventSource interface
   TS:  MessageEvent type
   TS:  Custom event types

⚠️ BROWSER COMPATIBILITY:
- localStorage/sessionStorage: All modern browsers
- IndexedDB: All modern browsers
- WebSocket: All modern browsers
- SSE: All modern browsers except IE
- Check caniuse.com for specific features

🔧 BEST PRACTICES:

Storage:
- Use try/catch for quota exceeded errors
- Validate data before storing
- Clear old data periodically
- Use IndexedDB for large data
- Encrypt sensitive data

WebSocket:
- Implement heartbeat mechanism
- Handle reconnection gracefully
- Validate messages from server
- Use binary for large data
- Close connections properly

Fetch:
- Use AbortController for cleanup
- Handle network errors
- Set appropriate timeouts
- Use CORS correctly
- Cache responses when appropriate

📘 See related:
- 33-fetch-api.js (Basic fetch)
- 41-typed-arrays.js (Binary data)
- 20-error-handling.js (Error handling)
*/


// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 35-dom-basics.js - DOM basics");
console.log("📘 38-forms-validation.js - Forms and validation");
console.log("📘 45-web-apis.js - Web APIs");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 43-storage-network-ts-comparison.ts
*/
