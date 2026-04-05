import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('glossary')
      .select('id,term,short_definition,long_definition,category')
      .order('term', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to load glossary terms.' }, { status: 500 })
    }

    const terms = (data ?? []).map((row) => ({
      id: String(row.id ?? ''),
      term: String(row.term ?? '').trim(),
      short_definition: String(row.short_definition ?? '').trim(),
      long_definition: String(row.long_definition ?? '').trim(),
      category: String(row.category ?? '').trim(),
    })).filter((row) => row.id && row.term && row.short_definition)

    return NextResponse.json({ terms })
  } catch {
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 })
  }
}
