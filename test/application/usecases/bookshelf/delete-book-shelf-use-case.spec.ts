import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { DeleteBookShelfUseCase } from 'src/application/usecases/bookshelf/delete-book-shelf-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import { Result } from 'src/core/result';
import { BookShelfNotFoundFailure } from 'src/domain/failures/bookshelf.failures';
import Mocked = jest.Mocked;

describe('DeleteBookShelfUseCase', () => {
  let useCase: DeleteBookShelfUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  const bookshelfNotFoundFailure = new BookShelfNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBookShelfUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<DeleteBookShelfUseCase>(DeleteBookShelfUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully deletes a bookshelf', async () => {
    bookShelfRepository.delete.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));

    const result = await useCase.execute({ id: mockBookShelf.id });

    expect(bookShelfRepository.delete).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.delete).toHaveBeenCalledWith(mockBookShelf.id);
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
    expect(bookShelfRepository.delete).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(bookshelfNotFoundFailure);
  });
});
