import { IDeleteMatchesByTeamService, deleteMatchesByTeamServiceFactory } from '@/match/delete-matches-by-team/delete-matches-by-team-service';
import { IMatchDocumentService } from '@/match/match-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@/shared/types/types';

describe('Delete match by team service', () => {
  let service: IDeleteMatchesByTeamService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByHomeTeamId', 'queryMatchKeysByAwayTeamId', 'deleteMatches');

    service = deleteMatchesByTeamServiceFactory(mockMatchDocumentService.service);
  });

  it('should return undefined if matches are deleted successfully', async () => {
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
    mockMatchDocumentService.functions.deleteMatches.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.deleteMatches).toHaveBeenCalledWith([matchId1, matchId2]);
  });

  it('should throw error if unable to query matches by homeTeam Id', async () => {
    const teamId = 'teamId';
    const matchId2 = 'matchId2';

    const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
      awayTeamId: teamId,
      id: matchId2,
      'documentType-id': ''
    }];

    const message = 'This is a dynamo error';
    mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message });
    mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

    await service({ teamId }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.deleteMatches).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if unable to query matches by awayTeam Id', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';

    const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
      homeTeamId: teamId,
      id: matchId1,
      'documentType-id': ''
    }];

    const message = 'This is a dynamo error';
    mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
    mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message });

    await service({ teamId }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.deleteMatches).not.toHaveBeenCalled();
    expect.assertions(4);
  });

  it('should throw error if unable to delete matches', async () => {
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

    const message = 'This is a dynamo error';
    mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
    mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
    mockMatchDocumentService.functions.deleteMatches.mockRejectedValue({ message });

    await service({ teamId }).catch(validateError(message));
    expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
    expect(mockMatchDocumentService.functions.deleteMatches).toHaveBeenCalledWith([matchId1, matchId2]);
    expect.assertions(4);
  });
});
