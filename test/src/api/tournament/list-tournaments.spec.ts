import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { tournamentConverter } from '@foci2020/test/api/dependencies';

describe('GET /tournament/v1/tournaments', () => {
  const tournament1: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  const tournament2: TournamentRequest = {
    tournamentName: 'VB 2020'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTournamentList()
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTournamentList()
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get a list of tournaments', () => {
      const document1 = tournamentConverter.create(tournament1);
      const document2 = tournamentConverter.create(tournament2);

      cy.saveTournamentDocument(document1)
        .saveTournamentDocument(document2)
        .authenticate('admin1')
        .requestGetTournamentList()
        .expectOkResponse()
        .expectTournamentResponse();
    });
  });
});
