#!/usr/bin/env node
// Add export {} to files that need it
const fs = require('fs');
const path = require('path');

const demoDir = path.join(__dirname, '..', 'demo');
let count = 0;

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.js')) {
      addExportIfNeeded(fullPath);
    }
  }
}

function addExportIfNeeded(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Check if already has export {}
  const hasExport = lines.some(line => line.trim() === 'export {};' || line.trim() === 'export {}');
  if (hasExport) {
    return;
  }

  // Find the third line (after header and TS ref)
  let insertAt = 2;

  // Find first empty line after header
  while (insertAt < lines.length && lines[insertAt].trim() !== '') {
    insertAt++;
  }

  // Insert export {} after the first two lines (header and TS ref)
  const newLines = [...lines.slice(0, insertAt), 'export {};', ...lines.slice(insertAt)];
  const newContent = newLines.join('\n');

  fs.writeFileSync(filePath, newContent, 'utf-8');
  count++;
  console.log(`✅ Added export {} to ${path.basename(filePath)}`);
}

console.log('=== Adding export {} to demo files ===\n');
walkDir(demoDir);
console.log(`\nTotal files updated: ${count}`);
