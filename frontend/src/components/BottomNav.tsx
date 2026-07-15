import { NavLink } from 'react-router-dom';
import { NAV_TABS } from './navTabs';

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 flex border-t border-gold/30 bg-white lg:hidden">
      {NAV_TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex-1 border-t-2 py-3 text-center text-sm transition-colors duration-300 ease-out ${
              isActive ? 'border-gold font-medium text-pine' : 'border-transparent text-ash'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}
