import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { TournamentDocument } from '@foci2020/shared/types/documents';
import { default as schema } from '@foci2020/test/api/schemas/tournament-response';
import { TournamentIdType } from '@foci2020/shared/types/common';

describe('GET /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020', 
  };

  let tournamentDocument: TournamentDocument;

  beforeEach(() => {
    tournamentDocument = tournamentDocumentConverter.create(tournament, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTournament(uuid() as TournamentIdType)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTournament(uuid() as TournamentIdType)
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
          .requestGetTournament(`${uuid()}-not-valid` as TournamentIdType)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
      });

      it('does not belong to any tournament', () => {
        cy.authenticate('admin1')
          .requestGetTournament(uuid() as TournamentIdType)
          .expectNotFoundResponse();
      });
    });
  });
});
