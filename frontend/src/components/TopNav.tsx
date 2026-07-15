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
          {NAV_TABS.map((tab) => {
            const showAuthHint = tab.requiresAuth && !isAuthenticated;
            return (
              <div key={tab.to} className={showAuthHint ? 'group relative' : undefined}>
                <NavLink
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

                {showAuthHint && (
                  <div
                    role="tooltip"
                    className="invisible absolute left-1/2 top-full z-10 mt-3 w-52 -translate-x-1/2 rounded-xl border border-gold/35 border-t-4 border-t-gold bg-white p-4 opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:visible group-hover:opacity-100"
                  >
                    <p className="text-xs leading-relaxed text-ash">
                      登录后即可记录和查看你的{tab.label}
                    </p>
                    <NavLink
                      to="/login"
                      className="mt-3 block rounded-full bg-pine py-2 text-center text-xs font-medium text-white transition-all duration-300 ease-out hover:shadow-[0_4px_16px_rgba(91,117,83,0.28)]"
                    >
                      去登录
                    </NavLink>
                  </div>
                )}
              </div>
            );
          })}

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
