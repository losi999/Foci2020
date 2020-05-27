import { IListStandingsOfTournament, listStandingsOfTournamentFactory } from '@foci2020/api/functions/list-standings-of-tournament/list-standings-of-tournament-service';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { IStandingDocumentConverter } from '@foci2020/shared/converters/standing-document-converter';
import { createMockService, Mock, validateFunctionCall, validateError } from '@foci2020/shared/common/unit-testing';
import { tournamentDocument, standingDocument, standingResponse } from '@foci2020/shared/common/test-data-factory';

describe('List standings of tournament service', () => {
  let service: IListStandingsOfTournament;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockStandingDocumentConverter: Mock<IStandingDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('queryStandingsByTournamentId', 'getTournamentById');
    mockStandingDocumentConverter = createMockService('toResponseList');

    service = listStandingsOfTournamentFactory(mockDatabaseService.service, mockStandingDocumentConverter.service);
  });

  const tournamentId = 'tournamentId';

  it('should return standings of a tournament', async () => {
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(tournamentDocument());
    const queriedDocuments = [standingDocument()];
    mockDatabaseService.functions.queryStandingsByTournamentId.mockResolvedValue(queriedDocuments);
    const convertedResponse = [standingResponse()];
    mockStandingDocumentConverter.functions.toResponseList.mockReturnValue(convertedResponse);

    const result = await service({
      tournamentId
    });
    expect(result).toEqual(convertedResponse);
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
    validateFunctionCall(mockDatabaseService.functions.queryStandingsByTournamentId, tournamentId);
    validateFunctionCall(mockStandingDocumentConverter.functions.toResponseList, queriedDocuments);
  });

  describe('should throw error', () => {
    it('if unable to query tournaments by Id', async () => {
      mockDatabaseService.functions.getTournamentById.mockRejectedValue('This is a dynamo error');

      await service({
        tournamentId
      }).catch(validateError('Unable to query tournament', 500));
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.queryStandingsByTournamentId);
      validateFunctionCall(mockStandingDocumentConverter.functions.toResponseList);
    });

    it('if tournament not found by id', async () => {
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

      await service({
        tournamentId
      }).catch(validateError('Tournament does not exist', 400));
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.queryStandingsByTournamentId);
      validateFunctionCall(mockStandingDocumentConverter.functions.toResponseList);
    });

    it('if unable to query standings by tournament Id', async () => {
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(tournamentDocument());
      mockDatabaseService.functions.queryStandingsByTournamentId.mockRejectedValue('This is a dynamo error');

      await service({
        tournamentId
      }).catch(validateError('Unable to query standings of tournament', 500));
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.queryStandingsByTournamentId, tournamentId);
      validateFunctionCall(mockStandingDocumentConverter.functions.toResponseList);
    });
  });
});
