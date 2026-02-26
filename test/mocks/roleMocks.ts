import { Role } from 'src/domain/entities/role.entity';
import { Permission } from 'src/domain/value-objects/permission.enum';

export const mockRole = new Role('role-1', 'editor', [Permission.MANAGE_BOOKS]);

export const mockRoleAdmin = new Role('role-admin', 'admin', [
  Permission.MANAGE_BOOKS,
  Permission.MANAGE_USERS,
  Permission.MANAGE_ROLES,
]);

export const mockRoleEditor = new Role('role-editor', 'editor', [
  Permission.MANAGE_BOOKS,
  Permission.MANAGE_BOOKSHELVES,
]);

export const mockRoleViewer = new Role('role-viewer', 'viewer', []);
