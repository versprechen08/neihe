import { NavLink } from 'react-router-dom';
import { NAV_TABS } from './navTabs';

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex border-t border-card-border bg-white lg:hidden">
      {NAV_TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 py-3 text-center text-sm ${isActive ? 'font-medium text-pine' : 'text-ash'}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
