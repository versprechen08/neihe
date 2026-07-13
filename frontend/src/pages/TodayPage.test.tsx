import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TodayPage } from './TodayPage';
import { cardsApi } from '../services/api';
import { MoodFit, School } from '../types';
import type { PhilosophyCard } from '../types';

vi.mock('../services/api', () => ({
  cardsApi: {
    getToday: vi.fn(),
    getRandom: vi.fn(),
  },
}));

// TodaySidePanel (rendered by TodayPage) uses <Link>, which needs a Router context.
function renderTodayPage() {
  return render(
    <MemoryRouter>
      <TodayPage />
    </MemoryRouter>,
  );
}

const apiCard: PhilosophyCard = {
  id: 'card-api',
  school: School.DAOIST,
  source: '《道德经》',
  originalText: '上善若水',
  translation: 'The highest good is like water',
  reflection: 'Are you being water today?',
  themes: ['flow'],
  moodFit: MoodFit.ANY,
};

describe('TodayPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the card returned by GET /cards/today", async () => {
    vi.mocked(cardsApi.getToday).mockResolvedValue(apiCard);

    renderTodayPage();

    await waitFor(() => expect(screen.getByText('上善若水')).toBeInTheDocument());
    expect(screen.queryByText('离线模式 · 显示本地内容')).not.toBeInTheDocument();
  });

  it('falls back to local seed data when the backend is unavailable', async () => {
    vi.mocked(cardsApi.getToday).mockRejectedValue(new Error('network error'));

    renderTodayPage();

    await waitFor(() =>
      expect(screen.getByText('离线模式 · 显示本地内容')).toBeInTheDocument(),
    );
    // Whatever mock card was picked, it must have rendered as a real card, not a blank state.
    expect(screen.getByRole('button', { name: '换一则' })).toBeInTheDocument();
  });

  it('replaces the card with a random one when "换一则" is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(cardsApi.getToday).mockResolvedValue(apiCard);
    const nextCard: PhilosophyCard = { ...apiCard, id: 'card-next', originalText: '知人者智' };
    vi.mocked(cardsApi.getRandom).mockResolvedValue(nextCard);

    renderTodayPage();
    await waitFor(() => expect(screen.getByText('上善若水')).toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: '换一则' }));

    await waitFor(() => expect(screen.getByText('知人者智')).toBeInTheDocument());
  });
});
