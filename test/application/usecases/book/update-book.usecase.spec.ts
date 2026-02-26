import { Test, TestingModule } from '@nestjs/testing';
import { IBookRepository } from 'src/application/interfaces/book-repository';
import { UpdateBookUseCase } from 'src/application/usecases/book/update-book.usecase';
import { mock } from 'jest-mock-extended';
import { mockBook } from 'test/mocks/bookMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { BookNotFoundFailure } from 'src/domain/failures/book.failures';
import Mocked = jest.Mocked;

describe('UpdateBookUseCase', () => {
  let useCase: UpdateBookUseCase;
  let bookRepository: Mocked<IBookRepository>;

  const bookNotFoundFailure = new BookNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBookUseCase,
        {
          provide: 'BookRepository',
          useValue: mock<IBookRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<UpdateBookUseCase>(UpdateBookUseCase);
    bookRepository = module.get('BookRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully updates a book with all fields', async () => {
    const updatedBook = {
      ...mockBook,
      title: 'Updated Title',
      author: 'Updated Author',
      isFavorite: true,
      publishedYear: 2023,
    };
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookRepository.update.mockResolvedValueOnce(Result.ok(updatedBook));

    const result = await useCase.execute({
      id: mockBook.id,
      title: 'Updated Title',
      author: 'Updated Author',
      isFavorite: true,
      publishedYear: 2023,
    });

    expect(bookRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).toHaveBeenCalledWith(mockBook.id);
    expect(bookRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(updatedBook);
  });

  test('Successfully updates a book with partial fields', async () => {
    const updatedBook = { ...mockBook, title: 'Updated Title' };
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookRepository.update.mockResolvedValueOnce(Result.ok(updatedBook));

    const result = await useCase.execute({
      id: mockBook.id,
      title: 'Updated Title',
    });

    expect(bookRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).toHaveBeenCalledWith(mockBook.id);
    expect(bookRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
  });

  test('Successfully updates only isFavorite flag', async () => {
    const updatedBook = { ...mockBook, isFavorite: true };
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookRepository.update.mockResolvedValueOnce(Result.ok(updatedBook));

    const result = await useCase.execute({
      id: mockBook.id,
      isFavorite: true,
    });

    expect(bookRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value!.isFavorite).toBe(true);
  });

  test('Fails when book not found', async () => {
    bookRepository.findById.mockResolvedValueOnce(Result.fail(bookNotFoundFailure));

    const result = await useCase.execute({
      id: 'non-existent-id',
      title: 'Updated Title',
    });

    expect(bookRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(bookRepository.update).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(bookNotFoundFailure);
  });

  test('Fails when update operation fails', async () => {
    const unexpectedFailure = new UnexpectedFailure('Unexpected error');
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookRepository.update.mockResolvedValueOnce(Result.fail(unexpectedFailure));

    const result = await useCase.execute({
      id: mockBook.id,
      title: 'Updated Title',
    });

    expect(bookRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(unexpectedFailure);
  });
});
