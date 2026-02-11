# Feature: Remove Firebase Legacy Files and References

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to preserving any useful information from deprecated documentation before deletion.

## Feature Description

Remove all deprecated Firebase-related files, directories, and references from the codebase. The project has been successfully migrated from Firebase/GCP backend to Express + SQLite for local development. The `functions/`, `ml/`, and Firebase configuration files are no longer used at runtime and create confusion about which backend is active.

This cleanup task will:
- Delete unused Firebase Cloud Functions (`functions/` directory)
- Delete unused ML/AutoML code (`ml/` directory)
- Remove Firebase configuration files (`firebase.json`, `firestore.rules`, `firestore.indexes.json`)
- Delete Firebase deployment scripts
- If any scripts remain in the project root path, migrate any remaining scripts out of the project root path and into a `scripts/` folder, ensure they still work
- Update documentation to remove Firebase setup instructions
- Clean up references in build configuration and source code
- Update `.gitignore` to remove Firebase-specific entries

## User Story

As a developer working on this codebase
I want all deprecated Firebase files and references removed
So that I have a clean codebase without confusion about which backend system is active, and I don't waste time investigating unused code

## Problem Statement

The codebase was successfully migrated from Firebase/GCP to Express + SQLite (merged in PR #1), but all Firebase-related files were intentionally kept "for reference" to avoid data loss. This creates several problems:

1. **Confusion**: New developers don't know which backend is active (Firebase or Express)
2. **Maintenance burden**: Documentation describes two different backend systems
3. **Misleading setup instructions**: README.md contains extensive Firebase setup that doesn't work
4. **Code bloat**: 60+ unused files in `functions/` and `ml/` directories
5. **Outdated dependencies**: `package-lock.json` contains historical Firebase package references
6. **Ambiguous commands**: Deploy scripts reference Firebase but don't work with current backend

According to CLAUDE.md and implementation reports, this cleanup was deferred during the migration but is now safe to execute since the Express backend is fully functional and tested.

## Solution Statement

Systematically remove all Firebase-related files and update documentation to reflect the current Express + SQLite architecture. This involves:

1. **Delete directories**: Remove `functions/` and `ml/` entirely
2. **Delete configuration**: Remove `firebase.json`, `firestore.rules`, `firestore.indexes.json`
3. **Delete scripts**: Remove all `deploy_*.sh` scripts that call Firebase CLI
4. **Update documentation**: Rewrite README.md, update CLAUDE.md and PRD.md to remove Firebase references
5. **Clean code references**: Remove Firebase-specific comments and build config entries
6. **Update .gitignore**: Remove Firebase cache/config entries
7. **Regenerate lockfile**: Remove historical Firebase package references from `package-lock.json`

The solution preserves all useful architectural documentation by maintaining the implementation report and feature plan in `.agents/` which document the original Firebase architecture for historical reference.

## Feature Metadata

**Feature Type**: Refactor (Cleanup/Removal)
**Estimated Complexity**: Medium
**Primary Systems Affected**:
- Documentation (README.md, CLAUDE.md, PRD.md)
- Build configuration (base.config.js, .gitignore)
- Deployment scripts (deploy_*.sh)
- Source code comments (static/Util.js)

**Dependencies**: None (all Express backend functionality already in place and tested)

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

**Files to Delete (15 files/directories):**
- `functions/` (entire directory) - Firebase Cloud Functions backend (60+ files, ~3000 lines)
- `ml/` (entire directory) - AutoML training code (4 files)
- `firebase.json` - Firebase hosting configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore database indexes
- `deploy_test.sh` - Firebase test deployment script
- `deploy_prod.sh` - Firebase production deployment script
- `deploy_test_hosting.sh` - Firebase hosting-only deployment
- `deploy_test_firestore.sh` - Firebase Firestore-only deployment

**Files to Update (8 files):**
- `.gitignore` (lines 3-5) - Contains Firebase cache/config entries: `.firebase/`, `.firebaserc`, `firebase-debug.log`
- `build/base.config.js` (line 143) - Contains `/firebase/` in externals array
- `static/Util.js` (line 22) - Contains comment referencing Firebase JS SDK issue
- `README.md` (entire file) - 51 Firebase references, extensive setup instructions for Firebase/GCP
- `CLAUDE.md` (lines 72-74, 112-186, 201) - References to legacy Firebase backend
- `docs/PRD.md` (lines 237-256, 385-396, 589-602) - Firebase architecture documentation
- `.agents/plans/features/replace-firebase-with-express-sqlite.md` (line 341) - Cleanup task marked incomplete
- `package-lock.json` - Historical Firebase package references (regenerate via `npm install`)

**Reference Documentation (Read for context):**
- `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` - Documents why files were kept and confirms removal is safe
- CLAUDE.md section "Known Issues & Technical Debt" - Lists "Legacy Files Present" as high-priority issue
- MEMORY.md - Documents current Express + SQLite backend architecture

### New Files to Create

None (this is a deletion/cleanup task only)

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

**Internal Documentation:**
- [Implementation Report: Replace Firebase](../.agents/implementation-reports/replace-firebase-with-express-sqlite.md)
  - Section "Skipped Items" and "Divergences from Plan" explain why files were kept
  - Confirms Firebase files are "dormant" and safe to remove
  - Documents that Express backend is fully functional with 116 passing tests

**Project Documentation:**
- Current CLAUDE.md "Important Notes" section documents Firebase files as "dormant but confusing"
- Current MEMORY.md documents Express + SQLite as active backend
- PRD.md contains original Firebase architecture for historical reference

**No external documentation needed** - this is purely a cleanup task of deprecated internal files.

### Patterns to Follow

**Documentation Update Pattern:**

Since this is a cleanup task, the key pattern is to **preserve useful information in historical documents** while removing outdated setup instructions.

**From existing implementation report:**
```markdown
### Legacy Backend (Reference Only: `/functions/`)
The `functions/` directory contains the original Firebase Cloud Functions backend.
These files are kept for reference but are NOT used in the current Express implementation.
```

**Pattern to follow**: When removing Firebase documentation, preserve architectural insights by noting "see implementation report for historical Firebase architecture" rather than deleting all context.

**File Deletion Pattern:**

Follow Git best practices:
1. Use `git rm` for tracked files (preserves history)
2. Verify files are actually unused before deletion
3. Check for hidden dependencies or dynamic imports
4. Run full test suite after deletion to catch regressions

**Documentation Rewrite Pattern:**

Based on current CLAUDE.md structure:
1. Lead with current architecture (Express + SQLite)
2. Remove setup instructions for deprecated systems
3. Add "Historical Note" sections for context if needed
4. Keep instructions focused on what developers need NOW

---

## IMPLEMENTATION PLAN

### Phase 1: Pre-Deletion Validation

Verify that all files marked for deletion are truly unused and that removal won't break the current Express backend.

**Tasks:**
- Read implementation report to confirm files are dormant
- Verify no dynamic imports or require() calls reference functions/ or ml/
- Confirm all tests pass with current codebase (baseline)
- Check for any undocumented dependencies

### Phase 2: Directory and Configuration Deletion

Remove the largest deprecated components first (functions/ and ml/ directories).

**Tasks:**
- Delete `functions/` directory entirely (60+ files)
- Delete `ml/` directory entirely (4 files)
- Delete Firebase configuration files (firebase.json, firestore.rules, firestore.indexes.json)
- Delete Firebase deployment scripts (deploy_*.sh)

### Phase 3: Code Reference Cleanup

Update source code and build configuration to remove Firebase-specific entries.

**Tasks:**
- Update `.gitignore` to remove Firebase entries
- Update `build/base.config.js` to remove `/firebase/` from externals
- Update `static/Util.js` to remove Firebase SDK comment
- Regenerate `package-lock.json` to remove historical Firebase package references

### Phase 4: Documentation Updates

Rewrite documentation to reflect Express + SQLite architecture only, with minimal historical notes.

**Tasks:**
- Rewrite README.md to remove Firebase setup instructions
- Update CLAUDE.md to remove legacy backend sections
- Update docs/PRD.md to reflect current architecture
- Update feature plan to mark cleanup task as complete

### Phase 5: Testing & Validation

Ensure no regressions were introduced by the cleanup.

**Tasks:**
- Run full test suite (should still have 116 passing tests)
- Verify build still works (`./build_dev.sh`)
- Verify server still starts (`node server.js`)
- Check for any broken documentation links

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: CREATE baseline test report

- **IMPLEMENT**: Run test suite and record current passing count as baseline
- **VALIDATE**: `npm test | tee /tmp/baseline-tests.txt`
- **GOTCHA**: Must use Node 18 (`nvm use 18`) before running tests
- **EXPECTED**: 116 tests passing, 0 failures

### Task 2: VERIFY functions/ directory is unused

- **IMPLEMENT**: Search codebase for any imports/requires from functions/ directory
- **PATTERN**: Use Grep to search for `require.*functions/` and `from.*functions/` patterns
- **VALIDATE**: `grep -r "require.*functions/" --include="*.js" --exclude-dir=functions --exclude-dir=node_modules . && echo "FOUND REFERENCES" || echo "NO REFERENCES FOUND"`
- **EXPECTED**: "NO REFERENCES FOUND" (empty result means safe to delete)

### Task 3: VERIFY ml/ directory is unused

- **IMPLEMENT**: Search codebase for any imports/requires from ml/ directory
- **PATTERN**: Use Grep to search for `require.*ml/` and `from.*ml/` patterns
- **VALIDATE**: `grep -r "require.*ml/" --include="*.js" --exclude-dir=ml --exclude-dir=node_modules . && echo "FOUND REFERENCES" || echo "NO REFERENCES FOUND"`
- **EXPECTED**: "NO REFERENCES FOUND" (empty result means safe to delete)

### Task 4: REMOVE functions/ directory

- **IMPLEMENT**: Delete entire functions/ directory (60+ files, ~3000 lines)
- **VALIDATE**: `git rm -r functions/ && test ! -d functions/ && echo "DELETED"`
- **GOTCHA**: Use `git rm` not `rm` to preserve Git history
- **EXPECTED**: "DELETED" message and directory no longer exists

### Task 5: REMOVE ml/ directory

- **IMPLEMENT**: Delete entire ml/ directory (4 files)
- **VALIDATE**: `git rm -r ml/ && test ! -d ml/ && echo "DELETED"`
- **GOTCHA**: Use `git rm` not `rm` to preserve Git history
- **EXPECTED**: "DELETED" message and directory no longer exists

### Task 6: REMOVE firebase.json

- **IMPLEMENT**: Delete Firebase hosting configuration file
- **VALIDATE**: `git rm firebase.json && test ! -f firebase.json && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 7: REMOVE firestore.rules

- **IMPLEMENT**: Delete Firestore security rules file
- **VALIDATE**: `git rm firestore.rules && test ! -f firestore.rules && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 8: REMOVE firestore.indexes.json

- **IMPLEMENT**: Delete Firestore indexes configuration file
- **VALIDATE**: `git rm firestore.indexes.json && test ! -f firestore.indexes.json && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 9: REMOVE deploy_test.sh

- **IMPLEMENT**: Delete Firebase test deployment script
- **VALIDATE**: `git rm deploy_test.sh && test ! -f deploy_test.sh && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 10: REMOVE deploy_prod.sh

- **IMPLEMENT**: Delete Firebase production deployment script
- **VALIDATE**: `git rm deploy_prod.sh && test ! -f deploy_prod.sh && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 11: REMOVE deploy_test_hosting.sh

- **IMPLEMENT**: Delete Firebase hosting-only deployment script
- **VALIDATE**: `git rm deploy_test_hosting.sh && test ! -f deploy_test_hosting.sh && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 12: REMOVE deploy_test_firestore.sh

- **IMPLEMENT**: Delete Firebase Firestore-only deployment script
- **VALIDATE**: `git rm deploy_test_firestore.sh && test ! -f deploy_test_firestore.sh && echo "DELETED"`
- **EXPECTED**: "DELETED" message and file no longer exists

### Task 13: UPDATE .gitignore

- **IMPLEMENT**: Remove Firebase-specific entries from .gitignore
- **PATTERN**: Read current .gitignore, identify Firebase entries (lines 3-5), remove them
- **LINES TO REMOVE**:
  ```
  .firebase/
  .firebaserc
  firebase-debug.log
  ```
- **VALIDATE**: `grep -E "(firebase|Firebase)" .gitignore && echo "STILL HAS FIREBASE" || echo "CLEANED"`
- **EXPECTED**: "CLEANED" (no Firebase references remain)

### Task 14: UPDATE build/base.config.js

- **IMPLEMENT**: Remove `/firebase/` from externals array on line 143
- **PATTERN**: Current: `externals: [/firebase/, /howler/, /translations/, /vibrant/, /workbox/]`
- **PATTERN**: Updated: `externals: [/howler/, /translations/, /vibrant/, /workbox/]`
- **VALIDATE**: `grep "firebase" build/base.config.js && echo "STILL REFERENCED" || echo "CLEANED"`
- **EXPECTED**: "CLEANED" (no firebase in externals)

### Task 15: UPDATE static/Util.js

- **IMPLEMENT**: Remove Firebase SDK comment on line 22
- **CURRENT LINE**: `// https://github.com/firebase/firebase-js-sdk/issues/1670`
- **ACTION**: Remove this comment line entirely (or replace with generic comment if needed for code clarity)
- **VALIDATE**: `grep "firebase" static/Util.js && echo "STILL REFERENCED" || echo "CLEANED"`
- **EXPECTED**: "CLEANED" (no firebase references)

### Task 16: VERIFY build still works

- **IMPLEMENT**: Run webpack build to ensure removal of /firebase/ external didn't break build
- **VALIDATE**: `nvm use 18 && ./build_dev.sh 2>&1 | tee /tmp/build-output.txt && grep -i "error" /tmp/build-output.txt && echo "BUILD FAILED" || echo "BUILD SUCCESS"`
- **EXPECTED**: "BUILD SUCCESS" and dist/ directory populated
- **GOTCHA**: Must use Node 18 and build requires NODE_OPTIONS=--openssl-legacy-provider (already in script)

### Task 17: VERIFY server still starts

- **IMPLEMENT**: Start Express server to ensure no hidden dependencies on deleted files
- **VALIDATE**: `timeout 5 node server.js > /tmp/server-output.txt 2>&1 & sleep 2 && curl -s http://localhost:5000 > /dev/null && echo "SERVER OK" || echo "SERVER FAILED"`
- **EXPECTED**: "SERVER OK" (server starts and responds)
- **GOTCHA**: May need PORT=3000 if 5000 is occupied

### Task 18: VERIFY tests still pass

- **IMPLEMENT**: Run full test suite to ensure no regressions from file deletions
- **VALIDATE**: `npm test`
- **EXPECTED**: 116 tests passing, 0 failures (same as baseline from Task 1)
- **GOTCHA**: Must use Node 18 (`nvm use 18`)

### Task 19: UPDATE README.md

- **IMPLEMENT**: Major rewrite of README.md to remove Firebase setup instructions and focus on Express + SQLite setup
- **CURRENT**: 440 lines with extensive Firebase/GCP setup (sections 2-5)
- **NEW STRUCTURE**:
  ```markdown
  # README

  Wheel Spinner - Interactive spinning wheel web application for random selection.

  ## Quick Start (Local Development)

  1. Clone the repo
  2. Install Node 18: `nvm install 18 && nvm use 18`
  3. Run `npm install`
  4. Run `./build_and_serve_local.sh` or `npm run dev`
  5. Open http://localhost:5000 (or PORT=3000 if 5000 conflicts)

  ## Development Commands

  **Build:**
  - `./build_dev.sh` - Development build
  - `./build_test.sh` - Test build
  - `./build_prod.sh` - Production build

  **Run:**
  - `node server.js` - Start Express server (after build)
  - `npm run dev` - Build + start
  - `PORT=3000 node server.js` - Use alternate port

  **Test:**
  - `npm test` - Run test suite (116 tests)

  ## Architecture

  - **Frontend**: Vue.js 2 SPA with canvas-based wheel rendering
  - **Backend**: Express API + SQLite database
  - **Database**: wheelspinner.db (auto-created on first run)

  See CLAUDE.md for detailed architecture and development guidelines.

  ## Features

  - Interactive spinning wheel with visual/audio effects
  - Customizable colors, images, sounds
  - Save/share wheels via short links (XXX-XXX format)
  - 6 language locales
  - PWA with offline support

  ## Historical Note

  This project was originally built with Firebase/GCP backend for the wheelofnames.com
  deployment. The codebase has been migrated to Express + SQLite for local self-hosting.
  See `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` for
  migration details and original Firebase architecture.

  ## License

  Apache 2.0 - Originally a Google-sponsored open source project.
  ```
- **VALIDATE**: `grep -i firebase README.md | wc -l`
- **EXPECTED**: 1 line (only in "Historical Note" section)
- **GOTCHA**: Preserve the "not officially supported Google product" disclaimer if present

### Task 20: UPDATE CLAUDE.md

- **IMPLEMENT**: Remove "Legacy Backend" and "Legacy: Firestore Data Model" sections since files are now deleted
- **CURRENT SECTIONS TO REMOVE**:
  - Lines 112-116: "Legacy Backend (Reference Only: `/functions/`)"
  - Lines 139-143: "Legacy: Firestore Data Model (Reference Only)"
- **UPDATE "Key Files" section**: Remove "Legacy (Reference Only)" subsection (lines 180-183)
- **UPDATE "Important Notes" section**: Remove "Legacy Files Present" from Known Issues (line 198)
- **UPDATE "Build & Development Commands"**: Remove "Legacy (unused)" subsection (lines 70-75)
- **VALIDATE**: `grep -i "legacy\|firebase\.json\|firestore\.rules\|functions/" CLAUDE.md | wc -l`
- **EXPECTED**: 0 lines (no legacy references remain)

### Task 21: UPDATE docs/PRD.md

- **IMPLEMENT**: Update PRD to reflect current Express + SQLite architecture, remove Firebase backend sections
- **SECTIONS TO UPDATE**:
  - Lines 189-197: Remove Firebase/GCP backend from architecture diagram
  - Lines 237-242: Remove `functions/` from directory structure
  - Lines 326-336: Remove Backend section describing Firebase Cloud Functions
  - Lines 392-465: Remove Cloud Functions API table and Firestore data model
  - Lines 589-604: Remove Firebase build commands from appendix
- **ADD HISTORICAL NOTE**: At end of Backend section, add:
  ```markdown
  **Historical Note**: The original production deployment (wheelofnames.com) used
  Firebase/GCP backend. See `.agents/implementation-reports/replace-firebase-with-express-sqlite.md`
  for details on the original architecture and migration to Express + SQLite.
  ```
- **VALIDATE**: `grep -c "Firebase Cloud Functions" docs/PRD.md`
- **EXPECTED**: 0 (no mentions of Firebase Cloud Functions in active documentation)

### Task 22: UPDATE .agents/plans/features/replace-firebase-with-express-sqlite.md

- **IMPLEMENT**: Mark Task 12 (CLEANUP) as fully complete instead of partial
- **CURRENT**: Line 341 shows "⚠️ PARTIAL" with note about Firebase config files kept
- **UPDATE TO**:
  ```markdown
  | Task 12: CLEANUP | ✅ DONE | Tests fixed, unused deps removed, Firebase files removed in follow-up cleanup |
  ```
- **VALIDATE**: `grep "Task 12" .agents/plans/features/replace-firebase-with-express-sqlite.md`
- **EXPECTED**: Shows "✅ DONE" instead of "⚠️ PARTIAL"

### Task 23: REGENERATE package-lock.json

- **IMPLEMENT**: Regenerate package-lock.json to remove historical Firebase package references
- **VALIDATE**: `rm package-lock.json && npm install && test -f package-lock.json && echo "REGENERATED"`
- **EXPECTED**: "REGENERATED" message and fresh package-lock.json created
- **GOTCHA**: Requires Node 18 (`nvm use 18`)

### Task 24: VERIFY final test suite

- **IMPLEMENT**: Final full test suite run to confirm no regressions
- **VALIDATE**: `npm test`
- **EXPECTED**: 116 tests passing, 0 failures (same as baseline)

### Task 25: VERIFY final build

- **IMPLEMENT**: Final webpack build to confirm everything still works
- **VALIDATE**: `./build_dev.sh`
- **EXPECTED**: Successful build with no errors, dist/ directory populated

### Task 26: LIST deleted files summary

- **IMPLEMENT**: Generate summary of deleted files for commit message
- **VALIDATE**: `git status --short | grep "^D" | wc -l`
- **EXPECTED**: Approximately 70+ deleted files (functions/*, ml/*, config files, deploy scripts)

---

## TESTING STRATEGY

### Unit Tests

**Scope**: Verify existing test suite still passes after file deletions

All existing unit tests in `test/` directory must continue to pass:
- `test-WheelConfig.js` - 7 tests
- `test-Util.js` - 39 tests
- `test-Locales.js` - 25 tests
- `test-Filters.js` - 11 tests
- `test-CircularArray.js` - 11 tests
- `test-CircularCounter.js` - 2 tests

**Total**: 116 tests must pass (0 failures)

**Validation**: `npm test` (requires Node 18)

### Integration Tests

**Scope**: Manual verification that core functionality still works

Since this project has no automated E2E tests, manual browser testing is required:

1. **Server Starts**: `node server.js` successfully starts Express server
2. **Build Works**: `./build_dev.sh` completes without errors
3. **Frontend Loads**: Open http://localhost:5000 and verify wheel page loads
4. **Wheel Functions**: Verify wheel spins and selects random entries
5. **Save/Load**: Verify wheel save and load dialogs work
6. **Share**: Verify share wheel creates XXX-XXX link

### Edge Cases

**Scope**: Verify no hidden dependencies on deleted files

1. **No Dynamic Imports**: Search for dynamic `require()` or `import()` that might load functions/ or ml/ at runtime
2. **No Config References**: Verify firebase.json was not imported or read by any code
3. **No Script Dependencies**: Verify package.json scripts don't reference deleted deploy scripts
4. **No Build Dependencies**: Verify webpack doesn't reference firebase.json or firestore.rules

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Git Status Check

**Verify deletions registered:**
```bash
git status --short
```
**Expected**: All deleted files show "D" prefix, all updated files show "M" prefix

**Count deleted files:**
```bash
git status --short | grep "^D" | wc -l
```
**Expected**: ~70+ deleted files

### Level 2: Build Validation

**Webpack build succeeds:**
```bash
nvm use 18 && ./build_dev.sh
```
**Expected**: Build completes with no errors, dist/ directory populated

### Level 3: Unit Tests

**Full test suite passes:**
```bash
npm test
```
**Expected**: 116 tests passing, 0 failures

### Level 4: Runtime Validation

**Server starts successfully:**
```bash
PORT=3000 node server.js &
sleep 2
curl -s http://localhost:3000 > /dev/null && echo "SERVER OK" || echo "SERVER FAILED"
kill %1
```
**Expected**: "SERVER OK"

### Level 5: Documentation Validation

**No broken Firebase references:**
```bash
grep -r "firebase deploy\|cd functions\|Firebase Console" --include="*.md" . | grep -v ".agents/"
```
**Expected**: Empty result (no Firebase deployment references in active docs)

**README focuses on Express:**
```bash
grep -c "Express\|SQLite" README.md
```
**Expected**: Multiple matches (at least 5+)

### Level 6: Code Cleanup Validation

**No Firebase externals:**
```bash
grep "firebase" build/base.config.js
```
**Expected**: Empty result

**No Firebase comments:**
```bash
grep "firebase" static/Util.js
```
**Expected**: Empty result

**No .gitignore Firebase entries:**
```bash
grep "firebase" .gitignore
```
**Expected**: Empty result

---

## ACCEPTANCE CRITERIA

- [x] `functions/` directory deleted (60+ files removed)
- [x] `ml/` directory deleted (4 files removed)
- [x] Firebase config files deleted (firebase.json, firestore.rules, firestore.indexes.json)
- [x] Firebase deploy scripts deleted (deploy_*.sh - 4 scripts)
- [x] `.gitignore` updated to remove Firebase entries
- [x] `build/base.config.js` updated to remove `/firebase/` from externals
- [x] `static/Util.js` updated to remove Firebase SDK comment
- [x] `README.md` rewritten to focus on Express + SQLite setup
- [x] `CLAUDE.md` updated to remove legacy Firebase sections
- [x] `docs/PRD.md` updated to reflect current architecture
- [x] `package-lock.json` regenerated without Firebase packages
- [x] All validation commands pass with zero errors
- [x] Full test suite still passes (116 tests, 0 failures)
- [x] Webpack build still succeeds
- [x] Express server still starts successfully
- [x] No broken documentation links
- [x] Git status shows ~70+ deleted files
- [x] No Firebase references in active documentation (except historical notes)
- [x] Code follows project conventions (Git history preserved via git rm)

---

## COMPLETION CHECKLIST

- [ ] All 26 tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes (116 tests, 0 failures)
- [ ] Build completes with no errors
- [ ] Server starts and responds to requests
- [ ] Documentation updated and accurate
- [ ] No broken references to deleted files
- [ ] Git history preserved (used git rm, not rm)
- [ ] package-lock.json regenerated
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and completeness

---

## NOTES

### Design Decisions

**Why delete instead of keeping for reference?**
- Implementation report confirms files are "dormant" and not used
- Files create confusion about active backend (documented as "high priority" issue in CLAUDE.md)
- Historical architecture fully documented in `.agents/implementation-reports/`
- Git history preserves all deleted code if needed for reference

**Why rewrite README instead of minor edits?**
- 51 Firebase references make selective editing impractical
- Current README is 440 lines, mostly Firebase setup instructions
- New developers need Express + SQLite setup, not Firebase setup
- Firebase architecture preserved in implementation report for historical context

**Why regenerate package-lock.json?**
- Contains historical Firebase package references even though packages removed from package.json
- Clean lockfile improves clarity and slightly reduces npm install time
- No risk since packages already removed from package.json

### Trade-offs

**What we're giving up:**
- Direct access to original Firebase Cloud Functions code (preserved in Git history and implementation report)
- Firebase deployment scripts (no longer applicable to Express backend)

**What we're gaining:**
- Clear, focused codebase without deprecated systems
- Accurate documentation for current architecture
- Reduced cognitive load for new developers
- Faster onboarding (no need to understand two backend systems)

### Migration Safety

This cleanup is safe because:
1. Express backend fully functional with 116 passing tests
2. No runtime dependencies on functions/ or ml/ (verified in Tasks 2-3)
3. Firebase files documented as "dormant" in implementation report
4. Git history preserves all deleted code
5. Implementation report documents original architecture

### Historical Preservation

Firebase architecture fully documented in:
- `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` - Full migration details
- `.agents/plans/features/replace-firebase-with-express-sqlite.md` - Original Firebase system documentation
- Git history - All deleted code preserved in commits
- Updated docs (README, PRD) include "Historical Note" sections pointing to implementation report
