import { Test, TestingModule } from '@nestjs/testing';
import { ISavedPositionRepository } from 'src/application/interfaces/saved-position-repository';
import { GetSavedPositionsUseCase } from 'src/application/usecases/saved-position/get-saved-positions.usecase';
import { mock } from 'jest-mock-extended';
import { mockSavedPosition } from 'test/mocks/savedPositionMocks';
import { Result } from 'src/core/result';
import { SavedPosition } from 'src/domain/entities/saved-position.entity';
import Mocked = jest.Mocked;

describe('GetSavedPositionsUseCase', () => {
  let useCase: GetSavedPositionsUseCase;
  let savedPositionRepository: Mocked<ISavedPositionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSavedPositionsUseCase,
        {
          provide: 'SavedPositionRepository',
          useValue: mock<ISavedPositionRepository>(),
        },
      ],
    }).compile();

    useCase = module.get<GetSavedPositionsUseCase>(GetSavedPositionsUseCase);
    savedPositionRepository = module.get('SavedPositionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Successfully retrieves all saved positions for a user', async () => {
    const mockSavedPositions = [
      mockSavedPosition,
      new SavedPosition(
        'book-789',
        mockSavedPosition.userId,
        'epubcfi(/6/4!/4/2/1:0)',
        'Mobile Device',
        new Date('2024-02-01'),
        new Date('2024-02-01'),
      ),
    ];
    savedPositionRepository.findAllByUser.mockResolvedValueOnce(Result.ok(mockSavedPositions));

    const result = await useCase.execute({ userId: mockSavedPosition.userId });

    expect(savedPositionRepository.findAllByUser).toHaveBeenCalledTimes(1);
    expect(savedPositionRepository.findAllByUser).toHaveBeenCalledWith(mockSavedPosition.userId);
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual(mockSavedPositions);
  });

  test('Returns empty array when user has no saved positions', async () => {
    savedPositionRepository.findAllByUser.mockResolvedValueOnce(Result.ok([]));

    const result = await useCase.execute({ userId: 'user-with-no-positions' });

    expect(savedPositionRepository.findAllByUser).toHaveBeenCalledTimes(1);
    expect(savedPositionRepository.findAllByUser).toHaveBeenCalledWith('user-with-no-positions');
    expect(result.isSuccess()).toBe(true);
    expect(result.value).toEqual([]);
  });
});
