import { IDatabaseService } from '@/services/database-service';
import { IListMatchesService, listMatchesServiceFactory } from '@/business-services/list-matches-service';
import { MatchDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';

describe('List matches service', () => {
  let service: IListMatchesService;
  let mockDatabaseService: IDatabaseService;
  let mockConverter: jest.Mock;
  let mockQueryMatches: jest.Mock;

  beforeEach(() => {
    mockQueryMatches = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryMatches: mockQueryMatches,
    }))) as IDatabaseService;

    mockConverter = jest.fn();

    service = listMatchesServiceFactory(mockDatabaseService, mockConverter);
  });

  it('should return with list of matches', async () => {
    const matchId1 = 'match1';
    const matchId2 = 'match2';
    const matchId3 = 'match3';
    const matchDocument1 = {
      segment: 'details',
      matchId: matchId1,
    } as MatchDocument;
    const matchDocument2 = {
      segment: 'details',
      matchId: matchId2,
    } as MatchDocument;
    const matchDocument3 = {
      segment: 'homeTeam',
      matchId: matchId2,
    } as MatchDocument;
    const matchDocument4 = {
      segment: 'details',
      matchId: matchId3,
    };

    const queriedDocuments: MatchDocument[] = [
      matchDocument1,
      matchDocument2,
      matchDocument3,
      matchDocument4] as MatchDocument[];
    mockQueryMatches.mockResolvedValue(queriedDocuments);

    const matchResponse1 = {
      matchId: matchId1,
      startTime: new Date(2019, 1, 1, 1, 1, 1)
    } as MatchResponse;
    const matchResponse2 = {
      matchId: matchId2,
      startTime: new Date(2017, 1, 1, 1, 1, 1)
    } as MatchResponse;
    const matchResponse3 = {
      matchId: matchId3,
      startTime: new Date(2018, 1, 1, 1, 1, 1)
    };
    mockConverter.mockReturnValueOnce(matchResponse1);
    mockConverter.mockReturnValueOnce(matchResponse2);
    mockConverter.mockReturnValueOnce(matchResponse3);

    const result = await service({ tournamentId: 'tournamentId' });
    expect(result).toEqual([matchResponse1, matchResponse2, matchResponse3]);
    expect(mockConverter).toHaveBeenNthCalledWith(1, [matchDocument1]);
    expect(mockConverter).toHaveBeenNthCalledWith(2, [matchDocument2, matchDocument3]);
    expect(mockConverter).toHaveBeenNthCalledWith(3, [matchDocument4]);
  });

  it('should throw error if unable to query matches', async () => {
    mockQueryMatches.mockRejectedValue('This is a dynamo error');

    try {
      await service({ tournamentId: 'tournamentId' });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query matches');
    }
  });
});
