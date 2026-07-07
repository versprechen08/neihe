import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

export interface JwtPayload {
	sub: string;
	email: string;
}

export interface AuthenticatedUser {
	id: string;
	email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		configService: ConfigService,
		@InjectRepository(User)
		private readonly userRepo: Repository<User>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET', 'dev-secret-change-me'),
		});
	}

	async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
		const user = await this.userRepo.findOne({ where: { id: payload.sub } });
		if (!user) {
			throw new UnauthorizedException('User no longer exists');
		}
		return { id: user.id, email: user.email };
	}
}
