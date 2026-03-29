const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")
const path = require("path")

const envPaths = [
	path.resolve(process.cwd(), ".env"),
	path.resolve(process.cwd(), ".env.local"),
	path.resolve(__dirname, "../../.env"),
	path.resolve(__dirname, "../../.env.local"),
	path.resolve(__dirname, "../../../.env"),
	path.resolve(__dirname, "../../../.env.local"),
	path.resolve(__dirname, "../../../f1-inside-the-grid/.env.local"),
]

for (const envPath of envPaths) {
	dotenv.config({ path: envPath, override: false })
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey =
	process.env.SUPABASE_SECRET_KEY ||
	process.env.SUPABASE_SERVICE_ROLE_KEY ||
	process.env.SUPABASE_KEY ||
	process.env.SUPABASE_PUBLISHABLE_KEY ||
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
	""

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Supabase is not configured. Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and one key: SUPABASE_SECRET_KEY (preferred), SUPABASE_SERVICE_ROLE_KEY, SUPABASE_KEY, SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY.",
	)
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase }