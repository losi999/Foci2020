import { IListMatchesOfTournamentService, listMatchesOfTournamentServiceFactory } from '@/functions/list-matches-of-tournament/list-matches-of-tournament-service';
import { IMatchDocumentConverter } from '@/converters/match-document-converter';
import { Mock, createMockService, validateError, validateFunctionCall } from '@/common/unit-testing';
import { IDatabaseService } from '@/services/database-service';
import { matchResponse, matchDocument } from '@/common/test-data-factory';

describe('List matches of tournament service', () => {
  let service: IListMatchesOfTournamentService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockMatchDocumentConverter: Mock<IMatchDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('queryMatchesByTournamentId');

    mockMatchDocumentConverter = createMockService('toResponseList');

    service = listMatchesOfTournamentServiceFactory(mockDatabaseService.service, mockMatchDocumentConverter.service);
  });

  const tournamentId = 'tournamentId';

  it('should return with list of matches', async () => {
    const queriedDocuments = [matchDocument()];
    mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedDocuments);

    const response = [matchResponse()];

    mockMatchDocumentConverter.functions.toResponseList.mockReturnValueOnce(response);

    const result = await service({ tournamentId });
    expect(result).toEqual(response);
    validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponseList, queriedDocuments);
  });

  it('should throw error if unable to query matches', async () => {
    mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue('This is a dynamo error');

    await service({ tournamentId }).catch(validateError('Unable to query matches', 500));
    validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
    validateFunctionCall(mockMatchDocumentConverter.functions.toResponseList);
    expect.assertions(4);
  });
});