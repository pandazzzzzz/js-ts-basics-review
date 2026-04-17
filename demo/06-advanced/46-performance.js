// Performance Optimization Demo
// 📘 For TypeScript comparison, see: 46-performance-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Performance
// 📘 Web Performance: https://web.dev/performance/
// 📌 Covers performance measurement and optimization techniques

// ============================================
// Section 1: Performance API
// ============================================

console.log("\n=== Performance API ===");

// Performance.now() - High-resolution timestamp
const start = performance.now();
// Some operation
for (let i = 0; i < 1000000; i++) {}
const end = performance.now();
console.log(`Operation took ${(end - start).toFixed(2)}ms`);

// Performance marks and measures
performance.mark('task-start');

// Simulate task
setTimeout(() => {
  performance.mark('task-end');
  performance.measure('task-duration', 'task-start', 'task-end');
  
  const measure = performance.getEntriesByName('task-duration')[0];
  console.log(`Task duration: ${measure.duration.toFixed(2)}ms`);
}, 100);

// Navigation Timing
console.log("\nNavigation Timing:");
const navTiming = performance.getEntriesByType('navigation')[0];
if (navTiming) {
  console.log(`DOM Content Loaded: ${navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart}ms`);
  console.log(`Page Load: ${navTiming.loadEventEnd - navTiming.loadEventStart}ms`);
}

// Resource Timing
console.log("\nResource Timing:");
const resources = performance.getEntriesByType('resource');
resources.slice(0, 3).forEach(resource => {
  console.log(`${resource.name}: ${resource.duration.toFixed(2)}ms`);
});

// Use cases:
// - Performance monitoring
// - Bottleneck identification
// - A/B testing performance
// - Real User Monitoring (RUM)

// Common pitfalls:
// ⚠️ performance.now() is relative to page load
// ⚠️ Marks and measures need cleanup
// ⚠️ Too many measurements can impact performance
// ⚠️ Browser differences in precision

// ============================================
// Section 2: Performance Observer
// ============================================

console.log("\n=== Performance Observer ===");

// Observe performance entries
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`📊 ${entry.entryType}: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
  }
});

// Observe specific entry types
observer.observe({ 
  entryTypes: ['measure', 'navigation', 'resource', 'paint']
});

// First Paint and First Contentful Paint
const paintObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
  }
});

paintObserver.observe({ entryTypes: ['paint'] });

// Largest Contentful Paint (LCP)
const lcpObserver = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log(`📏 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
});

lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

// Use cases:
// - Real-time performance monitoring
// - Core Web Vitals tracking
// - Performance budgets
// - Automated alerts

// ============================================
// Section 3: Debounce and Throttle
// ============================================

console.log("\n=== Debounce and Throttle ===");

// Debounce - Execute after delay, reset on new call
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Example: Search input
const searchAPI = (query) => console.log(`🔍 Searching for: ${query}`);
const debouncedSearch = debounce(searchAPI, 300);

// Simulate typing
console.log("Typing 'hello':");
debouncedSearch('h');
debouncedSearch('he');
debouncedSearch('hel');
debouncedSearch('hell');
debouncedSearch('hello'); // Only this will execute after 300ms

// Throttle - Execute at most once per interval
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Example: Scroll event
const handleScroll = () => console.log('📜 Scroll position:', window.scrollY);
const throttledScroll = throttle(handleScroll, 200);

// window.addEventListener('scroll', throttledScroll);

// Use cases:
// - Debounce: Search input, window resize, form validation
// - Throttle: Scroll events, mouse move, API rate limiting

// Common pitfalls:
// ⚠️ Debounce delays execution, may feel laggy
// ⚠️ Throttle may miss the last call
// ⚠️ Memory leaks if not cleaned up
// ⚠️ Context (this) binding issues

// ============================================
// Section 4: Lazy Loading
// ============================================

console.log("\n=== Lazy Loading ===");

// Image lazy loading (native)
console.log("Native lazy loading:");
console.log('<img src="image.jpg" loading="lazy" alt="Lazy loaded">');

