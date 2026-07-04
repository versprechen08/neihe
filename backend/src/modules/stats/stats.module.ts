import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from '../journal/journal-entry.entity';
import { BreathingSession } from '../breathing/breathing-session.entity';
import { Favorite } from '../cards/favorite.entity';
// TODO: StatsService, StatsController

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry, BreathingSession, Favorite])],
  controllers: [], // TODO: StatsController
  providers: [],   // TODO: StatsService
  exports: [],
})
export class StatsModule {}
