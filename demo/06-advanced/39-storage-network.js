// Storage and Advanced Network Requests Demo
// 📘 javascript.info Part 3 > "Storing data", "Network requests"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
// ⚠️ Most content is browser-specific

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
// Section 4: Fetch Advanced (Complements 22-fetch-api.js)
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
// Section 5: WebSocket
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
// Section 6: Server-Sent Events (SSE)
// ============================================

console.log("\n=== Server-Sent Events (SSE) ===");

// SSE - Server pushes data to client
// - Unidirectional (server to client only)
// - Automatic reconnection
// - Text-based protocol
// - Uses HTTP

// Creating EventSource (browser):
// const eventSource = new EventSource('/events');
// 
// eventSource.addEventListener('open', () => {
//   console.log('Connection opened');
// });
// 
// eventSource.addEventListener('message', (event) => {
//   console.log('Message:', event.data);
// });
// 
// eventSource.addEventListener('error', (error) => {
//   console.error('Error:', error);
// });
// 
// // Close connection
// eventSource.close();

// Custom event types
// eventSource.addEventListener('userJoined', (event) => {
//   const user = JSON.parse(event.data);
//   console.log('User joined:', user);
// });

// Server-side format (Node.js example):
// res.writeHead(200, {
//   'Content-Type': 'text/event-stream',
//   'Cache-Control': 'no-cache',
//   'Connection': 'keep-alive'
// });
// 
// // Send message
// res.write('data: Hello\n\n');
// 
// // Send custom event
// res.write('event: userJoined\n');
// res.write('data: {"name":"Alice"}\n\n');
// 
// // Send with ID (for reconnection)
// res.write('id: 123\n');
// res.write('data: Message\n\n');

console.log("\nSSE features:");
console.log("- Automatic reconnection");
console.log("- Last-Event-ID for resume");
console.log("- Custom event types");
console.log("- Simple text protocol");

console.log("\nSSE vs WebSocket:");
console.log("SSE:");
console.log("  ✓ Simpler than WebSocket");
console.log("  ✓ Automatic reconnection");
console.log("  ✓ Works over HTTP");
console.log("  ✗ Unidirectional only");
console.log("  ✗ Text only (no binary)");
console.log("  ✗ HTTP/1.1 connection limit (6 per domain)");

console.log("\nWebSocket:");
console.log("  ✓ Bidirectional");
console.log("  ✓ Binary support");
console.log("  ✓ No connection limit");
console.log("  ✗ Manual reconnection");
console.log("  ✗ More complex");

// Use cases
console.log("\nUse cases:");
console.log("SSE: News feeds, stock tickers, notifications");
console.log("WebSocket: Chat, gaming, collaborative editing");

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
- 22-fetch-api.js (Basic fetch)
- 36-typed-arrays.js (Binary data)
- 12-error-handling.js (Error handling)
*/
