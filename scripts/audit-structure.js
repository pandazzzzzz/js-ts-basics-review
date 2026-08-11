#!/usr/bin/env node
// Structure standardization audit for demo JS files
// Checks for: header format, export {}, TOC, pitfalls, best practices, cross-refs, TS comparison

const fs = require('fs');
const path = require('path');

const demoDir = path.join(__dirname, '..', 'demo');
const results = [];

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      results.push(analyzeFile(fullPath, entry.name));
    }
  }
}

function analyzeFile(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Count lines
  const lineCount = lines.length;

  // Check header (first 5 lines)
  const firstLines = lines.slice(0, 5).join('\n');
  const hasTitleLine = /^\/\/ .+ Demo/.test(lines[0] || '');
  const hasTsRefLine = lines[1]?.includes('For TypeScript comparison') || false;
  const hasMdnRef = lines.some(l => l.includes('📘 MDN:') || l.includes('📘 TC39:'));

  // Check export {}
  const hasExport = lines.some(l => l.trim() === 'export {};' || l.trim() === 'export {}');

  // Check Learning goals
  const hasLearningGoals = content.includes('Learning goals');

  // Check TOC
  const hasToc = content.includes('Table of Contents');

  // Check Common Pitfalls
  const hasPitfalls = content.includes('Common Pitfalls');

  // Check Best Practices
  const hasBestPractices = content.includes('Best Practices');

  // Check Cross-references
  const hasCrossRefs = content.includes('Cross-references') || content.includes('Cross References');

  // Check TypeScript Comparison at end
  const hasTsAtEnd = content.includes('TypeScript Comparison');
  const hasStandardTsRef = content.includes('📘 See TypeScript comparison file:');

  return {
    fileName,
    lineCount,
    hasTitleLine,
    hasTsRefLine,
    hasMdnRef,
    hasExport,
    hasLearningGoals,
    hasToc,
    hasPitfalls,
    hasBestPractices,
    hasCrossRefs,
    hasTsAtEnd,
    hasStandardTsRef
  };
}

walkDir(demoDir);

// Sort by line count descending
results.sort((a, b) => b.lineCount - a.lineCount);

// Print summary
console.log('=== Structure Standardization Audit ===\n');
console.log(`Total files: ${results.length}\n`);

// Check counts
const counts = {
  hasExport: results.filter(r => r.hasExport).length,
  hasLearningGoals: results.filter(r => r.hasLearningGoals).length,
  hasToc: results.filter(r => r.hasToc).length,
  hasPitfalls: results.filter(r => r.hasPitfalls).length,
  hasBestPractices: results.filter(r => r.hasBestPractices).length,
  hasCrossRefs: results.filter(r => r.hasCrossRefs).length,
  hasTsAtEnd: results.filter(r => r.hasTsAtEnd).length,
  hasStandardTsRef: results.filter(r => r.hasStandardTsRef).length,
};

console.log('Feature coverage:');
console.log(`  export {}:           ${counts.hasExport}/${results.length}`);
console.log(`  Learning goals:      ${counts.hasLearningGoals}/${results.length}`);
console.log(`  Table of Contents:   ${counts.hasToc}/${results.length}`);
console.log(`  Common Pitfalls:     ${counts.hasPitfalls}/${results.length}`);
console.log(`  Best Practices:      ${counts.hasBestPractices}/${results.length}`);
console.log(`  Cross-references:    ${counts.hasCrossRefs}/${results.length}`);
console.log(`  TS Comparison:       ${counts.hasTsAtEnd}/${results.length}`);
console.log(`  Standard TS ref:     ${counts.hasStandardTsRef}/${results.length}`);

// Print files missing each feature
console.log('\n=== Files Missing Features ===\n');

const missingFeatures = [
  ['export {}', r => !r.hasExport],
  ['TOC', r => !r.hasToc],
  ['Cross-references', r => !r.hasCrossRefs],
  ['Standard TS ref', r => !r.hasStandardTsRef],
];

for (const [feature, predicate] of missingFeatures) {
  const missing = results.filter(predicate);
  if (missing.length > 0) {
    console.log(`\nMissing "${feature}" (${missing.length} files):`);
    missing.forEach(r => console.log(`  ${r.fileName} (${r.lineCount} lines)`));
  }
}

// Files with ALL features
const perfect = results.filter(r =>
  r.hasExport && r.hasLearningGoals && r.hasToc &&
  r.hasPitfalls && r.hasBestPractices && r.hasCrossRefs &&
  r.hasStandardTsRef
);
console.log(`\n\n✅ Files with ALL standard features: ${perfect.length}/${results.length}`);
perfect.forEach(r => console.log(`  ${r.fileName}`));
