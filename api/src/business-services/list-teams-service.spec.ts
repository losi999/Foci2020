import { IListTeamsService, listTeamsServiceFactory } from '@/business-services/list-teams-service';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITeamDocumentService } from '@/services/team-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('List teams service', () => {
  let service: IListTeamsService;
  let mockTeamDocumentService: Mock<ITeamDocumentService>;
  let mockTeamDocumentConverter: Mock<ITeamDocumentConverter>;

  beforeEach(() => {
    mockTeamDocumentService = createMockService('queryTeams');
    mockTeamDocumentConverter = createMockService('toResponseList');

    service = listTeamsServiceFactory(mockTeamDocumentService.service, mockTeamDocumentConverter.service);
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
    mockTeamDocumentService.functions.queryTeams.mockResolvedValue(queriedDocuments);

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
    expect(mockTeamDocumentService.functions.queryTeams).toHaveBeenCalledWith();
    expect(mockTeamDocumentConverter.functions.toResponseList).toHaveBeenCalledWith(queriedDocuments);
  });

  it('should throw error if unable to query teams', async () => {
    mockTeamDocumentService.functions.queryTeams.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to query teams', 500));
    expect(mockTeamDocumentService.functions.queryTeams).toHaveBeenCalledWith();
    expect(mockTeamDocumentConverter.functions.toResponseList).not.toHaveBeenCalled();
    expect.assertions(4);
  });
});
