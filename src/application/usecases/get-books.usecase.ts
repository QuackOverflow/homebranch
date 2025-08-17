import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../interfaces/book-repository';
import { UseCase } from '../interfaces/usecase';
import { Book } from 'src/domain/entities/book.entity';
import { Result } from '../../core/result';
import { PaginatedQuery } from '../contracts/paginated-query';
import { PaginationResult } from '../../core/pagination_result';

@Injectable()
export class GetBooksUseCase
  implements UseCase<PaginatedQuery, PaginationResult<Book[]>>
{
  constructor(
    @Inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async execute({
    limit,
    offset,
  }: PaginatedQuery): Promise<Result<PaginationResult<Book[]>>> {
    return await this.bookRepository.findAll(limit, offset);
  }
}
