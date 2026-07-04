import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { PhilosophyCard } from './philosophy-card.entity';

@Entity('favorites')
@Unique(['userId', 'cardId']) // 同一用户不能重复收藏同一张卡片
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  cardId: string;

  @CreateDateColumn()
  createdAt: Date;

  // ── Relations ──

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => PhilosophyCard, (card) => card.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cardId' })
  card: PhilosophyCard;
}
