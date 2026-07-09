import 'dotenv/config';
import { DataSource, Repository } from 'typeorm';
import { PhilosophyCard } from '../modules/cards/philosophy-card.entity';
import { Favorite } from '../modules/cards/favorite.entity';
import { JournalEntry } from '../modules/journal/journal-entry.entity';
import { BreathingSession } from '../modules/breathing/breathing-session.entity';
import { User } from './entities/user.entity';
import { SEED_CARDS, SeedCard } from './seed-cards.data';

// Upsert by originalText so re-running the seed never creates duplicate rows.
export async function upsertCards(
	cardRepo: Repository<PhilosophyCard>,
	cards: SeedCard[],
): Promise<void> {
	for (const card of cards) {
		const existing = await cardRepo.findOne({ where: { originalText: card.originalText } });
		if (existing) {
			await cardRepo.update(existing.id, card);
		} else {
			await cardRepo.save(cardRepo.create(card));
		}
	}
}

async function seed(): Promise<void> {
	const dataSource = new DataSource({
		type: 'postgres',
		host: process.env.DB_HOST || 'localhost',
		port: Number(process.env.DB_PORT) || 5432,
		username: process.env.DB_USERNAME || 'neihe',
		password: process.env.DB_PASSWORD || 'neihe',
		database: process.env.DB_DATABASE || 'neihe',
		entities: [User, PhilosophyCard, JournalEntry, BreathingSession, Favorite],
		synchronize: true,
	});

	await dataSource.initialize();
	try {
		await upsertCards(dataSource.getRepository(PhilosophyCard), SEED_CARDS);
		console.log(`Seeded ${SEED_CARDS.length} philosophy cards.`);
	} finally {
		await dataSource.destroy();
	}
}

if (require.main === module) {
	seed().catch((error) => {
		console.error('Seed failed:', error);
		process.exitCode = 1;
	});
}
