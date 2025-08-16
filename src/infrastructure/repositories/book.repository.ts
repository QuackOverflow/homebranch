import { Injectable } from '@nestjs/common';
import { IBookRepository } from 'src/application/interfaces/book-repository';
import { Repository } from 'typeorm';
import { BookEntity } from '../database/book.entity';
import { BookMapper } from '../mappers/book.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/domain/entities/book.entity';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Result, Success } from '../../application/interfaces/result';
import { BookNotFoundFailure } from '../../domain/failures/book.failures';

@Injectable()
export class TypeOrmBookRepository implements IBookRepository {
  constructor(
    @InjectRepository(BookEntity) private repository: Repository<BookEntity>,
  ) {}

  async create(entity: Book): Promise<Result<Book>> {
    const bookEntity = BookMapper.toPersistence(entity);
    const savedEntity = await this.repository.save(bookEntity);
    return new Success(BookMapper.toDomain(savedEntity));
  }

  async findAll(): Promise<Result<Book[]>> {
    const bookEntities = await this.repository.find();
    return new Success(BookMapper.toDomainList(bookEntities));
  }

  async findById(id: string): Promise<Result<Book>> {
    const bookEntity =
      (await this.repository.findOne({ where: { id } })) || null;
    if (bookEntity) return new Success(BookMapper.toDomain(bookEntity));
    return new BookNotFoundFailure();
  }

  async update(id: string, book: Book): Promise<Result<Book>> {
    const bookEntity = BookMapper.toPersistence(book);
    await this.repository.save(bookEntity);
    return new Success(BookMapper.toDomain(bookEntity));
  }

  async delete(id: string): Promise<Result<Book>> {
    const findBookResult = await this.findById(id);
    if (!findBookResult.isSuccess) {
      return new BookNotFoundFailure();
    }

    const book = (findBookResult as Success<Book>).value;
    if (
      existsSync(
        `${process.env.UPLOADS_DIRECTORY || join(process.cwd(), 'uploads')}/books/${book.fileName}`,
      )
    ) {
      unlinkSync(
        `${process.env.UPLOADS_DIRECTORY || join(process.cwd(), 'uploads')}/books/${book.fileName}`,
      );
    }
    if (
      existsSync(
        `${process.env.UPLOADS_DIRECTORY || join(process.cwd(), 'uploads')}/cover-images/${book.coverImageFileName}`,
      )
    ) {
      unlinkSync(
        `${process.env.UPLOADS_DIRECTORY || join(process.cwd(), 'uploads')}/cover-images/${book.coverImageFileName}`,
      );
    }
    await this.repository.delete(id);
    return new Success(book);
  }

  async findByAuthor(author: string): Promise<Result<Book[]>> {
    const bookEntities = await this.repository.find({ where: { author } });
    return new Success(BookMapper.toDomainList(bookEntities));
  }

  async findFavorites(): Promise<Result<Book[]>> {
    const bookEntities = await this.repository.find({
      where: { isFavorite: true },
    });
    return new Success(BookMapper.toDomainList(bookEntities));
  }

  async findByTitle(title: string): Promise<Result<Book>> {
    const bookEntity =
      (await this.repository.findOne({ where: { title } })) || null;
    if (bookEntity) return new Success(BookMapper.toDomain(bookEntity));
    return new BookNotFoundFailure();
  }
}
