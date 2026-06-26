// Web APIs Demo
// 📘 For TypeScript comparison, see: 45-web-apis-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API
// 📘 Web APIs: https://developer.mozilla.org/en-US/docs/Web/API
// 📌 Covers important modern Web APIs

// ============================================
// Section 1: Service Workers
// ============================================

console.log("\n=== Service Workers ===");

// Service Workers enable offline functionality and caching
// Note: Service Workers only work over HTTPS (except localhost)

// Register a service worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered:', registration.scope);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 New Service Worker installing');
        
        newWorker.addEventListener('statechange', () => {
          console.log('Service Worker state:', newWorker.state);
        });
      });
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  } else {
    console.log('⚠️ Service Workers not supported');
  }
}

// Example Service Worker file (sw.js):
const serviceWorkerCode = `
// sw.js - Service Worker file
const CACHE_NAME = 'my-app-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/script.js',
  '/offline.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
`;

console.log("Service Worker example code:");
console.log(serviceWorkerCode);

// Caching strategies:
console.log("\nCaching Strategies:");
console.log("1. Cache First: Check cache, fallback to network");
console.log("2. Network First: Try network, fallback to cache");
console.log("3. Cache Only: Only serve from cache");
console.log("4. Network Only: Only fetch from network");
console.log("5. Stale While Revalidate: Serve cache, update in background");

// Use cases:
// - Offline functionality
// - Performance optimization
// - Background sync
// - Push notifications

// Common pitfalls:
// ⚠️ Service Workers only work over HTTPS
// ⚠️ Cache invalidation can be tricky
// ⚠️ Debugging can be challenging
// ⚠️ Scope limitations

// ============================================
// Section 2: Web Workers
// ============================================

console.log("\n=== Web Workers ===");

// Web Workers run JavaScript in background threads
// They don't have access to DOM

// Create a Web Worker
function createWorker() {
  if (typeof Worker !== 'undefined') {
    // Inline worker using Blob
    const workerCode = `
      self.addEventListener('message', (e) => {
        const { type, data } = e.data;
        
        if (type === 'calculate') {
          // Heavy computation
          let result = 0;
          for (let i = 0; i < data; i++) {
            result += Math.sqrt(i);
          }
          self.postMessage({ type: 'result', data: result });
        }
        
        if (type === 'fibonacci') {
          function fib(n) {
            if (n <= 1) return n;
            return fib(n - 1) + fib(n - 2);
          }
          const result = fib(data);
          self.postMessage({ type: 'result', data: result });
        }
      });
    `;
    
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);
    
    // Listen for messages from worker
    worker.addEventListener('message', (e) => {
      console.log('📨 Message from worker:', e.data);
    });
    
    worker.addEventListener('error', (e) => {
      console.error('❌ Worker error:', e.message);
    });
    
    // Send message to worker
    worker.postMessage({ type: 'calculate', data: 1000000 });
    
    // Terminate worker when done
    // worker.terminate();
    
    console.log('✅ Web Worker created');
    return worker;
  } else {
    console.log('⚠️ Web Workers not supported');
    return null;
  }
}

// Shared Workers (shared between tabs/windows)
console.log("\nShared Workers:");
console.log("- Shared between multiple browser contexts");
console.log("- Use SharedWorker() constructor");
console.log("- Communicate via MessagePort");

// Use cases:
// - Heavy computations
// - Image processing
// - Data parsing
// - Background tasks

// Common pitfalls:
// ⚠️ No DOM access in workers
// ⚠️ Data must be serializable (structured clone)
// ⚠️ Memory overhead for each worker
// ⚠️ Communication overhead

// ============================================
// Section 3: Intersection Observer
// ============================================

console.log("\n=== Intersection Observer ===");

// Efficiently detect when elements enter/exit viewport
function setupIntersectionObserver() {
  const options = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.5 // 50% visible
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('✅ Element is visible:', entry.target);
        // Lazy load image
        if (entry.target.dataset.src) {
          entry.target.src = entry.target.dataset.src;
          observer.unobserve(entry.target);
        }
      } else {
        console.log('👁️ Element is hidden:', entry.target);
      }
    });
  }, options);
  
  // Observe elements
  // const images = document.querySelectorAll('img[data-src]');
  // images.forEach(img => observer.observe(img));
  
  console.log('✅ Intersection Observer created');
  return observer;
}

