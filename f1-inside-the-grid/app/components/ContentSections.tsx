"use client"

import { useEffect, useState } from 'react'

type GlossaryTerm = {
  id: string
  term: string
  short_definition: string
  category?: string
  long_definition?: string
}

export function OverviewSection() {
  return (
    <div className="panel panel-overview">
      <h2>Our Mission</h2>

      <div className="mission-grid">
        <div className="mission-section">
          <div className="mission-header">
            <span className="mission-number">01</span>
            <h3>
              Learn the <span className="accent-text">language</span>
            </h3>
          </div>
          <p>
            Every sport has its dialect. F1's is dense with engineering and strategy terms that insiders throw around at race speed. We built a real paddock glossary — not watered-down summaries, but the actual vocabulary used by engineers, strategists, and commentators. From undercut to parc fermé, you'll understand every call.
          </p>
        </div>

        <div className="mission-section">
          <div className="mission-header">
            <span className="mission-number">02</span>
            <h3>
              Discover the <span className="accent-text">history</span>
            </h3>
          </div>
          <p>
            F1 didn't arrive fully formed. It evolved from tin-sheet cars racing on public roads to 200mph carbon fibre machines governed by a thousand regulations. We trace that arc — the eras of raw danger, the landmark rule changes, the dynasties, the upsets — so you understand not just what F1 is, but how it got here.
          </p>
        </div>

        <div className="mission-section">
          <div className="mission-header">
            <span className="mission-number">03</span>
            <h3>
              Explore the <span className="accent-text">data</span>
            </h3>
          </div>
          <p>
            Cars and drivers don't exist in isolation. They're connected through constructor histories, season results, teammate comparisons, and championship battles. Our living database links it all — stats that update with every race, team lineages going back decades, and performance metrics that tell the story numbers alone can't.
          </p>
        </div>
      </div>

      <div className="audience-grid">
        <div className="audience-card audience-card-newcomer">
          <span className="audience-kicker">For the newcomer</span>
          <h3>Start from zero, go somewhere fast</h3>
          <p>
            You don't need a background in engineering or a childhood watching races. We built an entry point that respects your intelligence without drowning you in detail. Pick up the jargon. Read the origin story. Follow your first season with context that makes every race make sense.
          </p>
        </div>

        <div className="audience-card audience-card-devoted">
          <span className="audience-kicker">For the devoted fan</span>
          <h3>Go deeper than the broadcast</h3>
          <p>
            You already know the teams and the talking points. We're for the moments when you want to go further — the technical detail behind a setup call, the historical precedent for a rule change, the stat that reframes a rivalry. This is the layer beneath the TV coverage.
          </p>
        </div>
      </div>
    </div>
  )
}

