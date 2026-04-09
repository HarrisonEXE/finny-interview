export type Pokemon = {
  attack: number
  defense: number
  description: string
  generation: number
  height: number
  hp: number
  id: number
  imageUrl: string
  isLegendary?: boolean
  name: string
  specialAttack: number
  specialDefense: number
  speed: number
  types: string[]
  weight: number
}

export const POKEMON_STAT_KEYS = [
  'hp',
  'attack',
  'defense',
  'specialAttack',
  'specialDefense',
  'speed'
] as const satisfies ReadonlyArray<keyof Pokemon>

export type PokemonStatKey = (typeof POKEMON_STAT_KEYS)[number]

export type PokemonStatMaxes = Record<PokemonStatKey, number>
