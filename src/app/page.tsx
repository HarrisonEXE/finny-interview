import { BackToTopButton } from '@/components/BackToTopButton'
import { PokemonGrid } from '@/components/PokemonGrid'

export default function Home() {
  return (
    <main>
      <PokemonGrid />
      <BackToTopButton />
    </main>
  )
}
