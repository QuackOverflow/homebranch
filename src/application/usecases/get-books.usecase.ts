import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../interfaces/book-repository';
import { UseCase } from '../interfaces/usecase';
import { Book } from 'src/domain/entities/book.entity';
import { Result } from '../interfaces/result';

@Injectable()
export class GetBooksUseCase implements UseCase<void, Book[]> {
  constructor(
    @Inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async execute(): Promise<Result<Book[]>> {
    return await this.bookRepository.findAll();
  }
}
