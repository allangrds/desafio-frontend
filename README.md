# Frontend Challenge | YouTube Clone

A practical implementation of the Bycoders frontend challenge featuring video search, a compelling home experience, robust state management, and locally-persisted search history. Includes Google OAuth authentication and video upload capabilities.

[![Pull Request CI](https://github.com/allangrds/desafio-frontend/actions/workflows/pullrequest.yml/badge.svg)](https://github.com/allangrds/desafio-frontend/actions/workflows/pullrequest.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started) • [Quality](#quality--observability) • [Scripts](#useful-scripts)

---

## Features

- **Smart Video Search** - Real-time search with YouTube Data API v3
- **Featured Content** - Curated video recommendations on homepage
- **Google OAuth** - Seamless authentication with Google accounts
- **Video Upload** - Direct upload integration with YouTube
- **Persistent History** - Local storage for search history via Zustand
- **Modern UI** - Built with Radix UI primitives and TailwindCSS 4
- **Server Components** - Optimized with Next.js App Router architecture
- **Error Boundaries** - Graceful error handling with Sentry capture
- **Storybook** - Component documentation with a11y and interaction tests
- **Docker Ready** - Containerized development environment

---

## Tech Stack

### Core

- **Framework:** Next.js 16.0 (App Router)
- **React:** 19.2 (with React Compiler)
- **TypeScript:** 5.x (strict mode)
- **Styling:** TailwindCSS 4.x + Radix UI

### State & Forms

- **State Management:** Zustand 5.x
- **Form Handling:** React Hook Form + Zod 4 validation
- **Session Management:** Iron Session

### Testing & Documentation

- **Unit/Component:** Jest 30 + Testing Library
- **E2E:** Playwright 1.58
- **Component Docs:** Storybook 10 (a11y addon, Vitest integration)

### Observability & Quality

- **Error Tracking:** Sentry 10 (client + server + edge)
- **Code Quality:** Biome 2 (linting & formatting)
- **Performance:** Lighthouse CI
- **Bundle Budgets:** size-limit

### CI/CD & DX

- **Commits:** Conventional Commits with Commitizen
- **CI/CD:** GitHub Actions

---

## Table of Contents

- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Quick Start (Node)](#quick-start-node)
  - [Docker Setup](#docker-setup-alternative)
- [Quality & Observability](#quality--observability)
- [Useful Scripts](#useful-scripts)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Architecture

This project follows a feature-based architecture with clear separation of concerns between server and client components:

### High-Level Architecture

```text
App Router (page.tsx) - SERVER
    ↓
Feature Component (home.tsx) - SERVER
    ↓ (slots with React.Suspense)
    ├─→ Server Components (UserMenu, FeaturedVideos) - SERVER
    │       ↓
    │   Internal API Routes (/api/*) - SERVER
    │       ↓
    │   Services (YouTube API Service) - SERVER
    │
    └─→ Container (home.container.tsx) - CLIENT
            ↓
        Hooks (useHomeLogic) - CLIENT
            ↓
        Stores (Zustand + localStorage) - CLIENT
            ↓
        View (home.view.tsx) - CLIENT
```

### Key Concepts

- **Server Components**: Handle data fetching and API calls (default in Next.js App Router)
- **Client Components**: Manage interactivity, state, and user interactions (`'use client'`)
- **Suspense Boundaries**: Enable streaming and progressive loading states
- **Container/View Pattern**: Separates business logic (container) from presentation (view)
  - **Testability**: Views are pure functions of props
  - **Reusability**: Logic extracted to hooks can be shared across features
  - **Maintainability**: UI changes don't affect business logic

---

## Getting Started

### Prerequisites

- Node 22.14+ (use `nvm use`) or Docker
- A YouTube Data API v3 key
- A Google Cloud OAuth 2.0 Client (Client ID + Secret)
- A Sentry project DSN (optional, for error tracking)

### Environment Setup

1. Copy the environment file:

   ```bash
   cp .env.example .env
   ```

2. Fill in the required variables (see table below):

| Variable | Required | Description |
| --- | --- | --- |
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 key ([Google Cloud Console](https://console.cloud.google.com)) |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL of the app, e.g. `http://localhost:3000` |
| `GOOGLE_CLIENT_ID` | Yes | OAuth 2.0 Client ID (Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | Yes | OAuth 2.0 Client Secret |
| `GOOGLE_REDIRECT_URI` | Yes | OAuth callback URL, e.g. `http://localhost:3000/api/auth/callback` |
| `SESSION_SECRET` | Yes | Session encryption secret — **minimum 32 characters** |
| `SENTRY_DSN` | No | Sentry DSN for server-side error capture |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN for client-side error capture |
| `VERCEL_URL` | No | Injected automatically on Vercel deployments |
| `PORT` | No | Server port (default: `3000`) |

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

1. **Start the container** (with logs):

   ```bash
   make up
   ```

   Builds and runs the app in development mode with hot-reload.

2. **Start in background** (detached):

   ```bash
   make up-silent
   ```

3. **Other commands:**

   ```bash
   make down      # Stop containers
   make logs      # Tail container logs
   make restart   # Restart containers
   make shell     # Open a shell inside the container
   ```

---

## Quality & Observability

### Error Handling

React Error Boundaries wrap all critical UI regions. Unhandled errors are automatically captured in Sentry with full context (user, session, stack trace).

### Rate Limiting

API routes are protected by rate limiting middleware to prevent abuse and quota exhaustion of the YouTube API.

### Security Headers

All responses include production-grade headers configured in `next.config.ts`:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | Allowlists YouTube, Google, and self origins |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Restricts fullscreen and picture-in-picture to self |

### Test Coverage

Coverage is enforced at **80% minimum** (statements, branches, functions, lines) — the CI pipeline fails if thresholds are not met.

### Lighthouse CI

Automated performance audits run on every build:

| Category | Threshold |
| --- | --- |
| Performance | ≥ 85 |
| Accessibility | ≥ 90 |
| SEO | 100 |
| Best Practices | ≥ 90 |

### Bundle Size

`size-limit` enforces JS bundle budgets to prevent performance regressions from unchecked dependency growth.

---

## Useful Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run type-check` | TypeScript type checking (`tsc --noEmit`) |
| `npm run lint` | Static analysis with Biome |
| `npm run format` | Auto-format with Biome |
| `npm run test` | Run Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run test:e2e:ui` | Playwright interactive UI runner |
| `npm run test:e2e:headed` | Playwright in headed mode (debug) |
| `npm run lighthouse:ci` | Run Lighthouse CI audit |
| `npm run storybook` | Storybook dev server on port 6006 |
| `npm run build-storybook` | Build Storybook static files |
| `npm run commit:create` | Interactive commit with Commitizen |
| `npm run size-limit` | Check JS bundle size budgets |

---

## CI/CD Pipeline

Every pull request triggers the GitHub Actions workflow, which runs in order:

1. **Lint** — Biome static analysis
2. **Type check** — `tsc --noEmit`
3. **Tests** — Jest unit/component suite with coverage thresholds
4. **E2E** — Playwright end-to-end tests
5. **Build** — Next.js production build
6. **Lighthouse CI** — Performance and accessibility audit
7. **Bundle size** — size-limit budget check

All steps must pass before a PR can be merged.
