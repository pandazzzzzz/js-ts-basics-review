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
	   View Transitions API (Chrome 106+, Safari 16.0+, Firefox 110+):
	   - Smooth animated transitions between page states
	   - document.startViewTransition(() => updateDOM())
	   - Supports both SPA (same-document) and MPA (cross-document) transitions
	   - CSS: ::view-transition pseudo-elements for custom animations
	   - Great for single-page app navigation
	   - ⚠️ Check support: if ('startViewTransition' in document)


   Popover API (Chrome 114+, Safari 16.4+):
   - Built-in popover without custom positioning
   - <button popovertarget="menu">
   - <div id="menu" popover>
   - No need for tooltip/menu libraries
   - Automatic focus management and accessibility
   - Implicit ARIA attributes for better screen reader support

   CSS Container Queries (Chrome 106+, Safari 16.0+):
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
*/
