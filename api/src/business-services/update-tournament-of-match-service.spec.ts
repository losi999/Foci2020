import { IUpdateTournamentOfMatchService, updateTournamentOfMatchServiceFactory } from '@/business-services/update-tournament-of-match-service';
import { TournamentDocument, IndexByTournamentIdDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { createMockService, Mock } from '@/common';

describe('Update match with tournament service', () => {
  let service: IUpdateTournamentOfMatchService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByTournamentId', 'updateMatchWithTournament');

    service = updateTournamentOfMatchServiceFactory(mockMatchDocumentService.service);
  });

  it('should return undefined if matches are updated sucessfully', async () => {
    const tournamentId = 'tournamentId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const tournament = {
      id: tournamentId
    } as TournamentDocument;

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
    mockMatchDocumentService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

    const result = await service({
      tournamentId,
      tournament
    });
    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.updateTournamentOfMatch).toHaveBeenNthCalledWith(1, matchId1, tournament);
    expect(mockMatchDocumentService.functions.updateTournamentOfMatch).toHaveBeenNthCalledWith(2, matchId2, tournament);
  });

  // it('should throw error if unable to query matches', async () => {
  //   const tournamentId = 'tournamentId';
  //   const tournament = {
  //     tournamentId
  //   } as TournamentDocument;

  //   const errorMessage = 'This is a dynamo error';
  //   mockQueryMatchKeysByTournamentId.mockRejectedValue(errorMessage);

  //   try {
  //     await service({
  //       tournamentId,
  //       tournament
  //     }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
  //     expect(mockUpdateMatchesWithTournament).not.toHaveBeenCalled();
  //   }
  // });

  // it('should throw error if unable to update matches', async () => {
  //   const tournamentId = 'tournamentId';
  //   const matchId1 = 'matchId1';
  //   const matchId2 = 'matchId2';
  //   const tournament = {
  //     tournamentId
  //   } as TournamentDocument;

  //   const queriedMatches = [{
  //     tournamentId,
  //     matchId: matchId1
  //   }, {
  //     tournamentId,
  //     matchId: matchId2
  //   }] as MatchTournamentDocument[];

  //   mockQueryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);

  //   const errorMessage = 'This is a dynamo error';
  //   mockUpdateMatchesWithTournament.mockRejectedValue(errorMessage);

  //   try {
  //     await service({
  //       tournamentId,
  //       tournament
  //     }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockQueryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
  //     expect(mockUpdateMatchesWithTournament).toHaveBeenCalledWith(queriedMatches, tournament);
  //   }
  // });
});
