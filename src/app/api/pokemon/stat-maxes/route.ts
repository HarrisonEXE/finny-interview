import { NextResponse } from 'next/server'

import { pokemonService } from '@/server/pokemonService'

export function GET() {
  try {
    return NextResponse.json({ data: pokemonService.getStatMaxes() })
  } catch (error) {
    console.error('Error fetching Pokemon stat maxes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon stat maxes' },
      { status: 500 }
    )
  }
}
