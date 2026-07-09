import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhilosophyCard } from './philosophy-card.entity';
import { Favorite } from './favorite.entity';

// Day-of-year (1-366) in the server's local calendar — matches the NH-4 "dayOfYear % totalActiveCards" spec.
function getDayOfYear(date: Date): number {
	const startOfYear = new Date(date.getFullYear(), 0, 0);
	const msPerDay = 1000 * 60 * 60 * 24;
	return Math.floor((date.getTime() - startOfYear.getTime()) / msPerDay);
}

@Injectable()
export class CardsService {
	constructor(
		@InjectRepository(PhilosophyCard)
		private readonly cardRepo: Repository<PhilosophyCard>,
		@InjectRepository(Favorite)
		private readonly favoriteRepo: Repository<Favorite>,
	) {}

	async getToday(): Promise<PhilosophyCard> {
		const activeCards = await this.cardRepo.find({
			where: { isActive: true },
			order: { createdAt: 'ASC' },
		});
		if (activeCards.length === 0) {
			throw new NotFoundException('No active philosophy cards available');
		}

		const cardIndex = getDayOfYear(new Date()) % activeCards.length;
		return activeCards[cardIndex];
	}

	async getRandom(): Promise<PhilosophyCard> {
		const todayCard = await this.getToday();
		const activeCards = await this.cardRepo.find({ where: { isActive: true } });

		const candidates = activeCards.filter((card) => card.id !== todayCard.id);
		const pool = candidates.length > 0 ? candidates : activeCards;

		const randomIndex = Math.floor(Math.random() * pool.length);
		return pool[randomIndex];
	}

	async toggleFavorite(userId: string, cardId: string): Promise<{ favorited: boolean }> {
		const existing = await this.favoriteRepo.findOne({ where: { userId, cardId } });

		if (existing) {
			await this.favoriteRepo.remove(existing);
			return { favorited: false };
		}

		const favorite = this.favoriteRepo.create({ userId, cardId });
		await this.favoriteRepo.save(favorite);
		return { favorited: true };
	}
}
