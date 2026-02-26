import { Result } from 'src/core/result';
import { IRepository } from 'src/core/repository';
import { BookShelf } from 'src/domain/entities/bookshelf.entity';

export interface IBookShelfRepository extends IRepository<BookShelf> {
  findByTitle(title: string): Promise<Result<BookShelf>>;
  addBook(bookShelfId: string, bookId: string): Promise<Result>;
  removeBook(bookShelfId: string, bookId: string): Promise<Result>;
  findByBookId(bookId: string): Promise<Result<BookShelf[]>>;
}
