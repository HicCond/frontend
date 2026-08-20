import { Alert, Button, Card, Container, ListGroup, Table } from 'react-bootstrap';
import type { QuizResult } from '../types/quiz';

interface ResultsScreenProps {
  result: QuizResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const {
    totalScore,
    maxScore,
    passingScore,
    correctCount,
    incorrectCount,
    percentage,
    passed,
    incorrectAnswers,
  } = result;

  return (
    <Container className="py-5" style={{ maxWidth: 720 }}>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title as="h1">Your Results</Card.Title>
          <Alert variant={passed ? 'success' : 'danger'} className="fs-5">
            {totalScore} / {maxScore} (threshold {passingScore}) &mdash;{' '}
            {passed ? 'you passed!' : 'you did not pass.'}
          </Alert>
          <Table borderless size="sm" className="mb-0">
            <tbody>
              <tr>
                <td>Correct answers</td>
                <td>{correctCount}</td>
              </tr>
              <tr>
                <td>Incorrect answers</td>
                <td>{incorrectCount}</td>
              </tr>
              <tr>
                <td>Percentage of questions correct</td>
                <td>{percentage.toFixed(1)}%</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {incorrectAnswers.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title as="h2">Questions you missed</Card.Title>
            <ListGroup variant="flush">
              {incorrectAnswers.map((item) => (
                <ListGroup.Item key={item.questionId}>
                  <div className="fw-semibold">
                    {item.questionText} <span className="text-muted">({item.points} pts)</span>
                  </div>
                  <div className="text-danger">Your answer: {item.givenOptionText}</div>
                  <div className="text-success">Correct answer: {item.correctOptionText}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

      <Button onClick={onRestart}>Try Again</Button>
    </Container>
  );
}
