import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { pokemonService } from '@/server/pokemonService'

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parsePositiveInt(searchParams.get('page'), 1)
    const limit = parsePositiveInt(searchParams.get('limit'), 20)
    const search = (searchParams.get('search') ?? '').trim().toLowerCase()

    return NextResponse.json(pokemonService.searchPokemon(search, page, limit))
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    )
  }
}

function parsePositiveInt(value: null | string, fallback: number) {
  const parsedValue = Number.parseInt(value ?? '', 10)

  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback
}
