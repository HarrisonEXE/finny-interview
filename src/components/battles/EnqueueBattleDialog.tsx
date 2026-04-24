'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { createBattle, fetchBattles } from '@/lib/pokemonApi'
import { capitalizePokemonName } from '@/lib/utils'
import type { Pokemon } from '@/types/pokemon'

import { PokemonPickerStep } from './PokemonPickerStep'

interface EnqueueBattleDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
}

type Step = 1 | 2

export function EnqueueBattleDialog({ onOpenChange, open }: EnqueueBattleDialogProps) {
  const [step, setStep] = useState<Step>(1)
  const [pokemon1, setPokemon1] = useState<Pokemon | null>(null)
  const queryClient = useQueryClient()

  // Fetch all battles to derive the blocked-IDs set.
  // We use a large page size to get an accurate picture of active/queued battles.
  const { data: activeBattlesPage } = useQuery({
    queryKey: ['battles-active'],
    queryFn: () => fetchBattles(1, 100),
    refetchInterval: 5000
  })

  // Build Set<number> of IDs involved in any queued or in_progress battle.
  const blockedIds = useMemo<Set<number>>(() => {
    const ids = new Set<number>()
    if (!activeBattlesPage) return ids
    for (const battle of activeBattlesPage.items) {
      if (battle.status === 'queued' || battle.status === 'in_progress') {
        ids.add(battle.pokemon1_id)
        ids.add(battle.pokemon2_id)
      }
    }
    return ids
  }, [activeBattlesPage])

  const { mutate, isPending, isError, reset: resetMutation } = useMutation({
    mutationFn: ({ p1, p2 }: { p1: Pokemon; p2: Pokemon }) =>
      createBattle(p1.id, p2.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['battles'] })
      void queryClient.invalidateQueries({ queryKey: ['battles-active'] })
      handleClose()
    }
  })

  function handleClose() {
    onOpenChange(false)
    // defer reset so animation doesn't jank
    setTimeout(() => {
      setStep(1)
      setPokemon1(null)
      resetMutation()
    }, 200)
  }

  function handleStep1Select(pokemon: Pokemon) {
    setPokemon1(pokemon)
    setStep(2)
  }

  function handleStep2Select(pokemon: Pokemon) {
    if (!pokemon1) return
    mutate({ p1: pokemon1, p2: pokemon })
  }

  function handleBack() {
    setStep(1)
    setPokemon1(null)
    resetMutation()
  }

  // On step 2, also block the step-1 pick and itself
  const step2DisabledIds = useMemo(() => {
    if (!pokemon1) return blockedIds
    const ids = new Set(blockedIds)
    ids.add(pokemon1.id)
    return ids
  }, [blockedIds, pokemon1])

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-white/10 bg-zinc-900 text-white sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Enqueue Battle</DialogTitle>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <span className={step === 1 ? 'font-semibold text-white' : ''}>1</span>
              <span className="mx-1">·</span>
              <span className={step === 2 ? 'font-semibold text-white' : ''}>2</span>
            </div>
          </div>
          {step === 2 && pokemon1 && (
            <p className="mt-1 text-xs text-white/50">
              Fighter 1:{' '}
              <span className="font-semibold text-white">{capitalizePokemonName(pokemon1.name)}</span>
            </p>
          )}
        </DialogHeader>

        <div className="py-1">
          {step === 1 && (
            <PokemonPickerStep
              disabledIds={blockedIds}
              onSelect={handleStep1Select}
              title="Select Fighter 1"
            />
          )}
          {step === 2 && (
            <PokemonPickerStep
              disabledIds={step2DisabledIds}
              onSelect={handleStep2Select}
              title="Select Fighter 2"
            />
          )}
        </div>

        {isError && (
          <p className="text-xs text-red-400">
            Failed to create battle. Please try again.
          </p>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          {step === 2 && (
            <Button
              className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              disabled={isPending}
              onClick={handleBack}
              type="button"
              variant="outline"
            >
              Back
            </Button>
          )}
          <Button
            className="border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            onClick={handleClose}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
        </DialogFooter>

        {isPending && (
          <p className="text-center text-xs text-white/40">Queueing battle…</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
