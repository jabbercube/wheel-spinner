# Feature: Replace Firebase with Express + SQLite Backend

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

Remove all Firebase dependencies (Firebase Auth, Firestore, Firebase Cloud Functions, Firebase Hosting config, FirebaseUI) from the project. Replace the backend with a single Express.js `server.js` file using `better-sqlite3` as the database. For this first iteration, authentication is removed entirely — all users share one default profile that auto-loads. The Express server serves both the API and the static `dist/` files.

## User Story

As a developer/self-hoster
I want to run the Wheel Spinner with a simple Express + SQLite backend instead of Firebase
So that I can run the app locally or on any server without needing Google Cloud/Firebase accounts or infrastructure

## Problem Statement

The current app is deeply coupled to Firebase (Auth, Firestore, Cloud Functions, Hosting). This requires a Google Cloud account, Firebase project setup, and prevents simple self-hosting. The goal is a standalone server that can run with `node server.js`.

## Solution Statement

1. Create `server.js` — Express app that serves static files from `dist/` and provides REST API endpoints
2. Create `db.js` — better-sqlite3 database initialization and helper functions
3. Rewrite `static/ServerFunctions.js` to point to the local Express API (same origin, `/api/` prefix)
4. Rewrite `static/Firebase.js` to be a thin shim that auto-loads a default user (no auth)
5. Remove `static/FirebaseAuth.js` and `static/Firestore.js` (logic moves to server)
6. Simplify `static/store/userStore.js` to always return a default logged-in user
7. Simplify auth-related UI (save/open/share dialogs skip login step, account dialog simplified)
8. Remove `firebase`, `firebaseui`, and firebase-related packages from `package.json`
9. Add `express`, `better-sqlite3`, `cors` to `package.json`
10. Update webpack config to remove `FIREBASE_*` env vars (only need `FUNCTION_PREFIX` = `/api`)
11. Update `build_and_serve_local.sh` to run `node server.js` instead of firebase emulator

## Feature Metadata

**Feature Type**: Refactor
**Estimated Complexity**: High
**Primary Systems Affected**: Backend (new), Frontend data layer (Firebase.js, ServerFunctions.js, Firestore.js, FirebaseAuth.js), Vuex stores (userStore, wheelStore), Auth-related Vue components, Build config, Package dependencies
**Dependencies**: `express`, `better-sqlite3`, `cors`

---

## CONTEXT REFERENCES

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

**Frontend data layer (THE most important files — these get rewritten):**
- `static/Firebase.js` — Current Firebase facade; 248 lines. Wraps auth + Firestore. REWRITE to thin shim with default user.
- `static/FirebaseAuth.js` — Firebase auth helpers (52 lines). DELETE entirely.
- `static/Firestore.js` — All Firestore CRUD operations (228 lines). DELETE entirely — logic moves to server.
- `static/ServerFunctions.js` — HTTP client for Cloud Functions (196 lines). REWRITE to use `/api/` prefix, remove auth headers.

**Vuex stores (auth flow changes):**
- `static/store/userStore.js` — Auth state management (136 lines). REWRITE to always-logged-in default user.
- `static/store/wheelStore.js` — Wheel config state (352 lines). Imports ServerFunctions. Light changes to remove auth-dependent code.
- `static/store/preferencesStore.js` — Local storage only, NO Firebase deps. NO changes needed.
- `static/store/hardwareStore.js` — No Firebase deps. NO changes needed.

