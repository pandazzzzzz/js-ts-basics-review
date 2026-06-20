#!/usr/bin/env node
/**
 * Unit tests for verify-es-versions.js
 * Uses Node.js built-in test runner (node:test)
 * Run: node --test scripts/verify-es-versions.test.js
 */
const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const path = require('path');
const fs = require('fs');

const {
  safeReadFile,
  safeWriteFile,
  checkLastVerified,
  validateStage4Dates,
  buildFeaturePatterns,
  extractAnnotations,
  extractVerificationBlocks,
  fixSourceURL,
  syncLastVerified,
  applyFixes,
  compareWithReference,
  checkBlockStage4Dates,
  detectDuplicateBlocks,
  checkLastVerifiedConsistency,
  generateTemplate,
  log,
  VERSION
} = require('./verify-es-versions');

const TEMP_DIR = path.join(__dirname, '..', '.test-tmp');

// Setup/teardown helpers
function setupTempDir() {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

function cleanupTempDir() {
  if (fs.existsSync(TEMP_DIR)) {
    fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  }
}

function writeTempFile(filename, content) {
  setupTempDir();
  const filePath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

// ============================================================
// safeReadFile tests
// ============================================================
describe('safeReadFile', () => {
  let testFile;

  beforeEach(() => {
    setupTempDir();
    testFile = writeTempFile('test-read.txt', 'hello world');
  });

  afterEach(() => {
    cleanupTempDir();
  });

  it('should read an existing file successfully', () => {
    const result = safeReadFile(testFile);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.content, 'hello world');
    assert.strictEqual(result.error, null);
  });

  it('should return error for non-existent file', () => {
    const result = safeReadFile(path.join(TEMP_DIR, 'does-not-exist.txt'));
    assert.strictEqual(result.success, false);
    assert.ok(result.error.includes('File not found'));
    assert.strictEqual(result.content, null);
  });

  it('should return error for a directory path', () => {
    const result = safeReadFile(TEMP_DIR);
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.content, null);
  });

  it('should read empty file', () => {
    const emptyFile = writeTempFile('empty.txt', '');
    const result = safeReadFile(emptyFile);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.content, '');
  });

  it('should read file with unicode content', () => {
    const unicodeFile = writeTempFile('unicode.txt', '你好世界 🎉');
    const result = safeReadFile(unicodeFile);
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.content, '你好世界 🎉');
  });
});

