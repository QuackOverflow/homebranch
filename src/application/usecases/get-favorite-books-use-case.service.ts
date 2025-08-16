import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../interfaces/book-repository';
import { Book } from '../../domain/entities/book.entity';
import { Result } from '../interfaces/result';

@Injectable()
export class GetFavoriteBooksUseCase {
  constructor(
    @Inject('BookRepository') private bookRepository: IBookRepository,
  ) {}

  async execute(): Promise<Result<Book[]>> {
    return await this.bookRepository.findFavorites();
  }
}
