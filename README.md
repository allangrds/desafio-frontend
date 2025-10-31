# Frontend Challenge | YouTube Clone

A practical implementation of the Bycoders frontend challenge: a video platform client powered by the YouTube Data API v3. The app focuses on search, a compelling home experience, state management, and a locally-persisted search history. Stretch goals include Google OAuth and video upload.

## Summary

- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Useful Scripts](#useful-scripts)

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
  - **Testability**: Views are pure functions of props
  - **Reusability**: Logic extracted to hooks can be shared
  - **Maintainability**: UI changes don't affect business logic

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