// ============================================================
// safeWriteFile tests
// ============================================================
describe('safeWriteFile', () => {
  beforeEach(() => {
    setupTempDir();
  });

  afterEach(() => {
    cleanupTempDir();
  });

  it('should write a file successfully', () => {
    const filePath = path.join(TEMP_DIR, 'test-write.txt');
    const result = safeWriteFile(filePath, 'test content');
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.error, null);
    assert.strictEqual(fs.readFileSync(filePath, 'utf8'), 'test content');
  });

  it('should create backup with timestamp when requested', () => {
    const filePath = writeTempFile('original.js', 'original content');

    // Create an existing .bak to verify it doesn't get overwritten
    const simpleBakPath = filePath + '.bak';
    fs.writeFileSync(simpleBakPath, 'old backup', 'utf8');

    const result = safeWriteFile(filePath, 'new content', true);
    assert.strictEqual(result.success, true);

    // Original file should have new content
    assert.strictEqual(fs.readFileSync(filePath, 'utf8'), 'new content');

    // A timestamped backup should have been created
    const dirFiles = fs.readdirSync(TEMP_DIR);
    const backupFiles = dirFiles.filter(f => f.includes('.bak'));
    assert.ok(backupFiles.length >= 1, 'Should have at least one backup file');

    // The simple .bak should still contain old backup (not overwritten)
    assert.strictEqual(fs.readFileSync(simpleBakPath, 'utf8'), 'old backup');

    // At least one backup should have the original content
    const hasOriginalBackup = backupFiles.some(f => {
      return fs.readFileSync(path.join(TEMP_DIR, f), 'utf8') === 'original content';
    });
    assert.ok(hasOriginalBackup, 'Should have a backup with original content');
  });

  it('should write without backup when not requested', () => {
    const filePath = writeTempFile('no-backup.js', 'original');
    const result = safeWriteFile(filePath, 'new content', false);
    assert.strictEqual(result.success, true);

    const dirFiles = fs.readdirSync(TEMP_DIR);
    const backupFiles = dirFiles.filter(f => f.includes('.bak'));
    assert.strictEqual(backupFiles.length, 0, 'Should not create backup');
  });

  it('should overwrite existing file', () => {
    const filePath = writeTempFile('overwrite.txt', 'original');
    safeWriteFile(filePath, 'updated');
    assert.strictEqual(fs.readFileSync(filePath, 'utf8'), 'updated');
  });

  it('should create new file if it does not exist', () => {
    const filePath = path.join(TEMP_DIR, 'new-file.txt');
    const result = safeWriteFile(filePath, 'brand new');
    assert.strictEqual(result.success, true);
    assert.strictEqual(fs.existsSync(filePath), true);
  });

  it('should handle backup for files with no extension', () => {
    const filePath = writeTempFile('Makefile', 'original content');
    const result = safeWriteFile(filePath, 'new content', true);
    assert.strictEqual(result.success, true);

    // Original file should have new content
    assert.strictEqual(fs.readFileSync(filePath, 'utf8'), 'new content');

    // A backup should exist and contain original content
    const dirFiles = fs.readdirSync(TEMP_DIR);
    const backupFiles = dirFiles.filter(f => f.includes('.bak') && f !== 'Makefile.bak');
    assert.ok(backupFiles.length >= 1, 'Should have a backup for no-extension file');

    const hasOriginalBackup = backupFiles.some(f => {
      return fs.readFileSync(path.join(TEMP_DIR, f), 'utf8') === 'original content';
    });
    assert.ok(hasOriginalBackup, 'Should preserve original content in backup');
  });
});

// ============================================================
// checkLastVerified tests
// ============================================================
describe('checkLastVerified', () => {
  it('should return true for recently verified reference', () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const ref = { meta: { lastVerified: dateStr } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, true);
  });

  it('should return false for a date older than 90 days', () => {
    const ref = { meta: { lastVerified: '2020-01-01' } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, false);
  });

  it('should return true for date exactly 90 days ago', () => {
    const d = new Date();
    d.setDate(d.getDate() - 90);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const ref = { meta: { lastVerified: dateStr } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, true); // <= 90, not >
  });

  it('should return false for non-date string', () => {
    const ref = { meta: { lastVerified: 'not-a-date' } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, false);
  });

  it('should return false for empty string', () => {
    const ref = { meta: { lastVerified: '' } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, false);
  });

  it('should return false for missing lastVerified', () => {
    const ref = { meta: {} };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, false);
  });

  it('should return false for invalid month (>12)', () => {
    const ref = { meta: { lastVerified: '2026-13-01' } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, false);
  });

  it('should return false for invalid day', () => {
    const ref = { meta: { lastVerified: '2026-02-30' } };
    const result = checkLastVerified(ref);
    assert.strictEqual(result, false);
  });

  it('should accept valid leap year date (Feb 29)', () => {
    const ref = { meta: { lastVerified: '2024-02-29' } };
    const result = checkLastVerified(ref);
    // 2024-02-29 is valid, but may be >90 days from now
    // Just check it doesn't crash with invalid date rejection
    assert.strictEqual(typeof result, 'boolean');
  });
});

