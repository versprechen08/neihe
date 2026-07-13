import { NavLink } from 'react-router-dom';
import { NAV_TABS } from './navTabs';

export function TopNav() {
  return (
    <header className="hidden border-b border-gold/20 bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        <span className="font-serif text-2xl text-ink">内核 NèiHé</span>
        <nav className="flex gap-10">
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
        </nav>
      </div>
    </header>
  );
}
