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

const TYPE_CARD_HERO_SURFACE: Record<string, string> = {
  Bug: 'bg-gradient-to-b from-lime-500/90 via-lime-500/65 to-lime-500/15',
  Dark: 'bg-gradient-to-b from-slate-800/90 via-slate-700/70 to-slate-500/20',
  Dragon: 'bg-gradient-to-b from-indigo-700/90 via-indigo-600/65 to-indigo-500/15',
  Electric: 'bg-gradient-to-b from-yellow-400/90 via-yellow-400/60 to-yellow-300/15',
  Fairy: 'bg-gradient-to-b from-pink-300/90 via-pink-300/60 to-pink-200/15',
  Fighting: 'bg-gradient-to-b from-red-700/90 via-red-700/60 to-red-600/15',
  Fire: 'bg-gradient-to-b from-red-500/90 via-orange-500/65 to-amber-400/15',
  Flying: 'bg-gradient-to-b from-indigo-400/90 via-sky-400/65 to-cyan-300/15',
  Ghost: 'bg-gradient-to-b from-purple-700/90 via-purple-700/65 to-purple-500/15',
  Grass: 'bg-gradient-to-b from-green-500/90 via-emerald-500/65 to-lime-400/15',
  Ground: 'bg-gradient-to-b from-amber-600/90 via-amber-600/65 to-yellow-600/15',
  Ice: 'bg-gradient-to-b from-cyan-300/90 via-cyan-300/60 to-cyan-200/15',
  Normal: 'bg-gradient-to-b from-slate-400/90 via-slate-400/60 to-slate-300/15',
  Poison: 'bg-gradient-to-b from-purple-500/90 via-purple-500/65 to-fuchsia-400/15',
  Psychic: 'bg-gradient-to-b from-pink-500/90 via-pink-500/65 to-rose-400/15',
  Rock: 'bg-gradient-to-b from-amber-700/90 via-amber-700/65 to-amber-500/15',
  Steel: 'bg-gradient-to-b from-slate-500/90 via-slate-500/65 to-slate-300/15',
  Water: 'bg-gradient-to-b from-blue-500/90 via-blue-500/65 to-sky-400/15'
}

const TYPE_ACCENT_TEXT: Record<string, string> = {
  Bug: 'group-hover:text-lime-700',
  Dark: 'group-hover:text-slate-900',
  Dragon: 'group-hover:text-indigo-800',
  Electric: 'group-hover:text-yellow-700',
  Fairy: 'group-hover:text-pink-700',
  Fighting: 'group-hover:text-red-800',
  Fire: 'group-hover:text-red-700',
  Flying: 'group-hover:text-indigo-700',
  Ghost: 'group-hover:text-purple-800',
  Grass: 'group-hover:text-emerald-700',
  Ground: 'group-hover:text-amber-700',
  Ice: 'group-hover:text-cyan-700',
  Normal: 'group-hover:text-slate-700',
  Poison: 'group-hover:text-purple-700',
  Psychic: 'group-hover:text-pink-700',
  Rock: 'group-hover:text-amber-800',
  Steel: 'group-hover:text-slate-700',
  Water: 'group-hover:text-blue-700'
}

function normalizePokemonType(type: string) {
  return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
}

export function getPokemonTypeBadgeClass(type: string) {
  const normalized = normalizePokemonType(type)
  return `${TYPE_BACKGROUND[normalized] ?? 'bg-slate-400'} ${TYPE_FOREGROUND[normalized] ?? 'text-white'}`
}

export function getPokemonTypeHeroClass(type: string) {
  const normalized = normalizePokemonType(type)
  return TYPE_CARD_HERO_SURFACE[normalized] ?? TYPE_CARD_HERO_SURFACE.Normal
}

export function getPokemonTypeAccentTextClass(type: string) {
  const normalized = normalizePokemonType(type)
  return TYPE_ACCENT_TEXT[normalized] ?? TYPE_ACCENT_TEXT.Normal
}
