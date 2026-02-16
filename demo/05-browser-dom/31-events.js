// 事件系统 Demo
// 📘 javascript.info Part 2 > "Introduction to Events", "UI Events"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/Events
// ⚠️ 浏览器环境专属

// ============================================
// TODO List for Events
// ============================================

// Section 1: 事件基础
// TODO: addEventListener / removeEventListener
// TODO: HTML 属性事件 (onclick) vs DOM 属性 (elem.onclick) vs addEventListener
// TODO: 事件对象 (event): type, target, currentTarget, timeStamp
// TODO: 多个处理器与执行顺序

// Section 2: 事件冒泡与捕获
// TODO: 冒泡 (Bubbling): 从目标元素向上传播
// TODO: event.stopPropagation() / event.stopImmediatePropagation()
// TODO: 捕获 (Capturing): addEventListener 第三个参数 { capture: true }
// TODO: 事件传播的三个阶段: 捕获 → 目标 → 冒泡

// Section 3: 事件委托 (Event Delegation)
// TODO: 利用冒泡实现事件委托
// TODO: event.target vs event.currentTarget
// TODO: 实际案例: 动态列表、表格操作
// TODO: 行为模式: data-action 属性

// Section 4: 浏览器默认行为
// TODO: event.preventDefault() 阻止默认行为
// TODO: passive: true 选项 (滚动性能优化)
// TODO: event.defaultPrevented 检查

// Section 5: 常见事件类型
// TODO: 鼠标事件: click, dblclick, mousedown/up, mouseover/out, mousemove
// TODO: 键盘事件: keydown, keyup (keypress 已废弃)
// TODO: 表单事件: submit, focus/blur, input, change
// TODO: 滚动事件: scroll
// TODO: 页面生命周期: DOMContentLoaded, load, beforeunload, unload

// Section 6: 自定义事件
// TODO: new Event() / new CustomEvent()
// TODO: elem.dispatchEvent() 触发自定义事件
// TODO: CustomEvent 的 detail 属性传递数据

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. EVENT TYPES
   TS:  MouseEvent, KeyboardEvent, FocusEvent, InputEvent 等精确类型
   TS:  addEventListener<K extends keyof HTMLElementEventMap>()

2. EVENT HANDLER TYPING
   TS:  (event: MouseEvent) => void
   TS:  EventListener vs EventListenerObject

3. CUSTOM EVENT TYPING
   TS:  CustomEvent<T> 泛型指定 detail 类型
*/
