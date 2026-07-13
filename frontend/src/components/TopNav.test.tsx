import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TopNav } from './TopNav';

describe('TopNav', () => {
  it('renders the app name and all four nav links', () => {
    render(
      <MemoryRouter initialEntries={['/today']}>
        <TopNav />
      </MemoryRouter>,
    );

    expect(screen.getByText('内核 NèiHé')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '今日' })).toHaveAttribute('href', '/today');
    expect(screen.getByRole('link', { name: '手记' })).toHaveAttribute('href', '/journal');
    expect(screen.getByRole('link', { name: '呼吸' })).toHaveAttribute('href', '/breathe');
    expect(screen.getByRole('link', { name: '旅程' })).toHaveAttribute('href', '/journey');
  });

  it('is hidden on mobile (hidden lg:block) so BottomNav takes over', () => {
    render(
      <MemoryRouter initialEntries={['/today']}>
        <TopNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole('banner')).toHaveClass('hidden', 'lg:block');
  });
});
