import { IsEnum, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { Mood } from '../journal-entry.entity';

export class CreateJournalDto {
	@IsEnum(Mood)
	mood: Mood;

	@IsString()
	@MinLength(1)
	content: string;

	@IsOptional()
	@IsUUID()
	cardId?: string;
}
