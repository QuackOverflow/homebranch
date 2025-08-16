import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../interfaces/book-repository';
import { Book } from 'src/domain/entities/book.entity';
import { UseCase } from '../interfaces/usecase';
import { GetBookByIdRequest } from '../contracts/get-book-by-id-request';
import { PaginatedQuery } from '../contracts/paginated-query';
import { Result } from '../interfaces/result';

@Injectable()
export class GetBookByIdUseCase
  implements UseCase<GetBookByIdRequest & PaginatedQuery, Book>
{
  constructor(
    @Inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async execute({
    id,
  }: GetBookByIdRequest & PaginatedQuery): Promise<Result<Book>> {
    return await this.bookRepository.findById(id);
  }
}
