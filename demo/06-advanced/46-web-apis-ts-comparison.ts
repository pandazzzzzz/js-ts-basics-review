// TypeScript vs JavaScript: Web APIs Comparison
// 📘 For JavaScript examples, see: 46-web-apis.js
// This file demonstrates TypeScript-specific type features for Web APIs

export {}; // Make this file a module

// ============================================
// Section 1: Service Workers - Type Safety
// ============================================

console.log("=== Service Workers - Type Safety ===\n");

// Type-safe Service Worker registration
async function registerTypedServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration: ServiceWorkerRegistration = 
        await navigator.serviceWorker.register('/sw.js');
      
      console.log('✅ Service Worker registered:', registration.scope);
      
      registration.addEventListener('updatefound', () => {
        const newWorker: ServiceWorker | null = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            console.log('State:', newWorker.state);
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return null;
    }
  }
  return null;
}

// Type-safe message passing
interface ServiceWorkerMessage {
  type: 'CACHE_UPDATE' | 'SYNC_DATA' | 'NOTIFICATION';
  payload: any;
}

function sendMessageToSW(message: ServiceWorkerMessage): void {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message);
  }
}

// ============================================
// Section 2: Web Workers - Typed Messages
// ============================================

console.log("\n=== Web Workers - Typed Messages ===\n");

// Type-safe worker messages
type WorkerRequest = 
  | { type: 'calculate'; data: number }
  | { type: 'fibonacci'; data: number }
  | { type: 'sort'; data: number[] };

type WorkerResponse = 
  | { type: 'result'; data: number }
  | { type: 'error'; message: string };

class TypedWorker {
  private worker: Worker;

  constructor(workerUrl: string) {
    this.worker = new Worker(workerUrl);
    this.setupListeners();
  }

  private setupListeners(): void {
    this.worker.addEventListener('message', (e: MessageEvent<WorkerResponse>) => {
      console.log('📨 Worker response:', e.data);
    });

    this.worker.addEventListener('error', (e: ErrorEvent) => {
      console.error('❌ Worker error:', e.message);
    });
  }

  send(message: WorkerRequest): void {
    this.worker.postMessage(message);
  }

  terminate(): void {
    this.worker.terminate();
  }
}

// Generic worker wrapper
class GenericWorker<TRequest, TResponse> {
  private worker: Worker;
  private handlers: Map<string, (data: TResponse) => void> = new Map();

  constructor(workerUrl: string) {
    this.worker = new Worker(workerUrl);
    this.worker.addEventListener('message', (e: MessageEvent<TResponse>) => {
      this.handleMessage(e.data);
    });
  }

  send(message: TRequest): void {
    this.worker.postMessage(message);
  }

  on(event: string, handler: (data: TResponse) => void): void {
    this.handlers.set(event, handler);
  }

  private handleMessage(data: TResponse): void {
    this.handlers.forEach(handler => handler(data));
  }
}

// ============================================
// Section 3: Intersection Observer - Typed Options
// ============================================

console.log("\n=== Intersection Observer - Typed Options ===\n");

interface ObserverOptions extends IntersectionObserverInit {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

class TypedIntersectionObserver {
  private observer: IntersectionObserver;

  constructor(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: ObserverOptions
  ) {
    this.observer = new IntersectionObserver(callback, options);
  }

  observe(target: Element): void {
    this.observer.observe(target);
  }

  unobserve(target: Element): void {
    this.observer.unobserve(target);
  }

  disconnect(): void {
    this.observer.disconnect();
  }
}

// Lazy loading with types
class LazyImageLoader {
  private observer: IntersectionObserver;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              this.observer.unobserve(img);
            }
          }
        });
      },
      { threshold: 0.1 }
    );
  }

  observe(images: NodeListOf<HTMLImageElement>): void {
    images.forEach(img => this.observer.observe(img));
  }
}

// ============================================
// Section 4: Geolocation - Typed Coordinates
// ============================================

console.log("\n=== Geolocation - Typed Coordinates ===\n");

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

