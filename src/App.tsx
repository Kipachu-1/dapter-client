import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { BookOpen, BookText, ClipboardList, LogOut, Sparkles } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

function App() {
  const { user, logout } = useAuth()
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
      <div className="flex flex-col items-center gap-1">
        <h1 className="h1">dapter</h1>
        <p className="text-xs text-muted-foreground">
          Adaptive learning, powered by AI.
        </p>
        {user && (
          <p className="mt-1 text-xxs text-muted-foreground">{user.email}</p>
        )}
      </div>
      <div className="anim-enter flex w-full max-w-xs flex-col gap-2">
        <Button
          size="lg"
          className="w-full"
          aria-label="Generate new study material"
          render={<Link to="/generate" />}
        >
          <Sparkles />
          Generate
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          aria-label="Browse flashcards"
          render={<Link to="/flashcards" />}
        >
          <BookOpen />
          Flashcards
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          aria-label="Browse quizzes"
          render={<Link to="/quizzes" />}
        >
          <ClipboardList />
          Quizzes
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          aria-label="Read notes"
          render={<Link to="/notes" />}
        >
          <BookText />
          Notes
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-full"
          aria-label="Sign out"
          onClick={logout}
        >
          <LogOut />
          Sign out
        </Button>
      </div>
    </main>
  )
}

export default App
