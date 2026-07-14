import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';
import { QueryJournalDto } from './dto/query-journal.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt.strategy';

@Controller('journal')
@UseGuards(AuthGuard('jwt'))
export class JournalController {
	constructor(private readonly journalService: JournalService) {}

	@Post()
	create(@Body() dto: CreateJournalDto, @CurrentUser() user: AuthenticatedUser) {
		return this.journalService.create(user.id, dto);
	}

	@Get()
	findAll(@Query() query: QueryJournalDto, @CurrentUser() user: AuthenticatedUser) {
		return this.journalService.findAll(user.id, query);
	}
}
