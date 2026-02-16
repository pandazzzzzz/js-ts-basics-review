// Intl 国际化 API Demo
// 📘 MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
// 📘 javascript.info: "Intl" (简要提及)
// 📌 ECMAScript Internationalization API

// ============================================
// TODO List for Intl API
// ============================================

// Section 1: Intl.NumberFormat — 数字格式化
// TODO: 基本用法: new Intl.NumberFormat(locale, options)
// TODO: 货币格式: style: 'currency', currency: 'USD'/'CNY'/'EUR'
// TODO: 百分比格式: style: 'percent'
// TODO: 单位格式: style: 'unit', unit: 'kilometer'/'celsius' (ES2020)
// TODO: 紧凑表示: notation: 'compact' (1K, 1M)
// TODO: 有效数字与小数位控制

// Section 2: Intl.DateTimeFormat — 日期时间格式化
// TODO: 基本用法: new Intl.DateTimeFormat(locale, options)
// TODO: 日期样式: dateStyle: 'full'/'long'/'medium'/'short'
// TODO: 时间样式: timeStyle: 'full'/'long'/'medium'/'short'
// TODO: 自定义格式: year, month, day, hour, minute, second
// TODO: 时区处理: timeZone 选项
// TODO: 与 10-date-time.js 的关联

// Section 3: Intl.Collator — 字符串排序比较
// TODO: 基本用法: new Intl.Collator(locale, options)
// TODO: 区分大小写排序: sensitivity: 'case'/'accent'/'base'
// TODO: 数字排序: numeric: true ('file1' < 'file10')
// TODO: 与 String.prototype.localeCompare() 的关系

// Section 4: Intl.PluralRules — 复数规则
// TODO: 基本用法: new Intl.PluralRules(locale)
// TODO: select() 返回: 'zero'/'one'/'two'/'few'/'many'/'other'
// TODO: 不同语言的复数规则差异

// Section 5: Intl.RelativeTimeFormat — 相对时间
// TODO: 基本用法: new Intl.RelativeTimeFormat(locale, options)
// TODO: format(-1, 'day') → "1 天前" / "yesterday"
// TODO: numeric: 'auto' vs 'always'

// Section 6: Intl.ListFormat — 列表格式化
// TODO: 基本用法: new Intl.ListFormat(locale, options)
// TODO: type: 'conjunction' (和) / 'disjunction' (或) / 'unit'
// TODO: format(['a', 'b', 'c']) → "a、b和c"

// Section 7: Intl.Segmenter — 文本分段 (ES2022)
// TODO: 基本用法: new Intl.Segmenter(locale, { granularity })
// TODO: granularity: 'grapheme' / 'word' / 'sentence'
// TODO: 中日韩文本分词的重要性

// Section 8: 实际应用
// TODO: 多语言网站的数字/日期显示
// TODO: 电商场景: 货币格式化
// TODO: 社交媒体: 相对时间显示 ("3 分钟前")
// TODO: 搜索与排序: 区域感知的字符串比较

// ============================================
// TypeScript Comparison Notes
// ============================================
/*
🔍 Key Differences in TypeScript:

1. INTL TYPES
   TS:  Intl.NumberFormat, Intl.DateTimeFormat 等有完整类型定义
   TS:  Intl.NumberFormatOptions, Intl.DateTimeFormatOptions

2. LOCALE STRING TYPE
   TS:  Intl.LocalesArgument (string | string[] | Intl.Locale)

📘 See related: 04-strings.js (localeCompare), 10-date-time.js (日期格式化)
*/
