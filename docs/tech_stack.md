# ⚙️ Tech Stack Architecture

To ensure testability, clean OOP patterns, and maintainability, we rely on a strongly typed ecosystem with clear layer separation (Controller -> Service -> Repository), while keeping the framework overhead minimal.

## Core Application
* **Backend:** `Node.js` + `Fastify` (or `Express`) & `TypeScript`. A lightweight, high-performance web server setup.
* **Task Scheduling:** `node-cron` (or similar) for the internal background jobs (e.g., daily CVE threat syncing).
* **Frontend:** `Next.js` (React) App Router + `React Flow` for interactive, hardware-accelerated dependency graph rendering.
* **AI Copilot:** `Ollama` (Locally hosted LLM like Llama 3). Communication via REST.

## Data Ingestion / Discovery
* **Dependar Agent:** `Go` (Golang). An extremely lightweight, compiled binary with no external dependencies. Scans local environments (Docker sockets, `package.json`, etc.) and periodically pushes data to the Fastify REST API.

## Data Layer
* **Database:** `PostgreSQL 16`. Provides relational integrity for graphs, improved performance, and `JSONB` for flexible metadata.
* **ORM:** `Prisma`. Generates type-safe repositories for our backend.