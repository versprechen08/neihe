import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './journal-entry.entity';
// TODO: JournalService, JournalController

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry])],
  controllers: [], // TODO: JournalController
  providers: [],   // TODO: JournalService
  exports: [],
})
export class JournalModule {}
