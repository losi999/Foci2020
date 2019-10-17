import { IUpdateMatchWithTournamentService, updateMatchWithTournamentServiceFactory } from '@/business-services/update-match-with-tournament-service';
import { IDatabaseService } from '@/services/database-service';
import { TournamentDocument, MatchTournamentDocument, IndexByTournamentIdDocument } from '@/types/documents';

describe('Update match with tournament service', () => {
  let service: IUpdateMatchWithTournamentService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchKeysByTournamentId: jest.Mock<Promise<IndexByTournamentIdDocument[]>>;
  let mockUpdateMatchesWithTournament: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchesWithTournament = jest.fn();
    mockQueryMatchKeysByTournamentId = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      updateMatchesWithTournament: mockUpdateMatchesWithTournament,
      queryMatchKeysByTournamentId: mockQueryMatchKeysByTournamentId
    })))() as IDatabaseService;

    service = updateMatchWithTournamentServiceFactory(mockDatabaseService);
  });

  it('should return undefined if matches are updated sucessfully', async () => {
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
    }] as MatchTournamentDocument[];

    mockQueryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
    mockUpdateMatchesWithTournament.mockResolvedValue(undefined);
    const result = await service({ tournament });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockUpdateMatchesWithTournament).toHaveBeenCalledWith(queriedMatches, tournament);
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
    expect(mockUpdateMatchesWithTournament).not.toHaveBeenCalled();
  });

  it('should handle error if unable to update matches', async () => {
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
    }] as MatchTournamentDocument[];

    mockQueryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
    mockUpdateMatchesWithTournament.mockRejectedValue(undefined);
    const result = await service({ tournament });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockUpdateMatchesWithTournament).toHaveBeenCalledWith(queriedMatches, tournament);
  });
});
