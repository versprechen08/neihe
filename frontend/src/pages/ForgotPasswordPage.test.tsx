import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { authApi } from '../services/api';

vi.mock('../services/api', async () => {
  const actual = await vi.importActual<typeof import('../services/api')>('../services/api');
  return { ...actual, authApi: { forgotPassword: vi.fn() } };
});

function renderPage() {
  return render(
    <MemoryRouter>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );
}

describe('ForgotPasswordPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('submits the email and shows the generic "sent" confirmation', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.forgotPassword).mockResolvedValue({ message: 'ok' });
    renderPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.click(screen.getByRole('button', { name: '发送重置链接' }));

    await waitFor(() => expect(screen.getByText('邮件已发送')).toBeInTheDocument());
    expect(authApi.forgotPassword).toHaveBeenCalledWith('seeker@neihe.app');
  });

  it('shows the same confirmation regardless of whether the email is registered', async () => {
    // The backend always returns 200 for this endpoint (never reveals which
    // emails exist) — this test locks in that the frontend doesn't try to
    // branch on the response content either.
    const user = userEvent.setup();
    vi.mocked(authApi.forgotPassword).mockResolvedValue({ message: 'ok' });
    renderPage();

    await user.type(screen.getByLabelText('邮箱'), 'unregistered@neihe.app');
    await user.click(screen.getByRole('button', { name: '发送重置链接' }));

    await waitFor(() => expect(screen.getByText('邮件已发送')).toBeInTheDocument());
  });

  it('shows an error message when the request itself fails', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.forgotPassword).mockRejectedValue(new Error('Network error'));
    renderPage();

    await user.type(screen.getByLabelText('邮箱'), 'seeker@neihe.app');
    await user.click(screen.getByRole('button', { name: '发送重置链接' }));

    await waitFor(() => expect(screen.getByText('Network error')).toBeInTheDocument());
    expect(screen.queryByText('邮件已发送')).not.toBeInTheDocument();
  });

  it('links back to the login page', () => {
    renderPage();

    expect(screen.getByRole('link', { name: '返回登录' })).toHaveAttribute('href', '/login');
  });
});
