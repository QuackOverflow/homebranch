import { Test, TestingModule } from '@nestjs/testing';
import { IAuthorRepository } from 'src/application/interfaces/author-repository';
import { GetAuthorsUseCase } from 'src/application/usecases/author/get-authors.usecase';
import { OpenLibraryGateway } from 'src/infrastructure/gateways/open-library.gateway';
import { mock } from 'jest-mock-extended';
import { mockAuthor, mockAuthorWithoutEnrichment } from 'test/mocks/authorMocks';
import { Result } from 'src/core/result';
import { PaginationResult } from 'src/core/pagination_result';
import { Author } from 'src/domain/entities/author.entity';
import Mocked = jest.Mocked;

describe('GetAuthorsUseCase', () => {
  let useCase: GetAuthorsUseCase;
  let authorRepository: Mocked<IAuthorRepository>;
  let openLibraryGateway: Mocked<OpenLibraryGateway>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAuthorsUseCase,
        {
          provide: 'AuthorRepository',
          useValue: mock<IAuthorRepository>(),
        },
        {
          provide: OpenLibraryGateway,
          useValue: mock<OpenLibraryGateway>(),
        },
      ],
    }).compile();

    useCase = module.get<GetAuthorsUseCase>(GetAuthorsUseCase);
    authorRepository = module.get('AuthorRepository');
    openLibraryGateway = module.get(OpenLibraryGateway);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves paginated authors', async () => {
    const paginationResult: PaginationResult<Author[]> = {
      data: [mockAuthor],
      limit: 10,
      offset: 0,
      total: 1,
      nextCursor: null,
    };
    authorRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(authorRepository.findAll).toHaveBeenCalledWith(undefined, 10, 0);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(paginationResult);
  });

  test('Passes search query to repository', async () => {
    const paginationResult: PaginationResult<Author[]> = {
      data: [mockAuthor],
      limit: 10,
      offset: 0,
      total: 1,
      nextCursor: null,
    };
    authorRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    const result = await useCase.execute({ query: 'jane', limit: 10, offset: 0 });

    expect(authorRepository.findAll).toHaveBeenCalledWith('jane', 10, 0);
    expect(result.isSuccess()).toBe(true);
  });

  test('Returns empty list when no authors exist', async () => {
    const paginationResult: PaginationResult<Author[]> = {
      data: [],
      limit: 10,
      offset: 0,
      total: 0,
      nextCursor: null,
    };
    authorRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(result.isSuccess()).toBe(true);
    expect(result.value!.data).toEqual([]);
  });

  test('Triggers background enrichment for unenriched authors', async () => {
    const paginationResult: PaginationResult<Author[]> = {
      data: [mockAuthor, mockAuthorWithoutEnrichment],
      limit: 10,
      offset: 0,
      total: 2,
      nextCursor: null,
    };
    authorRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));
    openLibraryGateway.findAuthorEnrichment.mockResolvedValueOnce({
      biography: 'Charles Dickens was an English writer.',
      photoUrl: 'https://covers.openlibrary.org/a/olid/OL24638A-L.jpg',
    });
    authorRepository.updateByName.mockResolvedValueOnce(
      Result.ok(mockAuthorWithoutEnrichment),
    );

    await useCase.execute({ limit: 10, offset: 0 });
    // Allow background promises to resolve
    await new Promise((resolve) => setImmediate(resolve));

    expect(openLibraryGateway.findAuthorEnrichment).toHaveBeenCalledTimes(1);
    expect(openLibraryGateway.findAuthorEnrichment).toHaveBeenCalledWith(
      mockAuthorWithoutEnrichment.name,
    );
    expect(authorRepository.updateByName).toHaveBeenCalledTimes(1);
  });

  test('Does not trigger enrichment when author already has enrichment data', async () => {
    const paginationResult: PaginationResult<Author[]> = {
      data: [mockAuthor],
      limit: 10,
      offset: 0,
      total: 1,
      nextCursor: null,
    };
    authorRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));

    await useCase.execute({ limit: 10, offset: 0 });
    await new Promise((resolve) => setImmediate(resolve));

    expect(openLibraryGateway.findAuthorEnrichment).not.toHaveBeenCalled();
  });

  test('Skips update when Open Library returns no enrichment data', async () => {
    const paginationResult: PaginationResult<Author[]> = {
      data: [mockAuthorWithoutEnrichment],
      limit: 10,
      offset: 0,
      total: 1,
      nextCursor: null,
    };
    authorRepository.findAll.mockResolvedValueOnce(Result.ok(paginationResult));
    openLibraryGateway.findAuthorEnrichment.mockResolvedValueOnce({
      biography: null,
      photoUrl: null,
    });

    await useCase.execute({ limit: 10, offset: 0 });
    await new Promise((resolve) => setImmediate(resolve));

    expect(openLibraryGateway.findAuthorEnrichment).toHaveBeenCalledTimes(1);
    expect(authorRepository.updateByName).not.toHaveBeenCalled();
  });
});
