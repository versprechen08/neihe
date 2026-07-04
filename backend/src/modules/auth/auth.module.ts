import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../database/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				secret: config.get('JWT_SECRET', 'dev-secret-change-me'),
				signOptions: { expiresIn: '7d' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [JwtModule, AuthService],
})
export class AuthModule {}
