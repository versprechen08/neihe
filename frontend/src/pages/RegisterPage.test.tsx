import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterPage } from './RegisterPage';
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

function renderRegisterPage() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe('RegisterPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('registers (with an optional nickname) and navigates to /today on success', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.register).mockResolvedValue({ accessToken: 'fresh-token' });
    renderRegisterPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.type(screen.getByLabelText('昵称（可选）'), 'Seeker');
    await user.type(screen.getByLabelText('密码（至少 6 位）'), 'password123');
    await user.click(screen.getByRole('button', { name: '注册' }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/today'));
    expect(authApi.register).toHaveBeenCalledWith('seeker@neihe.app', 'password123', 'Seeker');
    expect(localStorage.getItem(TOKEN_KEY)).toBe('fresh-token');
  });

  it('registers without a nickname when left blank', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.register).mockResolvedValue({ accessToken: 'fresh-token' });
    renderRegisterPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.type(screen.getByLabelText('密码（至少 6 位）'), 'password123');
    await user.click(screen.getByRole('button', { name: '注册' }));

    await waitFor(() =>
      expect(authApi.register).toHaveBeenCalledWith('seeker@neihe.app', 'password123', undefined),
    );
  });

  it('shows the backend error message when the email is already registered', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.register).mockRejectedValue(new ApiError('Email already registered', 409));
    renderRegisterPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.type(screen.getByLabelText('密码（至少 6 位）'), 'password123');
    await user.click(screen.getByRole('button', { name: '注册' }));

    await waitFor(() =>
      expect(screen.getByText('Email already registered')).toBeInTheDocument(),
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('links to the login page', () => {
    renderRegisterPage();

    expect(screen.getByRole('link', { name: '登录' })).toHaveAttribute('href', '/login');
  });
});
