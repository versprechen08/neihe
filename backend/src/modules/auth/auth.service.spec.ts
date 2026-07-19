import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { EmailService } from './email.service';
import { User } from '../../database/entities/user.entity';

describe('AuthService', () => {
	let service: AuthService;
	let userRepo: jest.Mocked<Repository<User>>;
	let jwtService: jest.Mocked<JwtService>;
	let emailService: jest.Mocked<EmailService>;

	const buildUser = (overrides: Partial<User> = {}): User =>
		({
			id: 'user-1',
			email: 'seeker@neihe.app',
			nickname: 'Seeker',
			passwordHash: 'hashed-password',
			passwordResetTokenHash: null,
			passwordResetExpiresAt: null,
			createdAt: new Date(),
			updatedAt: new Date(),
			journalEntries: [],
			breathingSessions: [],
			favorites: [],
			...overrides,
		}) as User;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: getRepositoryToken(User),
					useValue: {
						findOne: jest.fn(),
						create: jest.fn(),
						save: jest.fn(),
					},
				},
				{
					provide: JwtService,
					useValue: {
						sign: jest.fn(),
					},
				},
				{
					provide: ConfigService,
					useValue: {
						get: jest.fn((_key: string, fallback?: unknown) => fallback),
					},
				},
				{
					provide: EmailService,
					useValue: {
						sendPasswordResetEmail: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get(AuthService);
		userRepo = module.get(getRepositoryToken(User));
		jwtService = module.get(JwtService);
		emailService = module.get(EmailService);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('register', () => {
		it('hashes the password, saves the user, and returns a JWT', async () => {
			userRepo.findOne.mockResolvedValue(null);
			const created = buildUser({ passwordHash: 'irrelevant-before-save' });
			userRepo.create.mockReturnValue(created);
			userRepo.save.mockResolvedValue(created);
			jwtService.sign.mockReturnValue('signed.jwt.token');
			const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('bcrypt-hash' as never);

			const result = await service.register({
				email: 'seeker@neihe.app',
				password: 'plain-password',
				nickname: 'Seeker',
			});

			expect(hashSpy).toHaveBeenCalledWith('plain-password', 10);
			expect(userRepo.create).toHaveBeenCalledWith({
				email: 'seeker@neihe.app',
				passwordHash: 'bcrypt-hash',
				nickname: 'Seeker',
			});
			expect(userRepo.save).toHaveBeenCalledWith(created);
			expect(jwtService.sign).toHaveBeenCalledWith({
				sub: created.id,
				email: created.email,
			});
			expect(result).toEqual({ accessToken: 'signed.jwt.token' });
		});

		it('throws a 409 ConflictException when the email is already registered', async () => {
			userRepo.findOne.mockResolvedValue(buildUser());

			await expect(
				service.register({ email: 'seeker@neihe.app', password: 'plain-password' }),
			).rejects.toBeInstanceOf(ConflictException);
			expect(userRepo.save).not.toHaveBeenCalled();
		});
	});

	describe('login', () => {
		it('returns a JWT when credentials are valid', async () => {
			const user = buildUser();
			userRepo.findOne.mockResolvedValue(user);
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
			jwtService.sign.mockReturnValue('signed.jwt.token');

			const result = await service.login({
				email: user.email,
				password: 'plain-password',
			});

			expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, email: user.email });
			expect(result).toEqual({ accessToken: 'signed.jwt.token' });
		});

		it('throws a 401 UnauthorizedException when the email is not registered', async () => {
			userRepo.findOne.mockResolvedValue(null);

			await expect(
				service.login({ email: 'unknown@neihe.app', password: 'plain-password' }),
			).rejects.toBeInstanceOf(UnauthorizedException);
		});

		it('throws a 401 UnauthorizedException when the password does not match', async () => {
			userRepo.findOne.mockResolvedValue(buildUser());
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

			await expect(
				service.login({ email: 'seeker@neihe.app', password: 'wrong-password' }),
			).rejects.toBeInstanceOf(UnauthorizedException);
		});
	});

	describe('forgotPassword', () => {
		it('stores a hashed token with an expiry and emails the raw token in the reset link', async () => {
			const user = buildUser();
			userRepo.findOne.mockResolvedValue(user);
			userRepo.save.mockImplementation(async (u) => u as User);

			await service.forgotPassword(user.email);

			expect(userRepo.save).toHaveBeenCalledWith(
				expect.objectContaining({
					passwordResetTokenHash: expect.any(String),
					passwordResetExpiresAt: expect.any(Date),
				}),
			);
			expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
			const [to, resetUrl] = emailService.sendPasswordResetEmail.mock.calls[0];
			expect(to).toBe(user.email);
			expect(resetUrl).toContain('/reset-password?token=');

			// The emailed token must hash to what was stored — otherwise the
			// link we send would never actually work.
			const savedUser = userRepo.save.mock.calls[0][0] as User;
			const rawToken = new URL(resetUrl).searchParams.get('token')!;
			expect(createHash('sha256').update(rawToken).digest('hex')).toBe(
				savedUser.passwordResetTokenHash,
			);
		});

		it('does nothing and does not email when the address is not registered', async () => {
			userRepo.findOne.mockResolvedValue(null);

			await service.forgotPassword('unknown@neihe.app');

			expect(userRepo.save).not.toHaveBeenCalled();
			expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
		});
	});

	describe('resetPassword', () => {
		it('updates the password and clears the reset token when the token is valid', async () => {
			const rawToken = 'a-valid-raw-token';
			const tokenHash = createHash('sha256').update(rawToken).digest('hex');
			const user = buildUser({
				passwordResetTokenHash: tokenHash,
				passwordResetExpiresAt: new Date(Date.now() + 60_000),
			});
			userRepo.findOne.mockResolvedValue(user);
			userRepo.save.mockImplementation(async (u) => u as User);
			const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('new-bcrypt-hash' as never);

			await service.resetPassword(rawToken, 'new-password123');

			expect(hashSpy).toHaveBeenCalledWith('new-password123', 10);
			expect(userRepo.save).toHaveBeenCalledWith(
				expect.objectContaining({
					passwordHash: 'new-bcrypt-hash',
					passwordResetTokenHash: null,
					passwordResetExpiresAt: null,
				}),
			);
		});

		it('throws a 400 when no user matches the token', async () => {
			userRepo.findOne.mockResolvedValue(null);

			await expect(service.resetPassword('unknown-token', 'new-password123')).rejects.toBeInstanceOf(
				BadRequestException,
			);
		});

		it('throws a 400 when the token has expired', async () => {
			const rawToken = 'an-expired-token';
			const tokenHash = createHash('sha256').update(rawToken).digest('hex');
			userRepo.findOne.mockResolvedValue(
				buildUser({
					passwordResetTokenHash: tokenHash,
					passwordResetExpiresAt: new Date(Date.now() - 1_000),
				}),
			);

			await expect(service.resetPassword(rawToken, 'new-password123')).rejects.toBeInstanceOf(
				BadRequestException,
			);
			expect(userRepo.save).not.toHaveBeenCalled();
		});
	});
});
