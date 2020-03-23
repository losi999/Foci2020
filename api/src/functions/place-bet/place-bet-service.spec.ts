import { IPlaceBetService, placeBetServiceFactory } from '@/functions/place-bet/place-bet-service';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { advanceTo, clear } from 'jest-date-mock';
import { BetRequest, MatchDocument, BetDocument } from '@/types/types';
import { addMinutes } from '@/common';
import { IDatabaseService } from '@/services/database-service';

describe('Place bet service', () => {
  let service: IPlaceBetService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;

  const now = new Date(2020, 2, 11, 21, 6, 0);
  beforeEach(() => {
    mockBetDocumentConverter = createMockService('create');
    mockDatabaseService = createMockService('getBetById', 'saveBet', 'getMatchById');

    service = placeBetServiceFactory(mockDatabaseService.service, mockBetDocumentConverter.service);

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
  const tournamentId = 'tournamentId';
  const userName = 'userName';

  it('should return undefined if bet is placed on a match', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
    mockDatabaseService.functions.getMatchById.mockResolvedValue({
      tournamentId,
      startTime: addMinutes(6, now).toISOString(),
    } as MatchDocument);
    const converted = {
      homeScore: 1,
      awayScore: 3
    } as BetDocument;
    mockBetDocumentConverter.functions.create.mockReturnValue(converted);
    mockDatabaseService.functions.saveBet.mockResolvedValue(undefined);

    const result = await service({
      bet,
      matchId,
      userId,
      userName
    });
    expect(result).toBeUndefined();
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).toHaveBeenCalledWith(bet, userId, userName, matchId, tournamentId);
    expect(mockDatabaseService.functions.saveBet).toHaveBeenCalledWith(converted);
    expect.assertions(5);

  });

  it('should throw error if bet is already placed on a match', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue({
      id: 'there is a bet'
    } as BetDocument);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('You already placed a bet on this match', 400));
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).not.toHaveBeenCalled();
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to query bet', async () => {
    mockDatabaseService.functions.getBetById.mockRejectedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Unable to query bet', 500));
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).not.toHaveBeenCalled();
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to query match', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
    mockDatabaseService.functions.getMatchById.mockRejectedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Unable to query match by id', 500));
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if no match found', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
    mockDatabaseService.functions.getMatchById.mockResolvedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('No match found', 404));
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if betting time is expired', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
    mockDatabaseService.functions.getMatchById.mockResolvedValue({
      startTime: addMinutes(4, now).toISOString()
    } as MatchDocument);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Betting time expired', 400));
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).not.toHaveBeenCalled();
    expect(mockDatabaseService.functions.saveBet).not.toHaveBeenCalled();
    expect.assertions(6);
  });

  it('should throw error if unable to save bet', async () => {
    mockDatabaseService.functions.getBetById.mockResolvedValue(undefined);
    mockDatabaseService.functions.getMatchById.mockResolvedValue({
      tournamentId,
      startTime: addMinutes(6, now).toISOString()
    } as MatchDocument);
    const converted = {
      homeScore: 1,
      awayScore: 3
    } as BetDocument;
    mockBetDocumentConverter.functions.create.mockReturnValue(converted);
    mockDatabaseService.functions.saveBet.mockRejectedValue(undefined);

    await service({
      bet,
      matchId,
      userId,
      userName
    }).catch(validateError('Unable to save bet', 500));
    expect(mockDatabaseService.functions.getBetById).toHaveBeenCalledWith(userId, matchId);
    expect(mockDatabaseService.functions.getMatchById).toHaveBeenCalledWith(matchId);
    expect(mockBetDocumentConverter.functions.create).toHaveBeenCalledWith(bet, userId, userName, matchId, tournamentId);
    expect(mockDatabaseService.functions.saveBet).toHaveBeenCalledWith(converted);
    expect.assertions(6);
  });
});
