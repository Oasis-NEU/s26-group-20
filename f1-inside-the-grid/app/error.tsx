'use client'

import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background:
          'radial-gradient(circle at 10% 0%, #330010 0, #050007 46%, #000000 100%)',
        color: 'var(--text)',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: 'min(680px, 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(12, 2, 19, 0.9)',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 0 30px rgba(255, 0, 60, 0.22)',
        }}
      >
        <p style={{ letterSpacing: '.16em', fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
          DRIVER PAGE ERROR
        </p>
        <h1 style={{ marginTop: '10px', marginBottom: '10px', color: 'var(--text)' }}>
          Something went off-track
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>
          The page hit a runtime issue. Try reloading this route.
        </p>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
          <button
            onClick={() => reset()}
            style={{
              borderRadius: '999px',
              border: '1px solid transparent',
              padding: '10px 16px',
              fontWeight: 800,
              letterSpacing: '.06em',
              background: 'linear-gradient(120deg, var(--accent), var(--accent-soft))',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            TRY AGAIN
          </button>
          <Link
            href='/'
            style={{
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.24)',
              padding: '10px 16px',
              fontWeight: 800,
              letterSpacing: '.06em',
              color: 'var(--text)',
            }}
          >
            GO HOME
          </Link>
        </div>

        {process.env.NODE_ENV !== 'production' && error?.message && (
          <p style={{ marginTop: '14px', color: '#777', fontSize: '12px' }}>{error.message}</p>
        )}
      </section>
    </main>
  )
}
