import { Link } from 'react-router-dom';
import { School } from '../types';
import { SCHOOL_META } from '../types';
import { SCHOOL_BADGE_CLASS } from '../lib/schoolStyles';

const SCHOOL_ORDER: School[] = [School.CONFUCIAN, School.DAOIST, School.BUDDHIST];

const SCHOOL_BLURBS: Record<School, string> = {
  [School.CONFUCIAN]: '入世 · 自省 · 修身齐家',
  [School.DAOIST]: '无为 · 自然 · 顺势而为',
  [School.BUDDHIST]: '观照 · 放下 · 当下即是',
};

interface UpcomingFeature {
  to: string;
  label: string;
  description: string;
}

const UPCOMING_FEATURES: UpcomingFeature[] = [
  { to: '/journal', label: '手记', description: '记录你的情绪与感悟' },
  { to: '/breathe', label: '呼吸', description: '跟随节奏，安顿此刻' },
  { to: '/journey', label: '旅程', description: '回看你的自我关照轨迹' },
];

export function TodaySidePanel() {
  return (
    <aside className="flex flex-col gap-6">
      <section className="rounded-2xl border border-card-border bg-white p-6">
        <h2 className="text-sm font-medium text-ink">三家智慧</h2>
        <ul className="mt-4 flex flex-col gap-3">
          {SCHOOL_ORDER.map((school) => (
            <li key={school} className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${SCHOOL_BADGE_CLASS[school]}`} />
              <div>
                <p className="text-sm text-ink">{SCHOOL_META[school].label}</p>
                <p className="text-xs text-ash">{SCHOOL_BLURBS[school]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-card-border bg-white p-6">
        <h2 className="text-sm font-medium text-ink">更多功能</h2>
        <ul className="mt-4 flex flex-col gap-1">
          {UPCOMING_FEATURES.map((feature) => (
            <li key={feature.to}>
              <Link to={feature.to} className="block rounded-lg p-2 transition-colors hover:bg-paper">
                <p className="text-sm text-ink">{feature.label}</p>
                <p className="text-xs text-ash">{feature.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
