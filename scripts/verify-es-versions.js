#!/usr/bin/env node
/**
 * ES版本标注验证脚本（增强版）
 * 用法: node scripts/verify-es-versions.js [options]
 *
 * 选项:
 *   --fix        自动修复常见问题（source URL错误、lastVerified统一等）
 *   --template <name>  生成指定特性的验证块模板
 *   --check-ts    同时检查TypeScript比较文件.ts-comparison.ts
 *
 * 检查:
 * 1. reference/es-versions.json 的 lastVerified 是否过期（超过90天）
 * 2. demo文件中的ES版本标注是否与参考文件一致
 * 3. 同一feature在不同文件中标注是否一致
 * 4. verification block 中的 stage4Date 是否与 reference 一致
 * 5. lastVerified 日期在文件和 reference 之间是否一致
 * 6. 跨文件重复的 verification block 检测
 * 7. 引用 ES20xx 但缺少 verification block 的文件报告
 */

const fs = require('fs');
const path = require('path');

const REFERENCE_FILE = path.join(__dirname, '../reference/es-versions.json');
const DEMO_DIR = path.join(__dirname, '../demo');
const MAX_VERIFIED_DAYS = 90;

// 命令行参数
const args = process.argv.slice(2);
const OPTIONS = {
  fix: args.includes('--fix'),
  dryRun: args.includes('--dry-run') || args.includes('-n'),
  backup: args.includes('--backup') || args.includes('-b'),
  template: (() => {
    const idx = args.indexOf('--template');
    if (idx !== -1 && args[idx + 1]) {
      const tpl = { name: args[idx + 1] };
      const fileIdx = args.indexOf('--file');
      if (fileIdx !== -1 && args[fileIdx + 1]) {
        tpl.file = args[fileIdx + 1];
      }
      const lineIdx = args.indexOf('--line');
      if (lineIdx !== -1 && args[lineIdx + 1]) {
        tpl.line = parseInt(args[lineIdx + 1], 10);
      }
      return tpl;
    }
    return null;
  })(),
  checkTS: args.includes('--check-ts'),
  help: args.includes('--help') || args.includes('-h'),
  version: args.includes('--version') || args.includes('-v'),
  listFeatures: args.includes('--list-features') || args.includes('-l')
};

const VERSION = '2.1.0';

// 颜色输出支持检测
let useColors = true;
try {
  // 检测是否在支持颜色的终端中运行
  if (process.env.NO_COLOR || process.env.TERM === 'dumb' || !process.stdout.isTTY) {
    useColors = false;
  }
} catch (e) {
  useColors = false;
}

const colors = {
  red: useColors ? '\x1b[31m' : '',
  green: useColors ? '\x1b[32m' : '',
  yellow: useColors ? '\x1b[33m' : '',
  cyan: useColors ? '\x1b[36m' : '',
  reset: useColors ? '\x1b[0m' : ''
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 安全的文件读取
function safeReadFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: `File not found: ${filePath}`, content: null };
    }
    return { success: true, error: null, content: fs.readFileSync(filePath, 'utf8') };
  } catch (e) {
    return { success: false, error: e.message, content: null };
  }
}

