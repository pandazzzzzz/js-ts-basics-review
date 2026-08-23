// Performance Optimization Demo
// 📘 For TypeScript comparison, see: 46-performance-ts-comparison.ts
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Performance
// 📘 Web Performance: https://web.dev/performance/
// 📌 Covers performance measurement and optimization techniques
export {};

// ============================================
// Learning goals
// ============================================
// This file introduces web performance measurement and common optimization techniques.
// The examples focus on how to observe runtime cost and interpret the results rather than on a single best-practice recipe.

// ============================================
// Table of Contents
// ============================================
// 1. Performance API
// 2. Performance Observer
// 3. Debounce and Throttle
// 4. Lazy Loading
// 5. Virtual Scrolling
// 6. Code Splitting
// 7. Memory Optimization
// 8. Common Pitfalls
// 9. Core Web Vitals (2025 Update)
// 10. Best Practices

// ============================================
// Section 1: Performance API (W3C / WHATWG Web API, not ECMAScript)
// - performance.now() provides high-resolution timestamps (High Resolution Time)
// - PerformanceObserver added via Performance Timeline (W3C/WHATWG)
// ============================================

console.log("\n=== Performance API ===");

// Performance.now() - High-resolution timestamp
const start = performance.now();
// Some operation
for (let i = 0; i < 1000000; i++) {}
const end = performance.now();
console.log(`Operation took ${(end - start).toFixed(2)}ms`);

// Performance marks and measures
performance.mark("task-start");

// Simulate task
setTimeout(() => {
  performance.mark("task-end");
  performance.measure("task-duration", "task-start", "task-end");

  const measure = performance.getEntriesByName("task-duration")[0];
  console.log(`Task duration: ${measure.duration.toFixed(2)}ms`);
}, 100);

// Navigation Timing
console.log("\nNavigation Timing:");
const navTiming = performance.getEntriesByType("navigation")[0];
if (navTiming) {
  console.log(
    `DOM Content Loaded: ${navTiming.domContentLoadedEventEnd - navTiming.domContentLoadedEventStart}ms`
  );
  console.log(`Page Load: ${navTiming.loadEventEnd - navTiming.loadEventStart}ms`);
}

// Resource Timing
console.log("\nResource Timing:");
const resources = performance.getEntriesByType("resource");
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

// ---- 实际测量案例：用 performance.now() 对比两种查找实现 ----
// 真实场景：一个高频调用的"去重"工具，用户反馈大数据量下变卡。
// 用 Performance API 实测，让数据说话，而不是凭感觉优化。
console.log("\n-- 实测案例：数组 indexOf vs Set.has 查找性能 --");

function benchmark(name, fn, iterations) {
  const t0 = performance.now();
  for (let i = 0; i < iterations; i++) fn(i);
  const t1 = performance.now();
  const ms = (t1 - t0).toFixed(2);
  console.log(`${name}: ${ms}ms`);
  return t1 - t0;
}

// 构造 10 万条已存在的记录用于去重
const records = Array.from({ length: 100000 }, (_, i) => `rec-${i}`);
const recordSet = new Set(records);
console.log(`构建 10 万条记录 + Set: done`);

const lookups = Array.from({ length: 10000 }, (_, i) => `rec-${i * 3}`);

// 实现 A：数组 indexOf（每次 O(n)）
function dedupeWithIndexOf(items, existing) {
  const seen = [];
  for (const it of items) if (existing.indexOf(it) === -1) seen.push(it);
  return seen;
}

// 实现 B：Set.has（每次 O(1)）
function dedupeWithSet(items, existing) {
  const seen = [];
  for (const it of items) if (!existing.has(it)) seen.push(it);
  return seen;
}

// 实测（各跑 5 次取稳定值）
let idxTotal = 0,
  setTotal = 0;
for (let run = 0; run < 5; run++) {
  idxTotal += benchmark("数组 indexOf", () => dedupeWithIndexOf(lookups, records), 1);
  setTotal += benchmark("Set.has", () => dedupeWithSet(lookups, recordSet), 1);
}
const idxAvg = (idxTotal / 5).toFixed(2);
const setAvg = (setTotal / 5).toFixed(2);
console.log(`\n平均耗时对比 → 数组 indexOf: ${idxAvg}ms  |  Set.has: ${setAvg}ms`);
console.log(`结论：Set.has 通常快一个数量级，因为 indexOf 是 O(n) 而 Set.has 是 O(1)`);
console.log("正是这种实测，才让「用 Set 代替 indexOf」的优化有据可依");

