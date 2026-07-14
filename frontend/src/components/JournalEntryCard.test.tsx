import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JournalEntryCard } from './JournalEntryCard';
import { Mood, MoodFit, School } from '../types';
import type { JournalEntry } from '../types';

describe('JournalEntryCard', () => {
  it('renders the mood emoji and content', () => {
    const entry: JournalEntry = {
      id: 'entry-1',
      mood: Mood.LUMINOUS,
      content: '今天读了道德经，心里很平静。',
      cardId: null,
      createdAt: '2026-07-14T03:18:53.244Z',
    };

    render(<JournalEntryCard entry={entry} />);

    expect(screen.getByText('✨')).toBeInTheDocument();
    expect(screen.getByText('今天读了道德经，心里很平静。')).toBeInTheDocument();
  });

  it('does not render a card reference when no card is attached', () => {
    const entry: JournalEntry = {
      id: 'entry-1',
      mood: Mood.CALM,
      content: '随手记一笔。',
      cardId: null,
      createdAt: '2026-07-14T03:18:53.244Z',
    };

    render(<JournalEntryCard entry={entry} />);

    expect(screen.queryByText(/关联卡片/)).not.toBeInTheDocument();
  });

  it('renders the referenced card text when present', () => {
    const entry: JournalEntry = {
      id: 'entry-1',
      mood: Mood.CALM,
      content: '看到这句话很有感触。',
      cardId: 'card-1',
      createdAt: '2026-07-14T03:18:53.244Z',
      card: {
        id: 'card-1',
        school: School.DAOIST,
        source: '《道德经》',
        originalText: '上善若水',
        translation: 'The highest good is like water',
        reflection: 'Are you being water today?',
        themes: ['flow'],
        moodFit: MoodFit.ANY,
      },
    };

    render(<JournalEntryCard entry={entry} />);

    expect(screen.getByText(/关联卡片/)).toHaveTextContent('关联卡片：上善若水');
  });
});
