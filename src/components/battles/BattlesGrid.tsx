'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { fetchBattles } from '@/lib/pokemonApi'

import { BattleCard } from './BattleCard'

const PAGE_SIZE = 20

export function BattlesGrid() {
  const [page, setPage] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['battles', page],
    queryFn: () => fetchBattles(page, PAGE_SIZE),
    placeholderData: (prev) => prev
  })

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-red-400">
        Failed to load battles.
      </p>
    )
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-white/40">
        No battles yet. Enqueue one to get started!
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {data.items.map((battle) => (
          <BattleCard key={battle.battle_id} battle={battle} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-white/40">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
