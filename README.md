# F1 Inside the Grid

This repository contains the F1 Inside the Grid project workspace.

## Main App

The active web app lives in:

- `f1-inside-the-grid/`

It is a Next.js 14 application that helps users:

- Learn Formula 1 terminology
- Explore F1 history and context
- Browse drivers, constructors, and team profiles backed by Supabase data

## Quick Start

1. Install dependencies in the app folder:

```bash
cd f1-inside-the-grid
npm install
```

2. Create `f1-inside-the-grid/.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Start development server:

```bash
npm run dev
```

4. Open:

- http://localhost:3000

## Useful Commands

Run these inside `f1-inside-the-grid/`:

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production build locally
- `npm run lint` - run lint checks

## Documentation

- App-specific docs: `f1-inside-the-grid/README.md`
- Setup walkthrough: `SETUP.md`
