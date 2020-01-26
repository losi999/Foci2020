import { IUpdateTeamOfMatchesService, updateTeamOfMatchesServiceFactory } from '@/business-services/update-team-of-matches-service';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument, TeamDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { Mock, createMockService, validateError } from '@/common';

describe('Update team of matches service', () => {
  let service: ReturnType<typeof updateTeamOfMatchesServiceFactory>;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('queryMatchKeysByHomeTeamId', 'queryMatchKeysByAwayTeamId', 'updateTeamOfMatches');

    service = updateTeamOfMatchesServiceFactory(mockMatchDocumentService.service);
  });

  describe('home', () => {
    let home: IUpdateTeamOfMatchesService;

    beforeEach(() => {
      home = service.home();
    });

    it('should return undefined if matches are updated successfully', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';

      const team = {
        id: teamId
      } as TeamDocument;

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.updateTeamOfMatches.mockResolvedValue(undefined);

      const result = await home({ teamId, team });
      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.updateTeamOfMatches).toHaveBeenCalledWith([matchId1], team, 'home');
    });

    it('should throw error if unable to query matches by homeTeam Id', async () => {
      const teamId = 'teamId';

      const team = {
        id: teamId
      } as TeamDocument;

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message });

      await home({ teamId, team }).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.updateTeamOfMatches).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to update matches', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';

      const team = {
        id: teamId
      } as TeamDocument;

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.updateTeamOfMatches.mockRejectedValue({ message });

      await home({ teamId, team }).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.updateTeamOfMatches).toHaveBeenCalledWith([matchId1], team, 'home');
      expect.assertions(3);
    });
  });

  describe('away', () => {
    let away: IUpdateTeamOfMatchesService;

    beforeEach(() => {
      away = service.away();
    });

    it('should return undefined if matches are updated successfully', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';

      const team = {
        id: teamId
      } as TeamDocument;

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.updateTeamOfMatches.mockResolvedValue(undefined);

      const result = await away({ teamId, team });
      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.updateTeamOfMatches).toHaveBeenCalledWith([matchId1], team, 'away');
    });

    it('should throw error if unable to query matches by awayTeam Id', async () => {
      const teamId = 'teamId';

      const team = {
        id: teamId
      } as TeamDocument;

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message });

      await away({ teamId, team }).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.updateTeamOfMatches).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to update matches', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';

      const team = {
        id: teamId
      } as TeamDocument;

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.updateTeamOfMatches.mockRejectedValue({ message });

      await away({ teamId, team }).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.updateTeamOfMatches).toHaveBeenCalledWith([matchId1], team, 'away');
      expect.assertions(3);
    });
  });
});
