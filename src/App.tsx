import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'

function App() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6">
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-heading text-sm font-medium">dapter</h1>
        <p className="text-xs text-muted-foreground">
          Adaptive learning, powered by AI.
        </p>
      </div>
      <Button size="lg" render={<Link to="/flashcards" />}>
        <BookOpen />
        Flashcards
      </Button>
    </main>
  )
}

export default App
