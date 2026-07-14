import { useEffect, useState } from 'react';
import { JournalEntryCard } from '../components/JournalEntryCard';
import { ApiError, journalApi } from '../services/api';
import { Mood, MOOD_META } from '../types';
import type { JournalEntry } from '../types';

const MOOD_ORDER: Mood[] = [
  Mood.TURBULENT,
  Mood.OVERCAST,
  Mood.CALM,
  Mood.CLEAR,
  Mood.LUMINOUS,
];

type MoodFilter = Mood | 'all';
type LoadError = 'unauthenticated' | 'unknown';

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [moodFilter, setMoodFilter] = useState<MoodFilter>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<LoadError | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    journalApi
      .list(1, moodFilter === 'all' ? undefined : moodFilter)
      .then((res) => {
        if (cancelled) return;
        setEntries(res.data);
        setTotal(res.total);
        setPage(1);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError && err.status === 401 ? 'unauthenticated' : 'unknown');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [moodFilter]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await journalApi.list(nextPage, moodFilter === 'all' ? undefined : moodFilter);
      setEntries((prev) => [...prev, ...res.data]);
      setPage(nextPage);
    } catch {
      // Leave the existing list showing; "加载更多" stays available so the user can retry.
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasMore = entries.length < total;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-10 lg:px-8 lg:pt-16">
      <h1 className="font-serif text-2xl text-ink lg:text-4xl">手记</h1>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="按心情筛选">
        <button
          type="button"
          onClick={() => setMoodFilter('all')}
          aria-pressed={moodFilter === 'all'}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 ${
            moodFilter === 'all'
              ? 'border-pine bg-pine text-white'
              : 'border-card-border text-ash hover:border-gold/30'
          }`}
        >
          全部
        </button>
        {MOOD_ORDER.map((mood) => {
          const meta = MOOD_META[mood];
          const isActive = moodFilter === mood;
          return (
            <button
              key={mood}
              type="button"
              onClick={() => setMoodFilter(mood)}
              aria-pressed={isActive}
              aria-label={meta.label}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors duration-300 ${
                isActive
                  ? 'border-pine bg-pine text-white'
                  : 'border-card-border text-ash hover:border-gold/30'
              }`}
            >
              {meta.emoji}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <p className="py-8 text-center text-ash">正在加载…</p>
        ) : error === 'unauthenticated' ? (
          <p className="py-8 text-center text-ash">请先登录后查看你的手记。</p>
        ) : error ? (
          <p className="py-8 text-center text-ash">加载失败，请稍后再试。</p>
        ) : entries.length === 0 ? (
          <p className="py-8 text-center text-ash">还没有手记，去"今日"写下第一篇吧。</p>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
            {hasMore && (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="mt-2 rounded-full border border-pine px-4 py-2 text-sm text-pine transition-all duration-300 ease-out hover:bg-pine hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoadingMore ? '加载中…' : '加载更多'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
