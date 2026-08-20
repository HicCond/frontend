import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { QuizResult } from '../types/quiz';
import { ResultsScreen } from './ResultsScreen';

const passingResult: QuizResult = {
  totalScore: 700,
  maxScore: 1000,
  passingScore: 600,
  correctCount: 15,
  incorrectCount: 5,
  percentage: 75,
  passed: true,
  incorrectAnswers: [
    {
      questionId: 'q1',
      questionText: 'What is the capital of France?',
      points: 25,
      givenOptionId: 'a',
      givenOptionText: 'Berlin',
      correctOptionId: 'b',
      correctOptionText: 'Paris',
    },
  ],
};

describe('ResultsScreen', () => {
  it('renders the score summary, pass message, and incorrect answers', () => {
    render(<ResultsScreen result={passingResult} onRestart={vi.fn()} />);

    expect(screen.getByText(/you passed/i)).toBeInTheDocument();
    expect(screen.getByText(/700 \/ 1000/)).toBeInTheDocument();
    expect(screen.getByText(/threshold 600/)).toBeInTheDocument();
    expect(screen.getByText('75.0%')).toBeInTheDocument();
    expect(screen.getByText(/What is the capital of France\?/)).toBeInTheDocument();
    expect(screen.getByText(/Correct answer: Paris/)).toBeInTheDocument();
  });

  it('shows a fail message when not passed', () => {
    render(<ResultsScreen result={{ ...passingResult, passed: false }} onRestart={vi.fn()} />);
    expect(screen.getByText(/did not pass/i)).toBeInTheDocument();
  });

  it('calls onRestart when Try Again is clicked', async () => {
    const onRestart = vi.fn();
    render(<ResultsScreen result={passingResult} onRestart={onRestart} />);
    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(onRestart).toHaveBeenCalledTimes(1);
  });
});
