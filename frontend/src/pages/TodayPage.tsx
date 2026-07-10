import { useEffect, useState } from 'react';
import { PhilosophyCard as PhilosophyCardView } from '../components/PhilosophyCard';
import { TodaySidePanel } from '../components/TodaySidePanel';
import { cardsApi } from '../services/api';
import { SEED_CARDS } from '../services/seed-cards';
import type { PhilosophyCard } from '../types';

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

  if (isLoading) {
    return <p className="p-8 text-center text-ash">正在寻找今日的一句…</p>;
  }

  if (!card) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 lg:px-8 lg:pb-16 lg:pt-12">
      <h1 className="font-serif text-2xl text-ink">今日一句</h1>
      {isUsingMockData && <p className="mt-1 text-xs text-ash">离线模式 · 显示本地内容</p>}

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_320px]">
        <PhilosophyCardView card={card} onNext={handleNext} isLoadingNext={isFetchingNext} />
        <TodaySidePanel />
      </div>
    </div>
  );
}
