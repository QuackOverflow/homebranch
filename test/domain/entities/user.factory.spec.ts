import { UserFactory } from 'src/domain/entities/user.factory';
import { mockRole } from 'test/mocks/roleMocks';

describe('UserFactory', () => {
  describe('create', () => {
    test('Successfully creates a user with all fields', () => {
      const user = UserFactory.create('user-1', 'john', 'john@example.com', false, mockRole);

      expect(user.id).toBe('user-1');
      expect(user.username).toBe('john');
      expect(user.email).toBe('john@example.com');
      expect(user.isRestricted).toBe(false);
      expect(user.role).toBe(mockRole);
    });

    test('Successfully creates a user without role', () => {
      const user = UserFactory.create('user-2', 'jane', 'jane@example.com');

      expect(user.id).toBe('user-2');
      expect(user.username).toBe('jane');
      expect(user.email).toBe('jane@example.com');
      expect(user.isRestricted).toBe(false);
      expect(user.role).toBeUndefined();
    });

    test('Successfully creates a restricted user', () => {
      const user = UserFactory.create('user-3', 'bob', 'bob@example.com', true);

      expect(user.id).toBe('user-3');
      expect(user.isRestricted).toBe(true);
    });

    test('Defaults isRestricted to false', () => {
      const user = UserFactory.create('user-4', 'alice', 'alice@example.com');

      expect(user.isRestricted).toBe(false);
    });

    test('Throws error when username is missing', () => {
      expect(() => UserFactory.create('user-5', '', 'test@example.com')).toThrow(
        'Username and email are required to create a user.',
      );
    });

    test('Throws error when email is missing', () => {
      expect(() => UserFactory.create('user-6', 'testuser', '')).toThrow(
        'Username and email are required to create a user.',
      );
    });

    test('Throws error when both username and email are missing', () => {
      expect(() => UserFactory.create('user-7', '', '')).toThrow('Username and email are required to create a user.');
    });

    test('Throws error when username is null', () => {
      expect(() => UserFactory.create('user-8', null as any, 'test@example.com')).toThrow(
        'Username and email are required to create a user.',
      );
    });

    test('Throws error when email is null', () => {
      expect(() => UserFactory.create('user-9', 'testuser', null as any)).toThrow(
        'Username and email are required to create a user.',
      );
    });
  });
});
