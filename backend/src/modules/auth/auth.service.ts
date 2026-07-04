import {
	Injectable,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly jwtService: JwtService,
	) {}

	async register(dto: RegisterDto) {
		const existing = await this.userRepo.findOne({
			where: { email: dto.email },
		});
		if (existing) {
			throw new ConflictException('Email already registered');
		}

		const passwordHash = await bcrypt.hash(dto.password, 10);

		const user = this.userRepo.create({
			email: dto.email,
			passwordHash,
			nickname: dto.nickname,
		});
		await this.userRepo.save(user);

		const token = this.signToken(user);
		return { accessToken: token };
	}

	async login(dto: LoginDto) {
		const user = await this.userRepo.findOne({
			where: { email: dto.email },
		});
		if (!user) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
		if (!passwordMatch) {
			throw new UnauthorizedException('Invalid email or password');
		}

		const token = this.signToken(user);
		return { accessToken: token };
	}

	private signToken(user: User): string {
		const payload = { sub: user.id, email: user.email };
		return this.jwtService.sign(payload);
	}
}
