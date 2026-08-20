import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fixtureQuestions } from '../mocks/data';
import { useQuiz } from './useQuiz';

describe('useQuiz', () => {
  it('loads the rules on mount, then walks intro -> quiz -> results', async () => {
    const { result } = renderHook(() => useQuiz());

    await waitFor(() => expect(result.current.rules).not.toBeNull());
    expect(result.current.screen).toBe('intro');

    await act(async () => {
      await result.current.startQuiz();
    });

    expect(result.current.screen).toBe('quiz');
    expect(result.current.questions).toHaveLength(fixtureQuestions.length);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.hasAnsweredCurrent).toBe(false);

    for (let i = 0; i < fixtureQuestions.length; i++) {
      const question = result.current.currentQuestion!;
      act(() => {
        result.current.selectAnswer(question.id, question.options[0].id);
      });
      expect(result.current.hasAnsweredCurrent).toBe(true);

      await act(async () => {
        await result.current.goNext();
      });
    }

    await waitFor(() => expect(result.current.screen).toBe('results'));
    expect(result.current.result).not.toBeNull();
    const total =
      (result.current.result?.correctCount ?? 0) + (result.current.result?.incorrectCount ?? 0);
    expect(total).toBe(fixtureQuestions.length);
  });

  it('restart resets back to the intro screen but keeps the already-loaded rules', async () => {
    const { result } = renderHook(() => useQuiz());

    await waitFor(() => expect(result.current.rules).not.toBeNull());
    await act(async () => {
      await result.current.startQuiz();
    });
    expect(result.current.screen).toBe('quiz');

    act(() => {
      result.current.restart();
    });

    expect(result.current.screen).toBe('intro');
    expect(result.current.questions).toHaveLength(0);
    expect(result.current.rules).not.toBeNull();
  });
});
