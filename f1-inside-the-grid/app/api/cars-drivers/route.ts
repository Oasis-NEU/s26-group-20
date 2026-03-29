import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const COUNTRY_CODE_BY_NATIONALITY: Record<string, string> = {
  british: 'GB',
  'united kingdom': 'GB',
  german: 'DE',
  french: 'FR',
  italian: 'IT',
  spanish: 'ES',
  dutch: 'NL',
  netherlands: 'NL',
  finnish: 'FI',
  australian: 'AU',
  mexico: 'MX',
  mexican: 'MX',
  thai: 'TH',
  canadian: 'CA',
  danish: 'DK',
  monegasque: 'MC',
  monaco: 'MC',
  japanese: 'JP',
  chinese: 'CN',
  argentine: 'AR',
  austrian: 'AT',
  swiss: 'CH',
  belgian: 'BE',
  brazilian: 'BR',
  american: 'US',
  'united states': 'US',
  usa: 'US',
}

const KNOWN_2024_DRIVERS = new Set([
  'max verstappen',
  'sergio perez',
  'lewis hamilton',
  'george russell',
  'charles leclerc',
  'carlos sainz',
  'lando norris',
  'oscar piastri',
  'fernando alonso',
  'lance stroll',
  'esteban ocon',
  'pierre gasly',
  'alexander albon',
  'logan sargeant',
  'yuki tsunoda',
  'daniel ricciardo',
  'valtteri bottas',
  'zhou guanyu',
  'kevin magnussen',
  'nico hulkenberg',
])

const KNOWN_2024_CONSTRUCTORS = [
  'Red Bull',
  'Ferrari',
  'Mercedes',
  'McLaren',
  'Aston Martin',
  'Alpine',
  'Williams',
  'Haas',
  'RB',
  'Kick Sauber',
]

const TEAM_ACCENT_BY_NAME: Record<string, string> = {
  ferrari: '#4a0c11',
  mercedes: '#1c3b3a',
  'red bull': '#1a2d4f',
  mclaren: '#4d2816',
  'aston martin': '#13342a',
  alpine: '#1c2956',
  williams: '#1b3d5b',
  haas: '#492125',
  rb: '#21274b',
  'kick sauber': '#1b3f21',
}

function normalize(text: unknown) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function slugify(text: unknown) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toNumber(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function toBool(value: unknown) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1
  const normalized = normalize(value)
  return ['1', 'true', 'yes', 'y', 'active'].includes(normalized)
}

function pickValue(record: Record<string, unknown>, keys: string[], fallback: unknown = null) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) {
      return record[key]
    }
  }
  return fallback
}

function countryCodeToFlag(countryCode: string) {
  if (!countryCode || countryCode.length !== 2) return ''
  const upperCode = countryCode.toUpperCase()
  const first = upperCode.codePointAt(0)! - 65 + 0x1f1e6
  const second = upperCode.codePointAt(1)! - 65 + 0x1f1e6
  return String.fromCodePoint(first, second)
}

function resolveFlag(nationality: string) {
  const code = COUNTRY_CODE_BY_NATIONALITY[normalize(nationality)] || 'UN'
  return countryCodeToFlag(code) || '??'
}

