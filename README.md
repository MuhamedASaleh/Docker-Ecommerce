# DockerCommerce

A production-ready e-commerce API built with Node.js, Express, PostgreSQL, Redis, Docker, and JWT authentication.

## Running with Docker

1. Copy the environment template and fill in real values:

   ```sh
   cp .env.example .env
   ```

2. Build and start the stack:

   ```sh
   docker compose up --build
   ```

   This starts `postgres` and `redis` first and waits for each to report `healthy`
   before starting `api`, so the app never races a database that isn't ready to
   accept connections yet.

3. Check the app is up:

   ```sh
   curl http://localhost:${PORT}/health   # liveness — is the process running
   curl http://localhost:${PORT}/ready    # readiness — can it reach Postgres and Redis
   ```

4. Stop the stack:

   ```sh
   docker compose down
   ```

   `api` handles `SIGTERM` gracefully: it stops accepting new requests, lets
   in-flight requests finish, then closes the Postgres pool and Redis
   connection before exiting.

### Image details

- Multi-stage build: dependencies are installed in a throwaway stage with
  `npm ci --omit=dev`, so devDependencies and build cache never reach the
  final image.
- Runs as the non-root `node` user.
- Ships a `HEALTHCHECK` that polls `/health`, which is what `docker ps` and
  `depends_on: condition: service_healthy` key off of.