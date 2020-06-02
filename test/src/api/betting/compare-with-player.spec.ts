import { v4 as uuid } from 'uuid';

describe('GET /betting/v1/tournaments/{tournamentId}/compare/{userId}', () => {
  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestCompareWithPlayer(uuid(), uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
        .requestCompareWithPlayer(uuid(), uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    describe('should get the comparison', () => {
      describe('showing other player\'s bets if', () => {
        it.skip('betting time has expired', () => {

        });

        it.skip('player already placed a bet', () => {

        });
      });

      describe('NOT showing other player\'s bets if', () => {
        it.skip('player can still place a bet', () => {

        });
      });
    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
            .requestCompareWithPlayer(`${uuid()}-not-valid`, uuid())
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });

      describe('if userId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
            .requestCompareWithPlayer(uuid(), `${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('userId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
