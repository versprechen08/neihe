import { SEED_CARDS } from '../services/seed-cards';
import { SCHOOL_BADGE_CLASS } from '../lib/schoolStyles';
import type { PhilosophyCard } from '../types';

interface CardLibraryPanelProps {
  onSelect: (card: PhilosophyCard) => void;
  activeCardText?: string;
}

export function CardLibraryPanel({ onSelect, activeCardText }: CardLibraryPanelProps) {
  return (
    <section className="rounded-2xl border border-gold/35 border-t-4 border-t-pine bg-white p-6 lg:p-8">
      <h2 className="text-sm font-medium text-ink lg:text-base">全部卡片</h2>
      <p className="mt-1 text-xs text-ash lg:text-sm">点击任意一句，直接查看</p>

      <ul className="mt-4 flex max-h-[560px] flex-col gap-1 overflow-y-auto lg:mt-6">
        {SEED_CARDS.map((seed, index) => {
          const isActive = seed.originalText === activeCardText;
          return (
            <li key={index}>
              <button
                type="button"
                onClick={() => onSelect({ id: `library-${index}`, ...seed })}
                className={`flex w-full items-center gap-3 rounded-lg border-l-2 p-2 text-left transition-all duration-300 ease-out hover:border-l-gold hover:bg-gold/5 ${isActive ? 'border-l-gold bg-accent-bg' : 'border-l-transparent'}`}
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${SCHOOL_BADGE_CLASS[seed.school]}`}
                />
                <span className="truncate text-sm text-ink">{seed.originalText}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