**Vue components with direct Firebase imports:**
- `static/router.js` (lines 26-27, 106-123) — Imports Firebase + ServerFunctions for admin guard. SIMPLIFY admin guard.
- `static/accountdialog.vue` — Login/account dialog. SIMPLIFY to show default user info only.
- `static/savedialog.vue` — Save wheel dialog with login flow. SIMPLIFY to skip login.
- `static/opendialog.vue` — Open wheel dialog with login flow. SIMPLIFY to skip login.
- `static/sharedialog.vue` — Share dialog with anonymous login. SIMPLIFY to skip login.
- `static/profiledropdown.vue` — User dropdown. SIMPLIFY to show default user.
- `static/pages/wheelReviewPage.vue` (lines 162-163) — Admin page. REWRITE Firebase calls to use API.
- `static/pages/carouselPage.vue` (lines 116-117) — Admin page. REWRITE Firebase calls to use API.
- `static/paymentsdialog.vue` (line 67) — Admin payments. REWRITE Firebase calls to use API.
- `static/usersdialog.vue` (line 73) — Admin users dialog. REWRITE Firebase calls to use API.
- `static/dirtywordsdialog.vue` (line 39) — Admin dirty words. REWRITE Firebase calls to use API.
- `static/appInfo.vue` (line 88) — Uses ServerFunctions.getCarousels. NO change needed (already uses ServerFunctions).
- `static/cards/statsCard.vue` (line 41) — Uses ServerFunctions.getSpinStats. NO change needed.
- `static/accountDump.vue` — Export page data dump. SIMPLIFY.

**Build config:**
- `build/base.config.js` — Webpack config. NO change (env vars still used via dotenv-webpack).
- `build/dev.config.js` — Dev build config. NO change.
- `build/dev.env` (not committed) — SIMPLIFY to only `FUNCTION_PREFIX=`

**Cloud Functions (reference for API design — do NOT modify these, we create new equivalents):**
- `functions/createSharedWheel3.js` — Create shared wheel logic with dirty word check
- `functions/getSharedWheel2.js` — Get shared wheel by path
- `functions/getSharedWheels.js` — List user's shared wheels
- `functions/deleteSharedWheel.js` — Delete shared wheel
- `functions/logSharedWheelRead.js` — Log shared wheel view
- `functions/getCarousels.js` — Get carousel data
- `functions/SharedWheelService.js` — Shared wheel read/update service
- `functions/Util.js` — Server utilities (getUidFromAuthHeader, getSetting)

**Other reference:**
- `static/WheelConfig.js` — Wheel config model. NO changes needed.
- `static/Util.js` — Client utilities. NO changes needed (except `browserCanHandlePersistance` becomes unused).
- `static/SheetPicker.js` — Uses `FIREBASE_API_KEY` and `OAUTH_CLIENT_ID` env vars for Google API. These features will be DISABLED (Google Sheets integration requires OAuth).
- `static/filters.js` — Has `firestoremilliseconds` filter for Firestore timestamps. UPDATE to handle ISO date strings instead.
- `firebase.json` — Firebase hosting config. Can be DELETED or kept for reference.
- `package.json` — Root package. UPDATE dependencies.
- `functions/package.json` — Functions package. NOT modified (functions dir can be kept or deleted later).

### New Files to Create

- `server.js` — Express API server + static file serving (project root)
- `db.js` — SQLite database initialization and schema (project root)

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Express.js API Reference](https://expressjs.com/en/4x/api.html)
  - Routing, middleware, static files
  - Why: Core framework for the new backend
- [better-sqlite3 API](https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md)
  - Synchronous API, prepared statements, transactions
  - Why: Database layer

### Patterns to Follow

**Naming Conventions:**
- Backend files in project root: `server.js`, `db.js` (CommonJS with `require`)
- Frontend files in `static/`: ES modules with `import/export`
- Existing code uses `camelCase` for variables/functions, `PascalCase` for classes/components

**API URL Pattern:**
- All API endpoints prefixed with `/api/`
- Frontend `FUNCTION_PREFIX` env var set to `/api` (or empty, with ServerFunctions updated to use `/api/` prefix)

**Error Handling:**
- Server: try/catch with `res.status(500).json({error: ...})` (matches existing Cloud Functions pattern)
- Client: existing `try/catch` with `Util.trackException(ex)` pattern

**Database Pattern:**
- better-sqlite3 is synchronous — use `db.prepare().run()` / `.get()` / `.all()`
- Store wheel configs as JSON text in a TEXT column
- Use ISO 8601 date strings instead of Firestore timestamps

---

## IMPLEMENTATION PLAN

### Phase 1: Backend Foundation
Create the Express server and SQLite database schema. This runs independently and can be tested with curl.

### Phase 2: Frontend Data Layer Rewrite
Rewrite `ServerFunctions.js` and `Firebase.js` to use the new API. Remove `FirebaseAuth.js` and `Firestore.js`.

### Phase 3: Store & Component Simplification
Simplify `userStore.js` to always-logged-in default user. Update all Vue components that reference Firebase auth flows.

### Phase 4: Build & Config Cleanup
Update package.json, webpack config, build scripts, and remove unnecessary Firebase files.

### Phase 5: Testing & Validation
Run tests, verify the app works end-to-end locally.

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

---

### Task 1: CREATE `db.js` — SQLite database initialization

Create `db.js` in the project root with better-sqlite3. Define the schema:

```js
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'wheelspinner.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS wheels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT NOT NULL DEFAULT 'default',
      title TEXT NOT NULL,
      config TEXT NOT NULL,
      created TEXT NOT NULL DEFAULT (datetime('now')),
      last_read TEXT,
      last_write TEXT NOT NULL DEFAULT (datetime('now')),
      read_count INTEGER NOT NULL DEFAULT 0,
      UNIQUE(uid, title)
    );

    CREATE TABLE IF NOT EXISTS shared_wheels (
      path TEXT PRIMARY KEY,
      uid TEXT DEFAULT 'default',
      config TEXT NOT NULL,
      copyable INTEGER NOT NULL DEFAULT 1,
      review_status TEXT DEFAULT 'Pending',
      created TEXT NOT NULL DEFAULT (datetime('now')),
      last_read TEXT,
      read_count INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admins (
      uid TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      total_reviews INTEGER NOT NULL DEFAULT 0,
      session_reviews INTEGER NOT NULL DEFAULT 0,
      last_review TEXT
    );

    CREATE TABLE IF NOT EXISTS carousels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL
    );
  `);
}

