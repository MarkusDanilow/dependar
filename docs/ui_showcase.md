# 🎨 Dependar: UI Showcase (Mission Control)

Dieses Dokument bietet einen visuellen Überblick über die Dependar-Benutzeroberfläche. Das Design basiert auf unserem High-Contrast Dark Mode Theme (Slate) und ist optimiert für maximale Übersichtlichkeit bei der Verwaltung komplexer Infrastrukturen und Sicherheitswarnungen.

---

## 1. Login-Zentrale
Ein sicherer Einstiegspunkt in das System, geschützt durch JWT-basierte Authentifizierung und rollenbasierten Zugriff (RBAC).

![Login Screen](assets/login.PNG)

---

## 2. Dashboard: Mission Control & Abhängigkeitsgraph
Das Herzstück von Dependar. Hier wird die gesamte Infrastruktur als interaktiver Graph (`React Flow`) visualisiert. In Echtzeit berechnete Metriken für Sicherheitslage, SLA-Verletzungen und MTTR-Trends geben sofortigen Aufschluss über den Systemzustand.

![Dashboard & AI Copilot](assets/dashboard.PNG)

---

## 3. Analytics & Sicherheits-Metriken
Umfassende Auswertungen zu Systemzustand und Performance. CVEs werden kategorisiert und historische Sicherheitstrends der letzten Tage visualisiert, um proaktives Handeln zu ermöglichen.

![Analytics](assets/analytics.PNG)

---

## 4. Technologien & Abhängigkeiten
Eine normalisierte Ansicht aller im Netzwerk entdeckten Technologien (Frameworks, Datenbanken, Laufzeiten). Inklusive **clientseitiger Pagination** und **Echtzeit-Suche** für effiziente Verwaltung großer Bestände.

![Technologies](assets/technologies.PNG)

---

## 5. Projekte, Container & Hosts
Die operative Sicht auf laufende Container, Projekte und physische Hosts. Bietet nun eine konsistente Suchfunktion über alle Asset-Klassen hinweg, um Instanzen in Sekundenbruchteilen zu finden.

![Projects & Containers](assets/projects.PNG)

---

## 6. Benutzerverzeichnis
Leichtgewichtige, rollenbasierte Zugriffskontrolle (RBAC). Administratoren verwalten hier Zugriffe, Sicherheitsrollen und API-Keys der Benutzer.

![User Management](assets/users.PNG)

---

## 7. Systemeinstellungen
Globale Konfigurationen, Profil-Einstellungen, Benachrichtigungspräferenzen und Sicherheitsoptionen der Dependar-Plattform.

![Settings](assets/settings.PNG)