// Lazy loading images example
console.log("\nLazy Loading Pattern:");
console.log(`
<img data-src="image.jpg" alt="Lazy loaded image">

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
`);

// Infinite scroll example
console.log("\nInfinite Scroll Pattern:");
console.log("- Observe sentinel element at bottom");
console.log("- Load more content when visible");
console.log("- Unobserve and create new sentinel");

// Use cases:
// - Lazy loading images
// - Infinite scroll
// - Animation triggers
// - Analytics (viewability tracking)

// Common pitfalls:
// ⚠️ Threshold values can be tricky
// ⚠️ Remember to unobserve when done
// ⚠️ Root margin can be confusing
// ⚠️ Performance with many observers

// ============================================
// Section 4: Geolocation API
// ============================================

console.log("\n=== Geolocation API ===");

// Get user's location (requires user permission)
function getLocation() {
  if ('geolocation' in navigator) {
    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log('📍 Location:', { latitude, longitude, accuracy });
        console.log(`https://maps.google.com/?q=${latitude},${longitude}`);
      },
      (error) => {
        console.error('❌ Location error:', error.message);
        // PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
    
    // Watch position (continuous updates)
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log('🔄 Position updated:', position.coords);
      },
      (error) => {
        console.error('❌ Watch error:', error.message);
      }
    );
    
    // Stop watching
    // navigator.geolocation.clearWatch(watchId);
    
    console.log('✅ Geolocation requested');
  } else {
    console.log('⚠️ Geolocation not supported');
  }
}

// Calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

console.log("Distance NYC to LA:", calculateDistance(40.7128, -74.0060, 34.0522, -118.2437).toFixed(2), "km");

// Use cases:
// - Location-based services
// - Maps and navigation
// - Nearby search
// - Delivery tracking

// Common pitfalls:
// ⚠️ Requires user permission
// ⚠️ May not work indoors
// ⚠️ Battery drain with watchPosition
// ⚠️ Privacy concerns

// ============================================
// Section 5: WebSocket API
// ============================================

console.log("\n=== WebSocket API ===");

// Real-time bidirectional communication
function createWebSocket() {
  // const ws = new WebSocket('wss://echo.websocket.org');
  
  console.log("WebSocket example:");
  console.log(`
const ws = new WebSocket('wss://example.com/socket');

// Connection opened
ws.addEventListener('open', (event) => {
  console.log('✅ Connected');
  ws.send('Hello Server!');
});

// Listen for messages
ws.addEventListener('message', (event) => {
  console.log('📨 Message:', event.data);
});

// Connection closed
ws.addEventListener('close', (event) => {
  console.log('❌ Disconnected:', event.code, event.reason);
});

// Error handling
ws.addEventListener('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

// Send data
ws.send(JSON.stringify({ type: 'chat', message: 'Hello!' }));

// Close connection
ws.close(1000, 'Normal closure');
  `);
  
  // WebSocket states
  console.log("\nWebSocket States:");
  console.log("0 - CONNECTING: Connection not yet established");
  console.log("1 - OPEN: Connection established, can send data");
  console.log("2 - CLOSING: Connection closing");
  console.log("3 - CLOSED: Connection closed");
  
  // Reconnection logic
  console.log("\nReconnection Pattern:");
  console.log(`
function connectWebSocket() {
  const ws = new WebSocket('wss://example.com');
  
  ws.addEventListener('close', () => {
    console.log('Reconnecting in 3s...');
    setTimeout(connectWebSocket, 3000);
  });
  
  return ws;
}
  `);
}

createWebSocket();

// Use cases:
// - Chat applications
// - Real-time notifications
// - Live data feeds
// - Multiplayer games

// Common pitfalls:
// ⚠️ Connection can drop unexpectedly
// ⚠️ Need reconnection logic
// ⚠️ Binary data handling
// ⚠️ Firewall/proxy issues

// ============================================
// Section 6: Additional Web APIs
// ============================================

console.log("\n=== Additional Web APIs ===");

// Notification API
console.log("\n1. Notification API:");
console.log(`
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      new Notification('Hello!', {
        body: 'This is a notification',
        icon: '/icon.png',
        badge: '/badge.png'
      });
    }
  });
}
`);

