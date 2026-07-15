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
    <aside className="flex flex-col gap-6 lg:gap-8">
      <section className="rounded-2xl border border-gold/35 border-t-4 border-t-gold bg-white p-6 lg:p-8">
        <h2 className="text-sm font-medium text-ink lg:text-base">三家智慧</h2>
        <ul className="mt-4 flex flex-col gap-3 lg:mt-6 lg:gap-5">
          {SCHOOL_ORDER.map((school) => (
            <li key={school} className="flex items-center gap-3">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full lg:h-3 lg:w-3 ${SCHOOL_BADGE_CLASS[school]}`}
              />
              <div>
                <p className="text-sm text-ink lg:text-base">{SCHOOL_META[school].label}</p>
                <p className="text-xs text-ash lg:text-sm">{SCHOOL_BLURBS[school]}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gold/35 border-t-4 border-t-gold bg-white p-6 lg:p-8">
        <h2 className="text-sm font-medium text-ink lg:text-base">更多功能</h2>
        <ul className="mt-4 flex flex-col gap-1 lg:mt-6">
          {UPCOMING_FEATURES.map((feature) => (
            <li key={feature.to}>
              <Link
                to={feature.to}
                className="block rounded-lg border-l-2 border-transparent p-2 transition-all duration-300 ease-out hover:border-l-gold hover:bg-gold/5 lg:p-3"
              >
                <p className="text-sm text-ink lg:text-base">{feature.label}</p>
                <p className="text-xs text-ash lg:text-sm">{feature.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
