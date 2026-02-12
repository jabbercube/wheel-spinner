# Feature: Restructure Backend into Dedicated Folder

## Feature Description

Reorganize the project structure by moving all backend-related files (Express server, database module, SQLite database file) from the project root into a dedicated `backend/` directory. This refactoring improves project organization by clearly separating frontend (`static/`) and backend (`backend/`) code, making the codebase easier to navigate and maintain.

## User Story

As a developer working on the Wheel Spinner codebase
I want backend files organized in a dedicated `backend/` folder
So that I can easily distinguish frontend and backend code, and the project structure follows modern full-stack conventions

## Problem Statement

Currently, backend files (`server.js`, `db.js`, `wheelspinner.db`) are located at the project root alongside configuration files, build scripts, and documentation. This flat structure makes it harder to:
1. Quickly identify which files are backend-specific vs. project-level configuration
2. Apply backend-specific tooling or linting rules
3. Follow common full-stack project organization patterns
4. Scale the backend as it grows (adding routes/, middleware/, models/ subdirectories later)

## Solution Statement

Create a `backend/` directory at the project root and move all backend-specific files into it. Update all references in configuration files, scripts, and documentation to point to the new paths. The frontend code requires no changes since it communicates with the backend exclusively through relative HTTP endpoints (`/api/*`).

## Feature Metadata

**Feature Type**: Refactor
**Estimated Complexity**: Low
**Primary Systems Affected**: Build scripts, package.json scripts, documentation
**Dependencies**: None (pure refactoring, no new libraries)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `server.js` (all lines) - Why: Main Express server file to move, contains static file serving path that needs updating
- `db.js` (all lines) - Why: Database module to move, check if any paths need updating
- `package.json` (lines 52-59) - Why: Contains npm scripts that reference server.js and db.js paths
- `build_and_serve_local.sh` (line 17) - Why: Shell script that starts server, needs path update
- `.gitignore` (line 9) - Why: Contains wheelspinner.db* pattern that could be made more specific
- `static/ServerFunctions.js` (all lines) - Why: Frontend API wrapper, verify it uses relative paths (should not need changes)
- `static/Firebase.js` (all lines) - Why: Frontend API shim, verify it uses relative paths (should not need changes)

### New Files to Create

- None (this is a file move/refactor, no new files)

### New Directory to Create

