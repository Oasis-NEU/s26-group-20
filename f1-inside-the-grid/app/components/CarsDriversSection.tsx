'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type CarsDriversTab =
  | 'current-grid'
  | 'all-time-leaders'
  | 'constructors-2024'
  | 'search-drivers'
  | 'search-constructors'

type SummaryStats = {
  totalDrivers: number
  active2024: number
  totalConstructors: number
  worldChampions: number
}

type DriverRow = {
  id: string
  name: string
  code: string
  nationality: string
  flag: string
  championships: number
  wins: number
  poles: number
  points: number
  entries: number
  winRate: number
  active: boolean
  profileUrl: string
  rank?: number
}

type ConstructorRow = {
  id: string
  name: string
  nationality: string
  constructor_ref: string
  flag: string
  profileUrl: string
  accentColor: string
  first_season: number | null
  last_season: number | null
}

type CarsDriversApiResponse = {
  status: 'ok' | 'error'
  message?: string
  summary: SummaryStats
  currentGrid: DriverRow[]
  allTimeLeaders: DriverRow[]
  constructors2024: ConstructorRow[]
  allConstructors: ConstructorRow[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <article className="cars-stat-card">
      <div className="cars-stat-value">{formatNumber(value)}</div>
      <div className="cars-stat-label">{label}</div>
    </article>
  )
}

