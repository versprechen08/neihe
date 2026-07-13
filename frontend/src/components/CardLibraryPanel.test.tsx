import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CardLibraryPanel } from './CardLibraryPanel';
import { SEED_CARDS } from '../services/seed-cards';

describe('CardLibraryPanel', () => {
  it('renders one entry per seed card', () => {
    render(<CardLibraryPanel onSelect={() => {}} />);

    expect(screen.getByText('全部卡片')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(SEED_CARDS.length);
    expect(screen.getByText(SEED_CARDS[0].originalText)).toBeInTheDocument();
  });

  it('calls onSelect with the full card (including a stable id) when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CardLibraryPanel onSelect={onSelect} />);

    await user.click(screen.getByText(SEED_CARDS[2].originalText));

    expect(onSelect).toHaveBeenCalledWith({ id: 'library-2', ...SEED_CARDS[2] });
  });

  it("highlights the entry matching the currently displayed card's text", () => {
    render(<CardLibraryPanel onSelect={() => {}} activeCardText={SEED_CARDS[1].originalText} />);

    expect(screen.getByText(SEED_CARDS[1].originalText).closest('button')).toHaveClass(
      'bg-accent-bg',
    );
    expect(screen.getByText(SEED_CARDS[0].originalText).closest('button')).not.toHaveClass(
      'bg-accent-bg',
    );
  });
});
