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
    <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-md transition-all duration-300 ease-out hover:border-gold/35 hover:shadow-lg lg:p-10">
      <span
        className={`inline-block rounded-full px-3 py-1 text-xs font-medium text-white lg:px-4 lg:py-1.5 lg:text-sm ${SCHOOL_BADGE_CLASS[card.school]}`}
      >
        {schoolMeta.label}
      </span>

      <p className="mt-4 font-serif text-lg leading-relaxed text-ink lg:mt-6 lg:text-2xl">
        {card.originalText}
      </p>
      <p className="mt-2 text-sm text-ash lg:mt-3 lg:text-base">{card.translation}</p>

      <div className="mt-4 rounded-xl bg-accent-bg p-4 text-sm text-ink lg:mt-6 lg:p-6 lg:text-base">
        {card.reflection}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={isLoadingNext}
        className="mt-5 rounded-full border border-pine px-4 py-2 text-sm text-pine transition-all duration-300 ease-out hover:border-pine hover:bg-pine hover:text-white hover:shadow-[0_4px_16px_rgba(91,117,83,0.28)] disabled:cursor-not-allowed disabled:opacity-50 lg:mt-8 lg:px-6 lg:py-3 lg:text-base"
      >
        {isLoadingNext ? '换一则中…' : '换一则'}
      </button>
    </div>
  );
}