// Clipboard API
console.log("\n2. Clipboard API:");
console.log(`
// Write to clipboard
await navigator.clipboard.writeText('Hello, clipboard!');

// Read from clipboard
const text = await navigator.clipboard.readText();
console.log('Clipboard:', text);
`);

// File API
console.log("\n3. File API:");
console.log(`
<input type="file" id="fileInput" multiple>

document.getElementById('fileInput').addEventListener('change', (e) => {
  const files = e.target.files;
  
  for (const file of files) {
    console.log('File:', file.name, file.size, file.type);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log('Content:', e.target.result);
    };
    reader.readAsText(file);
  }
});
`);

// Page Visibility API
console.log("\n4. Page Visibility API:");
console.log(`
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Page is hidden');
    // Pause video, stop animations
  } else {
    console.log('Page is visible');
    // Resume video, start animations
  }
});
`);

// Battery Status API
console.log("\n5. Battery Status API:");
console.log(`
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    console.log('Battery level:', battery.level * 100 + '%');
    console.log('Charging:', battery.charging);
    
    battery.addEventListener('levelchange', () => {
      console.log('Battery level changed:', battery.level);
    });
  });
}
`);

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Service Worker registration errors
console.log("\nPitfall 1: Service Worker registration errors");
console.log("  Description: Service Worker registration can fail silently if the sw.js file returns a 404, or if the scope is incorrect. Errors may also occur when registering from a subdirectory without proper scope configuration.");
console.log("  Fix: Always wrap registration in try/catch, verify the sw.js path is correct, and explicitly set the scope option if needed. Check the browser console for registration errors.");

// Pitfall 2: Intersection Observer threshold confusion
console.log("\nPitfall 2: Intersection Observer threshold confusion");
console.log("  Description: The threshold value is often misunderstood. threshold: 0 means the callback fires when even 1 pixel is visible, while threshold: 1 means the entire element must be visible. Using threshold: 0.5 means 50% must be visible.");
console.log("  Fix: Use an array of thresholds like [0, 0.25, 0.5, 0.75, 1] to track multiple visibility levels, or start with threshold: 0 for lazy loading patterns.");

// Pitfall 3: Geolocation permission denied
console.log("\nPitfall 3: Geolocation permission denied");
console.log("  Description: Users can deny geolocation permission, and once denied, the browser will not prompt again. The API also fails silently on non-HTTPS origins (except localhost).");
console.log("  Fix: Always provide a fallback UI when permission is denied. Handle all three error codes: PERMISSION_DENIED (1), POSITION_UNAVAILABLE (2), and TIMEOUT (3). Serve the app gracefully without location data.");

// Pitfall 4: Web Worker not terminating
console.log("\nPitfall 4: Web Worker not terminating");
console.log("  Description: Workers continue running in the background even after the main thread no longer needs them. Each worker consumes memory and CPU resources. Forgetting to terminate workers leads to memory leaks.");
console.log("  Fix: Always call worker.terminate() or self.close() inside the worker when the task is complete. Use cleanup patterns in component unmount or page navigation events.");

// Pitfall 5: Notification permission handling
console.log("\nPitfall 5: Notification permission handling");
console.log("  Description: Notification.requestPermission() must be called in response to a user gesture in some browsers. If the user blocks notifications, you cannot re-prompt them without them manually changing browser settings.");
console.log("  Fix: Request permission only after explaining why notifications are useful. Check Notification.permission before requesting. Handle 'default', 'granted', and 'denied' states appropriately.");

// Pitfall 6: Clipboard API security restrictions
console.log("\nPitfall 6: Clipboard API security restrictions");
console.log("  Description: navigator.clipboard.readText() requires both user permission and a secure context (HTTPS). In many browsers, clipboard read requires the document to have focus. It will throw if called outside a user gesture.");
console.log("  Fix: Use the Clipboard API only inside event handlers triggered by user actions. Wrap calls in try/catch. Use document.execCommand('copy') as a fallback for older browsers.");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("\n✅ DO:");
console.log("1. Check API availability before use (e.g., 'serviceWorker' in navigator, 'geolocation' in navigator)");
console.log("2. Handle permissions gracefully - request at the right time and provide fallbacks when denied");
console.log("3. Clean up resources: terminate workers, unobserve IntersectionObservers, clear geolocation watches, close WebSockets");
console.log("4. Use HTTPS for all security-sensitive APIs (Service Workers, Geolocation, Clipboard, Notifications)");