// 安全的文件写入（支持备份）
function safeWriteFile(filePath, content, createBackup = false) {
  try {
    if (createBackup && fs.existsSync(filePath)) {
      const backupPath = filePath + '.bak';
      fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf8'), 'utf8');
      log('cyan', `  Backup created: ${path.basename(backupPath)}`);
    }
    fs.writeFileSync(filePath, content, 'utf8');
    return { success: true, error: null };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
ES版本标注验证脚本 v${VERSION}
用法: node scripts/verify-es-versions.js [options]

选项:
  -h, --help                显示此帮助信息
  -v, --version             显示版本号
  -l, --list-features       列出所有可用的特性名称
  -n, --dry-run             预览修改内容但不实际写入文件（与--fix配合使用）
  -b, --backup              修复前自动创建 .bak 备份文件（与--fix配合使用）
  --fix                     自动修复常见问题（source URL错误、lastVerified统一等）
  --template <feature-name> 生成指定特性的验证块模板
    --file <path>             将模板直接插入到指定文件
    --line <num>              插入到指定行号（默认文件末尾）
  --check-ts                同时检查TypeScript比较文件(*.ts-comparison.ts)

检查项:
  1. reference/es-versions.json 的 lastVerified 是否过期（超过90天）
  2. demo文件中的ES版本标注是否与参考文件一致
  3. 同一feature在不同文件中标注是否一致
  4. verification block 中的 stage4Date 是否与 reference 一致
  5. lastVerified 日期在文件和 reference 之间是否一致
  6. 跨文件重复的 verification block 检测
  7. 引用 ES20xx 但缺少 verification block 的文件报告

示例:
  基础验证:                  node scripts/verify-es-versions.js
  同时验证JS和TS文件:        node scripts/verify-es-versions.js --check-ts
  自动修复并预览修改:        node scripts/verify-es-versions.js --fix --dry-run
  修复并创建备份:            node scripts/verify-es-versions.js --fix --backup
  列出所有可用特性:          node scripts/verify-es-versions.js --list-features
  生成Decorators验证块模板:  node scripts/verify-es-versions.js --template "Decorators"
  直接插入模板到文件:        node scripts/verify-es-versions.js --template "Decorators" --file demo/03-core-concepts/18-es6-plus-syntax.js --line 790
`);
}

// 显示版本信息
function showVersion() {
  console.log(`v${VERSION}`);
}

// 获取所有JS和（可选）TS文件
function getAllCodeFiles(dir, includeTS = false) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllCodeFiles(fullPath, includeTS));
    } else if (entry.name.endsWith('.js') || (includeTS && entry.name.endsWith('.ts'))) {
      files.push(fullPath);
    }
  }

  return files;
}

function loadReference() {
  const result = safeReadFile(REFERENCE_FILE);
  if (!result.success) {
    log('red', `❌ Cannot read reference file: ${result.error}`);
    process.exit(1);
  }
  try {
    return JSON.parse(result.content);
  } catch (e) {
    log('red', `❌ Reference file is not valid JSON: ${e.message}`);
    process.exit(1);
  }
}

function checkLastVerified(reference) {
  const lastVerified = new Date(reference.meta.lastVerified);
  const daysSince = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince > MAX_VERIFIED_DAYS) {
    log('yellow', `⚠️  reference/es-versions.json lastVerified is ${daysSince} days ago (>${MAX_VERIFIED_DAYS} days)`);
    log('yellow', '   Please verify against TC39 official data and update lastVerified');
    return false;
  }

  log('green', `✅ lastVerified: ${reference.meta.lastVerified} (${daysSince} days ago)`);
  return true;
}

function validateStage4Dates(reference) {
  const issues = [];
  for (const [name, feature] of Object.entries(reference.features)) {
    if (feature.stage === 4) {
      if (!feature.stage4Date) {
        issues.push({ name, issue: `Missing stage4Date` });
      } else if (!/^\d{4}-\d{2}$/.test(feature.stage4Date)) {
        issues.push({ name, stage4Date: feature.stage4Date, issue: `Invalid format, expected YYYY-MM` });
      }
    }
  }
  return issues;
}

function buildFeaturePatterns(reference) {
  const patterns = [];

  // Short feature names that need precise matching (avoid substring matches)
  const shortNames = {
    at: /\.at\([^)]*\)[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi,
    with: /\.with\([^)]*\)[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi
  };

  for (const [name, regex] of Object.entries(shortNames)) {
    patterns.push({ name, regex });
  }

  // Generate patterns for all other features from reference
  const skipNames = new Set(['at', 'with']);
  for (const featureName of Object.keys(reference.features)) {
    if (skipNames.has(featureName)) continue;
    const escaped = featureName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');
    patterns.push({
      name: featureName,
      regex: new RegExp(`${escaped}[^\n]*?\\b(ES20\\d{2}|Stage\\s*[0-4])\\b`, 'gi')
    });
  }

  // Aliases for features with common variations
  patterns.push(
    { name: 'Temporal', regex: /Temporal(?:\s+API)?[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi },
    { name: 'using (Explicit Resource Management)', regex: /(?:using declaration|Explicit Resource Management)[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi },
    { name: 'RegExp v flag', regex: /RegExp\s+\/v[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi }
  );

  return patterns;
}

function extractAnnotations(content, filePath, featurePatterns) {
  const annotations = [];

  for (const pattern of featurePatterns) {
    const matches = content.matchAll(pattern.regex);
    for (const match of matches) {
      let version = null;
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          version = match[i].replace(/Stage\s*/, 'Stage ');
          break;
        }
      }
      if (!version) continue;

      if (!version.match(/^ES20\d{2}$/) && !version.match(/^Stage \d$/)) continue;

      annotations.push({
        feature: pattern.name,
        version,
        line: content.substring(0, match.index).split('\n').length,
        file: path.relative(path.dirname(REFERENCE_FILE), filePath)
      });
    }
  }

  return annotations;
}

function extractVerificationBlocks(content, filePath) {
  const blocks = [];
  const regex = /\/\*\s*\n\s*\*\s*verification:\s*\n((?:\s*\*[^\n]*\n)*)\s*\*\//g;
  const relPath = path.relative(path.dirname(REFERENCE_FILE), filePath);

  let match;
  while ((match = regex.exec(content)) !== null) {
    const blockText = match[1];
    const featureMatch = blockText.match(/feature:\s*(.+)/);
    const stage4DateMatch = blockText.match(/stage4Date:\s*(.+)/);
    const lastVerifiedMatch = blockText.match(/lastVerified:\s*(.+)/);
    const statusMatch = blockText.match(/status:\s*(.+)/);
    const sourceMatch = blockText.match(/source:\s*(.+)/);

    if (featureMatch) {
      blocks.push({
        feature: featureMatch[1].trim(),
        status: statusMatch ? statusMatch[1].trim() : null,
        stage4Date: stage4DateMatch ? stage4DateMatch[1].trim() : null,
        lastVerified: lastVerifiedMatch ? lastVerifiedMatch[1].trim() : null,
        source: sourceMatch ? sourceMatch[1].trim() : null,
        line: content.substring(0, match.index).split('\n').length,
        file: relPath
      });
    }
  }
  return blocks;
}

// 自动修复：修复source URL错误
function fixSourceURL(block, reference) {
  const featureRef = reference.features[block.feature];
  if (!featureRef) return null;

  const currentSource = block.source;
  let expectedSource = null;

  // Stage 4 features应该指向finished-proposals.md
  if (featureRef.stage === 4) {
    expectedSource = 'https://github.com/tc39/proposals/blob/main/finished-proposals.md';
  }
  // Stage 1-3 features应该指向README.md
  else if (featureRef.stage < 4) {
    expectedSource = 'https://github.com/tc39/proposals/blob/main/README.md';
  }

  if (currentSource !== expectedSource) {
    return { old: currentSource, new: expectedSource };
  }
  return null;
}

// 自动修复：统一lastVerified日期
function syncLastVerified(block, referenceDate) {
  if (!block.lastVerified || block.lastVerified !== referenceDate) {
    return { old: block.lastVerified, new: referenceDate };
  }
  return null;
}

// 应用修复到文件
function applyFixes(filePath, fixes, originalContent = null) {
  if (fixes.length === 0) return { modified: false, content: originalContent };

  let content = originalContent !== null ? originalContent : null;
  if (content === null) {
    const result = safeReadFile(filePath);
    if (!result.success) {
      log('red', `  ❌ Cannot read ${filePath}: ${result.error}`);
      return { modified: false, content: null, changes: [] };
    }
    content = result.content;
  }

  let modified = false;
  const changes = [];

  for (const fix of fixes) {
    if (fix.type === 'source') {
      // 替换source行
      const pattern = new RegExp(`(\\*\\s*source:\\s*)${fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
      const newContent = content.replace(pattern, (match, p1) => {
        modified = true;
        changes.push({ type: 'source', feature: fix.feature, line: null, old: fix.old, new: fix.new });
        return `${p1}${fix.new}`;
      });
      if (newContent !== content) {
        content = newContent;
        if (!OPTIONS.dryRun) {
          log('cyan', `  Fixed source URL for "${fix.feature}"`);
          log('cyan', `    Old: ${fix.old}`);
          log('cyan', `    New: ${fix.new}`);
        } else {
          log('cyan', `  Would fix source URL for "${fix.feature}"`);
          log('cyan', `    Old: ${fix.old}`);
          log('cyan', `    New: ${fix.new}`);
        }
      }
    } else if (fix.type === 'lastVerified') {
      let fixed = false;
      let change = null;
      if (fix.old) {
        const escapedOld = fix.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const oldPattern = new RegExp(`\\*\\s*lastVerified:\\s*${escapedOld}`, 'g');
        const newContent = content.replace(oldPattern, (match) => {
          fixed = true;
          change = { type: 'lastVerified', feature: fix.feature, old: fix.old, new: fix.new };
          return ` *   lastVerified: ${fix.new}`;
        });
        if (newContent !== content) {
          content = newContent;
        }
      }
      if (!fixed) {
        const genericPattern = /(\*\s*lastVerified:\s*)[^\n*]*/g;
        const newContent = content.replace(genericPattern, (match, p1) => {
          fixed = true;
          change = { type: 'lastVerified', feature: fix.feature, old: fix.old || '(not set)', new: fix.new };
          return `${p1}${fix.new}`;
        });
        if (newContent !== content) {
          content = newContent;
        }
      }
      if (fixed) {
        modified = true;
        changes.push(change);
        if (!OPTIONS.dryRun) {
          log('cyan', `  Fixed lastVerified for "${fix.feature}"`);
          log('cyan', `    Old: ${fix.old || '(not set)'}`);
          log('cyan', `    New: ${fix.new}`);
        } else {
          log('cyan', `  Would fix lastVerified for "${fix.feature}"`);
          log('cyan', `    Old: ${fix.old || '(not set)'}`);
          log('cyan', `    New: ${fix.new}`);
        }
      }
    }
  }

  if (modified && !OPTIONS.dryRun && originalContent === null) {
    const result = safeWriteFile(filePath, content, OPTIONS.backup);
    if (!result.success) {
      log('red', `  ❌ Failed to write ${filePath}: ${result.error}`);
    }
  }

  return { modified, content, changes };
}

