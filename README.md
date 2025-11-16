# Tagesmutter Hamm-Mitte – CMS Website

Dies ist das Quellcode-Repository für die Website einer Tagesmutter in Hamm-Mitte. Die Anwendung basiert auf **React**, **TypeScript** und **Vite** und dient als einfaches Content-Management-System (CMS), um Inhalte wie Texte, Bilder und Informationen flexibel zu verwalten.

## Features

- **Modulare Inhaltsblöcke:** Seiten bestehen aus wiederverwendbaren Komponenten (z.B. Text, Bilder, Kontakt).
- **Bildverwaltung:** Bilder werden sicher geladen und können mit Quellen und Lizenzen versehen werden.
- **Responsives Design:** Optimiert für Desktop und mobile Endgeräte.
- **Einfache Erweiterbarkeit:** Neue Inhaltsblöcke und Seiten können leicht hinzugefügt werden.

## Projektstruktur

- `src/features/pages`: Seiten und Inhaltsblöcke
- `src/layout`: Layout-Komponenten (Header, Footer, Navigation)
- `src/shared`: Wiederverwendbare Komponenten, Typen und Utilities
- `src/assets`: Statische Dateien (Bilder, Icons)
- `public`: Öffentliche Assets
- `vite.config.ts`, `tsconfig.json`: Projektkonfiguration

## Entwicklung

```bash
# Installation der Abhängigkeiten
npm install

# Lokaler Entwicklungsserver
npm run dev

# Produktion bauen
npm run build
```

## Mitwirken

Pull Requests und Vorschläge sind willkommen! Bitte beachte die Struktur und Konventionen des Projekts.

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz.

---

**Hinweis:** Die Website ist speziell für die Präsentation und Verwaltung der Inhalte einer Tagesmutter in Hamm-Mitte konzipiert.