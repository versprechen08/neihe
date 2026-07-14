import { Mood, MOOD_META } from '../types';

const MOOD_ORDER: Mood[] = [
  Mood.TURBULENT,
  Mood.OVERCAST,
  Mood.CALM,
  Mood.CLEAR,
  Mood.LUMINOUS,
];

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (mood: Mood) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex gap-2" role="group" aria-label="选择此刻的心情">
      {MOOD_ORDER.map((mood) => {
        const meta = MOOD_META[mood];
        const isSelected = value === mood;
        return (
          <button
            key={mood}
            type="button"
            onClick={() => onChange(mood)}
            aria-pressed={isSelected}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-3 transition-all duration-300 ease-out ${
              isSelected
                ? 'border-gold bg-gold/5'
                : 'border-card-border hover:border-gold/30'
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {meta.emoji}
            </span>
            <span className="text-xs text-ash">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