module.exports = { getDb };
```

**VALIDATE**: `node -e "require('./db.js').getDb(); console.log('DB OK')"`

---

### Task 2: CREATE `server.js` — Express API server

Create `server.js` in the project root. It should:
1. Serve static files from `dist/`
2. Provide all API endpoints under `/api/`
3. Handle SPA fallback (serve `index.html` for non-API, non-file routes)

The default user UID is `'default'`.

**API Endpoints to implement:**

```
# Wheel CRUD (saved wheels for the default user)
GET    /api/wheels                    → list saved wheels for default user
POST   /api/wheels                    → save/update a wheel
DELETE /api/wheels/:title             → delete a saved wheel

# Shared wheels
POST   /api/shared-wheels             → create a shared wheel (returns {path})
GET    /api/shared-wheels/:path       → get a shared wheel by path
GET    /api/shared-wheels             → list shared wheels for default user
DELETE /api/shared-wheels/:path       → delete a shared wheel
POST   /api/shared-wheel-reads        → log a shared wheel read

# Admin endpoints (no auth check in this iteration)
GET    /api/carousels                 → get carousels
POST   /api/carousels                 → save carousels
GET    /api/admins                    → get admin list
POST   /api/admins                    → add admin
DELETE /api/admins/:uid               → delete admin
GET    /api/settings/dirty-words      → get dirty words
POST   /api/settings/dirty-words      → set dirty words
GET    /api/settings/earnings-per-review → get earnings per review
GET    /api/spin-stats                → get spin stats (return hardcoded defaults)
GET    /api/review-queue/next         → get next shared wheel for review
GET    /api/review-queue/count        → get review queue count
POST   /api/review-queue/:path/approve → approve a shared wheel
POST   /api/review-queue/:path/delete  → delete/reject a shared wheel
POST   /api/admins/:uid/reset-reviews → reset admin's review count
POST   /api/admins/:uid/reset-session → reset admin's session reviews
GET    /api/user/is-admin             → always return true (no auth)
```

**Key implementation details:**

1. Random path generation for shared wheels: `xxx-xxx` format using `abcdefghjkmnpqrstuvwxyz23456789`
2. Dirty words check on shared wheel creation (query `settings` table for `DIRTY_WORDS` key)
3. Wheel configs stored as JSON strings in `config` TEXT columns
4. Parse JSON on read, stringify on write
5. Dates stored as ISO strings; convert to `{_seconds: epoch}` format in API responses where the frontend `firestoremilliseconds` filter expects it (OR update the filter — see Task 7)

**SPA fallback:**
After all API routes and static file middleware, add a catch-all that serves `dist/index.html` for any non-API GET request. Also serve `dist/shared-wheel.html` for paths matching the `XXX-XXX` shared wheel pattern.

**Server startup:**
```js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