console.log("\n❌ DON'T:");
console.log("1. Assume an API exists without feature detection - browser support varies");
console.log("2. Forget cleanup - leaving workers running, observers active, or connections open causes memory leaks");
console.log("3. Block the main thread - offload heavy computations to Web Workers to keep the UI responsive");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Browser support differences - check caniuse.com and provide polyfills or fallbacks where needed");
console.log("2. Permissions can be denied or blocked - always handle the denied state and don't assume access");
console.log("3. Memory leaks from unclosed connections, unremoved observers, or unterminated workers accumulate over time");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. SERVICE WORKERS
   TS:  ServiceWorkerRegistration type
   TS:  ServiceWorkerGlobalScope for worker context
   TS:  Type-safe message passing with interfaces

2. WEB WORKERS
   TS:  Worker type with typed message events
   TS:  interface WorkerMessage { type: string; data: any; }
   TS:  Type-safe postMessage and onmessage

3. INTERSECTION OBSERVER
   TS:  IntersectionObserverEntry type
   TS:  IntersectionObserverInit for options
   TS:  Type-safe callback with entry types

4. GEOLOCATION
   TS:  GeolocationPosition and GeolocationCoordinates types
   TS:  GeolocationPositionError for error handling
   TS:  Type-safe options with PositionOptions

5. WEBSOCKET
   TS:  WebSocket type with event types
   TS:  Type-safe message data with generics
   TS:  MessageEvent<T> for typed messages

⚠️ BROWSER/RUNTIME SUPPORT:
- Service Workers: Chrome 40+, Firefox 44+, Safari 11.1+
- Web Workers: All modern browsers
- Intersection Observer: Chrome 51+, Firefox 55+, Safari 12.1+
- Geolocation: All modern browsers (requires HTTPS)
- WebSocket: All modern browsers

🔧 BEST PRACTICES:
- Always check for API availability before use
- Handle errors and edge cases
- Clean up resources (unobserve, terminate, close)
- Use HTTPS for security-sensitive APIs
- Request permissions responsibly

9. NEW WEB APIs (2024-2025)
	   View Transitions API (Chrome 111+, Safari 17.4+):
	   - Smooth animated transitions between page states
	   - document.startViewTransition(() => updateDOM())
	   - Supports both SPA (same-document) and MPA (cross-document) transitions
	   - CSS: ::view-transition pseudo-elements for custom animations
	   - Great for single-page app navigation
	   - ⚠️ Check support: if ('startViewTransition' in document)


   Popover API (Chrome 114+, Safari 17+, Firefox 125+):
   - Built-in popover without custom positioning
   - <button popovertarget="menu">
   - <div id="menu" popover>
   - No need for tooltip/menu libraries
   - Automatic focus management and accessibility
   - Implicit ARIA attributes for better screen reader support

   CSS Container Queries (Chrome 106+, Safari 16.0+, Firefox 110+):
   - Responsive design based on parent container
   - @container (max-width: 400px) { ... }
   - Better for component-based design
   - More flexible than media queries
   - Requires container-type: inline-size on parent

   Web Components improvements:
   - Declarative shadow DOM (Chrome 111+, Safari 16.4+, Firefox 123+)
   - Element internals API (Chrome 90+, Firefox 114+, Safari 16.4+)
   - Better form integration (Chrome 90+, Firefox 114+, Safari 16.4+)

   Note: Check caniuse.com for current browser support
   - Some features may require vendor prefixes or polyfills
   - Firefox support varies, check feature flags

📘 See related:
- 33-fetch-api.js (Network requests)
- 37-events.js (Event handling)
- 43-storage-network.js (Storage APIs)


