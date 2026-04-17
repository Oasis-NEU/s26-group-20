'use client'

import Image from 'next/image'
import Link from 'next/link'
import { OverviewSection } from './components/ContentSections'

export default function AppPage() {
  return (
    <>
      <main className="app-main">
        <section className="hero">
          <div className="hero-visual">
            <Image
              className="hero-image"
              src="/HomepageImage.png"
              alt="Homepage hero image"
              width={1200}
              height={800}
              priority
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
              <Link className="primary-cta" href="/learn">
                Start learning F1
              </Link>
              <Link className="secondary-cta" href="/cars-and-drivers">
                Explore cars &amp; drivers
              </Link>
            </div>
          </div>
        </section>

        <section className="tabs-section">
          <OverviewSection />
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
