# Changelog

All notable changes to this project will be documented in this file.

## [2026-02-16] - File Renumbering and Documentation Update

### Changed
- **File Renumbering**: Reorganized all demo files with unique, sequential numbering (01-22)
  - Stage 1: Basics (01-04) - No changes
  - Stage 2: Data Structures (05-10) - Added 10-date-time.js
  - Stage 3: Core Concepts (11-17) - Renumbered from 10-15 to 11-17, added 17-proxy-reflect.js
  - Stage 4: Asynchronous (18-22) - Renumbered from 16-20 to 18-22

### Added
- **New Skeleton Files**:
  - `demo/data-structures/10-date-time.js` - Date and time handling
  - `demo/core-concepts/17-proxy-reflect.js` - Proxy and Reflect API
- **New Documentation**:
  - `DEMO_FILE_STRUCTURE.md` - Complete file structure reference
  - `CHANGELOG.md` - This file

### Updated
- **README.md**: 
  - Updated project structure to reflect new file numbering (01-22)
  - Updated Quick Start commands with new file paths
  - Updated Features section (20 → 22 files)
  - Updated Learning Path descriptions
- **docs/TODOLIST.md**:
  - Updated all file paths to match new numbering
  - Added new topics: Date & Time (10), Proxy & Reflect (17)
  - Updated progress tracking (15/22 topics)
  - Updated last modified date
- **docs/JS-TS-KEY-DIFFERENCES.md**:
  - Updated practice file references with new paths
  - Added more file references for comprehensive coverage
  - Updated last modified date

### File Renaming Details

#### Core Concepts Folder
- `10-scope-closures.js` → `11-scope-closures.js`
- `11-error-handling.js` → `12-error-handling.js`
- `12-prototypes-inheritance.js` → `13-prototypes-inheritance.js`
- `13-modern-features.js` → `14-modern-features.js`
- `14-regex.js` → `15-regex.js`
- `15-iterators-generators.js` → `16-iterators-generators.js`
- `16-proxy-reflect.js` → `17-proxy-reflect.js` (new file)

#### Asynchronous Folder
- `16-event-loop-callbacks.js` → `18-event-loop-callbacks.js`
- `17-promises.js` → `19-promises.js`
- `18-async-await.js` → `20-async-await.js`
- `19-modules.js` → `21-modules.js`
- `20-fetch-api.js` → `22-fetch-api.js`

### Rationale
- **Eliminated duplicate numbering**: Previously had two files numbered 10 and two numbered 16
- **Sequential ordering**: All files now have unique, sequential numbers from 01 to 22
- **Logical grouping**: Maintained 4-stage learning progression
- **Roadmap alignment**: File order follows JavaScript learning roadmap best practices

---

## [2026-02-14] - Initial Project Setup

### Added
- Initial 20 demo files covering JavaScript fundamentals
- 3 TypeScript comparison files
- Documentation files (README.md, TODOLIST.md, JS-TS-KEY-DIFFERENCES.md)
- 4-stage learning structure (Basics, Data Structures, Core Concepts, Asynchronous)

### Features
- Comprehensive JavaScript examples with detailed comments
- ES version annotations (ES1-ES2023)
- TypeScript comparison for key topics
- 15 complete topics, 5 skeleton files for future development

---

## Future Plans

### Short-term (Next 2-4 weeks)
- [ ] Complete skeleton files:
  - [ ] 08-map-set.js (add WeakMap/WeakSet)
  - [ ] 09-json.js (complete JSON operations)
  - [ ] 10-date-time.js (date and time handling)
  - [ ] 15-regex.js (regular expressions)
  - [ ] 16-iterators-generators.js (iterators and generators)
  - [ ] 17-proxy-reflect.js (Proxy and Reflect API)
  - [ ] 22-fetch-api.js (Fetch API)

### Medium-term (1-2 months)
- [ ] Add advanced topics:
  - [ ] Performance optimization
  - [ ] Design patterns
  - [ ] Functional programming patterns
- [ ] Enhance existing files:
  - [ ] Add setTimeout/setInterval details to 18-event-loop-callbacks.js
  - [ ] Add Promisification to 19-promises.js
  - [ ] Add CommonJS comparison to 21-modules.js

### Long-term (3+ months)
- [ ] Create advanced folder with specialized topics
- [ ] Add more TypeScript comparison files
- [ ] Create interactive examples
- [ ] Add testing examples
- [ ] Create video tutorials

---

**Maintained by**: JavaScript Learning Project Team  
**Last Updated**: 2026-02-16
