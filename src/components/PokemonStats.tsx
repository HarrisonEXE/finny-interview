import { cn } from '@/lib/utils'
import {
  type Pokemon,
  POKEMON_STAT_KEYS,
  type PokemonStatMaxes
} from '@/types/pokemon'

const STAT_LABELS: Record<keyof PokemonStatMaxes, string> = {
  attack: 'Attack',
  defense: 'Defense',
  hp: 'HP',
  specialAttack: 'Sp. Atk',
  specialDefense: 'Sp. Def',
  speed: 'Speed'
}

type PokemonStatsProps = {
  className?: string
  pokemon: Pokemon
  statMaxes: PokemonStatMaxes
}

type StatRowProps = {
  label: string
  max: number
  value: number
}

export function PokemonStats({
  className,
  pokemon,
  statMaxes
}: PokemonStatsProps) {
  const maxTotalStatValue = POKEMON_STAT_KEYS.reduce(
    (runningTotal, statKey) => runningTotal + statMaxes[statKey],
    0
  )
  const pokemonTotalStatValue = POKEMON_STAT_KEYS.reduce(
    (runningTotal, statKey) => runningTotal + pokemon[statKey],
    0
  )

  return (
    <div className={cn('flex flex-col gap-2.5 pt-1', className)}>
      {POKEMON_STAT_KEYS.map(key => (
        <StatRow
          key={key}
          label={STAT_LABELS[key]}
          max={statMaxes[key]}
          value={pokemon[key]}
        />
      ))}
      <StatRow
        label="Total"
        max={maxTotalStatValue}
        value={pokemonTotalStatValue}
      />
    </div>
  )
}

function StatRow({ label, max, value }: StatRowProps) {
  const fillPercentage = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const hasStrongStatValue = value >= max * 0.5

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_2.25rem_minmax(0,2fr)] items-center gap-x-2 gap-y-0 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-semibold tabular-nums text-slate-900">
        {value}
      </span>
      <div
        aria-label={label}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        className="h-2 w-full min-w-0 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300 ease-out',
            hasStrongStatValue ? 'bg-emerald-500' : 'bg-red-500'
          )}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
    </div>
  )
}
