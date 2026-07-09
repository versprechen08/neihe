import { Repository } from 'typeorm';
import { upsertCards } from './seed';
import { MoodFit, PhilosophyCard, School } from '../modules/cards/philosophy-card.entity';
import { SeedCard } from './seed-cards.data';

describe('upsertCards', () => {
	let cardRepo: jest.Mocked<Repository<PhilosophyCard>>;

	const seedCard: SeedCard = {
		school: School.CONFUCIAN,
		source: '《论语·卫灵公》',
		originalText: '君子求诸己，小人求诸人。',
		translation: 'The grounded person looks within.',
		reflection: 'What are you looking outward for?',
		themes: ['self'],
		moodFit: MoodFit.ANY,
	};

	beforeEach(() => {
		cardRepo = {
			findOne: jest.fn(),
			create: jest.fn(),
			save: jest.fn(),
			update: jest.fn(),
		} as unknown as jest.Mocked<Repository<PhilosophyCard>>;
	});

	it('inserts a new card when no row matches its originalText', async () => {
		cardRepo.findOne.mockResolvedValue(null);
		const created = { id: 'card-1', ...seedCard } as PhilosophyCard;
		cardRepo.create.mockReturnValue(created);

		await upsertCards(cardRepo, [seedCard]);

		expect(cardRepo.findOne).toHaveBeenCalledWith({
			where: { originalText: seedCard.originalText },
		});
		expect(cardRepo.create).toHaveBeenCalledWith(seedCard);
		expect(cardRepo.save).toHaveBeenCalledWith(created);
		expect(cardRepo.update).not.toHaveBeenCalled();
	});

	it('updates the existing row instead of inserting a duplicate (idempotent re-run)', async () => {
		const existing = { id: 'card-1', ...seedCard } as PhilosophyCard;
		cardRepo.findOne.mockResolvedValue(existing);

		await upsertCards(cardRepo, [seedCard]);

		expect(cardRepo.update).toHaveBeenCalledWith(existing.id, seedCard);
		expect(cardRepo.create).not.toHaveBeenCalled();
		expect(cardRepo.save).not.toHaveBeenCalled();
	});

	it('processes every card in the batch', async () => {
		cardRepo.findOne.mockResolvedValue(null);
		cardRepo.create.mockImplementation((data) => data as PhilosophyCard);

		const secondCard: SeedCard = { ...seedCard, originalText: '自反而缩，虽千万人，吾往矣。' };
		await upsertCards(cardRepo, [seedCard, secondCard]);

		expect(cardRepo.findOne).toHaveBeenCalledTimes(2);
		expect(cardRepo.save).toHaveBeenCalledTimes(2);
	});
});
