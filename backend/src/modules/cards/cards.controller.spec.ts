import { ExecutionContext, INestApplication } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

describe('CardsController (HTTP)', () => {
	let app: INestApplication;
	const cardsService = {
		getToday: jest.fn(),
		getRandom: jest.fn(),
		toggleFavorite: jest.fn(),
	};
	const currentUser = { id: 'user-1', email: 'seeker@neihe.app' };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CardsController],
			providers: [{ provide: CardsService, useValue: cardsService }],
		})
			.overrideGuard(AuthGuard('jwt'))
			.useValue({
				// Simulates a valid JWT: attaches the user Passport would have resolved,
				// so we can assert the controller reads it via @CurrentUser() without
				// re-testing Passport's own token verification.
				canActivate: (context: ExecutionContext) => {
					context.switchToHttp().getRequest().user = currentUser;
					return true;
				},
			})
			.compile();

		app = module.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await app.close();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('GET /cards/today returns the daily card', async () => {
		cardsService.getToday.mockResolvedValue({ id: 'card-1' });

		const response = await request(app.getHttpServer()).get('/cards/today');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ id: 'card-1' });
	});

	it('GET /cards/random returns a random card', async () => {
		cardsService.getRandom.mockResolvedValue({ id: 'card-2' });

		const response = await request(app.getHttpServer()).get('/cards/random');

		expect(response.status).toBe(200);
		expect(response.body).toEqual({ id: 'card-2' });
	});

	it('POST /cards/:id/favorite toggles the favorite for the authenticated user', async () => {
		cardsService.toggleFavorite.mockResolvedValue({ favorited: true });

		const response = await request(app.getHttpServer()).post('/cards/card-1/favorite');

		expect(response.status).toBe(201);
		expect(response.body).toEqual({ favorited: true });
		expect(cardsService.toggleFavorite).toHaveBeenCalledWith('user-1', 'card-1');
	});
});
