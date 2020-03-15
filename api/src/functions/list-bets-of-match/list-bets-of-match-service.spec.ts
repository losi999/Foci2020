import { IListBetsOfMatchService, listBetsOfMatchServiceFactory } from '@/functions/list-bets-of-match/list-bets-of-match-service';
import { Mock, createMockService, addMinutes, validateError } from '@/common';
import { IBetDocumentService } from '@/services/bet-document-service';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { advanceTo, clear } from 'jest-date-mock';
import { MatchDocument, BetDocument, BetResponse } from '@/types/types';

describe('List bets of match service', () => {
  let service: IListBetsOfMatchService;
  let mockBetDocumentService: Mock<IBetDocumentService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  const now = new Date(2020, 2, 11, 23, 55, 0);
  const matchId = 'matchId';
  const userId = 'userId';
  const userId2 = 'userId2';

  beforeEach(() => {
    mockBetDocumentService = createMockService('queryBetsByMatchId');
    mockBetDocumentConverter = createMockService('toResponseList');
    mockMatchDocumentService = createMockService('queryMatchById');

    advanceTo(now);

    service = listBetsOfMatchServiceFactory(mockBetDocumentService.service, mockBetDocumentConverter.service, mockMatchDocumentService.service);
  });

  afterEach(() => {
    clear();
  });

  it('should return a list of bets with scores hidden', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(6, now).toISOString()
    } as MatchDocument);
    const queriedBets = [{
      userId: userId2
    }] as BetDocument[];
    mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
    const convertedResponse = [{ userId: userId2 }] as BetResponse[];
    mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

    const result = await service({
      matchId,
      userId
    });
    expect(result).toEqual(convertedResponse);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedBets, userId);
    expect.assertions(4);
  });

  it('should return a list of bets with scores visible because betting time is expired', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(4, now).toISOString()
    } as MatchDocument);
    const queriedBets = [{
      userId: userId2
    }] as BetDocument[];
    mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
    const convertedResponse = [{ userId: userId2 }] as BetResponse[];
    mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

    const result = await service({
      matchId,
      userId
    });
    expect(result).toEqual(convertedResponse);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedBets, undefined);
    expect.assertions(4);
  });

  it('should return a list of bets with scores visible because player has placed a bet', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(6, now).toISOString()
    } as MatchDocument);
    const queriedBets = [
      {
        userId: userId2
      }, {
        userId
      }
    ] as BetDocument[];
    mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
    const convertedResponse = [
      {
        userId: userId2
      },
      {
        userId
      }
    ] as BetResponse[];
    mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

    const result = await service({
      matchId,
      userId
    });
    expect(result).toEqual(convertedResponse);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedBets, undefined);
    expect.assertions(4);
  });

  it('should throw error if unable to query match by id', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockRejectedValue(undefined);
    const queriedBets = [{
      userId: userId2
    }] as BetDocument[];
    mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);
    const convertedResponse = [{ userId: userId2 }] as BetResponse[];
    mockBetDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

    await service({
      matchId,
      userId
    }).catch(validateError('Unable to query documents', 500));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(5);
  });

  it('should throw error if unable to query bets by match id', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(6, now).toISOString()
    } as MatchDocument);
    mockBetDocumentService.functions.queryBetsByMatchId.mockRejectedValue(undefined);

    await service({
      matchId,
      userId
    }).catch(validateError('Unable to query documents', 500));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(5);
  });

  it('should throw error if no match found', async () => {
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(undefined);
    const queriedBets = [{
      userId: userId2
    }] as BetDocument[];
    mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue(queriedBets);

    await service({
      matchId,
      userId
    }).catch(validateError('No match found', 404));
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(5);
  });
});
