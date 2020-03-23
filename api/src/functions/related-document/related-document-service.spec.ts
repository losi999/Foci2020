import { IRelatedDocumentService, relatedDocumentServiceFactory } from '@/functions/related-document/related-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument, TournamentDocument, TeamDocument, BetDocument, MatchDocument, StandingDocument } from '@/types/types';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { IStandingDocumentConverter } from '@/converters/standing-document-converter';
import { IDatabaseService } from '@/services/database-service';

describe('Related document service', () => {
  let service: IRelatedDocumentService;
  let mockDatabaseService: Mock<IDatabaseService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;
  let mockStandingDocumentConverter: Mock<IStandingDocumentConverter>;

  beforeEach(() => {
    mockDatabaseService = createMockService('deleteMatch',
      'updateTeamOfMatch',
      'updateTournamentOfMatch',
      'queryMatchKeysByAwayTeamId',
      'queryMatchKeysByHomeTeamId',
      'queryMatchesByTournamentId',
      'queryBetsByMatchId',
      'deleteBet',
      'updateBet',
      'queryBetsByTournamentIdUserId',
      'saveStanding');
    mockBetDocumentConverter = createMockService('calculateResult');
    mockStandingDocumentConverter = createMockService('create');

    service = relatedDocumentServiceFactory(
      mockDatabaseService.service,
      mockBetDocumentConverter.service,
      mockStandingDocumentConverter.service);
  });

  describe('teamDeleted', () => {
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

      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockDatabaseService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.teamDeleted(teamId);
      expect(result).toBeUndefined();
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
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
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message });
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

      await service.teamDeleted(teamId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.deleteMatch).not.toHaveBeenCalled();
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
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message });

      await service.teamDeleted(teamId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.deleteMatch).not.toHaveBeenCalled();
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
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockDatabaseService.functions.deleteMatch.mockRejectedValue({ message });

      await service.teamDeleted(teamId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
      expect.assertions(5);
    });
  });

  describe('tournamentDeleted', () => {
    it('should return undefined if matches are deleted sucessfully', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';

      const queriedMatches = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }] as MatchDocument[];

      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockDatabaseService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.tournamentDeleted(tournamentId);

      expect(result).toBeUndefined();
      expect(mockDatabaseService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenCalledWith(matchId1);
      expect.assertions(3);
    });

    it('should throw error if unable to query matches by tournament Id', async () => {
      const tournamentId = 'tournamentId';

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue({ message });

      await service.tournamentDeleted(tournamentId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockDatabaseService.functions.deleteMatch).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to delete matches', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';

      const queriedMatches = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }] as MatchDocument[];

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockDatabaseService.functions.deleteMatch.mockRejectedValue({ message });

      await service.tournamentDeleted(tournamentId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenCalledWith(matchId1);
      expect.assertions(3);
    });
  });

  describe('teamUpdated', () => {
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

      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockDatabaseService.functions.updateTeamOfMatch.mockResolvedValue(undefined);

      const result = await service.teamUpdated(team);
      expect(result).toBeUndefined();
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
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
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockRejectedValue({ message });
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);

      await service.teamUpdated(team).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.updateTeamOfMatch).not.toHaveBeenCalled();
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
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockRejectedValue({ message });

      await service.teamUpdated(team).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.deleteMatch).not.toHaveBeenCalled();
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
      mockDatabaseService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockDatabaseService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockDatabaseService.functions.updateTeamOfMatch.mockRejectedValue({ message });

      await service.teamUpdated(team).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
      expect.assertions(5);
    });
  });

  describe('tournamentUpdated', () => {
    it('should return undefined if matches are updated sucessfully', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';
      const tournament = { id: tournamentId } as TournamentDocument;

      const queriedMatches = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }] as MatchDocument[];

      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockDatabaseService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

      const result = await service.tournamentUpdated(tournament);

      expect(result).toBeUndefined();
      expect(mockDatabaseService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockDatabaseService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(matchId1, tournament);
      expect.assertions(3);
    });

    it('should throw error if unable to query matches by tournament Id', async () => {
      const tournamentId = 'tournamentId';
      const tournament = { id: tournamentId } as TournamentDocument;

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue({ message });

      await service.tournamentUpdated(tournament).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockDatabaseService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to update matches', async () => {
      const tournamentId = 'tournamentId';
      const matchId1 = 'matchId1';
      const tournament = { id: tournamentId } as TournamentDocument;

      const queriedMatches = [{
        tournamentId,
        id: matchId1,
        'documentType-id': ''
      }] as MatchDocument[];

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockDatabaseService.functions.updateTournamentOfMatch.mockRejectedValue({ message });

      await service.tournamentUpdated(tournament).catch(validateError(message));
      expect(mockDatabaseService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockDatabaseService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(matchId1, tournament);
      expect.assertions(3);
    });
  });

  describe('matchDeleted', () => {
    it('should return undefined if bets are deleted', async () => {
      const matchId = 'matchId';
      const bet = {
        userId: 'userId',
        matchId: 'matchId'
      } as BetDocument;
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      mockDatabaseService.functions.deleteBet.mockResolvedValue(undefined);

      const result = await service.matchDeleted(matchId);
      expect(result).toBeUndefined();
      expect(mockDatabaseService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
      expect(mockDatabaseService.functions.deleteBet).toHaveBeenCalledWith(bet.userId, bet.matchId);
      expect.assertions(3);
    });

    it('should throw error if unable to query bets by match Id', async () => {
      const matchId = 'matchId';

      const message = 'this is a dynamo error';
      mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue({ message });

      await service.matchDeleted(matchId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
      expect(mockDatabaseService.functions.deleteBet).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to delete bet', async () => {
      const matchId = 'matchId';
      const bet = {
        userId: 'userId',
        matchId: 'matchId'
      } as BetDocument;
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const message = 'this is a dynamo error';
      mockDatabaseService.functions.deleteBet.mockRejectedValue({ message });

      await service.matchDeleted(matchId).catch(validateError(message));
      expect(mockDatabaseService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
      expect(mockDatabaseService.functions.deleteBet).toHaveBeenCalledWith(bet.userId, bet.matchId);
      expect.assertions(3);
    });
  });

  describe('matchFinalScoreUpdated', () => {
    it('should return undefined if bets are updated', async () => {
      const match = {
        id: 'matchId',
        finalScore: {
          homeScore: 1,
          awayScore: 0
        }
      } as MatchDocument;

      const bet = {
        id: 'betId'
      } as BetDocument;
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const converted = {
        id: bet.id
      } as BetDocument;
      mockBetDocumentConverter.functions.calculateResult.mockReturnValue(converted);

      mockDatabaseService.functions.updateBet.mockResolvedValue(undefined);

      await service.matchFinalScoreUpdated(match);
      expect(mockDatabaseService.functions.queryBetsByMatchId).toHaveBeenCalledWith(match.id);
      expect(mockBetDocumentConverter.functions.calculateResult).toHaveBeenCalledWith(bet, match.finalScore);
      expect(mockDatabaseService.functions.updateBet).toHaveBeenCalledWith(converted);
    });

    it('should throw error if unable to query bets by match id', async () => {
      const match = {
        id: 'matchId',
      } as MatchDocument;

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue({ message });

      await service.matchFinalScoreUpdated(match).catch((validateError(message)));
      expect(mockDatabaseService.functions.queryBetsByMatchId).toHaveBeenCalledWith(match.id);
      expect(mockBetDocumentConverter.functions.calculateResult).not.toHaveBeenCalled();
      expect(mockDatabaseService.functions.updateBet).not.toHaveBeenCalled();
    });

    it('should throw error if unable to update bet', async () => {
      const match = {
        id: 'matchId',
        finalScore: {
          homeScore: 1,
          awayScore: 0
        }
      } as MatchDocument;

      const bet = {
        id: 'betId'
      } as BetDocument;
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const converted = {
        id: bet.id
      } as BetDocument;
      mockBetDocumentConverter.functions.calculateResult.mockReturnValue(converted);

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.updateBet.mockRejectedValue({ message });

      await service.matchFinalScoreUpdated(match).catch((validateError(message)));
      expect(mockDatabaseService.functions.queryBetsByMatchId).toHaveBeenCalledWith(match.id);
      expect(mockBetDocumentConverter.functions.calculateResult).toHaveBeenCalledWith(bet, match.finalScore);
      expect(mockDatabaseService.functions.updateBet).toHaveBeenCalledWith(converted);
    });
  });

  describe('betResultCalculated', () => {
    const tournamentId = 'tournamentId';
    const userId = 'userId';
    it('should return undefined if standing document is saved successfully', async () => {

      const bets = [{
        id: 'betId'
      }] as BetDocument[];
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(bets);

      const converted = {
        id: 'standingId'
      } as StandingDocument;
      mockStandingDocumentConverter.functions.create.mockReturnValue(converted);

      mockDatabaseService.functions.saveStanding.mockResolvedValue(undefined);

      await service.betResultCalculated(tournamentId, userId);
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenCalledWith(tournamentId, userId);
      expect(mockStandingDocumentConverter.functions.create).toHaveBeenCalledWith(bets);
      expect(mockDatabaseService.functions.saveStanding).toHaveBeenCalledWith(converted);
    });

    it('should throw error if unable to query bets by tournament and user id', async () => {
      const message = 'This is a dynamo error';
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockRejectedValue({ message });

      await service.betResultCalculated(tournamentId, userId).catch((validateError(message)));
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenCalledWith(tournamentId, userId);
      expect(mockStandingDocumentConverter.functions.create).not.toHaveBeenCalled();
      expect(mockDatabaseService.functions.saveStanding).not.toHaveBeenCalled();
    });

    it('should throw error if unable to save standing document', async () => {
      const bets = [{
        id: 'betId'
      }] as BetDocument[];
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(bets);

      const converted = {
        id: 'standingId'
      } as StandingDocument;
      mockStandingDocumentConverter.functions.create.mockReturnValue(converted);

      const message = 'This is a dynamo error';
      mockDatabaseService.functions.saveStanding.mockRejectedValue({ message });

      await service.betResultCalculated(tournamentId, userId).catch((validateError(message)));
      expect(mockDatabaseService.functions.queryBetsByTournamentIdUserId).toHaveBeenCalledWith(tournamentId, userId);
      expect(mockStandingDocumentConverter.functions.create).toHaveBeenCalledWith(bets);
      expect(mockDatabaseService.functions.saveStanding).toHaveBeenCalledWith(converted);
    });
  });
});
