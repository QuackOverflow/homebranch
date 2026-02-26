import { Test, TestingModule } from '@nestjs/testing';
import { IBookRepository } from 'src/application/interfaces/book-repository';
import { DeleteBookUseCase } from 'src/application/usecases/book/delete-book.usecase';
import { mock } from 'jest-mock-extended';
import { mockBook } from 'test/mocks/bookMocks';
import { Result } from 'src/core/result';
import { BookNotFoundFailure } from 'src/domain/failures/book.failures';
import Mocked = jest.Mocked;

describe('DeleteBookUseCase', () => {
  let useCase: DeleteBookUseCase;
  let bookRepository: Mocked<IBookRepository>;

  const bookNotFoundFailure = new BookNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBookUseCase,
        {
          provide: 'BookRepository',
          useValue: mock<IBookRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<DeleteBookUseCase>(DeleteBookUseCase);
    bookRepository = module.get('BookRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully deletes a book', async () => {
    bookRepository.delete.mockResolvedValueOnce(Result.ok(mockBook));

    const result = await useCase.execute({ id: mockBook.id });

    expect(bookRepository.delete).toHaveBeenCalledTimes(1);
    expect(bookRepository.delete).toHaveBeenCalledWith(mockBook.id);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockBook);
  });

  test('Fails when book not found', async () => {
    bookRepository.delete.mockResolvedValueOnce(Result.fail(bookNotFoundFailure));

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(bookRepository.delete).toHaveBeenCalledTimes(1);
    expect(bookRepository.delete).toHaveBeenCalledWith('non-existent-id');
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(bookNotFoundFailure);
  });
});
