import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { GetBookShelvesUseCase } from 'src/application/usecases/bookshelf/get-book-shelves-use-case.service';
import { mock } from 'jest-mock-extended';
import { Result } from 'src/core/result';
import { PaginationResult } from 'src/core/pagination_result';
import { BookShelf } from 'src/domain/entities/bookshelf.entity';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import Mocked = jest.Mocked;

describe('GetBookShelvesUseCase', () => {
  let useCase: GetBookShelvesUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBookShelvesUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetBookShelvesUseCase>(GetBookShelvesUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves paginated bookshelves', async () => {
    const mockBookshelves = [mockBookShelf, new BookShelf('2', 'Another Shelf', [])];
    const paginationResult: PaginationResult<BookShelf[]> = {
      data: mockBookshelves,
      limit: 10,
      offset: 0,
      total: 2,
      nextCursor: null,
    };
    bookShelfRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(bookShelfRepository.findAll).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findAll).toHaveBeenCalledWith(10, 0);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(paginationResult);
  });
});
