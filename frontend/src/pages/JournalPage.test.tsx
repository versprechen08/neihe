import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JournalPage } from './JournalPage';
import { ApiError, journalApi } from '../services/api';
import { Mood } from '../types';
import type { JournalEntry } from '../types';

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<typeof import('../services/api')>('../services/api');
  return {
    ApiError: actual.ApiError,
    journalApi: {
      list: vi.fn(),
    },
  };
});

function buildEntry(overrides: Partial<JournalEntry> = {}): JournalEntry {
  return {
    id: 'entry-1',
    mood: Mood.CALM,
    content: '今天很平静。',
    cardId: null,
    createdAt: '2026-07-14T03:18:53.244Z',
    ...overrides,
  };
}

describe('JournalPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders entries once loaded', async () => {
    vi.mocked(journalApi.list).mockResolvedValue({ data: [buildEntry()], total: 1 });

    render(<JournalPage />);

    await waitFor(() => expect(screen.getByText('今天很平静。')).toBeInTheDocument());
    expect(journalApi.list).toHaveBeenCalledWith(1, undefined);
  });

  it('shows an empty state when there are no entries', async () => {
    vi.mocked(journalApi.list).mockResolvedValue({ data: [], total: 0 });

    render(<JournalPage />);

    await waitFor(() => expect(screen.getByText(/还没有手记/)).toBeInTheDocument());
  });

  it('shows a login prompt on a 401 response', async () => {
    vi.mocked(journalApi.list).mockRejectedValue(new ApiError('Unauthorized', 401));

    render(<JournalPage />);

    await waitFor(() => expect(screen.getByText('请先登录后查看你的手记。')).toBeInTheDocument());
  });

  it('shows a generic error message on other failures', async () => {
    vi.mocked(journalApi.list).mockRejectedValue(new Error('network down'));

    render(<JournalPage />);

    await waitFor(() => expect(screen.getByText('加载失败，请稍后再试。')).toBeInTheDocument());
  });

  it('refetches with the mood filter when a mood tab is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(journalApi.list).mockResolvedValue({ data: [], total: 0 });

    render(<JournalPage />);
    await waitFor(() => expect(journalApi.list).toHaveBeenCalledWith(1, undefined));

    await user.click(screen.getByRole('button', { name: '平静' }));

    await waitFor(() => expect(journalApi.list).toHaveBeenCalledWith(1, 'calm'));
  });

  it('shows "加载更多" when more entries exist, and loads the next page on click', async () => {
    const user = userEvent.setup();
    vi.mocked(journalApi.list)
      .mockResolvedValueOnce({ data: [buildEntry({ id: 'entry-1' })], total: 2 })
      .mockResolvedValueOnce({ data: [buildEntry({ id: 'entry-2', content: '第二篇。' })], total: 2 });

    render(<JournalPage />);
    await waitFor(() => expect(screen.getByText('加载更多')).toBeInTheDocument());

    await user.click(screen.getByText('加载更多'));

    await waitFor(() => expect(screen.getByText('第二篇。')).toBeInTheDocument());
    expect(journalApi.list).toHaveBeenLastCalledWith(2, undefined);
  });
});
