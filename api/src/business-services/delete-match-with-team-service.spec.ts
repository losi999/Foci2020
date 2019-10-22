import { IDeleteMatchWithTeamService, deleteMatchWithTeamServiceFactory } from '@/business-services/delete-match-with-team-service';
import { IDatabaseService } from '@/services/database-service';
import { TeamDocument, IndexByTeamIdDocument } from '@/types/documents';

describe('Delete match with team service', () => {
  let service: IDeleteMatchWithTeamService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchKeysByTeamId: jest.Mock;
  let mockDeleteMatch: jest.Mock;

  beforeEach(() => {
    mockDeleteMatch = jest.fn();
    mockQueryMatchKeysByTeamId = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      deleteMatch: mockDeleteMatch,
      queryMatchKeysByTeamId: mockQueryMatchKeysByTeamId
    })))() as IDatabaseService;

    service = deleteMatchWithTeamServiceFactory(mockDatabaseService);
  });

  it('should return undefined if matches are deleted sucessfully', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const team = {
      teamId
    } as TeamDocument;

    const queriedMatches = [{
      teamId,
      matchId: matchId1
    }, {
      teamId,
      matchId: matchId2
    }] as IndexByTeamIdDocument[];

    mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);
    mockDeleteMatch.mockResolvedValue(undefined);

    const result = await service({ team });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
    expect(mockDeleteMatch).toHaveBeenNthCalledWith(1, matchId1);
    expect(mockDeleteMatch).toHaveBeenNthCalledWith(2, matchId2);
  });

  it('should handle error if unable to query matches', async () => {
    const teamId = 'teamId';
    const team = {
      teamId
    } as TeamDocument;

    mockQueryMatchKeysByTeamId.mockRejectedValue(undefined);

    const result = await service({ team });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
    expect(mockDeleteMatch).not.toHaveBeenCalled();
  });

  it('should handle error if unable to delete matches', async () => {
    const teamId = 'teamId';
    const matchId1 = 'matchId1';
    const matchId2 = 'matchId2';
    const team = {
      teamId
    } as TeamDocument;

    const queriedMatches = [{
      teamId,
      matchId: matchId1
    }, {
      teamId,
      matchId: matchId2
    }] as IndexByTeamIdDocument[];

    mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);
    mockDeleteMatch.mockRejectedValue(undefined);

    const result = await service({ team });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
  });
});
