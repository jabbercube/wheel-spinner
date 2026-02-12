# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wheel Spinner — an interactive spinning Wheel of Names web app. Vue.js 2 frontend with Express + SQLite backend for local development. Apache 2.0 licensed, originally a Google-sponsored open source project.

**Current State**: The project has been migrated from Firebase/GCP backend to Express + SQLite for local self-hosting. The original Firebase deployment served wheelofnames.com, but this codebase now runs entirely locally with no cloud dependencies.

**Production URL (original)**: wheelofnames.com (Firebase deployment)
**Local Development**: Express API server + SQLite database

## Environment Requirements

**Node Version**: 18+ (required for better-sqlite3 native module)

**Important**: The user's default Node version is v8.0.0 (too old). Always activate Node 18 before running any commands:
```bash
nvm use 18
```

**Shell Setup** (zsh):
```bash
# If nvm commands fail, source nvm first:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 18
```

**Webpack Build Requirements**:
- Webpack requires `NODE_OPTIONS=--openssl-legacy-provider` flag (Node 18 + OpenSSL 3.0 compatibility)
- This flag is already set in `npm run build:dev`
- The server (`node backend/server.js`) does NOT need this flag, only webpack builds

**Port Conflicts**:
- Default port: 5000
- macOS AirPlay Receiver may occupy port 5000
- Workaround: `PORT=3000 node backend/server.js`

## Build & Development Commands

**Setup:**
```bash
nvm use 18                   # Activate Node 18
npm install                  # Install frontend dependencies
```

**Local development:**
```bash
npm run start:dev            # Build dev + start Express server
npm run build:dev            # Build only (webpack dev config, output to dist/)
node backend/server.js       # Start server only (after build)
PORT=3000 node backend/server.js     # Use alternate port if 5000 conflicts
```

**Test/Production builds:**
```bash
npm run build:test              # Build with test config
npm run build:prod              # Build with production config
```

**Run tests:**
```bash
npm test                     # Mocha tests with Babel (test/*.js)
                            # Current status: 116 tests passing, 0 failures
```

## Architecture

### Frontend (`/static/`)
- **Vue.js 2** with **Vuex** store, **Vue Router**, **Buefy** (Bulma-based) UI components, **Vue i18n**
- Entry point: `static/index.js` → mounts Vue app to `#app`
- Main page: `static/pages/wheelPage.vue` — the interactive wheel UI
- Other pages lazy-loaded via router: FAQ, export, privacy policy, translations, admin (wheel review), carousel
- Router (`static/router.js`) handles language prefixes (`:lang`) and shared wheel paths (`:sharedWheelPath` in `XXX-XXX` format)
- Admin routes have a guard checking Firebase auth + admin status

### State Management (`/static/store/`)
- `wheelStore.js` — wheel configuration state (largest store)
- `userStore.js` — authentication state (now always logged in as "Local User" with uid='default')
- `preferencesStore.js` — user preferences
- `hardwareStore.js` — device capabilities

### API Layer (`/static/`)
- `static/Firebase.js` — **Thin API shim** (no actual Firebase, calls `/api/` endpoints)
- `static/ServerFunctions.js` — HTTP calls to Express API endpoints
- **Deleted files**: `FirebaseAuth.js`, `Firestore.js` (removed in migration)

### Backend (Current: Express + SQLite)
- **Server**: `backend/server.js` (Express 4.21.0) — 451 lines
  - Serves static files from `dist/`
  - REST API under `/api/*` prefix
  - CORS enabled
  - JSON body parser (2MB limit)
  - SPA fallback routing (xxx-xxx pattern → shared-wheel.html)
- **Database**: `backend/db.js` (better-sqlite3 11.0.0) — 63 lines
  - SQLite database at `backend/data/wheelspinner.db` (auto-created on first run)
  - WAL mode enabled
  - 5 tables: wheels, shared_wheels, settings, admins, carousels
- **Authentication**: Single default user (`uid: 'default'`), no auth middleware
- **API Endpoints**: 30+ endpoints for wheels, sharing, admin, settings, review queue