// ============================================
// 10. CANVAS API (2D Graphics)
// ============================================
/**
 * Canvas API — Programmatic 2D drawing
 *
 * The Canvas API provides a bitmap drawing surface for graphics, charts,
 * image manipulation, and animations.
 *
 * Key concepts:
 * - <canvas> HTML element with 2D rendering context
 * - Path-based drawing: moveTo, lineTo, arc, bezierCurveTo
 * - Fill and stroke styles with colors, gradients, patterns
 * - Text rendering with font, fillText, strokeText
 * - Image drawing: drawImage (from img/video/canvas/ImageData)
 * - Transformations: translate, rotate, scale, transform
 * - Pixel manipulation via ImageData (getImageData/putImageData)
 * - State management: save()/restore() for isolated drawing contexts
 */

console.log("\n=== Canvas API ===");

// Canvas API requires a browser environment with <canvas> element
// The following code demonstrates the API patterns:

// In browser:
// const canvas = document.getElementById('myCanvas');
// const ctx = canvas.getContext('2d');

// Basic drawing:
// ctx.fillStyle = 'blue';
// ctx.fillRect(10, 10, 100, 50);  // Filled rectangle
//
// ctx.strokeStyle = 'red';
// ctx.lineWidth = 2;
// ctx.strokeRect(10, 10, 100, 50);  // Outlined rectangle

// Circle:
// ctx.beginPath();
// ctx.arc(75, 75, 50, 0, Math.PI * 2);
// ctx.fillStyle = 'green';
// ctx.fill();

// Line:
// ctx.beginPath();
// ctx.moveTo(0, 0);
// ctx.lineTo(200, 100);
// ctx.stroke();

// Text:
// ctx.font = '24px Arial';
// ctx.fillStyle = 'black';
// ctx.fillText('Hello Canvas!', 10, 50);

// Gradients:
// const gradient = ctx.createLinearGradient(0, 0, 200, 0);
// gradient.addColorStop(0, 'red');
// gradient.addColorStop(1, 'blue');
// ctx.fillStyle = gradient;
// ctx.fillRect(10, 10, 200, 100);

// Image drawing:
// const img = new Image();
// img.onload = () => ctx.drawImage(img, 0, 0);
// img.src = 'image.png';

// Pixel manipulation:
// const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
// for (let i = 0; i < imageData.data.length; i += 4) {
//   // imageData.data[i]     = red (0-255)
//   // imageData.data[i + 1] = green (0-255)
//   // imageData.data[i + 2] = blue (0-255)
//   // imageData.data[i + 3] = alpha (0-255)
// }
// ctx.putImageData(imageData, 0, 0);

// Animation loop:
// function animate() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   // Update positions, draw frame...
//   requestAnimationFrame(animate);
// }
// animate();

// State management:
// ctx.save();      // Push current state (styles, transforms, clipping)
// ctx.rotate(0.5);
// ctx.fillRect(50, 50, 100, 50);
// ctx.restore();   // Pop state back to before rotation

console.log("Canvas API provides 2D drawing via <canvas> element");
console.log("Common use cases: charts, games, image editing, data visualization");
console.log("For 3D graphics, see WebGL or WebGPU instead");


// ============================================
// 11. WEB COMPONENTS (Custom Elements + Shadow DOM)
// ============================================
/**
 * Web Components — Reusable, encapsulated custom HTML elements
 *
 * Three core technologies:
 * 1. Custom Elements — Define new HTML tags with custom behavior
 * 2. Shadow DOM — Encapsulated DOM tree with scoped styles
 * 3. HTML Templates — Declarative markup fragments for reuse
 *
 * Key benefits:
 * - Framework-agnostic reusable components
 * - Style encapsulation prevents CSS conflicts
 * - Standard browser API, no build step required
 * - Works with any framework (React, Vue, Angular, etc.)
 */

console.log("\n=== Web Components ===");

