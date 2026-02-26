import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { IBookRepository } from 'src/application/interfaces/book-repository';
import { GetBookShelfBooksUseCase } from 'src/application/usecases/bookshelf/get-book-shelf-books-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import { mockBook } from 'test/mocks/bookMocks';
import { Result } from 'src/core/result';
import { BookShelfNotFoundFailure } from 'src/domain/failures/bookshelf.failures';
import Mocked = jest.Mocked;

describe('GetBookShelfBooksUseCase', () => {
  let useCase: GetBookShelfBooksUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;
  let bookRepository: Mocked<IBookRepository>;

  const bookshelfNotFoundFailure = new BookShelfNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBookShelfBooksUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
        {
          provide: 'BookRepository',
          useValue: mock<IBookRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetBookShelfBooksUseCase>(GetBookShelfBooksUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
    bookRepository = module.get('BookRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /*
    Scenario: Get books for an existing bookshelf
    Given a bookshelf exists with the provided ID
    When a request to get its books is made
    Then the books should be returned in a paginated result
    And a success result should be returned
   */
  test('Existing bookshelf with books', async () => {
    const bookShelfWithBooks = { ...mockBookShelf, books: [mockBook] };
    const paginatedResult = { data: [mockBook], limit: undefined, offset: undefined, total: 1, nextCursor: null };

    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(bookShelfWithBooks));
    bookRepository.findByBookShelfId.mockResolvedValueOnce(Result.ok(paginatedResult));

    const result = await useCase.execute({ id: mockBookShelf.id });

    expect(result.success).toBe(true);
    expect(result.value).toEqual(paginatedResult);
    expect(bookRepository.findByBookShelfId).toHaveBeenCalledWith(bookShelfWithBooks);
  });

  /*
    Scenario: Get books for a non-existent bookshelf
    Given a bookshelf does not exist with the provided ID
    When a request to get its books is made
    Then a failure result should be returned
   */
  test('Non existent bookshelf', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.fail(bookshelfNotFoundFailure));

    const result = await useCase.execute({ id: 'nonexistent' });

    expect(result.success).toBe(false);
    expect(result.failure).toBeInstanceOf(BookShelfNotFoundFailure);
    expect(bookRepository.findByBookShelfId).not.toHaveBeenCalled();
  });
});
