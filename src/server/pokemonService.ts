import pokemonData from '@/data/pokemon.json'
import {
  type Pokemon,
  POKEMON_STAT_KEYS,
  type PokemonStatMaxes
} from '@/types/pokemon'

type PokemonSearchResult = {
  data: Pokemon[]
  pagination: {
    hasNext: boolean
    hasPrev: boolean
    limit: number
    page: number
    total: number
    totalPages: number
  }
}

export function createPokemonService(dataset: Pokemon[]) {
  const searchable = dataset.map(pokemon => ({
    pokemon,
    searchText:
      `${pokemon.name} ${pokemon.types.join(' ')} ${pokemon.description}`.toLowerCase()
  }))

  const searchCache = new Map<string, Pokemon[]>()
  const statMaxes = computeStatMaxes(dataset)

  function searchPokemon(
    search: string,
    page: number,
    limit: number
  ): PokemonSearchResult {
    const filtered = getFilteredPokemon(search)
    const total = filtered.length
    const totalPages = Math.ceil(total / limit)
    const startIndex = (page - 1) * limit
    const paginatedPokemon = filtered.slice(startIndex, startIndex + limit)

    return {
      data: paginatedPokemon,
      pagination: {
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit,
        page,
        total,
        totalPages
      }
    }
  }

  function getFilteredPokemon(search: string): Pokemon[] {
    if (!search) return dataset

    const cached = searchCache.get(search)
    if (cached) return cached

    const filtered = searchable
      .filter(entry => entry.searchText.includes(search))
      .map(entry => entry.pokemon)

    searchCache.set(search, filtered)
    return filtered
  }

  function getStatMaxes(): PokemonStatMaxes {
    return statMaxes
  }

  return { getStatMaxes, searchPokemon }
}

function computeStatMaxes(dataset: Pokemon[]): PokemonStatMaxes {
  const maxStatValues = Object.fromEntries(
    POKEMON_STAT_KEYS.map(statKey => [statKey, 0])
  ) as PokemonStatMaxes

  for (const pokemon of dataset) {
    for (const statKey of POKEMON_STAT_KEYS) {
      maxStatValues[statKey] = Math.max(maxStatValues[statKey], pokemon[statKey])
    }
  }

  return maxStatValues
}

export const pokemonService = createPokemonService(
  pokemonData as Pokemon[]
)
