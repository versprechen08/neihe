import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalService } from './journal.service';
import { JournalEntry, Mood } from './journal-entry.entity';
import { QueryJournalDto } from './dto/query-journal.dto';

describe('JournalService', () => {
	let service: JournalService;
	let journalRepo: jest.Mocked<Repository<JournalEntry>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JournalService,
				{
					provide: getRepositoryToken(JournalEntry),
					useValue: {
						create: jest.fn(),
						save: jest.fn(),
						findAndCount: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get(JournalService);
		journalRepo = module.get(getRepositoryToken(JournalEntry));
	});

	describe('create', () => {
		it('saves an entry with the given mood, content, and cardId', async () => {
			const created = { id: 'entry-1' } as JournalEntry;
			journalRepo.create.mockReturnValue(created);
			journalRepo.save.mockResolvedValue(created);

			const result = await service.create('user-1', {
				mood: Mood.CALM,
				content: 'A quiet day.',
				cardId: 'card-1',
			});

			expect(journalRepo.create).toHaveBeenCalledWith({
				userId: 'user-1',
				mood: Mood.CALM,
				content: 'A quiet day.',
				cardId: 'card-1',
			});
			expect(journalRepo.save).toHaveBeenCalledWith(created);
			expect(result).toBe(created);
		});

		it('defaults cardId to null when not provided', async () => {
			const created = { id: 'entry-2' } as JournalEntry;
			journalRepo.create.mockReturnValue(created);
			journalRepo.save.mockResolvedValue(created);

			await service.create('user-1', { mood: Mood.TURBULENT, content: 'Rough day.' });

			expect(journalRepo.create).toHaveBeenCalledWith({
				userId: 'user-1',
				mood: Mood.TURBULENT,
				content: 'Rough day.',
				cardId: null,
			});
		});
	});

	describe('findAll', () => {
		it('paginates with the default page/limit, newest first, no mood filter', async () => {
			journalRepo.findAndCount.mockResolvedValue([[], 0]);
			const query: QueryJournalDto = { page: 1, limit: 20 };

			const result = await service.findAll('user-1', query);

			expect(journalRepo.findAndCount).toHaveBeenCalledWith({
				where: { userId: 'user-1' },
				relations: { card: true },
				order: { createdAt: 'DESC' },
				skip: 0,
				take: 20,
			});
			expect(result).toEqual({ data: [], total: 0 });
		});

		it('applies the mood filter when provided', async () => {
			journalRepo.findAndCount.mockResolvedValue([[], 0]);
			const query: QueryJournalDto = { page: 1, limit: 20, mood: Mood.LUMINOUS };

			await service.findAll('user-1', query);

			expect(journalRepo.findAndCount).toHaveBeenCalledWith(
				expect.objectContaining({ where: { userId: 'user-1', mood: Mood.LUMINOUS } }),
			);
		});

		it('computes skip from page and limit', async () => {
			journalRepo.findAndCount.mockResolvedValue([[], 0]);
			const query: QueryJournalDto = { page: 3, limit: 10 };

			await service.findAll('user-1', query);

			expect(journalRepo.findAndCount).toHaveBeenCalledWith(
				expect.objectContaining({ skip: 20, take: 10 }),
			);
		});
	});
});
