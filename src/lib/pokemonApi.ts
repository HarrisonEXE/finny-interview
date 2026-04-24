import { z } from 'zod'

import type { PokemonStatMaxes } from '@/types/pokemon'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const PokemonSchema = z.object({
  attack: z.number(),
  defense: z.number(),
  description: z.string(),
  generation: z.number(),
  height: z.number(),
  hp: z.number(),
  id: z.number(),
  imageUrl: z.string(),
  isLegendary: z.boolean().optional(),
  name: z.string(),
  specialAttack: z.number(),
  specialDefense: z.number(),
  speed: z.number(),
  types: z.array(z.string()),
  weight: z.number()
})

const PokemonPageSchema = z.object({
  data: z.array(PokemonSchema),
  pagination: z.object({
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
    limit: z.number(),
    page: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
})

export type PokemonPage = z.infer<typeof PokemonPageSchema>

const StatMaxesResponseSchema = z.object({
  data: z.object({
    attack: z.number(),
    defense: z.number(),
    hp: z.number(),
    specialAttack: z.number(),
    specialDefense: z.number(),
    speed: z.number()
  })
})

const CollectionItemSchema = z.object({
  pokemon_id: z.number(),
  pokemon_name: z.string(),
  added_at: z.string().nullable().optional()
})

export type CollectionItem = z.infer<typeof CollectionItemSchema>

const CollectionResponseSchema = z.object({
  data: z.array(CollectionItemSchema)
})

const CollectionItemResponseSchema = z.object({
  data: CollectionItemSchema
})

const PAGE_SIZE = 20

export async function fetchPokemonPage(
  pageParam: number,
  search: string
): Promise<PokemonPage> {
  const searchParams = new URLSearchParams({
    limit: String(PAGE_SIZE),
    page: String(pageParam)
  })
  if (search) searchParams.set('search', search)

  const response = await fetch(`${API_URL}/pokemon?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch Pokémon')
  const responseBody: unknown = await response.json()
  return PokemonPageSchema.parse(responseBody)
}

export async function fetchPokemonStatMaxes(): Promise<PokemonStatMaxes> {
  const response = await fetch(`${API_URL}/pokemon/stat-maxes`)
  if (!response.ok) throw new Error('Failed to fetch stat maxes')
  const responseBody: unknown = await response.json()
  return StatMaxesResponseSchema.parse(responseBody).data
}

export async function fetchCollection(): Promise<CollectionItem[]> {
  const response = await fetch(`${API_URL}/collection`)
  if (!response.ok) throw new Error('Failed to fetch collection')
  const responseBody: unknown = await response.json()
  return CollectionResponseSchema.parse(responseBody).data
}

export async function addToCollection(
  pokemonId: number,
  pokemonName: string
): Promise<CollectionItem> {
  const response = await fetch(`${API_URL}/collection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pokemon_id: pokemonId, pokemon_name: pokemonName })
  })
  if (!response.ok) throw new Error('Failed to add to collection')
  const responseBody: unknown = await response.json()
  return CollectionItemResponseSchema.parse(responseBody).data
}

export async function removeFromCollection(pokemonId: number): Promise<void> {
  const response = await fetch(`${API_URL}/collection/${pokemonId}`, {
    method: 'DELETE'
  })
  if (!response.ok && response.status !== 404) {
    throw new Error('Failed to remove from collection')
  }
}
