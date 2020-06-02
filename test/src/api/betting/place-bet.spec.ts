import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { teamConverter, tournamentConverter, matchConverter, betConverter } from '@foci2020/test/api/dependencies';
import { addMinutes } from '@foci2020/shared/common/utils';
import { BetRequest } from '@foci2020/shared/types/requests';
import { v4 as uuid } from 'uuid';

describe('POST /betting/v1/matches/{matchId}/bets', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let pendingMatchDocument: MatchDocument;
  let startedMatchDocument: MatchDocument;

  before(() => {
    homeTeamDocument = teamConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    });
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    });
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });
    pendingMatchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(15).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);

    startedMatchDocument = matchConverter.create({
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'B csoport',
      startTime: addMinutes(-10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);

    cy.saveMatchDocument(startedMatchDocument)
      .saveMatchDocument(pendingMatchDocument);
  });

  const bet: BetRequest = {
    homeScore: 1,
    awayScore: 2
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestPlaceBet(uuid(), bet)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
        .requestPlaceBet(uuid(), bet)
        .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    it('should place bet', () => {
      cy.authenticate('player1')
        .requestPlaceBet(pendingMatchDocument.id, bet)
        .expectOkResponse()
        .validateBetDocument('player1', pendingMatchDocument.id, bet);
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
            .requestPlaceBet(`${uuid()}-not-valid`, bet)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });

        it('does not belong to any match', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), bet)
            .expectNotFoundResponse();
        });
      });

      describe('if homeScore', () => {
        it('is missing from body', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), {
              ...bet,
              homeScore: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('homeScore', 'body');
        });

        it('is not integer', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), {
              ...bet,
              homeScore: 'asd' as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('homeScore', 'integer', 'body');
        });

        it('is less than 0', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), {
              ...bet,
              homeScore: -1
            })
            .expectBadRequestResponse()
            .expectTooSmallNumberProperty('homeScore', 0, 'body');
        });
      });

      describe('if awayScore', () => {
        it('is missing from body', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), {
              ...bet,
              awayScore: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('awayScore', 'body');
        });

        it('is not integer', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), {
              ...bet,
              awayScore: 'asd' as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('awayScore', 'integer', 'body');
        });

        it('is less than 0', () => {
          cy.authenticate('player1')
            .requestPlaceBet(uuid(), {
              ...bet,
              awayScore: -1
            })
            .expectBadRequestResponse()
            .expectTooSmallNumberProperty('awayScore', 0, 'body');
        });
      });

      it('if player already placed a bet', () => {
        cy.saveBetForUser('player2', bet, pendingMatchDocument.id, pendingMatchDocument.tournamentId)
          .authenticate('player2')
          .requestPlaceBet(pendingMatchDocument.id, bet)
          .expectBadRequestResponse()
          .expectMessage('You already placed a bet on this match');
      });

      it('if betting time has expired', () => {
        cy.authenticate('player1')
          .requestPlaceBet(startedMatchDocument.id, bet)
          .expectBadRequestResponse()
          .expectMessage('Betting time expired');
      });
    });
  });
});
