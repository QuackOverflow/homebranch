import { BookEntity } from 'src/infrastructure/database/book.entity';
import { UserEntity } from 'src/infrastructure/database/user.entity';
import { RoleEntity } from 'src/infrastructure/database/role.entity';
import { BookShelfEntity } from 'src/infrastructure/database/book-shelf.entity';
import { SavedPositionEntity } from 'src/infrastructure/database/saved-position.entity';
import { Permission as PermissionEnum } from 'src/domain/value-objects/permission.enum';
import { mockBook } from './bookMocks';
import { mockUser } from './userMocks';
import { mockRole } from './roleMocks';
import { mockBookShelf } from './bookShelfMocks';
import { mockSavedPosition } from './savedPositionMocks';

/**
 * Database Entity Mocks - Used for persistence layer testing and mapper tests
 * These are derived from the domain entity mocks above
 */

export const mockBookEntity: BookEntity = {
  id: mockBook.id,
  title: mockBook.title,
  author: mockBook.author,
  fileName: mockBook.fileName,
  isFavorite: mockBook.isFavorite,
  publishedYear: mockBook.publishedYear,
  coverImageFileName: mockBook.coverImageFileName,
};

export const mockUserEntity: UserEntity = {
  id: mockUser.id,
  username: mockUser.username,
  email: mockUser.email,
  isRestricted: mockUser.isRestricted,
  role: undefined,
};

export const mockRoleEntity: RoleEntity = {
  id: mockRole.id,
  name: mockRole.name,
  permissions: mockRole.permissions,
};

export const mockBookShelfEntity: BookShelfEntity = {
  id: mockBookShelf.id,
  title: mockBookShelf.title,
  books: [],
};

export const mockSavedPositionEntity: SavedPositionEntity = {
  bookId: mockSavedPosition.bookId,
  userId: mockSavedPosition.userId,
  position: mockSavedPosition.position,
  deviceName: mockSavedPosition.deviceName,
  createdAt: mockSavedPosition.createdAt,
  updatedAt: mockSavedPosition.updatedAt,
};

/**
 * Entity variants with different field values for testing edge cases
 */

export const mockBookEntityWithAllFields: BookEntity = {
  ...mockBookEntity,
  publishedYear: 2023,
  coverImageFileName: 'cover.jpg',
};

export const mockBookEntityWithoutOptional: BookEntity = {
  ...mockBookEntity,
  publishedYear: undefined,
  coverImageFileName: undefined,
};

export const mockUserEntityWithRole: UserEntity = {
  ...mockUserEntity,
  role: mockRoleEntity,
};

export const mockUserEntityRestricted: UserEntity = {
  ...mockUserEntity,
  isRestricted: true,
};

export const mockRoleEntityMultiplePermissions: RoleEntity = {
  ...mockRoleEntity,
  permissions: [PermissionEnum.MANAGE_BOOKS, PermissionEnum.MANAGE_USERS, PermissionEnum.MANAGE_ROLES],
};

export const mockBookShelfEntityWithBooks: BookShelfEntity = {
  ...mockBookShelfEntity,
  books: [mockBookEntity],
};

export const mockBookShelfEntityEmpty: BookShelfEntity = {
  ...mockBookShelfEntity,
  books: [],
};
