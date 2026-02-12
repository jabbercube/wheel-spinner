# README

**This is not an officially supported Google product.**

Wheel Spinner is an interactive spinning wheel web application for random selection.

## Quick Start: Local Development

1. Clone the repo
2. Install Node 18: `nvm install 18 && nvm use 18`
3. Run `npm install`
4. Run `npm run start:dev`
5. Open http://localhost:3000 (or `PORT=3001 node backend/server.js` if 3000 conflicts)


## Quick Start: Docker (Recommended)

No node.js installation required. Develop and run the app entirely in containers.

**Development (with live reload):**
```bash
make dev        # or: docker-compose --profile dev up
```
- Source code mounted as volume for live editing
- Database persisted in Docker volume
- Access at http://localhost:3000

**Production:**
```bash
make prod       # or: docker-compose --profile prod up -d
```
- Optimized production build
- Runs as non-root user
- Database persisted in Docker volume

**Run tests in container:**
```bash
make test-run   # or: docker-compose --profile test run --rm wheel-spinner-test npm test
```

**Other useful commands:**
```bash
make shell      # Open shell in dev container
make logs       # View container logs
make down       # Stop all containers
make clean      # Stop and remove volumes
make help       # Show all available commands
```


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
migration details and original Firebase architecture. You can find the original project 
at https://github.com/momander/wheel-spinner.


## License

Apache 2.0 - Originally a Google-sponsored open source project.