// Intersection Observer lazy loading
function lazyLoadImages() {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll('img.lazy');
  images.forEach(img => imageObserver.observe(img));
}

// Component lazy loading (React example)
console.log("\nComponent lazy loading:");
console.log(`
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
`);

// Route lazy loading
console.log("\nRoute lazy loading:");
console.log(`
const routes = [
  {
    path: '/dashboard',
    component: () => import('./Dashboard')
  },
  {
    path: '/profile',
    component: () => import('./Profile')
  }
];
`);

// Use cases:
// - Images below the fold
// - Heavy components
// - Route-based code splitting
// - Third-party libraries

// ============================================
// Section 5: Virtual Scrolling
// ============================================

console.log("\n=== Virtual Scrolling ===");

// Virtual scrolling - Only render visible items
class VirtualScroller {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.startIndex = 0;
    
    this.render();
    container.addEventListener('scroll', () => this.onScroll());
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.itemHeight);
    this.render();
  }

  render() {
    const endIndex = this.startIndex + this.visibleCount;
    const visibleItems = this.items.slice(this.startIndex, endIndex);
    
    // Update DOM with only visible items
    this.container.innerHTML = visibleItems
      .map((item, i) => `
        <div style="height: ${this.itemHeight}px; position: absolute; top: ${(this.startIndex + i) * this.itemHeight}px;">
          ${item}
        </div>
      `)
      .join('');
    
    // Set container height for scrollbar
    this.container.style.height = `${this.items.length * this.itemHeight}px`;
  }
}

console.log("Virtual scrolling example:");
console.log("- Renders only visible items");
console.log("- Handles 10,000+ items smoothly");
console.log("- Updates on scroll");

// Use cases:
// - Large lists (thousands of items)
// - Data tables
// - Chat messages
// - Social media feeds

// ============================================
// Section 6: Code Splitting
// ============================================

console.log("\n=== Code Splitting ===");

// Dynamic imports
console.log("Dynamic imports:");
console.log(`
// Load module on demand
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});

// Conditional loading
if (condition) {
  const { feature } = await import('./feature.js');
  feature.init();
}
`);

// Webpack code splitting
console.log("\nWebpack code splitting:");
console.log(`
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
`);

// Use cases:
// - Vendor code separation
// - Route-based splitting
// - Feature-based splitting
// - Conditional features

// ============================================
// Section 7: Memory Optimization
// ============================================

console.log("\n=== Memory Optimization ===");

// Memory leak detection
console.log("Common memory leaks:");
console.log("1. Forgotten timers");
console.log("2. Event listeners not removed");
console.log("3. Closures holding references");
console.log("4. Detached DOM nodes");

// Example: Proper cleanup
class Component {
  constructor() {
    this.timerId = null;
    this.handleClick = this.handleClick.bind(this);
  }

  mount() {
    this.timerId = setInterval(() => {
      console.log('Tick');
    }, 1000);
    
    document.addEventListener('click', this.handleClick);
  }

  unmount() {
    // Clean up timer
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    
    // Remove event listener
    document.removeEventListener('click', this.handleClick);
  }

  handleClick() {
    console.log('Clicked');
  }
}

// WeakMap for caching without memory leaks
const cache = new WeakMap();

function processObject(obj) {
  if (cache.has(obj)) {
    return cache.get(obj);
  }
  
  const result = /* expensive operation */ obj;
  cache.set(obj, result);
  return result;
}

// Use cases:
// - Component lifecycle management
// - Cache management
// - Event listener cleanup
// - Timer cleanup

// ============================================
// Common Pitfalls
// ============================================

console.log("\n=== Common Pitfalls ===");

// Pitfall 1: Premature optimization
console.log("\nPitfall 1: Premature optimization");
console.log("  Optimizing code paths that are not bottlenecks wastes time and adds complexity.");
console.log("  Fix: Profile first with Performance API or DevTools, then optimize the hottest paths.");