// Custom Elements + Shadow DOM example:
// In browser:
// class MyCounter extends HTMLElement {
//   constructor() {
//     super();
//     // Attach shadow DOM (open = accessible from outside via .shadowRoot)
//     this.attachShadow({ mode: 'open' });
//     this.count = 0;
//   }
//
//   // Called when element is added to DOM
//   connectedCallback() {
//     this.render();
//     this.shadowRoot.querySelector('#increment').addEventListener('click', () => {
//       this.count++;
//       this.render();
//     });
//   }
//
//   // Called when element is removed from DOM
//   disconnectedCallback() {
//     // Clean up event listeners, timers, etc.
//   }
//
//   // Attributes to observe for changes
//   static get observedAttributes() {
//     return ['initial-value'];
//   }
//
//   // Called when an observed attribute changes
//   attributeChangedCallback(name, oldValue, newValue) {
//     if (name === 'initial-value') {
//       this.count = parseInt(newValue) || 0;
//       this.render();
//     }
//   }
//
//   render() {
//     this.shadowRoot.innerHTML = `
//       <style>
//         /* Styles are scoped to this component! */
//         :host { display: inline-block; font-family: sans-serif; }
//         button { padding: 8px 16px; font-size: 16px; }
//         span { margin: 0 12px; font-weight: bold; }
//       </style>
//       <button id="decrement">-</button>
//       <span>${this.count}</span>
//       <button id="increment">+</button>
//     `;
//   }
// }
//
// // Register the custom element
// customElements.define('my-counter', MyCounter);

// Usage in HTML:
// <my-counter initial-value="5"></my-counter>

// HTML Templates:
// <template id="card-template">
//   <style>
//     .card { border: 1px solid #ccc; border-radius: 8px; padding: 16px; }
//   </style>
//   <div class="card">
//     <h3><slot name="title">Default Title</slot></h3>
//     <p><slot>Default content</slot></p>
//   </div>
// </template>

// Using a template in a custom element:
// class MyCard extends HTMLElement {
//   constructor() {
//     super();
//     this.attachShadow({ mode: 'open' });
//     const template = document.getElementById('card-template');
//     this.shadowRoot.appendChild(template.content.cloneNode(true));
//   }
// }
// customElements.define('my-card', MyCard);

// Declarative Shadow DOM (newer approach):
// <host-element>
//   <template shadowrootmode="open">
//     <style>...</style>
//     <slot></slot>
//   </template>
// </host-element>

console.log("Custom Elements: define new HTML tags with customElements.define()");
console.log("Shadow DOM: encapsulated DOM with scoped styles via attachShadow()");
console.log("HTML Templates: reusable markup via <template> and cloneNode()");
console.log("Lifecycle: connectedCallback, disconnectedCallback, attributeChangedCallback");
console.log("Key benefit: Framework-agnostic, built-in browser standard");


// ============================================
// 12. ADDITIONAL WEB APIs (Overview)
// ============================================
/**
 * Other important Web APIs to be aware of:
 *
 * Streams API:
 * - ReadableStream, WritableStream, TransformStream
 * - Used by fetch, File API, and WebSocket for streaming data
 * - Example: fetch(url).then(r => r.body.pipeThrough(transform).pipeTo(dest))
 *
 * ResizeObserver:
 * - More reliable than resize events for element size changes
 * - new ResizeObserver(entries => { ... }).observe(element)
 *
 * MutationObserver:
 * - Watch for DOM changes (attribute, childList, characterData)
 * - new MutationObserver(mutations => { ... }).observe(el, config)
 *
 * Pointer Events:
 * - Unified input model for mouse, touch, and pen
 * - pointerdown, pointermove, pointerup events
 * - Replaces separate mouse + touch event handling
 *
 * Drag and Drop API:
 * - Native drag-and-drop with draggable elements and drop zones
 * - Events: dragstart, dragover, drop, dragend
 * - DataTransfer object for sharing data between drag source and drop target
 *
 * BroadcastChannel API:
 * - Simple communication between same-origin browsing contexts
 * - const channel = new BroadcastChannel('app'); channel.postMessage(data);
 * - Cross-tab/iframe communication without shared storage polling
 */

console.log("\n=== Additional Web APIs Overview ===");
console.log("Streams API: ReadableStream/WritableStream for streaming data processing");
console.log("ResizeObserver: Efficient element size change detection");
console.log("MutationObserver: Watch for DOM mutations");
console.log("Pointer Events: Unified mouse/touch/pen input handling");
console.log("Drag & Drop: Native drag-and-drop with draggable elements");
console.log("BroadcastChannel: Cross-tab communication without polling");

