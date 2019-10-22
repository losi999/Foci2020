import { IDeleteMatchWithTournamentService, deleteMatchWithTournamentServiceFactory } from '@/business-services/delete-match-with-tournament-service';
import { IDatabaseService } from '@/services/database-service';
import { TournamentDocument, IndexByTournamentIdDocument } from '@/types/documents';

describe('Delete match with tournament service', () => {
  let service: IDeleteMatchWithTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchKeysByTournamentId: jest.Mock;
  let mockDeleteMatch: jest.Mock;

  beforeEach(() => {
    mockDeleteMatch = jest.fn();
    mockQueryMatchKeysByTournamentId = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      deleteMatch: mockDeleteMatch,
      queryMatchKeysByTournamentId: mockQueryMatchKeysByTournamentId
    })))() as IDatabaseService;

    service = deleteMatchWithTournamentServiceFactory(mockDatabaseService);
  });

  it('should return undefined if matches are deleted sucessfully', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const tournament = {
      tournamentId
    } as TournamentDocument;

    const queriedMatches = [{
      tournamentId,
      matchId: matchId1
    }, {
      tournamentId,
      matchId: matchId2
    }] as IndexByTournamentIdDocument[];

    mockQueryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
    mockDeleteMatch.mockResolvedValue(undefined);
    const result = await service({ tournament });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockDeleteMatch).toHaveBeenNthCalledWith(1, matchId1);
    expect(mockDeleteMatch).toHaveBeenNthCalledWith(2, matchId2);
  });

  it('should handle error if unable to query matches', async () => {
    const tournamentId = 'tournamentId';
    const tournament = {
      tournamentId
    } as TournamentDocument;

    mockQueryMatchKeysByTournamentId.mockRejectedValue(undefined);

    const result = await service({ tournament });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockDeleteMatch).not.toHaveBeenCalled();
  });

  it('should handle error if unable to delete matches', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const tournament = {
      tournamentId
    } as TournamentDocument;

    const queriedMatches = [{
      tournamentId,
      matchId: matchId1
    }, {
      tournamentId,
      matchId: matchId2
    }] as IndexByTournamentIdDocument[];

    mockQueryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
    mockDeleteMatch.mockRejectedValue(undefined);
    const result = await service({ tournament });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
  });
});
