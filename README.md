# Tagesmutter Hamm-Mitte – CMS Website

This is the source code of a website for a daycare. The project is based on **React**, **TypeScript** and **Vite** und functions as simple Content-Management-System (CMS).

## Features

- **Modular Content Blocks:** Sites are built from reusable content bloks
- **Image Management:** Images are loaded safely and can be provided with sources and licences.
- **Responsive Design:** Optimized for Desktop and mobile devices.
- **Easy expandability:** New content blocks, block contents and sites can be added easily.

## Project structure

- `src/features/pages`: sites and content blocks
- `src/layout`: Layout components (Header, Footer, Navigation)
- `src/shared`: reusable components, types and utilities
- `src/pages`: static sites for better SEO
- `src/assets`: static files (images, icons)
- `public`: public assets
- `vite.config.ts`, `tsconfig.json`: Projektkonfiguration

## Development

```bash
# Installation der Abhängigkeiten
npm install

# Lokaler Entwicklungsserver
npm run dev

# Produktion bauen
npm run build
```

## Contribute

Pull requests and recommendations are welcome! Please note the structure and conventions of this project.

## Licence

This project is licensed under the MIT license.

---

**Notice:** This website is specifically for the content presentation of a daycare.