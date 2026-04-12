import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

type Identity = {
  id: string
  name: string
  nationality: string
  is_active: boolean
  is_champion: boolean
  era_decade: number
  bio_short: string | null
  dob: string | null
  age: number | null
  driver_code: string | null
  car_number: number | null
  wikipedia_url: string | null
  first_season: number
  last_season: number
  years_active: number
  championships_count: number
  championship_years: number[] | null
}

type CareerStats = {
  race_entries: number
  race_starts: number
  race_wins: number
  pole_positions: number
  podiums: number
  fastest_laps: number
  points: number
}

type Rates = {
  win_rate: number
  podium_rate: number
  pole_rate: number
  fastest_lap_rate: number
  points_per_entry: number
  dominance_score: number | null
  era_win_rate_rank: number | null
  era_podium_rate_rank: number | null
}

type RecentResult = {
  season_year: number
  race_name: string
  circuit: string
  grid_position: number
  position_order: number
  position_text: string
  points: number
  status: string
}

type CircuitBestQ = {
  circuit_name: string
  country: string
  best_q3: string
  season_year: number
}

type CircuitStat = {
  circuit_name: string
  country: string
  starts: number
  wins: number
  podiums: number
  best_finish: number
}

type GlossaryCallout = {
  term_id: string
  term: string
  short_def: string
  display_note: string
}

type SeasonStanding = {
  season_year: number
  position: number
  points: number
  wins: number
}

type DriverProfile = {
  identity: Identity
  career_stats: CareerStats
  rates: Rates
  recent_results: RecentResult[] | null
  circuit_best_qualifying: CircuitBestQ[] | null
  circuit_stats: CircuitStat[] | null
  glossary_callouts: GlossaryCallout[] | null
  season_standings: SeasonStanding[] | null
}

async function getDriverProfile(id: string): Promise<DriverProfile | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_driver_profile', { p_driver_id: id })
  if (error || !data) return null
  return data as DriverProfile
}

const NATIONALITY_FLAGS: Record<string, string> = {
  Argentina: '🇦🇷',
  Australia: '🇦🇺',
  Austria: '🇦🇹',
  Belgium: '🇧🇪',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  Chile: '🇨🇱',
  China: '🇨🇳',
  Colombia: '🇨🇴',
  'Czech Republic': '🇨🇿',
  Denmark: '🇩🇰',
  Finland: '🇫🇮',
  France: '🇫🇷',
  Germany: '🇩🇪',
  'East Germany': '🇩🇪',
  'West Germany': '🇩🇪',
  Hungary: '🇭🇺',
  India: '🇮🇳',
  Indonesia: '🇮🇩',
  Ireland: '🇮🇪',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Malaysia: '🇲🇾',
  Mexico: '🇲🇽',
  Monaco: '🇲🇨',
  Morocco: '🇲🇦',
  Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Russia: '🇷🇺',
  'South Africa': '🇿🇦',
  Spain: '🇪🇸',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  Thailand: '🇹🇭',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Uruguay: '🇺🇾',
  Venezuela: '🇻🇪',
}

function getFlag(nationality: string): string {
  const primary = nationality.split('/')[0]?.trim()
  return (primary && NATIONALITY_FLAGS[primary]) || '🏁'
}

function formatPoints(points: number): string {
  return points % 1 === 0 ? points.toLocaleString() : points.toFixed(2)
}

function formatRate(rate: number): string {
  return (rate * 100).toFixed(1) + '%'
}

