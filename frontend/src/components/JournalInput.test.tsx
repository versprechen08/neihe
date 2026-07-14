import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JournalInput } from './JournalInput';
import { Mood } from '../types';

describe('JournalInput', () => {
  it('disables submit when no mood is selected', () => {
    render(
      <JournalInput mood={null} content="something" onContentChange={() => {}} onSubmit={() => {}} />,
    );

    expect(screen.getByRole('button', { name: '记录此刻' })).toBeDisabled();
  });

  it('disables submit when content is empty or whitespace', () => {
    render(
      <JournalInput mood={Mood.CALM} content="   " onContentChange={() => {}} onSubmit={() => {}} />,
    );

    expect(screen.getByRole('button', { name: '记录此刻' })).toBeDisabled();
  });

  it('enables submit once both mood and content are present', () => {
    render(
      <JournalInput
        mood={Mood.CALM}
        content="今天很平静"
        onContentChange={() => {}}
        onSubmit={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: '记录此刻' })).toBeEnabled();
  });

  it('calls onContentChange as the user types', async () => {
    const user = userEvent.setup();
    const onContentChange = vi.fn();
    render(
      <JournalInput mood={null} content="" onContentChange={onContentChange} onSubmit={() => {}} />,
    );

    await user.type(screen.getByPlaceholderText(/写下此刻浮现的想法/), 'a');

    expect(onContentChange).toHaveBeenCalledWith('a');
  });

  it('calls onSubmit when the enabled button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <JournalInput mood={Mood.CALM} content="今天很平静" onContentChange={() => {}} onSubmit={onSubmit} />,
    );

    await user.click(screen.getByRole('button', { name: '记录此刻' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows a submitting label and stays disabled while isSubmitting', () => {
    render(
      <JournalInput
        mood={Mood.CALM}
        content="今天很平静"
        onContentChange={() => {}}
        onSubmit={() => {}}
        isSubmitting
      />,
    );

    expect(screen.getByRole('button', { name: '记录中…' })).toBeDisabled();
  });
});
