import { Inject, Injectable } from '@nestjs/common';
import { CreateBookRequest } from '../contracts/create-book-request';
import { IBookRepository } from '../interfaces/book-repository';
import { UseCase } from '../interfaces/usecase';
import { BookFactory } from 'src/domain/entities/book.factory';
import { Book } from 'src/domain/entities/book.entity';
import { randomUUID } from 'crypto';
import { Result } from '../../core/result';

@Injectable()
export class CreateBookUseCase implements UseCase<CreateBookRequest, Book> {
  constructor(
    @Inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async execute(dto: CreateBookRequest): Promise<Result<Book>> {
    const id = randomUUID();
    const book = BookFactory.create(
      id,
      dto.title,
      dto.author,
      dto.fileName,
      dto.isFavorite ?? false,
      dto.publishedYear ? parseInt(dto.publishedYear) : undefined,
      dto.coverImageFileName,
    );
    return await this.bookRepository.create(book);
  }
}
