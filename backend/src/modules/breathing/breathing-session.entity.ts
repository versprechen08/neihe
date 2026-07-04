import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../database/entities/user.entity';

export enum BreathingPattern {
  BOX = 'box',           // 方块呼吸 4-4-4-4
  RELAX = 'relax',       // 4-7-8 呼吸法
  NATURAL = 'natural',   // 自然呼吸 5-0-5
}

@Entity('breathing_sessions')
export class BreathingSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'enum', enum: BreathingPattern })
  pattern: BreathingPattern;

  @Column({ type: 'int' })
  cyclesCompleted: number;

  @Column({ type: 'int' })
  durationSeconds: number;

  @CreateDateColumn()
  createdAt: Date;

  // ── Relations ──

  @ManyToOne(() => User, (user) => user.breathingSessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
