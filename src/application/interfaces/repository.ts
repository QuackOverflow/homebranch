import { Result } from './result';

export interface IRepository<T> {
  findAll(): Promise<Result<T[]>>;
  findById(id: string): Promise<Result<T>>;
  create(entity: T): Promise<Result<T>>;
  update(id: string, entity: T): Promise<Result<T>>;
  delete(id: string): Promise<Result<T>>;
}
