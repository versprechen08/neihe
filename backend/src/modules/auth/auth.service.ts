import {
	BadRequestException,
	Injectable,
	ConflictException,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { User } from '../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './email.service';

const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly emailService: EmailService,
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

	// Always resolves silently, even for unknown emails — the response must
	// not reveal whether an address is registered.
	async forgotPassword(email: string): Promise<void> {
		const user = await this.userRepo.findOne({ where: { email } });
		if (!user) {
			return;
		}

		const rawToken = randomBytes(32).toString('hex');
		user.passwordResetTokenHash = hashResetToken(rawToken);
		user.passwordResetExpiresAt = new Date(Date.now() + PASSWORD_RESET_TTL_MS);
		await this.userRepo.save(user);

		const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:5173');
		const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;
		await this.emailService.sendPasswordResetEmail(user.email, resetUrl);
	}

	async resetPassword(token: string, newPassword: string): Promise<void> {
		const tokenHash = hashResetToken(token);
		const user = await this.userRepo.findOne({ where: { passwordResetTokenHash: tokenHash } });

		if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
			throw new BadRequestException('Invalid or expired reset token');
		}

		user.passwordHash = await bcrypt.hash(newPassword, 10);
		user.passwordResetTokenHash = null;
		user.passwordResetExpiresAt = null;
		await this.userRepo.save(user);
	}

	private signToken(user: User): string {
		const payload = { sub: user.id, email: user.email };
		return this.jwtService.sign(payload);
	}
}

// Reset tokens are stored hashed (never plaintext) so a DB read alone can't
// be used to reset someone's password — mirrors how refresh tokens are handled.
function hashResetToken(rawToken: string): string {
	return createHash('sha256').update(rawToken).digest('hex');
}
