'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href === '/cars-and-drivers') {
    return pathname === href || pathname.startsWith('/drivers/') || pathname.startsWith('/constructors/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-mark">F1</span>
        <span className="brand-text">Inside the Grid</span>
      </div>
      <nav className="nav">
        <Link className={isActive(pathname, '/') ? 'nav-item active' : 'nav-item'} href="/">
          Home
        </Link>
        <Link className={isActive(pathname, '/learn') ? 'nav-item active' : 'nav-item'} href="/learn">
          Learn F1
        </Link>
        <Link className={isActive(pathname, '/history') ? 'nav-item active' : 'nav-item'} href="/history">
          History &amp; Facts
        </Link>
        <Link
          className={isActive(pathname, '/cars-and-drivers') ? 'nav-item active' : 'nav-item'}
          href="/cars-and-drivers"
        >
          Cars &amp; Drivers
        </Link>
      </nav>
    </header>
  )
}