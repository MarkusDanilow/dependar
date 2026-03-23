import { PrismaClient } from '@prisma/client';
import { IRepository } from './interfaces';

export abstract class BaseRepository<T, CreateInput = any, UpdateInput = any, WhereInput = any> implements IRepository<T, CreateInput, UpdateInput, WhereInput> {
  protected constructor(protected readonly prisma: PrismaClient) {}

  abstract create(data: CreateInput): Promise<T>;
  abstract findById(id: string): Promise<T | null>;
  abstract findOne(query: WhereInput): Promise<T | null>;
  abstract findAll(query?: WhereInput): Promise<T[]>;
  abstract update(id: string, data: UpdateInput): Promise<T>;
  abstract delete(id: string): Promise<T>;

  protected handleDbError(error: Error): void {
    console.error(`Database error occurred: ${error.message}`, error.stack);
    throw error;
  }
}
