import { UserMapper } from 'src/infrastructure/mappers/user.mapper';
import { mockUser, mockUsers } from 'test/mocks/userMocks';
import { mockRole } from 'test/mocks/roleMocks';
import { mockUserEntity, mockUserEntityRestricted, mockUserEntityWithRole } from 'test/mocks/entityMocks';
import { UserEntity } from 'src/infrastructure/database/user.entity';
import { User } from 'src/domain/entities/user.entity';

describe('UserMapper', () => {
  describe('toDomain', () => {
    test('Converts UserEntity to User domain entity', () => {
      const result = UserMapper.toDomain(mockUserEntity);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(mockUser.id);
      expect(result.username).toBe(mockUser.username);
      expect(result.email).toBe(mockUser.email);
      expect(result.isRestricted).toBe(mockUser.isRestricted);
    });

    test('Converts user with role', () => {
      const result = UserMapper.toDomain(mockUserEntityWithRole);

      expect(result.role).toBeDefined();
      expect(result.role?.id).toBe(mockRole.id);
      expect(result.role?.name).toBe(mockRole.name);
    });

    test('Handles user without role', () => {
      const result = UserMapper.toDomain(mockUserEntity);

      expect(result.role).toBeUndefined();
    });

    test('Handles restricted user', () => {
      const result = UserMapper.toDomain(mockUserEntityRestricted);

      expect(result.isRestricted).toBe(true);
    });
  });

  describe('toPersistence', () => {
    test('Converts User domain entity to UserEntity', () => {
      const result = UserMapper.toPersistence(mockUser);

      expect(result.id).toBe(mockUser.id);
      expect(result.username).toBe(mockUser.username);
      expect(result.email).toBe(mockUser.email);
      expect(result.isRestricted).toBe(mockUser.isRestricted);
    });

    test('Converts user with role to persistence', () => {
      const userWithRole = { ...mockUser, role: mockRole };

      const result = UserMapper.toPersistence(userWithRole);

      expect(result.role).toBeDefined();
      expect(result.role?.id).toBe(mockRole.id);
    });

    test('Creates persistence object without role when user has no role', () => {
      const result = UserMapper.toPersistence(mockUser);

      expect(result.role).toBeUndefined();
    });
  });

  describe('toDomainList', () => {
    test('Converts array of UserEntity to array of User', () => {
      const mockEntities: UserEntity[] = [
        mockUserEntity,
        {
          ...mockUserEntity,
          id: 'user-2',
          username: 'alice',
        },
      ];

      const result = UserMapper.toDomainList(mockEntities);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(result[0].id).toBe(mockUser.id);
      expect(result[1].id).toBe('user-2');
    });

    test('Handles empty array', () => {
      const result = UserMapper.toDomainList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple users with different properties', () => {
      const mockEntities: UserEntity[] = [mockUserEntity, mockUserEntityRestricted];

      const result = UserMapper.toDomainList(mockEntities);

      expect(result[0].isRestricted).toBe(false);
      expect(result[1].isRestricted).toBe(true);
    });
  });

  describe('toPersistenceList', () => {
    test('Converts array of User to array of UserEntity', () => {
      const mockUsersArray = [mockUser, mockUsers[1]];

      const result = UserMapper.toPersistenceList(mockUsersArray);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockUser.id);
      expect(result[1].id).toBe(mockUsers[1].id);
    });

    test('Handles empty array', () => {
      const result = UserMapper.toPersistenceList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple users with roles', () => {
      const userWithRole = { ...mockUser, role: mockRole };
      const userWithoutRole = mockUsers[2];
      const mockUsersArray = [userWithRole, userWithoutRole];

      const result = UserMapper.toPersistenceList(mockUsersArray);

      expect(result[0].role).toBeDefined();
      expect(result[1].role).toBeUndefined();
    });
  });
});
