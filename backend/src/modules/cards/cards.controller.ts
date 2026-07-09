import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardsService } from './cards.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/jwt.strategy';

@Controller('cards')
export class CardsController {
	constructor(private readonly cardsService: CardsService) {}

	@Get('today')
	getToday() {
		return this.cardsService.getToday();
	}

	@Get('random')
	getRandom() {
		return this.cardsService.getRandom();
	}

	@Post(':id/favorite')
	@UseGuards(AuthGuard('jwt'))
	toggleFavorite(@Param('id') cardId: string, @CurrentUser() user: AuthenticatedUser) {
		return this.cardsService.toggleFavorite(user.id, cardId);
	}
}
