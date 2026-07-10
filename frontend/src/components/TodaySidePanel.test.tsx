import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TodaySidePanel } from './TodaySidePanel';

describe('TodaySidePanel', () => {
  it('renders the three schools legend', () => {
    render(
      <MemoryRouter>
        <TodaySidePanel />
      </MemoryRouter>,
    );

    expect(screen.getByText('三家智慧')).toBeInTheDocument();
    expect(screen.getByText('儒')).toBeInTheDocument();
    expect(screen.getByText('道')).toBeInTheDocument();
    expect(screen.getByText('佛')).toBeInTheDocument();
  });

  it('links to the three upcoming feature routes', () => {
    render(
      <MemoryRouter>
        <TodaySidePanel />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: /手记/ })).toHaveAttribute('href', '/journal');
    expect(screen.getByRole('link', { name: /呼吸/ })).toHaveAttribute('href', '/breathe');
    expect(screen.getByRole('link', { name: /旅程/ })).toHaveAttribute('href', '/journey');
  });
});
