import { useState } from 'react'
import './App.css'

// Note: If you have a driver image, place it at frontend/src/assets/ferrari-driver.png
// and uncomment the import below:
// import ferrariDriver from './assets/ferrari-driver.png'

type Driver = {
  id: string
  name: string
  team: string
  number: number
  country: string
  championships: number
  raceWins: number
  podiums: number
  poles: number
  rookieYear: number
}

type Car = {
  id: string
  name: string
  team: string
  season: string
  chassis: string
  powerUnit: string
  topSpeedKph: number
  races: number
  wins: number
  podiums: number
  poles: number
  imageUrl?: string
}

type CarWithDriver = {
  id: string
  driver: Driver
  car: Car
  primaryColor: string
}

type TabId = 'overview' | 'learn' | 'history' | 'database'

const seasons = ['2022', '2023', '2024', '2025']

const carDatabaseBySeason: Record<string, CarWithDriver[]> = {
  '2022': [
    {
      id: '22-sf75-lead',
      primaryColor: '#ff002b',
      driver: {
        id: 'drv-charles',
        name: 'Charles Leclerc',
        team: 'Scuderia Ferrari',
        number: 16,
        country: 'Monaco',
        championships: 0,
        raceWins: 5,
        podiums: 23,
        poles: 9,
        rookieYear: 2018,
      },
      car: {
        id: 'car-sf75',
        name: 'F1-75',
        team: 'Scuderia Ferrari',
        season: '2022',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Ferrari 066/7 1.6L V6 hybrid',
        topSpeedKph: 340,
        races: 22,
        wins: 4,
        podiums: 17,
        poles: 12,
        imageUrl: 'https://placehold.co/400x220/ff002b/ffffff?text=F1-75',
      },
    },
    {
      id: '22-rb18-max',
      primaryColor: '#001aff',
      driver: {
        id: 'drv-max',
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        number: 1,
        country: 'Netherlands',
        championships: 2,
        raceWins: 35,
        podiums: 76,
        poles: 20,
        rookieYear: 2015,
      },
      car: {
        id: 'car-rb18',
        name: 'RB18',
        team: 'Red Bull Racing',
        season: '2022',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Honda RBPT 1.6L V6 hybrid',
        topSpeedKph: 348,
        races: 22,
        wins: 17,
        podiums: 21,
        poles: 7,
        imageUrl: 'https://placehold.co/400x220/001aff/ffffff?text=RB18',
      },
    },
    {
      id: '22-mcl36-lando',
      primaryColor: '#ff8700',
      driver: {
        id: 'drv-lando',
        name: 'Lando Norris',
        team: 'McLaren',
        number: 4,
        country: 'United Kingdom',
        championships: 0,
        raceWins: 0,
        podiums: 6,
        poles: 1,
        rookieYear: 2019,
      },
      car: {
        id: 'car-mcl36',
        name: 'MCL36',
        team: 'McLaren',
        season: '2022',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Mercedes-AMG F1 M13 1.6L V6 hybrid',
        topSpeedKph: 335,
        races: 22,
        wins: 0,
        podiums: 1,
        poles: 0,
        imageUrl: 'https://placehold.co/400x220/ff8700/ffffff?text=MCL36',
      },
    },
    {
      id: '22-w13-hamilton',
      primaryColor: '#00d2be',
      driver: {
        id: 'drv-lewis',
        name: 'Lewis Hamilton',
        team: 'Mercedes-AMG',
        number: 44,
        country: 'United Kingdom',
        championships: 7,
        raceWins: 103,
        podiums: 196,
        poles: 104,
        rookieYear: 2007,
      },
      car: {
        id: 'car-w13',
        name: 'W13',
        team: 'Mercedes-AMG',
        season: '2022',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Mercedes-AMG F1 M13 1.6L V6 hybrid',
        topSpeedKph: 338,
        races: 22,
        wins: 1,
        podiums: 17,
        poles: 1,
        imageUrl: 'https://placehold.co/400x220/00d2be/000000?text=W13',
      },
    },
  ],
  '2023': [
    {
      id: '23-rb19-max',
      primaryColor: '#001aff',
      driver: {
        id: 'drv-max',
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        number: 1,
        country: 'Netherlands',
        championships: 3,
        raceWins: 54,
        podiums: 98,
        poles: 32,
        rookieYear: 2015,
      },
      car: {
        id: 'car-rb19',
        name: 'RB19',
        team: 'Red Bull Racing',
        season: '2023',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Honda RBPT 1.6L V6 hybrid',
        topSpeedKph: 352,
        races: 22,
        wins: 21,
        podiums: 22,
        poles: 12,
        imageUrl: 'https://placehold.co/400x220/001aff/ffffff?text=RB19',
      },
    },
    {
      id: '23-sf23-lead',
      primaryColor: '#ff002b',
      driver: {
        id: 'drv-charles',
        name: 'Charles Leclerc',
        team: 'Scuderia Ferrari',
        number: 16,
        country: 'Monaco',
        championships: 0,
        raceWins: 5,
        podiums: 32,
        poles: 23,
        rookieYear: 2018,
      },
      car: {
        id: 'car-sf23',
        name: 'SF-23',
        team: 'Scuderia Ferrari',
        season: '2023',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Ferrari 066/10 1.6L V6 hybrid',
        topSpeedKph: 342,
        races: 22,
        wins: 0,
        podiums: 6,
        poles: 5,
        imageUrl: 'https://placehold.co/400x220/ff002b/ffffff?text=SF-23',
      },
    },
    {
      id: '23-amr23-alonso',
      primaryColor: '#006f62',
      driver: {
        id: 'drv-alonso',
        name: 'Fernando Alonso',
        team: 'Aston Martin',
        number: 14,
        country: 'Spain',
        championships: 2,
        raceWins: 32,
        podiums: 106,
        poles: 22,
        rookieYear: 2001,
      },
      car: {
        id: 'car-amr23',
        name: 'AMR23',
        team: 'Aston Martin',
        season: '2023',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Mercedes-AMG F1 M14 1.6L V6 hybrid',
        topSpeedKph: 340,
        races: 22,
        wins: 0,
        podiums: 8,
        poles: 0,
        imageUrl: 'https://placehold.co/400x220/006f62/ffffff?text=AMR23',
      },
    },
    {
      id: '23-w14-hamilton',
      primaryColor: '#00d2be',
      driver: {
        id: 'drv-lewis',
        name: 'Lewis Hamilton',
        team: 'Mercedes-AMG',
        number: 44,
        country: 'United Kingdom',
        championships: 7,
        raceWins: 103,
        podiums: 197,
        poles: 104,
        rookieYear: 2007,
      },
      car: {
        id: 'car-w14',
        name: 'W14',
        team: 'Mercedes-AMG',
        season: '2023',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Mercedes-AMG F1 M14 1.6L V6 hybrid',
        topSpeedKph: 340,
        races: 22,
        wins: 0,
        podiums: 6,
        poles: 1,
        imageUrl: 'https://placehold.co/400x220/00d2be/000000?text=W14',
      },
    },
  ],
  '2024': [
    {
      id: '24-sf23-lead',
      primaryColor: '#ff002b',
      driver: {
        id: 'drv-charles',
        name: 'Charles Leclerc',
        team: 'Scuderia Ferrari',
        number: 16,
        country: 'Monaco',
        championships: 0,
        raceWins: 7,
        podiums: 35,
        poles: 25,
        rookieYear: 2018,
      },
      car: {
        id: 'car-sf24',
        name: 'SF-24',
        team: 'Scuderia Ferrari',
        season: '2024',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Ferrari 066/12 1.6L V6 hybrid',
        topSpeedKph: 345,
        races: 24,
        wins: 5,
        podiums: 18,
        poles: 9,
        imageUrl: 'https://placehold.co/400x220/ff002b/ffffff?text=SF-24',
      },
    },
    {
      id: '24-rb19-max',
      primaryColor: '#001aff',
      driver: {
        id: 'drv-max',
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        number: 1,
        country: 'Netherlands',
        championships: 3,
        raceWins: 60,
        podiums: 100,
        poles: 40,
        rookieYear: 2015,
      },
      car: {
        id: 'car-rb20',
        name: 'RB20',
        team: 'Red Bull Racing',
        season: '2024',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Honda RBPT 1.6L V6 hybrid',
        topSpeedKph: 350,
        races: 24,
        wins: 14,
        podiums: 20,
        poles: 15,
        imageUrl: 'https://placehold.co/400x220/001aff/ffffff?text=RB20',
      },
    },
    {
      id: '24-sf24-sainz',
      primaryColor: '#ff002b',
      driver: {
        id: 'drv-sainz',
        name: 'Carlos Sainz',
        team: 'Scuderia Ferrari',
        number: 55,
        country: 'Spain',
        championships: 0,
        raceWins: 3,
        podiums: 21,
        poles: 5,
        rookieYear: 2015,
      },
      car: {
        id: 'car-sf24-2',
        name: 'SF-24',
        team: 'Scuderia Ferrari',
        season: '2024',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Ferrari 066/12 1.6L V6 hybrid',
        topSpeedKph: 345,
        races: 24,
        wins: 2,
        podiums: 10,
        poles: 3,
        imageUrl: 'https://placehold.co/400x220/ff002b/ffffff?text=SF-24',
      },
    },
    {
      id: '24-mcl38-norris',
      primaryColor: '#ff8700',
      driver: {
        id: 'drv-lando',
        name: 'Lando Norris',
        team: 'McLaren',
        number: 4,
        country: 'United Kingdom',
        championships: 0,
        raceWins: 2,
        podiums: 15,
        poles: 2,
        rookieYear: 2019,
      },
      car: {
        id: 'car-mcl38',
        name: 'MCL38',
        team: 'McLaren',
        season: '2024',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Mercedes-AMG F1 M15 1.6L V6 hybrid',
        topSpeedKph: 348,
        races: 24,
        wins: 2,
        podiums: 8,
        poles: 2,
        imageUrl: 'https://placehold.co/400x220/ff8700/ffffff?text=MCL38',
      },
    },
    {
      id: '24-w15-russell',
      primaryColor: '#00d2be',
      driver: {
        id: 'drv-russell',
        name: 'George Russell',
        team: 'Mercedes-AMG',
        number: 63,
        country: 'United Kingdom',
        championships: 0,
        raceWins: 2,
        podiums: 15,
        poles: 1,
        rookieYear: 2019,
      },
      car: {
        id: 'car-w15',
        name: 'W15',
        team: 'Mercedes-AMG',
        season: '2024',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Mercedes-AMG F1 M15 1.6L V6 hybrid',
        topSpeedKph: 346,
        races: 24,
        wins: 2,
        podiums: 9,
        poles: 1,
        imageUrl: 'https://placehold.co/400x220/00d2be/000000?text=W15',
      },
    },
  ],
  '2025': [
    {
      id: '25-sf25-lead',
      primaryColor: '#ff002b',
      driver: {
        id: 'drv-prospect',
        name: 'Future Ferrari Star',
        team: 'Scuderia Ferrari',
        number: 7,
        country: 'TBD',
        championships: 0,
        raceWins: 0,
        podiums: 0,
        poles: 0,
        rookieYear: 2025,
      },
      car: {
        id: 'car-sf25',
        name: 'SF-25 (concept)',
        team: 'Scuderia Ferrari',
        season: '2025',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Ferrari hybrid power unit',
        topSpeedKph: 350,
        races: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        imageUrl: 'https://placehold.co/400x220/ff002b/ffffff?text=SF-25',
      },
    },
    {
      id: '25-rb21-max',
      primaryColor: '#001aff',
      driver: {
        id: 'drv-max',
        name: 'Max Verstappen',
        team: 'Red Bull Racing',
        number: 1,
        country: 'Netherlands',
        championships: 4,
        raceWins: 65,
        podiums: 110,
        poles: 45,
        rookieYear: 2015,
      },
      car: {
        id: 'car-rb21',
        name: 'RB21 (concept)',
        team: 'Red Bull Racing',
        season: '2025',
        chassis: 'Carbon-fibre monocoque',
        powerUnit: 'Honda RBPT 1.6L V6 hybrid',
        topSpeedKph: 352,
        races: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        imageUrl: 'https://placehold.co/400x220/001aff/ffffff?text=RB21',
      },
    },
  ],
}

