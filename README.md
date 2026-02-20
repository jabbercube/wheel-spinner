# Wheel Spinner

Wheel Spinner is a fun interactive spinning wheel web application for random selection.

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


## Quick Start

See [docs/quickstart.md](docs/quickstart.md) for local development and Docker instructions.

See [docs/docker.md](docs/docker.md) for the full Docker guide including configuration and data persistence.

To deploy this app in production see [docker-compose.yml](docker-compose.yml).


## Historical note

This project was originally built using Firebase/GCP backend for [wheelofnames](https://wheelofnames.com). 
Find the original forked project at [github.com/momander/wheel-spinner](https://github.com/momander/wheel-spinner).

This forked version has been migrated to Express + SQLite to support local self-hosting.
See `.agents/implementation-reports/replace-firebase-with-express-sqlite.md` for
migration details. 


## License

Apache 2.0 - Originally a Google-sponsored open source project.

**This is not an officially supported Google product.**

