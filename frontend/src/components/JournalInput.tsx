import type { Mood } from '../types';

interface JournalInputProps {
  mood: Mood | null;
  content: string;
  onContentChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function JournalInput({
  mood,
  content,
  onContentChange,
  onSubmit,
  isSubmitting = false,
}: JournalInputProps) {
  const canSubmit = mood !== null && content.trim().length > 0 && !isSubmitting;

  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="写下此刻浮现的想法，不需要完整，不需要正确……"
        rows={4}
        className="w-full resize-none rounded-xl border border-card-border bg-white p-4 text-sm leading-relaxed text-ink outline-none transition-colors duration-300 focus:border-pine"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full rounded-full bg-pine py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:shadow-[0_4px_16px_rgba(91,117,83,0.28)] disabled:cursor-not-allowed disabled:bg-card-border disabled:text-ash disabled:shadow-none"
      >
        {isSubmitting ? '记录中…' : '记录此刻'}
      </button>
    </div>
  );
}
