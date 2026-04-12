'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { Constructor, Driver } from '@/lib/types'

type TabKey = 'current' | 'alltime' | 'constructors' | 'search'
type SortKey = 'wins' | 'poles' | 'championships' | 'entries' | 'winRate'
type SortDirection = 'asc' | 'desc'

type Props = {
  activeDrivers: Driver[]
  allTimeDrivers: Driver[]
  constructors: Constructor[]
  initialTab: TabKey
}

const ERA_OPTIONS = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]

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
  sauber: '#1b3f21',
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatRate(value: number) {
  return `${(value * 100).toFixed(1)}%`
}

function normalizeText(value: string | null | undefined) {
  return String(value ?? '').trim().toLowerCase()
}

function resolveTeamAccent(name: string) {
  return TEAM_ACCENT_BY_NAME[normalizeText(name)] ?? 'rgba(255,255,255,0.12)'
}

function getSortValue(driver: Driver, sortKey: SortKey) {
  switch (sortKey) {
    case 'wins':
      return driver.race_wins
    case 'poles':
      return driver.pole_positions
    case 'championships':
      return driver.championships_count
    case 'entries':
      return driver.race_entries
    case 'winRate':
      return driver.win_rate
    default:
      return driver.race_wins
  }
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 4a6.5 6.5 0 1 0 4.08 11.57l4.42 4.43 1.41-1.42-4.42-4.42A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4l-6.3 6.31-1.41-1.42L9.18 12 2.88 5.71 4.29 4.3l6.3 6.3 6.3-6.3 1.41 1.41Z" />
    </svg>
  )
}

