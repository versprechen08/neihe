import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Favorite } from './favorite.entity';

/**
 * 经典卡片 — 产品的内容核心
 *
 * 每张卡片 = 一则经典语句 + 释义 + 反思问题
 * 三大学派用 school enum 区分，主题和情绪适配用 JSONB 标签
 */

export enum School {
  CONFUCIAN = 'confucian', // 儒
  DAOIST = 'daoist',       // 道
  BUDDHIST = 'buddhist',   // 佛
}

export enum MoodFit {
  TURBULENT = 'turbulent', // 波动时适合（安抚型内容）
  CALM = 'calm',           // 平静时适合（深思型内容）
  ANY = 'any',             // 通用
}

@Entity('philosophy_cards')
export class PhilosophyCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: School })
  school: School;

  @Column()
  source: string; // 出处，如 "《论语·卫灵公》"

  @Column({ type: 'text' })
  originalText: string; // 原文

  @Column({ type: 'text' })
  translation: string; // 白话/英文释义

  @Column({ type: 'text' })
  reflection: string; // 反思提问

  @Column({ type: 'simple-array', nullable: true })
  themes: string[]; // 主题标签：焦虑、关系、自我认同、无常...

  @Column({ type: 'enum', enum: MoodFit, default: MoodFit.ANY })
  moodFit: MoodFit;

  @Column({ default: true })
  isActive: boolean; // 内容审核开关

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Favorite, (fav) => fav.card)
  favorites: Favorite[];
}
