import { IGetDefaultTournamentIdService, getDefaultTournamentIdServiceFactory } from '@foci2020/api/functions/get-default-tournament-id/get-default-tournament-id-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { settingDocument } from '@foci2020/shared/common/test-data-factory';

describe('Get default tournament id service', () => {
  let service: IGetDefaultTournamentIdService;
  let mockDatabaseService: Mock<IDatabaseService>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getSettingByKey');

    service = getDefaultTournamentIdServiceFactory(mockDatabaseService.service);
  });

  const tournamentId = 'tournamentId';

  it('should return with tournamentId', async () => {
    const queriedDocument = settingDocument({
      value: tournamentId,
    });
    mockDatabaseService.functions.getSettingByKey.mockResolvedValue(queriedDocument);

    const result = await service();
    expect(result).toEqual(tournamentId);
    validateFunctionCall(mockDatabaseService.functions.getSettingByKey, 'defaultTournamentId');
    expect.assertions(2);
  });

  it('should throw error if unable to query teams', async () => {
    mockDatabaseService.functions.getSettingByKey.mockRejectedValue('This is a dynamo error');

    await service().catch(validateError('Unable to get setting', 500));
    validateFunctionCall(mockDatabaseService.functions.getSettingByKey, 'defaultTournamentId');
    expect.assertions(3);
  });
});
