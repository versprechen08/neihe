import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../database/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { EmailService } from './email.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get('JWT_SECRET', 'dev-secret-change-me'),
				signOptions: { expiresIn: '7d' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, EmailService],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
