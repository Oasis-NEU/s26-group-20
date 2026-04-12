import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type ConstructorIdentity = {
  name: string
  nationality: string
}

type ConstructorSeasonStats = {
  total_races: number
  total_wins: number
  championships: number
  first_season: number | null
  last_season: number | null
}

type ConstructorSeasonRow = {
  season_year: number
  position: number | null
  races: number
  wins: number
  points: number
}

type ConstructorDriver = {
  driver_slug: string | null
  name: string
  nationality: string
  first_season: number | null
  last_season: number | null
  races: number
  wins: number
}

type ConstructorProfile = {
  identity: ConstructorIdentity
  season_stats: ConstructorSeasonStats
  season_by_season: ConstructorSeasonRow[]
  drivers: ConstructorDriver[]
}

const NATIONALITY_FLAGS: Record<string, string> = {
  Argentina: '🇦🇷',
  Australia: '🇦🇺',
  Austria: '🇦🇹',
  Belgium: '🇧🇪',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  China: '🇨🇳',
  Colombia: '🇨🇴',
  Denmark: '🇩🇰',
  Finland: '🇫🇮',
  France: '🇫🇷',
  Germany: '🇩🇪',
  'East Germany': '🇩🇪',
  'West Germany': '🇩🇪',
  India: '🇮🇳',
  Indonesia: '🇮🇩',
  Ireland: '🇮🇪',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Mexico: '🇲🇽',
  Monaco: '🇲🇨',
  Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿',
  Portugal: '🇵🇹',
  Russia: '🇷🇺',
  'South Africa': '🇿🇦',
  Spain: '🇪🇸',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Thailand: '🇹🇭',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
}

