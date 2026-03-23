# ⚙️ Tech Stack Architecture

To ensure testability, clean OOP patterns, and maintainability, we rely on a strongly typed ecosystem with clear layer separation (Controller -> Service -> Repository).

## Core Application
* **Backend:** `NestJS` (Node.js) + TypeScript. Perfect for Dependency Injection and cron jobs (`@nestjs/schedule`).
* **Frontend:** `Next.js` (React) App Router + `React Flow` for interactive, hardware-accelerated graph rendering.
* **AI Copilot:** `Ollama` (Locally hosted LLM like Llama 3). Communication via REST.

## Data Ingestion / Discovery
* **Dependar Agent:** `Go` (Golang). An extremely lightweight, compiled binary with no external dependencies. Scans local environments (Docker sockets, `package.json`, etc.) and periodically pushes data to the NestJS REST API.

## Data Layer
* **Database:** `PostgreSQL`. Provides relational integrity for graphs and `JSONB` for flexible metadata.
* **ORM:** `Prisma`. Generates type-safe repositories for our NestJS backend.