class GeolocationService {
  async getCurrentPosition(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coords: GeolocationCoordinates = position.coords;
          resolve({
            latitude: coords.latitude,
            longitude: coords.longitude,
            accuracy: coords.accuracy,
            altitude: coords.altitude,
            altitudeAccuracy: coords.altitudeAccuracy,
            heading: coords.heading,
            speed: coords.speed
          });
        },
        (error: GeolocationPositionError) => {
          reject(new Error(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  }

  watchPosition(
    callback: (location: LocationData) => void,
    errorCallback?: (error: Error) => void
  ): number {
    return navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        });
      },
      (error: GeolocationPositionError) => {
        errorCallback?.(new Error(error.message));
      }
    );
  }
}

// ============================================
// Section 5: WebSocket - Typed Messages
// ============================================

console.log("\n=== WebSocket - Typed Messages ===\n");

type WebSocketMessage<T = any> = {
  type: string;
  payload: T;
  timestamp: number;
};

class TypedWebSocket<TSend = any, TReceive = any> {
  private ws: WebSocket;
  private messageHandlers: Map<string, (data: TReceive) => void> = new Map();

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.setupListeners();
  }

  private setupListeners(): void {
    this.ws.addEventListener('open', () => {
      console.log('✅ WebSocket connected');
    });

    this.ws.addEventListener('message', (event: MessageEvent) => {
      try {
        const message: WebSocketMessage<TReceive> = JSON.parse(event.data);
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message.payload);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    });

    this.ws.addEventListener('close', (event: CloseEvent) => {
      console.log('❌ WebSocket closed:', event.code, event.reason);
    });

    this.ws.addEventListener('error', () => {
      console.error('❌ WebSocket error');
    });
  }

  send(type: string, payload: TSend): void {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage<TSend> = {
        type,
        payload,
        timestamp: Date.now()
      };
      this.ws.send(JSON.stringify(message));
    }
  }

  on(type: string, handler: (data: TReceive) => void): void {
    this.messageHandlers.set(type, handler);
  }

  close(code?: number, reason?: string): void {
    this.ws.close(code, reason);
  }

  get readyState(): number {
    return this.ws.readyState;
  }
}

// Usage example
interface ChatMessage {
  user: string;
  text: string;
}

// const chatSocket = new TypedWebSocket<ChatMessage, ChatMessage>('wss://chat.example.com');
// chatSocket.on('message', (data) => {
//   console.log(`${data.user}: ${data.text}`);
// });
// chatSocket.send('message', { user: 'Alice', text: 'Hello!' });

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use proper types for API responses");
console.log("2. Handle errors with typed error objects");
console.log("3. Use generics for reusable API wrappers");
console.log("4. Type message passing between workers");
console.log("5. Use strict null checks for optional properties");

console.log("\n❌ DON'T:");
console.log("1. Don't use any for API responses");
console.log("2. Don't ignore error types");
console.log("3. Don't forget to clean up observers/workers");
console.log("4. Don't assume APIs are always available");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - Web APIs                                │
├─────────────────────────────────────────────────────────────────────┤
│ Service Workers:                                                    │
│   JavaScript: Dynamic message passing                               │
│   TypeScript: Typed ServiceWorkerRegistration and messages          │
│                                                                      │
│ Web Workers:                                                        │
│   JavaScript: Untyped postMessage                                   │
│   TypeScript: Generic worker wrappers with typed messages           │
│                                                                      │
│ Intersection Observer:                                              │
│   JavaScript: Options as plain objects                              │
│   TypeScript: IntersectionObserverInit interface                    │
│                                                                      │
│ Geolocation:                                                        │
│   JavaScript: Callback-based API                                    │
│   TypeScript: Promise-based with GeolocationPosition types          │
│                                                                      │
│ WebSocket:                                                          │
│   JavaScript: String-based messages                                 │
│   TypeScript: Generic typed message system                          │
└─────────────────────────────────────────────────────────────────────┘
`);
