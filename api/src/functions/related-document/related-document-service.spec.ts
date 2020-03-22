import { IRelatedDocumentService, relatedDocumentServiceFactory } from '@/functions/related-document/related-document-service';
import { Mock, createMockService, validateError } from '@/common/unit-testing';
import { IMatchDocumentService } from '@/services/match-document-service';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument, TournamentDocument, TeamDocument, BetDocument, MatchDocument, StandingDocument } from '@/types/types';
import { IBetDocumentService } from '@/services/bet-document-service';
import { IBetDocumentConverter } from '@/converters/bet-document-converter';
import { IStandingDocumentService } from '@/services/standing-document-service';
import { IStandingDocumentConverter } from '@/converters/standing-document-converter';

describe('Related document service', () => {
  let service: IRelatedDocumentService;
  let mockMatchDocumentService: Mock<IMatchDocumentService>;
  let mockBetDocumentService: Mock<IBetDocumentService>;
  let mockBetDocumentConverter: Mock<IBetDocumentConverter>;
  let mockStandingDocumentService: Mock<IStandingDocumentService>;
  let mockStandingDocumentConverter: Mock<IStandingDocumentConverter>;

  beforeEach(() => {
    mockMatchDocumentService = createMockService('deleteMatch',
      'updateTeamOfMatch',
      'updateTournamentOfMatch',
      'queryMatchKeysByAwayTeamId',
      'queryMatchKeysByHomeTeamId',
      'queryMatchesByTournamentId');
    mockBetDocumentService = createMockService('queryBetsByMatchId', 'deleteBet', 'updateBet', 'queryBetsByTournamentIdUserId');
    mockBetDocumentConverter = createMockService('calculateResult');
    mockStandingDocumentService = createMockService('saveStanding');
    mockStandingDocumentConverter = createMockService('create');

    service = relatedDocumentServiceFactory(
      mockMatchDocumentService.service,
      mockBetDocumentService.service,
      mockBetDocumentConverter.service,
      mockStandingDocumentConverter.service,
      mockStandingDocumentService.service);
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

      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.teamDeleted(teamId);
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

      await service.teamDeleted(teamId).catch(validateError(message));
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

      await service.teamDeleted(teamId).catch(validateError(message));
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

      await service.teamDeleted(teamId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(teamId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
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

      mockMatchDocumentService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.tournamentDeleted(tournamentId);

      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenCalledWith(matchId1);
      expect.assertions(3);
    });

    it('should throw error if unable to query matches by tournament Id', async () => {
      const tournamentId = 'tournamentId';

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchesByTournamentId.mockRejectedValue({ message });

      await service.tournamentDeleted(tournamentId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.deleteMatch).not.toHaveBeenCalled();
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
      mockMatchDocumentService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.deleteMatch.mockRejectedValue({ message });

      await service.tournamentDeleted(tournamentId).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.deleteMatch).toHaveBeenCalledWith(matchId1);
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

      mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId.mockResolvedValue(queriedHomeMatches);
      mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId.mockResolvedValue(queriedAwayMatches);
      mockMatchDocumentService.functions.updateTeamOfMatch.mockResolvedValue(undefined);

      const result = await service.teamUpdated(team);
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

      await service.teamUpdated(team).catch(validateError(message));
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

      await service.teamUpdated(team).catch(validateError(message));
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

      await service.teamUpdated(team).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchKeysByHomeTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.queryMatchKeysByAwayTeamId).toHaveBeenCalledWith(team.id);
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
      expect(mockMatchDocumentService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
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

      mockMatchDocumentService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

      const result = await service.tournamentUpdated(tournament);

      expect(result).toBeUndefined();
      expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(matchId1, tournament);
      expect.assertions(3);
    });

    it('should throw error if unable to query matches by tournament Id', async () => {
      const tournamentId = 'tournamentId';
      const tournament = { id: tournamentId } as TournamentDocument;

      const message = 'This is a dynamo error';
      mockMatchDocumentService.functions.queryMatchesByTournamentId.mockRejectedValue({ message });

      await service.tournamentUpdated(tournament).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.updateTournamentOfMatch).not.toHaveBeenCalled();
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
      mockMatchDocumentService.functions.queryMatchesByTournamentId.mockResolvedValue(queriedMatches);
      mockMatchDocumentService.functions.updateTournamentOfMatch.mockRejectedValue({ message });

      await service.tournamentUpdated(tournament).catch(validateError(message));
      expect(mockMatchDocumentService.functions.queryMatchesByTournamentId).toHaveBeenCalledWith(tournamentId);
      expect(mockMatchDocumentService.functions.updateTournamentOfMatch).toHaveBeenCalledWith(matchId1, tournament);
      expect.assertions(3);
    });
  });

  describe('matchDeleted', () => {
    it('should return undefined if bets are deleted', async () => {
      const matchId = 'matchId';
      const bet = {
        id: 'betId'
      } as BetDocument;
      mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      mockBetDocumentService.functions.deleteBet.mockResolvedValue(undefined);

      const result = await service.matchDeleted(matchId);
      expect(result).toBeUndefined();
      expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
      expect(mockBetDocumentService.functions.deleteBet).toHaveBeenCalledWith(bet.id);
      expect.assertions(3);
    });

    it('should throw error if unable to query bets by match Id', async () => {
      const matchId = 'matchId';

      const message = 'this is a dynamo error';
      mockBetDocumentService.functions.queryBetsByMatchId.mockRejectedValue({ message });

      await service.matchDeleted(matchId).catch(validateError(message));
      expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
      expect(mockBetDocumentService.functions.deleteBet).not.toHaveBeenCalled();
      expect.assertions(3);
    });

    it('should throw error if unable to delete bet', async () => {
      const matchId = 'matchId';
      const bet = {
        id: 'betId'
      } as BetDocument;
      mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const message = 'this is a dynamo error';
      mockBetDocumentService.functions.deleteBet.mockRejectedValue({ message });

      await service.matchDeleted(matchId).catch(validateError(message));
      expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(matchId);
      expect(mockBetDocumentService.functions.deleteBet).toHaveBeenCalledWith(bet.id);
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
      mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const converted = {
        id: bet.id
      } as BetDocument;
      mockBetDocumentConverter.functions.calculateResult.mockReturnValue(converted);

      mockBetDocumentService.functions.updateBet.mockResolvedValue(undefined);

      await service.matchFinalScoreUpdated(match);
      expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(match.id);
      expect(mockBetDocumentConverter.functions.calculateResult).toHaveBeenCalledWith(bet, match.finalScore);
      expect(mockBetDocumentService.functions.updateBet).toHaveBeenCalledWith(converted);
    });

    it('should throw error if unable to query bets by match id', async () => {
      const match = {
        id: 'matchId',
      } as MatchDocument;

      const message = 'This is a dynamo error';
      mockBetDocumentService.functions.queryBetsByMatchId.mockRejectedValue({ message });

      await service.matchFinalScoreUpdated(match).catch((validateError(message)));
      expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(match.id);
      expect(mockBetDocumentConverter.functions.calculateResult).not.toHaveBeenCalled();
      expect(mockBetDocumentService.functions.updateBet).not.toHaveBeenCalled();
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
      mockBetDocumentService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const converted = {
        id: bet.id
      } as BetDocument;
      mockBetDocumentConverter.functions.calculateResult.mockReturnValue(converted);

      const message = 'This is a dynamo error';
      mockBetDocumentService.functions.updateBet.mockRejectedValue({ message });

      await service.matchFinalScoreUpdated(match).catch((validateError(message)));
      expect(mockBetDocumentService.functions.queryBetsByMatchId).toHaveBeenCalledWith(match.id);
      expect(mockBetDocumentConverter.functions.calculateResult).toHaveBeenCalledWith(bet, match.finalScore);
      expect(mockBetDocumentService.functions.updateBet).toHaveBeenCalledWith(converted);
    });
  });

  describe('betResultCalculated', () => {
    const tournamentId = 'tournamentId';
    const userId = 'userId';
    it('should return undefined if standing document is saved successfully', async () => {

      const bets = [{
        id: 'betId'
      }] as BetDocument[];
      mockBetDocumentService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(bets);

      const converted = {
        id: 'standingId'
      } as StandingDocument;
      mockStandingDocumentConverter.functions.create.mockReturnValue(converted);

      mockStandingDocumentService.functions.saveStanding.mockResolvedValue(undefined);

      await service.betResultCalculated(tournamentId, userId);
      expect(mockBetDocumentService.functions.queryBetsByTournamentIdUserId).toHaveBeenCalledWith(tournamentId, userId);
      expect(mockStandingDocumentConverter.functions.create).toHaveBeenCalledWith(bets);
      expect(mockStandingDocumentService.functions.saveStanding).toHaveBeenCalledWith(converted);
    });

    it('should throw error if unable to query bets by tournament and user id', async () => {
      const message = 'This is a dynamo error';
      mockBetDocumentService.functions.queryBetsByTournamentIdUserId.mockRejectedValue({ message });

      await service.betResultCalculated(tournamentId, userId).catch((validateError(message)));
      expect(mockBetDocumentService.functions.queryBetsByTournamentIdUserId).toHaveBeenCalledWith(tournamentId, userId);
      expect(mockStandingDocumentConverter.functions.create).not.toHaveBeenCalled();
      expect(mockStandingDocumentService.functions.saveStanding).not.toHaveBeenCalled();
    });

    it('should throw error if unable to save standing document', async () => {
      const bets = [{
        id: 'betId'
      }] as BetDocument[];
      mockBetDocumentService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(bets);

      const converted = {
        id: 'standingId'
      } as StandingDocument;
      mockStandingDocumentConverter.functions.create.mockReturnValue(converted);

      const message = 'This is a dynamo error';
      mockStandingDocumentService.functions.saveStanding.mockRejectedValue({ message });

      await service.betResultCalculated(tournamentId, userId).catch((validateError(message)));
      expect(mockBetDocumentService.functions.queryBetsByTournamentIdUserId).toHaveBeenCalledWith(tournamentId, userId);
      expect(mockStandingDocumentConverter.functions.create).toHaveBeenCalledWith(bets);
      expect(mockStandingDocumentService.functions.saveStanding).toHaveBeenCalledWith(converted);
    });
  });
});
