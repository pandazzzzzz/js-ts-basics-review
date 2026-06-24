// TypeScript vs JavaScript: Storage and Network Comparison
// 📘 For JavaScript examples, see: 43-storage-network.js
// This file demonstrates TypeScript-specific type features for storage and network APIs

export {}; // Make this file a module to avoid global scope conflicts

// ============================================
// Section 1: localStorage/sessionStorage Types
// ============================================

console.log("=== localStorage/sessionStorage Types ===\n");

// Storage interface is fully typed in TypeScript
// interface Storage {
//   readonly length: number;
//   clear(): void;
//   getItem(key: string): string | null;
//   key(index: number): string | null;
//   removeItem(key: string): void;
//   setItem(key: string, value: string): void;
//   [name: string]: any;
// }

// Type-safe storage wrapper
class TypedStorage<T> {
  constructor(private storage: Storage = localStorage) {}

  set(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  get(key: string): T | null {
    const item = this.storage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }
}

// Usage
interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
}

const prefsStorage = new TypedStorage<UserPreferences>();
// prefsStorage.set("prefs", {
//   theme: "dark",
//   language: "en",
//   notifications: true
// });

// const prefs = prefsStorage.get("prefs");
// if (prefs) {
//   console.log("Theme:", prefs.theme);
// }

console.log(`
TypeScript Storage benefits:
- Storage interface with typed methods
- Type-safe wrapper classes
- Generic storage for any type
- Compile-time type checking
`);

// ============================================
// Section 2: Cookie Types
// ============================================

console.log("\n=== Cookie Types ===\n");

// Cookie attributes interface
interface CookieAttributes {
  path?: string;
  domain?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

// Type-safe cookie manager
class CookieManager {
  static set(name: string, value: string, attributes?: CookieAttributes): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (attributes) {
      if (attributes.path) {
        cookieString += `; path=${attributes.path}`;
      }
      if (attributes.domain) {
        cookieString += `; domain=${attributes.domain}`;
      }
      if (attributes.expires) {
        cookieString += `; expires=${attributes.expires.toUTCString()}`;
      }
      if (attributes.maxAge !== undefined) {
        cookieString += `; max-age=${attributes.maxAge}`;
      }
      if (attributes.secure) {
        cookieString += "; secure";
      }
      if (attributes.sameSite) {
        cookieString += `; samesite=${attributes.sameSite}`;
      }
    }

    // document.cookie = cookieString;
    console.log("Would set cookie:", cookieString);
  }

  static get(name: string): string | null {
    // const cookies = document.cookie.split("; ");
    // for (const cookie of cookies) {
    //   const [key, value] = cookie.split("=");
    //   if (decodeURIComponent(key) === name) {
    //     return decodeURIComponent(value);
    //   }
    // }
    return null;
  }

  static remove(name: string, attributes?: Pick<CookieAttributes, "path" | "domain">): void {
    CookieManager.set(name, "", {
      ...attributes,
      maxAge: -1
    });
  }
}

// Usage
CookieManager.set("sessionId", "abc123", {
  path: "/",
  maxAge: 3600,
  secure: true,
  sameSite: "strict"
});

console.log(`
TypeScript Cookie benefits:
- CookieAttributes interface
- Type-safe sameSite values
- Typed cookie manager
- Compile-time validation
`);

// ============================================
// Section 3: IndexedDB Types
// ============================================

console.log("\n=== IndexedDB Types ===\n");

// TypeScript provides full type definitions for IndexedDB
// IDBDatabase, IDBObjectStore, IDBTransaction, IDBRequest, etc.

// Type-safe IndexedDB wrapper
interface DBSchema {
  users: {
    key: number;
    value: {
      id: number;
      name: string;
      email: string;
    };
    indexes: {
      email: string;
    };
  };
}

class TypedDB<Schema extends Record<string, any>> {
  private db: IDBDatabase | null = null;

  async open(name: string, version: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        // Create object stores and indexes
        console.log("Database upgrade needed");
      };
    });
  }

  async add<K extends keyof Schema>(
    storeName: K,
    value: Schema[K]["value"]
  ): Promise<Schema[K]["key"]> {
    if (!this.db) throw new Error("Database not opened");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName as string], "readwrite");
      const store = transaction.objectStore(storeName as string);
      const request = store.add(value);

      request.onsuccess = () => resolve(request.result as Schema[K]["key"]);
      request.onerror = () => reject(request.error);
    });
  }

  async get<K extends keyof Schema>(
    storeName: K,
    key: Schema[K]["key"]
  ): Promise<Schema[K]["value"] | undefined> {
    if (!this.db) throw new Error("Database not opened");

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName as string], "readonly");
      const store = transaction.objectStore(storeName as string);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