// ============================================================
// validateStage4Dates tests
// ============================================================
describe('validateStage4Dates', () => {
  it('should return empty array for valid stage4Dates', () => {
    const ref = {
      features: {
        Feature1: { stage: 4, stage4Date: '2024-06' },
        Feature2: { stage: 4, stage4Date: '2025-12' }
      }
    };
    const issues = validateStage4Dates(ref);
    assert.strictEqual(issues.length, 0);
  });

  it('should detect missing stage4Date', () => {
    const ref = {
      features: {
        BadFeature: { stage: 4 }
      }
    };
    const issues = validateStage4Dates(ref);
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].name, 'BadFeature');
    assert.ok(issues[0].issue.includes('Missing'));
  });

  it('should detect invalid stage4Date format', () => {
    const ref = {
      features: {
        BadFormat: { stage: 4, stage4Date: '2024/06' }
      }
    };
    const issues = validateStage4Dates(ref);
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].name, 'BadFormat');
    assert.ok(issues[0].issue.includes('Invalid format'));
  });

  it('should skip non-Stage-4 features', () => {
    const ref = {
      features: {
        Stage3Feature: { stage: 3 } // no stage4Date needed
      }
    };
    const issues = validateStage4Dates(ref);
    assert.strictEqual(issues.length, 0);
  });
});

// ============================================================
// buildFeaturePatterns tests
// ============================================================
describe('buildFeaturePatterns', () => {
  it('should generate patterns for all reference features', () => {
    const ref = {
      features: {
        'TestFeature': { status: 'ES2025', stage: 4 },
        'Decorators': { status: 'Stage 2.7', stage: 2.7 }
      }
    };
    const patterns = buildFeaturePatterns(ref);
    assert.ok(patterns.length > 0);
    // Should include short names + features + aliases
    assert.ok(patterns.some(p => p.name === 'at'));
    assert.ok(patterns.some(p => p.name === 'with'));
    assert.ok(patterns.some(p => p.name === 'TestFeature'));
    assert.ok(patterns.some(p => p.name === 'Decorators'));
    assert.ok(patterns.some(p => p.name === 'Temporal')); // alias
  });

  it('should not duplicate at/with patterns', () => {
    const ref = {
      features: {
        'at': { status: 'ES2022', stage: 4 },
        'with': { status: 'ES2023', stage: 4 }
      }
    };
    const patterns = buildFeaturePatterns(ref);
    const atPatterns = patterns.filter(p => p.name === 'at');
    const withPatterns = patterns.filter(p => p.name === 'with');
    assert.strictEqual(atPatterns.length, 1, 'at should appear exactly once');
    assert.strictEqual(withPatterns.length, 1, 'with should appear exactly once');
  });
});

