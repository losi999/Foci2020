import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';

describe('GET /tournament/v1/tournaments/{tournamentId}', () => {
  let converter: ITournamentDocumentConverter;
  before(() => {
    converter = tournamentDocumentConverterFactory(uuid);
  });

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
      const document = converter.create(tournament);
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