export function DriversSearch({ activeDrivers, allTimeDrivers, constructors, initialTab }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEra, setSelectedEra] = useState<number | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>('wins')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  useEffect(() => {
    setActiveTab(initialTab)
    setSearchTerm('')
    setSelectedEra(null)
  }, [initialTab])

  const search = searchTerm.trim().toLowerCase()

  const totalDrivers = allTimeDrivers.length
  const activeCount = activeDrivers.length
  const constructorCount = constructors.length

  const worldChampionCount = useMemo(
    () => allTimeDrivers.filter((driver) => driver.championships_count > 0).length,
    [allTimeDrivers],
  )

  const currentDrivers = useMemo(
    () =>
      activeDrivers.filter((driver) => {
        if (!search) return true
        return [driver.name, driver.nationality, driver.driver_code ?? ''].some((field) =>
          normalizeText(field).includes(search),
        )
      }),
    [activeDrivers, search],
  )

  const filteredAllTimeDrivers = useMemo(() => {
    const filtered = allTimeDrivers.filter((driver) => {
      const matchesSearch =
        !search ||
        [driver.name, driver.nationality, driver.driver_code ?? ''].some((field) =>
          normalizeText(field).includes(search),
        )
      const matchesEra = selectedEra === null || driver.era_decade === selectedEra

      return matchesSearch && matchesEra
    })

    const directionFactor = sortDirection === 'asc' ? 1 : -1

    return filtered.sort((left, right) => {
      const leftValue = getSortValue(left, sortKey)
      const rightValue = getSortValue(right, sortKey)

      if (leftValue < rightValue) return -1 * directionFactor
      if (leftValue > rightValue) return 1 * directionFactor
      return left.name.localeCompare(right.name)
    })
  }, [allTimeDrivers, search, selectedEra, sortDirection, sortKey])

  const filteredConstructors = useMemo(
    () =>
      constructors.filter((constructor) => {
        if (!search) return true
        return [constructor.name, constructor.nationality].some((field) =>
          normalizeText(field).includes(search),
        )
      }),
    [constructors, search],
  )

  const activeResultCount =
    activeTab === 'current'
      ? currentDrivers.length
      : activeTab === 'alltime'
        ? filteredAllTimeDrivers.length
        : activeTab === 'constructors'
          ? filteredConstructors.length
          : filteredAllTimeDrivers.length

  const activeTotalCount =
    activeTab === 'current'
      ? activeCount
      : activeTab === 'alltime'
        ? totalDrivers
        : activeTab === 'constructors'
          ? constructorCount
          : totalDrivers

  const eraLabel = selectedEra === null ? 'ALL ERAS' : `${selectedEra}s`

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab)
    setSearchTerm('')
    setSelectedEra(null)
  }

  function handleSort(nextSortKey: SortKey) {
    if (sortKey === nextSortKey) {
      setSortDirection((currentDirection) => (currentDirection === 'desc' ? 'asc' : 'desc'))
      return
    }

    setSortKey(nextSortKey)
    setSortDirection('desc')
  }

  function handleEraClick(era: number | null) {
    setSelectedEra((currentEra) => (currentEra === era ? null : era))
  }

  function renderSearchBar(placeholder: string) {
    return (
      <div className="drivers-search-wrap">
        <label className="sr-only" htmlFor="drivers-search">
          Search drivers and constructors
        </label>
        <div className="drivers-search-shell">
          <span className="drivers-search-icon">
            <SearchIcon />
          </span>
          <input
            id="drivers-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={placeholder}
          />
          {searchTerm ? (
            <button
              type="button"
              className="drivers-clear-button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <main className="drivers-page">
      <header className="drivers-hero">
        <div>
          <p className="drivers-kicker">WELCOME TO</p>
          <h1>CARS &amp; DRIVERS</h1>
          <p className="drivers-intro">
            Every driver who has taken the grid. Every constructor that built a car. Filter by Current Grid,
            All-Time Leaders, or 2024 Constructors.
          </p>
        </div>

        <section className="drivers-stats" aria-label="Cars and drivers summary">
          <article className="drivers-stat-card">
            <div className="drivers-stat-value">{formatNumber(totalDrivers)}</div>
            <div className="drivers-stat-label">TOTAL DRIVERS</div>
          </article>
          <article className="drivers-stat-card">
            <div className="drivers-stat-value">{formatNumber(activeCount)}</div>
            <div className="drivers-stat-label">ACTIVE IN 2024</div>
          </article>
          <article className="drivers-stat-card">
            <div className="drivers-stat-value">{formatNumber(constructorCount)}</div>
            <div className="drivers-stat-label">2024 CONSTRUCTORS</div>
          </article>
          <article className="drivers-stat-card">
            <div className="drivers-stat-value">{formatNumber(worldChampionCount)}</div>
            <div className="drivers-stat-label">WORLD CHAMPIONS</div>
          </article>
        </section>
      </header>

      <section className="drivers-panel">
        <div className="drivers-tabs" role="tablist" aria-label="Cars and Drivers tabs">
          <button
            type="button"
            className={activeTab === 'current' ? 'drivers-tab active' : 'drivers-tab'}
            onClick={() => handleTabChange('current')}
            role="tab"
            aria-selected={activeTab === 'current'}
          >
            CURRENT GRID
          </button>
          <button
            type="button"
            className={activeTab === 'alltime' ? 'drivers-tab active' : 'drivers-tab'}
            onClick={() => handleTabChange('alltime')}
            role="tab"
            aria-selected={activeTab === 'alltime'}
          >
            ALL-TIME LEADERS
          </button>
          <button
            type="button"
            className={activeTab === 'constructors' ? 'drivers-tab active' : 'drivers-tab'}
            onClick={() => handleTabChange('constructors')}
            role="tab"
            aria-selected={activeTab === 'constructors'}
          >
            2024 CONSTRUCTORS
          </button>
          <button
            type="button"
            className={activeTab === 'search' ? 'drivers-tab active' : 'drivers-tab'}
            onClick={() => handleTabChange('search')}
            role="tab"
            aria-selected={activeTab === 'search'}
          >
            SEARCH
          </button>
        </div>

        {activeTab === 'search' ? (
          <div className="drivers-search-primary">
            {renderSearchBar('Search 868 drivers by name, nationality, or code…')}
            <div className="drivers-count" aria-live="polite">
              {activeResultCount} / {activeTotalCount}
            </div>
          </div>
        ) : (
          <div className="drivers-controls">
            {renderSearchBar(
              activeTab === 'constructors'
                ? 'Search constructor name or nationality'
                : 'Search name, nationality, or driver code',
            )}

            <div className="drivers-count" aria-live="polite">
              {activeResultCount} / {activeTotalCount}
            </div>
          </div>
        )}

        {activeTab === 'alltime' ? (
          <div className="drivers-era-row" aria-label="Filter by era">
            <button
              type="button"
              className={selectedEra === null ? 'drivers-era-pill active' : 'drivers-era-pill'}
              onClick={() => handleEraClick(null)}
            >
              ALL ERAS
            </button>
            {ERA_OPTIONS.map((era) => {
              const active = selectedEra === era

              return (
                <button
                  type="button"
                  key={era}
                  className={active ? 'drivers-era-pill active' : 'drivers-era-pill'}
                  onClick={() => handleEraClick(era)}
                >
                  {era}s
                </button>
              )
            })}
            <span className="drivers-era-hint">
              {eraLabel === 'ALL ERAS' ? 'Showing all decades' : `Filtered to ${eraLabel}`}
            </span>
          </div>
        ) : null}

        {activeTab === 'current' ? (
          <section className="drivers-grid" aria-label="Current grid drivers">
            {currentDrivers.map((driver) => (
              <article key={driver.id} className="driver-card">
                <div className="driver-card-top">
                  <div>
                    <h3>
                      <Link href={`/drivers/${driver.id}`}>{driver.name}</Link>
                    </h3>
                    <p>
                      {driver.nationality}
                      {driver.driver_code ? ` · ${driver.driver_code}` : ''}
                    </p>
                  </div>
                  <span className="driver-code-badge">{driver.driver_code ?? '---'}</span>
                </div>

                <div className="driver-card-stats">
                  <div>
                    <strong>{formatNumber(driver.race_wins)}</strong>
                    <span>WINS</span>
                  </div>
                  <div>
                    <strong>{formatNumber(driver.pole_positions)}</strong>
                    <span>POLES</span>
                  </div>
                  <div>
                    <strong>{formatNumber(driver.points)}</strong>
                    <span>POINTS</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}

        {activeTab === 'alltime' || activeTab === 'search' ? (
          <div className="drivers-table-shell">
            <table className="drivers-table">
              <thead>
                <tr>
                  <th scope="col">RANK</th>
                  <th scope="col">DRIVER</th>
                  {[
                    { key: 'wins', label: 'WINS' },
                    { key: 'poles', label: 'POLES' },
                    { key: 'championships', label: 'CHAMPIONSHIPS' },
                    { key: 'entries', label: 'ENTRIES' },
                    { key: 'winRate', label: 'WIN RATE' },
                  ].map((column) => {
                    const active = sortKey === column.key
                    const arrow = active ? (sortDirection === 'desc' ? '↓' : '↑') : ''

                    return (
                      <th scope="col" key={column.key}>
                        <button
                          type="button"
                          className={active ? 'drivers-sort-button active' : 'drivers-sort-button'}
                          onClick={() => handleSort(column.key as SortKey)}
                        >
                          <span>{column.label}</span>
                          <span className="drivers-sort-arrow" aria-hidden="true">
                            {arrow}
                          </span>
                        </button>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {filteredAllTimeDrivers.map((driver, index) => (
                  <tr key={driver.id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link href={`/drivers/${driver.id}`} className="drivers-driver-link">
                        {driver.name}
                      </Link>
                    </td>
                    <td>{formatNumber(driver.race_wins)}</td>
                    <td>{formatNumber(driver.pole_positions)}</td>
                    <td>{formatNumber(driver.championships_count)}</td>
                    <td>{formatNumber(driver.race_entries)}</td>
                    <td>{formatRate(driver.win_rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {activeTab === 'constructors' ? (
          <section className="constructors-grid" aria-label="2024 constructors">
            {filteredConstructors.map((constructor) => (
              <article
                key={constructor.id}
                className="constructor-card"
                style={{ borderLeftColor: resolveTeamAccent(constructor.name) }}
              >
                <h3>{constructor.name}</h3>
                <p>{constructor.nationality}</p>
                <span className="constructor-badge">2024 GRID</span>
              </article>
            ))}
          </section>
        ) : null}

        {!currentDrivers.length && activeTab === 'current' ? (
          <div className="drivers-empty">No current-grid drivers matched your search.</div>
        ) : null}
        {!filteredAllTimeDrivers.length && (activeTab === 'alltime' || activeTab === 'search') ? (
          <div className="drivers-empty">No all-time leaders matched your search and era filter.</div>
        ) : null}
        {!filteredConstructors.length && activeTab === 'constructors' ? (
          <div className="drivers-empty">No constructors matched your search.</div>
        ) : null}
      </section>

      <style jsx>{`
        .drivers-page {
          padding: 28px 48px 56px;
          color: var(--text);
        }

        .drivers-hero {
          display: grid;
          gap: 18px;
          margin-bottom: 18px;
        }

        .drivers-kicker {
          margin: 0 0 8px;
          color: var(--muted);
          letter-spacing: 0.2em;
          font-weight: 800;
          font-size: 12px;
          text-transform: uppercase;
        }

        .drivers-hero h1 {
          margin: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2.4rem, 3vw + 1rem, 3.5rem);
          letter-spacing: 0.06em;
          line-height: 0.95;
          text-transform: uppercase;
        }

        .drivers-intro {
          margin: 10px 0 0;
          max-width: 760px;
          color: var(--muted);
        }

        .drivers-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 10px;
        }

        .drivers-stat-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
        }

        .drivers-stat-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--text);
          line-height: 1;
        }

        .drivers-stat-label {
          margin-top: 4px;
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 0.08em;
          font-weight: 700;
          text-transform: uppercase;
        }

        .drivers-panel {
          border-radius: 24px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255, 0, 60, 0.15), rgba(5, 0, 7, 0.95)),
            var(--bg-elevated);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 24px rgba(0, 0, 0, 0.65);
        }

        .drivers-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .drivers-tab,
        .drivers-era-pill,
        .drivers-sort-button,
        .drivers-clear-button {
          font-family: 'Barlow Condensed', sans-serif;
        }

        .drivers-tab {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: transparent;
          color: var(--muted);
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            border-color 150ms ease,
            background 150ms ease,
            color 150ms ease,
            box-shadow 150ms ease;
        }

        .drivers-tab:hover {
          border-color: rgba(255, 0, 60, 0.8);
          box-shadow: 0 0 18px rgba(255, 0, 60, 0.35);
        }

        .drivers-tab.active {
          border-color: transparent;
          background: linear-gradient(120deg, #ff335a, #ff003c);
          color: #fff;
          box-shadow:
            0 0 16px rgba(255, 0, 60, 0.8),
            0 0 34px rgba(255, 0, 60, 0.35);
        }

        .drivers-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
        }

        .drivers-search-primary {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
          margin-top: 14px;
        }

        .drivers-search-wrap {
          flex: 1 1 360px;
        }

        .drivers-search-shell {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 48px;
          border-radius: 999px;
          background: var(--bg);
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        .drivers-search-icon,
        .drivers-clear-button {
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          color: var(--muted);
        }

        .drivers-search-icon svg,
        .drivers-clear-button svg {
          width: 18px;
          height: 18px;
          fill: currentColor;
        }

        .drivers-search-shell input {
          flex: 1 1 auto;
          min-width: 0;
          height: 46px;
          border: 0;
          outline: 0;
          background: transparent;
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .drivers-search-shell input::placeholder {
          color: rgba(160, 160, 170, 0.8);
        }

        .drivers-clear-button {
          border: 0;
          background: transparent;
          cursor: pointer;
          transition: color 150ms ease;
        }

        .drivers-clear-button:hover {
          color: var(--accent);
        }

        .drivers-count {
          flex: 0 0 auto;
          min-width: 96px;
          text-align: right;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.55rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text);
        }

        .drivers-era-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-top: 14px;
        }

        .drivers-era-pill {
          border-radius: 999px;
          padding: 7px 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            border-color 150ms ease,
            color 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease;
        }

        .drivers-era-pill:hover {
          border-color: rgba(255, 0, 60, 0.75);
          color: #fff;
          box-shadow: 0 0 16px rgba(255, 0, 60, 0.25);
        }

        .drivers-era-pill.active {
          border-color: var(--accent);
          color: var(--accent);
          background: rgba(255, 0, 60, 0.08);
          box-shadow: 0 0 18px rgba(255, 0, 60, 0.22);
        }

        .drivers-era-hint {
          color: var(--muted);
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .drivers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .driver-card,
        .constructor-card {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          padding: 14px;
        }

        .driver-card {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .driver-card-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .driver-card-top h3,
        .constructor-card h3 {
          margin: 0;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.25rem;
          line-height: 1;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .driver-card-top p,
        .constructor-card p {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 14px;
        }

        .driver-card-top a,
        .drivers-driver-link,
        .constructor-card a {
          color: var(--text);
        }

        .driver-card-top a:hover,
        .drivers-driver-link:hover,
        .constructor-card a:hover {
          color: var(--accent);
        }

        .driver-code-badge,
        .constructor-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          height: 30px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text);
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0 10px;
        }

        .driver-card-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .driver-card-stats strong {
          display: block;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
        }

        .driver-card-stats span {
          display: block;
          margin-top: 2px;
          color: var(--muted);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .drivers-table-shell {
          margin-top: 16px;
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .drivers-table {
          width: 100%;
          min-width: 820px;
          border-collapse: collapse;
        }

        .drivers-table thead th {
          position: sticky;
          top: 0;
          z-index: 1;
          padding: 0;
          background: #050007;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          text-align: left;
        }

        .drivers-table tbody td {
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: var(--text);
        }

        .drivers-table tbody tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .drivers-table tbody td:first-child {
          color: var(--muted);
          width: 72px;
        }

        .drivers-sort-button {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          border: 0;
          padding: 12px 14px;
          background: transparent;
          color: var(--muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .drivers-sort-button.active {
          color: var(--accent);
        }

        .drivers-sort-arrow {
          min-width: 12px;
          text-align: right;
        }

        .drivers-driver-link {
          font-weight: 700;
        }

        .constructors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
          margin-top: 16px;
        }

        .constructor-card {
          border-left-width: 4px;
          border-left-style: solid;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .constructor-card p {
          margin: 0;
        }

        .drivers-empty {
          margin-top: 16px;
          padding: 16px;
          border-radius: 14px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          color: var(--muted);
          text-align: center;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 900px) {
          .drivers-page {
            padding: 20px;
          }

          .drivers-controls {
            align-items: stretch;
          }

          .drivers-count {
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .drivers-panel {
            padding: 14px;
          }

          .drivers-search-shell input {
            font-size: 15px;
          }

          .drivers-table {
            min-width: 760px;
          }
        }
      `}</style>
    </main>
  )
}