### Build System (`/build/`)
- Webpack 5 with Babel (targets IE11+)
- Configs: `base.config.js` (shared), `dev.config.js`, `test.config.js`, `prod.config.js`
- Environment variables loaded from `build/*.env` files via dotenv-webpack
- Three entry points: `polyfill`, `index`, `shared_wheel`
- Output to `dist/` with content-based hashing
- Workbox plugin generates service worker for PWA

### SQLite Database Schema
**Tables** (defined in `backend/db.js`):
- `wheels` — User-saved wheel configurations (uid, title, config JSON, timestamps, read_count)
- `shared_wheels` — Publicly shared wheels (path as XXX-XXX, uid, config JSON, copyable, review_status, timestamps, read_count)
- `settings` — Key-value config (e.g., DIRTY_WORDS list, EARNINGS_PER_REVIEW)
- `admins` — Admin users with review statistics (uid, name, total_reviews, session_reviews, last_review)
- `carousels` — Carousel configuration data (id, data JSON)

**Data Format**:
- Wheel configs stored as JSON strings
- Dates stored as ISO strings (e.g., "2026-02-11T12:34:56.789Z")
- Parsed by `firestoremilliseconds` filter in `static/filters.js`

### Localization
- Locale files in `static/locales/` (e.g., `en-US.json`)
- Setup in `static/i18n-setup.js`, language registry in `static/Locales.js`
- To add a language: copy `en-US.json`, translate, register in `Locales.js`

## Key Files

**Current Backend:**
- `backend/server.js` — Express API server (451 lines, 30+ endpoints)
- `backend/db.js` — SQLite database initialization and schema (63 lines)
- `backend/data/wheelspinner.db` — SQLite database file (auto-created, gitignored)

**Frontend Core:**
- `static/index.js` — Vue app entry point
- `static/WheelConfig.js` — Wheel configuration/validation model (~30 properties, backward compatibility)
- `static/Wheel.js` — Canvas rendering engine (700x700px)
- `static/Util.js` — Shared utilities (text sanitization, array helpers)
- `static/Firebase.js` — Thin API shim (calls `/api/` endpoints)
- `static/ServerFunctions.js` — HTTP wrapper for API calls

**Build & Config:**
- `package.json` — Dependencies and scripts
- `babel.config.js` — Babel preset for IE11+ support
- `build/base.config.js` — Shared Webpack config
- `build/dev.env` — Development environment variables (gitignored)

**Tests:**
- `test/test-WheelConfig.js` — 7 tests
- `test/test-Util.js` — 39 tests
- `test/test-Locales.js` — 25 tests
- `test/test-Filters.js` — 11 tests
- `test/test-CircularArray.js` — 11 tests
- `test/test-CircularCounter.js` — 2 tests
- **Total**: 116 tests, all passing

## Important Notes

### Testing
- **Run tests**: `npm test` (requires Node 18)
- **Test baseline**: All 116 tests should pass before making changes
- **Locale tests**: Only use registered locales from `static/Locales.js` (de, en-PI, en, fr, sv)
- **No E2E tests**: Browser integration testing is manual only

### Known Issues & Technical Debt

**High Priority:**
- ⚠️ **Vue 2 EOL**: Framework reached end-of-life Dec 31, 2023 (no security patches). Migration to Vue 3 should be planned.
- ⚠️ **No Automated E2E Tests**: All browser integration testing is manual. Risk of regressions during refactoring.

**Medium Priority:**
- Single default user (`uid: 'default'`) limits multi-user scenarios. Need authentication for production.
- Google Sheets and Twitter integrations disabled (require OAuth/API keys).
- IE11 support maintained (polyfills add bundle size for declining browser share).

**Low Priority:**
- Buefy 0.8 is Vue 2-only (migration blocker for Vue 3).
- Some dependencies on older versions.

### Disabled Features
- **Google Sheets import**: `logInToSheets()` throws "not available" error (requires OAuth)
- **Twitter integration**: `fetchSocialMediaUsers()` returns empty array (requires Twitter API keys)
- **Account delete/convert**: Stubbed as no-ops (no authentication in current version)

### Data Format Notes
- Dates stored as ISO strings in SQLite, not Firestore's `{_seconds: epoch}` format
- `firestoremilliseconds` filter in `static/filters.js` handles ISO date parsing
- Wheel configs stored as JSON strings in database
- Size limit: `isTooBigForDatabase()` checks <990KB for backward compatibility
