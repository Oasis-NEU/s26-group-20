export type Driver = {
  id: string
  name: string
  nationality: string
  era_decade: number
  race_wins: number
  pole_positions: number
  championships_count: number
  is_champion: boolean
  is_active: boolean
  race_entries: number
  points: number
  win_rate: number
  podium_rate: number
  dominance_score: number | null
  driver_code: string | null
}

export type Constructor = {
  id: number
  name: string
  nationality: string
  constructor_ref: string
}

export type EraRow = {
  decade: number
  label: string
  slug: string
  dominant_constructor: string | null
  driver_count: number
  champion_count: number
}

export type RaceResult = {
  round: number
  name: string
  circuit_name: string
  country: string
  winner_name: string
  winner_code: string | null
  constructor_name: string
}

export type GlossaryTerm = {
  id: string
  term: string
  short_definition: string
}
