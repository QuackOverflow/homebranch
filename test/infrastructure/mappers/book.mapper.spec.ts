import { BookMapper } from 'src/infrastructure/mappers/book.mapper';
import { mockBook, mockBookFavorite } from 'test/mocks/bookMocks';
import { mockBookEntity, mockBookEntityWithAllFields, mockBookEntityWithoutOptional } from 'test/mocks/entityMocks';
import { BookEntity } from 'src/infrastructure/database/book.entity';
import { Book } from 'src/domain/entities/book.entity';

describe('BookMapper', () => {
  describe('toDomain', () => {
    test('Converts BookEntity to Book domain entity', () => {
      const result = BookMapper.toDomain(mockBookEntity);

      expect(result).toBeInstanceOf(Book);
      expect(result.id).toBe(mockBook.id);
      expect(result.title).toBe(mockBook.title);
      expect(result.author).toBe(mockBook.author);
      expect(result.fileName).toBe(mockBook.fileName);
      expect(result.isFavorite).toBe(mockBook.isFavorite);
      expect(result.publishedYear).toBe(mockBook.publishedYear);
      expect(result.coverImageFileName).toBe(mockBook.coverImageFileName);
    });

    test('Handles book with all fields', () => {
      const result = BookMapper.toDomain(mockBookEntityWithAllFields);

      expect(result.publishedYear).toBe(2023);
      expect(result.coverImageFileName).toBe('cover.jpg');
    });

    test('Handles book with optional fields as undefined', () => {
      const result = BookMapper.toDomain(mockBookEntityWithoutOptional);

      expect(result.publishedYear).toBeUndefined();
      expect(result.coverImageFileName).toBeUndefined();
    });
  });

  describe('toPersistence', () => {
    test('Converts Book domain entity to BookEntity', () => {
      const result = BookMapper.toPersistence(mockBook);

      expect(result.id).toBe(mockBook.id);
      expect(result.title).toBe(mockBook.title);
      expect(result.author).toBe(mockBook.author);
      expect(result.fileName).toBe(mockBook.fileName);
      expect(result.isFavorite).toBe(mockBook.isFavorite);
      expect(result.publishedYear).toBe(mockBook.publishedYear);
      expect(result.coverImageFileName).toBe(mockBook.coverImageFileName);
    });

    test('Creates persistence object with correct structure', () => {
      const result = BookMapper.toPersistence(mockBook);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('author');
      expect(result).toHaveProperty('fileName');
      expect(result).toHaveProperty('isFavorite');
      expect(result).toHaveProperty('publishedYear');
      expect(result).toHaveProperty('coverImageFileName');
    });
  });

  describe('toDomainList', () => {
    test('Converts array of BookEntity to array of Book', () => {
      const mockEntities: BookEntity[] = [
        mockBookEntity,
        {
          ...mockBookEntity,
          id: 'book-2',
          title: 'Another Book',
        },
      ];

      const result = BookMapper.toDomainList(mockEntities);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Book);
      expect(result[1]).toBeInstanceOf(Book);
      expect(result[0].id).toBe(mockBook.id);
      expect(result[1].id).toBe('book-2');
    });

    test('Handles empty array', () => {
      const result = BookMapper.toDomainList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple books with different properties', () => {
      const mockEntities: BookEntity[] = [mockBookEntity, mockBookEntityWithAllFields];

      const result = BookMapper.toDomainList(mockEntities);

      expect(result[0].isFavorite).toBe(false);
      expect(result[1].isFavorite).toBe(false);
      expect(result[1].publishedYear).toBe(2023);
    });
  });

  describe('toPersistenceList', () => {
    test('Converts array of Book to array of BookEntity', () => {
      const mockBooks = [mockBook, mockBookFavorite];

      const result = BookMapper.toPersistenceList(mockBooks);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockBook.id);
      expect(result[1].id).toBe(mockBookFavorite.id);
      expect(result[1].isFavorite).toBe(true);
    });

    test('Handles empty array', () => {
      const result = BookMapper.toPersistenceList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