function normalizeDriverRecord(record: Record<string, unknown>) {
  const id = String(pickValue(record, ['driver_id', 'id', 'driverId', 'driverid', 'driver_ref', 'driverRef'], ''))
  const firstName = String(pickValue(record, ['forename', 'first_name', 'firstName'], ''))
  const lastName = String(pickValue(record, ['surname', 'last_name', 'lastName'], ''))
  const fullName =
    String(pickValue(record, ['full_name', 'driver_name', 'name', 'fullName'], '')) ||
    `${firstName} ${lastName}`.trim()

  const code =
    String(pickValue(record, ['code', 'driver_code', 'abbreviation', 'short_code'], '')) ||
    fullName.split(' ').slice(-1)[0].slice(0, 3).toUpperCase()

  const nationality = String(pickValue(record, ['nationality', 'country', 'country_name', 'nation'], 'Unknown'))

  const championships = toNumber(
    pickValue(record, ['championships_count', 'championships', 'wdc_titles', 'world_championships'], 0),
  )
  const wins = toNumber(pickValue(record, ['race_wins', 'wins', 'career_wins'], 0))
  const poles = toNumber(pickValue(record, ['pole_positions', 'poles', 'career_poles'], 0))
  const points = toNumber(pickValue(record, ['points', 'career_points', 'total_points'], 0))
  const entries = toNumber(
    pickValue(record, ['race_entries', 'entries', 'starts', 'grand_prix_entries', 'total_entries'], 0),
  )
  const winRate = toNumber(pickValue(record, ['win_rate', 'career_win_rate', 'wins_rate'], 0))

  const active =
    toBool(pickValue(record, ['is_active', 'active', 'on_grid', 'current_grid_2024'], false)) ||
    KNOWN_2024_DRIVERS.has(normalize(fullName))

  return {
    id: id || slugify(fullName),
    name: fullName,
    code: String(code || 'UNK').toUpperCase(),
    nationality,
    flag: resolveFlag(nationality),
    championships,
    wins,
    poles,
    points,
    entries,
    winRate,
    active,
    slug: slugify(fullName),
  }
}

function normalizeConstructorRecord(record: Record<string, unknown>) {
  const name = String(pickValue(record, ['name', 'constructor_name'], '')).trim()
  const nationality = String(pickValue(record, ['nationality', 'country', 'country_name'], 'Unknown'))

  return {
    id: String(pickValue(record, ['constructorid', 'constructor_id', 'id'], slugify(name))),
    name,
    nationality,
    flag: resolveFlag(nationality),
    slug: slugify(name),
    accentColor: TEAM_ACCENT_BY_NAME[normalize(name)] || '#2a1014',
  }
}

export async function GET() {
  try {
    const supabase = createClient()

    const [{ data: driverRows, error: driverError }, { data: constructorRows, error: constructorError }] =
      await Promise.all([
        supabase.from('v_driver_full').select('*'),
        supabase.from('ergast_constructors').select('*'),
      ])

    if (driverError || constructorError) {
      throw new Error(driverError?.message || constructorError?.message || 'Failed to fetch Supabase data.')
    }

    const drivers = (driverRows || []).map((row) => normalizeDriverRecord(row as Record<string, unknown>)).filter((driver) => driver.name)
    const constructors = (constructorRows || [])
      .map((row) => normalizeConstructorRecord(row as Record<string, unknown>))
      .filter((team) => team.name)
      .filter((team) => KNOWN_2024_CONSTRUCTORS.some((known) => normalize(known) === normalize(team.name)))

    const uniqueDriverIds = new Set(drivers.map((driver) => driver.id))
    const worldChampions = new Set(drivers.filter((driver) => driver.championships > 0).map((driver) => driver.id))

    const currentGrid = drivers
      .filter((driver) => driver.active)
      .sort((a, b) => b.wins - a.wins || b.points - a.points)
      .slice(0, 20)
      .map((driver) => ({
        ...driver,
        profileUrl: `/drivers/${driver.slug}`,
      }))

    const allTimeLeaders = [...drivers]
      .sort((a, b) => b.wins - a.wins || b.poles - a.poles || b.points - a.points)
      .slice(0, 20)
      .map((driver, index) => ({
        rank: index + 1,
        ...driver,
        profileUrl: `/drivers/${driver.slug}`,
      }))

    const constructors2024 = constructors.map((team) => ({
      ...team,
      profileUrl: `/constructors/${team.slug}`,
    }))

    return NextResponse.json({
      status: 'ok',
      summary: {
        totalDrivers: uniqueDriverIds.size,
        active2024: currentGrid.length,
        totalConstructors: (constructorRows || []).length,
        worldChampions: worldChampions.size,
      },
      currentGrid,
      allTimeLeaders,
      constructors2024,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to load Cars & Drivers data.',
      },
      { status: 500 },
    )
  }
}