export function LearnSection() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'car-tech', 'strategy', 'race-weekend', 'championship']

  useEffect(() => {
    let cancelled = false

    async function loadGlossary() {
      try {
        setLoading(true)
        const response = await fetch('/api/glossary')
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const payload = (await response.json()) as { terms?: GlossaryTerm[] }
        if (!cancelled) {
          setTerms(Array.isArray(payload.terms) ? payload.terms : [])
          setError(null)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load jargon from glossary right now.')
          setTerms([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadGlossary()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredTerms = terms.filter((item) => {
    const search = searchTerm.trim().toLowerCase()
    const matchesSearch = item.term.toLowerCase().includes(search)
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="panel panel-learn">
      <h2>Learn the Language of F1</h2>
      <p>
        F1 has its own vocabulary. Master these terms and you will never feel
        lost on a race weekend again.
      </p>

      <div className="jargon-controls">
        <div className="search-field">
          <label htmlFor="jargon-search" className="sr-only">
            Search glossary
          </label>
          <input
            id="jargon-search"
            type="search"
            value={searchTerm}
            placeholder="Search terms..."
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category === 'All' ? 'All' : category}
            </button>
          ))}
        </div>

        <div className="jargon-count">{filteredTerms.length} terms shown</div>
      </div>

      <div className="jargon-grid">
        {loading && (
          <div className="jargon-card">
            <h3>Loading glossary...</h3>
            <p>Pulling the latest F1 terms from the database.</p>
          </div>
        )}

        {!loading && error && (
          <div className="jargon-card">
            <h3>Glossary unavailable</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && filteredTerms.length === 0 && (
          <div className="empty-state">
            No terms found. Try a different search.
          </div>
        )}

        {!loading && !error && filteredTerms.map((item) => (
          <div className="jargon-card" key={item.id}>
            <div className="card-header">
              <h3>{item.term}</h3>
            </div>
            {item.category && (
              <span className={`category-pill category-pill-${item.category}`}>
                {item.category}
              </span>
            )}
            <p className="definition-short">{item.short_definition}</p>
            {item.long_definition && (
              <p className="definition-long">{item.long_definition}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HistorySection() {
  return (
    <div className="panel panel-history">
      <h2>The story of the <span className="accent-text">fastest</span> sport on earth</h2>
      <p>
        From roaring V12s to ultra-efficient hybrids, F1 has constantly
        evolved — driven by obsession, tragedy, rivalry, and the relentless
        pursuit of the last tenth of a second.
      </p>

      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-num">75</div>
          <div className="stat-label">Seasons of racing</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">34</div>
          <div className="stat-label">World champions</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">1.80s</div>
          <div className="stat-label">Fastest ever pit stop</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">6G</div>
          <div className="stat-label">Cornering force</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">30+</div>
          <div className="stat-label">Countries visited</div>
        </div>
      </div>

      <div className="timeline">
        <div className="fact-item">
          <div className="fact-dot"></div>
          <div className="fact-year">1950 — Where it all began</div>
          <h3 className="fact-title">The first race, Silverstone</h3>
          <p className="fact-body">
            The first official Formula 1 World Championship race took place on 13 May 1950 at Silverstone, England. Giuseppe Farina won both the race and that inaugural title driving for Alfa Romeo. Seventy-five years later, the sport has visited over 30 countries and crowned 34 different world champions.
          </p>
        </div>

        <div className="fact-item">
          <div className="fact-dot"></div>
          <div className="fact-year">Always — Two championships, one sport</div>
          <h3 className="fact-title">Drivers vs constructors</h3>
          <p className="fact-body">
            Every team competes on two fronts simultaneously. Drivers fight each other for the Drivers' Championship, while the points they score also count toward their constructor's tally in the separate Constructors' Championship — meaning a single race result carries double the strategic weight.
          </p>
        </div>

        <div className="fact-item">
          <div className="fact-dot"></div>
          <div className="fact-year">Engineering — Physics at the limit</div>
          <h3 className="fact-title">Theoretically, upside down</h3>
          <p className="fact-body">
            Modern F1 cars generate so much aerodynamic downforce they could theoretically drive upside down through a tunnel at racing speed. That same grip allows them to corner at forces exceeding 6G — roughly six times a driver's own body weight pressing against them through every high-speed bend.
          </p>
        </div>

        <div className="fact-item">
          <div className="fact-dot"></div>
          <div className="fact-year">Pit lane — The two-second miracle</div>
          <h3 className="fact-title">Sixteen mechanics, 1.80 seconds</h3>
          <p className="fact-body">
            A modern F1 pit stop takes around 2.3 seconds. Sixteen mechanics jack the car, remove and replace all four tyres, lower it back down, and release the driver — a choreography rehearsed thousands of times. The current world record stands at 1.80 seconds, set by Red Bull Racing.
          </p>
        </div>

        <div className="fact-item">
          <div className="fact-dot"></div>
          <div className="fact-year">Safety — Safer by design</div>
          <h3 className="fact-title">Innovations that saved lives</h3>
          <p className="fact-body">
            F1 has always pushed safety technology as hard as it pushes performance. Carbon-fibre survival cells, HANS devices, and the halo structure have transformed survivability in high-speed crashes. Innovations born on the F1 grid have filtered into road cars and saved countless lives beyond the sport.
          </p>
        </div>

        <div className="fact-item">
          <div className="fact-dot"></div>
          <div className="fact-year">Our database — Why seasons matter</div>
          <h3 className="fact-title">Context is everything in F1</h3>
          <p className="fact-body">
            The technical regulations in F1 can change so dramatically from one year to the next that a dominant car one season can become uncompetitive the next. New rules rewrite the performance order. That's why our entire database is organised by season — because in F1, context is everything.
          </p>
        </div>
      </div>
    </div>
  )
}
