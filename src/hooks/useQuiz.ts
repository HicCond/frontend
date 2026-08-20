import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { ApiError, getQuestions, getQuizRules, submitAnswers } from '../api/quizApi';
import type { QuizQuestion, QuizResult, QuizRules } from '../types/quiz';

type Screen = 'intro' | 'quiz' | 'results';

interface QuizState {
  screen: Screen;
  rules: QuizRules | null;
  rulesLoading: boolean;
  rulesError: string | null;
  questions: QuizQuestion[];
  currentIndex: number;
  answers: Record<string, string>;
  result: QuizResult | null;
  loading: boolean;
  error: string | null;
}

type QuizAction =
  | { type: 'FETCH_RULES_START' }
  | { type: 'FETCH_RULES_SUCCESS'; rules: QuizRules }
  | { type: 'FETCH_RULES_ERROR'; error: string }
  | { type: 'FETCH_QUESTIONS_START' }
  | { type: 'FETCH_QUESTIONS_SUCCESS'; questions: QuizQuestion[] }
  | { type: 'FETCH_QUESTIONS_ERROR'; error: string }
  | { type: 'SELECT_ANSWER'; questionId: string; optionId: string }
  | { type: 'GO_NEXT' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; result: QuizResult }
  | { type: 'SUBMIT_ERROR'; error: string }
  | { type: 'RESTART' };

const initialState: QuizState = {
  screen: 'intro',
  rules: null,
  rulesLoading: false,
  rulesError: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  result: null,
  loading: false,
  error: null,
};

function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'FETCH_RULES_START':
      return { ...state, rulesLoading: true, rulesError: null };
    case 'FETCH_RULES_SUCCESS':
      return { ...state, rulesLoading: false, rules: action.rules };
    case 'FETCH_RULES_ERROR':
      return { ...state, rulesLoading: false, rulesError: action.error };
    case 'FETCH_QUESTIONS_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_QUESTIONS_SUCCESS':
      return {
        ...state,
        loading: false,
        questions: action.questions,
        screen: 'quiz',
        currentIndex: 0,
        answers: {},
      };
    case 'FETCH_QUESTIONS_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'SELECT_ANSWER':
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.optionId },
      };
    case 'GO_NEXT':
      return { ...state, currentIndex: state.currentIndex + 1 };
    case 'SUBMIT_START':
      return { ...state, loading: true, error: null };
    case 'SUBMIT_SUCCESS':
      return { ...state, loading: false, result: action.result, screen: 'results' };
    case 'SUBMIT_ERROR':
      return { ...state, loading: false, error: action.error };
    case 'RESTART':
      return { ...initialState, rules: state.rules };
    default:
      return state;
  }
}

function messageFor(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export function useQuiz() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const currentQuestion = state.questions[state.currentIndex] as QuizQuestion | undefined;
  const isLastQuestion = state.currentIndex === state.questions.length - 1;
  const hasAnsweredCurrent = currentQuestion ? Boolean(state.answers[currentQuestion.id]) : false;

  useEffect(() => {
    dispatch({ type: 'FETCH_RULES_START' });
    getQuizRules()
      .then((rules) => dispatch({ type: 'FETCH_RULES_SUCCESS', rules }))
      .catch((err) =>
        dispatch({
          type: 'FETCH_RULES_ERROR',
          error: messageFor(err, 'Failed to load quiz rules.'),
        }),
      );
  }, []);

  const startQuiz = useCallback(async () => {
    dispatch({ type: 'FETCH_QUESTIONS_START' });
    try {
      const questions = await getQuestions();
      dispatch({ type: 'FETCH_QUESTIONS_SUCCESS', questions });
    } catch (err) {
      dispatch({
        type: 'FETCH_QUESTIONS_ERROR',
        error: messageFor(err, 'Failed to load questions.'),
      });
    }
  }, []);

  const selectAnswer = useCallback((questionId: string, optionId: string) => {
    dispatch({ type: 'SELECT_ANSWER', questionId, optionId });
  }, []);

  const goNext = useCallback(async () => {
    if (!isLastQuestion) {
      dispatch({ type: 'GO_NEXT' });
      return;
    }
    dispatch({ type: 'SUBMIT_START' });
    try {
      const answers = Object.entries(state.answers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));
      const result = await submitAnswers({ answers });
      dispatch({ type: 'SUBMIT_SUCCESS', result });
    } catch (err) {
      dispatch({ type: 'SUBMIT_ERROR', error: messageFor(err, 'Failed to submit answers.') });
    }
  }, [isLastQuestion, state.answers]);

  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);

  return useMemo(
    () => ({
      ...state,
      currentQuestion,
      isLastQuestion,
      hasAnsweredCurrent,
      startQuiz,
      selectAnswer,
      goNext,
      restart,
    }),
    [
      state,
      currentQuestion,
      isLastQuestion,
      hasAnsweredCurrent,
      startQuiz,
      selectAnswer,
      goNext,
      restart,
    ],
  );
}