**VALIDATE**: `node server.js &` then `curl http://localhost:5000/api/wheels` should return `{"wheels":[]}`

---

### Task 3: REWRITE `static/ServerFunctions.js` — Point to local API

Rewrite `ServerFunctions.js` to call the Express API instead of Firebase Cloud Functions.

**Key changes:**
- Remove `import '@babel/polyfill'` and `import 'whatwg-fetch'` (keep if needed for IE11, but likely can remove)
- Change all URLs from `process.env.FUNCTION_PREFIX + '/functionName'` to `/api/endpoint`
- Remove all `authorization` headers (no auth in this iteration)
- Remove `idToken` parameters from all functions
- Keep the same exported function signatures where possible (but without idToken params)

**Function mapping (old → new):**

| Old Function | Old URL | New URL | Changes |
|---|---|---|---|
| `createSharedWheel(copyable, wheelConfig, idToken)` | `FUNCTION_PREFIX/createSharedWheel3` | `/api/shared-wheels` | Remove idToken param/header |
| `logSharedWheelRead(path)` | `FUNCTION_PREFIX/logSharedWheelRead` | `/api/shared-wheel-reads` | No change needed |
| `getSharedWheel(path)` | `FUNCTION_PREFIX/getSharedWheel2/:path` | `/api/shared-wheels/:path` | No change needed |
| `getSharedWheels(idToken)` | `FUNCTION_PREFIX/getSharedWheels` | `/api/shared-wheels` | Remove idToken |
| `deleteSharedWheel(idToken, path)` | `FUNCTION_PREFIX/deleteSharedWheel` | `/api/shared-wheels/:path` (DELETE) | Remove idToken, use DELETE method |
| `fetchSocialMediaUsers(searchTerm)` | `FUNCTION_PREFIX/getTwitterUserNames2/:term` | REMOVE (Twitter API unavailable without backend keys) |
| `convertAccount(oldIdToken, newIdToken)` | `FUNCTION_PREFIX/convertAccount` | REMOVE (no auth) |
| `deleteAccount(idToken)` | `FUNCTION_PREFIX/deleteAccount` | REMOVE (no auth) |
| `getCarousels()` | `FUNCTION_PREFIX/getCarousels` | `/api/carousels` | No change |
| `getNumberOfWheelsInReviewQueue(idToken)` | `FUNCTION_PREFIX/getNumberOfWheelsInReviewQueue` | `/api/review-queue/count` | Remove idToken |
| `translate(idToken, entries)` | `FUNCTION_PREFIX/translate` | REMOVE (requires Cloud Translate API) |
| `userIsAdmin(idToken)` | `FUNCTION_PREFIX/userIsAdmin` | `/api/user/is-admin` | Always returns true |
| `getSpinStats()` | `FUNCTION_PREFIX/getSpinStats` | `/api/spin-stats` | No change |

**Functions to REMOVE** (not available without Firebase/GCP):
- `fetchSocialMediaUsers` — Twitter API requires backend keys
- `convertAccount` — no auth
- `deleteAccount` — no auth (could add back later)
- `translate` — requires Google Cloud Translate

**Functions to keep as stubs that return empty/default:**
- `fetchSocialMediaUsers` → return `[]`
- `convertAccount` → no-op
- `deleteAccount` → no-op

**VALIDATE**: After rewriting, `npm run build` (via `./build_dev.sh`) should succeed with no import errors.

---

### Task 4: REWRITE `static/Firebase.js` — Replace with thin API shim

Replace `Firebase.js` with a module that provides the same exported functions but calls the Express API instead of Firebase.

**Key approach:**
- `loadLibraries()` → no-op (return immediately)
- `userIsLoggedIn()` → always return `true`
- `getLoggedInUser()` → return `{ uid: 'default', displayName: 'Local User', photoURL: '/images/user_profile.png', isAnonymous: false, getIdToken: () => 'no-auth' }`
- `getUserIdToken()` → return `'no-auth'`
- `getUid()` → return `'default'`
- `getAnonymousTokenId()` → return `null`
- `loadAuthUserInterface()` → return the fake user immediately
- `logIn()` → return the fake user
- `logInAnonymously()` → return the fake user
- `logInToSheets()` → throw error "Google Sheets integration not available"
- `logOut()` → no-op
- `logUserActivity()` → no-op (or optionally call an API endpoint)

