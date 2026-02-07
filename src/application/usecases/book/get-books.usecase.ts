import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../../interfaces/book-repository';
import { Book } from 'src/domain/entities/book.entity';
import { Result } from '../../../core/result';
import { PaginationResult } from '../../../core/pagination_result';
import { UseCase } from '../../../core/usecase';
import { PaginatedQuery } from '../../../core/paginated-query';

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
