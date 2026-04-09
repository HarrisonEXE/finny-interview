'use client'

import { Loader2, Search, X } from 'lucide-react'

import { usePokemonData } from '@/hooks/usePokemonData'
import {
  CARD_GAP,
  usePokemonVirtualGrid
} from '@/hooks/usePokemonVirtualGrid'

import { PokemonCard } from './PokemonCard'
import { Input } from './ui/input'

const SKELETON_COUNT = 8

export function PokemonGrid() {
  const {
    allPokemon,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isInitialLoad,
    isLoading,
    isSearchPending,
    refetch,
    search,
    setSearch,
    statMaxes
  } = usePokemonData()

  const {
    columns,
    gridRef,
    measureElement,
    rowCount,
    scrollMargin,
    totalSize,
    virtualRows
  } = usePokemonVirtualGrid({
    fetchNextPage: () => void fetchNextPage(),
    hasNextPage,
    isFetchingNextPage,
    itemCount: allPokemon.length
  })

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Pokémon Explorer
        </h1>

        <search className="relative max-w-md">
          <Input
            aria-label="Search Pokémon by name, description, or type"
            className="h-12 rounded-full border-white/80 bg-white/90 px-5 pr-12 text-base shadow-[0_18px_40px_rgba(148,163,184,0.18)] md:text-base"
            onChange={event => setSearch(event.target.value)}
            placeholder="Search by name, description, or type"
            type="text"
            value={search}
          />
          {isSearchPending || isLoading ? (
            <Loader2 className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 animate-spin" />
          ) : search ? (
            <button
              aria-label="Clear search"
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-0.5 text-slate-400 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              onClick={() => setSearch('')}
              type="button"
            >
              <X className="size-4" />
            </button>
          ) : (
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2" />
          )}
        </search>
      </div>

      <div aria-live="polite" className="sr-only">
        {isInitialLoad
          ? 'Loading Pokémon'
          : isError
            ? 'Failed to load Pokémon'
            : `${allPokemon.length} Pokémon found`}
      </div>

      {isInitialLoad && (
        <div
          className="grid gap-6"
          style={{
            gridTemplateColumns: `repeat(${columns || 1}, minmax(0, 1fr))`
          }}
        >
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-start gap-3">
          <p className="text-destructive text-sm">Could not load Pokémon.</p>
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            onClick={() => void refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      )}

      {!isInitialLoad && !isError && allPokemon.length === 0 && (
        <p className="text-muted-foreground text-sm">No Pokémon found.</p>
      )}

      <div ref={gridRef}>
        <div
          className="relative"
          style={{ height: rowCount > 0 ? totalSize : 0 }}
        >
          {virtualRows.map(virtualRow => {
            const startIndex = virtualRow.index * columns
            const rowPokemon = allPokemon.slice(
              startIndex,
              startIndex + columns
            )
            return (
              <div
                className="absolute left-0 top-0 grid w-full items-start will-change-transform"
                data-index={virtualRow.index}
                key={virtualRow.key}
                ref={measureElement}
                style={{
                  contain: 'layout style paint',
                  gap: `${CARD_GAP}px`,
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                  transform: `translateY(${virtualRow.start - scrollMargin}px)`
                }}
              >
                {rowPokemon.map(pokemon => (
                  <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    statMaxes={statMaxes}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {isFetchingNextPage && allPokemon.length > 0 && (
        <p className="text-muted-foreground text-center text-sm">
          Loading more…
        </p>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl">
      <div className="h-72 bg-slate-200" />
      <div className="flex flex-col gap-3 px-6 pb-6 pt-5">
        <div className="h-7 w-3/5 rounded bg-slate-200" />
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded bg-slate-200" />
          <div className="h-6 w-20 rounded bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
