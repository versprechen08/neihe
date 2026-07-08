import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhilosophyCard } from './philosophy-card.entity';
import { Favorite } from './favorite.entity';
import { CardsService } from './cards.service';
// TODO: CardsController

@Module({
  imports: [TypeOrmModule.forFeature([PhilosophyCard, Favorite])],
  controllers: [], // TODO: CardsController
  providers: [CardsService],
  exports: [CardsService],
})
export class CardsModule {}
