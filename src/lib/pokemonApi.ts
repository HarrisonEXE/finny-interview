import { z } from 'zod'

import type { PokemonStatMaxes } from '@/types/pokemon'

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

  const response = await fetch(`/api/pokemon?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch Pokémon')
  const responseBody: unknown = await response.json()
  return PokemonPageSchema.parse(responseBody)
}

export async function fetchPokemonStatMaxes(): Promise<PokemonStatMaxes> {
  const response = await fetch('/api/pokemon/stat-maxes')
  if (!response.ok) throw new Error('Failed to fetch stat maxes')
  const responseBody: unknown = await response.json()
  return StatMaxesResponseSchema.parse(responseBody).data
}
