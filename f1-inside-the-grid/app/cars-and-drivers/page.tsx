import { createClient } from '@/lib/supabase/server'
import { formatPoints, formatRate, initials, nationalityToFlag, TEAM_ACCENT_BY_NAME } from '@/lib/utils'
import type { Constructor, Driver } from '@/lib/types'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type TabKey = 'current' | 'alltime' | 'constructors'

type Props = {
  searchParams?: {
    tab?: string
  }
}

const TEAM_SLUGS_2024 = new Set([
  'red_bull',
  'ferrari',
  'mercedes',
  'mclaren',
  'aston_martin',
  'alpine',
  'williams',
  'haas',
  'rb',
  'sauber',
])

function getActiveTab(rawTab?: string): TabKey {
  if (rawTab === 'alltime') return 'alltime'
  if (rawTab === 'constructors') return 'constructors'
  return 'current'
}

function tabHref(tab: TabKey): string {
  if (tab === 'current') return '/cars-and-drivers'
  return `/cars-and-drivers?tab=${tab}`
}

function resolveTeamAccent(name: string): string {
  return TEAM_ACCENT_BY_NAME[name] ?? 'rgba(255, 255, 255, 0.12)'
}

export default async function CarsAndDriversPage({ searchParams }: Props) {
  const activeTab = getActiveTab(searchParams?.tab)
  const supabase = createClient()

  const [{ data: driversData, error: driversError }, { data: constructorsData, error: constructorsError }] =
    await Promise.all([
      supabase
        .from('v_driver_full')
        .select(
          'id,name,nationality,era_decade,race_wins,pole_positions,championships_count,is_champion,is_active,race_entries,points,win_rate,podium_rate,dominance_score,driver_code'
        ),
      supabase.from('ergast_constructors').select('id,name,nationality,constructor_ref'),
    ])

  if (driversError || constructorsError) {
    return (
      <main style={{ padding: '28px 48px' }}>
        <h1 style={{ fontSize: '2rem', letterSpacing: '.04em' }}>Cars & Drivers</h1>
        <p style={{ marginTop: '10px', color: 'var(--muted)' }}>
          Unable to load Supabase data. Check your environment values and table access.
        </p>
      </main>
    )
  }

  const drivers = (driversData ?? []) as Driver[]
  const constructorsRaw = (constructorsData ?? []) as Constructor[]

  const currentGrid = [...drivers]
    .filter((d) => d.is_active)
    .sort((a, b) => b.race_wins - a.race_wins || b.points - a.points)
    .slice(0, 20)

  const allTimeLeaders = [...drivers]
    .sort(
      (a, b) =>
        b.race_wins - a.race_wins ||
        b.championships_count - a.championships_count ||
        b.points - a.points
    )
    .slice(0, 20)

  const constructors = constructorsRaw.filter((c) =>
    TEAM_SLUGS_2024.has(String(c.constructor_ref || '').toLowerCase())
  )

  return (
    <main style={{ padding: '28px 48px 56px' }}>
      <header style={{ marginBottom: '18px' }}>
        <p style={{ color: 'var(--muted)', letterSpacing: '.2em', fontWeight: 800, fontSize: '12px' }}>WELCOME TO</p>
        <h1 style={{ fontSize: '2.4rem', letterSpacing: '.03em', lineHeight: 1.1 }}>CARS & DRIVERS</h1>
        <p style={{ marginTop: '8px', maxWidth: '760px', color: 'var(--muted)' }}>
          Every driver who has taken the grid. Every constructor that built a car. Filter by Current Grid,
          All-Time Leaders, or 2024 Constructors.
        </p>
      </header>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '10px',
          marginBottom: '14px',
        }}
      >
        <article style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{drivers.length.toLocaleString()}</div>
          <div style={{ color: 'var(--muted)', fontSize: '12px', letterSpacing: '.08em' }}>TOTAL DRIVERS</div>
        </article>
        <article style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{currentGrid.length.toLocaleString()}</div>
          <div style={{ color: 'var(--muted)', fontSize: '12px', letterSpacing: '.08em' }}>ACTIVE IN 2024</div>
        </article>
        <article style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{constructors.length.toLocaleString()}</div>
          <div style={{ color: 'var(--muted)', fontSize: '12px', letterSpacing: '.08em' }}>2024 CONSTRUCTORS</div>
        </article>
        <article style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {drivers.filter((d) => d.championships_count > 0).length.toLocaleString()}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '12px', letterSpacing: '.08em' }}>WORLD CHAMPIONS</div>
        </article>
      </section>

      <nav style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'CURRENT GRID', key: 'current' as TabKey },
          { label: 'ALL-TIME LEADERS', key: 'alltime' as TabKey },
          { label: '2024 CONSTRUCTORS', key: 'constructors' as TabKey },
        ].map((tab) => {
          const active = tab.key === activeTab
          return (
            <a
              key={tab.key}
              href={tabHref(tab.key)}
              style={{
                border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)',
                background: active ? 'linear-gradient(120deg, var(--accent), var(--accent-soft))' : 'transparent',
                color: active ? '#fff' : 'var(--muted)',
                borderRadius: '999px',
                padding: '8px 14px',
                fontWeight: 800,
                letterSpacing: '.08em',
                fontSize: '12px',
              }}
            >
              {tab.label}
            </a>
          )
        })}
      </nav>

      {activeTab === 'current' && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '10px',
          }}
        >
          {currentGrid.map((driver) => (
            <article key={driver.id} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ lineHeight: 1.1 }}>
                    <Link href={`/drivers/${driver.id}`} style={{ color: 'var(--text)' }}>
                      {driver.name}
                    </Link>
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '14px' }}>
                    {nationalityToFlag(driver.nationality)} {driver.nationality}
                  </p>
                </div>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    fontSize: '11px',
                  }}
                >
                  {driver.driver_code ?? initials(driver.name)}
                </span>
              </div>
              <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <div>
                  <strong>{driver.race_wins.toLocaleString()}</strong>
                  <p style={{ color: 'var(--muted)', fontSize: '11px' }}>WINS</p>
                </div>
                <div>
                  <strong>{driver.pole_positions.toLocaleString()}</strong>
                  <p style={{ color: 'var(--muted)', fontSize: '11px' }}>POLES</p>
                </div>
                <div>
                  <strong>{formatPoints(driver.points)}</strong>
                  <p style={{ color: 'var(--muted)', fontSize: '11px' }}>POINTS</p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {activeTab === 'alltime' && (
        <section style={{ border: '1px solid var(--border)', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '720px' }}>
            <thead>
              <tr>
                {['RANK', 'DRIVER', 'WINS', 'POLES', 'CHAMPIONSHIPS', 'ENTRIES', 'WIN RATE'].map((head) => (
                  <th
                    key={head}
                    style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid var(--border)', fontSize: '12px' }}
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allTimeLeaders.map((driver, index) => (
                <tr key={driver.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>{index + 1}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>
                    <Link href={`/drivers/${driver.id}`} style={{ color: 'var(--text)' }}>
                      {driver.name}
                    </Link>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>{driver.race_wins.toLocaleString()}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>{driver.pole_positions.toLocaleString()}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>
                    {driver.championships_count.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>{driver.race_entries.toLocaleString()}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid var(--border)' }}>{formatRate(driver.win_rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'constructors' && (
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '10px',
          }}
        >
          {constructors.map((team) => (
            <article
              key={team.id}
              style={{
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${resolveTeamAccent(team.name)}`,
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <h3>{team.name}</h3>
              <p style={{ color: 'var(--muted)' }}>
                {nationalityToFlag(team.nationality)} {team.nationality}
              </p>
              <p style={{ marginTop: '8px', color: 'var(--muted)', fontSize: '12px', letterSpacing: '.1em' }}>
                2024 GRID
              </p>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}
