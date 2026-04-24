'use client'

import { Swords } from 'lucide-react'
import { useState } from 'react'

import { BattlesGrid } from '@/components/battles/BattlesGrid'
import { EnqueueBattleDialog } from '@/components/battles/EnqueueBattleDialog'
import { Button } from '@/components/ui/button'

export default function BattlesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Battles</h1>
          <p className="mt-1 text-sm text-white/50">
            Queue up Pokémon matchups and watch them fight.
          </p>
        </div>
        <Button
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
          onClick={() => setDialogOpen(true)}
        >
          <Swords className="h-4 w-4" />
          Enqueue Battle
        </Button>
      </div>

      <BattlesGrid />

      <EnqueueBattleDialog onOpenChange={setDialogOpen} open={dialogOpen} />
    </main>
  )
}
