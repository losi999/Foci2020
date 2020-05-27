import { TournamentRequest } from '@foci2020/shared/types/requests';

describe('POST /tournament/v1/tournaments', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020',
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestCreateTournament(tournament)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestCreateTournament(tournament)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should create a tournament', () => {
      cy.authenticate('admin1')
        .requestCreateTournament(tournament)
        .expectOkResponse()
        .expectTournamentResponse()
        .validateTournamentDocument(tournament);
    });

    describe('should return error', () => {
      describe('if tournamentName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateTournament({
              ...tournament,
              tournamentName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('tournamentName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateTournament({
              ...tournament,
              tournamentName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('tournamentName', 'string', 'body');
        });
      });
    });
  });
});
