import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { QuizQuestion } from '../types/quiz';
import { QuizScreen } from './QuizScreen';

const question: QuizQuestion = {
  id: 'q1',
  text: 'What is the capital of France?',
  points: 25,
  options: [
    { id: 'a', text: 'Berlin' },
    { id: 'b', text: 'Paris' },
  ],
};

describe('QuizScreen', () => {
  it('disables Next until an option is selected, then calls onSelect/onNext', async () => {
    const onSelect = vi.fn();
    const onNext = vi.fn();
    render(
      <QuizScreen
        question={question}
        questionNumber={1}
        totalQuestions={20}
        selectedOptionId={undefined}
        isLastQuestion={false}
        loading={false}
        error={null}
        onSelect={onSelect}
        onNext={onNext}
      />,
    );

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();

    await userEvent.click(screen.getByLabelText('Paris'));
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('enables the button once an option is selected and shows "Submit" on the last question', () => {
    render(
      <QuizScreen
        question={question}
        questionNumber={20}
        totalQuestions={20}
        selectedOptionId="b"
        isLastQuestion={true}
        loading={false}
        error={null}
        onSelect={vi.fn()}
        onNext={vi.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toBeEnabled();
  });

  it('shows an error message when provided', () => {
    render(
      <QuizScreen
        question={question}
        questionNumber={1}
        totalQuestions={20}
        selectedOptionId="b"
        isLastQuestion={false}
        loading={false}
        error="Something went wrong"
        onSelect={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