// 生成验证块模板
function generateTemplate(featureName, reference, targetFile = null, targetLine = null) {
  const featureRef = reference.features[featureName];

  if (!featureRef) {
    log('red', `❌ Feature "${featureName}" not found in reference`);
    log('yellow', 'Run with --list-features to see all available features');
    return { success: false, error: 'Feature not found' };
  }

  let template = `/*
 * verification:
 *   feature: ${featureName}
 *   status: ${featureRef.status}`;

  if (featureRef.stage4Date) {
    template += `\n *   stage4Date: ${featureRef.stage4Date}`;
  }

  const currentDate = new Date().toISOString().split('T')[0];
  template += `\n *   lastVerified: ${currentDate}`;

  // 根据stage设置正确的source
  if (featureRef.stage === 4) {
    template += `\n *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md`;
  } else {
    template += `\n *   source: https://github.com/tc39/proposals/blob/main/README.md`;
  }

  template += `\n */`;

  log('cyan', `\n=== Verification Block Template ===`);
  log('cyan', `Feature: ${featureName}`);
  log('cyan', `Status: ${featureRef.status}`);
  if (featureRef.stage4Date) {
    log('cyan', `Stage 4 Date: ${featureRef.stage4Date}`);
  }

  // 如果指定了目标文件，直接插入
  if (targetFile) {
    const resolvedPath = path.isAbsolute(targetFile)
      ? targetFile
      : path.resolve(process.cwd(), targetFile);

    const result = safeReadFile(resolvedPath);
    if (!result.success) {
      log('red', `❌ Cannot read target file: ${result.error}`);
      return { success: false, error: result.error };
    }

    const lines = result.content.split('\n');
    const insertLine = targetLine !== null ? Math.min(targetLine, lines.length) : lines.length;

    // 在指定行之前插入模板
    const templateLines = template.split('\n');
    lines.splice(insertLine, 0, ...templateLines, '');
    const newContent = lines.join('\n');

    const writeResult = safeWriteFile(resolvedPath, newContent, OPTIONS.backup);
    if (!writeResult.success) {
      log('red', `❌ Failed to write file: ${writeResult.error}`);
      return { success: false, error: writeResult.error };
    }

    log('green', `✅ Template inserted into ${path.basename(resolvedPath)} at line ${insertLine}`);
    return { success: true, file: resolvedPath, line: insertLine };
  }

  // 否则输出到控制台
  console.log('\n' + template + '\n');
  return { success: true, template };
}

