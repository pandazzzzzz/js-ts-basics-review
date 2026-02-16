# Demo 文件结构 - 按学习路线图排序

**更新日期**: 2026-02-16  
**总文件数**: 22 个 JavaScript 文件 + 3 个 TypeScript 对比文件

---

## 📁 完整文件列表（按序号排序）

### Stage 1: Basics (01-04) ✅
基础语法和核心概念

```
demo/basics/
├── 01-variables.js                    # 变量声明、7种数据类型
│   └── 01-variables-ts-comparison.ts  # TypeScript 对比
├── 02-operators.js                    # 所有运算符类型
├── 03-control-flow.js                 # 控制结构、循环
└── 04-strings.js                      # 字符串方法、模板字面量
```

**覆盖概念**:
- var, let, const 声明
- 7 种原始类型（String, Number, Boolean, Null, Undefined, Symbol, BigInt）
- 所有运算符（算术、比较、逻辑、位运算、赋值）
- 控制流（if/else, switch, for, while, do-while）
- 字符串所有方法、模板字面量

---

### Stage 2: Data Structures (05-10) ⚠️
数据结构和内置对象

```
demo/data-structures/
├── 05-arrays.js                       # 数组方法、迭代
│   └── 05-arrays-ts-comparison.ts     # TypeScript 对比
├── 06-functions.js                    # 函数类型、高阶函数
│   └── 06-functions-ts-comparison.ts  # TypeScript 对比
├── 07-objects.js                      # 对象操作、方法
├── 08-map-set.js                      # Map 和 Set（🚧 骨架）
├── 09-json.js                         # JSON 操作（🚧 骨架）
└── 10-date-time.js                    # 日期时间处理（🚧 骨架）
```

**覆盖概念**:
- 数组创建、访问、所有方法（map, filter, reduce, forEach, find, sort, flat 等）
- 函数声明、表达式、箭头函数、高阶函数、闭包、柯里化、IIFE、递归
- 对象字面量、属性访问、Object 方法、Getter/Setter
- Map 和 Set（需完善 + WeakMap/WeakSet）
- JSON.parse/stringify（需完善）
- Date 对象（需完善）

---

### Stage 3: Core Concepts (11-17) ⚠️
核心概念和高级特性

```
demo/core-concepts/
├── 11-scope-closures.js               # 作用域、闭包
├── 12-error-handling.js               # 错误处理
├── 13-prototypes-inheritance.js       # 原型、继承
├── 14-modern-features.js              # ES6+ 特性
├── 15-regex.js                        # 正则表达式（🚧 骨架）
├── 16-iterators-generators.js         # 迭代器、生成器（🚧 骨架）
└── 17-proxy-reflect.js                # Proxy 和 Reflect（🚧 骨架）
```

**覆盖概念**:
- 全局、局部、块级作用域、词法作用域、闭包机制
- try/catch/finally、自定义错误
- 原型链、构造函数、Object.create()、Class 语法
- 展开运算符、解构、默认参数、剩余参数、类继承
- 正则表达式（需完善）
- 迭代器协议、生成器函数（需完善）
- Proxy 陷阱、Reflect API（需完善）

---

### Stage 4: Asynchronous (18-22) ⚠️
异步编程和模块系统

```
demo/asynchronous/
├── 18-event-loop-callbacks.js         # 事件循环、回调
├── 19-promises.js                     # Promise
├── 20-async-await.js                  # Async/Await
├── 21-modules.js                      # ES Modules
└── 22-fetch-api.js                    # Fetch API（🚧 骨架）
```

**覆盖概念**:
- 事件循环机制、回调函数模式、回调地狱
- Promise 创建、链式调用、Promise.all/race/allSettled/any
- async/await 语法、错误处理、并行 vs 串行执行
- import/export 语法、默认导出 vs 命名导出、动态导入
- Fetch API（需完善）

---

## 📊 文件状态统计

| 状态 | 数量 | 文件 |
|------|------|------|
| ✅ 完整 | 15 | 01-07, 11-14, 18-21 |
| 🚧 骨架 | 7 | 08-10, 15-17, 22 |
| **总计** | **22** | - |

---

## 🎯 序号规则

1. **唯一性**: 每个文件序号唯一，从 01 到 22
2. **连续性**: 序号连续，无跳号
3. **分组性**: 按 4 个学习阶段分组
4. **路线图顺序**: 遵循 JavaScript 学习路线图的推荐顺序

---

## 📝 序号变更记录

**2026-02-16 重新编号**:

### Core Concepts 文件夹
- `10-scope-closures.js` → `11-scope-closures.js`
- `11-error-handling.js` → `12-error-handling.js`
- `12-prototypes-inheritance.js` → `13-prototypes-inheritance.js`
- `13-modern-features.js` → `14-modern-features.js`
- `14-regex.js` → `15-regex.js`
- `15-iterators-generators.js` → `16-iterators-generators.js`
- `16-proxy-reflect.js` → `17-proxy-reflect.js` (新增)

### Asynchronous 文件夹
- `16-event-loop-callbacks.js` → `18-event-loop-callbacks.js`
- `17-promises.js` → `19-promises.js`
- `18-async-await.js` → `20-async-await.js`
- `19-modules.js` → `21-modules.js`
- `20-fetch-api.js` → `22-fetch-api.js`

### Data Structures 文件夹
- `10-date-time.js` (新增，保持序号)

---

## 🔄 下一步行动

### 优先级 1: 完善骨架文件
1. 08-map-set.js - 添加 WeakMap/WeakSet
2. 09-json.js - 完整的 JSON 操作
3. 10-date-time.js - 日期时间处理
4. 15-regex.js - 正则表达式完整教程
5. 16-iterators-generators.js - 迭代器和生成器
6. 17-proxy-reflect.js - Proxy 和 Reflect
7. 22-fetch-api.js - Fetch API 完整实现

### 优先级 2: 增强现有文件
- 18-event-loop-callbacks.js - 添加 setTimeout/setInterval 详解
- 19-promises.js - 添加 Promisification
- 21-modules.js - 添加 CommonJS 对比

---

**维护说明**: 
- 新增文件时，按照学习路线图顺序插入到相应位置
- 如需插入文件，重新编号后续所有文件以保持连续性
- 保持 4 个文件夹结构不变
