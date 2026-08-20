export interface FixtureQuestion {
  id: string;
  text: string;
  points: number;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

// Small fixture set for isolated frontend tests. Real quiz data comes from the backend.
export const fixtureQuestions: FixtureQuestion[] = [
  {
    id: 'q1',
    text: 'Which planet is known as the Red Planet?',
    points: 100,
    options: [
      { id: 'a', text: 'Mars' },
      { id: 'b', text: 'Venus' },
      { id: 'c', text: 'Jupiter' },
      { id: 'd', text: 'Mercury' },
    ],
    correctOptionId: 'a',
  },
  {
    id: 'q2',
    text: 'What is the boiling point of water at sea level, in Celsius?',
    points: 75,
    options: [
      { id: 'a', text: '90' },
      { id: 'b', text: '100' },
      { id: 'c', text: '110' },
    ],
    correctOptionId: 'b',
  },
  {
    id: 'q3',
    text: 'How many continents are there?',
    points: 40,
    options: [
      { id: 'a', text: '5' },
      { id: 'b', text: '6' },
      { id: 'c', text: '7' },
      { id: 'd', text: '8' },
    ],
    correctOptionId: 'c',
  },
  {
    id: 'q4',
    text: 'What is the chemical symbol for gold?',
    points: 25,
    options: [
      { id: 'a', text: 'Ag' },
      { id: 'b', text: 'Fe' },
      { id: 'c', text: 'Au' },
    ],
    correctOptionId: 'c',
  },
];

const maxScore = fixtureQuestions.reduce((sum, q) => sum + q.points, 0);

export const fixtureRules = {
  title: 'Sample Quiz',
  description: 'A small fixture quiz used for frontend tests.',
  questionCount: fixtureQuestions.length,
  maxScore,
  passingScore: 150,
  scoring: fixtureQuestions.map((q) => ({
    pointsPerQuestion: q.points,
    questionCount: 1,
    subtotal: q.points,
  })),
};
