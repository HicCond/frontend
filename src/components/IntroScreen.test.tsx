import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { fixtureRules } from '../mocks/data';
import { IntroScreen } from './IntroScreen';

describe('IntroScreen', () => {
  it('shows the scoring rules from the fetched rules and calls onStart when clicked', async () => {
    const onStart = vi.fn();
    render(
      <IntroScreen
        rules={fixtureRules}
        rulesLoading={false}
        rulesError={null}
        onStart={onStart}
        startLoading={false}
        startError={null}
      />,
    );

    expect(screen.getByText(fixtureRules.title)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${fixtureRules.passingScore} points`))).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /start quiz/i });
    await userEvent.click(button);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('shows a spinner while the rules are still loading', () => {
    render(
      <IntroScreen
        rules={null}
        rulesLoading={true}
        rulesError={null}
        onStart={vi.fn()}
        startLoading={false}
        startError={null}
      />,
    );
    expect(screen.queryByRole('button', { name: /start quiz/i })).not.toBeInTheDocument();
  });

  it('disables the button and shows a loading state while starting the quiz', () => {
    render(
      <IntroScreen
        rules={fixtureRules}
        rulesLoading={false}
        rulesError={null}
        onStart={vi.fn()}
        startLoading={true}
        startError={null}
      />,
    );
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText(/loading questions/i)).toBeInTheDocument();
  });

  it('shows an error message when starting the quiz fails', () => {
    render(
      <IntroScreen
        rules={fixtureRules}
        rulesLoading={false}
        rulesError={null}
        onStart={vi.fn()}
        startLoading={false}
        startError="Network error"
      />,
    );
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
});
