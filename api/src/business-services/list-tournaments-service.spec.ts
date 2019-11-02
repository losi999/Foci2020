import { IDatabaseService } from '@/services/database-service';
import { IListTournamentsService, listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { ITournamentDocumentConverter } from '@/converters/tournament-document-converter';

describe('List tournaments service', () => {
  let service: IListTournamentsService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryTournaments: jest.Mock;
  let mockTournamentDocumentConverter: ITournamentDocumentConverter;
  let mockCreateResponseList: jest.Mock;

  beforeEach(() => {
    mockQueryTournaments = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryTournaments: mockQueryTournaments,
    }))) as IDatabaseService;

    mockCreateResponseList = jest.fn();
    mockTournamentDocumentConverter = new (jest.fn<Partial<ITournamentDocumentConverter>, undefined[]>(() => ({
      createResponseList: mockCreateResponseList
    })))() as ITournamentDocumentConverter;

    service = listTournamentsServiceFactory(mockDatabaseService, mockTournamentDocumentConverter);
  });

  it('should return with list of tournaments', async () => {
    const tournamentId1 = 'tournament1';
    const tournamentId2 = 'tournament2';
    const tournamentName1 = 'tournament1';
    const tournamentName2 = 'tournament2';
    const tournamentDocument1 = {
      segment: 'details',
      tournamentId: tournamentId1,
      tournamentName: tournamentName1
    } as TournamentDocument;
    const tournamentDocument2 = {
      segment: 'details',
      tournamentId: tournamentId2,
      tournamentName: tournamentName2
    } as TournamentDocument;

    const queriedDocuments: TournamentDocument[] = [
      tournamentDocument1,
      tournamentDocument2] as TournamentDocument[];
    mockQueryTournaments.mockResolvedValue(queriedDocuments);

    const tournamentResponse = [
      {
        tournamentId: tournamentId1,
        tournamentName: tournamentName1
      },
      {
        tournamentId: tournamentId2,
        tournamentName: tournamentName2
      }] as TournamentResponse[];

    mockCreateResponseList.mockReturnValueOnce(tournamentResponse);

    const result = await service();
    expect(result).toEqual(tournamentResponse);
    expect(mockCreateResponseList).toHaveBeenCalledWith(queriedDocuments);
  });

  it('should throw error if unable to query tournaments', async () => {
    mockQueryTournaments.mockRejectedValue('This is a dynamo error');

    try {
      await service();
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query tournaments');
    }
  });
});
