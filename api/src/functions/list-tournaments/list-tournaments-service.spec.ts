import { IListTournamentsService, listTournamentsServiceFactory } from '@/functions/list-tournaments/list-tournaments-service';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { TournamentDocument, TournamentResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('List tournaments service', () => {
  let service: IListTournamentsService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('listTournaments');
    mockTournamentDocumentConverter = createMockService('toResponseList');

    service = listTournamentsServiceFactory(mockDatabaseService.service, mockTournamentDocumentConverter.service);
  });

  it('should return with list of tournaments', async () => {
    const tournamentId1 = 'tournament1';
    const tournamentId2 = 'tournament2';
    const tournamentName1 = 'tournament1';
    const tournamentName2 = 'tournament2';
    const tournamentDocument1 = {
      id: tournamentId1,
      tournamentName: tournamentName1
    } as TournamentDocument;
    const tournamentDocument2 = {
      id: tournamentId2,
      tournamentName: tournamentName2
    } as TournamentDocument;

    const queriedDocuments: TournamentDocument[] = [
      tournamentDocument1,
      tournamentDocument2] as TournamentDocument[];
    mockDatabaseService.functions.listTournaments.mockResolvedValue(queriedDocuments);

    const tournamentResponse = [
      {
        tournamentId: tournamentId1,
        tournamentName: tournamentName1
      },
      {
        tournamentId: tournamentId2,
        tournamentName: tournamentName2
      }] as TournamentResponse[];

    mockTournamentDocumentConverter.functions.toResponseList.mockReturnValueOnce(tournamentResponse);

    const result = await service();
    expect(result).toEqual(tournamentResponse);
    expect(mockDatabaseService.functions.listTournaments).toHaveBeenCalledWith();
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponseList, queriedDocuments);
  });

  it('should throw error if unable to query tournaments', async () => {
    mockDatabaseService.functions.listTournaments.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to query tournaments', 500));
    expect(mockDatabaseService.functions.listTournaments).toHaveBeenCalledWith();
    validateFunctionCall(mockTournamentDocumentConverter.functions.toResponseList);
    expect.assertions(4);
  });
});
