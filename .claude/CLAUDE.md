# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Before Making Changes

Run the following before editing any file:

```bash
pnpm gen:prisma
```

## Commands

```bash
# Development
pnpm start                    # Start with watch mode
pnpm build                    # Build with Webpack via NestJS CLI

# Testing
pnpm test                     # Run all tests (CI mode)
pnpm test:development         # Watch mode with Vitest UI (http://localhost:51204/auth-server/)

# Single test file
pnpm exec vitest run src/path/to/file.spec.ts

# Linting & formatting
pnpm lint                     # ESLint + markdownlint
pnpm format:check             # Check formatting
pnpm format:write             # Auto-format

# Database
pnpm prisma:migrate-dev       # Create & run migration (dev)
pnpm prisma:migrate-deploy    # Deploy migrations (prod)
pnpm prisma:seed              # Seed database
pnpm gen:prisma               # Regenerate Prisma client

# Local SSL (requires mkcert)
pnpm gen:ssl-certs            # Generate ssl-cert.pem + ssl-key.pem

# Docker
pnpm docker:compose:up        # Start MariaDB + app containers
pnpm docker:compose:down      # Stop containers
```

## After Making Changes

Run the following checks after editing any file, in this order:

1. **Format** — auto-fix Prettier violations:

   ```bash
   pnpm format:write
   ```

2. **Lint** — catch ESLint and markdownlint issues:

   ```bash
   pnpm lint
   ```

3. **Format check** — verify no formatting drift remains:

   ```bash
   pnpm format:check
   ```

4. **Tests** — confirm nothing is broken:

   ```bash
   pnpm test
   ```

> Always run `pnpm format:write` before committing. If `pnpm format:check` still fails after running it, check for files excluded from Prettier's config or conflicting ESLint rules.

## Pull Request Descriptions

Do not include a test plan section in pull request descriptions.

## Commit Messages

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```text
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | When to use                                             |
|------------|---------------------------------------------------------|
| `feat`     | A new feature                                           |
| `fix`      | A bug fix                                               |
| `docs`     | Documentation changes only                              |
| `style`    | Formatting, missing semicolons, etc. (no logic changes) |
| `refactor` | Code change that is neither a fix nor a feature         |
| `test`     | Adding or updating tests                                |
| `chore`    | Build process, tooling, or dependency updates           |
| `perf`     | Performance improvements                                |
| `ci`       | CI/CD configuration changes                             |

### Scopes

Use the NestJS module name as the scope where applicable (e.g. `user`, `role`, `permission`, `database`, `config`, `health`). Use `prisma` for schema/migration changes and `docker` for container-related changes.

### Rules

- Use the **imperative mood** in the description: "add feature" not "added feature"
- Keep the description under **72 characters**
- Mark breaking changes with `!` after the type/scope and a `BREAKING CHANGE:` footer

### Examples

```text
feat(user): add soft delete endpoint
fix(auth): handle expired PKCE code verifier
refactor(database): extract repository base class
docs: update CLAUDE.md with commit conventions
chore(prisma): regenerate client after schema change
feat(auth)!: require PKCE for all authorization requests

BREAKING CHANGE: authorization requests without code_challenge are now rejected
```

## Architecture

NestJS 11 + Fastify 5 auth server acting as a custom Identity Provider (IdP) implementing OAuth2 Authorization Code Flow with PKCE.

### Module Structure

```text
AppModule
├── ConfigModule          — environment validation via class-validator schemas
├── ThrottlerModule       — 3-tier rate limiting (1s/3, 10s/20, 60s/100)
├── HealthModule          — Terminus health checks (DB connectivity)
├── DatabaseModule        — Prisma client DI (dynamic module, real + mock)
├── UserModule            — User CRUD + soft delete + role assignment
├── RoleModule            — Role CRUD
└── PermissionModule      — Permission CRUD
```

### Key Design Patterns

- **Repository pattern** — all DB access goes through `*Repository` classes; services never call Prisma directly
- **PrismaLikeClient** interface (`src/common/prisma/`) — enables mock injection in tests without real DB
- **Injection token** (`PRISMA_CLIENT`) used for providing either real `DatabaseService` or `MockPrisma`

### Testing Approach

Tests use NestJS `Test.createTestingModule` with:

- `MockPrisma` from `test/mocks/prisma.ts` substituting the real Prisma client
- `MockConfigService` from `test/mocks/config.ts`
- Test fixtures in `test/mocks/db/` and `src/auth/domain/test/`

Coverage excludes `*.module.ts`, `main.ts`, `*/index.ts`, and `*/config/**/*.ts`.

### Database

MariaDB via Prisma 7 with `@prisma/adapter-mariadb`. Schema: `prisma/schema.prisma`.

Models: `User` (soft delete via `deletedAt`), `Role`, `Permission`, `UserRole` (junction, composite PK). All IDs are nanoid strings (not auto-increment integers).

Migration files live in `prisma/migrations/` — always use `pnpm prisma:migrate-dev` to create new ones.

### Configuration

Environment variables are validated at startup via `src/app/config/validation/environment-variables.schema.ts`. Config is split into typed namespaces (`serverConfig`, `databaseConfig`) registered in `ConfigModule`.

Requires a local `/etc/hosts` entry: `127.0.0.1 localhost.auth.dndmapp.dev` for HTTPS and cookie sharing.

### Security Layers

- Helmet with custom CSP (allows Swagger UI inline scripts)
- CORS with dynamic origin validation and credentials
- Three-tier throttling applied globally
- Argon2 password hashing (planned/in use for auth flow)
- PKCE-enforced Authorization Code Flow
