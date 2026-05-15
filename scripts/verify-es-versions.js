#!/usr/bin/env node
/**
 * ES版本标注验证脚本
 * 用法: node scripts/verify-es-versions.js
 *
 * 检查:
 * 1. reference/es-versions.json 的 lastVerified 是否过期（超过90天）
 * 2. demo文件中的ES版本标注是否与参考文件一致
 * 3. 同一feature在不同文件中标注是否一致
 * 4. verification block 的存在性和一致性
 */

const fs = require('fs');
const path = require('path');

const REFERENCE_FILE = path.join(__dirname, '../reference/es-versions.json');
const DEMO_DIR = path.join(__dirname, '../demo');
const DOCS_DIR = path.join(__dirname, '../docs');
const MAX_VERIFIED_DAYS = 90;

// ANSI colors
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

// Load reference data
function loadReference() {
  if (!fs.existsSync(REFERENCE_FILE)) {
    log('red', `❌ Reference file not found: ${REFERENCE_FILE}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(REFERENCE_FILE, 'utf8'));
}

// Check if lastVerified is expired
function checkLastVerified(reference) {
  const lastVerified = new Date(reference.meta.lastVerified);
  const daysSince = Math.floor((Date.now() - lastVerified.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSince > MAX_VERIFIED_DAYS) {
    log('yellow', `⚠️  reference/es-versions.json lastVerified is ${daysSince} days ago (>${MAX_VERIFIED_DAYS} days)`);
    log('yellow', `   Please verify against TC39 official data and update lastVerified`);
    return false;
  }

  log('green', `✅ lastVerified: ${reference.meta.lastVerified} (${daysSince} days ago)`);
  return true;
}

// Recursively get all JS files
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

// Extract ES version annotations from file content
function extractAnnotations(content, filePath, reference) {
  const annotations = [];

  // Short feature names that need precise matching (avoid false positives)
  // at:  avoid matching codePointAt, charCodeAt, startsAt, endsAt, etc.
  // with: avoid matching startsWith, endsWith, etc.
  const shortFeatures = ['at', 'with'];

  // Dynamically generate feature patterns from reference.json
  // This ensures coverage of all 30+ features defined in reference
  const featurePatterns = Object.keys(reference.features).map(featureName => {
    // Escape special regex characters and allow for spacing variations
    const escapedName = featureName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+');

    // For short feature names, require method context with word boundary
    // to avoid matching unrelated methods like startsWith, codePointAt
    if (shortFeatures.includes(featureName)) {
      return {
        name: featureName,
        regex: new RegExp(`\\b\\.${escapedName}\\([^\n]*?\\b(ES20\\d{2}|Stage\\s*[0-4])\\b|Array\\.${escapedName}[^\n]*?\\b(ES20\\d{2}|Stage\\s*[0-4])\\b`, 'gi')
      };
    }

    return {
      name: featureName,
      regex: new RegExp(`${escapedName}[^\n]*?\\b(ES20\\d{2}|Stage\\s*[0-4])\\b`, 'gi')
    };
  });

  // Add alias patterns for common variations
  featurePatterns.push(
    { name: 'Temporal', regex: /Temporal(?:\s+API)?[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi },
    { name: 'using (Explicit Resource Management)', regex: /(?:using declaration|Explicit Resource Management)[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi }
  );

  for (const pattern of featurePatterns) {
    const matches = content.matchAll(pattern.regex);
    for (const match of matches) {
      // Find the first non-empty capture group (for patterns with multiple groups)
      let version = null;
      for (let i = 1; i < match.length; i++) {
        if (match[i]) {
          version = match[i].replace(/Stage\s*/, 'Stage ');
          break;
        }
      }
      if (!version) continue;

      // Filter out false positives from filenames (lowercase es2022, etc.)
      if (!version.match(/^es\d{4}$/i) || version.toUpperCase() !== version) {
        continue;
      }
      annotations.push({
        feature: pattern.name,
        version: version,
        line: content.substring(0, match.index).split('\n').length,
        file: path.relative(path.dirname(REFERENCE_FILE), filePath)
      });
    }
  }

  return annotations;
}

// Check verification blocks
function checkVerificationBlocks(content, filePath) {
  const hasVerificationBlock = content.includes('ES Version Reference:') ||
                               content.includes('ES Version Verification:');

  if (hasVerificationBlock) {
    // Extract lastVerified date from block or reference file
    const lastVerifiedMatch = content.match(/Last Verified:\s*(\d{4}-\d{2}-\d{2})/);
    if (lastVerifiedMatch) {
      return { hasBlock: true, lastVerified: lastVerifiedMatch[1] };
    }
    return { hasBlock: true, lastVerified: null };
  }

  return { hasBlock: false, lastVerified: null };
}

// Compare annotation with reference
function compareWithReference(annotation, reference) {
  const feature = reference.features[annotation.feature];

  if (!feature) {
    return { match: 'unknown', message: `Feature "${annotation.feature}" not in reference` };
  }

  const refVersion = feature.status;
  const refStage = feature.stage;
  const annVersion = annotation.version.trim();

  // Stage 4 annotations are acceptable for finalized features (they provide context)
  if (annVersion === 'Stage 4' && refStage === 4) {
    return { match: true };
  }

  // Normalize for comparison
  const annNorm = annVersion.replace('Stage ', 'Stage').toUpperCase();
  const refNorm = refVersion.replace('Stage ', 'Stage').toUpperCase();

  // Check if annotation matches reference version or stage
  if (annNorm === refNorm ||
      annNorm.includes(refNorm) ||
      (annVersion.startsWith('Stage') && `Stage ${refStage}` === annVersion)) {
    return { match: true };
  }

  // Stage 3 features: annotation saying "Stage 3" matches reference saying "Stage 3"
  if (refVersion === 'Stage 3' && annVersion === 'Stage 3') {
    return { match: true };
  }

  return {
    match: false,
    message: `Annotation says "${annotation.version}" but reference says "${refVersion}"`
  };
}

// Main verification
function main() {
  log('cyan', '\n=== ES Version Annotation Verification ===\n');

  // Load reference
  const reference = loadReference();
  log('cyan', `Reference source: ${reference.meta.source}`);

  // Check lastVerified
  const verifiedOk = checkLastVerified(reference);

  // Get all demo files
  const demoFiles = getAllJsFiles(DEMO_DIR);
  log('cyan', `\nScanning ${demoFiles.length} demo files...`);

  const allAnnotations = [];
  const verificationBlocks = [];
  const conflicts = [];

  for (const file of demoFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const relPath = path.relative(path.dirname(REFERENCE_FILE), file);

    // Extract annotations
    const annotations = extractAnnotations(content, file, reference);
    allAnnotations.push(...annotations);

    // Check verification blocks
    const blockInfo = checkVerificationBlocks(content, file);
    if (blockInfo.hasBlock) {
      verificationBlocks.push({ file: relPath, lastVerified: blockInfo.lastVerified });
    }

    // Compare with reference
    for (const ann of annotations) {
      const comparison = compareWithReference(ann, reference);
      if (comparison.match === false) {
        conflicts.push({
          file: relPath,
          line: ann.line,
          feature: ann.feature,
          message: comparison.message
        });
      }
    }
  }

  // Report verification blocks
  log('cyan', '\nVerification Blocks Found:');
  if (verificationBlocks.length === 0) {
    log('yellow', '  ⚠️  No verification blocks found in demo files');
  } else {
    for (const block of verificationBlocks) {
      const status = block.lastVerified ? `lastVerified: ${block.lastVerified}` : 'no lastVerified date';
      log('green', `  ✓ ${block.file} (${status})`);
    }
  }

  // Report annotations summary
  log('cyan', `\nAnnotations Found: ${allAnnotations.length}`);

  // Group by feature
  const byFeature = {};
  for (const ann of allAnnotations) {
    if (!byFeature[ann.feature]) byFeature[ann.feature] = [];
    byFeature[ann.feature].push(ann);
  }

  log('cyan', '\nFeature Annotation Summary:');
  for (const [feature, anns] of Object.entries(byFeature)) {
    const versions = [...new Set(anns.map(a => a.version))];
    const versionStr = versions.join(', ');
    const status = versions.length === 1 ? '✓' : '⚠️';
    const color = versions.length === 1 ? 'green' : 'yellow';
    log(color, `  ${status} ${feature}: ${versionStr} (${anns.length} occurrences)`);
  }

  // Report conflicts
  if (conflicts.length > 0) {
    log('red', '\n❌ Conflicts Found:');
    for (const conflict of conflicts) {
      log('red', `  ${conflict.file}:${conflict.line}`);
      log('red', `    ${conflict.feature}: ${conflict.message}`);
    }
    process.exit(1);
  }

  // Final status
  log('green', '\n✅ All ES version annotations consistent with reference');

  if (!verifiedOk) {
    log('yellow', '\n⚠️  Please update reference/es-versions.json:');
    log('yellow', '   1. Check TC39 finished-proposals.md');
    log('yellow', '   2. Update lastVerified date');
    log('yellow', '   3. Run this script again');
  }
}

main();