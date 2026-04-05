"use client"

import { useEffect, useState } from 'react'

type GlossaryTerm = {
  id: string
  term: string
  short_definition: string
}

export function OverviewSection() {
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

export function LearnSection() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  return (
    <div className="panel panel-learn">
      <h2>Learn the Language of F1</h2>
      <p>
        F1 has its own vocabulary. Master these terms and you will never feel
        lost on a race weekend again.
      </p>
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

        {!loading && !error && terms.map((item) => (
          <div className="jargon-card" key={item.id}>
            <h3>{item.term}</h3>
            <p>{item.short_definition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HistorySection() {
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
