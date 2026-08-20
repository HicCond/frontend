import { Alert, Button, Card, Container, Spinner, Table } from 'react-bootstrap';
import type { QuizRules } from '../types/quiz';

interface IntroScreenProps {
  rules: QuizRules | null;
  rulesLoading: boolean;
  rulesError: string | null;
  onStart: () => void;
  startLoading: boolean;
  startError: string | null;
}

export function IntroScreen({
  rules,
  rulesLoading,
  rulesError,
  onStart,
  startLoading,
  startError,
}: IntroScreenProps) {
  if (rulesLoading || !rules) {
    return (
      <Container className="py-5 text-center" style={{ maxWidth: 640 }}>
        {rulesError ? <Alert variant="danger">{rulesError}</Alert> : <Spinner animation="border" />}
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ maxWidth: 640 }}>
      <Card>
        <Card.Body>
          <Card.Title as="h1" className="mb-3">
            {rules.title}
          </Card.Title>
          <Card.Text>{rules.description}</Card.Text>
          <Table bordered size="sm" className="mb-3">
            <thead>
              <tr>
                <th>Questions</th>
                <th>Points each</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {rules.scoring.map((rule) => (
                <tr key={rule.pointsPerQuestion}>
                  <td>{rule.questionCount}</td>
                  <td>{rule.pointsPerQuestion}</td>
                  <td>{rule.subtotal}</td>
                </tr>
              ))}
              <tr>
                <th>Total</th>
                <th />
                <th>{rules.maxScore}</th>
              </tr>
            </tbody>
          </Table>
          <Card.Text>
            You need more than <strong>{rules.passingScore} points</strong> to pass. You must select
            an answer before moving to the next question, and you cannot go back once you&apos;ve
            moved on.
          </Card.Text>
          {startError && <Alert variant="danger">{startError}</Alert>}
          <Button onClick={onStart} disabled={startLoading} size="lg">
            {startLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Loading questions...
              </>
            ) : (
              'Start Quiz'
            )}
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
