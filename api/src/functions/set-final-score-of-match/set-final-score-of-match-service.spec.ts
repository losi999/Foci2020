import { ISetFinalScoreOfMatchService, setFinalScoreOfMatchServiceFactory } from '@/functions/set-final-score-of-match/set-final-score-of-match-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { Score, MatchDocument } from '@/types/types';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';

describe('Set final score of match service', () => {
  let service: ISetFinalScoreOfMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;

  const matchId = 'matchId';
  const finalScore: Score = {
    homeScore: 1,
    awayScore: 2
  };
  const now = new Date(2020, 3, 9, 23, 40, 0);
  beforeEach(() => {
    mockDatabaseService = createMockService('getMatchById', 'updateMatch');

    advanceTo(now);

    service = setFinalScoreOfMatchServiceFactory(mockDatabaseService.service);
  });

  afterEach(() => {
    clear();
  });

  it('should return undefined if match is updated with final score', async () => {
    const queriedMatch = {
      startTime: addMinutes(-120, now).toISOString()
    } as MatchDocument;
    mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

    mockDatabaseService.functions.updateMatch.mockResolvedValue(undefined);

    const result = await service({
      matchId,
      finalScore
    });
    expect(result).toBeUndefined();
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockDatabaseService.functions.updateMatch).toHaveBeenCalledWith({
      ...queriedMatch,
      finalScore
    });
    expect.assertions(3);
  });

  it('should throw error if unable to query match by Id', async () => {
    mockDatabaseService.functions.getMatchById.mockRejectedValue('This is a dynamo error');

    await service({
      matchId,
      finalScore
    }).catch(validateError('Unable to query match by Id', 500));
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockDatabaseService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if the match has yet to finish', async () => {
    const queriedMatch = {
      startTime: addMinutes(-104, now).toISOString()
    } as MatchDocument;
    mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

    await service({
      matchId,
      finalScore
    }).catch(validateError('Final score cannot be set during the game', 400));
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockDatabaseService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if unable to update match', async () => {
    const queriedMatch = {
      startTime: addMinutes(-120, now).toISOString()
    } as MatchDocument;
    mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

    mockDatabaseService.functions.updateMatch.mockRejectedValue('This is a dynamo error');

    await service({
      matchId,
      finalScore
    }).catch(validateError('Unable to update match', 500));
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockDatabaseService.functions.updateMatch).toHaveBeenCalledWith({
      ...queriedMatch,
      finalScore
    });
    expect.assertions(4);
  });
});