// Usage
// const db = new TypedDB<DBSchema>();
// await db.open("MyDatabase", 1);
// await db.add("users", { id: 1, name: "Alice", email: "alice@example.com" });
// const user = await db.get("users", 1);

console.log(`
TypeScript IndexedDB benefits:
- Full type definitions for all IDB interfaces
- Type-safe schema definitions
- Generic wrappers for type safety
- Compile-time store name validation
`);

// ============================================
// Section 4: Fetch with Types
// ============================================

console.log("\n=== Fetch with Types ===\n");

// RequestInit and Response are fully typed
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

// Type-safe fetch wrapper
class TypedFetch {
  static async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: "GET"
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  static async post<T, B = unknown>(
    url: string,
    body: B,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}

// Usage
interface User {
  id: number;
  name: string;
  email: string;
}

// const user = await TypedFetch.get<User>("/api/user/1");
// console.log("User:", user.name);

// AbortController is fully typed
const controller: AbortController = new AbortController();
const signal: AbortSignal = controller.signal;

// fetch("/api/data", { signal })
//   .then(response => response.json())
//   .catch((error: Error) => {
//     if (error.name === "AbortError") {
//       console.log("Fetch aborted");
//     }
//   });

console.log(`
TypeScript Fetch benefits:
- RequestInit interface with all options
- Response interface with typed methods
- AbortController and AbortSignal types
- Generic fetch wrappers for type safety
`);

// ============================================
// Section 5: WebSocket with Types
// ============================================

console.log("\n=== WebSocket with Types ===\n");

// WebSocket is fully typed in TypeScript
// interface WebSocket extends EventTarget {
//   readonly readyState: number;
//   readonly url: string;
//   send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void;
//   close(code?: number, reason?: string): void;
//   // ... event handlers
// }

// Type-safe WebSocket wrapper
interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

class TypedWebSocket<SendMsg = unknown, ReceiveMsg = unknown> {
  private ws: WebSocket | null = null;
  private messageHandlers = new Map<string, (payload: any) => void>();

  connect(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);

      this.ws.addEventListener("open", () => resolve());
      this.ws.addEventListener("error", (event) => reject(event));

      this.ws.addEventListener("message", (event: MessageEvent) => {
        try {
          const message: WebSocketMessage<ReceiveMsg> = JSON.parse(event.data);
          const handler = this.messageHandlers.get(message.type);
          if (handler) {
            handler(message.payload);
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      });
    });
  }

