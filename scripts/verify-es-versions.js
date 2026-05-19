#!/usr/bin/env node
/**
 * ES版本标注验证脚本
 * 用法: node scripts/verify-es-versions.js
 *
 * 检查:
 * 1. reference/es-versions.json 的 lastVerified 是否过期（超过90天）
 * 2. demo文件中的ES版本标注是否与参考文件一致
 * 3. 同一feature在不同文件中标注是否一致
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

  const demoFiles = getAllJsFiles(DEMO_DIR);
  log('cyan', `\nScanning ${demoFiles.length} demo files...`);

  const featurePatterns = buildFeaturePatterns(reference);
  const allAnnotations = [];
  const conflicts = [];

  for (const file of demoFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const annotations = extractAnnotations(content, file, featurePatterns);
    allAnnotations.push(...annotations);

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

  // Annotations summary
  log('cyan', `\nAnnotations Found: ${allAnnotations.length}`);

  const byFeature = {};
  for (const ann of allAnnotations) {
    if (!byFeature[ann.feature]) byFeature[ann.feature] = [];
    byFeature[ann.feature].push(ann);
  }

  log('cyan', '\nFeature Annotation Summary:');
  for (const [feature, anns] of Object.entries(byFeature)) {
    const featureRef = reference.features[feature];
    // Normalize "Stage 4" -> ES version for features with a standard ES version
    const normalizeVersion = (v) => {
      if (v === 'Stage 4' && featureRef && featureRef.stage === 4 && featureRef.status.startsWith('ES')) {
        return featureRef.status;
      }
      return v;
    };
    const versions = [...new Set(anns.map(a => normalizeVersion(a.version)))];
    const versionStr = versions.join(', ');
    const status = versions.length === 1 ? '✓' : '⚠️';
    const color = versions.length === 1 ? 'green' : 'yellow';
    log(color, `  ${status} ${feature}: ${versionStr} (${anns.length} occurrences)`);
  }

  // Conflicts
  if (conflicts.length > 0) {
    log('red', '\n❌ Conflicts Found:');
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
}

main();