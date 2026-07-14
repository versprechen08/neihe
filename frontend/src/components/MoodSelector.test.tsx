import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoodSelector } from './MoodSelector';
import { Mood } from '../types';

describe('MoodSelector', () => {
  it('renders all five mood options', () => {
    render(<MoodSelector value={null} onChange={() => {}} />);

    expect(screen.getByText('🌊')).toBeInTheDocument();
    expect(screen.getByText('🌥')).toBeInTheDocument();
    expect(screen.getByText('🌤')).toBeInTheDocument();
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByText('✨')).toBeInTheDocument();
  });

  it('calls onChange with the selected mood', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MoodSelector value={null} onChange={onChange} />);

    await user.click(screen.getByText('✨').closest('button')!);

    expect(onChange).toHaveBeenCalledWith(Mood.LUMINOUS);
  });

  it('marks only the selected mood as pressed', () => {
    render(<MoodSelector value={Mood.CALM} onChange={() => {}} />);

    expect(screen.getByText('🌤').closest('button')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('🌊').closest('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
