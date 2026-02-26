import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { RemoveBookFromBookShelfUseCase } from 'src/application/usecases/bookshelf/remove-book-from-book-shelf-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockBookShelf } from 'test/mocks/bookShelfMocks';
import { mockBook } from 'test/mocks/bookMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { BookShelfNotFoundFailure } from 'src/domain/failures/bookshelf.failures';
import Mocked = jest.Mocked;

describe('RemoveBookFromBookShelfUseCase', () => {
  let useCase: RemoveBookFromBookShelfUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  const bookshelfNotFoundFailure = new BookShelfNotFoundFailure();

  const mockRequest = { bookShelfId: mockBookShelf.id, bookId: mockBook.id };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemoveBookFromBookShelfUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<RemoveBookFromBookShelfUseCase>(RemoveBookFromBookShelfUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully removes a book from a bookshelf', async () => {
    const updatedBookShelf = { ...mockBookShelf, books: [] };
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok({ ...mockBookShelf, books: [mockBook] }));
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(updatedBookShelf));
    bookShelfRepository.removeBook.mockResolvedValueOnce(Result.ok());

    const result = await useCase.execute(mockRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(2);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockRequest.bookShelfId);
    expect(bookShelfRepository.removeBook).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.removeBook).toHaveBeenCalledWith(mockRequest.bookShelfId, mockRequest.bookId);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(updatedBookShelf);
  });

  test('Successfully returns bookshelf when book is not found in bookshelf', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok({ ...mockBookShelf, books: [] }));

    const result = await useCase.execute(mockRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockRequest.bookShelfId);
    expect(bookShelfRepository.removeBook).not.toHaveBeenCalled();
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual({ ...mockBookShelf, books: [] });
  });

  test('Fails when bookshelf not found', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.fail(bookshelfNotFoundFailure));

    const result = await useCase.execute(mockRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockRequest.bookShelfId);
    expect(bookShelfRepository.removeBook).not.toHaveBeenCalled();
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(bookshelfNotFoundFailure);
  });

  test('Fails when removeBook fails', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok({ ...mockBookShelf, books: [mockBook] }));
    bookShelfRepository.removeBook.mockResolvedValueOnce(Result.fail(new UnexpectedFailure('Failed to remove book')));

    const result = await useCase.execute(mockRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.findById).toHaveBeenCalledWith(mockRequest.bookShelfId);
    expect(bookShelfRepository.removeBook).toHaveBeenCalledTimes(1);
    expect(bookShelfRepository.removeBook).toHaveBeenCalledWith(mockRequest.bookShelfId, mockRequest.bookId);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(new UnexpectedFailure('Failed to remove book'));
  });
});
