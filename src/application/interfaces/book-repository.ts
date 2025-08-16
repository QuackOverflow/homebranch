import { Book } from 'src/domain/entities/book.entity';
import { IRepository } from './repository';
import { Result } from './result';

export interface IBookRepository extends IRepository<Book> {
  findByAuthor(authorId: string): Promise<Result<Book[]>>;
  findFavorites(): Promise<Result<Book[]>>;
  findByTitle(title: string): Promise<Result<Book>>;
}
