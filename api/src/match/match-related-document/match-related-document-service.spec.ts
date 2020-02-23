import { IMatchRelatedDocumentService, matchRelatedDocumentServiceFactory } from '@/match/match-related-document/match-related-document-service';
import { Mock, createMockService, validateError } from '@/shared/common';
import { IMatchDocumentService } from '@/match/match-document-service';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument, IndexByTournamentIdDocument, TournamentDocument, TeamDocument } from '@/shared/types/types';

describe('Match related document service', () => {
  let service: IMatchRelatedDocumentService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('deleteMatch', 'updateTeamOfMatch', 'updateTournamentOfMatch', 'queryMatchKeysByAwayTeamId', 'queryMatchKeysByHomeTeamId', 'queryMatchKeysByTournamentId');

    service = matchRelatedDocumentServiceFactory(mockMatchDocumentService.service);
  });

  describe('deleteMatchByTeam', () => {
    it('should return undefined if matches are deleted successfully', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';
      const matchId2 = 'matchId2';

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: teamId,
        id: matchId2,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.deleteMatchByTeam(teamId);
      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
      expect.assertions(5);
    });

    it('should throw error if unable to query matches by homeTeam Id', async () => {
      const teamId = 'teamId';
      const matchId2 = 'matchId2';

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: teamId,
        id: matchId2,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message });
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

      await service.deleteMatchByTeam(teamId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.deleteMatch).not.toHaveBeenCalled();
      expect.assertions(4);
    });

    it('should throw error if unable to query matches by awayTeam Id', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message });

      await service.deleteMatchByTeam(teamId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.deleteMatch).not.toHaveBeenCalled();
      expect.assertions(4);
    });

    it('should throw error if unable to delete matches', async () => {
      const teamId = 'teamId';
      const matchId1 = 'matchId1';
      const matchId2 = 'matchId2';

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: teamId,
        id: matchId1,
        'documentType-id': ''
      }];

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: teamId,
        id: matchId2,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.deleteMatch.mockRejectedValue({ message });

      await service.deleteMatchByTeam(teamId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
      expect.assertions(5);
    });
  });

  describe('deleteMatchByTournament', () => {
    it('should return undefined if matches are deleted sucessfully', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';

      const queriedMatches: IndexByTournamentIdDocument[] = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.deleteMatchByTournament(tournamentId);

      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenCalledWith(matchId1);
      expect.assertions(3);
    });

    it('should throw error if unable to query matches by tournament Id', async () => {
      const tournamentId = 'tournamentId';

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockRejectedValue({ message });

      await service.deleteMatchByTournament(tournamentId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.deleteMatch).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to delete matches', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';

      const queriedMatches: IndexByTournamentIdDocument[] = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.deleteMatch.mockRejectedValue({ message });

      await service.deleteMatchByTournament(tournamentId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenCalledWith(matchId1);
      expect.assertions(3);
    });
  });

  describe('updateTeamOfMatch', () => {
    it('should return undefined if matches are updated successfully', async () => {
      const team = {
        id: 'teamId'
      } as TeamDocument;
      const matchId1 = 'matchId1';
      const matchId2 = 'matchId2';

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: team.id,
        id: matchId1,
        'documentType-id': ''
      }];

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: team.id,
        id: matchId2,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.updateTeamOfMatch.mockResolvedValue(undefined);

      const result = await service.updateTeamOfMatch(team);
      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
      expect.assertions(5);
    });

    it('should throw error if unable to query matches by homeTeam Id', async () => {
      const team = {
        id: 'teamId'
      } as TeamDocument;
      const matchId2 = 'matchId2';

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: team.id,
        id: matchId2,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message });
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

      await service.updateTeamOfMatch(team).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).not.toHaveBeenCalled();
      expect.assertions(4);
    });

    it('should throw error if unable to query matches by awayTeam Id', async () => {
      const team = {
        id: 'teamId'
      } as TeamDocument;
      const matchId1 = 'matchId1';

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: team.id,
        id: matchId1,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message });

      await service.updateTeamOfMatch(team).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.deleteMatch).not.toHaveBeenCalled();
      expect.assertions(4);
    });

    it('should throw error if unable to update matches', async () => {
      const team = {
        id: 'teamId'
      } as TeamDocument;
      const matchId1 = 'matchId1';
      const matchId2 = 'matchId2';

      const queriedHomeMatches: IndexByHomeTeamIdDocument[] = [{
        homeTeamId: team.id,
        id: matchId1,
        'documentType-id': ''
      }];

      const queriedAwayMatches: IndexByAwayTeamIdDocument[] = [{
        awayTeamId: team.id,
        id: matchId2,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.updateTeamOfMatch.mockRejectedValue({ message });

      await service.updateTeamOfMatch(team).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
      expect.assertions(5);
    });
  });

  describe('updateTournamentOfMatch', () => {
    it('should return undefined if matches are updated sucessfully', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';
      const tournament = { id: tournamentId } as TournamentDocument;

      const queriedMatches: IndexByTournamentIdDocument[] = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }];

      mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

      const result = await service.updateTournamentOfMatch(tournament);

      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(matchId1, tournament);
      expect.assertions(3);
    });

    it('should throw error if unable to query matches by tournament Id', async () => {
      const tournamentId = 'tournamentId';
      const tournament = { id: tournamentId } as TournamentDocument;

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockRejectedValue({ message });

      await service.updateTournamentOfMatch(tournament).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to update matches', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';
      const tournament = { id: tournamentId } as TournamentDocument;

      const queriedMatches: IndexByTournamentIdDocument[] = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }];

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchKeysByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.updateTournamentOfMatch.mockRejectedValue({ message });

      await service.updateTournamentOfMatch(tournament).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(matchId1, tournament);
      expect.assertions(3);
    });
  });
});
