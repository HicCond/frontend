import { HttpResponse, http } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../mocks/server';
import { ApiError, getQuestions, getQuizRules, submitAnswers } from './quizApi';

describe('getQuizRules', () => {
  it('returns the quiz rules', async () => {
    const rules = await getQuizRules();
    expect(rules.title).toBeTruthy();
    expect(rules.maxScore).toBeGreaterThan(0);
    expect(rules.scoring.length).toBeGreaterThan(0);
  });
});

describe('getQuestions', () => {
  it('returns questions with no correct-answer information', async () => {
    const questions = await getQuestions();
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0]).toHaveProperty('options');
    expect(questions[0]).not.toHaveProperty('correctOptionId');
  });
});

describe('submitAnswers', () => {
  it('returns a scored result for valid answers', async () => {
    const questions = await getQuestions();
    const answers = questions.map((q) => ({ questionId: q.id, optionId: q.options[0].id }));

    const result = await submitAnswers({ answers });

    expect(result.maxScore).toBeGreaterThan(0);
    expect(result.correctCount + result.incorrectCount).toBe(questions.length);
    expect(typeof result.passed).toBe('boolean');
  });

  it('throws an ApiError built from the problem+json body when the server rejects the request', async () => {
    server.use(
      http.post('http://localhost:8080/api/v1/quiz/submissions', () =>
        HttpResponse.json(
          {
            type: 'urn:quiz:error:invalid-submission',
            title: 'Invalid submission',
            status: 400,
            detail: 'Submission contains 1 invalid answer(s)',
            errors: [{ code: 'MISSING_ANSWER', questionId: 'q1', message: 'not answered' }],
          },
          { status: 400 },
        ),
      ),
    );

    await expect(submitAnswers({ answers: [] })).rejects.toMatchObject({
      name: 'ApiError',
      message: 'Submission contains 1 invalid answer(s)',
      errors: [{ code: 'MISSING_ANSWER', questionId: 'q1', message: 'not answered' }],
    });
  });

  it('rejects with an ApiError instance on failure', async () => {
    server.use(
      http.post('http://localhost:8080/api/v1/quiz/submissions', () =>
        HttpResponse.json({ detail: 'nope' }, { status: 400 }),
      ),
    );
    await expect(submitAnswers({ answers: [] })).rejects.toBeInstanceOf(ApiError);
  });
});
