import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { JournalEntry } from '../../modules/journal/journal-entry.entity';
import { BreathingSession } from '../../modules/breathing/breathing-session.entity';
import { Favorite } from '../../modules/cards/favorite.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  nickname: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'varchar', nullable: true })
  passwordResetTokenHash: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ── Relations ──

  @OneToMany(() => JournalEntry, (entry) => entry.user)
  journalEntries: JournalEntry[];

  @OneToMany(() => BreathingSession, (session) => session.user)
  breathingSessions: BreathingSession[];

  @OneToMany(() => Favorite, (fav) => fav.user)
  favorites: Favorite[];
}
