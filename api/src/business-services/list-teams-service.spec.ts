import { IDatabaseService } from '@/services/database-service';
import { IListTeamsService, listTeamsServiceFactory } from '@/business-services/list-teams-service';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';

describe('List teams service', () => {
  let service: IListTeamsService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryTeams: jest.Mock;
  let mockConverter: jest.Mock;

  beforeEach(() => {
    mockQueryTeams = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryTeams: mockQueryTeams,
    }))) as IDatabaseService;

    mockConverter = jest.fn();

    service = listTeamsServiceFactory(mockDatabaseService, mockConverter);
  });

  it('should return with list of teams', async () => {
    const teamId1 = 'team1';
    const teamId2 = 'team2';
    const teamName1 = 'team1';
    const teamName2 = 'team2';
    const teamDocument1 = {
      segment: 'details',
      teamId: teamId1,
      teamName: teamName1
    } as TeamDocument;
    const teamDocument2 = {
      segment: 'details',
      teamId: teamId2,
      teamName: teamName2
    } as TeamDocument;

    const queriedDocuments: TeamDocument[] = [
      teamDocument1,
      teamDocument2] as TeamDocument[];
    mockQueryTeams.mockResolvedValue(queriedDocuments);

    const teamResponse1 = {
      teamId: teamId1,
      teamName: teamName1
    } as TeamResponse;
    const teamResponse2 = {
      teamId: teamId2,
      teamName: teamName2
    } as TeamResponse;

    mockConverter.mockReturnValueOnce(teamResponse1);
    mockConverter.mockReturnValueOnce(teamResponse2);

    const result = await service();
    expect(result).toEqual([teamResponse1, teamResponse2]);
    expect(mockConverter).toHaveBeenNthCalledWith(1, teamDocument1);
    expect(mockConverter).toHaveBeenNthCalledWith(2, teamDocument2);
  });

  it('should throw error if unable to query teams', async () => {
    mockQueryTeams.mockRejectedValue('This is a dynamo error');

    try {
      await service();
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query teams');
    }
  });
});