function positionDisplay(text: string): { label: string; color: string } {
  if (text === '1') return { label: 'P1', color: '#FFD700' }
  if (text === '2') return { label: 'P2', color: '#C0C0C0' }
  if (text === '3') return { label: 'P3', color: '#CD7F32' }
  if (text === 'R') return { label: 'DNF', color: 'var(--accent)' }
  if (text === 'D') return { label: 'DSQ', color: 'var(--accent)' }
  if (text === 'W') return { label: 'WD', color: 'var(--muted)' }
  if (text === 'N') return { label: 'NC', color: 'var(--muted)' }
  if (text === 'F') return { label: 'F', color: 'var(--muted)' }
  const n = Number.parseInt(text, 10)
  if (!Number.isNaN(n) && n <= 3) return { label: `P${n}`, color: 'var(--text)' }
  if (!Number.isNaN(n) && n <= 10) return { label: `P${n}`, color: 'var(--muted)' }
  if (!Number.isNaN(n)) return { label: `P${n}`, color: '#555' }
  return { label: text, color: '#777' }
}

function eraLabel(decade: number): string {
  const labels: Record<number, string> = {
    1950: 'Founding Era',
    1960: 'Rear-Engine Revolution',
    1970: 'Aerodynamic Age',
    1980: 'Turbo Era',
    1990: 'Electronics Era',
    2000: 'Schumacher Decade',
    2010: 'Hybrid Era',
    2020: 'Ground Effect Return',
  }
  return labels[decade] ?? `${decade}s`
}

function wikiUrl(slugOrUrl: string): string {
  if (slugOrUrl.startsWith('http://') || slugOrUrl.startsWith('https://')) return slugOrUrl
  return `https://en.wikipedia.org/wiki/${slugOrUrl}`
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

function StatBox({
  label,
  value,
  sub,
  highlight,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        borderRadius: '10px',
        border: highlight ? '1px solid rgba(255,0,60,0.3)' : '1px solid rgba(255,255,255,0.08)',
        padding: '16px 18px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          color: 'var(--muted)',
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
          color: highlight ? 'var(--accent)' : 'var(--text)',
        }}
      >
        {value}
      </p>
      {sub && <p style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{sub}</p>}
    </div>
  )
}

