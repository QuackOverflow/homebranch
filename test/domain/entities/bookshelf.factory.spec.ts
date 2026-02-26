import { BookShelfFactory } from 'src/domain/entities/bookshelf.factory';
import { mockBook } from 'test/mocks/bookMocks';

describe('BookShelfFactory', () => {
  describe('create', () => {
    test('Successfully creates a bookshelf with title only', () => {
      const shelf = BookShelfFactory.create('shelf-1', 'My Shelf');

      expect(shelf.id).toBe('shelf-1');
      expect(shelf.title).toBe('My Shelf');
      expect(shelf.books).toEqual([]);
    });

    test('Successfully creates a bookshelf with books', () => {
      const shelf = BookShelfFactory.create('shelf-2', 'Favorite Books', [mockBook]);

      expect(shelf.id).toBe('shelf-2');
      expect(shelf.title).toBe('Favorite Books');
      expect(shelf.books).toHaveLength(1);
      expect(shelf.books[0]).toBe(mockBook);
    });

    test('Successfully creates a bookshelf with multiple books', () => {
      const book2 = { ...mockBook, id: 'book-2', title: 'Another Book' };
      const shelf = BookShelfFactory.create('shelf-3', 'Reading List', [mockBook, book2]);

      expect(shelf.books).toHaveLength(2);
    });

    test('Throws error when title is missing', () => {
      expect(() => BookShelfFactory.create('shelf-4', '')).toThrow('Title is required to create a bookshelf.');
    });

    test('Throws error when title is null', () => {
      expect(() => BookShelfFactory.create('shelf-5', null as any)).toThrow('Title is required to create a bookshelf.');
    });

    test('Defaults to empty books array', () => {
      const shelf = BookShelfFactory.create('shelf-6', 'Empty Shelf');

      expect(shelf.books).toEqual([]);
    });
  });
});
