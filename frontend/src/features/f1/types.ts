export type Driver = {
  id: string
  name: string
  team: string
  number: number
  country: string
  championships: number
  raceWins: number
  podiums: number
  poles: number
  rookieYear: number
}

export type Car = {
  id: string
  name: string
  team: string
  season: string
  chassis: string
  powerUnit: string
  topSpeedKph: number
  races: number
  wins: number
  podiums: number
  poles: number
  imageUrl?: string
}

export type CarWithDriver = {
  id: string
  driver: Driver
  car: Car
  primaryColor: string
}

export type TabId = 'overview' | 'learn' | 'history' | 'database'