// Pitfall 2: Measuring without baseline
console.log("\nPitfall 2: Measuring without baseline");
console.log("  Without a baseline you cannot tell if a change improved or degraded performance.");
console.log("  Fix: Record baseline metrics with performance.mark/measure before any optimization.");

// Pitfall 3: Debounce/throttle confusion
console.log("\nPitfall 3: Debounce/throttle confusion");
console.log("  Using debounce when you need throttle (or vice versa) causes missed events or laggy UX.");
console.log("  Fix: Debounce for inputs that should fire once after typing stops; throttle for continuous events like scroll/mousemove.");

// Pitfall 4: Memory leaks from closures
console.log("\nPitfall 4: Memory leaks from closures");
console.log("  Closures can inadvertently hold references to large objects long after they are needed.");
console.log("  Fix: Nullify references you no longer need and avoid capturing heavy objects in long-lived callbacks.");

// Pitfall 5: Not cleaning up observers
console.log("\nPitfall 5: Not cleaning up observers");
console.log("  PerformanceObserver and IntersectionObserver instances keep firing until disconnected.");
console.log("  Fix: Always call observer.disconnect() in unmount/cleanup hooks.");

// Pitfall 6: Dynamic import waterfall
console.log("\nPitfall 6: Dynamic import waterfall");
console.log("  Sequentially awaiting dynamic imports (await A; await B) wastes time when modules are independent.");
console.log("  Fix: Use Promise.all() to load independent modules in parallel: await Promise.all([import('./A'), import('./B')]);");

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("\n✅ DO:");
console.log("1. Measure first - always profile with real data before deciding what to optimize.");
console.log("2. Use appropriate optimization - debounce inputs, throttle scroll/resize, virtualize long lists, lazy-load below-the-fold content.");
console.log("3. Profile in production - use PerformanceObserver and Real User Monitoring (RUM) to catch regressions early.");

console.log("\n❌ DON'T:");
console.log("1. Premature optimization - do not optimize code paths that have not been identified as bottlenecks.");
console.log("2. Optimize without measuring - every change should be validated against a baseline.");

console.log("\n⚠️ WATCH OUT FOR:");
console.log("1. Measurement accuracy - warm up caches, run multiple iterations, and account for JIT compilation variance.");
console.log("2. Real-world conditions - test on low-end devices and slow networks, not just your dev machine.");

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. PERFORMANCE API
   TS:  PerformanceEntry, PerformanceMark, PerformanceMeasure types
   TS:  Type-safe performance.getEntriesByType<T>()
   TS:  Typed PerformanceObserver callbacks

2. DEBOUNCE/THROTTLE
   TS:  Generic function types
   TS:  function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): T
   TS:  Preserves function signature

3. LAZY LOADING
   TS:  Type-safe dynamic imports
   TS:  const module: typeof import('./module') = await import('./module')
   TS:  React.lazy with component types

4. VIRTUAL SCROLLING
   TS:  Generic VirtualScroller<T>
   TS:  Type-safe item rendering
   TS:  Typed scroll callbacks

5. MEMORY OPTIMIZATION
   TS:  WeakMap<K extends object, V>
   TS:  Type-safe cache operations
   TS:  Typed cleanup methods

⚠️ BROWSER/RUNTIME SUPPORT:
- Performance API: All modern browsers
- Performance Observer: Chrome 52+, Firefox 57+, Safari 11+
- Intersection Observer: Chrome 51+, Firefox 55+, Safari 12.1+
- Dynamic imports: Chrome 63+, Firefox 67+, Safari 11.1+

🔧 BEST PRACTICES:
- Measure before optimizing
- Use Performance Observer for monitoring
- Debounce user input, throttle scroll/resize
- Lazy load below-the-fold content
- Clean up resources in unmount/destroy
- Use virtual scrolling for large lists
- Split code by routes and features

📘 See related:
- 35-memory-gc.js (Memory management)
- 41-web-apis.js (Intersection Observer)
- 33-es2022-plus-features.js (Dynamic imports)
*/
