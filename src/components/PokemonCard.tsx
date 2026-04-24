'use client'

import type { KeyboardEvent } from 'react'

import Image from 'next/image'
import { memo, useState } from 'react'

import type { PokemonStatMaxes } from '@/types/pokemon'
import type { Pokemon } from '@/types/pokemon'

import { getPokemonTypeBadgeClass } from '@/lib/pokemonTypeColors'
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
        'group relative cursor-pointer overflow-hidden rounded-xl transition-[transform,color] duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className
      )}
      onClick={toggleExpanded}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="relative h-72 overflow-hidden rounded-b-xl bg-slate-100">
        {hasImageLoadError ? (
          <div className="flex h-full items-center justify-center bg-slate-200 text-sm text-slate-400">
            No image
          </div>
        ) : (
          <Image
            alt={capitalizePokemonName(pokemon.name)}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            fill
            onError={() => setHasImageLoadError(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={pokemon.imageUrl}
          />
        )}
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 pt-5">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-indigo-700">
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
