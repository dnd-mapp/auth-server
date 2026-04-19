# 🛡️ D&D Mapp | Auth Server (Docker)

![Docker Pulls](https://img.shields.io/docker/pulls/dndmapp/auth-server)
![Docker Image Size](https://img.shields.io/docker/image-size/dndmapp/auth-server/latest)
![Node Version](https://img.shields.io/badge/Node-v24.14.0-339933?logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

The **dndmapp/auth-server** is a high-performance, containerized Identity Provider (IdP) built on NestJS and Fastify. It serves as the core security engine for the **D&D Mapp** ecosystem, implementing modern authentication standards like **Authorization Code Flow with PKCE**. This image is engineered for security-first environments, featuring multi-stage builds, hardened Alpine runtimes, and full SBOM/Provenance attestations.

---

## 🚀 Quick Start

Launch a standalone instance. This requires an existing MariaDB/MySQL instance.

```bash
docker run -d \
  --name auth-server \
  -p 4350:4350 \
  -e AUTH_SERVER_DB_HOST=host \
  -e AUTH_SERVER_DB_PORT=3306 \
  -e AUTH_SERVER_DB_USER=user \
  -e AUTH_SERVER_DB_PASSWORD=password \
  -e AUTH_SERVER_DB_SCHEMA=auth_db \
  -e AUTH_SERVER_PASSWORD_PEPPER=pepper \
  dndmapp/auth-server:latest
```

> [!NOTE]
> For a full local development stack (MariaDB, migrations, DBeaver), use [dnd-mapp/dnd-mapp-stack](https://github.com/dnd-mapp/dnd-mapp-stack).

---

## 🔑 Run Modes

The container entrypoint accepts a single command argument that selects the run mode.

| Command               | Behaviour                                                                                               |
|:----------------------|:--------------------------------------------------------------------------------------------------------|
| `serve` *(default)*   | Runs database migrations, seeds the database, then starts the application.                              |
| `migrate`             | Runs database migrations and seeds the database, then exits.                                            |
| *(any other command)* | Passes the command through directly without running migrations (e.g. `node /app/main.js` for app-only). |

```bash
# Default: migrate + app (equivalent to passing "serve")
docker run dndmapp/auth-server:latest

# Migrations only (e.g. in an init container)
docker run dndmapp/auth-server:latest migrate

# App only, no migrations
docker run dndmapp/auth-server:latest node /app/main.js
```

---

## 🔒 Docker Secrets

Sensitive environment variables support the `_FILE` suffix convention for use with [Docker secrets](https://docs.docker.com/engine/swarm/secrets/) or any secret mounted as a file. When a `_FILE` variant is set and the base variable is **not** yet set, the entrypoint reads the file and exports its content as the base variable.

| Secret variable               | `_FILE` variant                      |
|:------------------------------|:-------------------------------------|
| `AUTH_SERVER_DB_PASSWORD`     | `AUTH_SERVER_DB_PASSWORD_FILE`       |
| `AUTH_SERVER_PASSWORD_PEPPER` | `AUTH_SERVER_PASSWORD_PEPPER_FILE`   |

### Example with Docker Compose secrets

```yaml
services:
  auth-server:
    image: dndmapp/auth-server:latest
    environment:
      AUTH_SERVER_DB_PASSWORD_FILE: /run/secrets/db_password
      AUTH_SERVER_PASSWORD_PEPPER_FILE: /run/secrets/password_pepper
    secrets:
      - db_password
      - password_pepper

secrets:
  db_password:
    external: true
  password_pepper:
    external: true
```

---

## 🛡️ Image Details

This image follows DevSecOps best practices to ensure a minimal attack surface and verifiable supply chain integrity.

- **Base Image:** `node:24.14.0-alpine3.23` (Lightweight & security hardened).
- **Exposed Ports:** `4350` (API/Docs).
- **Security Attestations:**
  - **SBOM:** Software Bill of Materials included.
  - **Provenance:** Build metadata (`mode=max`) for CI/CD transparency.
- **User:** Runs as a non-root user to adhere to the principle of least privilege.

### Supported Platforms

This image is built using **Docker Buildx** to support multi-arch deployments:

- `linux/amd64` (Standard Cloud/Server)
- `linux/arm64` (Apple Silicon M1/M2/M3, Graviton, Raspberry Pi)

---

## 🏷️ Tagging Policy

| Tag                 | Description                                                                                   | Stability            |
|:--------------------|:----------------------------------------------------------------------------------------------|:---------------------|
| `latest`            | The most recent stable release from the `main` branch.                                        | **Stable**           |
| `1`, `1.2`, `1.2.3` | Semantic Versioning (SemVer) tags. `1` and `1.2` act as rolling aliases for the latest patch. | **Stable**           |
| `1.2.3-alpha.4`     | Prerelease builds. Supported IDs: `alpha`, `beta`, or `rc` (Release Candidate).               | **Testing**          |
| `dev`               | Bleeding-edge builds from the development pipeline.                                           | **Unstable**         |
| `sha-<hash>`        | Immutable builds pinned to a specific Git commit for reproducibility.                         | **Production Ready** |

### Versioning Examples

- **Major (`1`):** Always points to the latest stable release of version 1.
- **Minor (`1.2`):** Points to the latest patch within the 1.2 minor branch.
- **Patch (`1.2.3`):** An immutable tag for a specific production release.
- **Prerelease (`1.2.3-rc.1`):** Used for integration testing before a final release.

---

## 🔗 Project Links

- **Source Code:** [github.com/dnd-mapp/auth-server](https://github.com/dnd-mapp/auth-server)
- **Issue Tracker:** [Report a Bug](https://github.com/dnd-mapp/auth-server/issues)
- **Organization:** [D&D Mapp on GitHub](https://github.com/dnd-mapp)

---

_"Critical hit on security. Roll for initiative!"_
