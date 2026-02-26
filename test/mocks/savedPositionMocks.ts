import { SavedPosition } from 'src/domain/entities/saved-position.entity';

export const mockSavedPosition = new SavedPosition(
  'book-456',
  'user-1',
  'epubcfi(/6/4!/4/2/1:0)',
  'Chrome Desktop',
  new Date('2024-01-01'),
  new Date('2024-01-01'),
);
