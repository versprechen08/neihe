// ============================================================
// 内核 NèiHé — API Service
// Centralized API calls, swap mock ↔ real by changing BASE_URL
// ============================================================

import type {
  PhilosophyCard,
  JournalEntry,
  BreathingSessionRecord,
  UserStats,
  CreateJournalDto,
  CreateBreathingSessionDto,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('neihe_token');

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(error.message || `Request failed: ${res.status}`, res.status);
  }

  return res.json();
}

// ── Cards ──

export const cardsApi = {
  getToday: () => request<PhilosophyCard>('/cards/today'),

  getRandom: () => request<PhilosophyCard>('/cards/random'),

  toggleFavorite: (cardId: string) =>
    request<{ favorited: boolean }>(`/cards/${cardId}/favorite`, {
      method: 'POST',
    }),
};

// ── Journal ──

export const journalApi = {
  create: (dto: CreateJournalDto) =>
    request<JournalEntry>('/journal', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),

  list: (page = 1, mood?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (mood) params.set('mood', mood);
    return request<{ data: JournalEntry[]; total: number }>(
      `/journal?${params}`,
    );
  },
};

// ── Breathing ──

export const breathingApi = {
  create: (dto: CreateBreathingSessionDto) =>
    request<BreathingSessionRecord>('/breathing', {
      method: 'POST',
      body: JSON.stringify(dto),
    }),
};

// ── Stats ──

export const statsApi = {
  summary: () => request<UserStats>('/stats/summary'),
};

// ── Auth ──

export const authApi = {
  register: (email: string, password: string, nickname?: string) =>
    request<{ accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
    }),

  login: (email: string, password: string) =>
    request<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