**Firestore-backed functions now call the Express API via fetch:**
- `getWheels()` → `fetch('/api/wheels')` → parse JSON → return sorted wheels
- `saveWheel(config)` → `fetch('/api/wheels', POST, {config})`
- `deleteSavedWheel(wheelTitle)` → `fetch('/api/wheels/${title}', DELETE)`
- `logWheelRead(wheelTitle)` → no-op or light API call
- `getDirtyWords()` → `fetch('/api/settings/dirty-words')`
- `setDirtyWords(words)` → `fetch('/api/settings/dirty-words', POST, {words})`
- `getAdmins()` → `fetch('/api/admins')`
- `getEarningsPerReview()` → `fetch('/api/settings/earnings-per-review')`
- `deleteAdmin(uid)` → `fetch('/api/admins/${uid}', DELETE)`
- `addAdmin(uid, name)` → `fetch('/api/admins', POST, {uid, name})`
- `saveCarousel(carousel)` → `fetch('/api/carousels', POST, {carousel})`
- `getDb()` → REMOVE (was Firestore reference, not needed)
- `approveSharedWheel(path)` → `fetch('/api/review-queue/${path}/approve', POST)`
- `deleteSharedWheel(path, incReviewCount)` → `fetch('/api/review-queue/${path}/delete', POST)`
- `resetSessionReviews(uid)` → `fetch('/api/admins/${uid}/reset-session', POST)`
- `getSharedWheel(path)` → `fetch('/api/shared-wheels/${path}')` → return full data object
- `getNextSharedWheelForReview()` → `fetch('/api/review-queue/next')`
- `setAdminsWheelsToZero(uid)` → `fetch('/api/admins/${uid}/reset-reviews', POST)`

**DELETE these files entirely:**
- `static/FirebaseAuth.js`
- `static/Firestore.js`

**IMPORTS**: Remove all imports of `FirebaseAuth`, `Firestore`, and `firebase` library. Remove `fg-loadcss` import (was for FirebaseUI CSS).

**VALIDATE**: `./build_dev.sh` succeeds without errors.

---

### Task 5: REWRITE `static/store/userStore.js` — Always-logged-in default user

Simplify the user store to always report as logged in with a default user.

**Key changes:**
- Remove import of `ServerFunctions` (no longer needed for account ops)
- Keep import of `Firebase` (which is now our thin shim)
- Set initial state with default user values:
  ```js
  state: {
    userPhotoUrl: '/images/user_profile.png',
    userDisplayName: 'Local User',
    savedWheels: [],
    sharedWheels: []
  }
  ```
- Actions:
  - `userIsLoggedIn` → always return `true` (call `Firebase.loadLibraries()` still for compatibility)
  - `logOut` → no-op (maybe clear wheels list)
  - `deleteAccount` → no-op
  - `loginAnonymously` → no-op
  - `loginWithUi` → no-op, resolve immediately
  - `logInToSheets` → throw "not available"
  - `logUserActivity` → no-op
  - `getUid` → return `'default'`
  - `loadSavedWheels` → call `Firebase.getWheels()` (which now calls API)
  - `logWheelRead` → call `Firebase.logWheelRead()`
  - `deleteSavedWheel` → call `Firebase.deleteSavedWheel()`
  - `saveWheel` → call `Firebase.saveWheel()`
  - `loadSharedWheels` → call API via ServerFunctions (no idToken)
  - `shareWheel` → call API via ServerFunctions (no idToken)
  - `deleteSharedWheel` → call API via ServerFunctions (no idToken)

**VALIDATE**: `./build_dev.sh` succeeds.

---

### Task 6: UPDATE `static/router.js` — Simplify admin guard

Remove Firebase auth check from the admin route guard.

**Changes:**
- Remove imports of `Firebase` and `ServerFunctions`
- Simplify `router.beforeEach`: for adminOnly routes, just call `next()` (all users are admin in this iteration)
- Or keep a simple check: `fetch('/api/user/is-admin')` which always returns true

