import { ISetFinalScoreOfMatchService, setFinalScoreOfMatchServiceFactory } from '@/functions/set-final-score-of-match/set-final-score-of-match-service';
import { Mock, createMockService, addMinutes, validateError } from '@/common';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Score, MatchDocument } from '@/types/types';
import { advanceTo, clear } from 'jest-date-mock';

describe('Set final score of match service', () => {
  let service: ISetFinalScoreOfMatchService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  const matchId = 'matchId';
  const finalScore: Score = {
    homeScore: 1,
    awayScore: 2
  };
  const now = new Date(2020, 3, 9, 23, 40, 0);
  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchById', 'updateMatch');

    advanceTo(now);

    service = setFinalScoreOfMatchServiceFactory(mockMatchDocumentService.service);
  });

  afterEach(() => {
    clear();
  });

  it('should return undefined if match is updated with final score', async () => {
    const queriedMatch = {
      startTime: addMinutes(-120, now).toISOString()
    } as MatchDocument;
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(queriedMatch);

    mockMatchDocumentService.functions.updateMatch.mockResolvedValue(undefined);

    const result = await service({
      matchId,
      finalScore
    });
    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentService.functions.updateMatch).toHaveBeenCalledWith({
      ...queriedMatch,
      finalScore
    });
    expect.assertions(3);
  });

  it('should throw error if unable to query match by Id', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockRejectedValue('This is a dynamo error');

    await service({
      matchId,
      finalScore
    }).catch(validateError('Unable to query match by Id', 500));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if the match has yet to finish', async () => {
    const queriedMatch = {
      startTime: addMinutes(-104, now).toISOString()
    } as MatchDocument;
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(queriedMatch);

    await service({
      matchId,
      finalScore
    }).catch(validateError('Final score cannot be set during the game', 400));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentService.functions.updateMatch).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if unable to update match', async () => {
    const queriedMatch = {
      startTime: addMinutes(-120, now).toISOString()
    } as MatchDocument;
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(queriedMatch);

    mockMatchDocumentService.functions.updateMatch.mockRejectedValue('This is a dynamo error');

    await service({
      matchId,
      finalScore
    }).catch(validateError('Unable to update match', 500));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockMatchDocumentService.functions.updateMatch).toHaveBeenCalledWith({
      ...queriedMatch,
      finalScore
    });
    expect.assertions(4);
  });
});
