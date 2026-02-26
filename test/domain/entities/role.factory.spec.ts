import { RoleFactory } from 'src/domain/entities/role.factory';
import { Permission } from 'src/domain/value-objects/permission.enum';

describe('RoleFactory', () => {
  describe('create', () => {
    test('Successfully creates a role with permissions', () => {
      const role = RoleFactory.create('role-1', 'editor', [Permission.MANAGE_BOOKS]);

      expect(role.id).toBe('role-1');
      expect(role.name).toBe('editor');
      expect(role.permissions).toEqual([Permission.MANAGE_BOOKS]);
    });

    test('Successfully creates a role with multiple permissions', () => {
      const role = RoleFactory.create('role-2', 'admin', [Permission.MANAGE_BOOKS, Permission.MANAGE_USERS]);

      expect(role.id).toBe('role-2');
      expect(role.name).toBe('admin');
      expect(role.permissions).toHaveLength(2);
    });

    test('Successfully creates a role with no permissions', () => {
      const role = RoleFactory.create('role-3', 'guest', []);

      expect(role.id).toBe('role-3');
      expect(role.name).toBe('guest');
      expect(role.permissions).toEqual([]);
    });

    test('Throws error when name is missing', () => {
      expect(() => RoleFactory.create('role-4', '', [Permission.MANAGE_USERS])).toThrow(
        'Name is required to create a role.',
      );
    });

    test('Throws error when name is null', () => {
      expect(() => RoleFactory.create('role-5', null as any, [Permission.MANAGE_USERS])).toThrow(
        'Name is required to create a role.',
      );
    });
  });
});