function OverviewSection() {
  return (
    <div className="panel panel-overview">
      <h2>Our Goal</h2>
      <p>
        <strong>F1 Inside the Grid</strong> is built for two types of people:
        those dreaming of getting into Formula 1, and those already obsessed
        with every lap, pit stop, and setup change.
      </p>
      <p>
        We translate the intense, high-tech world of F1 into clear language,
        rich history, and a living database of cars, drivers, and stats that
        grows with every season and race.
      </p>
      <ul className="highlight-list">
        <li>Learn the language of the paddock with real F1 jargon.</li>
        <li>Discover how the sport evolved from danger to data-driven precision.</li>
        <li>
          Explore cars and drivers connected through stats, seasons, and team
          history.
        </li>
      </ul>
    </div>
  )
}

function LearnSection() {
  return (
    <div className="panel panel-learn">
      <h2>Learn the Language of F1</h2>
      <p>
        F1 has its own vocabulary. Master these terms and you will never feel
        lost on a race weekend again.
      </p>
      <div className="jargon-grid">
        <div className="jargon-card">
          <h3>DRS (Drag Reduction System)</h3>
          <p>
            A movable rear wing flap that opens in specific zones to reduce
            drag and increase top speed when chasing another car.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Undercut</h3>
          <p>
            Pitting earlier than the car ahead to use fresher tyres and gain
            enough lap time to overtake when they stop.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Overcut</h3>
          <p>
            Staying out longer on older tyres, using clear air and race pace to
            jump cars that pitted before you.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Dirty Air</h3>
          <p>
            Turbulent airflow coming off a car ahead that reduces grip and
            makes following closely through corners difficult.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Parc Ferm&eacute;</h3>
          <p>
            A secure area where cars are held before and after qualifying and
            races; teams cannot make major setup changes here.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Power Unit</h3>
          <p>
            Modern F1 engines: a 1.6L turbo V6 plus hybrid systems that recover
            energy from braking and exhaust gases.
          </p>
        </div>
        <div className="jargon-card">
          <h3>Delta</h3>
          <p>
            The time difference a driver must respect, often under safety car
            or virtual safety car conditions.
          </p>
        </div>
        <div className="jargon-card">
          <h3>The Grid</h3>
          <p>
            The starting formation of cars before lights out, ordered by
            qualifying times and penalties.
          </p>
        </div>
      </div>
    </div>
  )
}

