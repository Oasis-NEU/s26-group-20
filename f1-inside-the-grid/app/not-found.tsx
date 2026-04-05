import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'radial-gradient(circle at 10% 0%, #330010 0, #050007 46%, #000000 100%)',
        color: 'var(--text)',
        padding: '24px',
      }}
    >
      <section
        style={{
          width: 'min(640px, 100%)',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(12, 2, 19, 0.9)',
          borderRadius: '14px',
          padding: '22px',
          boxShadow: '0 0 30px rgba(255, 0, 60, 0.22)',
        }}
      >
        <p style={{ letterSpacing: '.16em', fontSize: '12px', color: 'var(--muted)', margin: 0 }}>
          404
        </p>
        <h1 style={{ marginTop: '10px', marginBottom: '10px', color: 'var(--text)' }}>
          Driver not found
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 0 }}>
          This driver profile does not exist in the current dataset.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '18px' }}>
          <Link
            href='/?tab=database'
            style={{
              borderRadius: '999px',
              border: '1px solid transparent',
              padding: '10px 16px',
              fontWeight: 800,
              letterSpacing: '.06em',
              background: 'linear-gradient(120deg, var(--accent), var(--accent-soft))',
              color: '#fff',
            }}
          >
            BACK TO CARS & DRIVERS
          </Link>
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
            HOME
          </Link>
        </div>
      </section>
    </main>
  )
}
