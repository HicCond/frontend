import { Alert, Badge, Button, Card, Container, ProgressBar, Spinner } from 'react-bootstrap';
import type { QuizQuestion } from '../types/quiz';
import { QuestionOptions } from './QuestionOptions';

interface QuizScreenProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | undefined;
  isLastQuestion: boolean;
  loading: boolean;
  error: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
}

export function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  isLastQuestion,
  loading,
  error,
  onSelect,
  onNext,
}: QuizScreenProps) {
  return (
    <Container className="py-5" style={{ maxWidth: 640 }}>
      <ProgressBar
        now={((questionNumber - 1) / totalQuestions) * 100}
        label={`${questionNumber} / ${totalQuestions}`}
        className="mb-3"
      />
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <Card.Title as="h2" className="mb-0">
              Question {questionNumber}
            </Card.Title>
            <Badge bg="secondary">{question.points} pts</Badge>
          </div>
          <Card.Text className="mb-3">{question.text}</Card.Text>
          <QuestionOptions
            questionId={question.id}
            options={question.options}
            selectedOptionId={selectedOptionId}
            onSelect={onSelect}
          />
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          <div className="mt-4">
            <Button onClick={onNext} disabled={!selectedOptionId || loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  Submitting...
                </>
              ) : isLastQuestion ? (
                'Submit'
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
