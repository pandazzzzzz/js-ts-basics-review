// 存储与高级网络请求 Demo
// 📘 javascript.info Part 3 > "Storing data", "Network requests"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API
// ⚠️ 部分内容为浏览器环境专属

// ============================================
// TODO List for Storage & Advanced Network
// ============================================

// === Part A: 浏览器存储 ===

// Section 1: localStorage & sessionStorage
// TODO: localStorage.setItem() / getItem() / removeItem() / clear()
// TODO: sessionStorage 的生命周期 (标签页级别)
// TODO: 存储限制 (~5MB) 与字符串限制
// TODO: storage 事件 — 跨标签页通信
// TODO: JSON 序列化存储对象

// Section 2: Cookies
// TODO: document.cookie 读写
// TODO: Cookie 属性: path, domain, expires/max-age, secure, httpOnly, sameSite
// TODO: Cookie 大小限制 (~4KB) 与数量限制
// TODO: 与 localStorage 的对比与选择

// Section 3: IndexedDB
// TODO: IndexedDB 概念: 数据库、对象存储、事务
// TODO: 打开数据库: indexedDB.open()
// TODO: 创建对象存储与索引
// TODO: CRUD 操作: add, put, get, delete
// TODO: 游标 (Cursor) 遍历
// TODO: 与 localStorage 的对比: 容量、结构化数据、异步

// === Part B: 高级网络请求 ===

// Section 4: Fetch 进阶 (与 22-fetch-api.js 互补)
// TODO: AbortController — 取消请求
// TODO: Fetch 上传进度 (ReadableStream)
// TODO: FormData 与文件上传
// TODO: 跨域请求 (CORS) 详解

// Section 5: WebSocket
// TODO: new WebSocket(url) — 建立连接
// TODO: 事件: open, message, close, error
// TODO: ws.send() 发送数据 (文本与二进制)
// TODO: 心跳机制与重连策略
// TODO: 与 HTTP 轮询 / SSE 的对比

// Section 6: Server-Sent Events (SSE)
// TODO: new EventSource(url) — 服务器推送
// TODO: 事件: message, open, error
// TODO: 自定义事件类型
// TODO: 与 WebSocket 的对比: 单向 vs 双向

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. STORAGE TYPING
   TS:  Storage 接口类型
   TS:  自定义类型安全的存储封装

2. WEBSOCKET TYPING
   TS:  WebSocket, MessageEvent<T>
   TS:  CloseEvent, WebSocketEventMap

3. INDEXEDDB TYPING
   TS:  IDBDatabase, IDBObjectStore, IDBTransaction
   TS:  社区类型库: idb (Promise 封装)
*/
