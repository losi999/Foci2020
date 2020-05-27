import { IGetTournamentService, getTournamentServiceFactory } from '@foci2020/api/functions/get-tournament/get-tournament-service';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { tournamentResponse, tournamentDocument } from '@foci2020/shared/common/test-data-factory';

describe('Get tournament service', () => {
  let service: IGetTournamentService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getTournamentById');

    mockTournamentDocumentConverter = createMockService('toResponse');

    service = getTournamentServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with a tournament', async () => {
    const tournamentId = 'tournamentId';
    const document = tournamentDocument();

    mockDatabaseService.functions.getTournamentById.mockResolvedValue(document);

    const response = tournamentResponse();

    mockTournamentDocumentConverter.functions.toResponse.mockReturnValueOnce(response);

    const result = await service({ tournamentId });
    expect(result).toEqual(response);
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponse, document);
    expect.assertions(3);
  });

  it('should throw error if unable to query tournament', async () => {
    const tournamentId = 'tournamentId';
    mockDatabaseService.functions.getTournamentById.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to query tournament', 500));
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponse);
    expect.assertions(4);
  });

  it('should return with error if no tournament found', async () => {
    const tournamentId = 'tournamentId';
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);

    await service({ tournamentId }).catch(validateError('No tournament found', 404));
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, tournamentId);
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponse);
    expect.assertions(4);
  });
});
