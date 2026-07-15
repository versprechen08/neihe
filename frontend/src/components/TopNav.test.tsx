import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TopNav } from './TopNav';
import { AuthProvider } from '../context/AuthContext';
import { TOKEN_KEY } from '../services/api';

function renderTopNav() {
  return render(
    <MemoryRouter initialEntries={['/today']}>
      <AuthProvider>
        <TopNav />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('TopNav', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the app name and all four nav links', () => {
    renderTopNav();

    expect(screen.getByText('内核 NèiHé')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '今日' })).toHaveAttribute('href', '/today');
    expect(screen.getByRole('link', { name: '手记' })).toHaveAttribute('href', '/journal');
    expect(screen.getByRole('link', { name: '呼吸' })).toHaveAttribute('href', '/breathe');
    expect(screen.getByRole('link', { name: '旅程' })).toHaveAttribute('href', '/journey');
  });

  it('is hidden on mobile (hidden lg:block) so BottomNav takes over', () => {
    renderTopNav();

    expect(screen.getByRole('banner')).toHaveClass('hidden', 'lg:block');
  });

  it('shows a login link when logged out', () => {
    renderTopNav();

    expect(screen.getByRole('link', { name: '登录' })).toHaveAttribute('href', '/login');
  });

  it('shows a logout button when logged in', () => {
    localStorage.setItem(TOKEN_KEY, 'fake-token');

    renderTopNav();

    expect(screen.getByRole('button', { name: '退出' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '登录' })).not.toBeInTheDocument();
  });

  it('clears the token and switches back to the login link on logout', async () => {
    localStorage.setItem(TOKEN_KEY, 'fake-token');
    const user = userEvent.setup();
    renderTopNav();

    await user.click(screen.getByRole('button', { name: '退出' }));

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(screen.getByRole('link', { name: '登录' })).toBeInTheDocument();
  });
});