function CurrentGridTab({ drivers }: { drivers: DriverRow[] }) {
  return (
    <div className="drivers-grid">
      {drivers.map((driver) => (
        <a key={driver.id} href={driver.profileUrl} className="driver-card">
          <div className="driver-card-header">
            <div className="driver-code-badge">{driver.code}</div>
            <div className="driver-card-title-wrap">
              <div className="driver-name-row">
                <h3>{driver.name.toUpperCase()}</h3>
                {driver.championships > 0 && (
                  <span className="driver-title-badge">{driver.championships}x</span>
                )}
              </div>
              <p className="driver-nationality">
                {driver.flag} {driver.nationality}
              </p>
            </div>
          </div>
          <div className="driver-card-stats">
            <div>
              <strong>{formatNumber(driver.wins)}</strong>
              <span>WINS</span>
            </div>
            <div>
              <strong>{formatNumber(driver.poles)}</strong>
              <span>POLES</span>
            </div>
            <div>
              <strong>{formatNumber(driver.points)}</strong>
              <span>PTS</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}

function AllTimeLeadersTab({ drivers }: { drivers: DriverRow[] }) {
  return (
    <div className="leaders-wrap">
      <table className="leaders-table">
        <thead>
          <tr>
            <th>RANK</th>
            <th>DRIVER</th>
            <th>WINS</th>
            <th>POLES</th>
            <th>CHAMPIONSHIPS</th>
            <th>TOTAL ENTRIES</th>
            <th>WIN RATE</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>
                <span className={driver.rank && driver.rank <= 3 ? 'rank rank-top' : 'rank'}>
                  {driver.rank}
                </span>
              </td>
              <td>
                <a href={driver.profileUrl} className="leader-driver-link">
                  {driver.name}
                </a>
                <span className="leader-badges">
                  {driver.championships > 0 && (
                    <span className="leader-badge leader-badge-wdc">
                      {driver.championships}xWDC
                    </span>
                  )}
                  {driver.active && (
                    <span className="leader-badge leader-badge-active">ACTIVE</span>
                  )}
                </span>
              </td>
              <td>{formatNumber(driver.wins)}</td>
              <td>{formatNumber(driver.poles)}</td>
              <td>{formatNumber(driver.championships)}</td>
              <td>{formatNumber(driver.entries)}</td>
              <td>{formatPercent(driver.winRate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="leaders-footer-link-wrap">
        <a href="/drivers" className="leaders-footer-link">
          VIEW ALL 868 DRIVERS -&gt;
        </a>
      </div>
    </div>
  )
}

function ConstructorsTab({ constructors }: { constructors: ConstructorRow[] }) {
  return (
    <div className="constructors-grid">
      {constructors.map((team) => (
        <Link
          key={team.id}
          href={team.profileUrl}
          className="constructor-card"
          style={{ borderLeftColor: team.accentColor }}
        >
          <h3>{team.name.toUpperCase()}</h3>
          {team.first_season != null && team.last_season != null && (
            <p
              style={{
                margin: '0.2rem 0 0',
                color: '#a0a0aa',
                fontSize: '0.78rem',
                lineHeight: 1.2,
              }}
            >
              {team.first_season === team.last_season ? (
                team.first_season
              ) : (
                <>
                  {team.first_season} &mdash; {team.last_season}
                </>
              )}
            </p>
          )}
          <p className="constructor-nationality">
            {team.flag} {team.nationality}
          </p>
          <span className="constructor-grid-badge">2024 GRID</span>
          <p className="constructor-link-hint">VIEW TEAM PROFILE -&gt;</p>
        </Link>
      ))}
    </div>
  )
}

export function CarsDriversSection() {
  const [activeTab, setActiveTab] = useState<CarsDriversTab>('current-grid')
  const [driverSearchTerm, setDriverSearchTerm] = useState('')
  const [constructorSearchTerm, setConstructorSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<CarsDriversApiResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/cars-drivers`)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const json = (await response.json()) as CarsDriversApiResponse
        setData(json)
        setError(null)
      } catch {
        setError('Unable to load Cars & Drivers data. Please check backend setup.')
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  const summary = data?.summary

  const filteredSearchDrivers = useMemo(() => {
    if (!data) return []

    const query = driverSearchTerm.trim().toLowerCase()
    if (!query) return data.allTimeLeaders

    return data.allTimeLeaders.filter((driver) => {
      return [driver.name, driver.nationality, driver.code].some((field) =>
        String(field || '').toLowerCase().includes(query),
      )
    })
  }, [data, driverSearchTerm])

  const filteredSearchConstructors = useMemo(() => {
    if (!data) return []

    const query = constructorSearchTerm.trim().toLowerCase()
    if (!query) return data.allConstructors

    return data.allConstructors.filter((team) =>
      [team.name, team.nationality].some((field) => String(field || '').toLowerCase().includes(query)),
    )
  }, [data, constructorSearchTerm])

  const tabContent = useMemo(() => {
    if (!data) return null

    if (activeTab === 'current-grid') {
      return <CurrentGridTab drivers={data.currentGrid} />
    }

    if (activeTab === 'all-time-leaders') {
      return <AllTimeLeadersTab drivers={data.allTimeLeaders} />
    }

    if (activeTab === 'search-drivers') {
      return <AllTimeLeadersTab drivers={filteredSearchDrivers} />
    }

    if (activeTab === 'search-constructors') {
      return <ConstructorsTab constructors={filteredSearchConstructors} />
    }

    return <ConstructorsTab constructors={data.constructors2024} />
  }, [activeTab, data, filteredSearchDrivers, filteredSearchConstructors])

  return (
    <section className="cars-page">
      <div className="cars-header-block">
        <p className="cars-kicker">WELCOME TO</p>
        <h1>CARS &amp; DRIVERS</h1>
        <p className="cars-subtext">
          Every driver who has taken the grid. Every constructor that built a car.
          Filter by current grid, all-time records, or 2024 teams.
        </p>
      </div>

      {loading ? (
        <p className="cars-loading">Loading Cars & Drivers data...</p>
      ) : error ? (
        <p className="cars-error">{error}</p>
      ) : (
        <>
          <div className="cars-stats-row">
            <StatCard value={summary?.totalDrivers || 0} label="TOTAL DRIVERS" />
            <StatCard value={summary?.active2024 || 0} label="ACTIVE IN 2024" />
            <StatCard
              value={summary?.totalConstructors || 0}
              label="CONSTRUCTORS"
            />
            <StatCard
              value={summary?.worldChampions || 0}
              label="WORLD CHAMPIONS"
            />
          </div>

          <div className="cars-tab-list">
            <button
              className={
                activeTab === 'current-grid' ? 'cars-tab-btn active' : 'cars-tab-btn'
              }
              onClick={() => setActiveTab('current-grid')}
            >
              CURRENT GRID
            </button>
            <button
              className={
                activeTab === 'all-time-leaders' ? 'cars-tab-btn active' : 'cars-tab-btn'
              }
              onClick={() => setActiveTab('all-time-leaders')}
            >
              ALL-TIME LEADERS
            </button>
            <button
              className={
                activeTab === 'constructors-2024' ? 'cars-tab-btn active' : 'cars-tab-btn'
              }
              onClick={() => setActiveTab('constructors-2024')}
            >
              2024 CONSTRUCTORS
            </button>
            <button
              className={
                activeTab === 'search-drivers' ? 'cars-tab-btn active' : 'cars-tab-btn'
              }
              onClick={() => setActiveTab('search-drivers')}
            >
              SEARCH DRIVERS
            </button>
            <button
              className={
                activeTab === 'search-constructors' ? 'cars-tab-btn active' : 'cars-tab-btn'
              }
              onClick={() => setActiveTab('search-constructors')}
            >
              SEARCH TEAMS
            </button>
          </div>

          {activeTab === 'search-drivers' && (
            <div
              style={{
                marginTop: '0.75rem',
                marginBottom: '0.25rem',
              }}
            >
              <label htmlFor="cars-search" style={{ display: 'none' }}>
                Search drivers
              </label>
              <input
                id="cars-search"
                type="search"
                value={driverSearchTerm}
                onChange={(event) => setDriverSearchTerm(event.target.value)}
                placeholder="Search 868 drivers by name, nationality, or code..."
                style={{
                  width: '100%',
                  borderRadius: '999px',
                  border: '1px solid rgba(232, 0, 13, 0.3)',
                  background: '#0f0708',
                  color: 'rgba(230, 228, 228, 0.9)',
                  padding: '0.62rem 0.95rem',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                }}
              />
            </div>
          )}

          {activeTab === 'search-constructors' && (
            <div
              style={{
                marginTop: '0.75rem',
                marginBottom: '0.25rem',
              }}
            >
              <label htmlFor="cars-teams-search" style={{ display: 'none' }}>
                Search constructors
              </label>
              <input
                id="cars-teams-search"
                type="search"
                value={constructorSearchTerm}
                onChange={(event) => setConstructorSearchTerm(event.target.value)}
                placeholder="Search 212 constructor teams by name or nationality..."
                style={{
                  width: '100%',
                  borderRadius: '999px',
                  border: '1px solid rgba(232, 0, 13, 0.3)',
                  background: '#0f0708',
                  color: 'rgba(230, 228, 228, 0.9)',
                  padding: '0.62rem 0.95rem',
                  fontFamily: 'inherit',
                  fontSize: '0.88rem',
                  letterSpacing: '0.08em',
                }}
              />
              <p
                style={{
                  margin: '0.45rem 0 0',
                  fontSize: '0.78rem',
                  color: '#a0a0aa',
                  letterSpacing: '0.08em',
                }}
              >
                {filteredSearchConstructors.length} / {data?.allConstructors?.length ?? 212}
              </p>
            </div>
          )}

          <div className="cars-tab-panel">{tabContent}</div>
        </>
      )}
    </section>
  )
}