  send(type: string, payload: SendMsg): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    const message: WebSocketMessage<SendMsg> = { type, payload };
    this.ws.send(JSON.stringify(message));
  }

  on<T extends ReceiveMsg>(
    type: string,
    handler: (payload: T) => void
  ): void {
    this.messageHandlers.set(type, handler);
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

// Usage
interface ChatMessage {
  user: string;
  text: string;
  timestamp: number;
}

// const ws = new TypedWebSocket<ChatMessage, ChatMessage>();
// await ws.connect("ws://localhost:8080");
// ws.on<ChatMessage>("message", (payload) => {
//   console.log(`${payload.user}: ${payload.text}`);
// });
// ws.send("message", { user: "Alice", text: "Hello!", timestamp: Date.now() });

console.log(`
TypeScript WebSocket benefits:
- WebSocket interface with typed methods
- MessageEvent<T> generic type
- Type-safe message handlers
- Typed send/receive messages
`);

// ============================================
// Section 6: Server-Sent Events with Types
// ============================================

console.log("\n=== Server-Sent Events with Types ===\n");

// EventSource is fully typed
// interface EventSource extends EventTarget {
//   readonly readyState: number;
//   readonly url: string;
//   close(): void;
//   // ... event handlers
// }

// Type-safe EventSource wrapper
class TypedEventSource<EventMap extends Record<string, any>> {
  private eventSource: EventSource | null = null;

  connect(url: string): void {
    this.eventSource = new EventSource(url);

    this.eventSource.addEventListener("open", () => {
      console.log("Connection opened");
    });

    this.eventSource.addEventListener("error", (event) => {
      console.error("Error:", event);
    });
  }

  on<K extends keyof EventMap>(
    eventType: K,
    handler: (data: EventMap[K]) => void
  ): void {
    if (!this.eventSource) {
      throw new Error("EventSource not connected");
    }

    this.eventSource.addEventListener(eventType as string, (event: Event) => {
      const messageEvent = event as MessageEvent;
      try {
        const data: EventMap[K] = JSON.parse(messageEvent.data);
        handler(data);
      } catch (error) {
        console.error("Failed to parse event data:", error);
      }
    });
  }

  close(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// Usage
interface ServerEvents {
  userJoined: { name: string; id: number };
  userLeft: { id: number };
  message: { user: string; text: string };
}

// const sse = new TypedEventSource<ServerEvents>();
// sse.connect("/events");
// sse.on("userJoined", (data) => {
//   console.log(`${data.name} joined`);
// });

console.log(`
TypeScript EventSource benefits:
- EventSource interface with typed methods
- MessageEvent type
- Type-safe event handlers
- Typed event data
`);

// ============================================
// Section 7: FormData with Types
// ============================================

console.log("\n=== FormData with Types ===\n");

// FormData is fully typed
// interface FormData {
//   append(name: string, value: string | Blob, fileName?: string): void;
//   delete(name: string): void;
//   get(name: string): FormDataEntryValue | null;
//   getAll(name: string): FormDataEntryValue[];
//   has(name: string): boolean;
//   set(name: string, value: string | Blob, fileName?: string): void;
// }

// Type-safe FormData builder
class TypedFormData<T extends Record<string, any>> {
  private formData = new FormData();

  append<K extends keyof T>(name: K, value: T[K]): this {
    if (typeof value === 'object' && value !== null && 'size' in value) {
      // Likely a Blob or File
      this.formData.append(name as string, value as any);
    } else {
      this.formData.append(name as string, String(value));
    }
    return this;
  }

  get<K extends keyof T>(name: K): FormDataEntryValue | null {
    return this.formData.get(name as string);
  }

  has<K extends keyof T>(name: K): boolean {
    return this.formData.has(name as string);
  }

  toFormData(): FormData {
    return this.formData;
  }
}

// Usage
interface UploadForm {
  username: string;
  email: string;
  file: File;
}

// const formData = new TypedFormData<UploadForm>()
//   .append("username", "Alice")
//   .append("email", "alice@example.com")
//   .append("file", fileInput.files[0]);

// fetch("/upload", {
//   method: "POST",
//   body: formData.toFormData()
// });

// ============================================
// Best Practices
// ============================================

console.log("\n=== Best Practices ===\n");

console.log("✅ DO:");
console.log("1. Use generic wrappers for type-safe storage");
console.log("2. Define interfaces for API responses");
console.log("3. Use RequestInit and Response types");
console.log("4. Create type-safe WebSocket/EventSource wrappers");
console.log("5. Use AbortController for cleanup");
console.log("6. Define schema interfaces for IndexedDB");

console.log("\n❌ DON'T:");
console.log("1. Don't use any type with storage/network APIs");
console.log("2. Don't forget to handle JSON parse errors");
console.log("3. Don't ignore AbortSignal for cleanup");
console.log("4. Don't forget to close WebSocket/EventSource");
console.log("5. Don't use string literals for event types");

console.log("\n📊 Comparison:");
console.log(`
┌─────────────────────────────────────────────────────────────────────┐
│ JAVASCRIPT VS TYPESCRIPT - STORAGE/NETWORK                         │
├─────────────────────────────────────────────────────────────────────┤
│ Storage:                                                            │
│   JavaScript: Storage interface (untyped values)                   │
│   TypeScript: Generic wrappers for type safety                     │
│                                                                     │
│ Fetch:                                                              │
│   JavaScript: fetch() returns Promise<Response>                    │
│   TypeScript: Generic wrappers for typed responses                 │
│                                                                     │
│ WebSocket:                                                          │
│   JavaScript: send(data: any)                                      │
│   TypeScript: Type-safe message handlers                           │
│                                                                     │
│ IndexedDB:                                                          │
│   JavaScript: IDBRequest<any>                                      │
│   TypeScript: IDBRequest<T> with schema types                      │
│                                                                     │
│ EventSource:                                                        │
│   JavaScript: MessageEvent (untyped data)                          │
│   TypeScript: Type-safe event handlers                             │
└─────────────────────────────────────────────────────────────────────┘
`);


// ============================================
// HISTORY API TYPES
// ============================================

console.log("\n=== History API Types ===\n");

// TypeScript: Built-in types for History API
// History interface with typed methods

// history.state is typed as any by default
const currentState: unknown = history.state;

// Type-safe state management
interface RouteState {
  page: string;
  userId?: number;
  scrollPosition?: number;
  timestamp: number;
}

// pushState with typed state
function navigateToProfile(userId: number): void {
  const state: RouteState = {
    page: 'profile',
    userId,
    scrollPosition: window.scrollY,
    timestamp: Date.now()
  };
  
  history.pushState(state, '', \`/profile/\${userId}\`);
}

// replaceState with typed state
function updateProfileTab(userId: number, tab: string): void {
  const state: RouteState = {
    page: 'profile',
    userId,
    timestamp: Date.now()
  };
  
  history.replaceState(state, '', \`/profile/\${userId}?tab=\${tab}\`);
}

// Type-safe popstate handler
window.addEventListener('popstate', (event: PopStateEvent) => {
  const state = event.state as RouteState | null;
  
  if (state) {
    console.log('Navigated to:', state.page);
    if (state.userId) {
      console.log('User ID:', state.userId);
    }
    if (state.scrollPosition !== undefined) {
      window.scrollTo(0, state.scrollPosition);
    }
  }
});

// Type-safe router class
interface Route<T = unknown> {
  path: string;
  handler: (state: T) => void;
}

class TypedRouter<TState = unknown> {
  private routes: Map<string, Route<TState>['handler']> = new Map();
  
  constructor() {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      this.handleRoute(location.pathname, event.state as TState);
    });
  }
  
  route(path: string, handler: (state: TState) => void): void {
    this.routes.set(path, handler);
  }
  
  navigate(path: string, state: TState): void {
    history.pushState(state, '', path);
    this.handleRoute(path, state);
  }
  
  private handleRoute(path: string, state: TState): void {
    const handler = this.routes.get(path);
    if (handler) {
      handler(state);
    }
  }
}

// Usage with typed state
interface AppState {
  view: 'home' | 'profile' | 'settings';
  data?: unknown;
}

const router = new TypedRouter<AppState>();

router.route('/', (state) => {
  console.log('Home view:', state.view);
});

router.route('/profile', (state) => {
  console.log('Profile view:', state.view, state.data);
});

// Navigate with type safety
router.navigate('/profile', { view: 'profile', data: { userId: 123 } });

console.log("History API TypeScript Features:");
console.log("  - Type-safe state objects");
console.log("  - Typed popstate event handlers");
console.log("  - Generic router classes");
console.log("  - Type-safe navigation methods");

// ============================================
// SERVER-SENT EVENTS (SSE) TYPES
// ============================================

console.log("\n=== Server-Sent Events Types ===\n");

// TypeScript: Built-in EventSource types
const eventSource: EventSource = new EventSource('/events');

// EventSource properties are typed
const url: string = eventSource.url;
const readyState: number = eventSource.readyState;
const withCredentials: boolean = eventSource.withCredentials;

// Type-safe event handlers
eventSource.addEventListener('open', (event: Event) => {
  console.log('Connection opened');
});

eventSource.addEventListener('message', (event: MessageEvent) => {
  const data: string = event.data;
  const lastEventId: string = event.lastEventId;
  const origin: string = event.origin;
  
  console.log('Message:', data);
});

eventSource.addEventListener('error', (event: Event) => {
  if (eventSource.readyState === EventSource.CLOSED) {
    console.log('Connection closed');
  }
});

// Type-safe custom events
interface NotificationData {
  title: string;
  message: string;
  timestamp: number;
}

eventSource.addEventListener('notification', (event: MessageEvent) => {
  const data: NotificationData = JSON.parse(event.data);
  console.log('Notification:', data.title);
});

// Usage with typed events — see TypedEventSource class definition above
interface AppEvents {
  notification: NotificationData;
  userJoined: { userId: number; name: string };
  message: { text: string; from: string };
}

const typedEventSource = new TypedEventSource<AppEvents>('/events');

typedEventSource.on('notification', (data) => {
  // data is typed as NotificationData
  console.log(data.title, data.message);
});

typedEventSource.on('userJoined', (data) => {
  // data is typed as { userId: number; name: string }
  console.log(\`User \${data.name} joined\`);
});

typedEventSource.onOpen(() => {
  console.log('Connected');
});

typedEventSource.onError((error) => {
  console.error('SSE error:', error);
});

// Type-safe SSE with React hook pattern
interface UseSSEOptions {
  reconnect?: boolean;
  maxRetries?: number;
}

interface UseSSEResult<T> {
  data: T | null;
  connected: boolean;
  error: Error | null;
}

function useSSE<T>(
  url: string,
  eventType: string = 'message',
  options?: UseSSEOptions
): UseSSEResult<T> {
  // Implementation would use useState, useEffect
  return {
    data: null,
    connected: false,
    error: null
  };
}

// Usage
interface StockPrice {
  symbol: string;
  price: number;
  change: number;
}

// const { data, connected, error } = useSSE<StockPrice>('/api/stocks', 'price');

console.log("\nServer-Sent Events TypeScript Features:");
console.log("  - Built-in EventSource types");
console.log("  - Type-safe event handlers");
console.log("  - Generic SSE client classes");
console.log("  - Typed custom events");
console.log("  - Type-safe React hooks");

console.log("\nBest Practices:");
console.log("  ✅ Define interfaces for event data");
console.log("  ✅ Use generic classes for type-safe SSE");
console.log("  ✅ Type custom event handlers");
console.log("  ✅ Handle connection states with types");
console.log("  ✅ Create reusable typed hooks");

console.log("\n📘 See 43-storage-network.js for detailed History API and SSE examples!");
