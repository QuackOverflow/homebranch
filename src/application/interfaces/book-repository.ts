import { Book } from 'src/domain/entities/book.entity';
import { IRepository } from './repository';
import { Result } from '../../core/result';
import { PaginationResult } from '../../core/pagination_result';

export interface IBookRepository extends IRepository<Book> {
  findByAuthor(
    authorId: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<PaginationResult<Book[]>>>;
  findFavorites(limit?: number, offset?: number): Promise<Result<Book[]>>;
  findByTitle(
    title: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<Book>>;
}
