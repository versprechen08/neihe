import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { User } from './database/entities/user.entity';
import { PhilosophyCard } from './modules/cards/philosophy-card.entity';
import { JournalEntry } from './modules/journal/journal-entry.entity';
import { BreathingSession } from './modules/breathing/breathing-session.entity';
import { Favorite } from './modules/cards/favorite.entity';

// Feature modules
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { JournalModule } from './modules/journal/journal.module';
import { BreathingModule } from './modules/breathing/breathing.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    // Environment variables
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'neihe'),
        password: config.get('DB_PASSWORD', 'neihe'),
        database: config.get('DB_DATABASE', 'neihe'),
        entities: [User, PhilosophyCard, JournalEntry, BreathingSession, Favorite],
        synchronize: config.get('NODE_ENV', 'development') === 'development',
        logging: config.get('NODE_ENV', 'development') === 'development',
      }),
    }),

    // Feature modules
    AuthModule,
    CardsModule,
    JournalModule,
    BreathingModule,
    StatsModule,
  ],
})
export class AppModule {}
