import { ISetFinalScoreOfMatchService, setFinalScoreOfMatchServiceFactory } from '@/functions/set-final-score-of-match/set-final-score-of-match-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
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
    validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
    validateFunctionCall(mockDatabaseService.functions.updateMatch, {
      ...queriedMatch,
      finalScore
    });
    expect.assertions(3);
  });
  describe('should throw error', () => {
    it('if unable to query match by Id', async () => {
      mockDatabaseService.functions.getMatchById.mockRejectedValue('This is a dynamo error');

      await service({
        matchId,
        finalScore
      }).catch(validateError('Unable to query match by Id', 500));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(4);
    });

    it('if the match has yet to finish', async () => {
      const queriedMatch = {
        startTime: addMinutes(-104, now).toISOString()
      } as MatchDocument;
      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

      await service({
        matchId,
        finalScore
      }).catch(validateError('Final score cannot be set during the game', 400));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(4);
    });

    it('if unable to update match', async () => {
      const queriedMatch = {
        startTime: addMinutes(-120, now).toISOString()
      } as MatchDocument;
      mockDatabaseService.functions.getMatchById.mockResolvedValue(queriedMatch);

      mockDatabaseService.functions.updateMatch.mockRejectedValue('This is a dynamo error');

      await service({
        matchId,
        finalScore
      }).catch(validateError('Unable to update match', 500));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.updateMatch, {
        ...queriedMatch,
        finalScore
      });
      expect.assertions(4);
    });
  });
});