function getFlag(nationality: string): string {
  const primary = nationality.split('/')[0]?.trim()
  return (primary && NATIONALITY_FLAGS[primary]) || '🏁'
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toNullableNumber(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toText(value: unknown): string {
  return String(value ?? '').trim()
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p
      style={{
        fontSize: '11px',
        fontWeight: 800,
        color: 'var(--accent)',
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        marginBottom: '14px',
      }}
    >
      {title}
    </p>
  )
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      style={{
        background: '#0c0213',
        borderRadius: '10px',
        border: highlight ? '1px solid rgba(255,0,60,0.3)' : '1px solid rgba(255,255,255,0.08)',
        padding: '16px 18px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          color: '#a0a0aa',
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          marginBottom: '6px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '26px',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '.02em',
          color: highlight ? '#ff003c' : '#f5f5f5',
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default async function ConstructorProfilePage({ params }: { params: { ref: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_constructor_profile', { p_constructor_ref: params.ref })

  if (error || !data || typeof data !== 'object') {
    notFound()
  }

  const identityRaw = (data as Record<string, unknown>).identity
  const seasonStatsRaw = (data as Record<string, unknown>).season_stats
  const seasonBySeasonRaw = ((data as Record<string, unknown>).season_by_season as unknown[]) ?? []
  const driversRaw = ((data as Record<string, unknown>).drivers as unknown[]) ?? []

  if (!identityRaw || !seasonStatsRaw) {
    notFound()
  }

  const identity: ConstructorIdentity = {
    name: toText((identityRaw as Record<string, unknown>).name),
    nationality: toText((identityRaw as Record<string, unknown>).nationality) || 'Unknown',
  }

  const season_stats: ConstructorSeasonStats = {
    total_races: toNumber((seasonStatsRaw as Record<string, unknown>)?.total_races),
    total_wins: toNumber((seasonStatsRaw as Record<string, unknown>)?.total_wins),
    championships: toNumber((seasonStatsRaw as Record<string, unknown>)?.championships),
    first_season: toNullableNumber((seasonStatsRaw as Record<string, unknown>)?.first_season),
    last_season: toNullableNumber((seasonStatsRaw as Record<string, unknown>)?.last_season),
  }

  const season_by_season: ConstructorSeasonRow[] = seasonBySeasonRaw
    .map((row) => row as Record<string, unknown>)
    .map((row) => ({
      season_year: toNumber(row.season_year),
      races: toNumber(row.races),
      wins: toNumber(row.wins),
      points: toNumber(row.points),
      position: toNullableNumber(row.position),
    }))
    .filter((row) => row.season_year > 0)
    .sort((a, b) => b.season_year - a.season_year)

  const drivers: ConstructorDriver[] = driversRaw
    .map((row) => row as Record<string, unknown>)
    .map((row) => ({
      driver_slug: toText(row.driver_slug) || null,
      name: toText(row.name),
      nationality: toText(row.nationality) || 'Unknown',
      first_season: toNullableNumber(row.first_season),
      last_season: toNullableNumber(row.last_season),
      races: toNumber(row.races),
      wins: toNumber(row.wins),
    }))
    .filter((row) => row.name)

  const seasons_active =
    season_stats.first_season != null && season_stats.last_season != null
      ? season_stats.last_season - season_stats.first_season + 1
      : 0

  const profile: ConstructorProfile = {
    identity,
    season_stats,
    season_by_season,
    drivers,
  }

  if (!profile.identity.name) notFound()

  return (
    <div style={{ minHeight: '100vh', background: '#050007', color: '#f5f5f5' }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          pointerEvents: 'none',
          zIndex: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(180,0,0,0.18) 0%, transparent 70%)',
        }}
      />

      <main
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '960px',
          margin: '0 auto',
          padding: '40px 32px 80px',
        }}
      >
        <nav
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            marginBottom: '40px',
            fontSize: '12px',
            flexWrap: 'wrap',
          }}
        >
          <Link href="/" style={{ color: '#a0a0aa' }}>
            Home
          </Link>
          <span style={{ color: '#555' }}>{'>'}</span>
          <Link href="/cars-and-drivers" style={{ color: '#a0a0aa' }}>
            Cars &amp; Drivers
          </Link>
          <span style={{ color: '#555' }}>{'>'}</span>
          <span style={{ color: '#f5f5f5' }}>{identity.name}</span>
        </nav>

        <section style={{ marginBottom: '36px' }}>
          <h1
            style={{
              fontSize: 'clamp(38px, 6vw, 72px)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '.03em',
              lineHeight: 0.92,
              marginBottom: '14px',
              fontFamily: 'Barlow Condensed, sans-serif',
              color: '#f5f5f5',
              textShadow:
                season_stats.championships > 0
                  ? '0 0 40px rgba(255,0,60,0.35), 0 0 80px rgba(255,0,60,0.15)'
                  : 'none',
            }}
          >
            {identity.name}
          </h1>

          <p style={{ fontSize: '15px', color: '#a0a0aa', marginBottom: '6px' }}>
            {getFlag(identity.nationality)} {identity.nationality}
          </p>

          {season_stats.first_season != null && season_stats.last_season != null && (
            <p style={{ fontSize: '13px', color: '#a0a0aa' }}>
              {season_stats.first_season === season_stats.last_season
                ? season_stats.first_season
                : `${season_stats.first_season} — ${season_stats.last_season}`}
            </p>
          )}
        </section>

        <section style={{ marginBottom: '36px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px',
            }}
          >
            <StatBox label="Total Races" value={season_stats.total_races.toLocaleString()} />
            <StatBox label="Total Wins" value={season_stats.total_wins.toLocaleString()} highlight={season_stats.total_wins > 0} />
            <StatBox label="Championships" value={season_stats.championships.toLocaleString()} highlight={season_stats.championships > 0} />
            <StatBox label="Seasons Active" value={seasons_active.toLocaleString()} />
          </div>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <SectionHeader title="Season by Season" />
          <div
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '90px 60px 80px 60px 90px',
                padding: '10px 20px',
                background: 'rgba(255,0,60,0.06)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {['SEASON', 'POS', 'RACES', 'WINS', 'POINTS'].map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#ff003c',
                    letterSpacing: '.15em',
                  }}
                >
                  {h}
                </span>
              ))}
            </div>

            {season_by_season.map((s, i) => (
              <Link
                key={s.season_year}
                href={`/seasons/${s.season_year}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '90px 60px 80px 60px 90px',
                  padding: '12px 20px',
                  borderBottom: i < season_by_season.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  textDecoration: 'none',
                  background: s.position === 1 ? 'rgba(255,0,60,0.04)' : 'transparent',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: s.position === 1 ? '#ff003c' : '#f5f5f5',
                  }}
                >
                  {s.season_year}
                </span>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 900,
                    color: s.position === 1 ? '#ff003c' : '#a0a0aa',
                  }}
                >
                  {s.position != null ? `P${s.position}` : '-'}
                </span>
                <span style={{ fontSize: '14px', color: '#a0a0aa' }}>{s.races.toLocaleString()}</span>
                <span style={{ fontSize: '14px', color: s.wins > 0 ? '#f5f5f5' : '#555' }}>{s.wins.toLocaleString()}</span>
                <span style={{ fontSize: '14px', color: '#a0a0aa' }}>{s.points.toLocaleString()}</span>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <SectionHeader title="Drivers" />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '10px',
            }}
          >
            {drivers.map((driver) => {
              const yearText =
                driver.first_season != null && driver.last_season != null
                  ? driver.first_season === driver.last_season
                    ? String(driver.first_season)
                    : `${driver.first_season} — ${driver.last_season}`
                  : null

              const card = (
                <div
                  style={{
                    background: '#0c0213',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '14px 16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: '#f5f5f5',
                      textTransform: 'uppercase',
                      letterSpacing: '.06em',
                      marginBottom: '4px',
                      fontFamily: 'Barlow Condensed, sans-serif',
                    }}
                  >
                    {driver.name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#a0a0aa', marginBottom: '4px' }}>
                    {getFlag(driver.nationality)} {driver.nationality}
                  </p>
                  {yearText && <p style={{ fontSize: '12px', color: '#a0a0aa', marginBottom: '8px' }}>{yearText}</p>}
                  <p style={{ fontSize: '12px', color: '#a0a0aa' }}>
                    {driver.races.toLocaleString()} races · {driver.wins.toLocaleString()} wins
                  </p>
                </div>
              )

              if (driver.driver_slug) {
                return (
                  <Link key={`${driver.name}-${driver.driver_slug}`} href={`/drivers/${driver.driver_slug}`} style={{ textDecoration: 'none' }}>
                    {card}
                  </Link>
                )
              }

              return <div key={`${driver.name}-${driver.first_season ?? 'n/a'}`}>{card}</div>
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
