# Frontend Challenge | YouTube Clone

A practical implementation of the Bycoders frontend challenge: a video platform client powered by the YouTube Data API v3. The app focuses on search, a compelling home experience, state management, and a locally-persisted search history. Stretch goals include Google OAuth and video upload.

## Summary

- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Technical Decisions](#technical-decisions)
- [Getting Started](#getting-started)
- [Useful Scripts](#useful-scripts)
- [O que falta](#o-que-falta)

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
  - lucide-react (icons)
- State and data
  - Zustand 5 (with localStorage persistence middleware)
  - **MSW (Mock Service Worker) for API mocking in dev/tests)**
- Quality and DX
  - Biome 2 (linter/formatter)
  - Commitizen + Conventional Commits, Commitlint
- Testing
  - Jest 30 + Testing Library (+ jsdom)
  - Storybook 10
  - **Playwright for E2E**
  - **Stryker Mutator for mutation testing**

Versions reflect `package.json` in this repo.

## Project Architecture

This project follows a feature-based architecture with clear separation of concerns between server and client components:

### High-Level Architecture

```text
App Router (page.tsx) - SERVER
    ↓
Feature Component (home.tsx) - SERVER
    ↓ (slots with React.Suspense)
    ├─→ Server Components (UserMenu, FeaturedVideos) - SERVER
    │       ↓
    │   YouTube API Service - SERVER
    │
    └─→ Container (home.container.tsx) - CLIENT
            ↓
        Hooks (useHomeLogic) - CLIENT
            ↓
        Stores (Zustand + localStorage) - CLIENT
            ↓
        View (home.view.tsx) - CLIENT
```

**Key Concepts:**

- **Server Components**: Handle data fetching, API calls (default in Next.js 15)
- **Client Components**: Manage interactivity, state, and user interactions (marked with `'use client'`)
- **Suspense Boundaries**: Enable streaming and loading states
- **Container/View Pattern**: Separates business logic (container) from presentation (view)

### Folder Structure

```text
├─ src/
│  ├─ app/                      # Next.js App Router
│  │  ├─ layout.tsx             # Root layout
│  │  ├─ page.tsx               # Home page
│  │  ├─ results/               # Results page
│  │  └─ not-found.tsx          # 404 page
│  ├─ features/                 # Feature modules
│  │  ├─ home/
│  │  │  ├─ index.ts            # Public exports
│  │  │  ├─ home.tsx            # Main component
│  │  │  ├─ home.container.tsx  # Container (logic)
│  │  │  ├─ home.view.tsx       # Presentation
│  │  │  ├─ home.hooks.ts       # Custom hooks
│  │  │  └─ *.test.tsx          # Tests
│  │  └─ results/               # Similar structure
│  ├─ components/
│  │  ├─ ui/                    # shadcn/ui primitives
│  │  └─ shared/                # Reusable components
│  │     └─ header/
│  │        ├─ index.ts
│  │        ├─ header.tsx
│  │        └─ *.test.tsx
│  ├─ services/                 # API services
│  │  └─ youtube/
│  ├─ stores/                   # Global state (Zustand)
│  ├─ types/                    # Shared TypeScript types
│  └─ lib/                      # Utilities
└─ tests/                       # E2E tests (Playwright)
```

### Architecture Principles

- **Container/View Pattern**: Separates business logic from presentation
- **Feature-based**: Related code lives together
- **Server Components First**: Leverages Next.js 15 capabilities
- **Type Safety**: Full TypeScript coverage
- **Testing**: Unit, integration, and E2E tests

Notes

- Feature-based structure keeps business logic and UI close while maintaining separation between view (`*.view.tsx`) and container (`*.container.tsx`, hooks, stores).
- `components/ui` hosts shadcn primitives; `components/shared` hosts reusable composites across features.

## Getting Started

### Prerequisites

- Node 22.14+ (use `nvm use`) or Docker
- A YouTube Data API v3 key (for live API usage)

### Environment Setup

1. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. Add your YouTube API key to `.env`:

   ```env
   YOUTUBE_API_KEY=your_api_key_here
   ```

### Quick Start (Node)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

### Docker Setup (Alternative)

If you prefer a containerized environment, use the provided Makefile commands:

#### Development Mode

1. **Start the container** (with logs):

   ```bash
   make up
   ```

   This builds and runs the app in development mode with hot-reload.

2. **Start in background** (silent mode):

   ```bash
   make up-silent
   ```

3. **View logs**:

   ```bash
   make logs
   ```

4. **Stop the container**:

   ```bash
   make down
   ```

5. **Restart the container**:

   ```bash
   make restart
   ```

6. **Access container shell**:

   ```bash
   make shell
   ```
### Other Development Tools

- **Open Storybook**:

  ```bash
  npm run storybook
  ```

- **Run tests**:

  ```bash
  npm test                  # Unit tests
  npm run test:coverage     # With coverage
  npm run test:mutation     # Mutation testing
  npx playwright test       # E2E tests
  ```

## Useful Scripts

- `npm run dev` — Start Next.js in dev mode
- `npm run build` / `npm start` — Build and serve
- `npm run lint` / `npm run format` — Biome check/format
- `npm run storybook` — Start Storybook locally
- `npm test` / `npm run test:coverage` — Unit tests
- `npx playwright test` — E2E tests
- `npm run test:mutation` — Mutation testing (Stryker)
- `npm run commit:create` — Create a Conventional Commit interactively

## O que falta

- [ ] Implementar user auth/register
- [ ] Implementar video upload
- [ ] Implementar MSW
- [ ] Implementar testes E2E com Playwright
- [ ] Implementar testes de mutação com Stryker
- [ ] Verificar error boundaries
- [ ] 
