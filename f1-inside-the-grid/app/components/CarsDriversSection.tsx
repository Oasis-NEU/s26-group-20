'use client'

import { useEffect, useMemo, useState } from 'react'

type CarsDriversTab = 'current-grid' | 'all-time-leaders' | 'constructors-2024'

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
  flag: string
  profileUrl: string
  accentColor: string
}

type CarsDriversApiResponse = {
  status: 'ok' | 'error'
  message?: string
  summary: SummaryStats
  currentGrid: DriverRow[]
  allTimeLeaders: DriverRow[]
  constructors2024: ConstructorRow[]
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

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
        <a
          key={team.id}
          href={team.profileUrl}
          className="constructor-card"
          style={{ borderLeftColor: team.accentColor }}
        >
          <h3>{team.name.toUpperCase()}</h3>
          <p className="constructor-nationality">
            {team.flag} {team.nationality}
          </p>
          <span className="constructor-grid-badge">2024 GRID</span>
          <p className="constructor-link-hint">VIEW TEAM PROFILE -&gt;</p>
        </a>
      ))}
    </div>
  )
}

export function CarsDriversSection() {
  const [activeTab, setActiveTab] = useState<CarsDriversTab>('current-grid')
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

  const tabContent = useMemo(() => {
    if (!data) return null

    if (activeTab === 'current-grid') {
      return <CurrentGridTab drivers={data.currentGrid} />
    }

    if (activeTab === 'all-time-leaders') {
      return <AllTimeLeadersTab drivers={data.allTimeLeaders} />
    }

    return <ConstructorsTab constructors={data.constructors2024} />
  }, [activeTab, data])

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
          </div>

          <div className="cars-tab-panel">{tabContent}</div>
        </>
      )}
    </section>
  )
}
