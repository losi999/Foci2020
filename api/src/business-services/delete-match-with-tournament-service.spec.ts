import { IDeleteMatchWithTournamentService, deleteMatchWithTournamentServiceFactory } from '@/business-services/delete-match-with-tournament-service';
import { IndexByTournamentIdDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService } from '@/common';

describe('Delete match with tournament service', () => {
  let service: IDeleteMatchWithTournamentService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByTournamentId', 'deleteMatch');

    service = deleteMatchWithTournamentServiceFactory(mockMatchDocumentService.service);
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
    mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

    const result = await service({ tournamentId });

    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
    expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
    expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
  });

  // it('should throw error if unable to query matches', async () => {
  //   const tournamentId = 'tournamentId';

  //   const errorMessage = 'This is a dynamo error';
  //   mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockRejectedValue(errorMessage);

  //   try {
  //     await service({ tournamentId }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockMatchDocumentService.functions.deleteMatch).not.toHaveBeenCalled();
  //     expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
  //   }
  // });

  // it('should throw error if unable to delete matches', async () => {
  //   const tournamentId = 'tournamentId';
  //   const matchId1 = 'matchId1';
  //   const matchId2 = 'matchId2';

  //   const queriedMatches = [{
  //     tournamentId,
  //     matchId: matchId1
  //   }, {
  //     tournamentId,
  //     matchId: matchId2
  //   }] as IndexByTournamentIdDocument[];

  //   mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);

  //   const errorMessage = 'This is a dynamo error';
  //   mockMatchDocumentService.functions.deleteMatch.mockRejectedValue(errorMessage);

  //   try {
  //     await service({ tournamentId }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
  //   }
  // });
});
