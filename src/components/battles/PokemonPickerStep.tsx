'use client'

import { Loader2, Search, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { fetchPokemonPage } from '@/lib/pokemonApi'
import { getPokemonTypeBadgeClass } from '@/lib/pokemonTypeColors'
import { cn } from '@/lib/utils'
import type { Pokemon } from '@/types/pokemon'

interface PokemonPickerStepProps {
  disabledIds: Set<number>
  onSelect: (pokemon: Pokemon) => void
  title: string
}

const SEARCH_DEBOUNCE_MS = 250
const PAGE_SIZE = 20

export function PokemonPickerStep({ disabledIds, onSelect, title }: PokemonPickerStepProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([])
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  // Reset list when search changes
  useEffect(() => {
    setPage(1)
    setAllPokemon([])
  }, [debouncedSearch])

  // Fetch page
  useEffect(() => {
    let cancelled = false

    async function load() {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)

      try {
        const result = await fetchPokemonPage(page, debouncedSearch)
        if (!cancelled) {
          setAllPokemon(prev =>
            page === 1 ? result.data : [...prev, ...result.data]
          )
          setHasNextPage(result.pagination.page < result.pagination.totalPages)
        }
      } catch {
        // silently ignore
      } finally {
        if (!cancelled) {
          setIsLoading(false)
          setIsLoadingMore(false)
        }
      }
    }

    void load()
    return () => { cancelled = true }
  }, [page, debouncedSearch])

  const sentinelRef = useRef<HTMLDivElement>(null)

  // Load more on sentinel visible
  useEffect(() => {
    if (!hasNextPage || isLoadingMore) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setPage(p => p + 1)
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isLoadingMore])

  const isSearchPending = search !== debouncedSearch

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium text-white/70">{title}</p>

      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
          {isSearchPending || isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </span>
        <Input
          className="border-white/10 bg-white/5 pl-9 pr-9 text-white placeholder:text-white/30 focus-visible:ring-white/20"
          onChange={e => setSearch(e.target.value)}
          placeholder="Search Pokémon…"
          value={search}
        />
        {search && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            onClick={() => setSearch('')}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="h-72 overflow-y-auto rounded-lg border border-white/10">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-white/40" />
          </div>
        ) : allPokemon.length === 0 ? (
          <p className="flex h-full items-center justify-center text-sm text-white/30">
            No Pokémon found.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {allPokemon.map(pokemon => {
              const disabled = disabledIds.has(pokemon.id)
              return (
                <button
                  key={pokemon.id}
                  className={cn(
                    'flex w-full items-center gap-3 px-3 py-2 text-left transition-colors',
                    disabled
                      ? 'cursor-not-allowed opacity-35'
                      : 'hover:bg-white/8 cursor-pointer'
                  )}
                  disabled={disabled}
                  onClick={() => !disabled && onSelect(pokemon)}
                  title={disabled ? 'Already in an active or queued battle' : undefined}
                  type="button"
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                    <Image
                      alt={pokemon.name}
                      className="object-cover"
                      fill
                      sizes="40px"
                      src={pokemon.imageUrl}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold capitalize text-white">
                      {pokemon.name}
                    </p>
                    <div className="mt-0.5 flex gap-1">
                      {pokemon.types.map(type => (
                        <span
                          className={cn(
                            'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                            getPokemonTypeBadgeClass(type)
                          )}
                          key={type}
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
            <div ref={sentinelRef} className="py-2 text-center">
              {isLoadingMore && (
                <Loader2 className="mx-auto h-4 w-4 animate-spin text-white/30" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
