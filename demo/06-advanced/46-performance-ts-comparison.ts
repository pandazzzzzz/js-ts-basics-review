// TypeScript vs JavaScript: Performance Optimization Comparison
// 📘 For JavaScript examples, see: 46-performance.js
// This file demonstrates TypeScript-specific type features for performance optimization

export {}; // Make this file a module

// ============================================
// Learning goals
// ============================================
// This file compares TypeScript-oriented patterns for performance measurement and optimization.
// The examples focus on how typing can make performance-related code easier to read and maintain.

// ============================================
// Section 1: Performance API - Type Safety
// ============================================

console.log("=== Performance API - Type Safety ===\n");

// Typed performance measurements
interface PerformanceTiming {
  name: string;
  duration: number;
  startTime: number;
}

class PerformanceMonitor {
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    this.marks.set(name, performance.now());
    performance.mark(name);
  }

  measure(name: string, startMark: string, endMark: string): PerformanceTiming | null {
    performance.measure(name, startMark, endMark);
    const entries = performance.getEntriesByName(name, 'measure');
    
    if (entries.length > 0) {
      const entry = entries[0];
      return {
        name: entry.name,
        duration: entry.duration,
        startTime: entry.startTime
      };
    }
    return null;
  }

  getMetrics(): PerformanceTiming[] {
    const measures = performance.getEntriesByType('measure');
    return measures.map(entry => ({
      name: entry.name,
      duration: entry.duration,
      startTime: entry.startTime
    }));
  }
}

const monitor = new PerformanceMonitor();
monitor.mark('operation-start');
// Operation
monitor.mark('operation-end');
const timing = monitor.measure('operation', 'operation-start', 'operation-end');
console.log('Timing:', timing);

// ============================================
// Section 2: Debounce and Throttle - Generics
// ============================================

console.log("\n=== Debounce and Throttle - Generics ===\n");

// Generic debounce with type preservation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  
  return function(this: any, ...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Generic throttle with type preservation
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Type-safe usage
const searchAPI = (query: string, filters?: string[]): void => {
  console.log(`Searching: ${query}`, filters);
};

const debouncedSearch = debounce(searchAPI, 300);
debouncedSearch('hello', ['recent']); // Type-safe

const handleScroll = (event: Event): void => {
  console.log('Scroll:', (event.target as Element).scrollTop);
};

const throttledScroll = throttle(handleScroll, 200);

// ============================================
// Section 3: Lazy Loading - Type-Safe Imports
// ============================================

console.log("\n=== Lazy Loading - Type-Safe Imports ===\n");

// Type-safe dynamic imports
// @ts-ignore — './module' is a demo-only placeholder that does not exist on disk
type ModuleType = typeof import('./module');

async function loadModule(): Promise<ModuleType> {
  // @ts-ignore — './module' is a demo-only placeholder that does not exist on disk
  const module = await import('./module');
  return module;
}

// Generic lazy loader
class LazyLoader<T> {
  private module: T | null = null;
  private loading: Promise<T> | null = null;

  constructor(private importFn: () => Promise<T>) {}

  async load(): Promise<T> {
    if (this.module) {
      return this.module;
    }

    if (this.loading) {
      return this.loading;
    }

    this.loading = this.importFn();
    this.module = await this.loading;
    this.loading = null;
    
    return this.module;
  }

  isLoaded(): boolean {
    return this.module !== null;
  }
}

// Usage
// const heavyModule = new LazyLoader(() => import('./heavy-module'));
// const module = await heavyModule.load();

// ============================================
// Section 4: Virtual Scrolling - Generic Types
// ============================================

console.log("\n=== Virtual Scrolling - Generic Types ===\n");

interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

class VirtualScroller<T> {
  private items: T[];
  private options: Required<VirtualScrollOptions>;
  private startIndex: number = 0;
  private visibleCount: number;

  constructor(items: T[], options: VirtualScrollOptions) {
    this.items = items;
    this.options = {
      ...options,
      overscan: options.overscan ?? 3
    };
    this.visibleCount = Math.ceil(
      options.containerHeight / options.itemHeight
    ) + this.options.overscan;
  }

  getVisibleItems(): { items: T[]; startIndex: number; endIndex: number } {
    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.items.length
    );
    
    return {
      items: this.items.slice(this.startIndex, endIndex),
      startIndex: this.startIndex,
      endIndex
    };
  }

  onScroll(scrollTop: number): void {
    this.startIndex = Math.floor(scrollTop / this.options.itemHeight);
  }

  getTotalHeight(): number {
    return this.items.length * this.options.itemHeight;
  }
}

