import { Test, TestingModule } from '@nestjs/testing';
import { IBookRepository } from 'src/application/interfaces/book-repository';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { AddBookToBookShelfUseCase } from 'src/application/usecases/bookshelf/add-book-to-book-shelf-use-case.service';
import { mock } from 'jest-mock-extended';
import { mockAddBookToBookShelfRequest, mockBookShelf } from 'test/mocks/bookShelfMocks';
import { Result, UnexpectedFailure } from 'src/core/result';
import { mockBook } from 'test/mocks/bookMocks';
import { BookShelfNotFoundFailure } from 'src/domain/failures/bookshelf.failures';
import { BookNotFoundFailure } from 'src/domain/failures/book.failures';
import Mocked = jest.Mocked;

describe('AddBookToBookShelfUseCase', () => {
  let useCase: AddBookToBookShelfUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;
  let bookRepository: Mocked<IBookRepository>;

  const bookNotFoundFailure = new BookNotFoundFailure();
  const bookshelfNotFoundFailure = new BookShelfNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddBookToBookShelfUseCase,
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

    useCase = module.get<AddBookToBookShelfUseCase>(AddBookToBookShelfUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
    bookRepository = module.get('BookRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully adds book to bookshelf', async () => {
    const updatedBookShelf = { ...mockBookShelf, books: [mockBook] };

    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookShelfRepository.addBook.mockResolvedValueOnce(Result.ok());
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(updatedBookShelf));

    const result = await useCase.execute(mockAddBookToBookShelfRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(2);
    expect(bookShelfRepository.findById).toHaveBeenNthCalledWith(1, mockAddBookToBookShelfRequest.bookShelfId);
    expect(bookRepository.findById).toHaveBeenCalledWith(mockAddBookToBookShelfRequest.bookId);
    expect(bookShelfRepository.addBook).toHaveBeenCalledWith(
      mockAddBookToBookShelfRequest.bookShelfId,
      mockAddBookToBookShelfRequest.bookId,
    );
    expect(bookShelfRepository.findById).toHaveBeenNthCalledWith(2, mockAddBookToBookShelfRequest.bookShelfId);
    expect(result.success).toBe(true);
    expect(result.value).toEqual(updatedBookShelf);
  });

  test('Fails when bookshelf does not exist', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.fail(bookshelfNotFoundFailure));

    const result = await useCase.execute(mockAddBookToBookShelfRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).not.toHaveBeenCalled();
    expect(bookShelfRepository.addBook).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.failure).toEqual(bookshelfNotFoundFailure);
  });

  test('Fails when book does not exist', async () => {
    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookRepository.findById.mockResolvedValueOnce(Result.fail(bookNotFoundFailure));

    const result = await useCase.execute(mockAddBookToBookShelfRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).toHaveBeenCalledWith(mockAddBookToBookShelfRequest.bookId);
    expect(bookShelfRepository.addBook).not.toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.failure).toEqual(bookNotFoundFailure);
  });

  test('Book already in bookshelf returns immediately', async () => {
    const bookShelfWithBook = { ...mockBookShelf, books: [mockBook] };

    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(bookShelfWithBook));

    const result = await useCase.execute(mockAddBookToBookShelfRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).not.toHaveBeenCalled(); // Early return skips book validation
    expect(bookShelfRepository.addBook).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.value).toEqual(bookShelfWithBook);
  });

  test('Fails when addBook fails', async () => {
    const addBookFailure = new UnexpectedFailure('Failed to add book to shelf');

    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookShelfRepository.addBook.mockResolvedValueOnce(Result.fail(addBookFailure));

    const result = await useCase.execute(mockAddBookToBookShelfRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(1);
    expect(bookRepository.findById).toHaveBeenCalledWith(mockAddBookToBookShelfRequest.bookId);
    expect(bookShelfRepository.addBook).toHaveBeenCalledWith(
      mockAddBookToBookShelfRequest.bookShelfId,
      mockAddBookToBookShelfRequest.bookId,
    );
    expect(result.success).toBe(false);
    expect(result.failure).toEqual(addBookFailure);
  });

  test('Fails when final findById after addBook fails', async () => {
    const findFailure = new UnexpectedFailure('Failed to retrieve updated book shelf');

    bookShelfRepository.findById.mockResolvedValueOnce(Result.ok(mockBookShelf));
    bookRepository.findById.mockResolvedValueOnce(Result.ok(mockBook));
    bookShelfRepository.addBook.mockResolvedValueOnce(Result.ok());
    bookShelfRepository.findById.mockResolvedValueOnce(Result.fail(findFailure));

    const result = await useCase.execute(mockAddBookToBookShelfRequest);

    expect(bookShelfRepository.findById).toHaveBeenCalledTimes(2);
    expect(result.success).toBe(false);
    expect(result.failure).toEqual(findFailure);
  });
});
