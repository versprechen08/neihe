import { NavLink } from 'react-router-dom';
import { NAV_TABS } from './navTabs';
import { useAuth } from '../context/AuthContext';

export function TopNav() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="hidden border-b border-gold/30 bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        <span className="font-serif text-2xl text-ink">内核 NèiHé</span>
        <nav className="flex items-center gap-10">
          {NAV_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `border-b-2 pb-1 text-base transition-all duration-300 ease-out ${
                  isActive
                    ? 'border-gold font-medium text-pine'
                    : 'border-transparent text-ash hover:border-gold/30 hover:text-ink'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={logout}
              className="text-sm text-ash transition-colors duration-300 hover:text-ink"
            >
              退出
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-full border border-pine px-4 py-1.5 text-sm text-pine transition-all duration-300 ease-out hover:bg-pine hover:text-white"
            >
              登录
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
