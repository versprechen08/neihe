import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../../database/entities/user.entity';

describe('JwtStrategy', () => {
	let strategy: JwtStrategy;
	let userRepo: jest.Mocked<Repository<User>>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtStrategy,
				{
					provide: ConfigService,
					useValue: { get: jest.fn().mockReturnValue('test-secret') },
				},
				{
					provide: getRepositoryToken(User),
					useValue: { findOne: jest.fn() },
				},
			],
		}).compile();

		strategy = module.get(JwtStrategy);
		userRepo = module.get(getRepositoryToken(User));
	});

	it('returns the user id and email when the user still exists', async () => {
		userRepo.findOne.mockResolvedValue({
			id: 'user-1',
			email: 'seeker@neihe.app',
		} as User);

		const result = await strategy.validate({ sub: 'user-1', email: 'seeker@neihe.app' });

		expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 'user-1' } });
		expect(result).toEqual({ id: 'user-1', email: 'seeker@neihe.app' });
	});

	it('throws UnauthorizedException when the user no longer exists', async () => {
		userRepo.findOne.mockResolvedValue(null);

		await expect(
			strategy.validate({ sub: 'deleted-user', email: 'gone@neihe.app' }),
		).rejects.toBeInstanceOf(UnauthorizedException);
	});
});