**VALIDATE**: `./build_dev.sh` succeeds.

---

### Task 7: UPDATE `static/filters.js` — Handle ISO date strings

The `firestoremilliseconds` filter currently expects `{_seconds: N}` or `{seconds: N}` Firestore timestamp objects. Update to also handle ISO date strings.

**Changes:**
```js
export const firestoremilliseconds = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp._seconds) return timestamp._seconds * 1000;
  if (timestamp.seconds) return timestamp.seconds * 1000;
  // Handle ISO date strings from SQLite
  if (typeof timestamp === 'string') return new Date(timestamp).getTime();
  if (typeof timestamp === 'number') return timestamp;
  return null;
}
```

**VALIDATE**: Existing tests pass: `npm test`

---

### Task 8: UPDATE Vue component dialogs — Simplify auth flows

**`static/savedialog.vue`:**
- The `enter_loadingLibraries` method checks `userIsLoggedIn`. Since it always returns true now, the login dialog path (`enter_userIsPickingLoginMethod`) is never taken.
- Simplify: in `enter_loadingLibraries`, always go directly to `enter_loadingWheels()`.
- Remove the `displayLoginDialog` computed and the login modal template (first `<b-modal>`).
- Keep the save dialog modal as-is.

**`static/opendialog.vue`:**
- Same pattern: `enter_loadingLibraries` always goes to `enter_loadingWheels`.
- Remove login modal template.

**`static/sharedialog.vue`:**
- `enter_CreatingLink` calls `loginAnonymously` which is now a no-op. This is fine as-is.
- `enter_LoadingSharedWheels` calls `loginAnonymously` which is now a no-op. Fine as-is.
- No changes strictly needed — the login calls become no-ops.

**`static/accountdialog.vue`:**
- `enter_loadingLibraries` always finds user is logged in → goes to `enter_waitingForUserAccountAction`.
- Login modal never shown. Simplify: remove login modal template.
- Account actions dialog shows default user info. Keep as-is (it reads from store getters which now return defaults).
- Remove "Delete my account" button (no-op without real auth).
- Remove "Export my data" or keep it (it goes to export page which dumps wheels from store).

