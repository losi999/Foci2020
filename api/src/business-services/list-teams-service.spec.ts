import { IListTeamsService, listTeamsServiceFactory } from '@/business-services/list-teams-service';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';
import { ITeamDocumentConverter } from '@/converters/team-document-converter';
import { ITeamDocumentService } from '@/services/team-document-service';

describe('List teams service', () => {
  let service: IListTeamsService;
  let mockTeamDocumentService: ITeamDocumentService;
  let mockQueryTeams: jest.Mock;
  let mockTeamDocumentConverter: ITeamDocumentConverter;
  let mockCreateResponseList: jest.Mock;

  beforeEach(() => {
    mockQueryTeams = jest.fn();
    mockTeamDocumentService = new (jest.fn<Partial<ITeamDocumentService>, undefined[]>(() => ({
      queryTeams: mockQueryTeams,
    }))) as ITeamDocumentService;

    mockCreateResponseList = jest.fn();
    mockTeamDocumentConverter = new (jest.fn<Partial<ITeamDocumentConverter>, undefined[]>(() => ({
      createResponseList: mockCreateResponseList
    })))() as ITeamDocumentConverter;

    service = listTeamsServiceFactory(mockTeamDocumentService, mockTeamDocumentConverter);
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

    mockCreateResponseList.mockReturnValue(teamResponse);

    const result = await service();
    expect(result).toEqual(teamResponse);
    expect(mockCreateResponseList).toHaveBeenCalledWith(queriedDocuments);
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
