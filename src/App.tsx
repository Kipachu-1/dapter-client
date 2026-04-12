import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { BookOpen, ClipboardList } from 'lucide-react'

function App() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <div className="flex flex-col items-center gap-1">
        <h1 className="font-heading text-sm font-medium">Dapter</h1>
        <p className="text-xs text-muted-foreground">
          Adaptive learning, powered by AI.
        </p>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <Button size="lg" variant="outline" className="w-full" render={<Link to="/flashcards" />}>
          <BookOpen />
          Flashcards
        </Button>
        <Button size="lg" variant="outline" className="w-full" render={<Link to="/quizzes" />}>
          <ClipboardList />
          Quizzes
        </Button>
      </div>
    </main>
  )
}

export default App
