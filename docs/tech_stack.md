# ⚙️ Tech Stack & System-Architektur

Um Wartbarkeit, Testbarkeit und Skalierbarkeit zu gewährleisten, setzt Dependar auf ein modularisiertes, stark typisiertes Ökosystem mit klarer Schichttrennung (Controller -> Service -> Datenbank).

## Core Application
* **Backend:** `Node.js` + `Fastify` & `TypeScript`. Eine hochperformante, API-fokussierte Architektur, organisiert in spezialisierten Modulen (z.B. `Ingest`, `Analytics`, `Inventory`).
* **Frontend:** `Next.js` (React) App Router. Ein barrierefreies "Mission Control" Dashboard mit Fokus auf WCAG-Konformität, optimierter Typografie und hocheffizienten Such- & Paginations-Logiken.
* **Visualisierung:** `React Flow` für interaktive, hardwarebeschleunigte Abhängigkeitsgraphen der gesamten IT-Infrastruktur.
* **AI Copilot:** `Ollama` (Lokal gehostetes LLM wie Llama 3). Die Kommunikation erfolgt über REST, um Risiko-Kontexte und Behebungsstrategien zu analysieren.

## Daten-Ingest & Discovery
* **Dependar Agent:** `Go` (Golang). Ein extrem leichtgewichtiger, kompilierter Binär-Agent ohne externe Abhängigkeiten.
    * **Docker-Discovery:** Nutzt das offizielle Docker SDK für tiefe Scans (Labels, ENV, Metadaten).
    * **Dependency-Scanning:** Extrahiert Versionen direkt aus Dateisystemen (z.B. `package.json`).
    * **Push-Modell:** Übermittelt Daten periodisch via authentifiziertem REST an das Backend.

## Daten-Layer
* **Datenbank:** `PostgreSQL 16`. Bietet relationale Integrität für komplexe Graphen, hohe Performance und `JSONB` für flexible Metadaten.
* **ORM:** `Prisma`. Generiert typsichere Repositories und Abstraktionsschichten für den Backend-Kern.
* **Automatisierung:** Integriertes Vulnerability-Syncing (CVEs) mittels täglicher Hintergrundjobs.