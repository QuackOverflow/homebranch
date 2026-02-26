import { Test, TestingModule } from '@nestjs/testing';
import { ISavedPositionRepository } from 'src/application/interfaces/saved-position-repository';
import { GetSavedPositionUseCase } from 'src/application/usecases/saved-position/get-saved-position.usecase';
import { mock } from 'jest-mock-extended';
import { mockSavedPosition } from 'test/mocks/savedPositionMocks';
import { Result } from 'src/core/result';
import { SavedPositionNotFoundFailure } from 'src/domain/failures/saved-position.failures';
import Mocked = jest.Mocked;

describe('GetSavedPositionUseCase', () => {
  let useCase: GetSavedPositionUseCase;
  let savedPositionRepository: Mocked<ISavedPositionRepository>;

  const savedPositionNotFoundFailure = new SavedPositionNotFoundFailure();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSavedPositionUseCase,
        {
          provide: 'SavedPositionRepository',
          useValue: mock<ISavedPositionRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetSavedPositionUseCase>(GetSavedPositionUseCase);
    savedPositionRepository = module.get('SavedPositionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves a saved position by book and user', async () => {
    savedPositionRepository.findByBookAndUser.mockResolvedValueOnce(Result.ok(mockSavedPosition));

    const result = await useCase.execute({
      bookId: mockSavedPosition.bookId,
      userId: mockSavedPosition.userId,
    });

    expect(savedPositionRepository.findByBookAndUser).toHaveBeenCalledTimes(1);
    expect(savedPositionRepository.findByBookAndUser).toHaveBeenCalledWith(
      mockSavedPosition.bookId,
      mockSavedPosition.userId,
    );
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockSavedPosition);
  });

  test('Fails when saved position not found', async () => {
    savedPositionRepository.findByBookAndUser.mockResolvedValueOnce(Result.fail(savedPositionNotFoundFailure));

    const result = await useCase.execute({
      bookId: 'non-existent-book',
      userId: 'non-existent-user',
    });

    expect(savedPositionRepository.findByBookAndUser).toHaveBeenCalledTimes(1);
    expect(savedPositionRepository.findByBookAndUser).toHaveBeenCalledWith('non-existent-book', 'non-existent-user');
    expect(result.isFailure()).toBe(true);
    expect(result.failure).toEqual(savedPositionNotFoundFailure);
  });
});
