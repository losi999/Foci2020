import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';

describe('PUT /tournament/v1/tournaments/{tournamentId}', () => {
  let converter: ITournamentDocumentConverter;
  before(() => {
    converter = tournamentDocumentConverterFactory(uuid);
  });

  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  const tournamentToUpdate: TournamentRequest = {
    tournamentName: 'VB 2022'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestUpdateTournament(uuid(), tournamentToUpdate)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestUpdateTournament(uuid(), tournamentToUpdate)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should update a tournament', () => {
      const document = converter.create(tournament);
      cy.saveTournamentDocument(document)
        .authenticate('admin1')
        .requestUpdateTournament(document.id, tournamentToUpdate)
        .expectOkResponse()
        .validateTournamentDocument(tournamentToUpdate, document.id);
    });

    describe('related matches', () => {
      it.skip('should be updated if tournament is updated', () => {

      });
    });

    describe('should return error', () => {
      describe('if tournamentName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid(), {
              ...tournament,
              tournamentName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('tournamentName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid(), {
              ...tournament,
              tournamentName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('tournamentName', 'string', 'body');
        });
      });

      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(`${uuid()}-not-valid`, tournamentToUpdate)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });

        it('does not belong to any tournament', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid(), tournamentToUpdate)
            .expectNotFoundResponse();
        });
      });
    });
  });
});
