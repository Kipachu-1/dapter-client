import type { Quiz } from '@/lib/schemas/quiz'

export const mockQuizzes: Quiz[] = [
  {
    title: 'Data Structures & Algorithms',
    description: 'Test your knowledge of fundamental CS concepts',
    questions: [
      {
        question: 'What is the average time complexity of quicksort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctIndex: 1,
        explanation: 'Quicksort has an average case of O(n log n) due to balanced partitioning.',
        tags: ['algorithms', 'sorting'],
      },
      {
        question: 'Which data structure uses FIFO ordering?',
        options: ['Stack', 'Queue', 'Binary tree', 'Hash map'],
        correctIndex: 1,
        explanation: 'A queue processes elements in First-In-First-Out order.',
        tags: ['data structures'],
      },
      {
        question: 'What is the space complexity of a hash map?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctIndex: 2,
        explanation: 'A hash map stores each key-value pair, requiring O(n) space.',
        tags: ['data structures', 'complexity'],
      },
      {
        question: 'Which traversal visits the root node first?',
        options: ['In-order', 'Post-order', 'Pre-order', 'Level-order'],
        correctIndex: 2,
        explanation: 'Pre-order traversal visits root, then left subtree, then right subtree.',
        tags: ['trees', 'traversal'],
      },
      {
        question: 'What does a balanced BST guarantee for search?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctIndex: 1,
        explanation: 'A balanced BST halves the search space at each step, giving O(log n).',
        tags: ['trees', 'search'],
      },
    ],
  },
  {
    title: 'JavaScript Fundamentals',
    description: 'How well do you really know JS?',
    questions: [
      {
        question: 'What does typeof undefined return?',
        options: ['"null"', '"undefined"', '"object"', '"void"'],
        correctIndex: 1,
        tags: ['types'],
      },
      {
        question: 'Which method creates a shallow copy of an array?',
        options: ['Array.from()', 'arr.splice()', 'arr.push()', 'arr.fill()'],
        correctIndex: 0,
        explanation: 'Array.from() creates a new shallow-copied array instance.',
        tags: ['arrays'],
      },
      {
        question: 'What is the output of: [] == false?',
        options: ['true', 'false', 'TypeError', 'undefined'],
        correctIndex: 0,
        explanation: 'An empty array is coerced to "" which is coerced to 0, and false is coerced to 0. 0 == 0 is true.',
        tags: ['coercion', 'quirks'],
      },
      {
        question: 'Which keyword creates a block-scoped variable?',
        options: ['var', 'let', 'function', 'global'],
        correctIndex: 1,
        explanation: 'let (and const) are block-scoped, unlike var which is function-scoped.',
        tags: ['scope', 'variables'],
      },
      {
        question: 'What does Promise.all() return if one promise rejects?',
        options: [
          'Resolves with partial results',
          'Rejects with the first rejection',
          'Returns undefined',
          'Throws synchronously',
        ],
        correctIndex: 1,
        explanation: 'Promise.all() short-circuits and rejects with the first rejection reason.',
        tags: ['async', 'promises'],
      },
    ],
  },
  {
    title: 'Networking Basics',
    description: 'OSI model, protocols, and web fundamentals',
    questions: [
      {
        question: 'Which layer of the OSI model does TCP operate on?',
        options: ['Network', 'Transport', 'Session', 'Application'],
        correctIndex: 1,
        explanation: 'TCP is a transport layer (layer 4) protocol.',
        tags: ['OSI', 'protocols'],
      },
      {
        question: 'What HTTP status code means "Not Found"?',
        options: ['401', '403', '404', '500'],
        correctIndex: 2,
        tags: ['HTTP'],
      },
      {
        question: 'What does DNS resolve?',
        options: [
          'IP addresses to MAC addresses',
          'Domain names to IP addresses',
          'Ports to services',
          'URLs to file paths',
        ],
        correctIndex: 1,
        explanation: 'DNS translates human-readable domain names into IP addresses.',
        tags: ['DNS', 'protocols'],
      },
      {
        question: 'Which protocol is connectionless?',
        options: ['TCP', 'UDP', 'HTTP', 'FTP'],
        correctIndex: 1,
        explanation: 'UDP is connectionless — it sends datagrams without establishing a connection.',
        tags: ['protocols'],
      },
      {
        question: 'What port does HTTPS use by default?',
        options: ['80', '443', '8080', '3000'],
        correctIndex: 1,
        tags: ['HTTP', 'ports'],
      },
    ],
  },
]
