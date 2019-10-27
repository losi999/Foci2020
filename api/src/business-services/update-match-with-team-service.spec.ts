import { IUpdateMatchWithTeamService, updateMatchWithTeamServiceFactory } from '@/business-services/update-match-with-team-service';
import { IDatabaseService } from '@/services/database-service';
import { TeamDocument, MatchTeamDocument } from '@/types/documents';

describe('Update match with team service', () => {
  let service: IUpdateMatchWithTeamService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryMatchKeysByTeamId: jest.Mock;
  let mockUpdateMatchesWithTeam: jest.Mock;

  beforeEach(() => {
    mockUpdateMatchesWithTeam = jest.fn();
    mockQueryMatchKeysByTeamId = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      updateMatchesWithTeam: mockUpdateMatchesWithTeam,
      queryMatchKeysByTeamId: mockQueryMatchKeysByTeamId
    })))() as IDatabaseService;

    service = updateMatchWithTeamServiceFactory(mockDatabaseService);
  });

  it('should return undefined if matches are updated sucessfully', async () => {
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
    }] as MatchTeamDocument[];

    mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);
    mockUpdateMatchesWithTeam.mockResolvedValue(undefined);
    const result = await service({
      teamId,
      team
    });
    expect(result).toBeUndefined();
    expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
    expect(mockUpdateMatchesWithTeam).toHaveBeenCalledWith(queriedMatches, team);
  });

  it('should throw error if unable to query matches', async () => {
    const teamId = 'teamId';
    const team = {
      teamId
    } as TeamDocument;

    const errorMessage = 'This is a dynamo error';
    mockQueryMatchKeysByTeamId.mockRejectedValue(errorMessage);

    try {
      await service({
        teamId,
        team
      });
    } catch (error) {
      expect(error).toEqual(errorMessage);
      expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
      expect(mockUpdateMatchesWithTeam).not.toHaveBeenCalled();
    }
  });

  it('should throw error if unable to update matches', async () => {
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
    }] as MatchTeamDocument[];

    mockQueryMatchKeysByTeamId.mockResolvedValue(queriedMatches);

    const errorMessage = 'This is a dynamo error';
    mockUpdateMatchesWithTeam.mockRejectedValue(errorMessage);

    try {
      await service({
        teamId,
        team
      });
    } catch (error) {
      expect(error).toEqual(errorMessage);
      expect(mockQueryMatchKeysByTeamId).toHaveBeenCalledWith(teamId);
      expect(mockUpdateMatchesWithTeam).toHaveBeenCalledWith(queriedMatches, team);
    }
  });
});
