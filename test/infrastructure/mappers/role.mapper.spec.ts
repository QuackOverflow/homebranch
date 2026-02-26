import { RoleMapper } from 'src/infrastructure/mappers/role.mapper';
import { mockRole, mockRoleAdmin, mockRoleEditor } from 'test/mocks/roleMocks';
import { mockRoleEntity, mockRoleEntityMultiplePermissions } from 'test/mocks/entityMocks';
import { RoleEntity } from 'src/infrastructure/database/role.entity';
import { Role } from 'src/domain/entities/role.entity';
import { Permission } from 'src/domain/value-objects/permission.enum';

describe('RoleMapper', () => {
  describe('toDomain', () => {
    test('Converts RoleEntity to Role domain entity', () => {
      const result = RoleMapper.toDomain(mockRoleEntity);

      expect(result).toBeInstanceOf(Role);
      expect(result.id).toBe(mockRole.id);
      expect(result.name).toBe(mockRole.name);
      expect(result.permissions).toEqual(mockRole.permissions);
    });

    test('Handles role with multiple permissions', () => {
      const result = RoleMapper.toDomain(mockRoleEntityMultiplePermissions);

      expect(result.permissions).toContain(Permission.MANAGE_BOOKS);
    });

    test('Handles role with single permission', () => {
      const roleWithSinglePermission: RoleEntity = {
        ...mockRoleEntity,
        permissions: [Permission.MANAGE_USERS],
      };

      const result = RoleMapper.toDomain(roleWithSinglePermission);

      expect(result.permissions).toHaveLength(1);
      expect(result.permissions[0]).toBe(Permission.MANAGE_USERS);
    });
  });

  describe('toPersistence', () => {
    test('Converts Role domain entity to RoleEntity', () => {
      const result = RoleMapper.toPersistence(mockRole);

      expect(result.id).toBe(mockRole.id);
      expect(result.name).toBe(mockRole.name);
      expect(result.permissions).toEqual(mockRole.permissions);
    });

    test('Preserves permissions in persistence object', () => {
      const result = RoleMapper.toPersistence(mockRoleAdmin);

      expect(result.permissions).toHaveLength(3);
      expect(result.permissions).toContain(Permission.MANAGE_BOOKS);
    });
  });

  describe('toDomainList', () => {
    test('Converts array of RoleEntity to array of Role', () => {
      const mockEntities: RoleEntity[] = [
        mockRoleEntity,
        {
          ...mockRoleEntity,
          id: 'role-2',
          name: 'viewer',
          permissions: [Permission.MANAGE_USERS],
        },
      ];

      const result = RoleMapper.toDomainList(mockEntities);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Role);
      expect(result[1]).toBeInstanceOf(Role);
      expect(result[0].id).toBe(mockRole.id);
      expect(result[1].id).toBe('role-2');
    });

    test('Handles empty array', () => {
      const result = RoleMapper.toDomainList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple roles with different permissions', () => {
      const mockEntities: RoleEntity[] = [mockRoleEntity, mockRoleEntityMultiplePermissions];

      const result = RoleMapper.toDomainList(mockEntities);

      expect(result[0].permissions).toHaveLength(1);
      expect(result[1].permissions.length).toBeGreaterThan(1);
    });
  });

  describe('toPersistenceList', () => {
    test('Converts array of Role to array of RoleEntity', () => {
      const mockRoles = [mockRole, mockRoleEditor];

      const result = RoleMapper.toPersistenceList(mockRoles);

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(mockRole.id);
      expect(result[1].id).toBe(mockRoleEditor.id);
    });

    test('Handles empty array', () => {
      const result = RoleMapper.toPersistenceList([]);

      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    test('Converts multiple roles with different permissions', () => {
      const mockRoles = [mockRole, mockRoleAdmin];

      const result = RoleMapper.toPersistenceList(mockRoles);

      expect(result[0].permissions).toHaveLength(1);
      expect(result[1].permissions).toHaveLength(3);
    });
  });
});
