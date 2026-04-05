# Project Setup Guide

This project uses Next.js. Follow these steps to get it running on your machine.

## Prerequisites

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- Git
- A code editor (VS Code recommended)

## Setup Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd s26-group-20
```

### 2. Navigate to the Next.js App
```bash
cd f1-inside-the-grid
```

### 3. Install Dependencies
```bash
npm install
```

**Important:** This step is required after cloning. It downloads all the packages needed to run the app. Without it, you'll get "next is not recognized" error.

### 4. Set Up Environment Variables
Create a `.env.local` file in the `f1-inside-the-grid` folder with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Ask the project lead for these credentials - they're in the Supabase dashboard.

### 5. Run the Development Server
```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.2.33
  - Local:        http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Done! 🎉

## Troubleshooting

### "next is not recognized as an internal or external command"
You're in the wrong folder. Make sure you're inside `f1-inside-the-grid/`:
```bash
cd f1-inside-the-grid
npm run dev
```

### "Cannot find module '@supabase/supabase-js'"
You skipped step 3. Run:
```bash
npm install
```

### "NEXT_PUBLIC_SUPABASE_URL is not set"
Create the `.env.local` file (step 4). The app won't work without Supabase credentials.

### App won't load/blank page
- Check the browser console for errors (F12)
- Make sure `.env.local` has correct Supabase credentials
- Restart the dev server (Ctrl+C, then `npm run dev` again)

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code quality
```

## Project Structure

```
f1-inside-the-grid/
├── app/
│   ├── api/cars-drivers/route.ts    # Database API endpoint
│   ├── components/                   # React components
│   ├── page.tsx                      # Home page
│   ├── cars-and-drivers/page.tsx     # Cars & Drivers page
│   └── globals.css                   # Global styles
├── public/                           # Static files
├── .env.local                        # Environment variables (NOT shared to GitHub)
└── package.json                      # Dependencies
```

## Questions?

Ask the project lead or check the main README.md for more details.
