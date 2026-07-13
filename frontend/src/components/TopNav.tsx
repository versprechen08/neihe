import { NavLink } from 'react-router-dom';
import { NAV_TABS } from './navTabs';

export function TopNav() {
  return (
    <header className="hidden border-b border-card-border bg-white lg:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-5">
        <span className="font-serif text-2xl text-ink">内核 NèiHé</span>
        <nav className="flex gap-10">
          {NAV_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `text-base transition-colors ${isActive ? 'font-medium text-pine' : 'text-ash hover:text-ink'}`
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
