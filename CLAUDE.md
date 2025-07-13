# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A monorepo-based Net Worth Tracker application built with React and Node.js. The application allows users to track their net worth by connecting financial accounts via Plaid and manually adding assets. Features include interactive dashboards, data visualization with Recharts, and comprehensive account management.

## Common Development Commands

### Root Project Commands

- `pnpm install` - Install all dependencies across the monorepo
- `pnpm dev` - Start both frontend and backend development servers

### Frontend (apps/web2)

- `cd apps/web2 && pnpm dev` - Start frontend development server (port 3000)
- `cd apps/web2 && pnpm build` - Build frontend for production
- `cd apps/web2 && pnpm lint` - Run ESLint
- `cd apps/web2 && pnpm format` - Run Prettier formatter
- `cd apps/web2 && pnpm check` - Run Prettier and ESLint with auto-fix
- `cd apps/web2 && pnpm test` - Run Vitest tests

### Backend (apps/api)

- `cd apps/api && pnpm dev` - Start backend development server with hot reload (port 3001)
- `cd apps/api && pnpm build` - Build TypeScript to JavaScript
- `cd apps/api && pnpm start` - Start production server

### Adding UI Components

Use shadcn/ui for new components:

```bash
cd apps/web2 && pnpx shadcn@latest add [component-name]
```

## Architecture Overview

### Monorepo Structure

- **apps/web2**: React frontend with TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui
- **apps/api**: Node.js backend with Hono framework, currently serving mock data
- **packages/**: Shared TypeScript types and utilities

### Frontend Architecture

- **Router**: TanStack Router with file-based routing
- **State Management**: TanStack Query for server state, React Context for theme
- **Styling**: Tailwind CSS with shadcn/ui components
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with TypeScript

### Backend Architecture

- **Framework**: Hono (lightweight web framework)
- **Runtime**: Node.js with TypeScript
- **Data**: Currently serves mock data from `/apps/api/src/lib/mock-data.ts`
- **API Design**: RESTful endpoints organized by feature (dashboard, accounts, assets, etc.)

### Key API Endpoints

- `/api/dashboard/summary` - Net worth summary data
- `/api/dashboard/cards` - Dashboard summary cards
- `/api/net-worth/history` - Historical net worth data
- `/api/accounts` - Account list and management
- `/api/assets/performance` - Asset performance data
- `/api/export` - Data export functionality

### Frontend Structure

- **Routes**: File-based routing in `/src/routes/`
- **Components**: Organized by feature in `/src/components/`
- **Services**: API layer in `/src/services/api.ts`
- **Hooks**: Custom hooks in `/src/hooks/`
- **Utils**: Utility functions in `/src/lib/`

### Data Flow

1. Frontend uses TanStack Query to fetch data from API
2. API service (`/src/services/api.ts`) abstracts all HTTP calls
3. Components consume data through custom hooks (`use-dashboard-queries.ts`)
4. Charts and visualizations built with Recharts
5. Theme state managed through React Context

### Development Server Setup

- Frontend runs on port 3000
- Backend runs on port 3001
- Vite proxy forwards `/api/*` requests to backend
- Hot reload enabled for both frontend and backend

### Styling and UI

- Tailwind CSS for utility-first styling
- shadcn/ui for pre-built accessible components
- Custom theme provider for dark/light mode
- Responsive design with mobile-first approach

## Testing

- Frontend: Vitest with React Testing Library setup
- Run tests: `cd apps/web2 && pnpm test`

## Future Implementation Notes

- Backend currently serves mock data; real Plaid integration planned
- Supabase authentication and database integration planned
- Redis caching for account balances planned
- Export functionality (CSV, JSON, PDF) partially implemented
