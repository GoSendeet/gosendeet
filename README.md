# GoSendeet

GoSendeet is a logistics and delivery web application that helps users create shipments, compare delivery options, track parcels, and manage operations across customer, admin, and franchise workflows. The frontend is built with React, TypeScript, and Vite, and integrates with a backend API for authentication, bookings, dispatch, notifications, and platform administration.

## Project Overview

The application includes:

- A public marketing and product site
- A delivery cost calculator and booking flow
- Parcel tracking and dispatch visibility pages
- Authentication flows for signup, signin, email verification, and password reset
- A user dashboard for managing bookings and profile settings
- An admin dashboard for profiles, companies, orders, pricing, and operational settings
- A franchise dashboard for franchise-specific operations

## Project Requirements

Before running the project locally, make sure you have:

- Node.js 20+ recommended
- npm 10+ recommended
- A valid Google Maps API key with Places enabled
- Access to the GoSendeet backend API

## Tech Stack

- React 19
- TypeScript 5
- Vite 6
- React Router 7
- TanStack Query 5
- Axios
- Tailwind CSS 4
- Radix UI
- React Hook Form + Zod

## Installation

```bash
npm install
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Environment Variables

Create or update your `.env` file with the values required by the app:

```env
VITE_GOOGLE_MAPS_KEY=your_google_maps_key
VITE_SECRET_KEY=your_secret_key
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_FRONTEND_BASE_URL=http://localhost:5173
```

Notes:

- `VITE_GOOGLE_MAPS_KEY` is used for Google Maps and Places autocomplete
- `VITE_API_BASE_URL` points to the backend API
- `VITE_FRONTEND_BASE_URL` is used for frontend callback and redirect flows

## Running Locally

```bash
npm run dev
```

The app runs locally at:

- Dev: [http://localhost:5173](http://localhost:5173)

## Deployment URLs

- local: [http://localhost:5173](http://localhost:5173)
- local: [http://localhost:5173](https://gosendeet-beta.vercel.app/)
- Prod: [https://gosendeet.vercel.app](https://gosendeet.com)

The project includes a `vercel.json` configuration for SPA rewrites and installation settings, which indicates Vercel-based deployment.

## Project Architecture

The codebase follows a feature-oriented structure around pages, shared components, layouts, hooks, services, and route guards.

```text
src/
  assets/          Static images, icons, fonts, and media
  components/      Shared UI and reusable app components
  constants/       Shared constants and reference data
  hooks/           Custom React hooks
  layouts/         Layout wrappers for homepage, auth, dashboard, and franchise routes
  lib/             Route guards, query client, utilities, and shared helpers
  pages/           Route-level screens grouped by domain
    admin/         Admin dashboard flows
    auth/          Authentication screens
    dashboard/     Logged-in user dashboard screens
    dispatch/      Public dispatch visibility page
    franchise/     Franchise dashboard screens
    home/          Marketing pages, tracking, FAQ, calculator, about, privacy, terms
  queries/         TanStack Query hooks for data fetching
  services/        Axios clients and API service modules
  types/           Shared TypeScript types
```

### Routing

Application routes are composed in `src/App.tsx` and organized into:

- Public routes for marketing pages and auth pages
- Protected user routes via `PrivateRoutes`
- Protected admin routes via `AdminRoutes`
- Franchise routes via `FranchiseLayout`
- Public dispatch and tracking routes for shipment visibility

### Data Layer

- API communication is handled with Axios service modules in `src/services`
- Server state is managed with TanStack Query from `src/queries` and `src/lib/query.ts`
- Authenticated requests use interceptors to attach bearer tokens and handle session expiration

### UI Layer

- Shared UI primitives live in `src/components/ui`
- Feature-specific screens live in `src/pages`
- Layout components define route shells for the different product areas

## Key Dependencies

Core runtime dependencies used in this project include:

- `react`, `react-dom`
- `react-router-dom`
- `@tanstack/react-query`
- `axios`
- `tailwindcss`, `@tailwindcss/vite`, `tailwind-merge`
- `@radix-ui/*`
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `@react-google-maps/api`
- `framer-motion`
- `sonner`

Development dependencies include:

- `vite`
- `typescript`
- `eslint`
- `@vitejs/plugin-react`

## External Integrations

- Google Maps Places API
- Chatwoot widget integration
- Backend API for auth, booking, dispatch, notifications, admin, and company management

## Project Links

- Repository: [https://github.com/GoSendeet/gosendeet](https://github.com/GoSendeet/gosendeet)
- Figma Screen: [Click here](https://www.figma.com/design/gi2CHnBIg2yyDOTmjzdKpF/GOSendeet-RRR?node-id=0-1&p=f&t=oz1KrPlo8YLWWjGM-0)

## Build and Deployment Notes

- The app is bundled with Vite
- Production builds are created with `npm run build`
- Vercel rewrites all routes to `/` so client-side routing works correctly
- `npm install --legacy-peer-deps` is configured as the Vercel install command
