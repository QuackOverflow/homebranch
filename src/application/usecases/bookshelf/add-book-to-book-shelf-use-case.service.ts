import { IBookRepository } from '../../interfaces/book-repository';
import { Inject, Injectable } from '@nestjs/common';
import { Result } from 'src/core/result';
import { UseCase } from 'src/core/usecase';
import { BookShelf } from 'src/domain/entities/bookshelf.entity';
import { IBookShelfRepository } from '../../interfaces/bookshelf-repository';
import { AddBookToBookShelfRequest } from '../../contracts/bookshelf/add-book-to-book-shelf-request';

@Injectable()
export class AddBookToBookShelfUseCase implements UseCase<AddBookToBookShelfRequest, BookShelf> {
  constructor(
    @Inject('BookShelfRepository')
    private bookShelfRepository: IBookShelfRepository,

    @Inject('BookRepository')
    private bookRepository: IBookRepository,
  ) {}

  async execute(request: AddBookToBookShelfRequest): Promise<Result<BookShelf>> {
    const findBookShelfResult = await this.bookShelfRepository.findById(request.bookShelfId);

    if (!findBookShelfResult.isSuccess()) {
      return findBookShelfResult;
    }

    const bookShelf = findBookShelfResult.value;

    if (bookShelf.books.find((book) => book.id === request.bookId)) {
      return Result.ok(bookShelf);
    }

    const findBookResult = await this.bookRepository.findById(request.bookId);

    if (findBookResult.isFailure()) {
      return Result.fail(findBookResult.failure);
    }

    const addBookResult = await this.bookShelfRepository.addBook(request.bookShelfId, request.bookId);
    if (addBookResult.isFailure()) {
      return Result.fail(addBookResult.failure);
    }

    return await this.bookShelfRepository.findById(request.bookShelfId);
  }
}
