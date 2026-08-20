export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  points: number;
  options: QuizOption[];
}

export interface ScoringRule {
  pointsPerQuestion: number;
  questionCount: number;
  subtotal: number;
}

export interface QuizRules {
  title: string;
  description: string;
  questionCount: number;
  maxScore: number;
  passingScore: number;
  scoring: ScoringRule[];
}

export interface AnswerSubmission {
  questionId: string;
  optionId: string;
}

export interface SubmitAnswersRequest {
  answers: AnswerSubmission[];
}

export interface IncorrectAnswer {
  questionId: string;
  questionText: string;
  points: number;
  givenOptionId: string;
  givenOptionText: string;
  correctOptionId: string;
  correctOptionText: string;
}

export interface QuizResult {
  totalScore: number;
  maxScore: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  incorrectAnswers: IncorrectAnswer[];
}

export type ValidationErrorCode =
  | 'UNKNOWN_QUESTION'
  | 'DUPLICATE_ANSWER'
  | 'MISSING_ANSWER'
  | 'OPTION_NOT_IN_QUESTION'
  | 'MALFORMED_REQUEST';

export interface ValidationError {
  code: ValidationErrorCode;
  questionId: string;
  message: string;
}

// RFC 9457 application/problem+json, as returned by GlobalExceptionHandler
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: ValidationError[];
}
