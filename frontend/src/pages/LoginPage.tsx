import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '../components/AuthCard';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { accessToken } = await authApi.login(email, password);
      login(accessToken);
      navigate('/today');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="欢迎回来" subtitle="登录内核，继续你的自我关照">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-xs text-ash">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-white p-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-pine"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs text-ash">
            密码
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-card-border bg-white p-3 text-sm text-ink outline-none transition-colors duration-300 focus:border-pine"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full rounded-full bg-pine py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:shadow-[0_4px_16px_rgba(91,117,83,0.28)] disabled:cursor-not-allowed disabled:bg-card-border disabled:text-ash"
        >
          {isSubmitting ? '登录中…' : '登录'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ash">
        还没有账号？
        <Link to="/register" className="ml-1 text-pine">
          注册
        </Link>
      </p>
    </AuthCard>
  );
}
