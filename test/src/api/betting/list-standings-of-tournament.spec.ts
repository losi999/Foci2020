import { TournamentDocument } from '@foci2020/shared/types/documents';
import { tournamentConverter } from '@foci2020/test/api/dependencies';
import { v4 as uuid } from 'uuid';

describe('GET /betting/v1/tournaments/{tournamentId}/standings', () => {
  let tournamentDocument: TournamentDocument;

  beforeEach(() => {
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetStandingListOfTournament(tournamentDocument.id)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
        .requestGetStandingListOfTournament(tournamentDocument.id)
        .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    it.skip('should get the standings', () => {

    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
          .requestGetStandingListOfTournament(`${uuid()}-not-valid`)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
