# Product Requirements Document: Wheel of Names

## 1. Executive Summary

Wheel of Names is an interactive spinning wheel web application that enables users to make random selections from a customizable list of entries. Users add names (or any items) to a wheel, spin it, and a winner is randomly selected with engaging visual and audio feedback. The application serves as a name picker, raffle tool, classroom engagement tool, and decision-making aid.

The core value proposition is simplicity combined with deep customization: anyone can create and spin a wheel in seconds, while power users can customize colors, images, sounds, spin behavior, and sharing options. The product is free, open-source (Apache 2.0), and runs as a Progressive Web App with offline support.

This codebase has been migrated to Express + SQLite for local self-hosting. The original production deployment at wheelofnames.com used Firebase/GCP backend.

## 2. Mission

**Mission Statement:** Provide the simplest, most delightful random selection tool on the web — free for everyone, especially educators and event organizers.

**Core Principles:**
1. **Instant usability** — A first-time visitor can spin a wheel within seconds, no sign-up required
2. **Deep customization** — Colors, images, sounds, behavior, and appearance are all configurable
3. **Shareability** — Any wheel can be shared via a short link that works for anyone
4. **Privacy-first** — Minimal data collection, automatic cleanup of old data, GDPR-aware account deletion
5. **Accessibility** — Multi-language support, dark mode, mobile-responsive, PWA/offline capable

## 3. Target Users

### Primary Personas

**Teachers & Educators**
- Use the wheel for classroom engagement: random student selection, quiz games, group assignments
- Technical comfort: moderate; need zero-friction setup
- Key need: reliable, distraction-free, works on projectors and classroom displays

**Event Organizers & Streamers**
- Use the wheel for raffles, prize drawings, giveaways during livestreams or events
- Technical comfort: moderate to high
- Key need: shareable links, visual flair (confetti, animations), audience trust that the wheel is fair

**General Decision-Makers**
- Use the wheel casually: "where should we eat?", team activity selection, party games
- Technical comfort: any level
- Key need: fun, fast, no account required

### Technical Comfort Level
The application must work for users with zero technical knowledge. All features accessible through a visual GUI. No CLI, no config files, no technical jargon in the UI.

## 4. Current Feature Scope

### Core Functionality

- ✅ Canvas-based spinning wheel with click/tap/keyboard (Ctrl+Enter) to spin
- ✅ Configurable entry list via text box (one entry per line)
- ✅ Advanced mode with per-entry weights, colors, images, enabled/disabled state
- ✅ Winner selection with dialog popup and customizable winner message
- ✅ Winner result tracking (Results tab)
- ✅ Auto-remove winner after spin (optional, 5-second delay)
- ✅ Hide/remove buttons on winner dialog
- ✅ Shuffle and sort entries
- ✅ Clear list functionality
- ✅ Default entries provided for first-time users (Ali, Beatriz, Charles, etc.)

### Customization

- ✅ 6-slot color palette with enable/disable per color
- ✅ Color themes (predefined palettes)
- ✅ Page background color
- ✅ Gallery images (pre-built) or custom image upload for wheel center
- ✅ Wheel background image (cover image)
- ✅ Center text overlay
- ✅ Hub size selection (S/M/L)
- ✅ Draw outlines toggle
- ✅ Custom title and description
- ✅ Vibrant color extraction from uploaded images

### Sound & Animation

- ✅ During-spin sounds: ticking, music (50+ options across genres: pop, rock, disco, 8-bit, etc.)
- ✅ After-spin sounds: applause, fanfare, bells, text-to-speech winner readout, 40+ effects
- ✅ Volume control for both during and after spin sounds
- ✅ Confetti launch on winner selection
- ✅ Winner animation (zoom/highlight effect)
- ✅ Click sound when winner is removed

### Spin Configuration

- ✅ Spin time: 1–60 seconds (slider)
- ✅ Slow spin mode
- ✅ Max names visible on wheel: 4–1000 (slider)
- ✅ Allow/disallow duplicate display
- ✅ Show/hide title during spin

