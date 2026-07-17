import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() dto: RegisterDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	login(@Body() dto: LoginDto) {
		return this.authService.login(dto);
	}

	@Post('forgot-password')
	@HttpCode(HttpStatus.OK)
	async forgotPassword(@Body() dto: ForgotPasswordDto) {
		await this.authService.forgotPassword(dto.email);
		return { message: '如果该邮箱已注册，重置链接已发送到邮箱。' };
	}

	@Post('reset-password')
	@HttpCode(HttpStatus.OK)
	async resetPassword(@Body() dto: ResetPasswordDto) {
		await this.authService.resetPassword(dto.token, dto.newPassword);
		return { message: '密码已重置，请使用新密码登录。' };
	}
}
