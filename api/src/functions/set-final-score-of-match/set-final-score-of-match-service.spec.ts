import { ISetFinalScoreOfMatchService, setFinalScoreOfMatchServiceFactory } from '@foci2020/api/functions/set-final-score-of-match/set-final-score-of-match-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { advanceTo, clear } from 'jest-date-mock';
import { addMinutes } from '@foci2020/shared/common/utils';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument } from '@foci2020/shared/common/test-data-factory';
import { MatchFinalScoreRequest } from '@foci2020/shared/types/requests';

describe('Set final score of match service', () => {
  let service: ISetFinalScoreOfMatchService;
  let mockDatabaseService: Mock<IDatabaseService>;

  const matchId = 'matchId';
  const finalScore: MatchFinalScoreRequest = {
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
    const queriedMatch = matchDocument({
      startTime: addMinutes(-120, now).toISOString()
    });
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

    it('if no match found', async () => {
      mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

      await service({
        matchId,
        finalScore
      }).catch(validateError('No match found', 404));
      validateFunctionCall(mockDatabaseService.functions.getMatchById, matchId);
      validateFunctionCall(mockDatabaseService.functions.updateMatch);
      expect.assertions(4);
    });

    it('if the match has yet to finish', async () => {
      const queriedMatch = matchDocument({
        startTime: addMinutes(-104, now).toISOString()
      });
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
      const queriedMatch = matchDocument({
        startTime: addMinutes(-120, now).toISOString()
      });
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
