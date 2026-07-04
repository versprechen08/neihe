// ============================================================
// 内核 NèiHé — Shared Types
// Mirror backend entities for type safety
// ============================================================

// ── Enums ──

export enum School {
  CONFUCIAN = 'confucian',
  DAOIST = 'daoist',
  BUDDHIST = 'buddhist',
}

export enum Mood {
  TURBULENT = 'turbulent',
  OVERCAST = 'overcast',
  CALM = 'calm',
  CLEAR = 'clear',
  LUMINOUS = 'luminous',
}

export enum MoodFit {
  TURBULENT = 'turbulent',
  CALM = 'calm',
  ANY = 'any',
}

export enum BreathingPattern {
  BOX = 'box',
  RELAX = 'relax',
  NATURAL = 'natural',
}

// ── Models ──

export interface PhilosophyCard {
  id: string;
  school: School;
  source: string;
  originalText: string;
  translation: string;
  reflection: string;
  themes: string[];
  moodFit: MoodFit;
}

export interface JournalEntry {
  id: string;
  mood: Mood;
  content: string;
  cardId: string | null;
  card?: PhilosophyCard;
  createdAt: string;
}

export interface BreathingSessionRecord {
  id: string;
  pattern: BreathingPattern;
  cyclesCompleted: number;
  durationSeconds: number;
  createdAt: string;
}

export interface UserStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  moodDistribution: Record<Mood, number>;
  totalBreathingMinutes: number;
  totalFavorites: number;
}

// ── DTOs (request bodies) ──

export interface CreateJournalDto {
  mood: Mood;
  content: string;
  cardId?: string;
}

export interface CreateBreathingSessionDto {
  pattern: BreathingPattern;
  cyclesCompleted: number;
  durationSeconds: number;
}

// ── UI helpers ──

export const MOOD_META: Record<Mood, { emoji: string; label: string }> = {
  [Mood.TURBULENT]: { emoji: '🌊', label: '波动' },
  [Mood.OVERCAST]: { emoji: '🌥', label: '阴沉' },
  [Mood.CALM]: { emoji: '🌤', label: '平静' },
  [Mood.CLEAR]: { emoji: '☀️', label: '清明' },
  [Mood.LUMINOUS]: { emoji: '✨', label: '通透' },
};

export const SCHOOL_META: Record<School, { label: string; color: string }> = {
  [School.CONFUCIAN]: { label: '儒', color: '#8B4513' },
  [School.DAOIST]: { label: '道', color: '#2E5E4E' },
  [School.BUDDHIST]: { label: '佛', color: '#6B4C8A' },
};

export const BREATHING_META: Record<
  BreathingPattern,
  { name: string; desc: string; inhale: number; hold: number; exhale: number }
> = {
  [BreathingPattern.RELAX]: {
    name: '4-7-8 呼吸法',
    desc: '安神助眠',
    inhale: 4, hold: 7, exhale: 8,
  },
  [BreathingPattern.BOX]: {
    name: '方块呼吸',
    desc: '焦虑急救',
    inhale: 4, hold: 4, exhale: 4,
  },
  [BreathingPattern.NATURAL]: {
    name: '自然呼吸',
    desc: '日常觉察',
    inhale: 5, hold: 0, exhale: 5,
  },
};
