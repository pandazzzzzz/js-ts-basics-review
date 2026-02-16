// 表单与验证 Demo
// 📘 javascript.info Part 2 > "Forms, controls"
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Learn/Forms
// ⚠️ 浏览器环境专属

// ============================================
// TODO List for Forms & Validation
// ============================================

// Section 1: 表单元素访问
// TODO: document.forms — 命名表单集合
// TODO: form.elements — 表单控件集合
// TODO: input.value, textarea.value, select.value
// TODO: checkbox / radio 的 checked 属性

// Section 2: 表单事件
// TODO: focus / blur 事件与 focusin / focusout (冒泡版本)
// TODO: input 事件 — 实时输入监听
// TODO: change 事件 — 值变更确认
// TODO: submit 事件与 form.submit()
// TODO: event.preventDefault() 阻止表单提交

// Section 3: 表单验证
// TODO: HTML5 内置验证: required, pattern, min/max, minlength/maxlength
// TODO: Constraint Validation API: checkValidity(), reportValidity()
// TODO: validity 对象: valueMissing, typeMismatch, patternMismatch 等
// TODO: setCustomValidity() 自定义错误消息
// TODO: :valid / :invalid CSS 伪类

// Section 4: 自定义验证逻辑
// TODO: 实时验证 vs 提交时验证
// TODO: 常见验证模式: 邮箱、手机号、密码强度
// TODO: 错误消息显示策略
// TODO: 防抖 (debounce) 在验证中的应用

// Section 5: 剪贴板与选择
// TODO: copy / cut / paste 事件
// TODO: Selection API 基础
// TODO: input.select() / setSelectionRange()

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. FORM ELEMENT TYPES
   TS:  HTMLFormElement, HTMLInputElement, HTMLSelectElement
   TS:  form.elements 需要类型断言

2. EVENT TYPING
   TS:  SubmitEvent, FocusEvent, InputEvent
   TS:  (e: Event) => { (e.target as HTMLInputElement).value }
*/
