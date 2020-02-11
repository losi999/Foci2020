import { IPlaceBetService, placeBetServiceFactory } from '@/match/place-bet/place-bet-service';
import { IMatchDocumentService } from '@/match/match-document-service';
import { IBetDocumentConverter } from '@/match/bet-document-converter';
import { IBetDocumentService } from '@/match/bet-document-service';
import { Mock, createMockService, addMinutes, validateError } from '@/shared/common';
import { advanceTo, clear } from 'jest-date-mock';
import { BetRequest, MatchDocument, BetDocument } from '@/shared/types/types';

describe('Place bet service', () => {
  let service: IPlaceBetService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;
  let mockBetDocumentService: Mock<IBetDocumentService>;

  const now = new Date(2020, 2, 11, 21, 6, 0);
  beforeEach(() => {
    mockBetDocumentConverter = createMockService('create');
    mockBetDocumentService = createMockService('queryBetById', 'saveBet');
    mockMatchDocumentService = createMockService('queryMatchById');

    service = placeBetServiceFactory(mockMatchDocumentService.service, mockBetDocumentConverter.service, mockBetDocumentService.service);

    advanceTo(now);
  });

  afterEach(() => {
    clear();
  });

  const bet: BetRequest = {
    homeScore: 1,
    awayScore: 3
  };
  const userId = 'userId';
  const matchId = 'matchId';
  const userName = 'userName';

  it('should return undefined if bet is placed on a match', async () => {
    mockBetDocumentService.functions.queryBetById.mockResolvedValue(undefined);
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(6, now).toISOString()
    } as MatchDocument);
    const converted = {
      homeScore: 1,
      awayScore: 3
    } as BetDocument;
    mockBetDocumentConverter.functions.create.mockReturnValue(converted);
    mockBetDocumentService.functions.saveBet.mockResolvedValue(undefined);

    const result = await service({
      bet,
      matchId,
      userId,
      userName
    });
    expect(result).toBeUndefined();
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).toHaveBeenCalledWith(bet, userId, userName, matchId);
    expect(mockBetDocumentService.functions.saveBet).toHaveBeenCalledWith(converted);
    expect.assertions(5);

  });

  it('should throw error if bet is already placed on a match', async () => {
    mockBetDocumentService.functions.queryBetById.mockResolvedValue({
      id: 'there is a bet'
    } as BetDocument);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('You already placed a bet on this match', 400));
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).not.toHaveBeenCalled();
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockBetDocumentService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to query bet', async () => {
    mockBetDocumentService.functions.queryBetById.mockRejectedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Unable to query bet', 500));
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).not.toHaveBeenCalled();
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockBetDocumentService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to query match', async () => {
    mockBetDocumentService.functions.queryBetById.mockResolvedValue(undefined);
    mockMatchDocumentService.functions.queryMatchById.mockRejectedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Unable to query match by id', 500));
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockBetDocumentService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if no match found', async () => {
    mockBetDocumentService.functions.queryBetById.mockResolvedValue(undefined);
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('No match found', 404));
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockBetDocumentService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if betting time is expired', async () => {
    mockBetDocumentService.functions.queryBetById.mockResolvedValue(undefined);
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(4, now).toISOString()
    } as MatchDocument);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Betting time expired', 400));
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockBetDocumentService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to save bet', async () => {
    mockBetDocumentService.functions.queryBetById.mockResolvedValue(undefined);
    mockMatchDocumentService.functions.queryMatchById.mockResolvedValue({
      startTime: addMinutes(6, now).toISOString()
    } as MatchDocument);
    const converted = {
      homeScore: 1,
      awayScore: 3
    } as BetDocument;
    mockBetDocumentConverter.functions.create.mockReturnValue(converted);
    mockBetDocumentService.functions.saveBet.mockRejectedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Unable to save bet', 500));
    expect(mockBetDocumentService.functions.queryBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockMatchDocumentService.functions.queryMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).toHaveBeenCalledWith(bet, userId, userName, matchId);
    expect(mockBetDocumentService.functions.saveBet).toHaveBeenCalledWith(converted);
    expect.assertions(6);
  });
});
