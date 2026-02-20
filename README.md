# Wheel Spinner

Wheel Spinner is an interactive spinning wheel web application for random selection.

![Wheel Spinner UI](docs/screenshot-main-ui.png)

## Features

- Interactive spinning wheel with cool animated effects
- Sound syncs up perfectly with visuals
- Customizable colors, images, sounds, and more
- Save and share wheels via short links
- Optional quick removal after spin to prevent repeat winners
- Dark mode support
- 6 language locales


## Architecture

See `CLAUDE.md` for detailed architecture and development guidelines.

- **Frontend**: Vue.js 2 SPA with canvas-based wheel rendering
- **Backend**: Express API + SQLite database
- **Database**: backend/data/wheelspinner.db (auto-created on first run)


## Quick Start: Local development

1. Clone the repo
2. Install Node 18: `nvm install 18 && nvm use 18`
3. Run `npm install`
4. Run `npm run start:dev`
5. Open http://localhost:3000 (or `PORT=3001 node backend/server.js` if 3000 conflicts)


## Quick Start: Docker 🐳 (Recommended)

No Node.js installation required.

```bash
make build      # Build image from Dockerfile
make run        # Start container at http://localhost:3000
```

**Other commands:**
```bash
make stop       # Stop and remove container
make logs       # Tail container logs
make shell      # Open shell in running container
make clean      # Stop container and delete data volume
make help       # Show all available commands
```

**Override default wheel entries at runtime (no rebuild needed):**
```bash
make run WHEEL_DEFAULT_ENTRIES='["Alice","Bob","Carol"]'
```


## Development commands

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


## Historical note

This project was originally built with Firebase/GCP backend for the wheelofnames.com
deployment. The codebase has been migrated to Express + SQLite for local self-hosting.
See `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` for
migration details and original Firebase architecture. You can find the original project 
at https://github.com/momander/wheel-spinner.


## License

Apache 2.0 - Originally a Google-sponsored open source project.

**This is not an officially supported Google product.**

