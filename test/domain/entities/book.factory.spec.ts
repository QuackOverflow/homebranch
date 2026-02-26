import { BookFactory } from 'src/domain/entities/book.factory';

describe('BookFactory', () => {
  describe('create', () => {
    test('Successfully creates a book with all fields', () => {
      const book = BookFactory.create('book-1', 'Test Book', 'Test Author', 'test.epub', false, 2023, 'cover.jpg');

      expect(book.id).toBe('book-1');
      expect(book.title).toBe('Test Book');
      expect(book.author).toBe('Test Author');
      expect(book.fileName).toBe('test.epub');
      expect(book.isFavorite).toBe(false);
      expect(book.publishedYear).toBe(2023);
      expect(book.coverImageFileName).toBe('cover.jpg');
    });

    test('Successfully creates a book with minimal fields', () => {
      const book = BookFactory.create('book-2', 'Another Book', 'Another Author', 'another.epub');

      expect(book.id).toBe('book-2');
      expect(book.title).toBe('Another Book');
      expect(book.author).toBe('Another Author');
      expect(book.fileName).toBe('another.epub');
      expect(book.isFavorite).toBe(false);
      expect(book.publishedYear).toBeUndefined();
      expect(book.coverImageFileName).toBeUndefined();
    });

    test('Successfully creates a favorite book', () => {
      const book = BookFactory.create('book-3', 'Favorite Book', 'Favorite Author', 'favorite.epub', true);

      expect(book.isFavorite).toBe(true);
    });

    test('Throws error when title is missing', () => {
      expect(() => BookFactory.create('book-4', '', 'Author', 'test.epub')).toThrow(
        'Title and author are required to create a book.',
      );
    });

    test('Throws error when author is missing', () => {
      expect(() => BookFactory.create('book-5', 'Title', '', 'test.epub')).toThrow(
        'Title and author are required to create a book.',
      );
    });

    test('Throws error when both title and author are missing', () => {
      expect(() => BookFactory.create('book-6', '', '', 'test.epub')).toThrow(
        'Title and author are required to create a book.',
      );
    });

    test('Throws error when title is null', () => {
      expect(() => BookFactory.create('book-7', null as any, 'Author', 'test.epub')).toThrow(
        'Title and author are required to create a book.',
      );
    });

    test('Throws error when author is null', () => {
      expect(() => BookFactory.create('book-8', 'Title', null as any, 'test.epub')).toThrow(
        'Title and author are required to create a book.',
      );
    });

    test('Handles optional published year', () => {
      const book = BookFactory.create('book-9', 'Title', 'Author', 'test.epub', false, 2020);

      expect(book.publishedYear).toBe(2020);
    });

    test('Handles optional cover image filename', () => {
      const book = BookFactory.create('book-10', 'Title', 'Author', 'test.epub', false, undefined, 'mycover.png');

      expect(book.coverImageFileName).toBe('mycover.png');
    });
  });
});
