# Shilp Sahayak

**Smart India Hackathon 2026 · Problem Statement SIH26090**  
AI-driven market linkage and smart cataloging for marginalized artisans — frontend-only demonstration prototype.

## Run locally

```sh
npm install
npm run dev
```

Open the local address printed by Vite. Use `npm run build` to create a production build and `npm run lint` to run ESLint.

## Demo flow

Start on the artisan dashboard, create a product through the five-step wizard, upload a local image, review the catalog and sample price estimate, then save or publish the listing. Toggle Offline / Online in the top bar and use Sync now to simulate synchronization. Explore product cards, the marketplace, GeM / ONDC demo destinations, artisan story and profile.

## Prototype boundaries

Voice capture, catalog generation, photo improvements, fair-price suggestions, GeM / ONDC publishing, purchase and sync are all simulated in the browser. Product drafts, artisan profile, language and online/offline preference are stored in localStorage. Product images are selected locally by the user; starter mock listings use illustrative emoji artwork. There is no backend, payment flow, real AI, voice service or external marketplace integration.

## Stack

React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React and localStorage.# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
