import { IDatabaseService } from '@/services/database-service';
import { IListMatchesService, listMatchesServiceFactory } from '@/business-services/list-matches-service';
import { MatchDocument, MatchResponse } from '@/types';

describe('List matches service', () => {
  let service: IListMatchesService;
  let mockDatabaseService: IDatabaseService;
  let mockConverter: jest.Mock;
  let mockQueryMatchesByTournamentId: jest.Mock;
  let mockQueryMatchesByDocumentType: jest.Mock;

  beforeEach(() => {
    mockQueryMatchesByTournamentId = jest.fn();
    mockQueryMatchesByDocumentType = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryMatchesByTournamentId: mockQueryMatchesByTournamentId,
      queryMatchesByDocumentType: mockQueryMatchesByDocumentType
    }))) as IDatabaseService;

    mockConverter = jest.fn();

    service = listMatchesServiceFactory(mockDatabaseService, mockConverter);
  });

  it('should return with list of matches', async () => {
    const matchId1 = 'match1';
    const matchId2 = 'match2';
    const matchId3 = 'match3';
    const matchDocument1 = {
      sortKey: 'details',
      matchId: matchId1,
    } as MatchDocument;
    const matchDocument2 = {
      sortKey: 'details',
      matchId: matchId2,
    } as MatchDocument;
    const matchDocument3 = {
      sortKey: 'homeTeam',
      matchId: matchId2,
    } as MatchDocument;
    const matchDocument4 = {
      sortKey: 'details',
      matchId: matchId3,
    };

    const queriedDocuments: MatchDocument[] = [
      matchDocument1,
      matchDocument2,
      matchDocument3,
      matchDocument4] as MatchDocument[];
    mockQueryMatchesByDocumentType.mockResolvedValue(queriedDocuments);

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

    const result = await service({});
    expect(result).toEqual([matchResponse2, matchResponse3, matchResponse1]);
    expect(mockQueryMatchesByTournamentId).not.toHaveBeenCalled();
    expect(mockConverter).toHaveBeenNthCalledWith(1, [matchDocument1]);
    expect(mockConverter).toHaveBeenNthCalledWith(2, [matchDocument2, matchDocument3]);
    expect(mockConverter).toHaveBeenNthCalledWith(3, [matchDocument4]);
  });

  it('should call different query if tournamentId is passed', async () => {
    mockQueryMatchesByTournamentId.mockResolvedValue([]);

    const result = await service({ tournamentId: 'asdf' });
    expect(result).toEqual([]);
    expect(mockQueryMatchesByDocumentType).not.toHaveBeenCalled();
  });

  it('should throw error if unable to query matches by document type', async () => {
    mockQueryMatchesByDocumentType.mockRejectedValue('This is a dynamo error');

    try {
      await service({});
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query matches');
      expect(mockQueryMatchesByTournamentId).not.toHaveBeenCalled();
    }
  });

  it('should throw error if unable to query matches by tournament Id ', async () => {
    mockQueryMatchesByTournamentId.mockRejectedValue('This is a dynamo error');

    try {
      await service({ tournamentId: 'asdf' });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query matches');
      expect(mockQueryMatchesByDocumentType).not.toHaveBeenCalled();
    }
  });
});
