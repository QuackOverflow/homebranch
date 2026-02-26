import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { UpdateBookShelfUseCase } from 'src/application/usecases/bookshelf/update-book-shelf-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { BookShelfNotFoundFailure } from 'src/domain/failures/bookshelf.failures';
import Mocked = jest.Mocked;

describe('UpdateBookShelfUseCase', () => {
  let useCase: UpdateBookShelfUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  const bookshelfNotFoundFailure = new BookShelfNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateBookShelfUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<UpdateBookShelfUseCase>(UpdateBookShelfUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully updates a bookshelf', async () => {
    const updatedBookShelf = { ...mockBookShelf, title: 'Updated Name' };
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookShelfRepository.update.mockResolvedValueOnce(Result.ok(updatedBookShelf));

    const result = await useCase.execute({ id: mockBookShelf.id, title: 'Updated Name' });

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockBookShelf.id);
    expect(bookShelfRepository.update).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.update).toHaveBeenCalledWith(mockBookShelf.id, updatedBookShelf);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(updatedBookShelf);
  });

  test('Fails when bookshelf not found', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.fail(bookshelfNotFoundFailure));

    const result = await useCase.execute({ id: 'non-existent-id', title: 'Updated Name' });

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith('non-existent-id');
    expect(bookShelfRepository.update).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(bookshelfNotFoundFailure);
  });

  test('Fails when update operation fails', async () => {
    const unexpectedFailure = new UnexpectedFailure('Unexpected error');
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookShelfRepository.update.mockResolvedValueOnce(Result.fail(unexpectedFailure));

    const result = await useCase.execute({ id: mockBookShelf.id, title: 'Updated Name' });

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockBookShelf.id);
    expect(bookShelfRepository.update).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(unexpectedFailure);
  });
});
