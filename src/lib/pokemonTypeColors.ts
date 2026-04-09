const TYPE_BACKGROUND: Record<string, string> = {
  Bug: 'bg-lime-500',
  Dark: 'bg-slate-800',
  Dragon: 'bg-indigo-700',
  Electric: 'bg-yellow-500',
  Fairy: 'bg-pink-300',
  Fighting: 'bg-red-700',
  Fire: 'bg-red-500',
  Flying: 'bg-indigo-400',
  Ghost: 'bg-purple-700',
  Grass: 'bg-green-500',
  Ground: 'bg-amber-600',
  Ice: 'bg-cyan-300',
  Normal: 'bg-slate-400',
  Poison: 'bg-purple-500',
  Psychic: 'bg-pink-500',
  Rock: 'bg-amber-700',
  Steel: 'bg-slate-500',
  Water: 'bg-blue-500'
}

const TYPE_FOREGROUND: Record<string, string> = {
  Bug: 'text-white',
  Dark: 'text-white',
  Dragon: 'text-white',
  Electric: 'text-slate-950',
  Fairy: 'text-slate-950',
  Fighting: 'text-white',
  Fire: 'text-white',
  Flying: 'text-white',
  Ghost: 'text-white',
  Grass: 'text-white',
  Ground: 'text-white',
  Ice: 'text-slate-950',
  Normal: 'text-white',
  Poison: 'text-white',
  Psychic: 'text-white',
  Rock: 'text-white',
  Steel: 'text-white',
  Water: 'text-white'
}

export function getPokemonTypeBadgeClass(type: string) {
  return `${TYPE_BACKGROUND[type] ?? 'bg-slate-400'} ${TYPE_FOREGROUND[type] ?? 'text-white'}`
}
