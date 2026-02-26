import { Test, TestingModule } from '@nestjs/testing';
import { IBookShelfRepository } from 'src/application/interfaces/bookshelf-repository';
import { CreateBookShelfUseCase } from 'src/application/usecases/bookshelf/create-book-shelf-use-case.service';
import { mock } from 'jest-mock-extended';
import { Result, UnexpectedFailure } from 'src/core/result';
import Mocked = jest.Mocked;

describe('CreateBookShelfUseCase', () => {
  let useCase: CreateBookShelfUseCase;
  let bookShelfRepository: Mocked<IBookShelfRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateBookShelfUseCase,
        {
          provide: 'BookShelfRepository',
          useValue: mock<IBookShelfRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<CreateBookShelfUseCase>(CreateBookShelfUseCase);
    bookShelfRepository = module.get('BookShelfRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully creates a bookshelf', async () => {
    const dto = { title: 'My Bookshelf' };
    const createdBookShelf = { id: '123', title: dto.title, books: [] };

    bookShelfRepository.create.mockResolvedValueOnce(Result.ok(createdBookShelf));

    const result = await useCase.execute(dto);

    expect(bookShelfRepository.create).toHaveBeenCalledTimes(1);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(createdBookShelf);
  });

  test('Fails when create fails', async () => {
    const dto = { title: 'My Bookshelf' };
    const failure = new UnexpectedFailure('Failed to create bookshelf');

    bookShelfRepository.create.mockResolvedValueOnce(Result.fail(failure));

    const result = await useCase.execute(dto);

    expect(bookShelfRepository.create).toHaveBeenCalledTimes(1);
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(failure);
  });
});
