import { IRelatedDocumentService, relatedDocumentServiceFactory } from '@foci2020/api/functions/related-document/related-document-service';
import { Mock, createMockService, validateError, validateFunctionCall } from '@foci2020/shared/common/unit-testing';
import { IBetDocumentConverter } from '@foci2020/shared/converters/bet-document-converter';
import { IStandingDocumentConverter } from '@foci2020/shared/converters/standing-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { matchDocument, teamDocument, tournamentDocument, betDocument, standingDocument } from '@foci2020/shared/common/test-data-factory';
import { IndexByHomeTeamIdDocument, IndexByAwayTeamIdDocument } from '@foci2020/shared/types/documents';

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
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
      expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
      expect.assertions(5);
    });

    describe('should throw error', () => {
      it('if unable to query matches by homeTeam Id', async () => {
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
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
        validateFunctionCall(mockDatabaseService.functions.deleteMatch);
        expect.assertions(4);
      });

      it('if unable to query matches by awayTeam Id', async () => {
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
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
        validateFunctionCall(mockDatabaseService.functions.deleteMatch);
        expect.assertions(4);
      });

      it('if unable to delete matches', async () => {
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
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, teamId);
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, teamId);
        expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(1, matchId1);
        expect(mockDatabaseService.functions.deleteMatch).toHaveBeenNthCalledWith(2, matchId2);
        expect.assertions(5);
      });
    });
  });

  describe('tournamentDeleted', () => {
    it('should return undefined if matches are deleted sucessfully', async () => {
      const tournamentId = 'tournamentId';

      const queriedMatch = matchDocument();

      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);
      mockDatabaseService.functions.deleteMatch.mockResolvedValue(undefined);

      const result = await service.tournamentDeleted(tournamentId);

      expect(result).toBeUndefined();
      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.deleteMatch, queriedMatch.id);
      expect.assertions(3);
    });

    describe('should throw error', () => {
      it('if unable to query matches by tournament Id', async () => {
        const tournamentId = 'tournamentId';

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue({ message });

        await service.tournamentDeleted(tournamentId).catch(validateError(message));
        validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
        validateFunctionCall(mockDatabaseService.functions.deleteMatch);
        expect.assertions(3);
      });

      it('if unable to delete matches', async () => {
        const tournamentId = 'tournamentId';

        const queriedMatch = matchDocument();

        mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.deleteMatch.mockRejectedValue({ message });

        await service.tournamentDeleted(tournamentId).catch(validateError(message));
        validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
        validateFunctionCall(mockDatabaseService.functions.deleteMatch, queriedMatch.id);
        expect.assertions(3);
      });
    });
  });

  describe('teamUpdated', () => {
    it('should return undefined if matches are updated successfully', async () => {
      const team = teamDocument();
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
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
      validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
      expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
      expect.assertions(5);
    });

    describe('should throw error', () => {
      it('if unable to query matches by homeTeam Id', async () => {
        const team = teamDocument();
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
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
        validateFunctionCall(mockDatabaseService.functions.updateTeamOfMatch);
        expect.assertions(4);
      });

      it('if unable to query matches by awayTeam Id', async () => {
        const team = teamDocument();
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
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
        validateFunctionCall(mockDatabaseService.functions.deleteMatch);
        expect.assertions(4);
      });

      it('if unable to update matches', async () => {
        const team = teamDocument();
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
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByHomeTeamId, team.id);
        validateFunctionCall(mockDatabaseService.functions.queryMatchKeysByAwayTeamId, team.id);
        expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(1, matchId1, team, 'home');
        expect(mockDatabaseService.functions.updateTeamOfMatch).toHaveBeenNthCalledWith(2, matchId2, team, 'away');
        expect.assertions(5);
      });
    });
  });

  describe('tournamentUpdated', () => {
    it('should return undefined if matches are updated sucessfully', async () => {
      const tournamentId = 'tournamentId';
      const tournament = tournamentDocument();

      const queriedMatch = matchDocument();

      mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);
      mockDatabaseService.functions.updateTournamentOfMatch.mockResolvedValue(undefined);

      const result = await service.tournamentUpdated(tournament);

      expect(result).toBeUndefined();
      validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
      validateFunctionCall(mockDatabaseService.functions.updateTournamentOfMatch, queriedMatch.id, tournament);
      expect.assertions(3);
    });

    describe('should throw error', () => {
      it('if unable to query matches by tournament Id', async () => {
        const tournamentId = 'tournamentId';
        const tournament = tournamentDocument();

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.queryMatchesByTournamentId.mockRejectedValue({ message });

        await service.tournamentUpdated(tournament).catch(validateError(message));
        validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
        validateFunctionCall(mockDatabaseService.functions.updateTournamentOfMatch);
        expect.assertions(3);
      });

      it('if unable to update matches', async () => {
        const tournamentId = 'tournamentId';
        const tournament = tournamentDocument();

        const queriedMatch = matchDocument();
        mockDatabaseService.functions.queryMatchesByTournamentId.mockResolvedValue([queriedMatch]);

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.updateTournamentOfMatch.mockRejectedValue({ message });

        await service.tournamentUpdated(tournament).catch(validateError(message));
        validateFunctionCall(mockDatabaseService.functions.queryMatchesByTournamentId, tournamentId);
        validateFunctionCall(mockDatabaseService.functions.updateTournamentOfMatch, queriedMatch.id, tournament);
        expect.assertions(3);
      });
    });
  });

  describe('matchDeleted', () => {
    it('should return undefined if bets are deleted', async () => {
      const matchId = 'matchId';

      const bet = betDocument();
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      mockDatabaseService.functions.deleteBet.mockResolvedValue(undefined);

      const result = await service.matchDeleted(matchId);
      expect(result).toBeUndefined();
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
      validateFunctionCall(mockDatabaseService.functions.deleteBet, bet.userId, bet.matchId);
      expect.assertions(3);
    });

    describe('should throw error', () => {
      it('if unable to query bets by match Id', async () => {
        const matchId = 'matchId';

        const message = 'this is a dynamo error';
        mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue({ message });

        await service.matchDeleted(matchId).catch(validateError(message));
        validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
        validateFunctionCall(mockDatabaseService.functions.deleteBet);
        expect.assertions(3);
      });

      it('if unable to delete bet', async () => {
        const matchId = 'matchId';

        const bet = betDocument();
        mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

        const message = 'this is a dynamo error';
        mockDatabaseService.functions.deleteBet.mockRejectedValue({ message });

        await service.matchDeleted(matchId).catch(validateError(message));
        validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, matchId);
        validateFunctionCall(mockDatabaseService.functions.deleteBet, bet.userId, bet.matchId);
        expect.assertions(3);
      });
    });
  });

  describe('matchFinalScoreUpdated', () => {
    it('should return undefined if bets are updated', async () => {
      const match = matchDocument({
        finalScore: {
          homeScore: 1,
          awayScore: 0
        }
      });

      const bet = betDocument();
      mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

      const converted = betDocument();
      mockBetDocumentConverter.functions.calculateResult.mockReturnValue(converted);

      mockDatabaseService.functions.updateBet.mockResolvedValue(undefined);

      await service.matchFinalScoreUpdated(match);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, match.id);
      validateFunctionCall(mockBetDocumentConverter.functions.calculateResult, bet, match.finalScore);
      validateFunctionCall(mockDatabaseService.functions.updateBet, converted);
    });

    describe('should throw error', () => {
      it('if unable to query bets by match id', async () => {
        const match = matchDocument();

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.queryBetsByMatchId.mockRejectedValue({ message });

        await service.matchFinalScoreUpdated(match).catch((validateError(message)));
        validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, match.id);
        validateFunctionCall(mockBetDocumentConverter.functions.calculateResult);
        validateFunctionCall(mockDatabaseService.functions.updateBet);
      });

      it('if unable to update bet', async () => {
        const match = matchDocument({
          finalScore: {
            homeScore: 1,
            awayScore: 0
          }
        });

        const bet = betDocument();
        mockDatabaseService.functions.queryBetsByMatchId.mockResolvedValue([bet]);

        const converted = betDocument();
        mockBetDocumentConverter.functions.calculateResult.mockReturnValue(converted);

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.updateBet.mockRejectedValue({ message });

        await service.matchFinalScoreUpdated(match).catch((validateError(message)));
        validateFunctionCall(mockDatabaseService.functions.queryBetsByMatchId, match.id);
        validateFunctionCall(mockBetDocumentConverter.functions.calculateResult, bet, match.finalScore);
        validateFunctionCall(mockDatabaseService.functions.updateBet, converted);
      });
    });
  });

  describe('betResultCalculated', () => {
    const tournamentId = 'tournamentId';
    const userId = 'userId';
    it('should return undefined if standing document is saved successfully', async () => {

      const bets = [betDocument()];
      mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(bets);

      const converted = standingDocument();
      mockStandingDocumentConverter.functions.create.mockReturnValue(converted);

      mockDatabaseService.functions.saveStanding.mockResolvedValue(undefined);

      await service.betResultCalculated(tournamentId, userId);
      validateFunctionCall(mockDatabaseService.functions.queryBetsByTournamentIdUserId, tournamentId, userId);
      validateFunctionCall(mockStandingDocumentConverter.functions.create, bets);
      validateFunctionCall(mockDatabaseService.functions.saveStanding, converted);
    });

    describe('should throw error', () => {
      it('if unable to query bets by tournament and user id', async () => {
        const message = 'This is a dynamo error';
        mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockRejectedValue({ message });

        await service.betResultCalculated(tournamentId, userId).catch((validateError(message)));
        validateFunctionCall(mockDatabaseService.functions.queryBetsByTournamentIdUserId, tournamentId, userId);
        validateFunctionCall(mockStandingDocumentConverter.functions.create);
        validateFunctionCall(mockDatabaseService.functions.saveStanding);
      });

      it('if unable to save standing document', async () => {
        const bets = [betDocument()];
        mockDatabaseService.functions.queryBetsByTournamentIdUserId.mockResolvedValue(bets);

        const converted = standingDocument();
        mockStandingDocumentConverter.functions.create.mockReturnValue(converted);

        const message = 'This is a dynamo error';
        mockDatabaseService.functions.saveStanding.mockRejectedValue({ message });

        await service.betResultCalculated(tournamentId, userId).catch((validateError(message)));
        validateFunctionCall(mockDatabaseService.functions.queryBetsByTournamentIdUserId, tournamentId, userId);
        validateFunctionCall(mockStandingDocumentConverter.functions.create, bets);
        validateFunctionCall(mockDatabaseService.functions.saveStanding, converted);
      });
    });
  });
});
