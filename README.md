# 🛡️ D&D Mapp | Auth Server

![Node Version](https://img.shields.io/badge/Node-v24+-339933?logo=node.js&logoColor=white)
![Package Manager](https://img.shields.io/badge/pnpm-v10.33.0-F69220?logo=pnpm&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![Database](https://img.shields.io/badge/MariaDB-003545?logo=mariadb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)
[![CI](https://github.com/dnd-mapp/auth-server/actions/workflows/push-main.yaml/badge.svg)](https://github.com/dnd-mapp/auth-server/actions/workflows/push-main.yaml)

The core security engine for the **D&D Mapp** ecosystem. This repository contains a high-performance, custom-built authentication and authorization server designed to handle secure identity management for players and Dungeon Masters.

## 🗝️ Overview

The `auth-server` is a standalone NestJS REST API that acts as the Identity Provider (IdP) for the D&D Mapp platform. It implements a secure **Authorization Code Flow with PKCE** to support our Angular SPA, ensuring that user credentials and tokens are handled with modern security best practices without relying on third-party SaaS providers.

---

## 🏗️ Architecture & Features

- **OAuth2-Inspired Flow:** Custom implementation of Authorization Code Flow with Proof Key for Code Exchange (PKCE).
- **Token Management:**
  - Mints **JWT Access Tokens** (short-lived) for API authorization.
  - Mints **JWT ID Tokens** for user profile information.
  - Manages **Opaque Refresh Tokens** (stored server-side) for secure session persistence.
  - Full support for **Token Invalidation/Revocation** on logout.
- **Custom Security Layer:** Lightweight, built-in NestJS Guards for authentication and authorization (no Passport overhead).
- **Hardened Security:**
  - **Argon2** password hashing.
  - **Multi-layered Throttling:** Rate limiting across short, medium, and long windows.
  - **Helmet:** Secure headers and custom Content Security Policy (CSP).
  - **CORS:** Strict origin validation with credential support for secure cookie handling.
  - **CSRF Protection:** Integrated into the secure cookie and PKCE logic.
- **Authorization:** Granular **(A)RBAC** (Attribute/Role-Based Access Control) integrated into the JWT claims.
- **Persistence:** Type-safe data modeling using Prisma ORM.
- **Documentation:** Built-in **OpenAPI (Swagger)** explorer for API testing and integration.

---

## 🛡️ Security Configuration Details

### Rate Limiting (Throttling)

To prevent brute-force attacks and API abuse, the server implements a triple-window throttling strategy via `@nestjs/throttler`:

| Window     | TTL        | Limit        | Purpose                   |
|:-----------|:-----------|:-------------|:--------------------------|
| **Short**  | 1 Second   | 3 requests   | Burst protection          |
| **Medium** | 10 Seconds | 20 requests  | Sustained traffic control |
| **Long**   | 1 Minute   | 100 requests | General API stability     |

### Headers & CORS

- **Helmet:** Configured via `@fastify/helmet` with a custom CSP to allow local Swagger UI assets.
- **CORS:** Dynamically configured to support specific origins (e.g., the Angular SPA). Explicitly allows `Authorization` and `Content-Type` headers with `credentials: true`.

---

## 🛠️ Tech Stack

- **Framework:** NestJS (TypeScript)
- **Engine:** Fastify
- **Runtime:** Node.js v24
- **Package Manager:** pnpm v10.33.0
- **ORM:** Prisma
- **Database:** MariaDB
- **Testing:** Vitest
- **Linting:** ESLint & Markdownlint
- **Formatting:** Prettier
- **Infrastructure:** Docker & Docker Compose

---

## 📖 API Documentation

Interactive documentation is automatically generated via Swagger.

- **Local Dev (SSL):** [https://localhost.auth.dndmapp.dev:4350/docs](https://localhost.auth.dndmapp.dev:4350/docs)
- **Docker/Localhost:** [http://localhost:4350/docs](http://localhost:4350/docs)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v24+
- **pnpm:** v10.33.0+
- **mise:** To automatically manage Node.js and pnpm versions. [Install instructions](https://mise.jdx.dev/getting-started.html).
- **Docker & Docker Compose**
- **mkcert:** For generating local SSL certificates. [Install instructions](https://github.com/FiloSottile/mkcert#installation).
- A local MariaDB instance (or via Docker).

### Local Networking Setup

During development, the server is configured to be served via a custom local hostname to support secure cookie sharing across subdomains.

You must map `localhost.auth.dndmapp.dev` to your local loopback address. Edit your hosts file:

- **Windows:** `C:\Windows\System32\drivers\etc\hosts`
- **Linux/macOS:** `/etc/hosts`

Add the following line:

```text
127.0.0.1 localhost.auth.dndmapp.dev
```

> [!NOTE]
> This configuration applies only to local development. Docker containers continue to use standard networking as they are designed to sit behind a reverse proxy.

### Local HTTPS Setup

To support secure cookies and PKCE flows locally, the server must run over HTTPS during development. We use `mkcert` to manage locally trusted certificates.

1. **Install the local CA:**

   ```bash
   mkcert -install
   ```

2. **Generate certificates:**

   ```bash
   pnpm gen:ssl-certs
   ```

### Installation & Run

1. **Clone the repository:**

   ```bash
   git clone https://github.com/dnd-mapp/auth-server.git
   cd auth-server
   ```

2. **Setup Runtimes:**

   Ensure `mise` is installed. Run the following to install the correct Node.js and pnpm versions defined in `.tool-versions`:

   ```bash
   mise install
   ```

3. **Install dependencies:**

   ```bash
   pnpm install
   ```

4. **Environment Setup:**

   Copy the example env file and fill in your secrets.

   ```bash
   cp .env.template .env
   ```

5. **Database Migration:**

   ```bash
   pnpm prisma:migrate-dev
   ```

6. **Run the server:**

   ```bash
   pnpm start
   ```

   The API will be available at `https://localhost.auth.dndmapp.dev:4350`.

---

## 🧪 Quality Control

### Testing

We use **Vitest** for unit and integration testing.

- **Run tests (CI):**

  ```bash
  pnpm test
  ```

- **Development mode (UI/Watch):**
  
  ```bash
  pnpm test:development
  ```

### Linting & Formatting

To maintain high code quality and consistent documentation standards:

- **Lint Code (ESLint):**

  ```bash
  pnpm lint:eslint
  ```

- **Lint Docs (Markdownlint):**

  ```bash
  pnpm lint:markdownlint
  ```

- **Run All Lints:**

  ```bash
  pnpm lint
  ```

- **Format Check:**

  ```bash
  pnpm format:check
  ```

- **Auto-format:**

  ```bash
  pnpm format:write
  ```

---

## 🐳 Docker Deployment

> [!NOTE]
> The Docker configuration is intended for production-like environments or CI. **Containers are served over HTTP** as they are designed to sit behind a reverse proxy (e.g., Nginx, Traefik) which handles SSL termination.

This project uses Docker Compose to orchestrate the authentication server, MariaDB database, and management tools. Follow the steps below to set up your local environment.

### 1. Prerequisites

Ensure you have Docker and Docker Compose (v2.0+) installed on your machine.

### 2. Configuration Setup

Before starting the containers, you must create and configure the necessary environment and initialization files from their respective templates.

#### Environment Variables

Copy the template `.env` file and adjust the values (especially credentials and database names) to match your environment:

```bash
cp .docker/.env.template .docker/.env
```

#### MariaDB Initialization

Create the SQL initialization script. This script handles user creation and database provisioning:

```bash
cp .docker/mariadb-init-template.sql .docker/mariadb-init.sql
```

#### Secrets

The MariaDB root password is managed via a Docker secret. Create the directory and the secret file:

```bash
echo "your_secure_root_password" > ./secrets/mariadb/root.txt
```

### 3. Running the Services

You can use Docker [profiles](https://docs.docker.com/compose/profiles/) to start either the entire stack or just the database-related infrastructure.

#### Start Entire Stack

To start the authentication server, database migrations, MariaDB, and DBeaver:

```bash
docker compose --profile all up -d
```

#### Start Database Services Only

If you are running the application code locally and only need the database infrastructure (MariaDB, Prisma migrations, and CloudBeaver):

```bash
docker compose --profile db up -d
```

### 4. Service Access

Once the containers are healthy, you can access the services at the following endpoints:

- **Auth Server:** `http://localhost:4350`
- **CloudBeaver (Database GUI):** `http://localhost:8978`
- **MariaDB:** `localhost:3306`

### 5. Troubleshooting

If the migration fails, check the logs for the `db-migration` container:

```bash
docker logs db-migration
```

> [!NOTE]
> that the `db-migration` service is configured to run `prisma migrate deploy` and `prisma db seed` automatically upon startup, provided the database is healthy.

---

## 🤝 Contributing

This repository is part of the **D&D Mapp** internal ecosystem. At this time, we are **not accepting external contributions or Pull Requests**.

Refer to our global [CONTRIBUTING.md](https://github.com/dnd-mapp/.github/blob/main/CONTRIBUTING.md) for organizational policies.

---

## 🛡️ License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.
