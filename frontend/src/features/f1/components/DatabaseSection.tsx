import { useEffect, useState } from 'react'
import { carDatabaseBySeason, seasons } from '../data/carDatabase'

type DatabaseSectionProps = {
  season: string
  onSeasonChange: (value: string) => void
}

export function DatabaseSection({
  season,
  onSeasonChange,
}: DatabaseSectionProps) {
  const entries = carDatabaseBySeason[season] ?? []
  const [selectedId, setSelectedId] = useState<string | null>(
    entries[0]?.id ?? null,
  )

  useEffect(() => {
    setSelectedId(entries[0]?.id ?? null)
  }, [season])

  const selectedEntry =
    entries.find((entry) => entry.id === selectedId) ?? entries[0] ?? null

  return (
    <div className="panel panel-database">
      <div className="panel-header">
        <div>
          <h2>Cars &amp; Drivers Database</h2>
          <p>
            Explore sample data for current and future seasons. In a full app,
            this section would update automatically after every race weekend.
          </p>
        </div>
        <div className="season-selector">
          <label htmlFor="season">Season</label>
          <select
            id="season"
            value={season}
            onChange={(e) => {
              const newSeason = e.target.value
              onSeasonChange(newSeason)
            }}
          >
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="muted">
          No entries yet for this season. Add new cars and drivers to keep the
          database in sync with the championship.
        </p>
      ) : (
        <div className="database-layout">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Car</th>
                  <th>Driver</th>
                  <th>Team</th>
                  <th>Season</th>
                  <th>Wins</th>
                  <th>Podiums</th>
                  <th>Poles</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className={
                      entry.id === selectedEntry?.id ? 'active-row' : ''
                    }
                    onClick={() => setSelectedId(entry.id)}
                  >
                    <td>
                      {entry.car.imageUrl ? (
                        <span className="table-car-cell">
                          <img
                            src={entry.car.imageUrl}
                            alt=""
                            className="table-car-thumb"
                          />
                          {entry.car.name}
                        </span>
                      ) : (
                        entry.car.name
                      )}
                    </td>
                    <td>
                      <span className="driver-number">
                        #{entry.driver.number}
                      </span>{' '}
                      {entry.driver.name}
                    </td>
                    <td>{entry.driver.team}</td>
                    <td>{entry.car.season}</td>
                    <td>{entry.car.wins}</td>
                    <td>{entry.car.podiums}</td>
                    <td>{entry.car.poles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedEntry && (
            <aside className="detail-panel">
              <div
                className="detail-accent"
                style={{ background: selectedEntry.primaryColor }}
              />
              {selectedEntry.car.imageUrl && (
                <div className="detail-car-image">
                  <img
                    src={selectedEntry.car.imageUrl}
                    alt={`${selectedEntry.car.name} Formula 1 car`}
                  />
                </div>
              )}
              <h3>
                {selectedEntry.driver.name}{' '}
                <span className="driver-number">#{selectedEntry.driver.number}</span>
              </h3>
              <p className="muted">
                {selectedEntry.driver.team} &middot;{' '}
                {selectedEntry.driver.country}
              </p>
              <div className="detail-grid">
                <div>
                  <h4>Driver Stats</h4>
                  <ul>
                    <li>
                      Championships:{' '}
                      <strong>{selectedEntry.driver.championships}</strong>
                    </li>
                    <li>
                      Race wins: <strong>{selectedEntry.driver.raceWins}</strong>
                    </li>
                    <li>
                      Podiums: <strong>{selectedEntry.driver.podiums}</strong>
                    </li>
                    <li>
                      Poles: <strong>{selectedEntry.driver.poles}</strong>
                    </li>
                    <li>
                      Rookie year:{' '}
                      <strong>{selectedEntry.driver.rookieYear}</strong>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4>Car Stats</h4>
                  <ul>
                    <li>
                      Car: <strong>{selectedEntry.car.name}</strong>
                    </li>
                    <li>
                      Power unit: <strong>{selectedEntry.car.powerUnit}</strong>
                    </li>
                    <li>
                      Top speed:{' '}
                      <strong>{selectedEntry.car.topSpeedKph} km/h</strong>
                    </li>
                    <li>
                      Races entered:{' '}
                      <strong>{selectedEntry.car.races}</strong>
                    </li>
                    <li>
                      Season wins:{' '}
                      <strong>{selectedEntry.car.wins}</strong>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="disclaimer">
                Stats shown here are illustrative. In a full build, this panel
                would be powered by a live database that updates each season and
                race.
              </p>
            </aside>
          )}
        </div>
      )}
    </div>
  )
}
