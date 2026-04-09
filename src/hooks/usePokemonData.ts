import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery
} from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import {
  fetchPokemonPage,
  fetchPokemonStatMaxes,
  type PokemonPage
} from '@/lib/pokemonApi'

import { useDebouncedValue } from './useDebouncedValue'

const SEARCH_DEBOUNCE_MS = 250

export function usePokemonData() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)

  const { data: statMaxes } = useQuery({
    queryFn: fetchPokemonStatMaxes,
    queryKey: ['pokemon-stat-maxes'],
    staleTime: Number.POSITIVE_INFINITY
  })

  const {
    data: pokemonPages,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    getNextPageParam: (lastPage: PokemonPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam }) => fetchPokemonPage(pageParam, debouncedSearch),
    queryKey: ['pokemon', debouncedSearch]
  })

  const allPokemon = useMemo(
    () => pokemonPages?.pages.flatMap(page => page.data) ?? [],
    [pokemonPages]
  )

  const isSearchPending = search !== debouncedSearch
  const isInitialLoad = isLoading && allPokemon.length === 0

  return {
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
  }
}
