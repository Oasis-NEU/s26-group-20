// Country nationality to flag emoji
const COUNTRY_CODE_BY_NATIONALITY: Record<string, string> = {
  'British': '🇬🇧', 'Dutch': '🇳🇱', 'Spanish': '🇪🇸',
  'Finnish': '🇫🇮', 'Monégasque': '🇲🇨', 'Mexican': '🇲🇽',
  'French': '🇫🇷', 'Australian': '🇦🇺', 'Thai': '🇹🇭',
  'German': '🇩🇪', 'Danish': '🇩🇰', 'Canadian': '🇨🇦',
  'Japanese': '🇯🇵', 'Chinese': '🇨🇳', 'American': '🇺🇸',
  'Italian': '🇮🇹', 'Austrian': '🇦🇹', 'Swiss': '🇨🇭',
  'Belgian': '🇧🇪', 'Brazilian': '🇧🇷',
}

export function nationalityToFlag(nationality: string): string {
  return COUNTRY_CODE_BY_NATIONALITY[nationality] ?? '🏁'
}

// Team name to subtle card border colour
export const TEAM_ACCENT_BY_NAME: Record<string, string> = {
  'Red Bull Racing':  'rgba(30,40,200,0.35)',
  'Ferrari':          'rgba(200,20,20,0.4)',
  'Mercedes':         'rgba(0,180,160,0.3)',
  'McLaren':          'rgba(255,120,0,0.35)',
  'Aston Martin':     'rgba(0,150,60,0.3)',
  'Alpine':           'rgba(0,100,200,0.3)',
  'Williams':         'rgba(0,150,220,0.3)',
  'Haas F1 Team':     'rgba(200,20,10,0.25)',
  'RB':               'rgba(80,60,200,0.3)',
  'Kick Sauber':      'rgba(0,140,50,0.25)',
}

// Driver initials from full name
export function initials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// Format points — preserve half-points like 107.64
export function formatPoints(points: number): string {
  return points % 1 === 0
    ? points.toLocaleString()
    : points.toFixed(2)
}

// Format a rate (0.331) as a percentage string ("33.1%")
export function formatRate(rate: number): string {
  return (rate * 100).toFixed(1) + '%'
}