### Persistence & Authentication

- ✅ Local storage persistence (no account needed)
- ✅ Firebase Authentication (Google, Facebook, Twitter sign-in)
- ✅ Anonymous-to-authenticated account conversion
- ✅ Save/open named wheels to user account (Firestore)
- ✅ Delete saved wheels
- ✅ Account deletion with data cleanup
- ✅ Data export

### Sharing

- ✅ Share wheels via unique `XXX-XXX` format short links
- ✅ Shared wheel view mode (read-only spin)
- ✅ Copyable shared wheels (allow recipients to clone)
- ✅ Shared wheel management (list, delete)
- ✅ Shared link respects current names, colors, and settings
- ✅ Content moderation review queue for shared wheels

### Integrations

- ✅ Google Sheets import — live-link a spreadsheet column to wheel entries (auto-sync, 1-hour sessions)
- ✅ Twitter user import — search hashtags/terms and import recent tweet authors
- ✅ Google Analytics support

### Platform & Accessibility

- ✅ Progressive Web App (PWA) with service worker and offline support
- ✅ Mobile-responsive layout (desktop 3-column, mobile single-column via vue-mq)
- ✅ Dark mode
- ✅ Internationalization: 6 locales (English, German, Spanish, French, Swedish, Pirate English)
- ✅ Fullscreen mode
- ✅ IE11+ browser support (via Babel polyfills)

### Administration

- ✅ Admin wheel review queue (content moderation)
- ✅ Admin carousel management
- ✅ Admin-only routes with Firebase auth guard
- ✅ Dirty words detection/filtering
- ✅ Spin statistics dashboard
- ✅ BigQuery analytics pipeline
- ✅ Firestore backup automation

### Data Lifecycle

- ✅ Cron: delete inactive user accounts (no login for 6 months)
- ✅ Cron: delete unused shared wheels (never accessed after 14 days)
- ✅ Cron: delete stale shared wheels (not accessed for 6 months)
- ✅ Cron: clean old items from review queue
- ✅ Wheel size limit: ~990KB max for database storage

## 5. User Stories

### Visitor (No Account)
1. **As a visitor**, I want to add names to the wheel and spin it immediately, so that I can pick a random winner without any setup.
   - *Example: A teacher opens the site, types 25 student names, clicks the wheel, and a random student is selected.*

2. **As a visitor**, I want to customize the wheel's appearance (colors, images, sounds), so that it matches my event's theme.
   - *Example: A streamer changes the color scheme to their brand colors and adds a custom center image before a giveaway.*

3. **As a visitor**, I want the wheel to remember my entries when I return, so that I don't have to re-enter them each time.
   - *Example: A teacher returns the next day and finds their class roster still loaded from local storage.*

4. **As a visitor**, I want to spin the wheel multiple times and track results, so that I can see which names have already been picked.
   - *Example: During a raffle, the organizer spins 5 times and the Results tab shows all 5 winners.*

### Authenticated User
5. **As an authenticated user**, I want to save multiple wheels to my account, so that I can switch between different name lists (e.g., different class periods).
   - *Example: A teacher saves "Period 1", "Period 2", and "Period 3" wheels and opens the right one each class.*

6. **As an authenticated user**, I want to share a wheel via a link, so that others can spin it or copy it.
   - *Example: An event organizer shares a raffle wheel link on social media; visitors can spin the wheel themselves.*

7. **As an authenticated user**, I want to import entries from a Google Sheet, so that I can manage a large list externally and have it sync automatically.
   - *Example: A HR manager links a spreadsheet of employee names; when new hires are added to the sheet, they appear on the wheel.*

### Admin
8. **As an admin**, I want to review shared wheels for inappropriate content, so that the platform remains safe for all users.
   - *Example: An admin sees a flagged wheel in the review queue, reviews its entries, and approves or rejects it.*

