'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  HistorySection,
  LearnSection,
  OverviewSection,
} from './components/ContentSections'

type TabId = 'overview' | 'learn' | 'history'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab')
    if (tab === 'overview' || tab === 'learn' || tab === 'history') {
      setActiveTab(tab)
    }
  }, [])

  return (
    <>
      <main className="app-main">
        <section className="hero">
          <div className="hero-visual">
            <img
              className="hero-image"
              src="/HomepageImage.png"
              alt="Homepage hero image"
            />
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
              <Link className="secondary-cta" href="/cars-and-drivers">
                Explore cars &amp; drivers
              </Link>
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
              Our Mission
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
          </div>

          <div className="tab-panels">
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'learn' && <LearnSection />}
            {activeTab === 'history' && <HistorySection />}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Built for future drivers, engineers, strategists, and fans &mdash; all{' '}
          <span className="accent-text">inside the grid</span>.
        </p>
      </footer>
    </>
  )
}
