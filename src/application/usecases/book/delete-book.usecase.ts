import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../../interfaces/book-repository';
import { DeleteBookRequest } from '../../contracts/book/delete-book-request';
import { Book } from '../../../domain/entities/book.entity';
import { Result } from '../../../core/result';
import { UseCase } from '../../../core/usecase';

@Injectable()
export class DeleteBookUseCase implements UseCase<DeleteBookRequest, Book> {
  constructor(
    @Inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async execute({ id }: DeleteBookRequest): Promise<Result<Book>> {
    return await this.bookRepository.delete(id);
  }
}