export default async function DriverProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const profile = await getDriverProfile(decodeURIComponent(params.id))
  if (!profile) notFound()

  const {
    identity,
    career_stats,
    rates,
    recent_results,
    circuit_best_qualifying,
    circuit_stats,
    glossary_callouts,
    season_standings,
  } = profile

  const hasQualifying = Boolean(circuit_best_qualifying && circuit_best_qualifying.length > 0)
  const hasCircuitWins = Boolean(circuit_stats && circuit_stats.some((c) => c.wins > 0))
  const hasGlossary = Boolean(glossary_callouts && glossary_callouts.length > 0)
  const hasStandings = Boolean(season_standings && season_standings.length > 0)
  const hasResults = Boolean(recent_results && recent_results.length > 0)
  const hasCode = Boolean(identity.driver_code || identity.car_number)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
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
          <Link href='/' style={{ color: 'var(--muted)' }}>
            Home
          </Link>
          <span style={{ color: '#555' }}>{'>'}</span>
          <Link href='/cars-and-drivers' style={{ color: 'var(--muted)' }}>
            Cars &amp; Drivers
          </Link>
          <span style={{ color: '#555' }}>{'>'}</span>
          <span style={{ color: 'var(--text)' }}>{identity.name}</span>
        </nav>

        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '40px',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '14px',
                flexWrap: 'wrap',
              }}
            >
              {identity.is_champion && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(255,0,60,0.15)',
                    border: '1px solid rgba(255,0,60,0.3)',
                    color: 'var(--accent)',
                    letterSpacing: '.06em',
                  }}
                >
                  {identity.championships_count}x WORLD CHAMPION
                </span>
              )}
              {identity.is_active && (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(0,200,100,0.1)',
                    border: '1px solid rgba(0,200,100,0.2)',
                    color: '#0dc86e',
                    letterSpacing: '.06em',
                  }}
                >
                  ACTIVE
                </span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--muted)',
                }}
              >
                {eraLabel(identity.era_decade)}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(38px, 6vw, 72px)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '.03em',
                lineHeight: 0.92,
                marginBottom: '16px',
                color: 'var(--text)',
                textShadow: identity.is_champion
                  ? '0 0 40px rgba(255,0,60,0.35), 0 0 80px rgba(255,0,60,0.15)'
                  : 'none',
              }}
            >
              {identity.name}
            </h1>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--muted)',
                marginBottom: '6px',
              }}
            >
              {getFlag(identity.nationality)} {identity.nationality}
            </p>

            <p style={{ fontSize: '13px', color: '#555' }}>
              {identity.first_season === identity.last_season ? (
                <>
                  Raced in <span style={{ color: 'var(--text)', fontWeight: 700 }}>{identity.first_season}</span> {' '}|{' '}
                  <span style={{ color: 'var(--text)', fontWeight: 700 }}>1</span> season
                </>
              ) : (
                <>
                  <span style={{ color: 'var(--text)', fontWeight: 700 }}>{identity.first_season}</span> - <span style={{ color: 'var(--text)', fontWeight: 700 }}>{identity.last_season}</span> {' '}|{' '}
                  <span style={{ color: 'var(--text)', fontWeight: 700 }}>{identity.years_active}</span> seasons
                </>
              )}
            </p>

            {identity.dob && (
              <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                b.{' '}
                {new Date(identity.dob).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {identity.is_active && identity.age != null && <span style={{ color: 'var(--muted)' }}> (age {identity.age})</span>}
              </p>
            )}
          </div>

          {hasCode && (
            <div
              style={{
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {identity.driver_code && (
                <p
                  style={{
                    fontSize: '64px',
                    fontWeight: 900,
                    letterSpacing: '.06em',
                    color: 'rgba(255,255,255,0.09)',
                    lineHeight: 1,
                    fontFamily: 'Barlow Condensed, sans-serif',
                  }}
                >
                  {identity.driver_code}
                </p>
              )}
              {identity.car_number && (
                <p
                  style={{
                    fontSize: '15px',
                    color: '#555',
                    marginTop: '4px',
                    letterSpacing: '.06em',
                  }}
                >
                  #{identity.car_number}
                </p>
              )}
            </div>
          )}
        </section>

        {identity.bio_short && (
          <section style={{ marginBottom: '32px' }}>
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderLeft: '3px solid var(--accent)',
                borderRadius: '12px',
                padding: '20px 24px',
              }}
            >
              <p
                style={{
                  fontSize: '15px',
                  color: 'var(--muted)',
                  lineHeight: 1.75,
                  fontFamily: 'Barlow, sans-serif',
                  fontWeight: 400,
                }}
              >
                {identity.bio_short}
              </p>
            </div>
          </section>
        )}

        {identity.is_champion && identity.championship_years && identity.championship_years.length > 0 && (
          <section style={{ marginBottom: '36px' }}>
            <SectionHeader title='World Championship Years' />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {identity.championship_years.map((year) => (
                <Link
                  key={year}
                  href={`/seasons/${year}`}
                  style={{
                    fontSize: '15px',
                    fontWeight: 800,
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    background: 'rgba(255,0,60,0.12)',
                    border: '1px solid rgba(255,0,60,0.35)',
                    color: 'var(--accent)',
                    letterSpacing: '.04em',
                    textDecoration: 'none',
                  }}
                >
                  {year}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section style={{ marginBottom: '36px' }}>
          <SectionHeader title='Career Stats' />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '10px',
            }}
          >
            <StatBox
              label='Race Entries'
              value={career_stats.race_entries.toLocaleString()}
              sub={career_stats.race_starts < career_stats.race_entries ? `${career_stats.race_starts} starts` : undefined}
            />
            <StatBox label='Race Wins' value={career_stats.race_wins.toLocaleString()} highlight={career_stats.race_wins > 0} />
            <StatBox label='Pole Positions' value={career_stats.pole_positions.toLocaleString()} />
            <StatBox label='Podiums' value={career_stats.podiums.toLocaleString()} />
            <StatBox label='Fastest Laps' value={career_stats.fastest_laps.toLocaleString()} />
            <StatBox label='Points' value={formatPoints(career_stats.points)} />
            <StatBox
              label='Championships'
              value={identity.championships_count.toLocaleString()}
              highlight={identity.championships_count > 0}
            />
            <StatBox label='Seasons' value={identity.years_active.toLocaleString()} />
          </div>
        </section>

        <section style={{ marginBottom: '36px' }}>
          <SectionHeader title='Performance Rates' />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <StatBox label='Win Rate' value={formatRate(rates.win_rate)} sub='wins / entries' />
            <StatBox label='Podium Rate' value={formatRate(rates.podium_rate)} sub='podiums / entries' />
            <StatBox label='Pole Rate' value={formatRate(rates.pole_rate)} sub='poles / entries' />
          </div>

          {rates.dominance_score != null && (
            <div
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '20px 22px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: '3px',
                    }}
                  >
                    Dominance score
                  </p>
                  <p style={{ fontSize: '11px', color: '#555' }}>(win rate x 0.5) + (podium rate x 0.3) + (pole rate x 0.2)</p>
                </div>
                <p
                  style={{
                    fontSize: '30px',
                    fontWeight: 900,
                    color: 'var(--text)',
                    letterSpacing: '.02em',
                    lineHeight: 1,
                  }}
                >
                  {rates.dominance_score.toFixed(4)}
                </p>
              </div>

              <div
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '9999px',
                  height: '5px',
                }}
              >
                <div
                  style={{
                    width: `${Math.min((rates.dominance_score / 0.5442) * 100, 100).toFixed(1)}%`,
                    background: 'var(--accent)',
                    height: '5px',
                    borderRadius: '9999px',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  gap: '8px',
                }}
              >
                <p style={{ fontSize: '11px', color: '#555' }}>0</p>
                {rates.era_win_rate_rank && (
                  <p style={{ fontSize: '11px', color: '#555', textAlign: 'center' }}>
                    Ranked #{rates.era_win_rate_rank} in the {identity.era_decade}s by win rate
                  </p>
                )}
                <p style={{ fontSize: '11px', color: '#555' }}>0.5442 (Fangio)</p>
              </div>
            </div>
          )}
        </section>

        {hasStandings && (
          <section style={{ marginBottom: '36px' }}>
            <SectionHeader title='Season by Season' />
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
                  gridTemplateColumns: '80px 60px 100px 60px',
                  padding: '10px 20px',
                  background: 'rgba(255,0,60,0.06)',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {['SEASON', 'POS', 'POINTS', 'WINS'].map((h) => (
                  <span
                    key={h}
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: 'var(--accent)',
                      letterSpacing: '.15em',
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {season_standings!.map((s, i) => (
                <Link
                  key={s.season_year}
                  href={`/seasons/${s.season_year}`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 60px 100px 60px',
                    padding: '12px 20px',
                    borderBottom: i < season_standings!.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    textDecoration: 'none',
                    background: s.position === 1 ? 'rgba(255,0,60,0.04)' : 'transparent',
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: 'var(--text)',
                    }}
                  >
                    {s.season_year}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 900,
                      color: s.position === 1 ? 'var(--accent)' : s.position <= 3 ? 'var(--text)' : 'var(--muted)',
                    }}
                  >
                    P{s.position}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'var(--muted)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {s.points.toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: s.wins > 0 ? 'var(--text)' : '#555',
                      fontWeight: s.wins > 0 ? 700 : 400,
                    }}
                  >
                    {s.wins > 0 ? s.wins : '-'}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {hasResults && (
          <section style={{ marginBottom: '36px' }}>
            <SectionHeader title='Recent Results' />
            <div
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              {recent_results!.map((r, i) => {
                const pos = positionDisplay(r.position_text)
                return (
                  <div
                    key={`${r.season_year}-${r.race_name}-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '13px 20px',
                      borderBottom: i < recent_results!.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#555',
                        width: '32px',
                        flexShrink: 0,
                      }}
                    >
                      {r.season_year}
                    </span>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {r.race_name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                        {r.circuit}
                        {r.grid_position > 0 && ` | Started P${r.grid_position}`}
                      </p>
                    </div>

                    {r.status !== 'Finished' && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#555',
                          flexShrink: 0,
                          maxWidth: '90px',
                          textAlign: 'right',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {r.status}
                      </span>
                    )}

                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 900,
                        color: pos.color,
                        width: '38px',
                        textAlign: 'right',
                        flexShrink: 0,
                      }}
                    >
                      {pos.label}
                    </span>

                    <span
                      style={{
                        fontSize: '12px',
                        color: r.points > 0 ? 'var(--muted)' : '#333',
                        width: '32px',
                        textAlign: 'right',
                        flexShrink: 0,
                      }}
                    >
                      {r.points > 0 ? `+${r.points}` : '-'}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {hasQualifying && (
          <section style={{ marginBottom: '36px' }}>
            <SectionHeader title='Best Qualifying Times by Circuit' />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '8px',
              }}
            >
              {circuit_best_qualifying!.map((q) => (
                <div
                  key={q.circuit_name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-elevated)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '11px 14px',
                    gap: '12px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {q.circuit_name}
                    </p>
                    <p style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                      {q.country} | {q.season_year}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 900,
                      color: 'var(--accent)',
                      fontFamily: 'monospace',
                      letterSpacing: '.02em',
                      flexShrink: 0,
                    }}
                  >
                    {q.best_q3}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasCircuitWins && (
          <section style={{ marginBottom: '36px' }}>
            <SectionHeader title='Circuit Wins' />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: '8px',
              }}
            >
              {circuit_stats!
                .filter((c) => c.wins > 0)
                .map((c) => (
                  <div
                    key={c.circuit_name}
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '10px',
                      padding: '14px 16px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text)',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c.circuit_name}
                    </p>
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#555',
                        marginBottom: '12px',
                      }}
                    >
                      {c.country}
                    </p>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div>
                        <p
                          style={{
                            fontSize: '22px',
                            fontWeight: 900,
                            color: 'var(--accent)',
                            lineHeight: 1,
                          }}
                        >
                          {c.wins}
                        </p>
                        <p
                          style={{
                            fontSize: '10px',
                            color: '#555',
                            letterSpacing: '.12em',
                            marginTop: '3px',
                          }}
                        >
                          WINS
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '22px',
                            fontWeight: 900,
                            color: 'var(--text)',
                            lineHeight: 1,
                          }}
                        >
                          {c.podiums}
                        </p>
                        <p
                          style={{
                            fontSize: '10px',
                            color: '#555',
                            letterSpacing: '.12em',
                            marginTop: '3px',
                          }}
                        >
                          PODIUMS
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '22px',
                            fontWeight: 900,
                            color: '#555',
                            lineHeight: 1,
                          }}
                        >
                          {c.starts}
                        </p>
                        <p
                          style={{
                            fontSize: '10px',
                            color: '#555',
                            letterSpacing: '.12em',
                            marginTop: '3px',
                          }}
                        >
                          STARTS
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {hasGlossary && (
          <section style={{ marginBottom: '36px' }}>
            <SectionHeader title='In the Glossary' />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
                gap: '10px',
              }}
            >
              {glossary_callouts!.map((g) => (
                <Link key={g.term_id} href={`/glossary/${g.term_id}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderLeft: '3px solid var(--accent)',
                      borderRadius: '10px',
                      padding: '14px 16px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--text)',
                        textTransform: 'uppercase',
                        letterSpacing: '.06em',
                        marginBottom: '4px',
                      }}
                    >
                      {g.term}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        marginBottom: '6px',
                      }}
                    >
                      {g.display_note}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#555',
                        lineHeight: 1.5,
                      }}
                    >
                      {g.short_def}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {identity.wikipedia_url && (
          <div style={{ paddingTop: '8px' }}>
            <a
              href={wikiUrl(identity.wikipedia_url)}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                fontSize: '12px',
                color: '#555',
                textDecoration: 'none',
                letterSpacing: '.04em',
              }}
            >
              Read more on Wikipedia -&gt;
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