// Usage
interface ListItem {
  id: number;
  name: string;
}

const items: ListItem[] = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
}));

const scroller = new VirtualScroller(items, {
  itemHeight: 50,
  containerHeight: 500,
  overscan: 5
});

console.log('Visible items:', scroller.getVisibleItems().items.length);

// ============================================
// Section 5: Memory Optimization - Typed Cache
// ============================================

console.log("\n=== Memory Optimization - Typed Cache ===\n");

// Type-safe WeakMap cache
class TypedCache<K extends object, V> {
  private cache = new WeakMap<K, V>();

  set(key: K, value: V): void {
    this.cache.set(key, value);
  }

  get(key: K): V | undefined {
    return this.cache.get(key);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  getOrCompute(key: K, compute: (key: K) => V): V {
    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }
    
    const value = compute(key);
    this.cache.set(key, value);
    return value;
  }
}

// Usage
interface User {
  id: number;
  name: string;
}

interface UserStats {
  posts: number;
  followers: number;
}

const userStatsCache = new TypedCache<User, UserStats>();

function getUserStats(user: User): UserStats {
  return userStatsCache.getOrCompute(user, (u) => ({
    posts: 0,
    followers: 0
  }));
}

// Memoization decorator
function Memoize<T extends (...args: any[]) => any>(
  target: any,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const originalMethod = descriptor.value!;
  const cache = new Map<string, ReturnType<T>>();

  descriptor.value = function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('📦 Cache hit');
      return cache.get(key)!;
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;

  return descriptor;
}

class Calculator {
  // @ts-expect-error — legacy decorators require experimentalDecorators: true
  @Memoize
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  // @ts-expect-error — legacy decorators require experimentalDecorators: true
  @Memoize
  factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use generics for reusable performance utilities");
console.log("2. Type performance measurements and metrics");
console.log("3. Preserve function signatures in debounce/throttle");
console.log("4. Use type-safe dynamic imports");
console.log("5. Type virtual scroller with item types");

console.log("\n❌ DON'T:");
console.log("1. Don't lose type information in wrappers");
console.log("2. Don't use any for performance callbacks");
console.log("3. Don't forget to type cache keys and values");
console.log("4. Don't ignore return types in async operations");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - Performance Optimization                │
├─────────────────────────────────────────────────────────────────────┤
│ Performance API:                                                    │
│   JavaScript: Untyped performance entries                           │
│   TypeScript: Typed PerformanceEntry and measurements               │
│                                                                      │
│ Debounce/Throttle:                                                  │
│   JavaScript: Function signature may be lost                        │
│   TypeScript: Generic types preserve signatures                     │
│                                                                      │
│ Lazy Loading:                                                       │
│   JavaScript: Dynamic imports return any                            │
│   TypeScript: Type-safe imports with module types                   │
│                                                                      │
│ Virtual Scrolling:                                                  │
│   JavaScript: Untyped item arrays                                   │
│   TypeScript: Generic VirtualScroller<T>                            │
│                                                                      │
│ Memory Optimization:                                                │
│   JavaScript: Untyped WeakMap                                       │
│   TypeScript: WeakMap<K extends object, V>                          │
└─────────────────────────────────────────────────────────────────────┘
`);
