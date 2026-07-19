import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController (HTTP)', () => {
	let app: INestApplication;
	const authService = {
		register: jest.fn(),
		login: jest.fn(),
		forgotPassword: jest.fn(),
		resetPassword: jest.fn(),
	};

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [{ provide: AuthService, useValue: authService }],
		}).compile();

		app = module.createNestApplication();
		// Mirrors the global pipe configured in main.ts so validation behaviour matches production.
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

	describe('POST /auth/register', () => {
		it('returns 201 with the access token for a valid payload', async () => {
			authService.register.mockResolvedValue({ accessToken: 'signed.jwt.token' });

			const response = await request(app.getHttpServer())
				.post('/auth/register')
				.send({ email: 'seeker@neihe.app', password: 'plain-password', nickname: 'Seeker' });

			expect(response.status).toBe(201);
			expect(response.body).toEqual({ accessToken: 'signed.jwt.token' });
			expect(authService.register).toHaveBeenCalledWith({
				email: 'seeker@neihe.app',
				password: 'plain-password',
				nickname: 'Seeker',
			});
		});

		it('returns 400 when the email is invalid', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/register')
				.send({ email: 'not-an-email', password: 'plain-password' });

			expect(response.status).toBe(400);
			expect(authService.register).not.toHaveBeenCalled();
		});

		it('returns 400 when the password is shorter than 6 characters', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/register')
				.send({ email: 'seeker@neihe.app', password: 'short' });

			expect(response.status).toBe(400);
			expect(authService.register).not.toHaveBeenCalled();
		});
	});

	describe('POST /auth/login', () => {
		it('returns 200 with the access token for a valid payload', async () => {
			authService.login.mockResolvedValue({ accessToken: 'signed.jwt.token' });

			const response = await request(app.getHttpServer())
				.post('/auth/login')
				.send({ email: 'seeker@neihe.app', password: 'plain-password' });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ accessToken: 'signed.jwt.token' });
		});

		it('returns 400 when the password field is missing', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/login')
				.send({ email: 'seeker@neihe.app' });

			expect(response.status).toBe(400);
			expect(authService.login).not.toHaveBeenCalled();
		});
	});

	describe('POST /auth/forgot-password', () => {
		it('returns 200 with a generic message and delegates to the service', async () => {
			authService.forgotPassword.mockResolvedValue(undefined);

			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: 'seeker@neihe.app' });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ message: '如果该邮箱已注册，重置链接已发送到邮箱。' });
			expect(authService.forgotPassword).toHaveBeenCalledWith('seeker@neihe.app');
		});

		it('returns 400 for an invalid email', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/forgot-password')
				.send({ email: 'not-an-email' });

			expect(response.status).toBe(400);
			expect(authService.forgotPassword).not.toHaveBeenCalled();
		});
	});

	describe('POST /auth/reset-password', () => {
		it('returns 200 with a confirmation message and delegates to the service', async () => {
			authService.resetPassword.mockResolvedValue(undefined);

			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send({ token: 'raw-token', newPassword: 'new-password123' });

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ message: '密码已重置，请使用新密码登录。' });
			expect(authService.resetPassword).toHaveBeenCalledWith('raw-token', 'new-password123');
		});

		it('returns 400 when the new password is shorter than 6 characters', async () => {
			const response = await request(app.getHttpServer())
				.post('/auth/reset-password')
				.send({ token: 'raw-token', newPassword: 'short' });

			expect(response.status).toBe(400);
			expect(authService.resetPassword).not.toHaveBeenCalled();
		});
	});
});
