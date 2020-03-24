import { IUpdateTournamentService, updateTournamentServiceFactory } from '@/functions/update-tournament/update-tournament-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { TournamentRequest, TournamentDocument } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('Update tournament service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let service: IUpdateTournamentService;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockTournamentDocumentConverter = createMockService('update');
    mockDatabaseService = createMockService('updateTournament');

    service = updateTournamentServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with with undefined if tournament is updated successfully', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockDatabaseService.functions.updateTournament.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      body
    });
    expect(result).toBeUndefined();
    validateFunctionCall(mockTournamentDocumentConverter.functions.update, tournamentId, body);
    validateFunctionCall(mockDatabaseService.functions.updateTournament, converted);
    expect.assertions(3);
  });

  it('should throw error if unable to update tournament', async () => {
    const tournamentId = 'tournamentId';
    const tournamentName = 'tournamentName';
    const body: TournamentRequest = {
      tournamentName
    };

    const converted = {
      tournamentName
    } as TournamentDocument;

    mockTournamentDocumentConverter.functions.update.mockReturnValue(converted);
    mockDatabaseService.functions.updateTournament.mockRejectedValue('This is a dynamo error');

    await service({
      tournamentId,
      body
    }).catch(validateError('Error while updating tournament', 500));

    validateFunctionCall(mockTournamentDocumentConverter.functions.update, tournamentId, body);
    validateFunctionCall(mockDatabaseService.functions.updateTournament, converted);
    expect.assertions(4);
  });
});
