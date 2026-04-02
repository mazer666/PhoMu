# Security & Privacy Policy

Aktualisiert: 2. April 2026

## 1) Grundprinzipien
- Privacy by default
- Data minimization
- Secure-by-design
- Least privilege

## 2) Was wir vermeiden
- Keine API-Keys im Sourcecode
- Keine unnötige Speicherung personenbezogener Daten
- Keine versteckten Tracking-Skripte

## 3) Mindest-Sicherheitsanforderungen (Engineering)

## 3.1 Plattform
- Security Header (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Strikte Trennung zwischen öffentlichen und Admin-Endpunkten

## 3.2 Applikation
- Input-Validierung für alle Request-Payloads
- Defensives Error-Handling ohne sensible Leaks
- Rate-Limits und Abuse-Schutz für öffentliche Endpunkte

## 3.3 Daten & Secrets
- Secrets nur via Environment/Secret-Manager
- Kein Persistieren von Access-Tokens im Klartext
- Regelmäßige Dependency-Audits

## 4) Security-Verifikation
- CI-Pflichtchecks:
  - `npm audit --omit=dev --audit-level=moderate`
  - Secret-Scanning
  - (optional) SAST (z. B. CodeQL/Semgrep)
- Geplante Erweiterung: regelmäßige Threat-Model-Reviews

## 5) Responsible Disclosure
Bitte melde Security-Probleme verantwortungsvoll und nicht öffentlich mit Exploit-Details.

Empfohlener Inhalt einer Meldung:
- betroffene Route/Komponente
- reproduzierbare Schritte
- Impact
- ggf. Mitigation-Vorschlag
