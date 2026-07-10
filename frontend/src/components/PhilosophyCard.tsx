import type { PhilosophyCard as PhilosophyCardModel } from '../types';
import { SCHOOL_META } from '../types';
import { SCHOOL_BADGE_CLASS } from '../lib/schoolStyles';

interface PhilosophyCardProps {
  card: PhilosophyCardModel;
  onNext: () => void;
  isLoadingNext?: boolean;
}

export function PhilosophyCard({ card, onNext, isLoadingNext = false }: PhilosophyCardProps) {
  const schoolMeta = SCHOOL_META[card.school];

  return (
    <div className="rounded-2xl border border-card-border bg-white p-6 shadow-sm">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${SCHOOL_BADGE_CLASS[card.school]}`}
      >
        {schoolMeta.label}
      </span>

      <p className="mt-4 font-serif text-lg leading-relaxed text-ink">{card.originalText}</p>
      <p className="mt-2 text-sm text-ash">{card.translation}</p>

      <div className="mt-4 rounded-xl bg-accent-bg p-4 text-sm text-ink">{card.reflection}</div>

      <button
        type="button"
        onClick={onNext}
        disabled={isLoadingNext}
        className="mt-5 rounded-full border border-pine px-4 py-2 text-sm text-pine transition-colors hover:bg-pine hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoadingNext ? '换一则中…' : '换一则'}
      </button>
    </div>
  );
}
