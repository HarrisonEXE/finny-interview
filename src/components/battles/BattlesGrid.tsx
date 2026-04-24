'use client'

import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import type { Battle } from '@/lib/pokemonApi'
import { fetchBattles } from '@/lib/pokemonApi'
import { capitalizePokemonName } from '@/lib/utils'

import { BattleCard } from './BattleCard'

const PAGE_SIZE = 20

const ROOM_COUNT = 3

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function EmptyRoom({ roomNumber }: { roomNumber: number }) {
  return (
    <article className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-white/40">
        Room {roomNumber}
      </h3>
      <div className="flex min-h-28 items-center justify-center rounded-lg bg-white/[0.03] text-sm text-white/30">
        Waiting for a battle...
      </div>
    </article>
  )
}

function QueueList({ battles }: { battles: Battle[] }) {
  return (
    <aside className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
        Queue
      </h2>
      {battles.length === 0 ? (
        <p className="py-8 text-center text-sm text-white/35">No battles in queue.</p>
      ) : (
        <div className="space-y-2">
          {battles.map((battle) => (
            <div
              className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
              key={battle.battle_id}
            >
              <p className="text-sm font-medium text-white">
                <span>{capitalizePokemonName(battle.pokemon1_name)}</span>
                <span className="px-2 text-white/40">vs</span>
                <span>{capitalizePokemonName(battle.pokemon2_name)}</span>
              </p>
              <p className="mt-1 text-xs text-white/35">{formatDate(battle.created_at)}</p>
            </div>
          ))}
        </div>
      )}
    </aside>
  )
}

export function BattlesGrid() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['battles', 1],
    queryFn: () => fetchBattles(1, PAGE_SIZE),
    placeholderData: (prev) => prev,
    refetchInterval: 1500
  })

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

  const battles = data?.items ?? []
  const inProgressBattles = battles.filter((battle) => battle.status === 'in_progress').slice(0, ROOM_COUNT)
  const queuedBattles = battles.filter((battle) => battle.status === 'queued')

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <div className="space-y-3">
        {Array.from({ length: ROOM_COUNT }).map((_, idx) => {
          const battle = inProgressBattles[idx]
          if (!battle) {
            return <EmptyRoom key={`empty-room-${idx + 1}`} roomNumber={idx + 1} />
          }

          return <BattleCard key={battle.battle_id} battle={battle} />
        })}
      </div>

      <QueueList battles={queuedBattles} />
    </div>
  )
}
