import { IDeleteMatchesByTournamentService, deleteMatchesByTournamentServiceFactory } from '@/match/delete-matches-by-tournament/delete-matches-by-tournament-service';
import { IMatchDocumentService } from '@/match/match-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { IndexByTournamentIdDocument } from '@/shared/types/types';

describe('Delete match by tournament service', () => {
  let service: IDeleteMatchesByTournamentService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByTournamentId', 'deleteMatches');

    service = deleteMatchesByTournamentServiceFactory(mockMatchDocumentService.service);
  });

  it('should return undefined if matches are deleted sucessfully', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';

    const queriedMatches: IndexByTournamentIdDocument[] = [{
      tournamentId,
      id: matchId1,
      'documentType-id': ''
    }, {
      tournamentId,
      id: matchId2,
      'documentType-id': ''
    }];

    mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
    mockMatchDocumentService.functions.deleteMatches.mockResolvedValue(undefined);

    const result = await service({ tournamentId });

    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.deleteMatches).toHaveBeenCalledWith([matchId1, matchId2]);
  });

  it('should throw error if unable to query matches by tournament Id', async () => {
    const tournamentId = 'tournamentId';

    const message = 'This is a dynamo error';
    mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockRejectedValue({ message });

    await service({ tournamentId }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.deleteMatches).not.toHaveBeenCalled();
    expect.assertions(3);
  });

  it('should throw error if unable to delete matches', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';

    const queriedMatches: IndexByTournamentIdDocument[] = [{
      tournamentId,
      id: matchId1,
      'documentType-id': ''
    }, {
      tournamentId,
      id: matchId2,
      'documentType-id': ''
    }];

    const message = 'This is a dynamo error';
    mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
    mockMatchDocumentService.functions.deleteMatches.mockRejectedValue({ message });

    await service({ tournamentId }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.deleteMatches).toHaveBeenCalledWith([matchId1, matchId2]);
    expect.assertions(3);
  });
});
