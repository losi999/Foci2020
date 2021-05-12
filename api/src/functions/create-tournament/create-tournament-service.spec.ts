import { createTournamentServiceFactory, ICreateTournamentService } from '@foci2020/api/functions/create-tournament/create-tournament-service';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { tournamentRequest, tournamentDocument } from '@foci2020/shared/common/test-data-factory';

describe('Create tournament service', () => {
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;
  let service: ICreateTournamentService;
  const expiresIn = 30;

  beforeEach(() => {
    mockDatabaseService = createMockService('saveTournament');
    mockTournamentDocumentConverter = createMockService('create');

    service = createTournamentServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should throw error if unable to save tournament', async () => {
    const convertedTournament = tournamentDocument();
    const body = tournamentRequest();

    mockTournamentDocumentConverter.functions.create.mockReturnValue(convertedTournament);
    mockDatabaseService.functions.saveTournament.mockRejectedValue({});

    await service({
      body,
      expiresIn, 
    }).catch(validateError('Error while saving tournament', 500));
    validateFunctionCall(mockTournamentDocumentConverter.functions.create, body, expiresIn);
    validateFunctionCall(mockDatabaseService.functions.saveTournament, convertedTournament);
    expect.assertions(4);
  });

  it('should return with tournamentId if tournament is saved', async () => {
    const convertedTournament = tournamentDocument();
    const body = tournamentRequest();

    mockTournamentDocumentConverter.functions.create.mockReturnValue(convertedTournament);
    mockDatabaseService.functions.saveTournament.mockResolvedValue(undefined);

    const result = await service({
      body,
      expiresIn, 
    });

    expect(result).toEqual(convertedTournament.id);
    validateFunctionCall(mockTournamentDocumentConverter.functions.create, body, expiresIn);
    validateFunctionCall(mockDatabaseService.functions.saveTournament, convertedTournament);
    expect.assertions(3);
  });
});
