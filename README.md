# Frontend Challenge | YouTube Clone

## Overview

A practical implementation of the Bycoders frontend challenge: a video platform client powered by the YouTube Data API v3. The app focuses on search, a compelling home experience, state management, and a locally-persisted search history. Stretch goals include Google OAuth and video upload.

## Summary

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Technical Decisions](#technical-decisions)
- [Getting Started (optional)](#getting-started-optional)
- [Useful Scripts (optional)](#useful-scripts-optional)

## Tech Stack

- Runtime and tooling
  - Node.js >= 22.14.0, npm >= 10.9.2 (nvm supported via `.nvmrc`)
  - Docker + Docker Compose (optional local environment)
- Framework and language
  - Next.js 16 (App Router, SSR, Server Components)
  - React 19 with React Compiler (babel-plugin-react-compiler)
  - TypeScript 5
- Styling and UI
  - Tailwind CSS 4 + PostCSS
  - shadcn/ui (Radix UI under the hood)
  - class-variance-authority, tailwind-merge, clsx
  - lucide-react (icons)
- State and data
  - Zustand 5 (with localStorage persistence middleware)
  - MSW (Mock Service Worker) for API mocking in dev/tests)
- Quality and DX
  - Biome 2 (linter/formatter)
  - Commitizen + Conventional Commits, Commitlint
- Testing
  - Jest 30 + Testing Library (+ jsdom)
  - Playwright for E2E
  - Stryker Mutator for mutation testing
  - Storybook 10 (+ Docs, A11y, Vitest addon)

Versions reflect `package.json` in this repo.

## Project Architecture

```text
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx  Base layout
│  │  ├─ page.tsx  Base content route file
│  │  └─ api/  Base folder por internal /api
│  ├─ features/
│  │  └─ home/
│  │     ├─ index.ts  Export all components, props and types
│  │     ├─ home.logical.tsx  Contains hooks, stores and other business logic informations
│  │     ├─ home.view.tsx
│  │     ├─ home.test.tsx
│  │     ├─ home.hooks.tsx
│  │     └─ home.types.ts
│  ├─ components/
│  │  ├─ ui/  For shadcn
│  │  └─ shared/  Shared between features
│  │     └─ header/
│  │        ├─ index.ts  Export all components, props and types
│  │        ├─ header.tsx
│  │        ├─ header.stories.tsx
│  │        ├─ header.test.tsx
│  │        └─ header.types.ts
│  ├─ mocks/
│  ├─ stores/
│  ├─ services/
│  ├─ di/  service factory (injects implementations)
│  └─ types/  For sharable types
└─ tests/  Folder for E2E tests
```

Notes

- Feature-based structure keeps business logic and UI close while maintaining separation between view (`*.view.tsx`) and logic (`*.logical.tsx`, hooks, stores).
- `components/ui` hosts shadcn primitives; `components/shared` hosts reusable composites across features.
- `di` centralizes dependency injection/factories to decouple services from views.
- `tests` focuses on E2E flows (Playwright). Unit/integration tests live next to their subjects.


## Technical Decisions

- Next.js 16 with App Router and Server Components
  - Enables SSR/streaming and a clear data-fetching model for fast first paint and good SEO.
- React 19 + React Compiler
  - Opts into new React performance model; the compiler reduces avoidable re-renders without manual memoization.
- State management with Zustand 5
  - Minimal, ergonomic global state with persistence middleware to keep the search history locally.
- API interactions with MSW in dev/tests
  - Mocks YouTube endpoints to make development and test runs stable and deterministic.
- Testing strategy
  - Unit/Integration: Jest + Testing Library (+ jsdom) close to components.
  - E2E: Playwright for user-centric flows.
  - Mutation: Stryker ensures tests are meaningful by killing mutants.
- Code quality and commits
  - Biome (lint/format) keeps the codebase consistent and fast to check.
  - Commitizen + Commitlint enforce Conventional Commits, improving history/changelogs.

These choices aim to balance delivery speed, testability, and long-term maintainability.

## Getting Started (optional)

Prerequisites

- Node 22.14+ (use `nvm use`) or Docker
- A YouTube Data API v3 key (for live API usage)

Quick start

1. Install dependencies: `npm install`
2. Run the app: `npm run dev`
3. Open Storybook: `npm run storybook`
4. Run tests: `npm test` (unit), `npm run test:mutation`, `npx playwright test`

Docker (optional)

- Build and run via Docker Compose if you prefer a containerized setup.

## Useful Scripts (optional)

- `npm run dev` — Start Next.js in dev mode
- `npm run build` / `npm start` — Build and serve
- `npm run lint` / `npm run format` — Biome check/format
- `npm run storybook` — Start Storybook locally
- `npm test` / `npm run test:coverage` — Unit tests
- `npx playwright test` — E2E tests
- `npm run test:mutation` — Mutation testing (Stryker)
- `npm run commit:create` — Create a Conventional Commit interactively