- `backend/` - Directory to contain all backend-related files

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Express.js Serving Static Files](https://expressjs.com/en/starter/static-files.html)
  - Specific section: `express.static` path resolution
  - Why: Need to update path from `./dist` to `../dist` after moving server.js
- [Node.js path.join Documentation](https://nodejs.org/api/path.html#pathjoinpaths)
  - Specific section: `__dirname` usage and relative paths
  - Why: Understand how `__dirname` changes when files move directories

### Patterns to Follow

**Static File Serving Pattern** (from server.js:11):
```javascript
// Before (in root):
app.use(express.static(path.join(__dirname, 'dist')));

// After (in backend/):
app.use(express.static(path.join(__dirname, '../dist')));
```

**Database Path Pattern** (from db.js:4):
```javascript
// This pattern works in both locations:
const DB_PATH = path.join(__dirname, 'wheelspinner.db');
// Result: root/wheelspinner.db → backend/data/wheelspinner.db (automatic)
```

**NPM Script Pattern** (from package.json):
```json
// Before:
"start": "node server.js"

// After:
"start": "node backend/server.js"
```

**ESLint Target Pattern** (from package.json:58):
```json
// Before:
"lint": "eslint --ext .js,.vue static/ test/ server.js db.js"

// After:
"lint": "eslint --ext .js,.vue static/ test/ backend/"
```

---

## IMPLEMENTATION PLAN

### Phase 1: Preparation & Validation

Verify current state and ensure all tests pass before making changes.

**Tasks:**
- Run full test suite to establish baseline
- Verify server starts successfully
- Document current file locations

### Phase 2: Directory Creation & File Moves

Create the backend directory and move backend files atomically.

**Tasks:**
- Create `backend/` directory
- Move `server.js` to `backend/server.js`
- Move `db.js` to `backend/db.js`
- Move `wheelspinner.db` to `backend/data/wheelspinner.db` (if it exists)

### Phase 3: Code Updates

Update import paths and static file serving paths in moved files.

**Tasks:**
- Update `backend/server.js` to serve static files from `../dist`
- Verify `backend/db.js` requires no changes (relative path still valid)

### Phase 4: Configuration Updates

Update all build scripts, npm scripts, and configuration files to reference new paths.

**Tasks:**
- Update `package.json` scripts
- Update `build_and_serve_local.sh`
- Update `.gitignore` pattern (optional, recommended)

### Phase 5: Documentation Updates

Update all documentation files to reflect new directory structure.

**Tasks:**
- Update `CLAUDE.md` with new paths and directory structure
- Update `README.md` quick start commands
- Update `docs/PRD.md` architecture documentation

### Phase 6: Verification

Ensure everything still works after the refactoring.

**Tasks:**
- Run linting to catch any issues
- Run full test suite
- Start server and verify it serves the app correctly
- Test API endpoints manually

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE backend/ directory

- **IMPLEMENT**: Create new directory at project root: `backend/`
- **VALIDATE**: `test -d backend && echo "Directory exists" || echo "Directory missing"`

---

### MOVE server.js to backend/

- **IMPLEMENT**: Move `server.js` from root to `backend/server.js`
- **GOTCHA**: Git will track this as a move if using `git mv` (preserves history)
- **VALIDATE**: `test -f backend/server.js && ! test -f server.js && echo "MOVED" || echo "FAILED"`

---

### MOVE db.js to backend/

- **IMPLEMENT**: Move `db.js` from root to `backend/db.js`
- **GOTCHA**: Git will track this as a move if using `git mv` (preserves history)
- **VALIDATE**: `test -f backend/db.js && ! test -f db.js && echo "MOVED" || echo "FAILED"`

---

### MOVE wheelspinner.db to backend/ (if exists)

- **IMPLEMENT**: Move `wheelspinner.db` to `backend/data/wheelspinner.db` if it exists
- **GOTCHA**: File may not exist if server hasn't been run yet (this is OK)
- **VALIDATE**: `if [ -f wheelspinner.db ]; then mv wheelspinner.db backend/data/ && echo "MOVED"; else echo "SKIP - file doesn't exist"; fi`

---

### UPDATE backend/server.js - Fix static file path

- **IMPLEMENT**: Update line 11 in `backend/server.js`
- **PATTERN**: Change `path.join(__dirname, 'dist')` to `path.join(__dirname, '../dist')`
- **REASON**: Server is now one directory deeper, so dist/ is one level up
- **BEFORE**:
  ```javascript
  app.use(express.static(path.join(__dirname, 'dist')));
  ```
- **AFTER**:
  ```javascript
  app.use(express.static(path.join(__dirname, '../dist')));
  ```
- **VALIDATE**: `grep -n "path.join(__dirname, '../dist')" backend/server.js && echo "UPDATED" || echo "FAILED"`

---

### UPDATE backend/server.js - Verify db.js import

- **IMPLEMENT**: Verify line 4 still has correct relative import
- **PATTERN**: `require('./db.js')` should still work (both files in same directory)
- **EXPECTED**: `const { getDb } = require('./db.js');`
- **VALIDATE**: `grep "require('./db.js')" backend/server.js && echo "OK" || echo "NEEDS FIX"`

---

### UPDATE package.json - "start" script

- **IMPLEMENT**: Update line 52 in `package.json`
- **BEFORE**: `"start": "node server.js"`
- **AFTER**: `"start": "node backend/server.js"`
- **VALIDATE**: `grep '"start": "node backend/server.js"' package.json && echo "UPDATED" || echo "FAILED"`

---

### UPDATE package.json - "dev" script

- **IMPLEMENT**: Update line 53 in `package.json`
- **BEFORE**: `"dev": "npm run build:dev && node server.js"`
- **AFTER**: `"dev": "npm run build:dev && node backend/server.js"`
- **VALIDATE**: `grep '"dev": "npm run build:dev && node backend/server.js"' package.json && echo "UPDATED" || echo "FAILED"`

---

### UPDATE package.json - "lint" script

- **IMPLEMENT**: Update line 58 in `package.json`
- **BEFORE**: `"lint": "eslint --ext .js,.vue static/ test/ server.js db.js"`
- **AFTER**: `"lint": "eslint --ext .js,.vue static/ test/ backend/"`
- **REASON**: Lint entire backend/ directory instead of listing individual files
- **VALIDATE**: `grep '"lint": "eslint --ext .js,.vue static/ test/ backend/"' package.json && echo "UPDATED" || echo "FAILED"`

---

### UPDATE package.json - "lint:fix" script

- **IMPLEMENT**: Update line 59 in `package.json`
- **BEFORE**: `"lint:fix": "eslint --ext .js,.vue static/ test/ server.js db.js --fix"`
- **AFTER**: `"lint:fix": "eslint --ext .js,.vue static/ test/ backend/ --fix"`
- **VALIDATE**: `grep '"lint:fix": "eslint --ext .js,.vue static/ test/ backend/ --fix"' package.json && echo "UPDATED" || echo "FAILED"`

---

### UPDATE build_and_serve_local.sh

- **IMPLEMENT**: Update line 17 in `build_and_serve_local.sh`
- **BEFORE**: `node server.js`
- **AFTER**: `node backend/server.js`
- **VALIDATE**: `grep "node backend/server.js" build_and_serve_local.sh && echo "UPDATED" || echo "FAILED"`

---

### UPDATE .gitignore - Make wheelspinner.db pattern more specific (OPTIONAL)

- **IMPLEMENT**: Update line 9 in `.gitignore` (optional but recommended)
- **BEFORE**: `wheelspinner.db*`
- **AFTER**: `backend/data/wheelspinner.db*`
- **REASON**: More specific pattern prevents accidentally ignoring unrelated files
- **GOTCHA**: If you skip this, the old pattern will still work (matches any path)
- **VALIDATE**: `grep "backend/data/wheelspinner.db" .gitignore && echo "UPDATED" || echo "USING OLD PATTERN"`

---

### UPDATE CLAUDE.md - Directory structure section

- **IMPLEMENT**: Update lines 92-136 in `CLAUDE.md` to reflect new backend/ directory
- **PATTERN**: Update all references to `server.js`, `db.js`, and `wheelspinner.db` to include `backend/` prefix
- **KEY CHANGES**:
  - Line 92: "**Server**: `backend/server.js` (Express 4.21.0) — 451 lines"
  - Line 98: "- SQLite database at `backend/data/wheelspinner.db` (auto-created on first run)"
  - Line 134-136: Update "Key Files" section with backend/ paths
- **VALIDATE**: `grep "backend/server.js" CLAUDE.md | wc -l` (should have multiple matches)

---

### UPDATE CLAUDE.md - Command examples

- **IMPLEMENT**: Update all command examples in CLAUDE.md that reference `node server.js`
- **SECTIONS TO UPDATE**:
  - Line 34: "The server (`node backend/server.js`) does NOT need this flag"
  - Line 39: "`PORT=3000 node backend/server.js`"
  - Line 53: "node backend/server.js # Start server only (after build)"
  - Line 55: "PORT=3000 node backend/server.js # Use alternate port"
- **VALIDATE**: `grep "node backend/server.js" CLAUDE.md | wc -l` (should have 4+ matches)

---

### UPDATE README.md - Quick start commands

- **IMPLEMENT**: Update lines 13, 23, 25 in `README.md`
- **CHANGES**:
  - Line 13: Change to "`PORT=3000 node backend/server.js` if 5000 conflicts"
  - Line 23: "- `node backend/server.js` - Start Express server (after build)"
  - Line 25: "- `PORT=3000 node backend/server.js` - Use alternate port"
- **VALIDATE**: `grep "node backend/server.js" README.md | wc -l` (should be 3)

---

### UPDATE README.md - Architecture section

- **IMPLEMENT**: Update line 34 in `README.md`
- **BEFORE**: "- **Database**: wheelspinner.db (auto-created on first run)"
- **AFTER**: "- **Database**: backend/data/wheelspinner.db (auto-created on first run)"
- **VALIDATE**: `grep "backend/data/wheelspinner.db" README.md && echo "UPDATED" || echo "FAILED"`

---

### UPDATE docs/PRD.md - Directory structure diagram

- **IMPLEMENT**: Update lines 237-251 in `docs/PRD.md` directory structure
- **CHANGES**:
  ```diff
  wheel-spinner/
  +├── backend/                  # Backend code
  +│   ├── server.js             # Express API server
  +│   ├── db.js                 # SQLite database initialization
  +│   └── wheelspinner.db       # SQLite database (auto-created)
   ├── static/                   # Frontend source
  ```
- **VALIDATE**: `grep "backend/" docs/PRD.md && echo "UPDATED" || echo "FAILED"`

---

### UPDATE docs/PRD.md - Command reference table

- **IMPLEMENT**: Update lines 531-532 in `docs/PRD.md`
- **CHANGES**:
  - Line 531: `| node backend/server.js | Start Express server (port 5000) |`
  - Line 532: `| PORT=3000 node backend/server.js | Start server on alternate port |`
- **VALIDATE**: `grep "node backend/server.js" docs/PRD.md | wc -l` (should be 2)

---

### VERIFY - Run linting

- **IMPLEMENT**: Run ESLint to catch any syntax or import issues
- **VALIDATE**: `npm run lint`
- **EXPECTED**: No new errors (should pass cleanly)
- **GOTCHA**: Fix any linting errors before proceeding

---

### VERIFY - Run test suite

- **IMPLEMENT**: Run full Mocha test suite
- **VALIDATE**: `npm test`
- **EXPECTED**: All 116 tests passing (same as before refactoring)
- **GOTCHA**: Tests should not be affected (they don't import backend files)

---

### VERIFY - Start server and test basic functionality

- **IMPLEMENT**: Start server using new path and verify it works
- **VALIDATE**:
  ```bash
  # Start server in background
  node backend/server.js &
  SERVER_PID=$!
  sleep 2

  # Test API endpoint
  curl -s http://localhost:5000/api/wheels | grep -q "wheels" && echo "API OK" || echo "API FAILED"

  # Test static file serving
  curl -s http://localhost:5000/ | grep -q "<!DOCTYPE html>" && echo "STATIC OK" || echo "STATIC FAILED"

  # Cleanup
  kill $SERVER_PID
  ```
- **EXPECTED**: Both "API OK" and "STATIC OK" messages
- **GOTCHA**: Ensure port 5000 is not already in use

---

### VERIFY - Test npm scripts

- **IMPLEMENT**: Test that npm scripts work with new paths
- **VALIDATE**:
  ```bash
  # Test start script (kill after 2 seconds)
  timeout 2 npm start || echo "START SCRIPT OK"

  # Verify build_and_serve script works
  echo "Run: ./build_and_serve_local.sh (manual test)"
  ```
- **EXPECTED**: Server starts without errors
- **GOTCHA**: Use timeout or Ctrl+C to stop server

---

## TESTING STRATEGY

### Unit Tests

**Scope**: No unit test changes required (tests don't import backend files)

**Validation**:
- Run `npm test` - all 116 tests should pass
- No modifications to test files needed

### Integration Tests

**Scope**: Manual testing of server startup and API endpoints

**Required Tests**:
1. Server starts successfully using `node backend/server.js`
2. Server starts via npm script: `npm start`
3. API endpoints respond correctly (GET /api/wheels)
4. Static files are served correctly (GET /)
5. Build and serve script works: `./build_and_serve_local.sh`

### Edge Cases

1. **Missing wheelspinner.db**: Server should auto-create database on first run
2. **Port conflict**: `PORT=3000 node backend/server.js` should use alternate port
3. **Relative path resolution**: Frontend API calls to `/api/*` should still work

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: File Structure Validation

```bash
# Verify directory structure
test -d backend && echo "✓ backend/ directory exists" || echo "✗ MISSING"
test -f backend/server.js && echo "✓ backend/server.js exists" || echo "✗ MISSING"
test -f backend/db.js && echo "✓ backend/db.js exists" || echo "✗ MISSING"
test ! -f server.js && echo "✓ server.js removed from root" || echo "✗ STILL IN ROOT"
test ! -f db.js && echo "✓ db.js removed from root" || echo "✗ STILL IN ROOT"
```

### Level 2: Syntax & Style

```bash
# ESLint all code
npm run lint

# Expected: No errors (0 problems)
```

### Level 3: Unit Tests

```bash
# Run Mocha test suite
npm test

# Expected: 116 passing
```

### Level 4: Manual Validation

```bash
# Test 1: Start server with new path
node backend/server.js &
SERVER_PID=$!
sleep 2

# Test 2: Verify API responds
curl -s http://localhost:5000/api/wheels
# Expected: {"wheels":[]}

# Test 3: Verify static files served
curl -s http://localhost:5000/ | head -5
# Expected: HTML content

# Test 4: Verify dist path is correct
curl -s http://localhost:5000/index.html | grep -q "Wheel" && echo "✓ Static files OK"

# Cleanup
kill $SERVER_PID

# Test 5: NPM start script
npm start &
NPM_PID=$!
sleep 2
curl -s http://localhost:5000/api/wheels && echo "✓ NPM script works"
kill $NPM_PID

# Test 6: Build and serve script
echo "Manual test: Run ./build_and_serve_local.sh and verify app loads"
```

### Level 5: Additional Validation (Optional)

```bash
# Verify documentation accuracy
grep -c "node backend/server.js" CLAUDE.md
# Expected: 4+ matches

grep -c "node backend/server.js" README.md
# Expected: 3 matches

grep -c "backend/" docs/PRD.md
# Expected: Multiple matches

# Verify git tracks moves correctly (preserves history)
git log --follow backend/server.js | head -5
git log --follow backend/db.js | head -5
# Expected: Should show full commit history
```

---

## ACCEPTANCE CRITERIA

- [x] All backend files moved to `backend/` directory
- [x] Server starts successfully with `node backend/server.js`
- [x] All npm scripts work correctly (start, dev, lint, lint:fix)
- [x] Build scripts work correctly (build_and_serve_local.sh)
- [x] Static files served correctly from `dist/`
- [x] API endpoints respond correctly
- [x] All 116 unit tests pass
- [x] ESLint passes with zero errors
- [x] All configuration files updated
- [x] All documentation files updated (CLAUDE.md, README.md, docs/PRD.md)
- [x] `.gitignore` pattern updated (optional but recommended)
- [x] Git history preserved for moved files (if using `git mv`)
- [x] No regressions in existing functionality

---

## COMPLETION CHECKLIST

- [ ] backend/ directory created
- [ ] server.js moved to backend/
- [ ] db.js moved to backend/
- [ ] wheelspinner.db moved to backend/ (if exists)
- [ ] backend/server.js static path updated to ../dist
- [ ] package.json scripts updated (4 scripts)
- [ ] build_and_serve_local.sh updated
- [ ] .gitignore pattern updated (optional)
- [ ] CLAUDE.md updated (directory structure + commands)
- [ ] README.md updated (quick start + architecture)
- [ ] docs/PRD.md updated (directory diagram + commands)
- [ ] ESLint passes
- [ ] All unit tests pass
- [ ] Server starts and serves API correctly
- [ ] Server starts and serves static files correctly
- [ ] npm start works
- [ ] build_and_serve_local.sh works
- [ ] No old files left in root (server.js, db.js removed)

---

## NOTES

### Design Decisions

1. **Directory naming**: Chose `backend/` over `server/` or `api/` for clarity and to mirror the `static/` naming convention (frontend source = `static/`, backend source = `backend/`)

2. **Static file path**: Changed from `'dist'` to `'../dist'` because Express's `express.static()` resolves paths relative to `__dirname` (the directory containing the script)

3. **Database path**: No change needed to `db.js` because `path.join(__dirname, 'data', 'wheelspinner.db')` automatically resolves to `backend/data/wheelspinner.db` after the move

4. **ESLint targets**: Changed from listing individual files (`server.js db.js`) to directory (`backend/`) for easier maintenance as backend grows

5. **Git history preservation**: Using `git mv` instead of move+add preserves file history for better code archaeology

### Trade-offs

**Pros**:
- ✅ Clearer project structure (separation of concerns)
- ✅ Easier to add backend subdirectories later (routes/, middleware/, models/)
- ✅ Follows modern full-stack conventions
- ✅ Minimal changes required (low risk refactoring)

**Cons**:
- ❌ Slightly longer paths in commands (`node backend/server.js` vs `node server.js`)
- ❌ One-time update effort for documentation

### Future Extensibility

With `backend/` directory in place, future enhancements could include:
- `backend/routes/` - Express route handlers
- `backend/middleware/` - Custom middleware
- `backend/models/` - Data models and business logic
- `backend/utils/` - Backend-specific utilities
- `backend/config/` - Backend configuration files
- `backend/package.json` - Separate backend dependencies (if moving to monorepo)

### Implementation Time Estimate

- **File moves**: 2 minutes
- **Code updates**: 5 minutes
- **Config updates**: 5 minutes
- **Documentation updates**: 10 minutes
- **Testing & validation**: 10 minutes
- **Total**: ~30 minutes

### Risk Assessment

**Low Risk Refactoring**: This is a straightforward file move with clear dependencies. No logic changes, no external library updates, no database migrations. The main risks are:
1. Missing a reference in documentation (low impact - docs only)
2. Incorrect relative path in `express.static()` (caught immediately on server start)
3. Forgetting to update a script (caught by validation commands)

All risks are easily caught and fixed during the validation phase.
