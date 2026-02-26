import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { GetBookShelfByIdUseCase } from 'src/application/usecases/bookshelf/get-book-shelf-by-id-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import { Result } from 'src/core/result';
import { BookShelfNotFoundFailure } from 'src/domain/failures/bookshelf.failures';
import Mocked = jest.Mocked;

describe('GetBookShelfByIdUseCase', () => {
  let useCase: GetBookShelfByIdUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  const bookshelfNotFoundFailure = new BookShelfNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBookShelfByIdUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetBookShelfByIdUseCase>(GetBookShelfByIdUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves a bookshelf by ID', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));

    const result = await useCase.execute({ id: mockBookShelf.id });

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockBookShelf.id);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockBookShelf);
  });

  test('Fails when bookshelf not found', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.fail(bookshelfNotFoundFailure));

    const result = await useCase.execute({ id: 'non-existent-id' });

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(bookshelfNotFoundFailure);
  });
});
