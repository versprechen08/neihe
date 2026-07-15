export interface NavTab {
  to: string;
  label: string;
  requiresAuth?: boolean;
}

export const NAV_TABS: NavTab[] = [
  { to: '/today', label: '今日' },
  { to: '/journal', label: '手记', requiresAuth: true },
  { to: '/breathe', label: '呼吸' },
  { to: '/journey', label: '旅程' },
];
