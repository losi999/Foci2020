import { ISetDefaultTournamentService, setDefaultTournamentServiceFactory } from '@foci2020/api/functions/set-default-tournament/set-default-tournament-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { settingDocument, tournamentDocument } from '@foci2020/shared/common/test-data-factory';
import { ISettingDocumentConverter } from '@foci2020/shared/converters/setting-document-converter';
import { TournamentId, TournamentIdType } from '@foci2020/shared/types/common';

describe('Set default tournament service', () => {
  let service: ISetDefaultTournamentService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockSettingDocumentConverter: Mock<ISettingDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('getTournamentById', 'saveSetting');
    mockSettingDocumentConverter = createMockService('create');

    service = setDefaultTournamentServiceFactory(mockDatabaseService.service, mockSettingDocumentConverter.service);
  });

  const body: TournamentId = {
    tournamentId: 'tournamentId' as TournamentIdType,
  };

  const createdDocument = settingDocument({
    value: body.tournamentId,
  });

  it('should return', async () => {
    mockDatabaseService.functions.getTournamentById.mockResolvedValue(tournamentDocument());
    mockSettingDocumentConverter.functions.create.mockReturnValue(createdDocument);
    mockDatabaseService.functions.saveSetting.mockResolvedValue(undefined);

    await service(body);
    validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
    validateFunctionCall(mockSettingDocumentConverter.functions.create, 'defaultTournamentId', body.tournamentId);
    validateFunctionCall(mockDatabaseService.functions.saveSetting, createdDocument);
    expect.assertions(3);
  });

  describe('should throw error', () => {
    it('if unable to query tournament', async () => {
      mockDatabaseService.functions.getTournamentById.mockRejectedValue('This is a dynamo error');
  
      await service(body).catch(validateError('Unable to get tournament', 500));
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockSettingDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveSetting);
      expect.assertions(5);
    });

    it('if no tournament found', async () => {
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(undefined);
  
      await service(body).catch(validateError('No tournament found', 404));
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockSettingDocumentConverter.functions.create);
      validateFunctionCall(mockDatabaseService.functions.saveSetting);
      expect.assertions(5);
    });

    it('if unable to save setting', async () => {
      mockDatabaseService.functions.getTournamentById.mockResolvedValue(tournamentDocument());
      mockSettingDocumentConverter.functions.create.mockReturnValue(createdDocument);
      mockDatabaseService.functions.saveSetting.mockRejectedValue('This is a dynamo error');
  
      await service(body).catch(validateError('Unable to save setting', 500));
      validateFunctionCall(mockDatabaseService.functions.getTournamentById, body.tournamentId);
      validateFunctionCall(mockSettingDocumentConverter.functions.create, 'defaultTournamentId', body.tournamentId);
      validateFunctionCall(mockDatabaseService.functions.saveSetting, createdDocument);
      expect.assertions(5);
    });
  });  
});
