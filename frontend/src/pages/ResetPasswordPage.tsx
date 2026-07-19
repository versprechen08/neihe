import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { authApi } from '../services/api';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!token) {
    return (
      <AuthCard title="链接无效" subtitle="这个重置链接不完整或已经失效">
        <p className="mt-6 text-center text-xs text-ash">
          <Link to="/forgot-password" className="text-pine">
            重新发送一个
          </Link>
        </p>
      </AuthCard>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('两次输入的密码不一致。');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword(token, newPassword);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : '重置失败，请重新申请一个新的链接。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="设置新密码" subtitle="给自己的账号换一把新钥匙">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="newPassword" className="text-xs text-ash">
            新密码（至少 6 位）
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-white p-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-pine"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-xs text-ash">
            确认新密码
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-white p-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-pine"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-pine py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:shadow-[0_4px_16px_rgba(91,117,83,0.28)] disabled:cursor-not-allowed disabled:bg-card-border disabled:text-ash"
        >
          {isSubmitting ? '提交中…' : '重置密码'}
        </button>
      </form>
    </AuthCard>
  );
}
