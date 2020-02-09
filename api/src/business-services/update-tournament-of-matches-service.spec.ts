import { IUpdateTournamentOfMatchesService, updateTournamentOfMatchesServiceFactory } from '@/business-services/update-tournament-of-matches-service';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService, validateError } from '@/common';
import { TournamentDocument, IndexByTournamentIdDocument } from '@/types/types';

describe('Update tournament of matches service', () => {
  let service: IUpdateTournamentOfMatchesService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByTournamentId', 'updateTournamentOfMatches');

    service = updateTournamentOfMatchesServiceFactory(mockMatchDocumentService.service);
  });

  it('should return undefined if matches are updated sucessfully', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const tournament = { id: tournamentId } as TournamentDocument;

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
    mockMatchDocumentService.functions.updateTournamentOfMatches.mockResolvedValue(undefined);

    const result = await service({ tournamentId, tournament });

    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.updateTournamentOfMatches).toHaveBeenCalledWith([matchId1, matchId2], tournament);
  });

  it('should throw error if unable to query matches by tournament Id', async () => {
    const tournamentId = 'tournamentId';
    const tournament = { id: tournamentId } as TournamentDocument;

    const message = 'This is a dynamo error';
    mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockRejectedValue({ message });

    await service({ tournamentId, tournament }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.updateTournamentOfMatches).not.toHaveBeenCalled();
    expect.assertions(3);
  });

  it('should throw error if unable to update matches', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const tournament = { id: tournamentId } as TournamentDocument;

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
    mockMatchDocumentService.functions.updateTournamentOfMatches.mockRejectedValue({ message });

    await service({ tournamentId, tournament }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.updateTournamentOfMatches).toHaveBeenCalledWith([matchId1, matchId2], tournament);
    expect.assertions(3);
  });
});
