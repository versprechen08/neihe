import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ResetPasswordPage } from './ResetPasswordPage';
import { authApi } from '../services/api';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<typeof import('../services/api')>('../services/api');
  return { ...actual, authApi: { resetPassword: vi.fn() } };
});

function renderPage(path = '/reset-password?token=raw-token') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ResetPasswordPage />
    </MemoryRouter>,
  );
}

describe('ResetPasswordPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows an "invalid link" state when there is no token in the URL', () => {
    renderPage('/reset-password');

    expect(screen.getByText('链接无效')).toBeInTheDocument();
    expect(screen.queryByLabelText('新密码（至少 6 位）')).not.toBeInTheDocument();
  });

  it('submits the token and new password, then navigates to /login', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.resetPassword).mockResolvedValue({ message: 'ok' });
    renderPage('/reset-password?token=raw-token');

    await user.type(screen.getByLabelText('新密码（至少 6 位）'), 'new-password123');
    await user.type(screen.getByLabelText('确认新密码'), 'new-password123');
    await user.click(screen.getByRole('button', { name: '重置密码' }));

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/login'));
    expect(authApi.resetPassword).toHaveBeenCalledWith('raw-token', 'new-password123');
  });

  it('rejects mismatched passwords without calling the API', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText('新密码（至少 6 位）'), 'new-password123');
    await user.type(screen.getByLabelText('确认新密码'), 'different-password');
    await user.click(screen.getByRole('button', { name: '重置密码' }));

    expect(screen.getByText('两次输入的密码不一致。')).toBeInTheDocument();
    expect(authApi.resetPassword).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('shows the backend error for an expired or invalid token', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.resetPassword).mockRejectedValue(new Error('Invalid or expired reset token'));
    renderPage();

    await user.type(screen.getByLabelText('新密码（至少 6 位）'), 'new-password123');
    await user.type(screen.getByLabelText('确认新密码'), 'new-password123');
    await user.click(screen.getByRole('button', { name: '重置密码' }));

    await waitFor(() =>
      expect(screen.getByText('Invalid or expired reset token')).toBeInTheDocument(),
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
