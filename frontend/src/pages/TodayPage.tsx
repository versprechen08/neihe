import { useEffect, useState } from 'react';
import { PhilosophyCard as PhilosophyCardView } from '../components/PhilosophyCard';
import { TodaySidePanel } from '../components/TodaySidePanel';
import { CardLibraryPanel } from '../components/CardLibraryPanel';
import { MoodSelector } from '../components/MoodSelector';
import { JournalInput } from '../components/JournalInput';
import { cardsApi, journalApi } from '../services/api';
import { SEED_CARDS } from '../services/seed-cards';
import type { Mood, PhilosophyCard } from '../types';

// Locally-picked cards (offline fallback / library browsing) never made it
// into the backend, so they have no real UUID to attach a journal entry to.
function hasRealCardId(card: PhilosophyCard): boolean {
  return !card.id.startsWith('mock-') && !card.id.startsWith('library-');
}

// Mirrors the backend's dayOfYear % totalActiveCards algorithm (NH-4) so the
// offline fallback still rotates like the real thing.
function getDayOfYear(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
}

function toMockCard(index: number): PhilosophyCard {
  return { id: `mock-${index}`, ...SEED_CARDS[index] };
}

function pickMockToday(): PhilosophyCard {
  return toMockCard(getDayOfYear(new Date()) % SEED_CARDS.length);
}

function pickMockRandom(excludeId?: string): PhilosophyCard {
  const indexes = SEED_CARDS.map((_, i) => i);
  const candidates = indexes.filter((i) => `mock-${i}` !== excludeId);
  const pool = candidates.length > 0 ? candidates : indexes;
  return toMockCard(pool[Math.floor(Math.random() * pool.length)]);
}

export function TodayPage() {
  const [card, setCard] = useState<PhilosophyCard | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  const [journalMood, setJournalMood] = useState<Mood | null>(null);
  const [journalContent, setJournalContent] = useState('');
  const [isSubmittingJournal, setIsSubmittingJournal] = useState(false);
  const [journalFeedback, setJournalFeedback] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    let cancelled = false;

    cardsApi
      .getToday()
      .then((data) => {
        if (cancelled) return;
        setCard(data);
        setIsUsingMockData(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCard(pickMockToday());
        setIsUsingMockData(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleNext = async () => {
    setIsFetchingNext(true);
    try {
      if (isUsingMockData) {
        setCard((current) => pickMockRandom(current?.id));
      } else {
        setCard(await cardsApi.getRandom());
      }
    } catch {
      setCard((current) => pickMockRandom(current?.id));
      setIsUsingMockData(true);
    } finally {
      setIsFetchingNext(false);
    }
  };

  const handleJournalSubmit = async () => {
    if (!journalMood || !journalContent.trim() || !card) return;

    setIsSubmittingJournal(true);
    setJournalFeedback(null);
    try {
      await journalApi.create({
        mood: journalMood,
        content: journalContent.trim(),
        ...(hasRealCardId(card) ? { cardId: card.id } : {}),
      });
      setJournalMood(null);
      setJournalContent('');
      setJournalFeedback('success');
    } catch {
      setJournalFeedback('error');
    } finally {
      setIsSubmittingJournal(false);
    }
  };

  if (isLoading) {
    return <p className="p-8 text-center text-ash">正在寻找今日的一句…</p>;
  }

  if (!card) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 lg:px-10 lg:pb-20 lg:pt-16">
      <h1 className="font-serif text-2xl text-ink lg:text-4xl">今日一句</h1>
      {isUsingMockData && <p className="mt-1 text-xs text-ash lg:text-sm">离线模式 · 显示本地内容</p>}

      <div className="mt-5 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_360px] lg:gap-10 xl:grid-cols-[1fr_320px_320px]">
        <div className="flex flex-col gap-6">
          <PhilosophyCardView card={card} onNext={handleNext} isLoadingNext={isFetchingNext} />

          <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm lg:p-8">
            <h2 className="text-sm font-medium text-ink lg:text-base">记录此刻</h2>
            <div className="mt-4">
              <MoodSelector value={journalMood} onChange={setJournalMood} />
            </div>
            <div className="mt-4">
              <JournalInput
                mood={journalMood}
                content={journalContent}
                onContentChange={(value) => {
                  setJournalContent(value);
                  setJournalFeedback(null);
                }}
                onSubmit={handleJournalSubmit}
                isSubmitting={isSubmittingJournal}
              />
            </div>
            {journalFeedback === 'success' && (
              <p className="mt-3 text-xs text-pine">已记录 · 可以在"手记"里看到它</p>
            )}
            {journalFeedback === 'error' && (
              <p className="mt-3 text-xs text-ash">记录失败，请确认已登录后重试。</p>
            )}
          </div>
        </div>

        <TodaySidePanel />
        <div className="hidden xl:block">
          <CardLibraryPanel onSelect={setCard} activeCardText={card.originalText} />
        </div>
      </div>
    </div>
  );
}
