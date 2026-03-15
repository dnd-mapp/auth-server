# 🛡️ D&D Mapp | Auth Server (Docker)

![Docker Pulls](https://img.shields.io/docker/pulls/dndmapp/auth-server)
![Docker Image Size](https://img.shields.io/docker/image-size/dndmapp/auth-server/latest)
![Node Version](https://img.shields.io/badge/Node-v24.14.0-339933?logo=node.js&logoColor=white)
![Framework](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow)

The **dndmapp/auth-server** is a high-performance, containerized Identity Provider (IdP) built on NestJS and Fastify. It serves as the core security engine for the **D&D Mapp** ecosystem, implementing modern authentication standards like **Authorization Code Flow with PKCE**. This image is engineered for security-first environments, featuring multi-stage builds, hardened Alpine runtimes, and full SBOM/Provenance attestations.

---

## 🚀 Quick Start

Launch a stable instance of the Auth Server with a single command. By default, the server listens on port `4350`.

```bash
docker run -d \
  --name auth-server \
  -p 4350:4350 \
  -e NODE_ENV=production \
  -e DATABASE_URL="mysql://user:password@host:3306/db" \
  dndmapp/auth-server:latest
```

Once running, the service is accessible at `http://localhost:4350`.

---

## 🏗️ Deployment

### Docker Compose

For production-like environments or local orchestration, we recommend using Docker Compose. Note that this service is designed to sit behind a reverse proxy (e.g., Nginx, Traefik) for SSL termination.

```yaml
services:
    auth-server:
        image: dndmapp/auth-server:latest
        container_name: auth-server
        restart: unless-stopped
        ports:
            - '4350:4350/tcp'
        environment:
            - DATABASE_URL=${DATABASE_URL}
```

### Supported Platforms

This image is built using **Docker Buildx** to support multi-arch deployments:

- `linux/amd64` (Standard Cloud/Server)
- `linux/arm64` (Apple Silicon M1/M2/M3, Graviton, Raspberry Pi)

---

## 🛡️ Image Details

This image follows DevSecOps best practices to ensure a minimal attack surface and verifiable supply chain integrity.

- **Base Image:** `node:24.14.0-alpine3.23` (Lightweight footprint & security hardened).
- **Exposed Ports:** `4350` (Primary API/Docs port).
- **Configuration:** Managed via Environment Variables (see `.env.template` in source).
- **Security Attestations:**
    - **SBOM:** Software Bill of Materials included for vulnerability scanning.
    - **Provenance:** Build metadata (`mode=max`) for CI/CD transparency and authenticity.
- **User:** Runs as a non-root user where possible to adhere to the principle of least privilege.

---

## 🏷️ Tagging Policy

| Tag          | Description                                                           | Stability            |
|:-------------|:----------------------------------------------------------------------|:---------------------|
| `latest`     | The most recent stable release from the `main` branch.                | **Stable**           |
| `dev`        | Bleeding-edge builds from the development pipeline.                   | **Unstable**         |
| `sha-<hash>` | Immutable builds pinned to a specific Git commit for reproducibility. | **Production Ready** |

---

## 🔗 Project Links

- **Source Code:** [github.com/dnd-mapp/auth-server](https://github.com/dnd-mapp/auth-server)
- **Issue Tracker:** [Report a Bug](https://github.com/dnd-mapp/auth-server/issues)
- **Organization:** [D&D Mapp on GitHub](https://github.com/dnd-mapp)

---

*“Critical hit on security. Roll for initiative!”*
