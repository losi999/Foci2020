import { IDeleteMatchWithTeamService, deleteMatchWithTeamServiceFactory } from '@/business-services/delete-match-with-team-service';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService } from '@/common';

describe('Delete match with team service', () => {
  let service: IDeleteMatchWithTeamService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByHomeTeamId', 'queryMatchKeysByAwayTeamId', 'deleteMatch');

    service = deleteMatchWithTeamServiceFactory(mockMatchDocumentService.service);
  });

  it('should return undefined if matches are deleted sucessfully', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';

    const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
      homeTeamId: teamId,
      id: matchId1,
      'documentType-id': ''
    }];

    const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
      awayTeamId: teamId,
      id: matchId2,
      'documentType-id': ''
    }];

    mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
    mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
    mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
    expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
  });

  // it('should throw error if unable to query matches', async () => {
  //   const teamId = 'teamId';

  //   const errorMessage = 'This is a dynamo error';
  //   mockQueryMatchKeysByTeamId.mockRejectedValue(errorMessage);

  //   try {
  //     await service({ teamId }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
  //     expect(mockDeleteMatch).not.toHaveBeenCalled();
  //   }
  // });

  // it('should throw error if unable to delete matches', async () => {
  //   const teamId = 'teamId';
  //   const matchId1 = 'matchId1';
  //   const matchId2 = 'matchId2';

  //   const queriedMatches = [{
  //     teamId,
  //     matchId: matchId1
  //   }, {
  //     teamId,
  //     matchId: matchId2
  //   }] as IndexByTeamIdDocument[];

  //   mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);

  //   const errorMessage = 'This is a dynamo error';
  //   mockDeleteMatch.mockRejectedValue(errorMessage);

  //   try {
  //     await service({ teamId }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
  //   }
  // });
});
