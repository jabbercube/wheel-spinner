# Product Requirements Document: Wheel Spinner

## 1. Executive Summary

Wheel Spinner is an interactive spinning wheel web application for random selection. Users add names or items to a customizable wheel, spin it, and a winner is randomly selected with engaging visual and audio feedback. It serves as a name picker, raffle tool, classroom engagement tool, and general decision-making aid.

The core value proposition is simplicity combined with deep customization: anyone can create and spin a wheel in seconds, while power users can customize colors, images, sounds, spin behavior, and sharing options. The product is free, open-source (Apache 2.0), and runs as a Progressive Web App.

This codebase has been migrated from Firebase/GCP to Express + SQLite for local self-hosting. The original production deployment served wheelofnames.com.

## 2. Mission

**Mission Statement:** Provide the simplest, most delightful random selection tool on the web — free for everyone, especially educators and event organizers.

**Core Principles:**
1. **Instant usability** — A first-time visitor can spin a wheel within seconds, no sign-up required
2. **Deep customization** — Colors, images, sounds, behavior, and appearance are all configurable
3. **Shareability** — Any wheel can be shared via a short link that works for anyone
4. **Privacy-first** — Minimal data collection, local-first storage, no cloud dependencies
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

### In Scope (Implemented)

#### Core Functionality
- Canvas-based spinning wheel with click/tap/keyboard (Ctrl+Enter) to spin
- Configurable entry list via text box (one entry per line)
- Advanced mode with per-entry weights, colors, images, enabled/disabled state
- Winner selection with dialog popup and customizable winner message
- Winner result tracking (Results tab)
- Auto-remove winner after spin (optional, with delay)
- Hide/remove buttons on winner dialog
- Shuffle and sort entries
- Default entries provided for first-time users (configurable via environment variable)
- Wheel size limit: ~990KB max for database storage

#### Customization
- 6-slot color palette with enable/disable per color
- Predefined color themes
- Page background color
- Gallery images or custom image upload for wheel center
- Wheel background/cover image
- Center text overlay
- Hub size selection (S/M/L)
- Draw outlines toggle
- Custom title and description

#### Sound & Animation
- During-spin sounds: ticking, music (28+ tracks from filmmusic.io)
- After-spin sounds: applause, fanfare, bells, text-to-speech winner readout
- Volume control for both during and after spin sounds
- Confetti launch on winner selection
- Winner animation (zoom/highlight effect)
- Click sound when winner is removed

#### Spin Configuration
- Spin time: 1-60 seconds
- Slow spin mode
- Max names visible on wheel: configurable
- Allow/disallow duplicate display
- Show/hide title during spin

#### Persistence
- Save/open named wheels to local database
- Single default user (no authentication required)
- Data stored in SQLite database

#### Sharing
- Share wheels via unique `XXX-XXX` format short links
- Shared wheel view mode (read-only spin)
- Copyable shared wheels (allow recipients to clone)
- Shared wheel management (list, delete)
- Content moderation via dirty words filter
- Review queue for shared wheels

#### Administration
- Admin wheel review queue (approve/delete shared wheels)
- Admin carousel management
- Dirty words list management
- Admin user management
- Spin statistics endpoint (stubbed)

#### Platform & Accessibility
- Progressive Web App with service worker and offline support
- Mobile-responsive layout (desktop/mobile breakpoint at 900px)
- Dark mode support
- Internationalization: 5 locales (English, German, French, Swedish, Pirate English)
- Locale file for Spanish exists but not registered
- Fullscreen mode
- IE11+ browser support (via Babel polyfills)
- Docker support (development, test, and production profiles)

### Out of Scope (Disabled/Removed)

#### Disabled Integrations
- **Google Sheets import** — `logInToSheets()` throws "not available" (requires OAuth)
- **Twitter user import** — `fetchSocialMediaUsers()` returns empty array (requires API keys)
- **Google Cloud Translate** — `translate()` returns empty strings (requires GCP)
- **Google Analytics** — Tracking calls are no-ops
- **BigQuery analytics** — Removed with Firebase migration

#### Not Implemented
- Multi-user authentication (Google, Facebook, Twitter sign-in removed)
- Anonymous-to-authenticated account conversion
- Account deletion with data cleanup (stubbed as no-op)
- Automated data lifecycle (cron jobs for cleanup)
- Firestore backup automation

## 5. User Stories

### Visitor (Primary Flow)
1. **As a visitor**, I want to add names to the wheel and spin it immediately, so that I can pick a random winner without any setup.
   - *Example: A teacher opens the site, types 25 student names, clicks the wheel, and a random student is selected.*

2. **As a visitor**, I want to customize the wheel's appearance (colors, images, sounds), so that it matches my event's theme.
   - *Example: A streamer changes the color scheme to their brand colors and adds a custom center image before a giveaway.*

