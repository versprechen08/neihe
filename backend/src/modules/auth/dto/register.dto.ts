import { IsEmail, MinLength, IsString, IsOptional } from 'class-validator';

export class RegisterDto {
	@IsEmail()
	email: string;

	@MinLength(6)
	password: string;

	@IsOptional()
	@IsString()
	nickname?: string;
}
