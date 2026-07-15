import { MOOD_META } from '../types';
import type { JournalEntry } from '../types';

function formatEntryDate(iso: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

interface JournalEntryCardProps {
  entry: JournalEntry;
}

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const meta = MOOD_META[entry.mood];

  return (
    <div className="rounded-xl border border-gold/35 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl" aria-label={meta.label}>
          {meta.emoji}
        </span>
        <span className="text-xs text-ash">{formatEntryDate(entry.createdAt)}</span>
      </div>

      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">{entry.content}</p>

      {entry.card && (
        <p className="mt-3 border-l-2 border-gold/30 pl-2 text-xs text-ash">
          关联卡片：{entry.card.originalText}
        </p>
      )}
    </div>
  );
}
