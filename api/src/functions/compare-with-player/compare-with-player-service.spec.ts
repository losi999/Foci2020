import { ICompareWithPlayerService, compareWithPlayerServiceFactory } from '@foci2020/api/functions/compare-with-player/compare-with-player-service';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { IIdentityService } from '@foci2020/shared/services/identity-service';
import { ICompareDocumentConverter } from '@foci2020/shared/converters/compare-document-converter';
import { Mock, createMockService, validateFunctionCall, validateError } from '@foci2020/shared/common/unit-testing';
import { matchDocument, betDocument, compareResponse } from '@foci2020/shared/common/test-data-factory';
import { UserIdType, TournamentIdType } from '@foci2020/shared/types/common';

describe('Compare with player service', () => {
  let service: ICompareWithPlayerService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockIdentityService: Mock<IIdentityService>;
  let mockCompareDocumentConverter: Mock<ICompareDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('queryMatchesByTournamentId', 'queryBetsByTournamentIdUserId');
    mockIdentityService = createMockService('getUserName');
    mockCompareDocumentConverter = createMockService('toResponse');

    service = compareWithPlayerServiceFactory(mockDatabaseService.service, mockIdentityService.service, mockCompareDocumentConverter.service);
  });

  const otherUserId = 'otherUserId' as UserIdType;
  const tournamentId = 'tournamentId' as TournamentIdType;
  const ownUserName = 'ownUserName';
  const ownUserId = 'ownUserId' as UserIdType;
  const otherUserName = 'otherUserName';

  it('should return compare response', async () => {
    const match = matchDocument();
    mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([match]);
    const ownBet = betDocument();
    mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([ownBet]);
    const otherBet = betDocument();
    mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([otherBet]);
    mockIdentityService.functions.getUserName.mockResolvedValue(otherUserName);
    const convertedResponse = compareResponse();
    mockCompareDocumentConverter.functions.toResponse.mockReturnValue(convertedResponse);

    const result = await service({
      otherUserId,
      tournamentId,
      ownUserName,
      ownUserId,
    });
    expect(result).toEqual(convertedResponse);
    validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
    expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(1, tournamentId, ownUserId);
    expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(2, tournamentId, otherUserId);
    validateFunctionCall(mockIdentityService.functions.getUserName, otherUserId);
    validateFunctionCall(mockCompareDocumentConverter.functions.toResponse, [match], { [match.id]: ownBet }, { [match.id]: otherBet }, ownUserName, otherUserName);
    expect.assertions(6);
  });

  describe('should throw error', () => {
    it('if unable to query matches of tournament', async () => {
      mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue('This is a dynamo error');
      const ownBet = betDocument();
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([ownBet]);
      const otherBet = betDocument();
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([otherBet]);
      mockIdentityService.functions.getUserName.mockResolvedValue(otherUserName);

      await service({
        otherUserId,
        tournamentId,
        ownUserName,
        ownUserId,
      }).catch(validateError('Unable to get related documents', 500));
      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(1, tournamentId, ownUserId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(2, tournamentId, otherUserId);
      validateFunctionCall(mockIdentityService.functions.getUserName, otherUserId);
      validateFunctionCall(mockCompareDocumentConverter.functions.toResponse);
      expect.assertions(7);
    });

    it('if unable to query own bets', async () => {
      const match = matchDocument();
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([match]);
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockRejectedValueOnce('This is a dynamo error');
      const otherBet = betDocument();
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([otherBet]);
      mockIdentityService.functions.getUserName.mockResolvedValue(otherUserName);

      await service({
        otherUserId,
        tournamentId,
        ownUserName,
        ownUserId,
      }).catch(validateError('Unable to get related documents', 500));
      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(1, tournamentId, ownUserId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(2, tournamentId, otherUserId);
      validateFunctionCall(mockIdentityService.functions.getUserName, otherUserId);
      validateFunctionCall(mockCompareDocumentConverter.functions.toResponse);
      expect.assertions(7);
    });

    it('if unable to query other player bets', async () => {
      const match = matchDocument();
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([match]);
      const ownBet = betDocument();
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([ownBet]);
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockRejectedValueOnce('This is a dynamo error');
      mockIdentityService.functions.getUserName.mockResolvedValue(otherUserName);

      await service({
        otherUserId,
        tournamentId,
        ownUserName,
        ownUserId,
      }).catch(validateError('Unable to get related documents', 500));
      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(1, tournamentId, ownUserId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(2, tournamentId, otherUserId);
      validateFunctionCall(mockIdentityService.functions.getUserName, otherUserId);
      validateFunctionCall(mockCompareDocumentConverter.functions.toResponse);
      expect.assertions(7);
    });

    it('if unable to get other player username', async () => {
      const match = matchDocument();
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([match]);
      const ownBet = betDocument();
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([ownBet]);
      const otherBet = betDocument();
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValueOnce([otherBet]);
      mockIdentityService.functions.getUserName.mockRejectedValue('This is a cognito error');

      await service({
        otherUserId,
        tournamentId,
        ownUserName,
        ownUserId,
      }).catch(validateError('Unable to get related documents', 500));
      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(1, tournamentId, ownUserId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenNthCalledWith(2, tournamentId, otherUserId);
      validateFunctionCall(mockIdentityService.functions.getUserName, otherUserId);
      validateFunctionCall(mockCompareDocumentConverter.functions.toResponse);
      expect.assertions(7);
    });
  });
});
