import { Alert, Container } from 'react-bootstrap';
import { IntroScreen } from './components/IntroScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { useQuiz } from './hooks/useQuiz';

function App() {
  const {
    screen,
    rules,
    rulesLoading,
    rulesError,
    questions,
    currentIndex,
    currentQuestion,
    answers,
    result,
    loading,
    error,
    isLastQuestion,
    startQuiz,
    selectAnswer,
    goNext,
    restart,
  } = useQuiz();

  if (screen === 'intro') {
    return (
      <IntroScreen
        rules={rules}
        rulesLoading={rulesLoading}
        rulesError={rulesError}
        onStart={startQuiz}
        startLoading={loading}
        startError={error}
      />
    );
  }

  if (screen === 'quiz' && currentQuestion) {
    return (
      <QuizScreen
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedOptionId={answers[currentQuestion.id]}
        isLastQuestion={isLastQuestion}
        loading={loading}
        error={error}
        onSelect={(optionId) => selectAnswer(currentQuestion.id, optionId)}
        onNext={goNext}
      />
    );
  }

  if (screen === 'results' && result) {
    return <ResultsScreen result={result} onRestart={restart} />;
  }

  return (
    <Container className="py-5">
      <Alert variant="danger">Something went wrong. Please reload the page.</Alert>
    </Container>
  );
}

export default App;
