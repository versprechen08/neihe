import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhilosophyCard } from './PhilosophyCard';
import { MoodFit, School } from '../types';
import type { PhilosophyCard as PhilosophyCardModel } from '../types';

const buildCard = (overrides: Partial<PhilosophyCardModel> = {}): PhilosophyCardModel => ({
  id: 'card-1',
  school: School.CONFUCIAN,
  source: '《论语》',
  originalText: '学而时习之',
  translation: 'Learn and practise it often',
  reflection: 'What have you practised lately?',
  themes: ['growth'],
  moodFit: MoodFit.ANY,
  ...overrides,
});

describe('PhilosophyCard', () => {
  it('renders the school badge, original text, translation, and reflection', () => {
    render(<PhilosophyCard card={buildCard()} onNext={() => {}} />);

    expect(screen.getByText('儒')).toBeInTheDocument();
    expect(screen.getByText('学而时习之')).toBeInTheDocument();
    expect(screen.getByText('Learn and practise it often')).toBeInTheDocument();
    expect(screen.getByText('What have you practised lately?')).toBeInTheDocument();
  });

  it('calls onNext when the "换一则" button is clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    render(<PhilosophyCard card={buildCard()} onNext={onNext} />);

    await user.click(screen.getByRole('button', { name: '换一则' }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables the button and shows a loading label while fetching the next card', () => {
    render(<PhilosophyCard card={buildCard()} onNext={() => {}} isLoadingNext />);

    const button = screen.getByRole('button', { name: '换一则中…' });
    expect(button).toBeDisabled();
  });

  it.each([
    [School.CONFUCIAN, '儒'],
    [School.DAOIST, '道'],
    [School.BUDDHIST, '佛'],
  ])('shows the correct badge label for %s', (school, label) => {
    render(<PhilosophyCard card={buildCard({ school })} onNext={() => {}} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
