import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhilosophyCard } from './philosophy-card.entity';
import { Favorite } from './favorite.entity';
// TODO: CardsService, CardsController

@Module({
  imports: [TypeOrmModule.forFeature([PhilosophyCard, Favorite])],
  controllers: [], // TODO: CardsController
  providers: [],   // TODO: CardsService
  exports: [],
})
export class CardsModule {}
