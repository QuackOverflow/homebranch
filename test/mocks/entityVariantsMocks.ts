import { Book } from 'src/domain/entities/book.entity';
import { User } from 'src/domain/entities/user.entity';
import { Role } from 'src/domain/entities/role.entity';
import { BookShelf } from 'src/domain/entities/bookshelf.entity';
import { SavedPosition } from 'src/domain/entities/saved-position.entity';
import { Permission } from 'src/domain/value-objects/permission.enum';
import { mockBook } from './bookMocks';
import { mockUser } from './userMocks';
import { mockRole } from './roleMocks';
import { mockBookShelf } from './bookShelfMocks';
import { mockSavedPosition } from './savedPositionMocks';

/**
 * Domain Entity Variants - Used for testing different scenarios and edge cases
 */

// Book variants
export const mockBookFavorite: Book = new Book(
  'book-fav',
  'Favorite Book',
  'Famous Author',
  'favorite-book.epub',
  true,
  2023,
  'favorite-cover.jpg',
);

export const mockBookMinimal: Book = new Book('book-min', 'Minimal Book', 'Test Author', 'minimal.epub', false);

export const mockBooks: Book[] = [mockBook, mockBookFavorite, mockBookMinimal];

// User variants
export const mockUserAdmin: User = new User('user-admin', 'admin', 'admin@example.com', false, mockRole);

export const mockUserRestricted: User = new User('user-restricted', 'restricted', 'restricted@example.com', true);

export const mockUsers: User[] = [mockUser, mockUserAdmin, mockUserRestricted];

// Role variants
export const mockRoleAdmin: Role = new Role('role-admin', 'admin', [
  Permission.MANAGE_BOOKS,
  Permission.MANAGE_USERS,
  Permission.MANAGE_ROLES,
]);

export const mockRoleEditor: Role = new Role('role-editor', 'editor', [
  Permission.MANAGE_BOOKS,
  Permission.MANAGE_BOOKSHELVES,
]);

export const mockRoleViewer: Role = new Role('role-viewer', 'viewer', []);

export const mockRoles: Role[] = [mockRole, mockRoleAdmin, mockRoleEditor, mockRoleViewer];

// BookShelf variants
export const mockBookShelfWithBooks: BookShelf = new BookShelf('shelf-with-books', 'My Favorites', [
  mockBook,
  mockBookFavorite,
]);

export const mockBookShelfEmpty: BookShelf = new BookShelf('shelf-empty', 'Empty Shelf', []);

export const mockBookShelves: BookShelf[] = [mockBookShelf, mockBookShelfWithBooks, mockBookShelfEmpty];

// SavedPosition variants
export const mockSavedPositionMobile: SavedPosition = new SavedPosition(
  'book-123',
  'user-456',
  'epubcfi(/6/4!/4/2/1:50)',
  'Mobile App',
  new Date('2024-02-01'),
  new Date('2024-02-01'),
);

export const mockSavedPositionDesktop: SavedPosition = new SavedPosition(
  'book-789',
  'user-456',
  'epubcfi(/6/4!/4/2/1:75)',
  'Desktop Browser',
  new Date('2024-02-02'),
  new Date('2024-02-02'),
);

export const mockSavedPositions: SavedPosition[] = [
  mockSavedPosition,
  mockSavedPositionMobile,
  mockSavedPositionDesktop,
];
