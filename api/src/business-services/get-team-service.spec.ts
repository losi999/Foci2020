import { IDatabaseService } from '@/services/database-service';
import { IGetTeamService, getTeamServiceFactory } from '@/business-services/get-team-service';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';

describe('Get team service', () => {
  let service: IGetTeamService;
  let mockDatabaseService: IDatabaseService;
  let mockQueryTeamById: jest.Mock;
  let mockConverter: jest.Mock;

  beforeEach(() => {
    mockQueryTeamById = jest.fn();
    mockDatabaseService = new (jest.fn<Partial<IDatabaseService>, undefined[]>(() => ({
      queryTeamById: mockQueryTeamById,
    }))) as IDatabaseService;

    mockConverter = jest.fn();

    service = getTeamServiceFactory(mockDatabaseService, mockConverter);
  });

  it('should return with a team', async () => {
    const teamId = 'teamId';
    const teamName = 'Team';
    const teamDocument = {
      teamId,
      teamName,
      segment: 'details',
    } as TeamDocument;

    mockQueryTeamById.mockResolvedValue(teamDocument);

    const teamResponse = {
      teamId,
      teamName
    } as TeamResponse;

    mockConverter.mockReturnValueOnce(teamResponse);

    const result = await service({ teamId });
    expect(result).toEqual(teamResponse);
    expect(mockConverter).toHaveBeenCalledWith(teamDocument);
  });

  it('should throw error if unable to query team', async () => {
    const teamId = 'teamId';
    mockQueryTeamById.mockRejectedValue('This is a dynamo error');

    try {
      await service({ teamId });
    } catch (error) {
      expect(error.statusCode).toEqual(500);
      expect(error.message).toEqual('Unable to query team');
    }
  });
});
