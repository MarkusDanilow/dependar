import { Technology } from '@prisma/client';

export interface IRepository<T, CreateInput = any, UpdateInput = any, WhereInput = any> {
  create(data: CreateInput): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(query?: WhereInput): Promise<T[]>;
  update(id: string, data: UpdateInput): Promise<T>;
  delete(id: string): Promise<T>;
}

export interface ITechnologyRepository extends IRepository<Technology> {
  findBySemVer(name: string, versionRange: string): Promise<Technology[]>;
}

export interface ParsedTechDTO {
  name: string;
  version: string;
  source: string;
}

export interface IIngestionStrategy {
  parsePayload(payload: any): ParsedTechDTO[];
}
