import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from './cards.service';
import { MoodFit, PhilosophyCard, School } from './philosophy-card.entity';
import { Favorite } from './favorite.entity';

describe('CardsService', () => {
	let service: CardsService;
	let cardRepo: jest.Mocked<Repository<PhilosophyCard>>;
	let favoriteRepo: jest.Mocked<Repository<Favorite>>;

	const buildCard = (overrides: Partial<PhilosophyCard> = {}): PhilosophyCard =>
		({
			id: 'card-1',
			school: School.CONFUCIAN,
			source: '《论语》',
			originalText: '学而时习之',
			translation: 'Learn and practise it often',
			reflection: 'What have you practised lately?',
			themes: ['growth'],
			moodFit: MoodFit.ANY,
			isActive: true,
			createdAt: new Date('2026-01-01'),
			favorites: [],
			...overrides,
		}) as PhilosophyCard;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CardsService,
				{
					provide: getRepositoryToken(PhilosophyCard),
					useValue: { find: jest.fn() },
				},
				{
					provide: getRepositoryToken(Favorite),
					useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn(), remove: jest.fn() },
				},
			],
		}).compile();

		service = module.get(CardsService);
		cardRepo = module.get(getRepositoryToken(PhilosophyCard));
		favoriteRepo = module.get(getRepositoryToken(Favorite));
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.restoreAllMocks();
	});

	describe('getToday', () => {
		it('only queries active cards, ordered for stable rotation', async () => {
			cardRepo.find.mockResolvedValue([buildCard()]);
			await service.getToday();

			expect(cardRepo.find).toHaveBeenCalledWith({
				where: { isActive: true },
				order: { createdAt: 'ASC' },
			});
		});

		it('picks the same card all day and rotates the next day (dayOfYear % totalActiveCards)', async () => {
			const cards = [buildCard({ id: 'card-a' }), buildCard({ id: 'card-b' }), buildCard({ id: 'card-c' })];
			cardRepo.find.mockResolvedValue(cards);

			// Constructed in local time (not UTC) so the day boundary matches the
			// test runner's own timezone, regardless of where CI executes.
			jest.useFakeTimers().setSystemTime(new Date(2026, 2, 10, 9, 0, 0));
			const morning = await service.getToday();

			jest.setSystemTime(new Date(2026, 2, 10, 21, 0, 0));
			const evening = await service.getToday();

			expect(evening.id).toBe(morning.id);

			jest.setSystemTime(new Date(2026, 2, 11, 9, 0, 0));
			const nextDay = await service.getToday();

			expect(nextDay.id).not.toBe(morning.id);
		});

		it('throws NotFoundException when there are no active cards', async () => {
			cardRepo.find.mockResolvedValue([]);

			await expect(service.getToday()).rejects.toBeInstanceOf(NotFoundException);
		});
	});

	describe('getRandom', () => {
		it("excludes today's card from the random pool", async () => {
			const todayCard = buildCard({ id: 'card-today' });
			const otherCard = buildCard({ id: 'card-other' });
			jest.spyOn(service, 'getToday').mockResolvedValue(todayCard);
			cardRepo.find.mockResolvedValue([todayCard, otherCard]);
			jest.spyOn(Math, 'random').mockReturnValue(0);

			const result = await service.getRandom();

			expect(result.id).toBe('card-other');
		});

		it("falls back to today's card when it is the only active card", async () => {
			const onlyCard = buildCard({ id: 'card-only' });
			jest.spyOn(service, 'getToday').mockResolvedValue(onlyCard);
			cardRepo.find.mockResolvedValue([onlyCard]);
			jest.spyOn(Math, 'random').mockReturnValue(0);

			const result = await service.getRandom();

			expect(result.id).toBe('card-only');
		});
	});

	describe('toggleFavorite', () => {
		it('creates a favorite when none exists', async () => {
			favoriteRepo.findOne.mockResolvedValue(null);
			const created = { id: 'fav-1', userId: 'user-1', cardId: 'card-1' } as Favorite;
			favoriteRepo.create.mockReturnValue(created);

			const result = await service.toggleFavorite('user-1', 'card-1');

			expect(favoriteRepo.create).toHaveBeenCalledWith({ userId: 'user-1', cardId: 'card-1' });
			expect(favoriteRepo.save).toHaveBeenCalledWith(created);
			expect(result).toEqual({ favorited: true });
		});

		it('removes the favorite when it already exists', async () => {
			const existing = { id: 'fav-1', userId: 'user-1', cardId: 'card-1' } as Favorite;
			favoriteRepo.findOne.mockResolvedValue(existing);

			const result = await service.toggleFavorite('user-1', 'card-1');

			expect(favoriteRepo.remove).toHaveBeenCalledWith(existing);
			expect(favoriteRepo.create).not.toHaveBeenCalled();
			expect(result).toEqual({ favorited: false });
		});
	});
});
