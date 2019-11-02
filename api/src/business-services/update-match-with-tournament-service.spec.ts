import { IUpdateMatchWithTournamentService, updateMatchWithTournamentServiceFactory } from '@/business-services/update-match-with-tournament-service';
import { TournamentDocument, MatchTournamentDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

describe('Update match with tournament service', () => {
  let service: IUpdateMatchWithTournamentService;
  let mockMatchDocumentService: IMatchDocumentService;
  let mockQueryMatchKeysByTournamentId: jest.Mock;
  let mockUpdateMatchesWithTournament: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchesWithTournament = jest.fn();
    mockQueryMatchKeysByTournamentId = jest.fn();
    mockMatchDocumentService = new (jest.fn<Partial<IMatchDocumentService>, undefined[]>(() => ({
      updateMatchesWithTournament: mockUpdateMatchesWithTournament,
      queryMatchKeysByTournamentId: mockQueryMatchKeysByTournamentId
    })))() as IMatchDocumentService;

    service = updateMatchWithTournamentServiceFactory(mockMatchDocumentService);
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
    const result = await service({
      tournamentId,
      tournament
    });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockUpdateMatchesWithTournament).toHaveBeenCalledWith(queriedMatches, tournament);
  });

  it('should throw error if unable to query matches', async () => {
    const tournamentId = 'tournamentId';
    const tournament = {
      tournamentId
    } as TournamentDocument;

    const errorMessage = 'This is a dynamo error';
    mockQueryMatchKeysByTournamentId.mockRejectedValue(errorMessage);

    try {
      await service({
        tournamentId,
        tournament
      });
    } catch (error) {
      expect(error).toEqual(errorMessage);
      expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockUpdateMatchesWithTournament).not.toHaveBeenCalled();
    }
  });

  it('should throw error if unable to update matches', async () => {
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

    const errorMessage = 'This is a dynamo error';
    mockUpdateMatchesWithTournament.mockRejectedValue(errorMessage);

    try {
      await service({
        tournamentId,
        tournament
      });
    } catch (error) {
      expect(error).toEqual(errorMessage);
      expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockUpdateMatchesWithTournament).toHaveBeenCalledWith(queriedMatches, tournament);
    }
  });
});
