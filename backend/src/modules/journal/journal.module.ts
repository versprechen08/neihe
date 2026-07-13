import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JournalEntry } from './journal-entry.entity';
import { JournalService } from './journal.service';
// TODO: JournalController

@Module({
  imports: [TypeOrmModule.forFeature([JournalEntry])],
  controllers: [], // TODO: JournalController
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