3. **As a visitor**, I want the wheel to auto-remove winners after each spin, so that I can run a raffle without manual intervention.
   - *Example: During a prize drawing, each winner is removed automatically after 5 seconds, and the next spin proceeds with remaining entries.*

4. **As a visitor**, I want to spin the wheel multiple times and track results, so that I can see which names have already been picked.
   - *Example: During a raffle, the organizer spins 5 times and the Results tab shows all 5 winners in order.*

### Saved Wheels
5. **As a user**, I want to save multiple wheels with different names, so that I can switch between different name lists.
   - *Example: A teacher saves "Period 1", "Period 2", and "Period 3" wheels and opens the right one each class.*

6. **As a user**, I want to share a wheel via a link, so that others can spin it or copy it.
   - *Example: An event organizer shares a raffle wheel link; visitors can spin the wheel themselves.*

### Administration
7. **As an admin**, I want to review shared wheels for inappropriate content, so that the platform remains safe for all users.
   - *Example: An admin sees a pending wheel in the review queue, reviews its entries, and approves or deletes it.*

8. **As an admin**, I want to manage a list of dirty words, so that wheels with inappropriate content are automatically flagged.
   - *Example: An admin adds terms to the dirty words list; future shared wheels containing those terms are rejected with a 451 status.*

## 6. Core Architecture & Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                 Browser (Client)                 │
│  ┌───────────┐  ┌───────┐  ┌─────────────────┐  │
│  │  Vue.js 2 │  │ Vuex  │  │  Canvas Wheel   │  │
│  │ Components│  │ Store │  │  (Wheel.js)     │  │
│  └───────────┘  └───────┘  └─────────────────┘  │
│         │            │              │             │
│  ┌──────┴────────────┴──────────────┘             │
│  │         Vue Router (SPA)                       │
│  └────────────────────────────────────────────────│
└────────────────────┬────────────────────────────┘
                     │ HTTP /api/*
┌────────────────────┴────────────────────────────┐
│            Express + SQLite Backend              │
│  ┌──────────┐  ┌───────────┐                     │
│  │ Express  │  │  SQLite   │                     │
│  │  Server  │  │ (WAL mode)│                     │
│  └──────────┘  └───────────┘                     │
└──────────────────────────────────────────────────┘
```

### Directory Structure

```
wheel-spinner/
├── backend/              # Express API server
│   ├── server.js         # 30+ REST endpoints, SPA fallback
│   ├── db.js             # SQLite schema + connection (WAL mode)
│   └── data/             # SQLite DB file (gitignored)
├── static/               # Vue.js 2 SPA source
│   ├── index.js          # App entry point
│   ├── router.js         # History-mode routes with lang prefixes
│   ├── store/            # Vuex modules (wheel, user, preferences, hardware)
│   ├── pages/            # Route-level components (7 pages)
│   ├── locales/          # i18n JSON files
│   ├── Firebase.js       # API shim (calls /api/ endpoints)
│   ├── ServerFunctions.js # HTTP wrapper for API calls
│   ├── Wheel.js          # Canvas rendering engine
│   ├── WheelPainter.js   # Wheel drawing logic
│   └── WheelConfig.js    # Config model (~30 properties)
├── build/                # Webpack 5 configs (dev/test/prod)
├── test/                 # Mocha unit tests (6 files)
├── .github/workflows/    # CI pipeline
├── Dockerfile            # Multi-stage Docker build
└── docker-compose.yml    # Dev, test, prod profiles
```

### Key Design Patterns

- **API Shim Layer**: `Firebase.js` provides the same interface the Vue components expect, but routes calls to local `/api/` endpoints instead of Firebase. This preserved all frontend code during the migration.
- **Single-User Default**: All data operations use `uid: 'default'`. No authentication middleware.
- **JSON Config Storage**: Wheel configurations stored as JSON strings in SQLite. The `WheelConfig` class handles serialization, deserialization, and backward compatibility with old data formats.
- **SPA + Server Routing**: Express serves the built SPA from `dist/`, with special routing for shared wheel paths (`xxx-xxx` pattern) to `shared-wheel.html`.
- **Lazy-Loaded Routes**: Non-primary pages use webpack dynamic imports for code splitting.

## 7. Features Detail

### Spinning Wheel (Core)
- **Canvas rendering**: 700x700px canvas with `Wheel.js` + `WheelPainter.js`
- **Spin physics**: Configurable spin time (1-60s), slow spin mode option
- **Winner selection**: Random selection with dialog popup, confetti, animation
- **Entry management**: Text box input, one per line, or advanced mode with per-entry customization

### Wheel Configuration
- **30+ configurable properties** defined in `WheelConfig.js`
- **Backward compatibility**: `convertOldData()` handles legacy formats (e.g., `names[]` → `entries[]`, `playTicks` → `duringSpinSound`)
- **Environment overrides**: Default entries configurable via `WHEEL_DEFAULT_ENTRIES` env var

### Sharing System
- **Path format**: `XXX-XXX` using `[a-z0-9]{3}-[a-z0-9]{3}` (excludes ambiguous chars: i, l, o, 0, 1)
- **Uniqueness**: Generated paths checked against database for collisions
- **Content moderation**: Dirty words check on share creation (HTTP 451 on violation)
- **Review queue**: Shared wheels created with `Pending` status; admin approves or deletes

### Localization
- **5 active locales**: English, German, French, Swedish, Pirate English
- **1 inactive locale**: Spanish (file exists at `es-ES.json`, not registered in `Locales.js`)
- **Domain-based locale**: French domain detection (hostname containing "noms")
- **Path-based locale**: URL prefix routing (e.g., `/fr/`, `/de/`)

## 8. Technology Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Server | Express | 4.21.0 |
| Database | better-sqlite3 | 11.0.0 |
| CORS | cors | 2.8.5 |
| Runtime | Node.js | 18+ |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Vue.js | 2.6.12 |
| State | Vuex | 3.5.1 |
| Router | Vue Router | 3.5.2 |
| UI Library | Buefy (Bulma) | 0.8.20 |
| i18n | vue-i18n | 8.21.0 |
| Responsive | vue-mq | 1.0.1 |
| Audio | howler | 2.2.0 |
| Confetti | canvas-confetti | 1.2.0 |
| Circular text | circletype | 2.3.0 |
| Color extraction | node-vibrant | 3.1.5 |
| PWA | workbox-webpack-plugin | 6.3.0 |

### Build & Dev
| Component | Technology | Version |
|-----------|-----------|---------|
| Bundler | Webpack | 5.60.0 |
| Transpiler | Babel | 7.x (IE11+ target) |
| Linting | ESLint | 8.57.1 |
| Testing | Mocha | 8.1.3 |
| Coverage | nyc (Istanbul) | 17.1.0 |
| Container | Docker | Multi-stage |

## 9. Security & Configuration

### Authentication
- **Current**: No authentication. Single default user (`uid: 'default'`).
- **All users are admin**: `/api/user/is-admin` always returns `true`.
- **Shared wheel paths**: Unguessable 6-character codes provide security-by-obscurity for shared wheels.

### Configuration
- **Environment variables**: Loaded from `build/*.env` files via dotenv-webpack at build time
- **`WHEEL_DEFAULT_ENTRIES`**: Override default wheel entries (JSON array)
- **`PORT`**: Server port (default: 3000)
- **Database**: Auto-created at `backend/data/wheelspinner.db` on first run
- **Body size limit**: 2MB JSON payload limit on Express

### Content Safety
- **Dirty words filter**: Checked on shared wheel creation; returns HTTP 451 on violation
- **Admin review queue**: Shared wheels start as `Pending`, require admin approval
- **Word matching**: Case-insensitive, splits on punctuation/whitespace, exact word match

### Deployment
- **Local**: `npm run start:dev` (build + serve)
- **Docker**: Multi-stage Dockerfile with dev/test/prod profiles
- **Production Docker**: Runs as non-root user, production dependencies only
- **Database persistence**: Docker volume mount for SQLite file

## 10. API Specification

Base URL: `/api`

### Wheels (Saved)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wheels` | List all saved wheels for default user |
| POST | `/api/wheels` | Save/update a wheel (upsert by title) |
| DELETE | `/api/wheels/:title` | Delete a saved wheel by title |

### Shared Wheels
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shared-wheels` | List all shared wheels for default user |
| POST | `/api/shared-wheels` | Create a new shared wheel (returns path) |
| GET | `/api/shared-wheels/:path` | Get a shared wheel by path |
| DELETE | `/api/shared-wheels/:path` | Delete a shared wheel |
| POST | `/api/shared-wheel-reads` | Increment read count for a shared wheel |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admins` | List all admins |
| POST | `/api/admins` | Add/update an admin |
| DELETE | `/api/admins/:uid` | Delete an admin |
| POST | `/api/admins/:uid/reset-reviews` | Reset all review counts |
| POST | `/api/admins/:uid/reset-session` | Reset session review count |
| GET | `/api/user/is-admin` | Check if current user is admin (always true) |

### Review Queue
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/review-queue/next` | Get next wheel pending review |
| GET | `/api/review-queue/count` | Count of wheels pending review |
| POST | `/api/review-queue/:path/approve` | Approve a shared wheel |
| POST | `/api/review-queue/:path/delete` | Delete a shared wheel from review |

### Settings & Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings/dirty-words` | Get dirty words list |
| POST | `/api/settings/dirty-words` | Update dirty words list |
| GET | `/api/settings/earnings-per-review` | Get earnings per review setting |
| GET | `/api/carousels` | Get carousel data |
| POST | `/api/carousels` | Update carousel data |
| GET | `/api/spin-stats` | Get spin statistics (stubbed: returns zeros) |

## 11. Success Criteria

### Functional Requirements
- Wheel spins correctly and selects a random winner
- All 30+ wheel configuration properties persist and render correctly
- Saved wheels CRUD operations work reliably
- Shared wheel links resolve and display correctly
- Content moderation (dirty words) blocks inappropriate content
- PWA works offline after initial load
- All 116 unit tests pass

### Quality Indicators
- Express server starts and serves SPA without errors
- SQLite database auto-creates with correct schema
- API responses return correct JSON format
- Backward compatibility with old wheel config formats
- Mobile-responsive layout at 900px breakpoint

### User Experience Goals
- First spin within 5 seconds of page load
- Smooth wheel animation at consistent frame rate
- Audio syncs with visual spin
- Intuitive UI requiring no instructions

## 12. Implementation Phases

### Phase 1: Foundation (Completed)
**Goal:** Migrate from Firebase/GCP to Express + SQLite
- Express server with 30+ REST API endpoints
- SQLite database with 5-table schema
- Firebase.js API shim layer
- Docker support (dev/test/prod)
- GitHub Actions CI (lint, test, coverage, build)
- All 116 tests passing

### Phase 2: Stabilization (Current)
**Goal:** Harden the self-hosted deployment
- Documentation (CLAUDE.md, README, PRD)
- Resolve Vue 2 EOL risk assessment
- Spanish locale registration
- E2E test coverage assessment

### Phase 3: Enhancement (Future)
**Goal:** Add features for self-hosted use cases
- Multi-user authentication (optional)
- Data export/import tools
- Re-enable Google Sheets integration (optional, with API key config)
- Spin statistics tracking
- Automated data lifecycle (cleanup old shared wheels)

### Phase 4: Modernization (Future)
**Goal:** Migrate to modern framework
- Vue 2 → Vue 3 migration
- Buefy → alternative Vue 3 UI library
- Drop IE11 polyfills
- Modern build tooling (Vite)

## 13. Future Considerations

### Post-MVP Enhancements
- **Authentication**: Optional multi-user support with session-based or token-based auth
- **Real-time collaboration**: Multiple users viewing/spinning the same wheel
- **Spin history**: Persistent spin results with timestamps
- **Embeddable widget**: iframe/embed code for websites
- **API keys**: Enable Google Sheets and other integrations via user-provided credentials

### Integration Opportunities
- Google Sheets (re-enable with user-provided OAuth credentials)
- Slack/Discord webhooks for spin results
- REST API for programmatic wheel creation and spinning

### Advanced Features
- Weighted random with visual indication of weights
- Tournament/bracket mode (multiple elimination rounds)
- Team assignment mode (distribute entries into N groups)
- Custom spin physics (acceleration curves, bounce effects)

## 14. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Vue 2 EOL** (Dec 2023) — no security patches | High | Plan Vue 3 migration in Phase 4; minimize new Vue-specific features until then |
| **No E2E tests** — browser regressions undetectable | Medium | Add Playwright or Cypress E2E suite; prioritize critical paths (spin, save, share) |
| **Single-user only** — limits multi-user deployments | Medium | Design auth as optional middleware layer; keep default user as fallback |
| **SQLite scaling** — not suitable for high-concurrency | Low | WAL mode handles moderate concurrency; document PostgreSQL migration path for production scale |
| **Buefy 0.8 is Vue 2-only** — migration blocker | Medium | Evaluate PrimeVue, Vuetify 3, or Naive UI as replacements during Vue 3 migration |

## 15. Appendix

### Key Files Reference
| File | Purpose |
|------|---------|
| `backend/server.js` | Express server, 30+ API endpoints, SPA fallback |
| `backend/db.js` | SQLite schema, connection management |
| `static/index.js` | Vue app entry point |
| `static/router.js` | SPA route definitions with i18n support |
| `static/store/wheelStore.js` | Primary Vuex store for wheel state |
| `static/WheelConfig.js` | Wheel configuration model (30+ properties) |
| `static/Wheel.js` | Canvas rendering engine |
| `static/Firebase.js` | API shim (replaces Firebase SDK) |
| `static/ServerFunctions.js` | HTTP wrapper for API calls |
| `static/Locales.js` | Language registry (5 active locales) |

### Database Schema
5 tables: `wheels`, `shared_wheels`, `settings`, `admins`, `carousels` — defined in `backend/db.js`.

### Related Documents
- `CLAUDE.md` — Development guidelines and architecture details
- `.agents/plans/feature/replace-firebase-with-express-sqlite.md` — Migration plan
- `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` — Migration report
- `AGENTS_GUIDE.md` — Agent workflow and skills reference
