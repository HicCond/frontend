import { Form, ListGroup } from 'react-bootstrap';
import type { QuizOption } from '../types/quiz';

interface QuestionOptionsProps {
  questionId: string;
  options: QuizOption[];
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
}

export function QuestionOptions({
  questionId,
  options,
  selectedOptionId,
  onSelect,
}: QuestionOptionsProps) {
  return (
    <ListGroup>
      {options.map((option) => (
        <ListGroup.Item key={option.id} action onClick={() => onSelect(option.id)}>
          <Form.Check
            type="radio"
            id={`${questionId}-${option.id}`}
            name={questionId}
            label={option.text}
            checked={selectedOptionId === option.id}
            onChange={() => onSelect(option.id)}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