function listFeatures(reference) {
  log('cyan', `\n=== Available Features ===\n`);

  // 按状态分组
  const groups = {
    'ES2027': [],
    'ES2026': [],
    'ES2025': [],
    'ES2024': [],
    'ES2023': [],
    'ES2022': [],
    'ES2021': [],
    'Stage 3': [],
    'Stage 2': [],
    'Other': []
  };

  for (const [name, feature] of Object.entries(reference.features)) {
    const status = feature.status;
    if (groups[status]) {
      groups[status].push(name);
    } else {
      groups['Other'].push(name);
    }
  }

  // 按顺序显示
  const order = ['ES2027', 'ES2026', 'ES2025', 'ES2024', 'ES2023', 'ES2022', 'ES2021', 'Stage 3', 'Stage 2', 'Other'];
  for (const status of order) {
    if (groups[status].length > 0) {
      log('green', `\n${status}:`);
      for (const name of groups[status].sort()) {
        console.log(`  - ${name}`);
      }
    }
  }

  console.log(`\nTotal: ${Object.keys(reference.features).length} features`);
}

function checkBlockStage4Dates(blocks, reference) {
  const issues = [];
  for (const block of blocks) {
    const featureRef = reference.features[block.feature];
    if (!featureRef) continue;
    if (block.stage4Date && featureRef.stage4Date) {
      if (block.stage4Date !== featureRef.stage4Date) {
        issues.push({
          file: block.file,
          line: block.line,
          feature: block.feature,
          found: block.stage4Date,
          expected: featureRef.stage4Date
        });
      }
    }
  }
  return issues;
}

