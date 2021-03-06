import { TournamentRequest } from '@foci2020/shared/types/requests';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { TournamentDocument } from '@foci2020/shared/types/documents';
import { default as schema } from '@foci2020/test/api/schemas/tournament-response-list';

describe('GET /tournament/v1/tournaments', () => {
  const tournament1: TournamentRequest = {
    tournamentName: 'EB 2020', 
  };

  const tournament2: TournamentRequest = {
    tournamentName: 'VB 2020', 
  };

  let tournamentDocument1: TournamentDocument;
  let tournamentDocument2: TournamentDocument;

  beforeEach(() => {
    tournamentDocument1 = tournamentDocumentConverter.create(tournament1, Cypress.env('EXPIRES_IN'));
    tournamentDocument2 = tournamentDocumentConverter.create(tournament2, Cypress.env('EXPIRES_IN'));
  });

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
      cy.saveTournamentDocument(tournamentDocument1)
        .saveTournamentDocument(tournamentDocument2)
        .authenticate('admin1')
        .requestGetTournamentList()
        .expectOkResponse()
        .expectValidResponseSchema(schema);
    });
  });
});
