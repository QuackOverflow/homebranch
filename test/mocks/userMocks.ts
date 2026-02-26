import { User } from 'src/domain/entities/user.entity';
import { mockRole } from './roleMocks';

export const mockUser = new User('user-1', 'alice', 'alice@example.com', false);

export const mockUserAdmin = new User('user-admin', 'admin', 'admin@example.com', false, mockRole);

export const mockUserRestricted = new User('user-restricted', 'restricted', 'restricted@example.com', true);

export const mockUsers = [mockUser, mockUserAdmin, mockUserRestricted];
