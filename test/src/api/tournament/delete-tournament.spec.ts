import { v4 as uuid } from 'uuid';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { TournamentRequest } from '@foci2020/shared/types/requests';

describe('DELETE /tournament/v1/tournaments/{tournamentId}', () => {
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
        .requestDeleteTournament(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteTournament(uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete tournament', () => {
      const document = converter.create(tournament);
      cy.saveTournamentDocument(document)
        .authenticate('admin1')
        .requestDeleteTournament(document.id)
        .expectOkResponse()
        .validateTournamentDeleted(document.id);
    });

    describe('related matches', () => {
      it.skip('should be deleted if tournament is deleted', () => {

      });
    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteTournament(`${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
