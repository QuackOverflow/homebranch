import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { GetBookShelvesByBookUseCase } from 'src/application/usecases/bookshelf/get-book-shelves-by-book-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import { mockBook } from 'test/mocks/bookMocks';
import { Result } from 'src/core/result';
import Mocked = jest.Mocked;

describe('GetBookShelvesByBookUseCase', () => {
  let useCase: GetBookShelvesByBookUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetBookShelvesByBookUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetBookShelvesByBookUseCase>(GetBookShelvesByBookUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves bookshelves by book ID', async () => {
    bookShelfRepository.findByBookId.mockResolvedValueOnce(Result.ok([mockBookShelf]));

    const result = await useCase.execute({ bookId: mockBook.id });

    expect(bookShelfRepository.findByBookId).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findByBookId).toHaveBeenCalledWith(mockBook.id);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual([mockBookShelf]);
  });
});
