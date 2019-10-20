import { IDatabaseService } from '@/services/database-service';
import { IListTournamentsService, listTournamentsServiceFactory } from '@/business-services/list-tournaments-service';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';

describe('List tournaments service', () => {
  let service: IListTournamentsService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryTournaments: jest.Mock;

  beforeEach(() => {
    mockQueryTournaments = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryTournaments: mockQueryTournaments,
    }))) as IDatabaseService;

    service = listTournamentsServiceFactory(mockDatabaseService);
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

    const tournamentResponse1 = {
      tournamentId: tournamentId1,
      tournamentName: tournamentName1
    } as TournamentResponse;
    const tournamentResponse2 = {
      tournamentId: tournamentId2,
      tournamentName: tournamentName2
    } as TournamentResponse;

    const result = await service({});
    expect(result).toEqual([tournamentResponse1, tournamentResponse2]);
  });

  it('should throw error if unable to query tournaments', async () => {
    mockQueryTournaments.mockRejectedValue('This is a dynamo error');

    try {
      await service({});
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query tournaments');
    }
  });
});
