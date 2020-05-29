import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { tournamentConverter } from '@foci2020/test/api/dependencies';

describe('GET /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTournament(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTournament(uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get tournament by id', () => {
      const document = tournamentConverter.create(tournament);
      cy.saveTournamentDocument(document)
        .authenticate('admin1')
        .requestGetTournament(document.id)
        .expectOkResponse()
        .expectTournamentResponse()
        .validateTournamentResponse(document);
    });

    describe('should return error if tournamentId', () => {
      it('is not uuid', () => {
        cy.authenticate('admin1')
          .requestGetTournament(`${uuid()}-not-valid`)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
      });

      it('does not belong to any tournament', () => {
        cy.authenticate('admin1')
          .requestGetTournament(uuid())
          .expectNotFoundResponse();
      });
    });
  });
});
