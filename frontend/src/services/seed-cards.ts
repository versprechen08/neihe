// ============================================================
// 内核 NèiHé — Seed Data: Philosophy Cards (Batch 1)
//
// 筛选标准：
//   ✅ 有穿透力 — 不是"正确的废话"
//   ✅ 有当代性 — 指向现代人真实在经历的困境
//   ✅ 有行动性 — 配套反思能引导从"读到"→"想到"→"做到"
//   ✅ 非说教   — 更像朋友分享，不居高临下
//   ❌ 已排除   — 性别歧视、等级压迫、愚忠愚孝、消极放弃
//   ❌ 已排除   — 被"鸡汤文化"过度消费的语句
// ============================================================

import { School, MoodFit } from '../types';

export interface SeedCard {
  school: School;
  source: string;
  originalText: string;
  translation: string;
  reflection: string;
  themes: string[];
  moodFit: MoodFit;
}

export const SEED_CARDS: SeedCard[] = [
  // ════════════ 儒 · Confucian ════════════
  {
    school: School.CONFUCIAN,
    source: '《论语·卫灵公》',
    originalText: '君子求诸己，小人求诸人。',
    translation:
      'The grounded person looks within; the unsteady person looks to others.',
    reflection:
      '今天有什么事情，你试图从外部寻找答案，但其实答案在你自己身上？',
    themes: ['自我认同', '独立'],
    moodFit: MoodFit.ANY,
  },
  {
    school: School.CONFUCIAN,
    source: '《孟子·公孙丑上》',
    originalText: '自反而缩，虽千万人，吾往矣。',
    translation:
      'If on self-examination I find I am right, I will go forward against thousands.',
    reflection:
      '有没有一件你确信是对的、但因为害怕他人的看法而迟迟没做的事？',
    themes: ['勇气', '自我认同'],
    moodFit: MoodFit.CALM,
  },
  {
    school: School.CONFUCIAN,
    source: '《孟子·尽心上》',
    originalText: '穷则独善其身，达则兼济天下。',
    translation:
      'In hardship, cultivate yourself; in prosperity, uplift the world.',
    reflection:
      '你现在处于"穷"还是"达"？此刻照顾好自己，是不是最重要的事？',
    themes: ['自我关怀', '边界'],
    moodFit: MoodFit.TURBULENT,
  },
  {
    school: School.CONFUCIAN,
    source: '《论语·里仁》',
    originalText: '见贤思齐焉，见不贤而内自省也。',
    translation:
      'When you see a worthy person, aspire to be like them; when you see an unworthy one, look inward.',
    reflection:
      '最近有没有一个人让你不舒服？那种不舒服里面，有没有你自己的影子？',
    themes: ['自省', '关系'],
    moodFit: MoodFit.CALM,
  },
  {
    school: School.CONFUCIAN,
    source: '《论语·子罕》',
    originalText: '逝者如斯夫，不舍昼夜。',
    translation:
      'Time flows on like this river, never pausing day or night.',
    reflection:
      '如果时间不会为任何人停留，此刻你最想用它做什么？',
    themes: ['无常', '当下'],
    moodFit: MoodFit.ANY,
  },
  {
    school: School.CONFUCIAN,
    source: '《传习录》',
    originalText: '知是行之始，行是知之成。',
    translation:
      'Knowing is the beginning of doing; doing is the completion of knowing.',
    reflection:
      '有没有一件你"知道该做"但迟迟没行动的事？是什么在阻碍你？',
    themes: ['行动', '自律'],
    moodFit: MoodFit.CALM,
  },

  // ════════════ 道 · Daoist ════════════
  {
    school: School.DAOIST,
    source: '《道德经·第三十三章》',
    originalText: '知人者智，自知者明。',
    translation:
      'To know others is intelligence; to know yourself is true wisdom.',
    reflection:
      '此刻，有没有一个关于自己的真相，你一直在回避？',
    themes: ['自知', '自我认同'],
    moodFit: MoodFit.CALM,
  },
  {
    school: School.DAOIST,
    source: '《道德经·第七十六章》',
    originalText: '人之生也柔弱，其死也坚强。',
    translation:
      'In life we are soft and flexible; in death we become stiff and rigid.',
    reflection:
      '你最近有没有在某件事上变得僵硬？能不能试着柔软一点？',
    themes: ['放下', '柔韧'],
    moodFit: MoodFit.TURBULENT,
  },
  {
    school: School.DAOIST,
    source: '《道德经·第八章》',
    originalText: '上善若水。水善利万物而不争。',
    translation:
      'The highest good is like water — it benefits all things and does not compete.',
    reflection:
      '你有没有发现，最让你安心的人，往往不是最强势的，而是最柔和的？',
    themes: ['不争', '关系'],
    moodFit: MoodFit.ANY,
  },
  {
    school: School.DAOIST,
    source: '《庄子·应帝王》',
    originalText: '至人之用心若镜，不将不迎，应而不藏。',
    translation:
      'The perfected mind is like a mirror — it does not chase, does not welcome, responds but does not hold.',
    reflection:
      '今天你的心是否像一面镜子，只是如实映照？还是在追逐或抗拒什么？',
    themes: ['觉察', '当下'],
    moodFit: MoodFit.ANY,
  },
  {
    school: School.DAOIST,
    source: '《庄子·逍遥游》',
    originalText: '至人无己，神人无功，圣人无名。',
    translation:
      'The ultimate person has no fixed self-image; the spiritual person claims no credit; the sage seeks no fame.',
    reflection:
      '你有没有被自己的"人设"困住？如果放下那个形象，你会是谁？',
    themes: ['自我认同', '放下'],
    moodFit: MoodFit.CALM,
  },
  {
    school: School.DAOIST,
    source: '《道德经·第二十二章》',
    originalText: '曲则全，枉则直，洼则盈。',
    translation:
      'To be bent is to become whole; to be crooked is to become straight; to be hollow is to be filled.',
    reflection:
      '你现在经历的弯路，有没有可能正在带你去一个直路到不了的地方？',
    themes: ['无常', '接纳'],
    moodFit: MoodFit.TURBULENT,
  },

  // ════════════ 佛 · Buddhist ════════════
  {
    school: School.BUDDHIST,
    source: '《心经》',
    originalText: '色不异空，空不异色。',
    translation:
      'Form is not different from emptiness; emptiness is not different from form.',
    reflection:
      '你现在紧紧抓住的某样东西，如果放下，会发生什么？',
    themes: ['放下', '无常'],
    moodFit: MoodFit.CALM,
  },
  {
    school: School.BUDDHIST,
    source: '《六祖坛经》',
    originalText: '不是风动，不是幡动，仁者心动。',
    translation:
      'It is not the wind that moves, not the flag — it is your mind that moves.',
    reflection:
      '最近有什么外在的事让你内心起了波澜？那个波澜本身在告诉你什么？',
    themes: ['觉察', '情绪'],
    moodFit: MoodFit.TURBULENT,
  },
  {
    school: School.BUDDHIST,
    source: '《金刚经》',
    originalText: '过去心不可得，现在心不可得，未来心不可得。',
    translation:
      'The past mind cannot be grasped, the present mind cannot be grasped, the future mind cannot be grasped.',
    reflection:
      '你是更多地活在对过去的回忆里，还是对未来的担忧里？此刻呢？',
    themes: ['当下', '焦虑'],
    moodFit: MoodFit.TURBULENT,
  },
  {
    school: School.BUDDHIST,
    source: '《华严经》',
    originalText: '不忘初心，方得始终。',
    translation:
      'Only by remembering your original intention can you complete the journey.',
    reflection:
      '你最初为什么出发？那个原因现在还在吗？',
    themes: ['初心', '方向'],
    moodFit: MoodFit.ANY,
  },
  {
    school: School.BUDDHIST,
    source: '《菜根谭》',
    originalText: '风来疏竹，风过而竹不留声；雁度寒潭，雁去而潭不留影。',
    translation:
      'Wind passes through bamboo and leaves no sound; a wild goose crosses a cold pond and leaves no reflection.',
    reflection:
      '你能不能让今天发生的事情穿过你，而不被它黏住？',
    themes: ['放下', '觉察'],
    moodFit: MoodFit.TURBULENT,
  },
];