// ============================================
// 13. WEB AUDIO API
// ============================================
/**
 * Web Audio API — Audio processing and synthesis
 *
 * Key concepts:
 * - AudioContext: The main audio processing graph
 * - OscillatorNode: Generate basic waveforms (sine, square, sawtooth, triangle)
 * - GainNode: Control volume
 * - BiquadFilterNode: Apply audio filters (lowpass, highpass, etc.)
 * - AnalyserNode: Extract frequency/time-domain data for visualization
 * - AudioBuffer: Store and play back audio samples
 * - MediaStreamAudioSourceNode: Capture from microphone
 *
 * Use cases: Games, music apps, audio visualization, spatial audio
 */

console.log("\n=== Web Audio API ===");

console.log(`
// Create audio context (must be after user gesture in browsers)
// const ctx = new (window.AudioContext || window.webkitAudioContext)();

// Basic tone generation:
// const oscillator = ctx.createOscillator();
// oscillator.type = 'sine'; // sine, square, sawtooth, triangle
// oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4 note

// const gainNode = ctx.createGain();
// gainNode.gain.setValueAtTime(0.5, ctx.currentTime); // 50% volume

// oscillator.connect(gainNode);
// gainNode.connect(ctx.destination); // speakers/headphones
// oscillator.start();
// oscillator.stop(ctx.currentTime + 1); // stop after 1 second

// Audio visualization with AnalyserNode:
// const analyser = ctx.createAnalyser();
// analyser.fftSize = 256;
// const bufferLength = analyser.frequencyBinCount;
// const dataArray = new Uint8Array(bufferLength);
// oscillator.connect(analyser);
// analyser.connect(ctx.destination);
// analyser.getByteFrequencyData(dataArray); // frequency data
// analyser.getByteTimeDomainData(dataArray); // waveform data

// Loading and playing audio files:
// const response = await fetch('sound.mp3');
// const arrayBuffer = await response.arrayBuffer();
// const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
// const source = ctx.createBufferSource();
// source.buffer = audioBuffer;
// source.connect(ctx.destination);
// source.start();

// Spatial audio with PannerNode:
// const panner = ctx.createPanner();
// panner.panningModel = 'HRTF'; // 3D spatial audio
// panner.setPosition(x, y, z);
// source.connect(panner).connect(ctx.destination);

console.log("Web Audio API enables programmatic audio synthesis and processing");
console.log("Key nodes: Oscillator, Gain, BiquadFilter, Analyser, Panner, Convolver");
`);


// ============================================
// 14. WEBRTC (Real-Time Communication)
// ============================================
/**
 * WebRTC — Peer-to-peer real-time communication
 *
 * Key APIs:
 * - MediaDevices.getUserMedia(): Capture camera/microphone
 * - RTCPeerConnection: Establish peer-to-peer connection
 * - RTCDataChannel: Send arbitrary data between peers
 * - MediaStream: Represent audio/video streams
 *
 * Use cases: Video calls, screen sharing, file transfer, multiplayer games
 */

console.log("\n=== WebRTC ===");

console.log(`
// Step 1: Get local media (camera + microphone)
// const localStream = await navigator.mediaDevices.getUserMedia({
//   video: true,
//   audio: true
// });
// Display: document.querySelector('video').srcObject = localStream;

// Step 2: Create peer connection
// const pc = new RTCPeerConnection({
//   iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
// });

// Step 3: Add local tracks to connection
// localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

// Step 4: Handle remote stream
// pc.ontrack = (event) => {
//   document.querySelector('#remoteVideo').srcObject = event.streams[0];
// };

// Step 5: Create offer/answer (signaling via WebSocket or other channel)
// const offer = await pc.createOffer();
// await pc.setLocalDescription(offer);
// // Send offer to remote peer via signaling server...
// // Receive answer from remote peer...
// await pc.setRemoteDescription(answer);

// Data Channel (for non-media data):
// const dataChannel = pc.createDataChannel('chat');
// dataChannel.onmessage = (e) => console.log('Received:', e.data);
// dataChannel.send('Hello peer!');

// Screen sharing:
// const screenStream = await navigator.mediaDevices.getDisplayMedia({
//   video: { cursor: 'always' },
//   audio: false
// });

console.log("WebRTC enables peer-to-peer audio/video/data communication");
console.log("Key APIs: getUserMedia, RTCPeerConnection, RTCDataChannel");
console.log("Requires signaling server for connection establishment (not included in API)");
`);
