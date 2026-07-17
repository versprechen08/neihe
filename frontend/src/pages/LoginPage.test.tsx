import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { ApiError, authApi, TOKEN_KEY } from '../services/api';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<typeof import('../services/api')>('../services/api');
  return { ...actual, authApi: { login: vi.fn(), register: vi.fn() } };
});

function renderLoginPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('logs in and navigates to /today on success', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.login).mockResolvedValue({ accessToken: 'fresh-token' });
    renderLoginPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.type(screen.getByLabelText('密码'), 'password123');
    await user.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/today'));
    expect(authApi.login).toHaveBeenCalledWith('seeker@neihe.app', 'password123');
    expect(localStorage.getItem(TOKEN_KEY)).toBe('fresh-token');
  });

  it('shows the backend error message on invalid credentials', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.login).mockRejectedValue(new ApiError('Invalid email or password', 401));
    renderLoginPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.type(screen.getByLabelText('密码'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() =>
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument(),
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('links to the register page', () => {
    renderLoginPage();

    expect(screen.getByRole('link', { name: '注册' })).toHaveAttribute('href', '/register');
  });

  it('links to the forgot-password page', () => {
    renderLoginPage();

    expect(screen.getByRole('link', { name: '忘记密码？' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });
});