function HistorySection() {
  return (
    <div className="panel panel-history">
      <h2>History &amp; Fun Facts</h2>
      <p>
        From roaring V12s to ultra-efficient hybrids, F1 has constantly evolved
        while remaining the absolute peak of motorsport.
      </p>
      <ul className="fact-list">
        <li>
          The first official Formula 1 World Championship season was in 1950,
          with the opening race held at Silverstone in the United Kingdom.
        </li>
        <li>
          Teams are scored in the <strong>Constructors&apos; Championship</strong>,
          while drivers fight for the <strong>Drivers&apos; Championship</strong>.
        </li>
        <li>
          Modern F1 cars can generate more downforce than their own weight,
          theoretically allowing them to drive upside down in a tunnel.
        </li>
        <li>
          Pit stops regularly drop below two seconds, including lifting the car,
          changing four tyres, and sending the driver back out.
        </li>
        <li>
          Safety innovations from F1, such as carbon-fibre monocoques and the
          halo, have dramatically reduced serious injuries.
        </li>
        <li>
          Every season the technical regulations evolve, which is why our car
          and driver database is organised by year.
        </li>
      </ul>
    </div>
  )
}

type DatabaseSectionProps = {
  season: string
  onSeasonChange: (value: string) => void
}

function DatabaseSection({ season, onSeasonChange }: DatabaseSectionProps) {
  const entries = carDatabaseBySeason[season] ?? []
  const [selectedId, setSelectedId] = useState<string | null>(
    entries[0]?.id ?? null,
  )

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

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [season, setSeason] = useState<string>('2024')

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">F1</span>
          <span className="brand-text">Inside the Grid</span>
        </div>
        <nav className="nav">
          <button
            className={activeTab === 'overview' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('overview')}
          >
            Home
          </button>
          <button
            className={activeTab === 'learn' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('learn')}
          >
            Learn F1
          </button>
          <button
            className={activeTab === 'history' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('history')}
          >
            History &amp; Facts
          </button>
          <button
            className={activeTab === 'database' ? 'nav-item active' : 'nav-item'}
            onClick={() => setActiveTab('database')}
          >
            Cars &amp; Drivers
          </button>
        </nav>
      </header>

      <main className="app-main">
        <section className="hero">
          <div className="hero-visual">
            <div className="neon-track" />
            <div className="hero-glow" />
            <div className="hero-car">🏎️</div>
            <div className="hero-driver">🏁</div>
          </div>
          <div className="hero-content">
            <p className="hero-tagline">Welcome to</p>
            <h1>F1 Inside the Grid</h1>
            <p className="hero-text">
              A neon-soaked gateway into the world of Formula 1 &mdash; from
              your first race to deep-dive stats that follow every car, driver,
              and season.
            </p>
            <div className="hero-actions">
              <button
                className="primary-cta"
                onClick={() => setActiveTab('learn')}
              >
                Start learning F1
              </button>
              <button
                className="secondary-cta"
                onClick={() => setActiveTab('database')}
              >
                Explore cars &amp; drivers
              </button>
            </div>
          </div>
        </section>

        <section className="tabs-section">
          <div className="tab-list">
            <button
              className={
                activeTab === 'overview' ? 'tab-button active' : 'tab-button'
              }
              onClick={() => setActiveTab('overview')}
            >
              Our Goal
            </button>
            <button
              className={
                activeTab === 'learn' ? 'tab-button active' : 'tab-button'
              }
              onClick={() => setActiveTab('learn')}
            >
              F1 Jargon
            </button>
            <button
              className={
                activeTab === 'history' ? 'tab-button active' : 'tab-button'
              }
              onClick={() => setActiveTab('history')}
            >
              History &amp; Fun Facts
            </button>
            <button
              className={
                activeTab === 'database' ? 'tab-button active' : 'tab-button'
              }
              onClick={() => setActiveTab('database')}
            >
              Car &amp; Driver Database
            </button>
          </div>

          <div className="tab-panels">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'learn' && <LearnSection />}
            {activeTab === 'history' && <HistorySection />}
            {activeTab === 'database' && (
              <DatabaseSection season={season} onSeasonChange={setSeason} />
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Built for future drivers, engineers, strategists, and fans &mdash; all{' '}
          <span className="accent-text">inside the grid</span>.
        </p>
      </footer>
    </div>
  )
}

export default App
