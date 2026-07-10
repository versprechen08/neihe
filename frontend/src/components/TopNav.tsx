import { NavLink } from 'react-router-dom';
import { NAV_TABS } from './navTabs';

export function TopNav() {
  return (
    <header className="hidden border-b border-card-border bg-white lg:block">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4">
        <span className="font-serif text-xl text-ink">内核 NèiHé</span>
        <nav className="flex gap-8">
          {NAV_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? 'font-medium text-pine' : 'text-ash hover:text-ink'}`
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
