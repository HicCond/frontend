import { http, HttpResponse } from 'msw';
import type {
  IncorrectAnswer,
  ProblemDetail,
  QuizQuestion,
  QuizResult,
  SubmitAnswersRequest,
  ValidationError,
} from '../types/quiz';
import { fixtureQuestions, fixtureRules } from './data';

const BASE_URL = 'http://localhost:8080/api/v1/quiz';

function problem(detail: string, errors: ValidationError[]): ProblemDetail {
  return {
    type: 'urn:quiz:error:invalid-submission',
    title: 'Invalid submission',
    status: 400,
    detail,
    errors,
  };
}

export const handlers = [
  http.get(BASE_URL, () => HttpResponse.json(fixtureRules)),

  http.get(`${BASE_URL}/questions`, () => {
    const questions: QuizQuestion[] = fixtureQuestions.map(({ id, text, points, options }) => ({
      id,
      text,
      points,
      options,
    }));
    return HttpResponse.json(questions);
  }),

  http.post(`${BASE_URL}/submissions`, async ({ request }) => {
    const body = (await request.json()) as SubmitAnswersRequest;

    if (!Array.isArray(body?.answers) || body.answers.length === 0) {
      const detail = problem('Submission contains 1 invalid answer(s)', [
        { code: 'MALFORMED_REQUEST', questionId: 'answers', message: 'answers must not be empty' },
      ]);
      return HttpResponse.json(detail, { status: 400 });
    }

    const questionsById = new Map(fixtureQuestions.map((q) => [q.id, q]));
    const seen = new Set<string>();
    const errors: ValidationError[] = [];

    for (const answer of body.answers) {
      const question = questionsById.get(answer.questionId);
      if (!question) {
        errors.push({
          code: 'UNKNOWN_QUESTION',
          questionId: answer.questionId,
          message: `Question '${answer.questionId}' does not belong to this quiz`,
        });
        continue;
      }
      if (seen.has(answer.questionId)) {
        errors.push({
          code: 'DUPLICATE_ANSWER',
          questionId: answer.questionId,
          message: `Question '${answer.questionId}' is answered more than once`,
        });
        continue;
      }
      seen.add(answer.questionId);
      if (!question.options.some((o) => o.id === answer.optionId)) {
        errors.push({
          code: 'OPTION_NOT_IN_QUESTION',
          questionId: answer.questionId,
          message: `Option '${answer.optionId}' is not one of the available options for question '${answer.questionId}'`,
        });
      }
    }

    for (const question of fixtureQuestions) {
      if (!seen.has(question.id)) {
        errors.push({
          code: 'MISSING_ANSWER',
          questionId: question.id,
          message: `Question '${question.id}' has not been answered`,
        });
      }
    }

    if (errors.length > 0) {
      return HttpResponse.json(
        problem(`Submission contains ${errors.length} invalid answer(s)`, errors),
        { status: 400 },
      );
    }

    const answersByQuestionId = new Map(body.answers.map((a) => [a.questionId, a.optionId]));
    let totalScore = 0;
    let correctCount = 0;
    const incorrectAnswers: IncorrectAnswer[] = [];

    for (const question of fixtureQuestions) {
      const givenOptionId = answersByQuestionId.get(question.id)!;
      if (givenOptionId === question.correctOptionId) {
        totalScore += question.points;
        correctCount += 1;
      } else {
        const given = question.options.find((o) => o.id === givenOptionId)!;
        const correct = question.options.find((o) => o.id === question.correctOptionId)!;
        incorrectAnswers.push({
          questionId: question.id,
          questionText: question.text,
          points: question.points,
          givenOptionId: given.id,
          givenOptionText: given.text,
          correctOptionId: correct.id,
          correctOptionText: correct.text,
        });
      }
    }

    const result: QuizResult = {
      totalScore,
      maxScore: fixtureRules.maxScore,
      correctCount,
      incorrectCount: fixtureQuestions.length - correctCount,
      percentage: Number(((correctCount / fixtureQuestions.length) * 100).toFixed(1)),
      passed: totalScore > fixtureRules.passingScore,
      passingScore: fixtureRules.passingScore,
      incorrectAnswers,
    };

    return HttpResponse.json(result);
  }),
];
