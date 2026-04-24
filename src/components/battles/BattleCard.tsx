'use client'

import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import type { Battle } from '@/lib/pokemonApi'
import { capitalizePokemonName } from '@/lib/utils'

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

function getPokemonSpriteUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

export function BattleCard({ battle }: BattleCardProps) {
  const config = statusConfig[battle.status]

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60">
          Battle Room
        </h3>
        <Badge className={`shrink-0 border text-xs ${config.className}`}>
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-20 w-20 rounded-lg bg-white/5">
            <Image
              alt={capitalizePokemonName(battle.pokemon1_name)}
              className="object-contain p-2"
              fill
              sizes="80px"
              src={getPokemonSpriteUrl(battle.pokemon1_id)}
            />
          </div>
          <span className="max-w-full truncate text-sm font-medium text-white">
            {capitalizePokemonName(battle.pokemon1_name)}
          </span>
        </div>

        <span className="text-sm font-bold text-white/50">VS</span>

        <div className="flex flex-col items-center gap-2">
          <div className="relative h-20 w-20 rounded-lg bg-white/5">
            <Image
              alt={capitalizePokemonName(battle.pokemon2_name)}
              className="object-contain p-2"
              fill
              sizes="80px"
              src={getPokemonSpriteUrl(battle.pokemon2_id)}
            />
          </div>
          <span className="max-w-full truncate text-sm font-medium text-white">
            {capitalizePokemonName(battle.pokemon2_name)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-white/40">
        <span>{formatDate(battle.created_at)}</span>
        {battle.status === 'completed' && battle.winner_name && (
          <span className="font-medium text-green-400">
            Winner: {capitalizePokemonName(battle.winner_name)}
          </span>
        )}
      </div>
    </article>
  )
}
