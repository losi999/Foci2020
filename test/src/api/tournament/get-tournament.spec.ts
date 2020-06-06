import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { tournamentConverter } from '@foci2020/test/api/dependencies';
import { TournamentDocument } from '@foci2020/shared/types/documents';
import { default as schema } from '@foci2020/test/api/schemas/tournament-response';

describe('GET /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  let tournamentDocument: TournamentDocument;

  beforeEach(() => {
    tournamentDocument = tournamentConverter.create(tournament, true);
  });

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
      cy.saveTournamentDocument(tournamentDocument)
        .authenticate('admin1')
        .requestGetTournament(tournamentDocument.id)
        .expectOkResponse()
        .expectValidResponseSchema(schema)
        .validateTournamentResponse(tournamentDocument);
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
