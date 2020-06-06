import { IUpdateTournamentService, updateTournamentServiceFactory } from '@foci2020/api/functions/update-tournament/update-tournament-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { tournamentDocument, tournamentRequest } from '@foci2020/shared/common/test-data-factory';

describe('Update tournament service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let service: IUpdateTournamentService;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;
  const isTestData = false;

  beforeEach(() => {
    mockTournamentDocumentConverter = createMockService('update');
    mockDatabaseService = createMockService('updateTournament');

    service = updateTournamentServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with with undefined if tournament is updated successfully', async () => {
    const tournamentId = 'tournamentId';
    const body = tournamentRequest();

    const converted = tournamentDocument();

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockDatabaseService.functions.updateTournament.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body,
      isTestData
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockTournamentDocumentConverter.functions.update, tournamentId, body, isTestData);
    validateFunctionCall(mockDatabaseService.functions.updateTournament, converted);
    expect.assertions(3);
  });

  describe('should throw error', () => {
    it('if no tournament found', async () => {
      const tournamentId = 'tournamentId';
      const body = tournamentRequest();

      const converted = tournamentDocument();

      mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
      mockDatabaseService.functions.updateTournament.mockRejectedValue({ code: 'ConditionalCheckFailedException' });

      await service({
        tournamentId,
        body,
        isTestData
      }).catch(validateError('No tournament found', 404));

      validateFunctionCall(mockTournamentDocumentConverter.functions.update, tournamentId, body, isTestData);
      validateFunctionCall(mockDatabaseService.functions.updateTournament, converted);
      expect.assertions(4);
    });

    it('if unable to update tournament', async () => {
      const tournamentId = 'tournamentId';
      const body = tournamentRequest();

      const converted = tournamentDocument();

      mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
      mockDatabaseService.functions.updateTournament.mockRejectedValue('This is a dynamo error');

      await service({
        tournamentId,
        body,
        isTestData
      }).catch(validateError('Error while updating tournament', 500));

      validateFunctionCall(mockTournamentDocumentConverter.functions.update, tournamentId, body, isTestData);
      validateFunctionCall(mockDatabaseService.functions.updateTournament, converted);
      expect.assertions(4);
    });
  });
});
