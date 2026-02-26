import { BookShelfMapper } from 'src/infrastructure/mappers/book-shelf.mapper';
import { mockBookShelf, mockBookShelfWithBooks } from 'test/mocks/bookShelfMocks';
import { mockBook } from 'test/mocks/bookMocks';
import { mockBookShelfEntity, mockBookShelfEntityEmpty, mockBookShelfEntityWithBooks } from 'test/mocks/entityMocks';
import { BookShelfEntity } from 'src/infrastructure/database/book-shelf.entity';
import { BookShelf } from 'src/domain/entities/bookshelf.entity';

describe('BookShelfMapper', () => {
  describe('toDomain', () => {
    test('Converts BookShelfEntity to BookShelf domain entity', () => {
      const result = BookShelfMapper.toDomain(mockBookShelfEntity);

      expect(result).toBeInstanceOf(BookShelf);
      expect(result.id).toBe(mockBookShelf.id);
      expect(result.title).toBe(mockBookShelf.title);
      expect(result.books).toEqual([]);
    });

    test('Converts bookshelf with books', () => {
      const result = BookShelfMapper.toDomain(mockBookShelfEntityWithBooks);

      expect(result.books).toHaveLength(1);
      expect(result.books[0].id).toBe(mockBook.id);
    });

    test('Handles bookshelf with empty books array', () => {
      const result = BookShelfMapper.toDomain(mockBookShelfEntityEmpty);

      expect(result.books).toEqual([]);
    });
  });

  describe('toPersistence', () => {
    test('Converts BookShelf domain entity to BookShelfEntity', () => {
      const result = BookShelfMapper.toPersistence(mockBookShelf);

      expect(result.id).toBe(mockBookShelf.id);
      expect(result.title).toBe(mockBookShelf.title);
      expect(result.books).toEqual([]);
    });

    test('Converts bookshelf with books to persistence', () => {
      const result = BookShelfMapper.toPersistence(mockBookShelfWithBooks);

      expect(result.books).toHaveLength(2);
      expect(result.books[0].id).toBe(mockBook.id);
    });
  });

  describe('toDomainList', () => {
    test('Converts array of BookShelfEntity to array of BookShelf', () => {
      const mockEntities: BookShelfEntity[] = [
        mockBookShelfEntity,
        {
          ...mockBookShelfEntity,
          id: 'shelf-2',
          title: 'Another Shelf',
          books: [],
        },
      ];

      const result = BookShelfMapper.toDomainList(mockEntities);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BookShelf);
      expect(result[1]).toBeInstanceOf(BookShelf);
      expect(result[0].id).toBe(mockBookShelf.id);
      expect(result[1].id).toBe('shelf-2');
    });

    test('Handles empty array', () => {
      const result = BookShelfMapper.toDomainList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple shelves with different contents', () => {
      const mockEntities: BookShelfEntity[] = [mockBookShelfEntity, mockBookShelfEntityWithBooks];

      const result = BookShelfMapper.toDomainList(mockEntities);

      expect(result[0].books).toHaveLength(0);
      expect(result[1].books).toHaveLength(1);
    });
  });

  describe('toPersistenceList', () => {
    test('Converts array of BookShelf to array of BookShelfEntity', () => {
      const mockShelves = [mockBookShelf, mockBookShelfWithBooks];

      const result = BookShelfMapper.toPersistenceList(mockShelves);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockBookShelf.id);
      expect(result[1].id).toBe(mockBookShelfWithBooks.id);
    });

    test('Handles empty array', () => {
      const result = BookShelfMapper.toPersistenceList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple shelves with books', () => {
      const mockShelves = [mockBookShelfWithBooks, mockBookShelf];

      const result = BookShelfMapper.toPersistenceList(mockShelves);

      expect(result[0].books).toHaveLength(2);
      expect(result[1].books).toHaveLength(0);
    });
  });
});
