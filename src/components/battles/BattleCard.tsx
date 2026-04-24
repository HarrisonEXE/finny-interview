'use client'

import { Badge } from '@/components/ui/badge'
import type { Battle } from '@/lib/pokemonApi'

interface BattleCardProps {
  battle: Battle
}

const statusConfig = {
  queued: { label: 'Queued', className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  in_progress: { label: 'In Progress', className: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  completed: { label: 'Completed', className: 'bg-green-500/20 text-green-300 border-green-500/30' }
} satisfies Record<Battle['status'], { label: string; className: string }>

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function BattleCard({ battle }: BattleCardProps) {
  const config = statusConfig[battle.status]

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/8">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="min-w-0 flex-1 truncate text-sm font-semibold capitalize text-white">
            {battle.pokemon1_name}
          </span>
          <span className="shrink-0 text-xs font-bold text-white/40">VS</span>
          <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold capitalize text-white">
            {battle.pokemon2_name}
          </span>
        </div>
        <Badge className={`shrink-0 border text-xs ${config.className}`}>
          {config.label}
        </Badge>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-white/40">
        <span>{formatDate(battle.created_at)}</span>
        {battle.status === 'completed' && battle.winner_name && (
          <span className="font-medium text-green-400">
            Winner: <span className="capitalize">{battle.winner_name}</span>
            {battle.total_turns != null && ` · ${battle.total_turns} turns`}
          </span>
        )}
      </div>
    </div>
  )
}
