# Docker Guide

## Building the Image

```bash
make build
```

This builds the production image from the local `Dockerfile`. The image is tagged `wheel-spinner`.

To build manually without Make:
```bash
docker build --target production --build-arg BUILD_ENV=prod -t wheel-spinner .
```

## Running the Container

```bash
make run
```

Opens at http://localhost:3000. The database is persisted in a Docker volume (`wheel-spinner-data`) so data survives container restarts.

To run manually without Make:
```bash
docker run -d \
  --name wheel-spinner \
  --restart unless-stopped \
  -p 3000:3000 \
  -v wheel-spinner-data:/app/backend/data \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e NODE_OPTIONS=--openssl-legacy-provider \
  wheel-spinner
```

## Stopping and Cleanup

```bash
make stop     # Stop and remove the container (data volume kept)
make clean    # Stop container and delete the data volume
```

## Useful Commands

```bash
make logs     # Tail container logs
make shell    # Open a shell inside the running container
make help     # List all available Make targets
```

## Configuration

Environment variables can be passed at runtime — no rebuild required.

### Custom default wheel entries

Override the names shown on the wheel when a user first visits:

```bash
make run WHEEL_DEFAULT_ENTRIES='["Alice","Bob","Carol"]'
```

The value must be a JSON array of strings. If not set, the built-in defaults are used.

To set this permanently, edit the `run` target in the `Makefile` and add:
```
-e WHEEL_DEFAULT_ENTRIES='["Alice","Bob","Carol"]' \
```

### Custom port

```bash
make run PORT=8080
```

## Data Persistence

The SQLite database is stored in a named Docker volume (`wheel-spinner-data`) mounted at `/app/backend/data` inside the container. This volume is preserved across `make stop` / `make run` cycles.

To wipe all data and start fresh:
```bash
make clean
make run
```

## Updating to a New Version

```bash
make stop
make build
make run
```
