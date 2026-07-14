import { ExecutionContext, INestApplication, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { Mood } from './journal-entry.entity';

describe('JournalController (HTTP)', () => {
	let app: INestApplication;
	const journalService = {
		create: jest.fn(),
		findAll: jest.fn(),
	};
	const currentUser = { id: 'user-1', email: 'seeker@neihe.app' };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [JournalController],
			providers: [{ provide: JournalService, useValue: journalService }],
		})
			.overrideGuard(AuthGuard('jwt'))
			.useValue({
				canActivate: (context: ExecutionContext) => {
					context.switchToHttp().getRequest().user = currentUser;
					return true;
				},
			})
			.compile();

		app = module.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
		);
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('POST /journal', () => {
		it('creates an entry for the authenticated user and returns 201', async () => {
			journalService.create.mockResolvedValue({ id: 'entry-1', mood: Mood.CALM });

			const response = await request(app.getHttpServer())
				.post('/journal')
				.send({ mood: 'calm', content: 'A quiet afternoon.', cardId: '123e4567-e89b-12d3-a456-426614174000' });

			expect(response.status).toBe(201);
			expect(response.body).toEqual({ id: 'entry-1', mood: 'calm' });
			expect(journalService.create).toHaveBeenCalledWith('user-1', {
				mood: 'calm',
				content: 'A quiet afternoon.',
				cardId: '123e4567-e89b-12d3-a456-426614174000',
			});
		});

		it('returns 400 for an invalid mood', async () => {
			const response = await request(app.getHttpServer())
				.post('/journal')
				.send({ mood: 'ecstatic', content: 'Not a real mood.' });

			expect(response.status).toBe(400);
			expect(journalService.create).not.toHaveBeenCalled();
		});

		it('returns 400 when content is missing', async () => {
			const response = await request(app.getHttpServer())
				.post('/journal')
				.send({ mood: 'calm' });

			expect(response.status).toBe(400);
			expect(journalService.create).not.toHaveBeenCalled();
		});
	});

	describe('GET /journal', () => {
		it("returns the authenticated user's paginated entries", async () => {
			journalService.findAll.mockResolvedValue({ data: [], total: 0 });

			const response = await request(app.getHttpServer())
				.get('/journal')
				.query({ page: '2', limit: '10', mood: 'calm' });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ data: [], total: 0 });
			expect(journalService.findAll).toHaveBeenCalledWith(
				'user-1',
				expect.objectContaining({ page: 2, limit: 10, mood: 'calm' }),
			);
		});

		it('applies default pagination when no query params are given', async () => {
			journalService.findAll.mockResolvedValue({ data: [], total: 0 });

			await request(app.getHttpServer()).get('/journal');

			expect(journalService.findAll).toHaveBeenCalledWith(
				'user-1',
				expect.objectContaining({ page: 1, limit: 20 }),
			);
		});
	});
});
