import { NavLink } from 'react-router-dom';

interface Tab {
  to: string;
  label: string;
}

const TABS: Tab[] = [
  { to: '/today', label: '今日' },
  { to: '/journal', label: '手记' },
  { to: '/breathe', label: '呼吸' },
  { to: '/journey', label: '旅程' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 flex w-full max-w-lg -translate-x-1/2 border-t border-card-border bg-white">
      {TABS.map((tab) => (
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
