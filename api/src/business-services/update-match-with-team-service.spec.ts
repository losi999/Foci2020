import { IUpdateMatchWithTeamService, updateMatchWithTeamServiceFactory } from '@/business-services/update-match-with-team-service';
import { TeamDocument, IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService } from '@/common';

describe('Update match with team service', () => {
  let service: IUpdateMatchWithTeamService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByHomeTeamId', 'queryMatchKeysByAwayTeamId', 'updateMatchWithTeam');

    service = updateMatchWithTeamServiceFactory(mockMatchDocumentService.service);
  });

  it('should return undefined if matches are updated sucessfully', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const team = {
      id: teamId
    } as TeamDocument;

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
    mockMatchDocumentService.functions.updateMatchWithTeam.mockResolvedValue(undefined);

    const result = await service({
      teamId,
      team
    });

    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.updateMatchWithTeam).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
    expect(mockMatchDocumentService.functions.updateMatchWithTeam).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
  });

  // it('should throw error if unable to query matches', async () => {
  //   const teamId = 'teamId';
  //   const team = {
  //     teamId
  //   } as TeamDocument;

  //   const errorMessage = 'This is a dynamo error';
  //   mockQueryMatchKeysByTeamId.mockRejectedValue(errorMessage);

  //   try {
  //     await service({
  //       teamId,
  //       team
  //     }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
  //     expect(mockUpdateMatchesWithTeam).not.toHaveBeenCalled();
  //   }
  // });

  // it('should throw error if unable to update matches', async () => {
  //   const teamId = 'teamId';
  //   const matchId1 = 'matchId1';
  //   const matchId2 = 'matchId2';
  //   const team = {
  //     teamId
  //   } as TeamDocument;

  //   const queriedMatches = [{
  //     teamId,
  //     matchId: matchId1
  //   }, {
  //     teamId,
  //     matchId: matchId2
  //   }] as MatchTeamDocument[];

  //   mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);

  //   const errorMessage = 'This is a dynamo error';
  //   mockUpdateMatchesWithTeam.mockRejectedValue(errorMessage);

  //   try {
  //     await service({
  //       teamId,
  //       team
  //     }).catch(validateError('aaa', 500));
  //   } catch (error) {
  //     expect(error).toEqual(errorMessage);
  //     expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
  //     expect(mockUpdateMatchesWithTeam).toHaveBeenCalledWith(queriedMatches, team);
  //   }
  // });
});
