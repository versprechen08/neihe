import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { CreateJournalDto } from './dto/create-journal.dto';
import { QueryJournalDto } from './dto/query-journal.dto';

export interface PaginatedJournalEntries {
	data: JournalEntry[];
	total: number;
}

@Injectable()
export class JournalService {
	constructor(
		@InjectRepository(JournalEntry)
		private readonly journalRepo: Repository<JournalEntry>,
	) {}

	async create(userId: string, dto: CreateJournalDto): Promise<JournalEntry> {
		const entry = this.journalRepo.create({
			userId,
			mood: dto.mood,
			content: dto.content,
			cardId: dto.cardId ?? null,
		});
		return this.journalRepo.save(entry);
	}

	async findAll(userId: string, query: QueryJournalDto): Promise<PaginatedJournalEntries> {
		const { page, limit, mood } = query;

		const [data, total] = await this.journalRepo.findAndCount({
			where: { userId, ...(mood ? { mood } : {}) },
			relations: { card: true },
			order: { createdAt: 'DESC' },
			skip: (page - 1) * limit,
			take: limit,
		});

		return { data, total };
	}
}
