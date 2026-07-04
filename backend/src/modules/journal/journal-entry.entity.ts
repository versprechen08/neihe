import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { PhilosophyCard } from '../cards/philosophy-card.entity';

/**
 * 心境日记
 *
 * 5 级情绪刻度，从波动到通透
 * 可选关联当日阅读的经典卡片
 */

export enum Mood {
  TURBULENT = 'turbulent', // 🌊 波动
  OVERCAST = 'overcast',   // 🌥 阴沉
  CALM = 'calm',           // 🌤 平静
  CLEAR = 'clear',         // ☀️ 清明
  LUMINOUS = 'luminous',   // ✨ 通透
}

@Entity('journal_entries')
export class JournalEntry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: Mood })
  mood: Mood;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid', nullable: true })
  cardId: string | null; // 关联当日阅读的卡片

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ── Relations ──

  @ManyToOne(() => User, (user) => user.journalEntries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PhilosophyCard, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cardId' })
  card: PhilosophyCard | null;
}
