# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wheel Spinner — an interactive spinning Wheel of Names web app. Vue.js 2 frontend with Firebase/GCP backend. Apache 2.0 licensed, Google-sponsored open source project.

## Build & Development Commands

**Local development:**
```bash
./build_and_serve_local.sh   # Build dev + serve via Firebase emulator
./build_dev.sh               # Build only (webpack dev config, output to dist/)
```

**Test/Production builds:**
```bash
./build_test.sh              # Build with test config
./build_prod.sh              # Build with production config
```

**Run tests:**
```bash
npm test                     # Mocha tests with Babel (test/*.js)
```

**Cloud Functions linting:**
```bash
cd functions && npm run lint  # ESLint for Cloud Functions
```

**Deploy:**
```bash
./deploy_test.sh             # firebase deploy --project=test
./deploy_prod.sh             # firebase deploy --project=prod
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
- `userStore.js` — authentication state
- `preferencesStore.js` — user preferences
- `hardwareStore.js` — device capabilities

### Firebase Integration
- `static/Firebase.js` — Firebase init and auth
- `static/Firestore.js` — Firestore CRUD operations
- `static/ServerFunctions.js` — HTTP calls to Cloud Functions

### Backend (`/functions/`)
- Firebase Cloud Functions (Node.js) in `functions/index.js`
- Key services: `SharedWheelService.js` (wheel CRUD/sharing), `AccountService.js` (user management), `TwitterService.js`
- Functions handle: wheel sharing (create/get/delete), content moderation, account lifecycle, cron cleanup jobs, translation, analytics (BigQuery), Firestore backups
- GCP services used: Firestore, BigQuery, Cloud Storage, Translate, AutoML

### Build System (`/build/`)
- Webpack 5 with Babel (targets IE11+)
- Configs: `base.config.js` (shared), `dev.config.js`, `test.config.js`, `prod.config.js`
- Environment variables loaded from `build/*.env` files via dotenv-webpack
- Three entry points: `polyfill`, `index`, `shared_wheel`
- Output to `dist/` with content-based hashing
- Workbox plugin generates service worker for PWA

### Firestore Data Model
- `shared-wheels` — published wheel configurations (indexed by readCount+created and uid+created)
- Account data isolated by UID/email
- Admin access controlled by `admins` collection checked in `firestore.rules`

### Localization
- Locale files in `static/locales/` (e.g., `en-US.json`)
- Setup in `static/i18n-setup.js`, language registry in `static/Locales.js`
- To add a language: copy `en-US.json`, translate, register in `Locales.js`

## Key Files

- `firebase.json` — hosting config, rewrites, cache headers, Firestore rules reference
- `firestore.rules` — security rules (auth isolation, admin checks)
- `static/WheelConfig.js` — wheel configuration/validation model
- `static/Util.js` — shared utilities (text sanitization, array helpers)