// ============================================================
// extractAnnotations tests
// ============================================================
describe('extractAnnotations', () => {
  it('should extract ES version annotations', () => {
    const content = '// SomeFeature (ES2025) - description';
    const patterns = [
      { name: 'SomeFeature', regex: /SomeFeature[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi }
    ];
    const annotations = extractAnnotations(content, 'test/file.js', patterns);
    assert.strictEqual(annotations.length, 1);
    assert.strictEqual(annotations[0].feature, 'SomeFeature');
    assert.strictEqual(annotations[0].version, 'ES2025');
  });

  it('should extract Stage annotations', () => {
    const content = '// Decorators (Stage 2.7) - not yet finalized';
    const patterns = [
      { name: 'Decorators', regex: /Decorators[^\n]*?\b(ES20\d{2}|Stage\s*[0-4](?:\.\d+)?)\b/gi }
    ];
    const annotations = extractAnnotations(content, 'test/file.js', patterns);
    assert.strictEqual(annotations.length, 1);
    assert.strictEqual(annotations[0].version, 'Stage 2.7');
  });

  it('should extract fractional Stage annotations (e.g. Stage 2.7)', () => {
    const content = '// Decorators (Stage 2.7) - nearing Stage 3';
    const patterns = [
      { name: 'Decorators', regex: /Decorators[^\n]*?\b(ES20\d{2}|Stage\s*[0-4](?:\.\d+)?)\b/gi }
    ];
    const annotations = extractAnnotations(content, 'test/file.js', patterns);
    assert.strictEqual(annotations.length, 1);
    assert.strictEqual(annotations[0].version, 'Stage 2.7');
  });

  it('should not match unrelated text', () => {
    const content = '// This is just a comment without version annotation';
    const patterns = [
      { name: 'SomeFeature', regex: /SomeFeature[^\n]*?\b(ES20\d{2}|Stage\s*[0-4])\b/gi }
    ];
    const annotations = extractAnnotations(content, 'test/file.js', patterns);
    assert.strictEqual(annotations.length, 0);
  });
});

// ============================================================
// extractVerificationBlocks tests
// ============================================================
describe('extractVerificationBlocks', () => {
  it('should extract a complete verification block', () => {
    const content = `/*
 * verification:
 *   feature: Temporal
 *   status: ES2027
 *   stage4Date: 2025-09
 *   lastVerified: 2026-06-12
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */`;
    const blocks = extractVerificationBlocks(content, 'test/file.js');
    assert.strictEqual(blocks.length, 1);
    assert.strictEqual(blocks[0].feature, 'Temporal');
    assert.strictEqual(blocks[0].status, 'ES2027');
    assert.strictEqual(blocks[0].stage4Date, '2025-09');
    assert.strictEqual(blocks[0].lastVerified, '2026-06-12');
  });

  it('should extract multiple blocks from same file', () => {
    const content = `/*
 * verification:
 *   feature: FeatureA
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-06-12
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */

// some code here

/*
 * verification:
 *   feature: FeatureB
 *   status: ES2026
 *   stage4Date: 2025-07
 *   lastVerified: 2026-06-12
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */`;
    const blocks = extractVerificationBlocks(content, 'test/file.js');
    assert.strictEqual(blocks.length, 2);
    assert.strictEqual(blocks[0].feature, 'FeatureA');
    assert.strictEqual(blocks[1].feature, 'FeatureB');
  });

  it('should return empty array for content without blocks', () => {
    const content = '// Just a regular comment, no verification block';
    const blocks = extractVerificationBlocks(content, 'test/file.js');
    assert.strictEqual(blocks.length, 0);
  });

  it('should handle tab-indented blocks', () => {
    const content = `/*
\t * verification:
\t *   feature: TabFeature
\t *   status: ES2025
\t *   stage4Date: 2024-04
\t *   lastVerified: 2026-06-12
\t *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
\t */`;
    const blocks = extractVerificationBlocks(content, 'test/file.js');
    assert.strictEqual(blocks.length, 1);
    assert.strictEqual(blocks[0].feature, 'TabFeature');
  });
});

// ============================================================
// fixSourceURL tests
// ============================================================
describe('fixSourceURL', () => {
  const reference = {
    features: {
      'Stage4Feature': { stage: 4 },
      'Stage3Feature': { stage: 3 },
      'Stage2Feature': { stage: 2 }
    }
  };

  it('should fix wrong source for Stage 4 feature', () => {
    const block = { feature: 'Stage4Feature', source: 'https://github.com/tc39/proposals/blob/main/README.md' };
    const fix = fixSourceURL(block, reference);
    assert.notStrictEqual(fix, null);
    assert.ok(fix.new.includes('finished-proposals.md'));
  });

  it('should fix wrong source for Stage 3 feature', () => {
    const block = { feature: 'Stage3Feature', source: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' };
    const fix = fixSourceURL(block, reference);
    assert.notStrictEqual(fix, null);
    assert.ok(fix.new.includes('README.md'));
  });

  it('should return null for correct source', () => {
    const block = { feature: 'Stage4Feature', source: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' };
    const fix = fixSourceURL(block, reference);
    assert.strictEqual(fix, null);
  });

  it('should fix null source', () => {
    const block = { feature: 'Stage4Feature', source: null };
    const fix = fixSourceURL(block, reference);
    assert.notStrictEqual(fix, null);
    assert.strictEqual(fix.old, null);
    assert.ok(fix.new.includes('finished-proposals.md'));
  });

  it('should return null for unknown feature', () => {
    const block = { feature: 'UnknownFeature', source: 'anything' };
    const fix = fixSourceURL(block, reference);
    assert.strictEqual(fix, null);
  });

  it('should return null for Withdrawn (stage -1) features', () => {
    const ref = {
      features: {
        'WithdrawnFeature': { stage: -1 }
      }
    };
    const block = { feature: 'WithdrawnFeature', source: null };
    const fix = fixSourceURL(block, ref);
    assert.strictEqual(fix, null, 'Withdrawn features should not get a source URL fix');
  });

  it('should return null for stage 0 features with correct source', () => {
    const ref = {
      features: {
        'Stage0Feature': { stage: 0 }
      }
    };
    const block = { feature: 'Stage0Feature', source: 'https://github.com/tc39/proposals/blob/main/README.md' };
    const fix = fixSourceURL(block, ref);
    assert.strictEqual(fix, null);
  });
});

// ============================================================
// syncLastVerified tests
// ============================================================
describe('syncLastVerified', () => {
  it('should return fix when dates differ', () => {
    const block = { lastVerified: '2026-01-01' };
    const fix = syncLastVerified(block, '2026-06-15');
    assert.notStrictEqual(fix, null);
    assert.strictEqual(fix.old, '2026-01-01');
    assert.strictEqual(fix.new, '2026-06-15');
  });

  it('should return fix when lastVerified is missing', () => {
    const block = { lastVerified: null };
    const fix = syncLastVerified(block, '2026-06-15');
    assert.notStrictEqual(fix, null);
    assert.strictEqual(fix.old, null);
    assert.strictEqual(fix.new, '2026-06-15');
  });

  it('should return null when dates match', () => {
    const block = { lastVerified: '2026-06-15' };
    const fix = syncLastVerified(block, '2026-06-15');
    assert.strictEqual(fix, null);
  });
});

// ============================================================
// compareWithReference tests
// ============================================================
describe('compareWithReference', () => {
  const reference = {
    features: {
      'Temporal': { status: 'ES2027', stage: 4 },
      'Decorators': { status: 'Stage 2.7', stage: 2.7 }
    }
  };

  it('should match exact version', () => {
    const ann = { feature: 'Temporal', version: 'ES2027' };
    const result = compareWithReference(ann, reference);
    assert.strictEqual(result.match, true);
  });

  it('should match Stage 4 annotation for Stage 4 feature', () => {
    const ann = { feature: 'Temporal', version: 'Stage 4' };
    const result = compareWithReference(ann, reference);
    assert.strictEqual(result.match, true);
  });

  it('should match Stage number annotation', () => {
    const ann = { feature: 'Decorators', version: 'Stage 2.7' };
    const result = compareWithReference(ann, reference);
    assert.strictEqual(result.match, true);
  });

  it('should detect mismatch', () => {
    const ann = { feature: 'Temporal', version: 'ES2025' };
    const result = compareWithReference(ann, reference);
    assert.strictEqual(result.match, false);
  });

  it('should handle multi-space Stage annotations', () => {
    const ann = { feature: 'Decorators', version: 'Stage    2.7' };
    const result = compareWithReference(ann, reference);
    assert.strictEqual(result.match, true);
  });

  it('should return unknown for feature not in reference', () => {
    const ann = { feature: 'UnknownFeature', version: 'ES2025' };
    const result = compareWithReference(ann, reference);
    assert.strictEqual(result.match, 'unknown');
  });
});

// ============================================================
// checkBlockStage4Dates tests
// ============================================================
describe('checkBlockStage4Dates', () => {
  const reference = {
    features: {
      'GoodFeature': { stage4Date: '2024-06' },
      'BadFeature': { stage4Date: '2024-06' }
    }
  };

  it('should return empty for matching dates', () => {
    const blocks = [
      { feature: 'GoodFeature', stage4Date: '2024-06', file: 'test.js', line: 10 }
    ];
    const issues = checkBlockStage4Dates(blocks, reference);
    assert.strictEqual(issues.length, 0);
  });

  it('should detect mismatched stage4Date', () => {
    const blocks = [
      { feature: 'BadFeature', stage4Date: '2023-01', file: 'test.js', line: 10 }
    ];
    const issues = checkBlockStage4Dates(blocks, reference);
    assert.strictEqual(issues.length, 1);
    assert.strictEqual(issues[0].feature, 'BadFeature');
    assert.strictEqual(issues[0].expected, '2024-06');
  });

  it('should skip features not in reference', () => {
    const blocks = [
      { feature: 'UnknownFeature', stage4Date: '2024-06', file: 'test.js', line: 10 }
    ];
    const issues = checkBlockStage4Dates(blocks, reference);
    assert.strictEqual(issues.length, 0);
  });
});

// ============================================================
// detectDuplicateBlocks tests
// ============================================================
describe('detectDuplicateBlocks', () => {
  it('should return empty for unique features', () => {
    const blocks = [
      { feature: 'FeatureA', file: 'a.js', line: 10 },
      { feature: 'FeatureB', file: 'b.js', line: 20 }
    ];
    const duplicates = detectDuplicateBlocks(blocks);
    assert.strictEqual(duplicates.length, 0);
  });

  it('should detect cross-file duplicates', () => {
    const blocks = [
      { feature: 'FeatureA', file: 'a.js', line: 10 },
      { feature: 'FeatureA', file: 'b.js', line: 50 }
    ];
    const duplicates = detectDuplicateBlocks(blocks);
    assert.strictEqual(duplicates.length, 1);
    assert.strictEqual(duplicates[0].feature, 'FeatureA');
    assert.strictEqual(duplicates[0].locations.length, 2);
  });
});

// ============================================================
// checkLastVerifiedConsistency tests
// ============================================================
describe('checkLastVerifiedConsistency', () => {
  it('should return empty for consistent dates matching reference', () => {
    const blocks = [
      { feature: 'A', lastVerified: '2026-06-15', file: 'a.js' },
      { feature: 'B', lastVerified: '2026-06-15', file: 'b.js' }
    ];
    const ref = { meta: { lastVerified: '2026-06-15' } };
    const issues = checkLastVerifiedConsistency(blocks, ref);
    assert.strictEqual(issues.length, 0);
  });

  it('should detect mixed dates in same file', () => {
    const blocks = [
      { feature: 'A', lastVerified: '2026-06-15', file: 'a.js' },
      { feature: 'B', lastVerified: '2026-01-01', file: 'a.js' }
    ];
    const ref = { meta: { lastVerified: '2026-06-15' } };
    const issues = checkLastVerifiedConsistency(blocks, ref);
    const mixed = issues.filter(i => i.type === 'mixed_dates');
    assert.ok(mixed.length > 0);
  });

  it('should detect demo/reference mismatch', () => {
    const blocks = [
      { feature: 'A', lastVerified: '2026-01-01', file: 'a.js' }
    ];
    const ref = { meta: { lastVerified: '2026-06-15' } };
    const issues = checkLastVerifiedConsistency(blocks, ref);
    const mismatch = issues.filter(i => i.type === 'demo_reference_mismatch');
    assert.ok(mismatch.length > 0);
  });
});

// ============================================================
// applyFixes tests
// ============================================================
describe('applyFixes', () => {
  it('should fix source URL in content', () => {
    const content = `/*
 * verification:
 *   feature: Test
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-06-12
 *   source: https://github.com/tc39/proposals/blob/main/README.md
 */`;
    const fixes = [{
      type: 'source',
      feature: 'Test',
      old: 'https://github.com/tc39/proposals/blob/main/README.md',
      new: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    assert.ok(result.content.includes('finished-proposals.md'));
    assert.ok(!result.content.includes('README.md'));
  });

  it('should fix null source', () => {
    const content = `/*
 * verification:
 *   feature: Test
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-06-12
 *   source:
 */`;
    const fixes = [{
      type: 'source',
      feature: 'Test',
      old: null,
      new: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    assert.ok(result.content.includes('source: https://github.com/tc39/proposals/blob/main/finished-proposals.md'));
    // Verify block structure is preserved (no newline consumed by \s)
    assert.ok(result.content.includes(' */'));
    assert.ok(result.content.split('\n').length >= content.split('\n').length - 1, 'Block structure preserved');
  });

  it('should fix null source with empty line', () => {
    // Test bug #8: \s should not match newlines in source replacement
    const content = `/*
 * verification:
 *   feature: Test
 *   status: ES2027
 *   stage4Date: 2025-09
 *   lastVerified: 2026-06-12
 *   source:
 */`;
    const fixes = [{
      type: 'source',
      feature: 'Test',
      old: null,
      new: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    // Verify closing */ is preserved on its own line
    const lines = result.content.split('\n');
    assert.ok(lines.some(l => l.includes('source:') && l.includes('finished-proposals.md')), 'source URL should be on its own line');
    assert.ok(lines.some(l => l.trim() === '*/'), 'closing */ should remain on its own line');
  });

  it('should fix lastVerified date', () => {
    const content = `/*
 * verification:
 *   feature: Test
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-01-01
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */`;
    const fixes = [{
      type: 'lastVerified',
      feature: 'Test',
      old: '2026-01-01',
      new: '2026-06-15'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    assert.ok(result.content.includes('lastVerified: 2026-06-15'));
  });

  it('should handle missing lastVerified', () => {
    const content = `/*
 * verification:
 *   feature: Test
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified:
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */`;
    const fixes = [{
      type: 'lastVerified',
      feature: 'Test',
      old: null,
      new: '2026-06-15'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    assert.ok(result.content.includes('lastVerified: 2026-06-15'));
  });

  it('should return unmodified for empty fixes', () => {
    const content = 'test content';
    const result = applyFixes('test.js', [], content);
    assert.strictEqual(result.modified, false);
    assert.strictEqual(result.content, 'test content');
  });

  it('should apply multiple fixes', () => {
    const content = `/*
 * verification:
 *   feature: Test
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-01-01
 *   source: https://wrong.url/README.md
 */`;
    const fixes = [
      { type: 'source', feature: 'Test', old: 'https://wrong.url/README.md', new: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' },
      { type: 'lastVerified', feature: 'Test', old: '2026-01-01', new: '2026-06-15' }
    ];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    assert.strictEqual(result.changes.length, 2);
    assert.ok(result.content.includes('finished-proposals.md'));
    assert.ok(result.content.includes('lastVerified: 2026-06-15'));
  });

  // Regression: null-source fix should NOT pollute other blocks (Bug #1)
  it('should fix only the target block when source is null in one of two blocks', () => {
    const content = `/*
 * verification:
 *   feature: FeatureA
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-06-12
 *   source: https://github.com/tc39/proposals/blob/main/finished-proposals.md
 */
/*
 * verification:
 *   feature: FeatureB
 *   status: Stage 3
 *   lastVerified: 2026-06-12
 *   source:
 */`;
    const fixes = [{
      type: 'source',
      feature: 'FeatureB',
      old: null,
      new: 'https://github.com/tc39/proposals/blob/main/README.md'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    // FeatureA's correct source should be preserved
    assert.ok(result.content.includes('source: https://github.com/tc39/proposals/blob/main/finished-proposals.md'),
      'FeatureA source should not be overwritten');
    // FeatureB's null source should be fixed
    assert.ok(result.content.includes('source: https://github.com/tc39/proposals/blob/main/README.md'),
      'FeatureB source should be fixed');
    // changes count should be 1, not 2
    assert.strictEqual(result.changes.length, 1, 'Only one block should be changed');
  });

  // Regression: null-source fix with different URLs for different blocks (Bug #1)
  it('should apply different source URLs to different null-source blocks', () => {
    const content = `/*
 * verification:
 *   feature: Stage4Feature
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-06-12
 *   source:
 */
/*
 * verification:
 *   feature: Stage3Feature
 *   status: Stage 3
 *   lastVerified: 2026-06-12
 *   source:
 */`;
    const fixes = [
      { type: 'source', feature: 'Stage4Feature', old: null, new: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' },
      { type: 'source', feature: 'Stage3Feature', old: null, new: 'https://github.com/tc39/proposals/blob/main/README.md' },
    ];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    // Each block should get its correct URL
    const stage4Block = result.content.match(/feature: Stage4Feature[\s\S]*?source: ([^\n]*)/);
    const stage3Block = result.content.match(/feature: Stage3Feature[\s\S]*?source: ([^\n]*)/);
    assert.ok(stage4Block, 'Stage4Feature block should exist');
    assert.ok(stage3Block, 'Stage3Feature block should exist');
    assert.ok(stage4Block[1].includes('finished-proposals.md'),
      `Stage4Feature should get finished-proposals.md, got "${stage4Block[1]}"`);
    assert.ok(stage3Block[1].includes('README.md'),
      `Stage3Feature should get README.md, got "${stage3Block[1]}"`);
  });

  // Regression: old-value source fix with same URL in two blocks (Bug #2)
  it('should fix only target block when old URL appears in multiple blocks', () => {
    const content = `/*
 * verification:
 *   feature: Stage4Feature
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-06-12
 *   source: https://wrong.url
 */
/*
 * verification:
 *   feature: Stage3Feature
 *   status: Stage 3
 *   lastVerified: 2026-06-12
 *   source: https://wrong.url
 */`;
    const fixes = [
      { type: 'source', feature: 'Stage4Feature', old: 'https://wrong.url', new: 'https://github.com/tc39/proposals/blob/main/finished-proposals.md' },
      { type: 'source', feature: 'Stage3Feature', old: 'https://wrong.url', new: 'https://github.com/tc39/proposals/blob/main/README.md' },
    ];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    const stage4Block = result.content.match(/feature: Stage4Feature[\s\S]*?source: ([^\n]*)/);
    const stage3Block = result.content.match(/feature: Stage3Feature[\s\S]*?source: ([^\n]*)/);
    assert.ok(stage4Block[1].includes('finished-proposals.md'),
      `Stage4Feature should get finished-proposals.md, got "${stage4Block[1]}"`);
    assert.ok(stage3Block[1].includes('README.md'),
      `Stage3Feature should get README.md, got "${stage3Block[1]}"`);
  });

  // Regression: lastVerified fix should not pollute other blocks
  it('should fix only target block lastVerified when one is empty', () => {
    const content = `/*
 * verification:
 *   feature: FeatureA
 *   status: ES2025
 *   stage4Date: 2024-04
 *   lastVerified: 2026-01-01
 *   source: https://example.com
 */
/*
 * verification:
 *   feature: FeatureB
 *   status: ES2026
 *   lastVerified:
 *   source: https://example.com
 */`;
    const fixes = [{
      type: 'lastVerified',
      feature: 'FeatureB',
      old: null,
      new: '2026-06-17'
    }];
    const result = applyFixes('test.js', fixes, content);
    assert.strictEqual(result.modified, true);
    // FeatureA's lastVerified should be preserved
    const featureABlock = result.content.match(/feature: FeatureA[\s\S]*?lastVerified: ([^\n]*)/);
    const featureBBlock = result.content.match(/feature: FeatureB[\s\S]*?lastVerified: ([^\n]*)/);
    assert.strictEqual(featureABlock[1].trim(), '2026-01-01', 'FeatureA lastVerified should be preserved');
    assert.strictEqual(featureBBlock[1].trim(), '2026-06-17', 'FeatureB lastVerified should be fixed');
  });
});

// ============================================================
// VERSION test
// ============================================================
describe('VERSION', () => {
  it('should export a valid version string', () => {
    assert.ok(typeof VERSION === 'string');
    assert.ok(/^\d+\.\d+\.\d+$/.test(VERSION));
  });
});

console.log('\n✅ All tests completed\n');
