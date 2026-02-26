import { AddBookToBookShelfRequest } from 'src/application/contracts/bookshelf/add-book-to-book-shelf-request';
import { BookShelf } from 'src/domain/entities/bookshelf.entity';
import { mockBook, mockBookFavorite } from './bookMocks';

export const mockAddBookToBookShelfRequest: AddBookToBookShelfRequest = {
  bookShelfId: 'bookshelf-123',
  bookId: 'book-456',
};

export const mockBookShelf: BookShelf = new BookShelf('bookshelf-123', 'Test Book Shelf', []);

export const mockBookShelfWithBooks: BookShelf = new BookShelf('bookshelf-with-books', 'My Favorites', [
  mockBook,
  mockBookFavorite,
]);
