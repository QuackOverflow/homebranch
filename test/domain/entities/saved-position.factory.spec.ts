import { SavedPositionFactory } from 'src/domain/entities/saved-position.factory';

describe('SavedPositionFactory', () => {
  describe('create', () => {
    test('Successfully creates a saved position with all fields', () => {
      const now = new Date();
      const position = SavedPositionFactory.create(
        'book-1',
        'user-1',
        'epubcfi(/6/4!/4/2/1:0)',
        'Desktop Browser',
        now,
        now,
      );

      expect(position.bookId).toBe('book-1');
      expect(position.userId).toBe('user-1');
      expect(position.position).toBe('epubcfi(/6/4!/4/2/1:0)');
      expect(position.deviceName).toBe('Desktop Browser');
      expect(position.createdAt).toBe(now);
      expect(position.updatedAt).toBe(now);
    });

    test('Successfully creates a saved position without timestamps', () => {
      const position = SavedPositionFactory.create('book-2', 'user-2', 'epubcfi(/6/4!/4/2/1:50)', 'Mobile App');

      expect(position.bookId).toBe('book-2');
      expect(position.userId).toBe('user-2');
      expect(position.position).toBe('epubcfi(/6/4!/4/2/1:50)');
      expect(position.deviceName).toBe('Mobile App');
      expect(position.createdAt).toBeDefined();
      expect(position.updatedAt).toBeDefined();
    });

    test('Defaults to current date when createdAt is not provided', () => {
      const before = new Date();
      const position = SavedPositionFactory.create('book-3', 'user-3', 'epubcfi(/6/4!/4/2/1:25)', 'Tablet');
      const after = new Date();

      expect(position.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(position.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    test('Defaults to current date when updatedAt is not provided', () => {
      const before = new Date();
      const position = SavedPositionFactory.create('book-4', 'user-4', 'epubcfi(/6/4!/4/2/1:75)', 'E-ink Reader');
      const after = new Date();

      expect(position.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(position.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    test('Throws error when bookId is missing', () => {
      expect(() => SavedPositionFactory.create('', 'user-5', 'epubcfi(/6/4!/4/2/1:0)', 'Device')).toThrow(
        'Book ID and User ID are required to create a saved position.',
      );
    });

    test('Throws error when userId is missing', () => {
      expect(() => SavedPositionFactory.create('book-5', '', 'epubcfi(/6/4!/4/2/1:0)', 'Device')).toThrow(
        'Book ID and User ID are required to create a saved position.',
      );
    });

    test('Throws error when both bookId and userId are missing', () => {
      expect(() => SavedPositionFactory.create('', '', 'epubcfi(/6/4!/4/2/1:0)', 'Device')).toThrow(
        'Book ID and User ID are required to create a saved position.',
      );
    });

    test('Throws error when bookId is null', () => {
      expect(() => SavedPositionFactory.create(null as any, 'user-6', 'epubcfi(/6/4!/4/2/1:0)', 'Device')).toThrow(
        'Book ID and User ID are required to create a saved position.',
      );
    });

    test('Throws error when userId is null', () => {
      expect(() => SavedPositionFactory.create('book-6', null as any, 'epubcfi(/6/4!/4/2/1:0)', 'Device')).toThrow(
        'Book ID and User ID are required to create a saved position.',
      );
    });
  });
});
