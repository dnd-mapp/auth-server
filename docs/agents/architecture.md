# Architecture

NestJS 11 + Fastify 5 auth server acting as a custom Identity Provider (IdP) implementing OAuth2 Authorization Code Flow with PKCE.

## Module Structure

```text
AppModule
├── ConfigModule          — environment validation via class-validator schemas
├── ThrottlerModule       — 3-tier rate limiting (1s/3, 10s/20, 60s/100)
├── HealthModule          — Terminus health checks (DB connectivity)
├── DatabaseModule        — Prisma client DI (dynamic module, real + mock)
├── UserModule            — User CRUD + soft delete + role assignment
├── RoleModule            — Role CRUD
├── PermissionModule      — Permission CRUD
└── ClientModule          — OAuth client CRUD + type/secret enforcement
```

## Key Design Patterns

- **Repository pattern** — all DB access goes through `*Repository` classes; services never call Prisma directly
- **PrismaLikeClient** interface (`src/common/prisma/`) — enables mock injection in tests without real DB
- **Injection token** (`PRISMA_CLIENT`) used for providing either real `DatabaseService` or `MockPrisma`

## Testing Approach

Tests use NestJS `Test.createTestingModule` with:

- `MockPrisma` from `test/mocks/prisma.ts` substituting the real Prisma client
- `MockConfigService` from `test/mocks/config.ts`
- Test fixtures in `test/mocks/db/` and `src/auth/domain/test/`

Coverage excludes `*.module.ts`, `main.ts`, `*/index.ts`, and `*/config/**/*.ts`.

## Database

MariaDB via Prisma 7 with `@prisma/adapter-mariadb`. Schema: `prisma/schema.prisma`.

Models: `User` (soft delete via `deletedAt`), `Role`, `Permission`, `UserRole` (junction, composite PK), `Client` (`clientType`: `public` | `confidential`, optional Argon2-hashed `clientSecret`), `ClientAllowedUri` (one-to-many on `Client`). All IDs are nanoid strings (not auto-increment integers).

Migration files live in `prisma/migrations/` — always use `pnpm prisma:migrate-dev` to create new ones.

```bash
pnpm prisma:migrate-dev       # Create & run migration (dev)
pnpm prisma:migrate-deploy    # Deploy migrations (prod)
pnpm prisma:seed              # Seed database
pnpm gen:prisma               # Regenerate Prisma client
```

## Configuration

Environment variables are validated at startup via `src/app/config/validation/environment-variables.schema.ts`. Config is split into typed namespaces (`serverConfig`, `databaseConfig`) registered in `ConfigModule`.

Requires a local `/etc/hosts` entry: `127.0.0.1 localhost.auth.dndmapp.dev` for HTTPS and cookie sharing.

```bash
# Local SSL (requires mkcert)
pnpm gen:ssl-certs            # Generate ssl-cert.pem + ssl-key.pem
```

## Security Layers

- Helmet with custom CSP (allows Swagger UI inline scripts)
- CORS with dynamic origin validation and credentials
- Three-tier throttling applied globally
- Argon2 password hashing (users and confidential client secrets)
- PKCE-enforced Authorization Code Flow
- Client type enforcement: public clients must not have a secret; confidential clients must have one

## Docker

```bash
pnpm docker:compose:up        # Start MariaDB + app containers
pnpm docker:compose:down      # Stop containers
```
