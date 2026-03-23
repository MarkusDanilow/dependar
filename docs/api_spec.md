# 🔄 API Specification & Flows

## REST API Routes (v1)

*Note: All endpoints except `/auth/login` and `/ingest/agent` require a valid JWT in the `Authorization: Bearer <token>` header.*

| Layer | Method | Route | Purpose |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/v1/auth/login` | Accepts email/password, returns a JWT. |
| **Auth** | `GET`  | `/api/v1/auth/me` | Validates the JWT and returns the user session (`ADMIN` / `VIEWER`). |
| **Ingestion** | `POST` | `/api/v1/ingest/agent` | Endpoint for the Dependar Go agent (authenticated via Static API Key). |
| **Ingestion** | `POST` | `/api/v1/ingest/generic` | Open endpoint for generic CI/CD pipelines. |
| **Graph UI** | `GET`  | `/api/v1/graph/full` | Returns nodes & edges for the React Flow frontend. |
| **AI / Chat** | `POST` | `/api/v1/chat/message` | Accepts NLP user chat messages for manual ingestion. |
| **Engine** | `POST` | `/api/v1/engine/sync` | Manually triggers the internal CVE matching engine. |