export interface CreateBookRequest {
  title: string;
  author: string;
  isFavorite?: boolean;
  publishedYear?: number;
  fileName: string;
  coverImageFileName?: string;
}
