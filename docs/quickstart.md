# Quick Start

## Docker (Recommended)

No Node.js installation required.

```bash
make build      # Build image from Dockerfile
make run        # Start container at http://localhost:3000
```

See [docker.md](docker.md) for the full Docker guide.

## Local Development

Requires locally installing node libraries.

1. Install Node 18: `nvm install 18 && nvm use 18`
2. `npm install`
3. `npm run start:dev`
4. Open http://localhost:3000

If port 3000 conflicts: `PORT=3001 node backend/server.js`

## Development Commands

**Build:**
```bash
npm run build:dev   # Development build
npm run build:test  # Test build
npm run build:prod  # Production build
```

**Run:**
```bash
npm run start:dev           # Build dev + start server
node backend/server.js      # Start server only (after build)
PORT=3001 node backend/server.js  # Alternate port
```

**Test:**
```bash
npm test    # Run test suite (116 tests)
```
