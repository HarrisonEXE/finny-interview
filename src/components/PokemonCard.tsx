'use client'

import type { KeyboardEvent } from 'react'

import Image from 'next/image'
import { memo, useState } from 'react'

import type { PokemonStatMaxes } from '@/types/pokemon'
import type { Pokemon } from '@/types/pokemon'

import {
  getPokemonTypeAccentTextClass,
  getPokemonTypeBadgeClass,
  getPokemonTypeHeroClass
} from '@/lib/pokemonTypeColors'
import { capitalizePokemonName, cn } from '@/lib/utils'

import { PokemonStats } from './PokemonStats'

type PokemonCardProps = {
  className?: string
  pokemon: Pokemon
  statMaxes: PokemonStatMaxes | undefined
}

export const PokemonCard = memo(function PokemonCard({
  className,
  pokemon,
  statMaxes
}: PokemonCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [hasImageLoadError, setHasImageLoadError] = useState(false)
  const primaryType = pokemon.types[0] ?? 'Normal'

  const toggleExpanded = () => {
    setExpanded(previousExpanded => !previousExpanded)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggleExpanded()
    }
  }

  return (
    <article
      aria-expanded={expanded}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200/70 bg-white/95 shadow-md transition-[transform,color,box-shadow] duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className
      )}
      onClick={toggleExpanded}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div
        className={cn(
          'relative h-72 overflow-hidden rounded-b-xl p-3',
          getPokemonTypeHeroClass(primaryType)
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/85" />
        {hasImageLoadError ? (
          <div className="flex h-full items-center justify-center rounded-lg bg-white/40 text-sm text-slate-200">
            No image
          </div>
        ) : (
          <Image
            alt={capitalizePokemonName(pokemon.name)}
            className="object-contain object-center p-3 drop-shadow-[0_14px_18px_rgba(15,23,42,0.25)] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            fill
            onError={() => setHasImageLoadError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={pokemon.imageUrl}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 pt-5">
        <h2
          className={cn(
            'text-2xl font-semibold tracking-tight text-slate-950 transition-colors duration-300',
            getPokemonTypeAccentTextClass(primaryType)
          )}
        >
          {capitalizePokemonName(pokemon.name)}
        </h2>

        <ul className="flex flex-wrap gap-2">
          {pokemon.types.map(type => (
            <li
              className={cn(
                'min-w-20 rounded-none px-2.5 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm transition-transform duration-300 ease-out group-hover:-translate-y-0.5',
                getPokemonTypeBadgeClass(type)
              )}
              key={type}
            >
              {type}
            </li>
          ))}
        </ul>

        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-out',
            expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-500">{pokemon.description}</p>

              <div className="grid grid-cols-3 gap-4 rounded-lg bg-slate-50 px-4 py-3 text-center text-sm">
                <div>
                  <span className="text-slate-400">Height</span>
                  <p className="font-semibold tabular-nums text-slate-900">
                    {pokemon.height.toFixed(2)} m
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Weight</span>
                  <p className="font-semibold tabular-nums text-slate-900">
                    {pokemon.weight.toFixed(2)} kg
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Generation</span>
                  <p className="font-semibold text-slate-900">
                    {pokemon.generation}
                  </p>
                </div>
              </div>

              {statMaxes && (
                <PokemonStats pokemon={pokemon} statMaxes={statMaxes} />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
})
