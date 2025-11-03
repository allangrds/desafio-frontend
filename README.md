# 🎬 Frontend Challenge | YouTube Clone

A practical implementation of the Bycoders frontend challenge featuring video search, a compelling home experience, robust state management, and locally-persisted search history. Includes Google OAuth authentication and video upload capabilities.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

[Features](#features) • [Architecture](#architecture) • [Getting Started](#getting-started)

---

## Features

- 🔍 **Smart Video Search** - Real-time search with YouTube Data API v3
- 🎥 **Featured Content** - Curated video recommendations on homepage
- 🔐 **Google OAuth** - Seamless authentication with Google accounts
- 📤 **Video Upload** - Direct upload integration with YouTube
- 💾 **Persistent History** - Local storage for search history
- 🎨 **Modern UI** - Built with Shadcn(Radix UI) and TailwindCSS
- ⚡ **Server Components** - Optimized with Next.js 15+ architecture
- 📚 **Storybook** - Component documentation and development
- 🐳 **Docker Ready** - Containerized development environment

## Tech Stack

### Core
- **Framework:** Next.js 16.0 (App Router)
- **React:** 19.2 (with React Compiler)
- **TypeScript:** 5.x (strict mode)
- **Styling:** TailwindCSS 4.x + Radix UI

### State & Forms
- **State Management:** Zustand 5.x
- **Form Handling:** React Hook Form + Zod validation
- **Session Management:** Iron Session

### Developer Experience
- **Code Quality:** Biome (linting & formatting)
- **Testing:** Jest, Testing Library
- **Commits:** Conventional Commits with Commitizen
- **CI/CD:** GitHub Actions + Lighthouse CI

## Table of Contents

- [Architecture](#️-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Quick Start (Node)](#quick-start-node)
  - [Docker Setup](#docker-setup-alternative)
  - [Development Tools](#development-tools)
- [Useful Scripts](#-useful-scripts)

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

- **Server Components**: Handle data fetching, API calls (default in Next.js 15)
- **Client Components**: Manage interactivity, state, and user interactions (marked with `'use client'`)
- **Suspense Boundaries**: Enable streaming and loading states
- **Container/View Pattern**: Separates business logic (container) from presentation (view)
  - **Testability**: Views are pure functions of props
  - **Reusability**: Logic extracted to hooks can be shared
  - **Maintainability**: UI changes don't affect business logic

---

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


