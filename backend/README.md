# Backend

## Run

- Install dependencies: npm install
- Start server: npm start

## Supabase Setup

1. Copy `.env.example` to `.env`.
2. Set `SUPABASE_URL` to your project URL (for example `https://<project-ref>.supabase.co`).
3. For backend server code, set one of the following keys:
	- `SUPABASE_SECRET_KEY` (recommended)
	- `SUPABASE_SERVICE_ROLE_KEY` (legacy naming)
	- `SUPABASE_KEY` or `SUPABASE_PUBLISHABLE_KEY` (works, but not recommended for admin backend operations)

### Which key should I use?

- `publishable` key: safe for frontend/browser clients, limited by RLS.
- `secret`/`service role` key: for trusted backend server code only, never expose to frontend.

If your backend needs elevated actions (admin writes, bypass RLS, server-only workflows), use `SUPABASE_SECRET_KEY`.

## Team Workflow (Shared Database, Safe Secrets)

Use one shared Supabase project for the whole team, but never commit keys.

1. Keep `.env.example` in git with variable names only.
2. Each teammate creates their own local `.env` from `.env.example`.
3. Store real keys in a secure team password manager (for example 1Password/Bitwarden), not in git or chat.
4. Add the same environment variables in deployment platform settings (staging/production).

### New Teammate Setup

1. `cd backend`
2. `cp .env.example .env`
3. Fill in:
	- `SUPABASE_URL` (same project URL for everyone)
	- `SUPABASE_SECRET_KEY` (backend secret key from secure vault)
4. `npm install`
5. `npm start`
6. Verify setup:
	- `GET http://localhost:8000/api/health` should return `{"status":"ok"}`
	- `GET http://localhost:8000/api/health/supabase` should return Supabase status JSON

### Security Rules

- Never paste secret keys into source files.
- Never commit `.env`.
- If a key is exposed, rotate it immediately in Supabase Dashboard and update the team vault.