## 6. Core Architecture & Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (Client)               │
│  ┌───────────┐  ┌───────┐  ┌─────────────────┐  │
│  │  Vue.js 2 │  │ Vuex  │  │  Canvas Wheel   │  │
│  │ Components│  │ Store │  │  (Wheel.js)     │  │
│  └───────────┘  └───────┘  └─────────────────┘  │
│         │            │              │             │
│  ┌──────┴────────────┴──────────────┘             │
│  │         Vue Router (SPA)                       │
│  └────────────────────────────────────────────────│
└────────────────────┬────────────────────────────┘
                     │ HTTPS
┌────────────────────┴────────────────────────────┐
│              Firebase / GCP Backend              │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Firebase  │  │ Firestore │  │   Cloud      │  │
│  │   Auth    │  │  Database │  │  Functions   │  │
│  └──────────┘  └───────────┘  └──────────────┘  │
│  ┌──────────┐  ┌───────────┐  ┌──────────────┐  │
│  │ Firebase  │  │ BigQuery  │  │   Cloud      │  │
│  │ Hosting   │  │ Analytics │  │  Storage     │  │
│  └──────────┘  └───────────┘  └──────────────┘  │
└──────────────────────────────────────────────────┘
```

### Directory Structure

```
wheel-spinner/
├── static/                    # Frontend source
│   ├── index.js               # App entry point
│   ├── router.js              # Vue Router config
│   ├── WheelConfig.js         # Wheel configuration model
│   ├── Wheel.js               # Canvas rendering engine
│   ├── Ticker.js              # Animation frame ticker
│   ├── Util.js                # Shared utilities
│   ├── Firebase.js            # Firebase client init/auth
│   ├── Firestore.js           # Firestore CRUD operations
│   ├── ServerFunctions.js     # HTTP calls to Cloud Functions
│   ├── store/                 # Vuex stores
│   │   ├── store.js           # Root store
│   │   ├── wheelStore.js      # Wheel config state (largest)
│   │   ├── userStore.js       # Auth/user state
│   │   ├── preferencesStore.js # User prefs (dark mode, etc.)
│   │   └── hardwareStore.js   # Device capabilities
│   ├── pages/                 # Route-level page components
│   │   ├── wheelPage.vue      # Main wheel page
│   │   ├── faqPage.vue        # FAQ
│   │   ├── exportPage.vue     # Data export
│   │   ├── privacyPolicyPage.vue
│   │   ├── translationsPage.vue
│   │   ├── wheelReviewPage.vue # Admin: content moderation
│   │   ├── carouselPage.vue    # Admin: carousel
│   │   └── notFoundPage.vue
│   ├── locales/               # i18n translation files
│   │   ├── en-US.json
│   │   ├── de-DE.json
│   │   ├── es-ES.json
│   │   ├── fr-FR.json
│   │   ├── sv-SE.json
│   │   └── en-PI.json         # Pirate English
│   └── [60+ Vue components]   # UI components (dialogs, pickers, etc.)
├── backend/                   # Backend code
│   ├── server.js              # Express API server
│   ├── db.js                  # SQLite database initialization
│   └── wheelspinner.db        # SQLite database (auto-created)
├── build/                     # Webpack configs
│   ├── base.config.js         # Shared webpack config
│   ├── dev.config.js          # Development build
│   ├── test.config.js         # Test environment build
│   └── prod.config.js         # Production build
├── test/                      # Mocha unit tests
│   ├── test-WheelConfig.js
│   ├── test-Util.js
│   ├── test-Locales.js
│   ├── test-Filters.js
│   ├── test-CircularArray.js
│   └── test-CircularCounter.js
```

### Key Design Patterns

- **Component-based UI** — Vue.js single-file components (`.vue`) with template/script/style
- **Centralized state** — Vuex store with 4 modules (wheel, user, preferences, hardware)
- **Immutable state updates** — Wheel config cloned before mutation (`wheelConfig.clone()`)
- **Local-first persistence** — Wheel config saved to `localStorage` on every change
- **Lazy-loaded routes** — All pages except the main wheel page are code-split via dynamic `import()`
- **Canvas rendering** — Wheel drawn directly on `<canvas>` with `requestAnimationFrame` loop
- **REST API backend** — Express server with SQLite database for wheel storage and sharing

## 7. Features Detail

### Spinning Wheel Engine
- **Renderer:** Custom canvas-based wheel (`Wheel.js`) drawn at 700x700px, responsive via CSS `width:100%`
- **Animation:** `requestAnimationFrame` loop managed by `Ticker.js`
- **Interaction:** Click on canvas, tap on mobile, or Ctrl+Enter keyboard shortcut
- **Entry display:** Entries rendered as text on wheel sectors; `CircularType` library for curved text
- **Max visible:** Configurable 4–1000 entries visible on wheel face (overflow kept in entry pool)

### Wheel Configuration Model (`WheelConfig.js`)
Core configuration object with ~30 properties:
- `title`, `description` — metadata
- `entries[]` — array of `{text, image?, id?, weight?, color?, enabled?}` objects
- `colorSettings[]` — 6-slot color palette with `{color, enabled}`
- `type` — "color" or "image" mode
- `pictureType` — "none", "gallery", "uploaded", "text"
- Sound settings: `duringSpinSound`, `afterSpinSound` with volumes
- Behavior flags: `allowDuplicates`, `slowSpin`, `showTitle`, `animateWinner`, `launchConfetti`, `autoRemoveWinner`, `displayWinnerDialog`, `displayRemoveButton`, `displayHideButton`
- `spinTime` (1–60s), `maxNames` (4–1000), `hubSize` ("S"/"M"/"L")
- Backward compatibility: `convertOldData()` migrates legacy `names[]` format and boolean sound flags
- Size limit: `isTooBigForDatabase()` checks <990KB for database storage

### Sharing System
- **Create:** User creates shared wheel → API generates `XXX-XXX` path
- **View:** Anyone with the link sees a read-only spin view (no toolbar, limited UI)
- **Copy:** If wheel is marked copyable, visitors can clone it to their own workspace
- **Moderation:** Shared wheels enter a review queue; admins approve/reject via `wheelReviewPage`
- **Storage:** Shared wheels stored in SQLite database

### Options Dialog
Tabbed modal with 4 tabs:
1. **During spin** — Sound picker, allow duplicates, slow spin, show title, spin time slider, max names slider
2. **After spin** — Sound picker, animate winner, confetti, auto-remove, winner dialog config, remove/hide button visibility, winner message, click sound on remove
3. **Appearance** — Color theme selector, 6-color palette, background color, contours, hub size, center text
4. **Image** — Gallery/upload/remove for wheel center image, wheel background image, image size

## 8. Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Vue.js | 2.6.x | Reactive UI framework |
| Vuex | 3.5.x | State management |
| Vue Router | 3.5.x | Client-side routing |
| Buefy | 0.8.x | Bulma-based Vue component library |
| Vue i18n | 8.21.x | Internationalization |
| vue-mq | 1.0.x | Media query breakpoints (mobile/desktop) |
| Howler.js | 2.2.x | Audio playback |
| canvas-confetti | 1.2.x | Confetti animation |
| CircleType | 2.3.x | Curved text rendering |
| node-vibrant | 3.1.x | Color extraction from images |
| fg-loadcss | 3.1.x | Async CSS loading |
| whatwg-fetch | 3.4.x | Fetch polyfill |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Express | 4.21.0 | REST API server |
| better-sqlite3 | 11.0.0 | SQLite database driver |
| SQLite | 3.x | Local database for wheels, settings, admins |

### Build & Dev
| Technology | Version | Purpose |
|---|---|---|
| Webpack | 5.x | Module bundler |
| Babel | 7.x | JavaScript transpilation (IE11+ target) |
| Mocha | 8.x | Test runner |
| Workbox | 6.3.x | Service worker generation (PWA) |
| dotenv-webpack | 2.x | Environment variable injection |

### Entry Points
Webpack produces 3 entry bundles:
1. `polyfill` — `@babel/polyfill` + `whatwg-fetch` for legacy browser support
2. `index` — Main SPA application
3. `shared_wheel` — Standalone shared wheel viewer

## 9. Security & Configuration

### Authentication
- **Providers:** Google, Facebook, Twitter (configurable), Anonymous
- **Account conversion:** Anonymous accounts seamlessly upgrade to authenticated accounts, preserving data
- **Token-based:** Cloud Functions verify Firebase ID tokens for authenticated operations
- **Admin check:** `admins` Firestore collection; admin routes guarded client-side and server-side

### Firestore Security Rules
- Account data isolated by user: `request.auth.uid == uid` or `request.auth.token.email == email`
- Admin collections (`admins`, `settings`, `carousels`, `shared-wheels`, `shared-wheels-review-queue`, `shared-wheels-rejected`) restricted to admin users via `isAdminUser()` function
- Shared wheels are not directly readable by end users — accessed through Cloud Functions only

### Configuration Management
Environment variables managed via `build/*.env` files (not committed to repo):
- `FUNCTION_PREFIX` — Cloud Functions base URL
- `FIREBASE_API_KEY` — Firebase web API key
- `FIREBASE_AUTH_DOMAIN` — Firebase auth domain
- `FIREBASE_DATABASE_URL` — Firestore URL
- `FIREBASE_PROJECT_ID` — GCP project ID
- `OAUTH_CLIENT_ID` — Google OAuth client ID
- `GCP_APP_ID` — GCP project number

Three environment configs: `dev.env`, `test.env`, `prod.env`

### Content Security
- Shared wheel content moderation via review queue
- Dirty words detection and filtering
- Wheel size limit prevents abuse (990KB max)

## 10. API Specification

### Express REST API

All API endpoints are prefixed with `/api/` and served by the Express server on port 5000 (configurable).

#### Wheel Storage & Sharing
- `POST /api/shared-wheels` - Create a shared wheel
- `GET /api/shared-wheels/:path` - Retrieve a shared wheel by XXX-XXX path
- `GET /api/shared-wheels` - List user's shared wheels
- `DELETE /api/shared-wheels/:path` - Delete a shared wheel
- `POST /api/shared-wheels/:path/read` - Log a wheel view

#### Admin
- `GET /api/admin/wheels` - Get wheels in review queue
- `POST /api/admin/wheels/:path/approve` - Approve a shared wheel
- `POST /api/admin/wheels/:path/reject` - Reject a shared wheel

#### Settings
- `GET /api/settings/:key` - Get a setting value
- `POST /api/settings` - Update settings

### SQLite Database Schema

**Tables:**
- `wheels` - User-saved wheel configurations (uid, title, config JSON, timestamps, read_count)
- `shared_wheels` - Publicly shared wheels (path as XXX-XXX, uid, config JSON, copyable, review_status, timestamps, read_count)
- `settings` - Key-value config (e.g., DIRTY_WORDS list)
- `admins` - Admin users with review statistics
- `carousels` - Carousel configuration data

**Historical Note:** The original production deployment (wheelofnames.com) used Firebase/GCP backend with Cloud Functions and Firestore. See `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` for details on the original architecture and migration to Express + SQLite.

## 11. Success Criteria

### Current Product Success Indicators
- ✅ First-time visitor can spin a wheel in under 5 seconds
- ✅ Wheel works without authentication or account creation
- ✅ Shared links work for any recipient without sign-up
- ✅ Application works offline after first visit (PWA)
- ✅ Mobile and desktop responsive
- ✅ Supports 6 languages
- ✅ Content moderation pipeline for shared wheels
- ✅ Automatic data cleanup for privacy compliance
- ✅ Sub-second wheel rendering and smooth 60fps animation

### Quality Indicators
- ✅ Unit tests for core logic (WheelConfig, Util, Filters, Locales, CircularArray, CircularCounter)
- ✅ Backward compatibility for legacy wheel data formats
- ✅ Graceful degradation for IE11+
- ✅ Content-hashed bundles for cache busting
- ✅ Code-split routes for faster initial load

### User Experience Goals
- ✅ Zero-friction entry: no popups, no modals, no sign-up prompts on first visit
- ✅ Delightful feedback: confetti, sound effects, animations
- ✅ Trustworthy randomness: users can verify fairness (FAQ addresses "Can the wheel be rigged?")
- ✅ Cross-device consistency: same wheel accessible via account across devices

## 12. Implementation Phases (Historical + Current State)

### Phase 1: Core Product (Complete)
**Goal:** Functional spinning wheel with basic customization
- ✅ Canvas-based wheel renderer with spin physics
- ✅ Entry management (add, remove, shuffle, sort)
- ✅ Color customization (palette, themes)
- ✅ Sound effects (during and after spin)
- ✅ Winner dialog with remove/hide
- ✅ Local storage persistence

### Phase 2: Social & Persistence (Complete)
**Goal:** Enable saving, sharing, and social features
- ✅ Firebase authentication (Google, Facebook, Twitter)
- ✅ Save/open wheels to cloud account
- ✅ Share wheels via unique short links
- ✅ Twitter integration for user import
- ✅ Google Sheets live-linking

### Phase 3: Platform & Scale (Complete)
**Goal:** Production-hardened platform with moderation and analytics
- ✅ PWA with service worker
- ✅ Content moderation pipeline
- ✅ Admin tools (review queue, carousel, stats)
- ✅ BigQuery analytics
- ✅ Automated data lifecycle (cron cleanup)
- ✅ Multi-language support (6 locales)
- ✅ Dark mode
- ✅ Advanced mode (weighted entries, per-entry customization)

### Phase 4: Future Development (Planned)
**Goal:** Modernization and feature expansion — see Section 13

## 13. Future Considerations

### Technical Modernization
- **Vue 3 migration** — Upgrade from Vue 2 (EOL) to Vue 3 with Composition API, improving performance and maintainability
- **Build system upgrade** — Consider Vite for faster dev builds and HMR, replacing Webpack 5
- **TypeScript adoption** — Add type safety to the large component surface area
- **Drop IE11 support** — Remove polyfills and legacy transpilation targets
- **Component library migration** — Buefy is Vue 2-only; evaluate alternatives (PrimeVue, Naive UI, or headless libraries)

### Feature Enhancements
- **Team/organization accounts** — Shared wheel libraries for teams, school districts
- **Wheel templates gallery** — Browse and clone popular community-created wheels
- **Real-time collaborative editing** — Multiple users editing the same wheel simultaneously
- **Embeddable widget** — `<iframe>` embed code for blogs, websites, LMS platforms
- **API access** — Public REST API for programmatic wheel creation and spinning
- **Spin history & analytics** — Detailed spin logs, frequency charts, export to CSV
- **Custom sound upload** — Allow users to upload their own audio files
- **Wheel themes marketplace** — Visual theme packs (holiday, sports, corporate)

### Integration Opportunities
- **LMS integration** — Google Classroom, Canvas, Blackboard connectors
- **Slack/Discord bots** — Spin a wheel directly in chat
- **Google Workspace Add-on** — Embedded in Slides/Docs
- **Zapier/IFTTT** — Automation triggers on spin results

### Performance & Reliability
- **WebGL rendering** — GPU-accelerated wheel for smoother animation on low-end devices
- **Edge caching** — CDN-optimized shared wheel delivery
- **Automated testing expansion** — E2E tests (Cypress/Playwright), visual regression tests
- **Monitoring & alerting** — Error tracking (Sentry), uptime monitoring

## 14. Risks & Mitigations

### Risk 1: Vue 2 End of Life
**Risk:** Vue 2 reached EOL on December 31, 2023. No further security patches or bug fixes.
**Mitigation:** Plan Vue 3 migration as a priority. In the interim, the app has minimal security surface since it's primarily client-rendered with Firebase handling auth and data security.

### Risk 2: Content Moderation at Scale
**Risk:** Shared wheels could contain harmful, offensive, or illegal content. Manual review doesn't scale.
**Mitigation:** Current ML-based moderation (AutoML) + dirty word filtering + manual review queue. Consider expanding automated moderation and adding community reporting.

### Risk 3: Firebase Vendor Lock-in
**Risk:** Deep integration with Firebase Auth, Firestore, Cloud Functions, and Hosting creates switching costs.
**Mitigation:** Core wheel logic is framework-agnostic (canvas-based). Database access is abstracted through `Firestore.js` and `ServerFunctions.js`. Migration would require significant but bounded effort.

### Risk 4: Dependency Staleness
**Risk:** Several dependencies are on older major versions (Firebase SDK v7, Webpack 5, Buefy 0.8). Security vulnerabilities may emerge.
**Mitigation:** Regular `npm audit` runs. Pin major versions and update methodically. Firebase SDK v7→v9+ migration should be bundled with Vue 3 migration.

### Risk 5: Single Point of Failure on Firebase
**Risk:** Firebase outage would make save/share/auth unavailable for all users.
**Mitigation:** Local storage fallback ensures core spin functionality works offline. PWA caching keeps the app accessible. Only cloud features (save, share, auth) depend on Firebase availability.

## 15. Appendix

### Key Dependencies
- Repository: `github.com/momander/wheel-spinner`
- License: Apache 2.0
- Original production URL: wheelofnames.com (Firebase deployment)

### Build Commands Reference
| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run start:dev` | Dev build + start Express server |
| `npm run build:dev` | Development build (output to dist/) |
| `npm run build:test` | Test environment build |
| `npm run build:prod` | Production build |
| `npm test` | Run Mocha unit tests (116 tests) |
| `node backend/server.js` | Start Express server (port 5000) |
| `PORT=3000 node backend/server.js` | Start server on alternate port |

### Component Inventory (60+ Vue Components)
**Pages (8):** wheelPage, faqPage, exportPage, privacyPolicyPage, translationsPage, wheelReviewPage, carouselPage, notFoundPage

**Dialogs (10):** optionsdialog, opendialog, savedialog, sharedialog, sheetdialog, twitterdialog, accountdialog, winnerdialog, carouseldialog, titleAndDescriptionDialog, dirtywordsdialog, paymentsdialog, usersdialog

**Pickers & Editors (6):** colorThemeSelector, duringSpinSoundPicker, afterSpinSoundPicker, wheelCenterImagePicker, wheelBackgroundImagePicker, advancedSliceEditor

**UI Components (15+):** toolbar, simpletoolbar, spinningwheel, nameTabs, textbox, textboxbuttons, titleAndDescription, profiledropdown, muteToggle, tooltip, counterTag, heroNumber, wheelOverlayText, winneranimation, winnertextbox, appInfo, gaId, advancedSlice, accountDump, faqTabs

**FAQ/Info Cards (8):** aboutCards, howToUseCard, whatIsItForCard, canTheWheelBeRiggedCard, isMyDataPrivateCard, statsCard, sustainabilityCard, translatorsCard, addTranslationCard, fixTranslationCard, yearCounter

### Localization Coverage
| Locale | File | Language |
|---|---|---|
| en-US | `en-US.json` | English (US) |
| de-DE | `de-DE.json` | German (Germany) |
| es-ES | `es-ES.json` | Spanish (Spain) |
| fr-FR | `fr-FR.json` | French (France) |
| sv-SE | `sv-SE.json` | Swedish (Sweden) |
| en-PI | `en-PI.json` | Pirate English (Easter egg) |
