import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { authApi } from '../services/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Deliberately doesn't distinguish "email not found" from "email sent" —
  // the backend returns 200 either way so this can't be used to probe which
  // addresses are registered. A genuine network/server error still shows an
  // error rather than falsely claiming success.
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthCard title="邮件已发送" subtitle="如果该邮箱已注册，重置链接已经发到邮箱里了">
        <p className="mt-6 text-center text-xs text-ash">
          链接 1 小时内有效。没收到？检查一下垃圾邮件文件夹。
        </p>
        <p className="mt-6 text-center text-xs text-ash">
          想起密码了？
          <Link to="/login" className="ml-1 text-pine">
            返回登录
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="找回密码" subtitle="输入注册邮箱，我们会发一个重置链接给你">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-xs text-ash">
            邮箱
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-white p-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-pine"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-pine py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:shadow-[0_4px_16px_rgba(91,117,83,0.28)] disabled:cursor-not-allowed disabled:bg-card-border disabled:text-ash"
        >
          {isSubmitting ? '发送中…' : '发送重置链接'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ash">
        想起密码了？
        <Link to="/login" className="ml-1 text-pine">
          返回登录
        </Link>
      </p>
    </AuthCard>
  );
}
