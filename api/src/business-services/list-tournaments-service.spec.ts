import { IListTournamentsService, listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';
import { ITournamentDocumentService } from '@/services/tournament-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('List tournaments service', () => {
  let service: IListTournamentsService;
  let mockTournamentDocumentService: Mock<ITournamentDocumentService>;
  let mockTournamentDocumentConverter: Mock<ITournamentDocumentConverter>;

  beforeEach(() => {
    mockTournamentDocumentService = createMockService('queryTournaments');
    mockTournamentDocumentConverter = createMockService('toResponseList');

    service = listTournamentsServiceFactory(mockTournamentDocumentService.service, mockTournamentDocumentConverter.service);
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
    mockTournamentDocumentService.functions.queryTournaments.mockResolvedValue(queriedDocuments);

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
    expect(mockTournamentDocumentService.functions.queryTournaments).toHaveBeenCalledWith();
    expect(mockTournamentDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedDocuments);
  });

  it('should throw error if unable to query tournaments', async () => {
    mockTournamentDocumentService.functions.queryTournaments.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to query tournaments', 500));
    expect(mockTournamentDocumentService.functions.queryTournaments).toHaveBeenCalledWith();
    expect(mockTournamentDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
