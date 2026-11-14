# Hswele Ehin Tse — Product Design Portfolio

A responsive portfolio for UI/UX and product designer Hswele Ehin Tse. It brings together selected product work, design process, experience, and contact details in a restrained editorial layout with a plum and gold identity.

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production static export is written to out/.

## Project content

- Case study content and project imagery references are maintained in src/lib/projects.ts.
- Portfolio assets are in public/images.
- The hero carousel is a Three.js scene. Visitors can drag to rotate it, hold to pause, and use arrow keys; it honors reduced-motion preferences.
