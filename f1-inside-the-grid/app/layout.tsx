import type { Metadata } from 'next'
import './app.css'
import './globals.css'
import { SiteNav } from './components/SiteNav'

export const metadata: Metadata = {
  title: 'F1 Inside the Grid',
  description: 'A neon-soaked gateway into the world of Formula 1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="app">
          <SiteNav />
          {children}
        </div>
      </body>
    </html>
  )
}
