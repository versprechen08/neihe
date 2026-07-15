import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { TOKEN_KEY } from '../services/api';

function Consumer() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p>{isAuthenticated ? 'authenticated' : 'anonymous'}</p>
      <button type="button" onClick={() => login('new-token')}>
        log in
      </button>
      <button type="button" onClick={logout}>
        log out
      </button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reflects an existing token in localStorage on mount', () => {
    localStorage.setItem(TOKEN_KEY, 'existing-token');

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByText('authenticated')).toBeInTheDocument();
  });

  it('starts anonymous when there is no stored token', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    expect(screen.getByText('anonymous')).toBeInTheDocument();
  });

  it('login() stores the token and flips isAuthenticated', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'log in' }));

    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-token');
    expect(screen.getByText('authenticated')).toBeInTheDocument();
  });

  it('logout() clears the token and flips isAuthenticated back', async () => {
    localStorage.setItem(TOKEN_KEY, 'existing-token');
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'log out' }));

    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(screen.getByText('anonymous')).toBeInTheDocument();
  });
});
