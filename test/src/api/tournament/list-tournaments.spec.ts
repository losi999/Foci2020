import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';

describe('GET /tournament/v1/tournaments', () => {
  let converter: ITournamentDocumentConverter;
  before(() => {
    converter = tournamentDocumentConverterFactory(uuid);
  });

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
      const document1 = converter.create(tournament1);
      const document2 = converter.create(tournament2);

      cy.saveTournamentDocument(document1)
        .saveTournamentDocument(document2)
        .authenticate('admin1')
        .requestGetTournamentList()
        .expectOkResponse()
        .expectTournamentResponse();
    });
  });
});
