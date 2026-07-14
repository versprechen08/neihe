// Generates frontend/src/services/seed-cards.ts and
// backend/src/database/seed-cards.data.ts from the single source of truth
// at content/philosophy-cards.json, so the two apps never drift apart.
//
// Usage: node scripts/sync-seed-cards.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');

const cards = JSON.parse(
	readFileSync(join(repoRoot, 'content/philosophy-cards.json'), 'utf-8'),
);

const SCHOOL_ENUM_KEY = { confucian: 'CONFUCIAN', daoist: 'DAOIST', buddhist: 'BUDDHIST' };
const MOOD_ENUM_KEY = { turbulent: 'TURBULENT', calm: 'CALM', any: 'ANY' };

// unit: the indent string for one level (either '  ' or '\t')
function renderCard(card, unit, levels) {
	const pad = unit.repeat(levels);
	const fieldPad = unit.repeat(levels + 1);
	const themes = card.themes.map((t) => JSON.stringify(t)).join(', ');
	return [
		`${pad}{`,
		`${fieldPad}school: School.${SCHOOL_ENUM_KEY[card.school]},`,
		`${fieldPad}source: ${JSON.stringify(card.source)},`,
		`${fieldPad}originalText: ${JSON.stringify(card.originalText)},`,
		`${fieldPad}translation: ${JSON.stringify(card.translation)},`,
		`${fieldPad}reflection: ${JSON.stringify(card.reflection)},`,
		`${fieldPad}themes: [${themes}],`,
		`${fieldPad}moodFit: MoodFit.${MOOD_ENUM_KEY[card.moodFit]},`,
		`${pad}},`,
	].join('\n');
}

function renderArray(unit, levels) {
	return cards.map((c) => renderCard(c, unit, levels)).join('\n');
}

const frontendContent = `// ============================================================
// 内核 NèiHé — Seed Data: Philosophy Cards
//
// AUTO-GENERATED — do not edit directly.
// Source of truth: content/philosophy-cards.json
// Regenerate with: node scripts/sync-seed-cards.mjs
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
${renderArray('  ', 1)}
];
`;

const backendContent = `// ============================================================
// 内核 NèiHé — Seed Data: Philosophy Cards
//
// AUTO-GENERATED — do not edit directly.
// Source of truth: content/philosophy-cards.json
// Regenerate with: node scripts/sync-seed-cards.mjs
//
// Mirrors frontend/src/services/seed-cards.ts. Kept as a separate backend
// copy since this repo has no shared package between the two apps yet —
// see NH-6 tech notes.
// ============================================================

import { MoodFit, School } from '../modules/cards/philosophy-card.entity';

export interface SeedCard {
\tschool: School;
\tsource: string;
\toriginalText: string;
\ttranslation: string;
\treflection: string;
\tthemes: string[];
\tmoodFit: MoodFit;
}

export const SEED_CARDS: SeedCard[] = [
${renderArray('\t', 1)}
];
`;

writeFileSync(join(repoRoot, 'frontend/src/services/seed-cards.ts'), frontendContent, 'utf-8');
writeFileSync(join(repoRoot, 'backend/src/database/seed-cards.data.ts'), backendContent, 'utf-8');

console.log(`Synced ${cards.length} cards to frontend/src/services/seed-cards.ts and backend/src/database/seed-cards.data.ts`);
