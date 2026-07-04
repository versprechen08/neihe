import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreathingSession } from './breathing-session.entity';
// TODO: BreathingService, BreathingController

@Module({
  imports: [TypeOrmModule.forFeature([BreathingSession])],
  controllers: [], // TODO: BreathingController
  providers: [],   // TODO: BreathingService
  exports: [],
})
export class BreathingModule {}
