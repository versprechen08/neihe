import { School } from '../types';

export const SCHOOL_BADGE_CLASS: Record<School, string> = {
  [School.CONFUCIAN]: 'bg-confucian',
  [School.DAOIST]: 'bg-daoist',
  [School.BUDDHIST]: 'bg-buddhist',
};