function detectDuplicateBlocks(blocks) {
  const duplicates = [];
  const seen = {};

  for (const block of blocks) {
    const key = block.feature;
    if (!seen[key]) {
      seen[key] = [];
    }
    seen[key].push(block);
  }

  for (const [feature, occurrences] of Object.entries(seen)) {
    if (occurrences.length > 1) {
      duplicates.push({
        feature,
        locations: occurrences.map(b => `${b.file}:${b.line}`)
      });
    }
  }

  return duplicates;
}

function checkLastVerifiedConsistency(blocks, reference) {
  const issues = [];
  const refDate = reference.meta.lastVerified;

  // Collect all unique lastVerified dates from blocks
  const datesByFile = {};
  for (const block of blocks) {
    if (block.lastVerified) {
      if (!datesByFile[block.file]) {
        datesByFile[block.file] = new Set();
      }
      datesByFile[block.file].add(block.lastVerified);
    }
  }

  // Check if any file has multiple lastVerified dates
  for (const [file, dates] of Object.entries(datesByFile)) {
    if (dates.size > 1) {
      issues.push({
        type: 'mixed_dates',
        file,
        dates: [...dates]
      });
    }
  }

  // Check if demo file lastVerified matches reference lastVerified
  const allDates = new Set();
  for (const dates of Object.values(datesByFile)) {
    for (const d of dates) {
      allDates.add(d);
    }
  }

  if (allDates.size > 1) {
    issues.push({
      type: 'inconsistent_across_files',
      dates: [...allDates],
      referenceDate: refDate
    });
  } else if (allDates.size === 1) {
    const demoDate = [...allDates][0];
    if (demoDate !== refDate) {
      issues.push({
        type: 'demo_reference_mismatch',
        demoDate,
        referenceDate: refDate
      });
    }
  }

  return issues;
}

