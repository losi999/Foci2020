import { IDatabaseService } from '@/services/database-service';
import { IListMatchesService, listMatchesServiceFactory } from '@/business-services/list-matches-service';
import { MatchDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';

describe('List matches service', () => {
  let service: IListMatchesService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatches: jest.Mock;
  let mockMatchDocumentConverter: IMatchDocumentConverter;
  let mockCreateResponseList: jest.Mock;

  beforeEach(() => {
    mockQueryMatches = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryMatches: mockQueryMatches,
    }))) as IDatabaseService;

    mockCreateResponseList = jest.fn();
    mockMatchDocumentConverter = new (jest.fn<Partial<IMatchDocumentConverter>, undefined[]>(() => ({
      createResponseList: mockCreateResponseList
    })))() as IMatchDocumentConverter;

    service = listMatchesServiceFactory(mockDatabaseService, mockMatchDocumentConverter);
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

    const matchResponse = [
      {
        matchId: matchId1,
        startTime: 'date1'
      },
      {
        matchId: matchId2,
        startTime: 'date2'
      },
      {
        matchId: matchId3,
        startTime: 'date3'
      }
    ] as MatchResponse[];

    mockCreateResponseList.mockReturnValueOnce(matchResponse);

    const result = await service({ tournamentId: 'tournamentId' });
    expect(result).toEqual(matchResponse);
    expect(mockCreateResponseList).toHaveBeenCalledWith(queriedDocuments);
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
