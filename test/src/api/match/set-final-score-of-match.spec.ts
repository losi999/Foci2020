import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument, BetDocument, StandingDocument } from '@foci2020/shared/types/documents';
import { MatchFinalScoreRequest } from '@foci2020/shared/types/requests';
import { addMinutes } from '@foci2020/shared/common/utils';
import { teamConverter, tournamentConverter, matchConverter, betConverter } from '@foci2020/test/api/dependencies';

describe('PATCH /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;
  let ongoingMatch: MatchDocument;
  let exactMatchBet: BetDocument;
  let goalDifferenceBet: BetDocument;
  let outcomeBet: BetDocument;
  let nothingBet: BetDocument;
  const finalScore: MatchFinalScoreRequest = {
    homeScore: 1,
    awayScore: 2
  };
  beforeEach(() => {
    homeTeamDocument = teamConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    }, true);
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, true);
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    }, true);
    matchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(-110).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, true);

    ongoingMatch = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(-104).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, true);

    exactMatchBet = betConverter.create(finalScore, uuid(), 'user', matchDocument.id, matchDocument.tournamentId, true);

    goalDifferenceBet = betConverter.create({
      homeScore: finalScore.homeScore + 1,
      awayScore: finalScore.awayScore + 1
    }, uuid(), 'user', matchDocument.id, matchDocument.tournamentId, true);

    outcomeBet = betConverter.create({
      homeScore: finalScore.homeScore * 2,
      awayScore: finalScore.awayScore * 2
    }, uuid(), 'user', matchDocument.id, matchDocument.tournamentId, true);

    nothingBet = betConverter.create({
      homeScore: finalScore.awayScore,
      awayScore: finalScore.homeScore
    }, uuid(), 'user', matchDocument.id, matchDocument.tournamentId, true);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should set final score of match', () => {
      cy.saveMatchDocument(matchDocument)
        .authenticate('admin1')
        .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
        .expectOkResponse()
        .validateMatchFinalScore(finalScore, matchDocument, homeTeamDocument, awayTeamDocument, tournamentDocument, matchDocument.id);
    });

    describe('bets', () => {
      it('should have their results calculated', () => {
        cy.saveMatchDocument(matchDocument)
          .saveBetDocument(exactMatchBet)
          .saveBetDocument(goalDifferenceBet)
          .saveBetDocument(outcomeBet)
          .saveBetDocument(nothingBet)
          .authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
          .expectOkResponse()
          .wait(2000)
          .validateBetResult(exactMatchBet.userId, matchDocument.id, 'exactMatch')
          .validateBetResult(goalDifferenceBet.userId, matchDocument.id, 'goalDifference')
          .validateBetResult(outcomeBet.userId, matchDocument.id, 'outcome')
          .validateBetResult(nothingBet.userId, matchDocument.id, 'nothing');
      });
    });

    describe('tournament standings', () => {
      const emptyResults: StandingDocument['results'] = {
        exactMatch: 0,
        goalDifference: 0,
        outcome: 0,
        nothing: 0,
      };

      it('should be updated', () => {
        cy.saveMatchDocument(matchDocument)
          .saveBetDocument(exactMatchBet)
          .saveBetDocument(goalDifferenceBet)
          .saveBetDocument(outcomeBet)
          .saveBetDocument(nothingBet)
          .authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
          .expectOkResponse()
          .wait(2000)
          .validateStandingDocument(matchDocument.tournamentId, exactMatchBet.userId, {
            ...emptyResults,
            exactMatch: 1
          })
          .validateStandingDocument(matchDocument.tournamentId, goalDifferenceBet.userId, {
            ...emptyResults,
            goalDifference: 1
          })
          .validateStandingDocument(matchDocument.tournamentId, outcomeBet.userId, {
            ...emptyResults,
            outcome: 1
          })
          .validateStandingDocument(matchDocument.tournamentId, nothingBet.userId, {
            ...emptyResults,
            nothing: 1
          });
      });
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(`${uuid()}-not-valid`, finalScore)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });

        it('does not belong to any match', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(uuid(), finalScore)
            .expectNotFoundResponse();
        });
      });

      describe('if homeScore', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(matchDocument.id, {
              ...finalScore,
              homeScore: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('homeScore', 'body');
        });

        it('is not integer', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(matchDocument.id, {
              ...finalScore,
              homeScore: 'a' as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('homeScore', 'integer', 'body');
        });

        it('is less than 0', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(matchDocument.id, {
              ...finalScore,
              homeScore: -1
            })
            .expectBadRequestResponse()
            .expectTooSmallNumberProperty('homeScore', 0, 'body');
        });
      });

      describe('if awayScore', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(matchDocument.id, {
              ...finalScore,
              awayScore: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('awayScore', 'body');
        });

        it('is not integer', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(matchDocument.id, {
              ...finalScore,
              awayScore: 'a' as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('awayScore', 'integer', 'body');
        });

        it('is less than 0', () => {
          cy.authenticate('admin1')
            .requestSetFinalScoreOfMatch(matchDocument.id, {
              ...finalScore,
              awayScore: -1
            })
            .expectBadRequestResponse()
            .expectTooSmallNumberProperty('awayScore', 0, 'body');
        });
      });

      describe('if current time', () => {
        it('is less than 105 minutes from startTime', () => {
          cy.saveMatchDocument(ongoingMatch)
            .authenticate('admin1')
            .requestSetFinalScoreOfMatch(ongoingMatch.id, finalScore)
            .expectBadRequestResponse()
            .expectMessage('Final score cannot be set during the game');
        });
      });
    });

  });
});