// ============================================
// Section 2: Performance Observer (W3C / WHATWG Web API)
// ============================================

console.log("\n=== Performance Observer ===");

// Observe performance entries
const observer = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(`📊 ${entry.entryType}: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
  }
});

// Observe specific entry types
observer.observe({
  entryTypes: ["measure", "navigation", "resource", "paint"],
});

// First Paint and First Contentful Paint
const paintObserver = new PerformanceObserver(list => {
  for (const entry of list.getEntries()) {
    console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
  }
});

paintObserver.observe({ entryTypes: ["paint"] });

// Largest Contentful Paint (LCP)
const lcpObserver = new PerformanceObserver(list => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  console.log(`📏 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
});

lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

// Use cases:
// - Real-time performance monitoring
// - Core Web Vitals tracking
// - Performance budgets
// - Automated alerts

// ============================================
// Section 3: Debounce and Throttle (ES5+)
// - Uses closures (ES3) and arrow functions (ES6); requestAnimationFrame (ES6 Browser)
// - See 24.2-debounce-throttle.js for complete implementations and variations
// ============================================

console.log("\n=== Debounce and Throttle (Performance Optimization) ===");

// Debounce and throttle are rate-limiting patterns that reduce unnecessary work.
// Full implementations: 24.2-debounce-throttle.js (7+ variations including cancelable,
// leading/trailing, Promise-based, maxWait, etc.)

// Performance Impact:
// - Debounce: Reduces N rapid calls to 1 (after quiet period)
// - Throttle: Reduces N calls to N/interval (steady rate)
// - Both prevent layout thrashing and excessive re-renders

// Quick debounce example (one-liner pattern):
const debouncedSearch = (delay => {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => console.log("Search:", a[0]), delay);
  };
})(300);

console.log("Debounce - search input optimization (reduces API calls):");
debouncedSearch("h");
debouncedSearch("he");
debouncedSearch("hel");
debouncedSearch("hell");
debouncedSearch("hello"); // Only this triggers

// Quick throttle example:
const throttledScroll = (limit => {
  let last = 0;
  return pos => {
    const now = Date.now();
    if (now - last >= limit) {
      console.log("Scroll:", pos);
      last = now;
    }
  };
})(200);

console.log("\nThrottle - scroll event optimization (reduces layout recalculation):");
for (let i = 0; i < 5; i++) {
  throttledScroll(i * 100); // Only first in each 200ms window fires
}

// Key Performance Takeaways:
// ✅ Debounce: Search inputs, resize events, form validation (wait for pause)
// ✅ Throttle: Scroll, mousemove, API rate limiting (steady stream)
// ✅ Both: Prevent excessive reflows/repaints in DOM-heavy applications
// ⚠️ Always clean up (cancel pending timers) when component unmounts to avoid memory leaks

