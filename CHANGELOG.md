# Changelog

## [2026-02-14] - File Reorganization and Folder Structure

### Changed

#### Folder Organization (Phase 2)
- Organized all demo files into category folders for better structure
- Created 4 category folders: `basics/`, `data-structures/`, `core-concepts/`, `asynchronous/`
- Moved 18 files (15 JS + 3 TS) into appropriate folders using `smartRelocate`
- All file moves preserve git history

#### New Folder Structure
```
demo/
├── basics/            # Basic Syntax (01-04)
├── data-structures/   # Data Structures (05-07)
├── core-concepts/     # Core Concepts (08-11)
└── asynchronous/      # Asynchronous Programming (12-15)
```

#### File Structure Reorganization (Phase 1)
- Reorganized 15 demo files according to learning progression
- Files now follow MDN, JavaScript.info, and roadmap.sh recommended order
- New numbering: Basic Syntax (01-04) → Data Structures (05-07) → Core Concepts (08-11) → Async (12-15)

#### File Renames
- `02-functions.js` → `06-functions.js`
- `02-functions-ts-comparison.ts` → `06-functions-ts-comparison.ts`
- `03-arrays.js` → `05-arrays.js`
- `03-arrays-ts-comparison.ts` → `05-arrays-ts-comparison.ts`
- `04-objects.js` → `07-objects.js`
- `06-modern-features.js` → `11-modern-features.js`
- `07-operators.js` → `02-operators.js`
- `08-control-flow.js` → `03-control-flow.js`
- `09-strings.js` → `04-strings.js`
- `10-error-handling.js` → `09-error-handling.js`
- `11-scope-closures.js` → `08-scope-closures.js`
- `12-promises.js` → `13-promises.js`
- `13-async-await.js` → `14-async-await.js`
- `14-event-loop-callbacks.js` → `12-event-loop-callbacks.js`
- `16-prototypes-inheritance.js` → `10-prototypes-inheritance.js`

#### Documentation Updates
- Updated `README.md` with new folder structure and file paths
- Updated `docs/TODOLIST.md` with reorganized topics and folder paths
- Updated `docs/JS-TS-KEY-DIFFERENCES.md` with correct file references
- Updated `FILE_RENAMING_MAP.md` to include folder organization details
- Updated `CHANGELOG.md` with folder organization changes

### Removed
- `demo/05-typescript-basics.ts` - Content too basic, will be replaced with comprehensive version

### Added
- `FILE_RENAMING_MAP.md` - Complete file renaming reference
- `CHANGELOG.md` - This file

### Rationale
The reorganization follows industry-standard learning paths and improves project structure:

**Phase 1 - File Renumbering:**
1. **Basic Syntax First** - Variables, operators, control flow, strings
2. **Data Structures** - Arrays, functions, objects
3. **Core Concepts** - Scope, errors, prototypes, ES6+
4. **Async Programming** - Event loop, promises, async/await, modules

**Phase 2 - Folder Organization:**
- Groups related files into logical categories
- Makes navigation easier for learners
- Follows common project structure patterns
- Maintains file numbering for learning sequence

This progression ensures learners master fundamentals before tackling complex concepts.

### Migration Guide
See `FILE_RENAMING_MAP.md` for complete old → new filename mapping.

---

## Future Plans

### Planned Additions
- `16-json.js` - JSON parsing and serialization
- `17-iterators-generators.js` - Deep dive into iteration protocols
- `18-regular-expressions.js` - Pattern matching and text processing
- `19-map-set.js` - ES6 collection types
- `20-destructuring-spread.js` - Advanced destructuring patterns
- `21-this-keyword.js` - Deep dive into this binding

### Improvements
- Expand array examples with missing methods
- Add more TypeScript comparison files
- Create interactive exercises
