# F1 Inside the Grid

F1 Inside the Grid is a Next.js application designed to make Formula 1 easier to understand while still being useful to dedicated fans.

The app combines:

- A newcomer-friendly mission section on the homepage
- A glossary-driven learning experience
- Historical context and key F1 facts
- A data-heavy Cars and Drivers experience with profile pages

## Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Supabase (`@supabase/supabase-js`)

## Core Routes

- `/` - Homepage with hero and always-visible Our Mission section
- `/learn` - F1 jargon and glossary content
- `/history` - history and fun-facts experience
- `/cars-and-drivers` - cars and drivers hub
- `/drivers/[id]` - dynamic driver profile page
- `/constructors/[ref]` - dynamic constructor profile page

## API Routes

- `/api/glossary` - returns glossary terms
- `/api/cars-drivers` - returns summary stats, current grid, leaders, and constructor data

## Environment Variables

Create `.env.local` in this folder:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

If these values are missing, server-side data fetches will fail.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open:

- http://localhost:3000

## Scripts

- `npm run dev` - run development server
- `npm run build` - build for production
- `npm run start` - start production server
- `npm run lint` - run linting

## Project Structure (High Level)

```text
f1-inside-the-grid/
	app/
		api/
			cars-drivers/route.ts
			glossary/route.ts
		cars-and-drivers/page.tsx
		constructors/[ref]/page.tsx
		drivers/[id]/page.tsx
		history/page.tsx
		learn/page.tsx
		components/
			CarsDriversSection.tsx
			ContentSections.tsx
			SiteNav.tsx
		layout.tsx
		page.tsx
	lib/
		supabase/server.ts
```

## Notes

- Navigation is route-based and shared globally through the layout.
- Driver and constructor pages are linked from the Cars and Drivers flow.
