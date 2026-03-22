import { useState } from 'react'
import './App.css'
import { DatabaseSection } from './features/f1/components/DatabaseSection'
import {
  HistorySection,
  LearnSection,
  OverviewSection,
} from './features/f1/components/ContentSections'
import type { TabId } from './features/f1/types'

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
