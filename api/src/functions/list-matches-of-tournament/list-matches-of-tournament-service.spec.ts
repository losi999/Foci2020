import { IListMatchesOfTournamentService, listMatchesOfTournamentServiceFactory } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { MatchDocument, MatchResponse } from '@/types/types';

describe('List matches of tournament service', () => {
  let service: IListMatchesOfTournamentService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchesByTournamentId');

    mockMatchDocumentConverter = createMockService('toResponseList');

    service = listMatchesOfTournamentServiceFactory(mockMatchDocumentService.service, mockMatchDocumentConverter.service);
  });

  const tournamentId = 'tournamentId';

  it('should return with list of matches', async () => {
    const matchId1 = 'match1';
    const matchId2 = 'match2';
    const matchId3 = 'match3';
    const matchDocument1 = {
      id: matchId1,
    } as MatchDocument;
    const matchDocument2 = {
      id: matchId2,
    } as MatchDocument;
    const matchDocument3 = {
      id: matchId2,
    } as MatchDocument;
    const matchDocument4 = {
      id: matchId3,
    };

    const queriedDocuments: MatchDocument[] = [
      matchDocument1,
      matchDocument2,
      matchDocument3,
      matchDocument4] as MatchDocument[];
    mockMatchDocumentService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedDocuments);

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

    mockMatchDocumentConverter.functions.toResponseList.mockReturnValueOnce(matchResponse);

    const result = await service({ tournamentId });
    expect(result).toEqual(matchResponse);
    expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedDocuments);
  });

  it('should throw error if unable to query matches', async () => {
    mockMatchDocumentService.functions.queryMatchesByTournamentId.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to query matches', 500));
    expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
