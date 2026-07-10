import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNav } from './BottomNav';

describe('BottomNav', () => {
  it('renders all four tabs with links to their routes', () => {
    render(
      <MemoryRouter initialEntries={['/today']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: '今日' })).toHaveAttribute('href', '/today');
    expect(screen.getByRole('link', { name: '手记' })).toHaveAttribute('href', '/journal');
    expect(screen.getByRole('link', { name: '呼吸' })).toHaveAttribute('href', '/breathe');
    expect(screen.getByRole('link', { name: '旅程' })).toHaveAttribute('href', '/journey');
  });

  it('is hidden on desktop (lg:hidden) so TopNav takes over', () => {
    render(
      <MemoryRouter initialEntries={['/today']}>
        <BottomNav />
      </MemoryRouter>,
    );

    expect(screen.getByRole('navigation')).toHaveClass('lg:hidden');
  });
});
