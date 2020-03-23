import { IListTeamsService, listTeamsServiceFactory } from '@/functions/list-teams/list-teams-service';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { TeamDocument, TeamResponse } from '@/types/types';
import { IDatabaseService } from '@/services/database-service';

describe('List teams service', () => {
  let service: IListTeamsService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('listTeams');
    mockTeamDocumentConverter = createMockService('toResponseList');

    service = listTeamsServiceFactory(mockDatabaseService.service, mockTeamDocumentConverter.service);
  });

  it('should return with list of teams', async () => {
    const teamId1 = 'team1';
    const teamId2 = 'team2';
    const teamName1 = 'team1';
    const teamName2 = 'team2';
    const teamDocument1 = {
      id: teamId1,
      teamName: teamName1
    } as TeamDocument;
    const teamDocument2 = {
      id: teamId2,
      teamName: teamName2
    } as TeamDocument;

    const queriedDocuments: TeamDocument[] = [
      teamDocument1,
      teamDocument2] as TeamDocument[];
    mockDatabaseService.functions.listTeams.mockResolvedValue(queriedDocuments);

    const teamResponse = [
      {
        teamId: teamId1,
        teamName: teamName1
      },
      {
        teamId: teamId2,
        teamName: teamName2
      }
    ] as TeamResponse[];

    mockTeamDocumentConverter.functions.toResponseList.mockReturnValue(teamResponse);

    const result = await service();
    expect(result).toEqual(teamResponse);
    expect(mockDatabaseService.functions.listTeams).toHaveBeenCalledWith();
    expect(mockTeamDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedDocuments);
  });

  it('should throw error if unable to query teams', async () => {
    mockDatabaseService.functions.listTeams.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to query teams', 500));
    expect(mockDatabaseService.functions.listTeams).toHaveBeenCalledWith();
    expect(mockTeamDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
