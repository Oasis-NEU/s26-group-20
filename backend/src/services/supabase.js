const { createClient } = require("@supabase/supabase-js")
const dotenv = require("dotenv")

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey =
	process.env.SUPABASE_SECRET_KEY ||
	process.env.SUPABASE_SERVICE_ROLE_KEY ||
	process.env.SUPABASE_KEY ||
	process.env.SUPABASE_PUBLISHABLE_KEY ||
	""

if (!supabaseUrl || !supabaseKey) {
	throw new Error(
		"Supabase is not configured. Set SUPABASE_URL and one key: SUPABASE_SECRET_KEY (preferred), SUPABASE_SERVICE_ROLE_KEY, SUPABASE_KEY, or SUPABASE_PUBLISHABLE_KEY.",
	)
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = { supabase }