function checkMissingVerificationBlocks(filePath, content, featurePatterns, reference, blocks) {
  const featuresInFile = new Set(blocks.map(b => b.feature));
  const featuresInAnnotations = new Set();

  // Check which features are referenced in annotations but lack blocks
  for (const pattern of featurePatterns) {
    const matches = content.matchAll(pattern.regex);
    for (const match of matches) {
      let version = null;
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          version = match[i].replace(/Stage\s*/, 'Stage ');
          break;
        }
      }
      if (version && (version.match(/^ES20\d{2}$/) || version.match(/^Stage \d$/))) {
        featuresInAnnotations.add(pattern.name);
        break;
      }
    }
  }

  const missing = [];
  for (const featureName of featuresInAnnotations) {
    if (!featuresInFile.has(featureName) && reference.features[featureName]) {
      missing.push(featureName);
    }
  }

  return missing;
}

function compareWithReference(annotation, reference) {
  const feature = reference.features[annotation.feature];
  if (!feature) {
    return { match: 'unknown', message: `Feature "${annotation.feature}" not in reference` };
  }

  const refVersion = feature.status;
  const annVersion = annotation.version.trim();

  // Stage 4 annotations are acceptable for finalized Stage 4 features
  if (annVersion === 'Stage 4' && feature.stage === 4) {
    return { match: true };
  }

  const annNorm = annVersion.replace('Stage ', 'Stage').toUpperCase();
  const refNorm = refVersion.replace('Stage ', 'Stage').toUpperCase();

  if (annNorm === refNorm || annNorm.includes(refNorm)) {
    return { match: true };
  }

  if (annVersion.startsWith('Stage') && `Stage ${feature.stage}` === annVersion) {
    return { match: true };
  }

  return {
    match: false,
    message: `Annotation says "${annotation.version}" but reference says "${refVersion}"`
  };
}

function main() {
  // 处理帮助和版本
  if (OPTIONS.help) {
    showHelp();
    process.exit(0);
  }

  if (OPTIONS.version) {
    showVersion();
    process.exit(0);
  }

  if (OPTIONS.listFeatures) {
    const reference = loadReference();
    listFeatures(reference);
    return;
  }

  // 处理--template选项
  if (OPTIONS.template) {
    const reference = loadReference();
    generateTemplate(OPTIONS.template.name, reference, OPTIONS.template.file || null, OPTIONS.template.line || null);
    return;
  }

  log('cyan', '\n=== ES Version Annotation Verification ===\n');

  const reference = loadReference();
  log('cyan', `Reference source: ${reference.meta.source}`);

  const verifiedOk = checkLastVerified(reference);

  const dateIssues = validateStage4Dates(reference);
  if (dateIssues.length > 0) {
    log('yellow', '\n⚠️  stage4Date Format Issues:');
    for (const issue of dateIssues) {
      log('yellow', `   ${issue.name}: ${issue.issue} (current: "${issue.stage4Date}")`);
    }
  }

  const demoFiles = getAllCodeFiles(DEMO_DIR, OPTIONS.checkTS);
  log('cyan', `\nScanning ${demoFiles.length} ${OPTIONS.checkTS ? 'code (JS+TS) ' : 'JS'} files...`);

  const featurePatterns = buildFeaturePatterns(reference);
  const allAnnotations = [];
  const allBlocks = [];
  const conflicts = [];
  const allFeaturesWithBlocks = new Set();

  // 收集所有修复和文件内容
  const fixesByFile = {};
  const fileContents = {}; // 缓存文件内容避免重复读取
  let readErrors = 0;

  for (const file of demoFiles) {
    const result = safeReadFile(file);
    if (!result.success) {
      log('yellow', `⚠️  Cannot read ${path.relative(path.dirname(REFERENCE_FILE), file)}: ${result.error}`);
      readErrors++;
      continue;
    }
    const content = result.content;
    fileContents[file] = content; // 缓存内容

    const annotations = extractAnnotations(content, file, featurePatterns);
    allAnnotations.push(...annotations);

    const blocks = extractVerificationBlocks(content, file);
    allBlocks.push(...blocks);

    // Add all features with blocks to the global set
    blocks.forEach(block => allFeaturesWithBlocks.add(block.feature));

    for (const ann of annotations) {
      const comparison = compareWithReference(ann, reference);
      if (comparison.match === false) {
        conflicts.push({
          file: path.relative(path.dirname(REFERENCE_FILE), file),
          line: ann.line,
          feature: ann.feature,
          message: comparison.message
        });
      }
    }

    // 收集修复项但不立即应用
    if (OPTIONS.fix || OPTIONS.dryRun) {
      const fileFixes = [];
      for (const block of blocks) {
        // 修复source URL
        const sourceFix = fixSourceURL(block, reference);
        if (sourceFix) {
          fileFixes.push({ type: 'source', feature: block.feature, ...sourceFix });
        }
        // 修复lastVerified
        const lastVerifiedFix = syncLastVerified(block, reference.meta.lastVerified);
        if (lastVerifiedFix) {
          fileFixes.push({ type: 'lastVerified', feature: block.feature, ...lastVerifiedFix });
        }
      }
      if (fileFixes.length > 0) {
        fixesByFile[file] = fileFixes;
      }
    }
  }

  // ===== Annotations summary =====
  log('cyan', `\nAnnotations Found: ${allAnnotations.length}`);

  const byFeature = {};
  for (const ann of allAnnotations) {
    if (!byFeature[ann.feature]) byFeature[ann.feature] = [];
    byFeature[ann.feature].push(ann);
  }

  log('cyan', '\nFeature Annotation Summary:');
  for (const [feature, anns] of Object.entries(byFeature)) {
    const featureRef = reference.features[feature];
    const normalizeVersion = (v) => {
      if (v === 'Stage 4' && featureRef && featureRef.stage === 4 && featureRef.status.startsWith('ES')) {
        return featureRef.status;
      }
      return v;
    };
    const versions = [...new Set(anns.map(a => normalizeVersion(a.version)))];
    const status = versions.length === 1 ? '✓' : '⚠️';
    const color = versions.length === 1 ? 'green' : 'yellow';
    log(color, `  ${status} ${feature}: ${versions.join(', ')} (${anns.length} occurrences)`);
  }

  // ===== NEW: Verification block checks =====
  log('cyan', `\n=== Verification Block Checks ===`);
  log('cyan', `Verification blocks found: ${allBlocks.length}`);
  log('cyan', `Features with verification blocks: ${allFeaturesWithBlocks.size}`);

  // Check 1: stage4Date consistency in blocks vs reference
  const blockDateIssues = checkBlockStage4Dates(allBlocks, reference);
  if (blockDateIssues.length > 0) {
    log('red', `\n❌ Verification block stage4Date mismatches (${blockDateIssues.length}):`);
    for (const issue of blockDateIssues) {
      log('red', `  ${issue.file}:${issue.line} — "${issue.feature}"`);
      log('red', `    Found: ${issue.found}, Expected: ${issue.expected}`);
    }
  } else {
    log('green', '✅ All verification block stage4Dates match reference');
  }

  // Check 2: Cross-file duplicate verification blocks
  const duplicates = detectDuplicateBlocks(allBlocks);
  if (duplicates.length > 0) {
    log('yellow', `\n⚠️  Cross-file duplicate verification blocks (${duplicates.length}):`);
    for (const dup of duplicates) {
      log('yellow', `  ${dup.feature}:`);
      for (const loc of dup.locations) {
        log('yellow', `    - ${loc}`);
      }
    }
  } else {
    log('green', '✅ No cross-file duplicate verification blocks');
  }

  // Check 3: lastVerified consistency
  const lastVerifiedIssues = checkLastVerifiedConsistency(allBlocks, reference);
  if (lastVerifiedIssues.length > 0) {
    for (const issue of lastVerifiedIssues) {
      if (issue.type === 'mixed_dates') {
        log('yellow', `\n⚠️  Mixed lastVerified dates in ${issue.file}: ${issue.dates.join(', ')}`);
      } else if (issue.type === 'inconsistent_across_files') {
        log('yellow', `\n⚠️  Inconsistent lastVerified dates across files:`);
        log('yellow', `    Demo files use: ${issue.dates.join(', ')}`);
        log('yellow', `    Reference uses: ${issue.referenceDate}`);
      } else if (issue.type === 'demo_reference_mismatch') {
        log('yellow', `\n⚠️  lastVerified mismatch: demo files use ${issue.demoDate}, reference uses ${issue.referenceDate}`);
      }
    }
  } else {
    log('green', '✅ All lastVerified dates consistent');
  }

  // 自动修复报告
  if ((OPTIONS.fix || OPTIONS.dryRun) && Object.keys(fixesByFile).length > 0) {
    log('cyan', '\n=== Auto-Fix Mode ===');
    if (OPTIONS.dryRun) {
      log('yellow', `DRY RUN MODE - Showing changes that would be applied`);
    }
    log('yellow', `Found issues in ${Object.keys(fixesByFile).length} files`);
    let fixedCount = 0;
    let changesCount = 0;

    for (const [file, fixes] of Object.entries(fixesByFile)) {
      log('cyan', `\nProcessing ${path.relative(path.dirname(REFERENCE_FILE), file)}:`);
      const { modified, content, changes } = applyFixes(file, fixes, fileContents[file]);
      if (modified) {
        fixedCount++;
        changesCount += changes.length;
        // 只有非dry-run模式才写入文件
        if (!OPTIONS.dryRun) {
          const writeResult = safeWriteFile(file, content, OPTIONS.backup);
          if (!writeResult.success) {
            log('red', `  ❌ Failed to write ${file}: ${writeResult.error}`);
          }
        }
      }
    }

    if (fixedCount > 0) {
      if (OPTIONS.dryRun) {
        log('green', `✅ Would modify ${fixedCount} files with ${changesCount} changes`);
      } else {
        log('green', `✅ Fixed ${fixedCount} files with ${changesCount} changes`);
      }
    } else {
      log('green', '\n✅ No auto-fixable issues found');
    }
  } else if (OPTIONS.fix || OPTIONS.dryRun) {
    log('green', '\n✅ No auto-fixable issues found');
  }

  // Check 4: Missing verification blocks (global check)
  log('cyan', '\n=== Missing Verification Block Report ===');
  let missingCount = 0;
  const allReferencedFeatures = new Set();

  // First collect all referenced features across all files
  for (const file of demoFiles) {
    if (!fileContents[file]) continue; // 跳过之前读取失败的文件
    const content = fileContents[file];
    for (const pattern of featurePatterns) {
      const matches = content.matchAll(pattern.regex);
      for (const match of matches) {
        let version = null;
        for (let i = 1; i < match.length; i++) {
          if (match[i]) {
            version = match[i].replace(/Stage\s*/, 'Stage ');
            break;
          }
        }
        if (version && (version.match(/^ES20\d{2}$/) || version.match(/^Stage \d$/))) {
          allReferencedFeatures.add(pattern.name);
          break;
        }
      }
    }
  }

  // Now check which referenced features have no blocks anywhere
  const missingFeatures = [];
  for (const featureName of allReferencedFeatures) {
    if (!allFeaturesWithBlocks.has(featureName) && reference.features[featureName]) {
      missingFeatures.push(featureName);
    }
  }

  if (missingFeatures.length > 0) {
    log('yellow', `  Missing verification blocks for: ${missingFeatures.join(', ')}`);
    missingCount = missingFeatures.length;
  }
  if (missingCount === 0) {
    log('green', '✅ No missing verification blocks detected');
  } else {
    log('yellow', `\n  Total missing verification blocks: ${missingCount}`);
  }

  // ===== Conflicts =====
  if (conflicts.length > 0) {
    log('red', '\n❌ Annotation Version Conflicts:');
    for (const conflict of conflicts) {
      log('red', `  ${conflict.file}:${conflict.line}`);
      log('red', `    ${conflict.feature}: ${conflict.message}`);
    }
    process.exit(1);
  }

  log('green', '\n✅ All ES version annotations consistent with reference');

  if (!verifiedOk) {
    log('yellow', '\n⚠️  Please update reference/es-versions.json:');
    log('yellow', '   1. Check TC39 finished-proposals.md');
    log('yellow', '   2. Update lastVerified date');
    log('yellow', '   3. Run this script again');
  }

  // Exit with error if verification block issues found (but don't fail on warnings)
  if (blockDateIssues.length > 0) {
    log('red', '\n❌ Verification block stage4Date errors must be fixed');
    process.exit(1);
  }
}

main();