// ============================================
// Section 4: Lazy Loading (ES2020+)
// - Native loading="lazy" (Browser), Intersection Observer (ES6 Browser), dynamic import() (ES2020)
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
        img.classList.remove("lazy");
        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll("img.lazy");
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
// Section 5: Virtual Scrolling (ES6+)
// - Uses ES6 classes, requestAnimationFrame, and Intersection Observer
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
    container.addEventListener("scroll", () => this.onScroll());
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
      .map(
        (item, i) => `
        <div style="height: ${this.itemHeight}px; position: absolute; top: ${(this.startIndex + i) * this.itemHeight}px;">
          ${item}
        </div>
      `
      )
      .join("");

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
// Section 6: Code Splitting (ES2020+)
// - Uses dynamic import() (ES2020) and build tool features
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
// Section 7: Memory Optimization (ES6+)
// - Uses WeakMap (ES6), WeakRef (ES2021), and FinalizationRegistry (ES2021)
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
      console.log("Tick");
    }, 1000);

    document.addEventListener("click", this.handleClick);
  }

  unmount() {
    // Clean up timer
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    // Remove event listener
    document.removeEventListener("click", this.handleClick);
  }

  handleClick() {
    console.log("Clicked");
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
console.log(
  "  Fix: Profile first with Performance API or DevTools, then optimize the hottest paths."
);

// Pitfall 2: Measuring without baseline
console.log("\nPitfall 2: Measuring without baseline");
console.log("  Without a baseline you cannot tell if a change improved or degraded performance.");
console.log(
  "  Fix: Record baseline metrics with performance.mark/measure before any optimization."
);

// Pitfall 3: Debounce/throttle confusion
console.log("\nPitfall 3: Debounce/throttle confusion");
console.log(
  "  Using debounce when you need throttle (or vice versa) causes missed events or laggy UX."
);
console.log(
  "  Fix: Debounce for inputs that should fire once after typing stops; throttle for continuous events like scroll/mousemove."
);

// Pitfall 4: Memory leaks from closures
console.log("\nPitfall 4: Memory leaks from closures");
console.log(
  "  Closures can inadvertently hold references to large objects long after they are needed."
);
console.log(
  "  Fix: Nullify references you no longer need and avoid capturing heavy objects in long-lived callbacks."
);

// Pitfall 5: Not cleaning up observers
console.log("\nPitfall 5: Not cleaning up observers");
console.log(
  "  PerformanceObserver and IntersectionObserver instances keep firing until disconnected."
);
console.log("  Fix: Always call observer.disconnect() in unmount/cleanup hooks.");

// Pitfall 6: Dynamic import waterfall
console.log("\nPitfall 6: Dynamic import waterfall");
console.log(
  "  Sequentially awaiting dynamic imports (await A; await B) wastes time when modules are independent."
);
console.log(
  "  Fix: Use Promise.all() to load independent modules in parallel: await Promise.all([import('./A'), import('./B')]);"
);

// ============================================
// Core Web Vitals (2025 Update)
// ============================================

console.log("\n=== Core Web Vitals (2025 Update) ===");

// Core Web Vitals - Google's user-centric performance metrics
// Updated in 2024: INP (Interaction to Next Paint) replaces FID
console.log("\n📊 Core Web Vitals (2025):");
console.log("1. LCP (Largest Contentful Paint) - Loading performance");
console.log("   - Good: ≤2.5s, Needs improvement: ≤4.0s");
console.log("2. INP (Interaction to Next Paint) - Interactivity (replacing FID)");
console.log("   - Good: ≤200ms, Needs improvement: ≤500ms");
console.log("   - FID was deprecated in March 2024, INP is the new official metric");
console.log("3. CLS (Cumulative Layout Shift) - Visual stability");
console.log("   - Good: ≤0.1, Needs improvement: ≤0.25");

// INP (Interaction to Next Paint) measurement
// INP is a stable Core Web Vital metric
// For production measurement, use the web-vitals library

console.log("\n💡 INP vs FID:");
console.log("- FID only measured first input delay");
console.log("- INP measures ALL interactions' latencies (best representation of responsiveness)");
console.log("- INP considers 98th percentile of interactions");
console.log("- Measures clicks, taps, and keyboard interactions");
console.log("- Excludes scroll and drag interactions");

console.log("\n✅ INP Measurement Best Practices:");
console.log("- Use web-vitals library: npm install web-vitals");
console.log("- INP is 98th percentile of all interaction latencies");
console.log("- Measures clicks, taps, and keyboard interactions");
console.log("- Excludes scroll and drag interactions");

const inpCodeExample = `
// Production-ready INP measurement using web-vitals:
// import { onINP } from 'web-vitals';

// onINP((metric) => {
//   console.log(\`INP: \${metric.value}ms\`);
//   // Send to analytics
// }, {
//   reportAllChanges: true
// });

// Fallback for browsers without INP support:
// Use FID (First Input Delay) as fallback
`;

console.log(inpCodeExample);

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===");

console.log("\n✅ DO:");
console.log("1. Measure first - always profile with real data before deciding what to optimize.");
console.log(
  "2. Use appropriate optimization - debounce inputs, throttle scroll/resize, virtualize long lists, lazy-load below-the-fold content."
);
console.log(
  "3. Profile in production - use PerformanceObserver and Real User Monitoring (RUM) to catch regressions early."
);

console.log("\n❌ DON'T:");
console.log(
  "1. Premature optimization - do not optimize code paths that have not been identified as bottlenecks."
);
console.log("2. Optimize without measuring - every change should be validated against a baseline.");

console.log("\n⚠️ WATCH OUT FOR:");
console.log(
  "1. Measurement accuracy - warm up caches, run multiple iterations, and account for JIT compilation variance."
);
console.log(
  "2. Real-world conditions - test on low-end devices and slow networks, not just your dev machine."
);

// ============================================
// Cross-references
// ============================================
console.log("\n=== Cross-references ===");
console.log("📘 26-optimization-performance.js - Optimization patterns");
console.log("📘 27-memory-management.js - Memory management");
console.log("📘 24.2-debounce-throttle.js - Complete debounce/throttle implementations");
console.log("📘 45-web-apis.js - Web APIs");

// ============================================
// TypeScript Comparison
// ============================================
/*
📘 See TypeScript comparison file: 46-performance-ts-comparison.ts
*/
