import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from '../../database/entities/user.entity';

describe('AuthService', () => {
	let service: AuthService;
	let userRepo: jest.Mocked<Repository<User>>;
	let jwtService: jest.Mocked<JwtService>;

	const buildUser = (overrides: Partial<User> = {}): User =>
		({
			id: 'user-1',
			email: 'seeker@neihe.app',
			nickname: 'Seeker',
			passwordHash: 'hashed-password',
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
			],
		}).compile();

		service = module.get(AuthService);
		userRepo = module.get(getRepositoryToken(User));
		jwtService = module.get(JwtService);
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
});
