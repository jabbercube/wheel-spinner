# README

**This is not an officially supported Google product.**

Wheel Spinner - Interactive spinning wheel web application for random selection.

## Quick Start (Local Development)

1. Clone the repo
2. Install Node 18: `nvm install 18 && nvm use 18`
3. Run `npm install`
4. Run `npm run start:dev`
5. Open http://localhost:3000 (or `PORT=3001 node backend/server.js` if 3000 conflicts)

## Development Commands

**Build:**
- `npm run build:dev` - Development build
- `npm run build:test` - Test build
- `npm run build:prod` - Production build

**Run:**
- `npm run start` or `node backend/server.js` - Start Express server (after build)
- `npm run start:dev` - Build dev + start
- `PORT=3001 node backend/server.js` - Use alternate port

**Test:**
- `npm test` - Run test suite (116 tests)

## Architecture

- **Frontend**: Vue.js 2 SPA with canvas-based wheel rendering
- **Backend**: Express API + SQLite database
- **Database**: backend/data/wheelspinner.db (auto-created on first run)

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
migration details and original Firebase architecture. See original project at
https://github.com/momander/wheel-spinner.

## License

Apache 2.0 - Originally a Google-sponsored open source project.
