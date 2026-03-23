# 📡 Dependar: Continuous Dependency Radar & Security Graph

> **Build a dynamic knowledge graph of your entire infrastructure. Spot vulnerabilities, end-of-life tech, and hidden dependencies instantly.**

## 👁️ Vision
Dependar is an open-source, self-hosted Configuration Management Database (CMDB) and Security Posture tool. It maps your entire infrastructure (Docker, CI/CD pipelines, manual installs) into a **normalized dependency graph**. 

Beyond just listing vulnerabilities, Dependar understands *context*. With its built-in threat intelligence engine and local AI Copilot (via Ollama), it performs **Auto-Triage**: It analyzes a vulnerability within your specific graph (e.g., "Is this Postgres DB exposed to the internet?") and automatically downgrades irrelevant alerts.

## ✨ Core Features
* **Graph-Based CMDB:** A technology is stored once, mapped to thousands of projects instantly.
* **Global Dependency Trees:** Understands inherent tech relationships (e.g., NextJS requires React) even before a container is scanned.
* **Built-in Threat Intel:** Internal cron-engine fetches CVEs and matches them via Semantic Versioning.
* **Local AI Copilot (Ollama):** Air-gapped risk scoring and automated remediation.
* **Universal Ingestion:** Auto-discover via Agents, generic REST API, or AI Chat.