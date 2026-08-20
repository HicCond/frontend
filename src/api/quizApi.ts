import type {
  ProblemDetail,
  QuizQuestion,
  QuizResult,
  QuizRules,
  SubmitAnswersRequest,
  ValidationError,
} from '../types/quiz';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1/quiz';

export class ApiError extends Error {
  errors?: ValidationError[];

  constructor(message: string, errors?: ValidationError[]) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

async function parseErrorResponse(response: Response): Promise<never> {
  let problem: ProblemDetail | undefined;
  try {
    problem = await response.json();
  } catch {
    /* empty */
  }
  throw new ApiError(
    problem?.detail ?? `Request failed with status ${response.status}`,
    problem?.errors,
  );
}

export async function getQuizRules(): Promise<QuizRules> {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) {
    return parseErrorResponse(response);
  }
  return response.json();
}

export async function getQuestions(): Promise<QuizQuestion[]> {
  const response = await fetch(`${API_BASE_URL}/questions`);
  if (!response.ok) {
    return parseErrorResponse(response);
  }
  return response.json();
}

export async function submitAnswers(request: SubmitAnswersRequest): Promise<QuizResult> {
  const response = await fetch(`${API_BASE_URL}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    return parseErrorResponse(response);
  }
  return response.json();
}
