import { School } from '../types';

export const SCHOOL_BADGE_CLASS: Record<School, string> = {
  [School.CONFUCIAN]: 'bg-confucian',
  [School.DAOIST]: 'bg-daoist',
  [School.BUDDHIST]: 'bg-buddhist',
};

export const SCHOOL_TOP_BORDER_CLASS: Record<School, string> = {
  [School.CONFUCIAN]: 'border-t-confucian',
  [School.DAOIST]: 'border-t-daoist',
  [School.BUDDHIST]: 'border-t-buddhist',
};
