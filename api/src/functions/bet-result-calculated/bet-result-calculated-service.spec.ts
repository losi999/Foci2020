import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IStandingDocumentConverter } from '@foci2020/shared/converters/standing-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { betDocument, standingDocument } from '@foci2020/shared/common/test-data-factory';
import { TournamentIdType, UserIdType } from '@foci2020/shared/types/common';
import { betResultCalculatedServiceFactory, IBetResultCalculatedService } from '@foci2020/api/functions/bet-result-calculated/bet-result-calculated-service';

describe('Bet result calculated service', () => {
  let service: IBetResultCalculatedService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockStandingDocumentConverter: Mock<IStandingDocumentConverter>;
  const expiresIn = 30;

  beforeEach(() => {
    mockDatabaseService = createMockService('queryBetsByTournamentIdUserId', 'saveStanding');
    mockStandingDocumentConverter = createMockService('create');

    service = betResultCalculatedServiceFactory(
      mockDatabaseService.service,
      mockStandingDocumentConverter.service);
  });

  const tournamentId = 'tournamentId' as TournamentIdType;
  const userId = 'userId' as UserIdType;

  const queriedBets = [betDocument()];
  const convertedStansingDocument = standingDocument();
  const dynamoErrorMessage = 'This is a dynamo error';

  it('should return undefined if standing document is saved successfully', async () => {
    mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(queriedBets);
    mockStandingDocumentConverter.functions.create.mockReturnValue(convertedStansingDocument);
    mockDatabaseService.functions.saveStanding.mockResolvedValue(undefined);

    await service({
      tournamentId,
      userId,
      expiresIn,
    });

    validateFunctionCall(mockDatabaseService.functions.queryBetsByTournamentIdUserId, tournamentId, userId);
    validateFunctionCall(mockStandingDocumentConverter.functions.create, queriedBets, expiresIn);
    validateFunctionCall(mockDatabaseService.functions.saveStanding, convertedStansingDocument);
  });

  describe('should throw error', () => {
    it('if unable to query bets by tournament and user id', async () => {
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockRejectedValue({
        message: dynamoErrorMessage,
      });

      await service({
        tournamentId,
        userId,
        expiresIn,
      }).catch((validateError(dynamoErrorMessage)));

      validateFunctionCall(mockDatabaseService.functions.queryBetsByTournamentIdUserId, tournamentId, userId);
      validateFunctionCall(mockStandingDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveStanding);
    });

    it('if unable to save standing document', async () => {
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(queriedBets);
      mockStandingDocumentConverter.functions.create.mockReturnValue(convertedStansingDocument);
      mockDatabaseService.functions.saveStanding.mockRejectedValue({
        message: dynamoErrorMessage,
      });

      await service({
        tournamentId,
        userId,
        expiresIn,
      }).catch((validateError(dynamoErrorMessage)));

      validateFunctionCall(mockDatabaseService.functions.queryBetsByTournamentIdUserId, tournamentId, userId);
      validateFunctionCall(mockStandingDocumentConverter.functions.create, queriedBets, expiresIn);
      validateFunctionCall(mockDatabaseService.functions.saveStanding, convertedStansingDocument);
    });
  });
});
