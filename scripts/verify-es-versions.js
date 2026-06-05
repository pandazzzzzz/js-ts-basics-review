#!/usr/bin/env node
/**
 * ES版本标注验证脚本
 * 用法: node scripts/verify-es-versions.js
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

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function loadReference() {
  if (!fs.existsSync(REFERENCE_FILE)) {
    log('red', `❌ Reference file not found: ${REFERENCE_FILE}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REFERENCE_FILE, 'utf8'));
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

function getAllJsFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllJsFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }

  return files;
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

// Extract verification blocks from file content
// Format: /* verification: ... feature: <name> ... stage4Date: <date> ... lastVerified: <date> */
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

    if (featureMatch) {
      blocks.push({
        feature: featureMatch[1].trim(),
        status: statusMatch ? statusMatch[1].trim() : null,
        stage4Date: stage4DateMatch ? stage4DateMatch[1].trim() : null,
        lastVerified: lastVerifiedMatch ? lastVerifiedMatch[1].trim() : null,
        line: content.substring(0, match.index).split('\n').length,
        file: relPath
      });
    }
  }
  return blocks;
}

// Check 1: Verify stage4Date in verification blocks against reference
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

// Check 2: Cross-file duplicate verification blocks
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

// Check 3: lastVerified consistency
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

// Check 4: Files referencing ES20xx but missing verification blocks
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

  const demoFiles = getAllJsFiles(DEMO_DIR);
  log('cyan', `\nScanning ${demoFiles.length} demo files...`);

  const featurePatterns = buildFeaturePatterns(reference);
  const allAnnotations = [];
  const allBlocks = [];
  const conflicts = [];
  const allFeaturesWithBlocks = new Set(); // Track all features that have blocks anywhere

  for (const file of demoFiles) {
    const content = fs.readFileSync(file, 'utf8');
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

  // Check 4: Missing verification blocks (global check)
  log('cyan', '\n=== Missing Verification Block Report ===');
  let missingCount = 0;
  const allReferencedFeatures = new Set();

  // First collect all referenced features across all files
  for (const file of demoFiles) {
    const content = fs.readFileSync(file, 'utf8');
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
