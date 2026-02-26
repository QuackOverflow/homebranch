import { SavedPositionMapper } from 'src/infrastructure/mappers/saved-position.mapper';
import { mockSavedPosition } from 'test/mocks/savedPositionMocks';
import { SavedPositionEntity } from 'src/infrastructure/database/saved-position.entity';
import { SavedPosition } from 'src/domain/entities/saved-position.entity';

describe('SavedPositionMapper', () => {
  const mockSavedPositionEntity: SavedPositionEntity = {
    bookId: mockSavedPosition.bookId,
    userId: mockSavedPosition.userId,
    position: mockSavedPosition.position,
    deviceName: mockSavedPosition.deviceName,
    createdAt: mockSavedPosition.createdAt,
    updatedAt: mockSavedPosition.updatedAt,
  };

  describe('toDomain', () => {
    test('Converts SavedPositionEntity to SavedPosition domain entity', () => {
      const result = SavedPositionMapper.toDomain(mockSavedPositionEntity);

      expect(result).toBeInstanceOf(SavedPosition);
      expect(result.bookId).toBe(mockSavedPosition.bookId);
      expect(result.userId).toBe(mockSavedPosition.userId);
      expect(result.position).toBe(mockSavedPosition.position);
      expect(result.deviceName).toBe(mockSavedPosition.deviceName);
    });

    test('Preserves timestamps when converting', () => {
      const now = new Date();
      const entity: SavedPositionEntity = {
        ...mockSavedPositionEntity,
        createdAt: now,
        updatedAt: now,
      };

      const result = SavedPositionMapper.toDomain(entity);

      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
    });

    test('Handles different device names', () => {
      const entity: SavedPositionEntity = {
        ...mockSavedPositionEntity,
        deviceName: 'Mobile App iOS',
      };

      const result = SavedPositionMapper.toDomain(entity);

      expect(result.deviceName).toBe('Mobile App iOS');
    });

    test('Handles different EPUB CFI positions', () => {
      const entity: SavedPositionEntity = {
        ...mockSavedPositionEntity,
        position: 'epubcfi(/6/4!/4/2/1:100)',
      };

      const result = SavedPositionMapper.toDomain(entity);

      expect(result.position).toBe('epubcfi(/6/4!/4/2/1:100)');
    });
  });

  describe('toPersistence', () => {
    test('Converts SavedPosition domain entity to SavedPositionEntity', () => {
      const result = SavedPositionMapper.toPersistence(mockSavedPosition);

      expect(result.bookId).toBe(mockSavedPosition.bookId);
      expect(result.userId).toBe(mockSavedPosition.userId);
      expect(result.position).toBe(mockSavedPosition.position);
      expect(result.deviceName).toBe(mockSavedPosition.deviceName);
    });

    test('Creates persistence object with correct structure', () => {
      const result = SavedPositionMapper.toPersistence(mockSavedPosition);

      expect(result).toHaveProperty('bookId');
      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('position');
      expect(result).toHaveProperty('deviceName');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    test('Preserves timestamps in persistence object', () => {
      const now = new Date();
      const position = new SavedPosition('book-1', 'user-1', 'epubcfi(/6/4!/4/2/1:0)', 'Web Browser', now, now);

      const result = SavedPositionMapper.toPersistence(position);

      expect(result.createdAt).toEqual(now);
      expect(result.updatedAt).toEqual(now);
    });
  });
});
