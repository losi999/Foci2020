import { IDeleteMatchWithTeamService, deleteMatchWithTeamServiceFactory } from '@/business-services/delete-match-with-team-service';
import { IndexByTeamIdDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';

describe('Delete match with team service', () => {
  let service: IDeleteMatchWithTeamService;
  let mockMatchDocumentService: IMatchDocumentService;
  let mockQueryMatchKeysByTeamId: jest.Mock;
  let mockDeleteMatch: jest.Mock;

  beforeEach(() => {
    mockDeleteMatch = jest.fn();
    mockQueryMatchKeysByTeamId = jest.fn();
    mockMatchDocumentService = new (jest.fn<Partial<IMatchDocumentService>, undefined[]>(() => ({
      deleteMatch: mockDeleteMatch,
      queryMatchKeysByTeamId: mockQueryMatchKeysByTeamId
    })))() as IMatchDocumentService;

    service = deleteMatchWithTeamServiceFactory(mockMatchDocumentService);
  });

  it('should return undefined if matches are deleted sucessfully', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';

    const queriedMatches = [{
      teamId,
      matchId: matchId1
    }, {
      teamId,
      matchId: matchId2
    }] as IndexByTeamIdDocument[];

    mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);
    mockDeleteMatch.mockResolvedValue(undefined);

    const result = await service({ teamId });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
    expect(mockDeleteMatch).toHaveBeenNthCalledWith(1, matchId1);
    expect(mockDeleteMatch).toHaveBeenNthCalledWith(2, matchId2);
  });

  it('should throw error if unable to query matches', async () => {
    const teamId = 'teamId';

    const errorMessage = 'This is a dynamo error';
    mockQueryMatchKeysByTeamId.mockRejectedValue(errorMessage);

    try {
      await service({ teamId });
    } catch (error) {
      expect(error).toEqual(errorMessage);
      expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDeleteMatch).not.toHaveBeenCalled();
    }
  });

  it('should throw error if unable to delete matches', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';

    const queriedMatches = [{
      teamId,
      matchId: matchId1
    }, {
      teamId,
      matchId: matchId2
    }] as IndexByTeamIdDocument[];

    mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);

    const errorMessage = 'This is a dynamo error';
    mockDeleteMatch.mockRejectedValue(errorMessage);

    try {
      await service({ teamId });
    } catch (error) {
      expect(error).toEqual(errorMessage);
      expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
    }
  });
});