**`static/profiledropdown.vue`:**
- Shows user photo and name from store (which now return defaults). Works as-is.
- "Sign out" → logOut is now a no-op. Consider hiding or keeping (it's harmless).
- "Delete my account" → remove or disable.

**`static/accountDump.vue`:**
- `userIsLoggedIn` returns true. `getUid` returns 'default'. Works as-is.

**Admin pages** (`wheelReviewPage.vue`, `carouselPage.vue`, `paymentsdialog.vue`, `usersdialog.vue`, `dirtywordsdialog.vue`):
- These all call `Firebase.xxx()` which now calls our API. They should work with minimal changes.
- `wheelReviewPage.vue`: Replace `Firebase.getUid()` with hardcoded `'default'` or keep (it returns 'default' now).
- `carouselPage.vue`: `Firebase.loadLibraries()` is now a no-op. `ServerFunctions.getCarousels()` calls API. Works.
- All admin Firebase method calls now go through the rewritten `Firebase.js` shim. No direct changes needed.

**`static/SheetPicker.js` and `static/sheetdialog.vue`:**
- Google Sheets integration requires OAuth and Google API keys. This feature becomes unavailable.
- In the toolbar, the "Link Google Spreadsheet" menu item can be hidden or show a "not available" message.
- SheetPicker.js uses `process.env.FIREBASE_API_KEY` and `process.env.OAUTH_CLIENT_ID`. These env vars will be empty. The feature will naturally fail if attempted.
- Consider hiding the menu item by making `importVisible` return false, OR leave as-is and let it fail gracefully.

**`static/twitterdialog.vue`:**
- Twitter integration won't work without backend keys.
- `ServerFunctions.fetchSocialMediaUsers` will return `[]`.
- Leave as-is (harmless) or hide the toolbar menu item.

**VALIDATE**: `./build_dev.sh` succeeds. Start server, open browser, verify save/open/share dialogs work.

---

### Task 9: UPDATE `package.json` — Change dependencies

**ADD to `dependencies`:**
- `express` (latest 4.x)
- `better-sqlite3` (latest)
- `cors` (latest)

**REMOVE from `dependencies`:**
- `firebase`
- `firebaseui`

**ADD `scripts`:**
- `"start": "node server.js"`
- `"dev": "npm run build:dev && node server.js"` (or similar)

**Keep existing:**
- `"test": "mocha --require @babel/register"`

**VALIDATE**: `npm install` succeeds.

---

### Task 10: UPDATE `build/dev.env` — Simplify environment variables

Create/update `build/dev.env`:
```
FUNCTION_PREFIX=
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
OAUTH_CLIENT_ID=
GCP_APP_ID=
```

Set `FUNCTION_PREFIX=` to empty string (ServerFunctions.js will use relative `/api/` URLs).

Actually, better approach: just hard-code the `/api` prefix in the rewritten `ServerFunctions.js` and don't use `FUNCTION_PREFIX` at all. But keep the env vars defined (even if empty) so webpack doesn't error on `process.env.XXX` references in any remaining code.

**VALIDATE**: `./build_dev.sh` succeeds.

---

### Task 11: UPDATE build/serve scripts

**UPDATE `build_and_serve_local.sh`:**
Replace the Firebase emulator commands with:
```bash
#!/bin/bash
./build_dev.sh
node server.js
```

**VALIDATE**: `./build_and_serve_local.sh` starts the server and serves the app.

---

### Task 12: CLEANUP — Remove unnecessary Firebase files

**Files that can be DELETED:**
- `static/FirebaseAuth.js` (already done in Task 4)
- `static/Firestore.js` (already done in Task 4)

**Files to KEEP but are now dormant:**
- `functions/` directory — keep for reference, not used at runtime
- `firebase.json` — keep for reference
- `firestore.rules` — keep for reference
- `firestore.indexes.json` — keep for reference
- `.firebaserc` — keep for reference

**VALIDATE**: `./build_dev.sh && node server.js` — app runs correctly.

---

## TESTING STRATEGY

### Unit Tests

Existing Mocha tests (`npm test`) should continue to pass since they test:
- `test/test-WheelConfig.js` — WheelConfig model (no Firebase deps)
- `test/test-Util.js` — Utility functions (no Firebase deps)
- `test/test-Filters.js` — Filter functions (update if firestoremilliseconds filter changed)
- `test/test-Locales.js` — Locale functions (no Firebase deps)
- `test/test-CircularArray.js` — Data structure (no Firebase deps)
- `test/test-CircularCounter.js` — Data structure (no Firebase deps)

### Integration Tests

Manual testing of the full flow:
1. Start server: `node server.js`
2. Open `http://localhost:5000`
3. Verify wheel loads with default entries
4. Save a wheel → should persist to SQLite
5. Open saved wheel → should load from SQLite
6. Share a wheel → should create `xxx-xxx` link
7. Open shared wheel link → should load the shared wheel
8. Delete a shared wheel
9. Admin page loads at `/admin.html`

### Edge Cases

- Empty database (first run) — should work with defaults
- Saving a wheel with special characters in title
- Saving a very large wheel (near 990KB limit)
- Shared wheel path collision (random path already exists)
- Concurrent access to SQLite (better-sqlite3 handles this with WAL mode)

---

## VALIDATION COMMANDS

### Level 1: Syntax & Style

```bash
./build_dev.sh          # Webpack build must succeed
cd functions && npm run lint  # Functions lint (if functions dir kept)
```

### Level 2: Unit Tests

```bash
npm test                # All 6 test files must pass
```

### Level 3: Integration Tests

```bash
# Start server and verify API endpoints
node server.js &
sleep 2
curl -s http://localhost:5000/api/wheels | python3 -m json.tool
curl -s -X POST -H 'Content-Type: application/json' -d '{"config":{"title":"Test","entries":[{"text":"A"}]}}' http://localhost:5000/api/wheels
curl -s http://localhost:5000/api/wheels | python3 -m json.tool
curl -s http://localhost:5000/ | head -5  # Should return HTML
kill %1
```

### Level 4: Manual Validation

1. Run `./build_dev.sh && node server.js`
2. Open `http://localhost:5000` in browser
3. Verify the wheel renders and spins
4. Click Save → enter name → verify success snackbar
5. Click Open → verify saved wheel appears → open it
6. Click Share → continue → create link → verify `xxx-xxx` link generated
7. Open the shared link in a new tab → verify it loads
8. Navigate to `/admin.html` → verify page loads
9. Check dark mode toggle works
10. Check language selector works

---

## ACCEPTANCE CRITERIA

- [ ] `npm install` succeeds with no Firebase-related packages in `node_modules` (firebase, firebaseui removed)
- [ ] `./build_dev.sh` succeeds with zero errors
- [ ] `npm test` passes all existing tests
- [ ] `node server.js` starts and serves the app on port 5000
- [ ] Wheel renders and spins correctly in the browser
- [ ] Save wheel creates a record in `wheelspinner.db`
- [ ] Open wheel lists and loads saved wheels from SQLite
- [ ] Share wheel generates a `xxx-xxx` link and stores in SQLite
- [ ] Shared wheel link loads the correct wheel config
- [ ] Delete shared wheel removes it from the database
- [ ] Admin page (`/admin.html`) loads without errors
- [ ] No Firebase SDK loaded in the browser (check Network tab)
- [ ] All API endpoints return proper JSON responses
- [ ] App works in offline mode after first load (service worker still works)

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (1-12)
- [ ] `db.js` creates schema on first run
- [ ] `server.js` handles all API routes
- [ ] `Firebase.js` rewritten as thin shim
- [ ] `FirebaseAuth.js` and `Firestore.js` deleted
- [ ] `ServerFunctions.js` rewritten for local API
- [ ] `userStore.js` simplified for default user
- [ ] `router.js` admin guard simplified
- [ ] `filters.js` handles ISO dates
- [ ] Vue dialogs simplified (login steps removed)
- [ ] `package.json` updated (firebase removed, express/sqlite added)
- [ ] Build scripts updated
- [ ] All validation commands pass
- [ ] Manual browser testing confirms feature works

---

## NOTES

### Design Decisions

1. **Single default user (`uid: 'default'`)**: All wheels saved under one user. This is intentional per requirements — "all users share the same user profile." This means if multiple people use the same server, they see each other's saved wheels. Fine for personal/small-team use.

2. **Keep `Firebase.js` as a shim instead of removing it**: Many components import from `Firebase.js`. Rather than updating 15+ import statements across the codebase, we keep the file but replace its internals. This minimizes the blast radius of changes.

3. **Keep `ServerFunctions.js` structure**: The file already uses `fetch()` to call HTTP endpoints. We just change the URLs and remove auth headers. Minimal change needed.

4. **Admin features preserved**: All admin pages (wheel review, carousel, dirty words, payments, users) are kept functional. They call `Firebase.js` methods which now hit the Express API. Since there's no auth, all users are effectively admins.

5. **Google Sheets and Twitter integration disabled**: These require external API keys and OAuth. They won't work in the simplified setup. The UI elements remain but will fail gracefully or return empty results.

6. **`functions/` directory kept**: Not deleted to avoid data loss. Can be removed in a future cleanup.

7. **better-sqlite3 WAL mode**: Enables concurrent reads during writes. Important since Express handles multiple requests.

8. **Date format**: SQLite stores dates as ISO strings. The `firestoremilliseconds` filter is updated to handle both Firestore timestamp objects (for any cached data) and ISO strings (from the new API).

### Risks

- **Google Sheets import broken**: Users who relied on this feature will lose it. Acceptable per requirements.
- **Twitter import broken**: Same as above.
- **Service worker caching**: The existing service worker may cache old Firebase-dependent code. Adding `skipWaiting: true` and `clientsClaim: true` (already configured in base.config.js) should handle this. Users may need to hard-refresh once.
- **Large wheel configs**: SQLite TEXT columns have no practical size limit, but very large wheels (near 990KB) should still work. The `isTooBigForDatabase()` check in WheelConfig.js still applies.

### Future Improvements

- Add real authentication (passport.js, sessions)
- Add per-user accounts
- Add Google Sheets integration via a local OAuth flow
- Migrate from better-sqlite3 to PostgreSQL for multi-server deployments
