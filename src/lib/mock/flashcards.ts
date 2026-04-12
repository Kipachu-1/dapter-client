import type { FlashcardDeck } from '@/lib/schemas/flashcard'

export const mockDecks: FlashcardDeck[] = [
  {
    title: 'Computer Science Fundamentals',
    description: 'Core CS concepts — algorithms, data structures, and systems',
    cards: [
      {
        front: 'What is the time complexity of binary search?',
        back: 'O(log n) — it halves the search space with each comparison.',
        tags: ['algorithms', 'search'],
      },
      {
        front: 'What is a closure in programming?',
        back: 'A function that captures variables from its enclosing lexical scope, retaining access even after the outer function has returned.',
        tags: ['languages', 'functions'],
      },
      {
        front: 'Explain the CAP theorem.',
        back: 'A distributed system can provide at most two of three guarantees: Consistency, Availability, and Partition tolerance.',
        tags: ['distributed systems'],
      },
      {
        front: 'What is the difference between a stack and a queue?',
        back: 'A stack is LIFO (last in, first out). A queue is FIFO (first in, first out).',
        tags: ['data structures'],
      },
      {
        front: 'What does ACID stand for in databases?',
        back: 'Atomicity, Consistency, Isolation, Durability — properties that guarantee reliable transaction processing.',
        tags: ['databases'],
      },
      {
        front: 'What is memoization?',
        back: 'An optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again.',
        tags: ['algorithms', 'optimization'],
      },
    ],
  },
  {
    title: 'Linear Algebra Essentials',
    description: 'Key concepts from linear algebra for ML and graphics',
    cards: [
      {
        front: 'What is an eigenvalue?',
        back: 'A scalar λ such that Av = λv for some non-zero vector v. It describes how a linear transformation scales along its eigenvectors.',
        tags: ['eigenvalues', 'matrices'],
      },
      {
        front: 'What does it mean for a matrix to be singular?',
        back: 'Its determinant is zero — it has no inverse and maps some non-zero vectors to zero.',
        tags: ['matrices'],
      },
      {
        front: 'What is the dot product of two vectors?',
        back: 'The sum of element-wise products: a·b = Σ aᵢbᵢ. Geometrically, |a||b|cos(θ).',
        tags: ['vectors'],
      },
      {
        front: 'What is a transpose of a matrix?',
        back: 'A new matrix where rows and columns are swapped: (Aᵀ)ᵢⱼ = Aⱼᵢ.',
        tags: ['matrices'],
      },
      {
        front: 'What is the rank of a matrix?',
        back: 'The number of linearly independent rows (or columns). It tells you the dimension of the image of the linear map.',
        tags: ['matrices', 'rank'],
      },
    ],
  },
  {
    title: 'JavaScript Gotchas',
    description: 'Tricky JS behavior that trips up even experienced developers',
    cards: [
      {
        front: 'What is the value of typeof null?',
        back: '"object" — this is a long-standing bug in JavaScript dating back to its first implementation.',
        tags: ['types', 'quirks'],
      },
      {
        front: 'What is the difference between == and ===?',
        back: '== performs type coercion before comparison. === compares both value and type without coercion.',
        tags: ['operators', 'coercion'],
      },
      {
        front: 'What does 0.1 + 0.2 === 0.3 evaluate to?',
        back: 'false — floating point arithmetic produces 0.30000000000000004 due to IEEE 754 representation.',
        tags: ['numbers', 'quirks'],
      },
      {
        front: 'What is the event loop?',
        back: 'A mechanism that processes the call stack, then checks the microtask queue (Promises), then the macrotask queue (setTimeout, I/O) in a continuous loop.',
        tags: ['async', 'runtime'],
      },
      {
        front: 'What is hoisting?',
        back: 'Variable and function declarations are moved to the top of their scope during compilation. var is hoisted and initialized to undefined; let/const are hoisted but not initialized (temporal dead zone).',
        tags: ['scope', 'variables'],
      },
    ],
  },
]
