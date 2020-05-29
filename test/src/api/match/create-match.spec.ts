import { MatchRequest } from '@foci2020/shared/types/requests';
import { v4 as uuid } from 'uuid';
import { addMinutes } from '@foci2020/shared/common/utils';
import { TeamDocument, TournamentDocument } from '@foci2020/shared/types/documents';
import { teamConverter, tournamentConverter } from '@foci2020/test/api/dependencies';

describe('POST /match/v1/matches', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let match: MatchRequest;
  before(() => {
    homeTeamDocument = teamConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    });
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    });
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });
    match = {
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    };
    cy.saveTeamDocument(homeTeamDocument)
      .saveTeamDocument(awayTeamDocument)
      .saveTournamentDocument(tournamentDocument);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestCreateMatch(match)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestCreateMatch(match)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should create a match', () => {
      cy.authenticate('admin1')
        .requestCreateMatch(match)
        .expectOkResponse()
        .expectMatchResponse()
        .validateMatchDocument(match, homeTeamDocument, awayTeamDocument, tournamentDocument);
    });

    describe('should return error', () => {
      describe('if homeTeamId', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              homeTeamId: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('homeTeamId', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              homeTeamId: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('homeTeamId', 'string', 'body');
        });

        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              homeTeamId: `${uuid()}-not-valid`
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('homeTeamId', 'uuid', 'body');
        });

        it('does not belong to any team', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              homeTeamId: uuid()
            })
            .expectBadRequestResponse()
            .expectMessage('Home team not found');
        });
      });

      describe('if awayTeamId', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              awayTeamId: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('awayTeamId', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              awayTeamId: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('awayTeamId', 'string', 'body');
        });

        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              awayTeamId: `${uuid()}-not-valid`
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('awayTeamId', 'uuid', 'body');
        });

        it('does not belong to any team', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              awayTeamId: uuid()
            })
            .expectBadRequestResponse()
            .expectMessage('Away team not found');
        });

        it('is the same as homeTeamId', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              awayTeamId: homeTeamDocument.id
            })
            .expectBadRequestResponse()
            .expectMessage('Home and away teams cannot be the same');
        });
      });

      describe('if tournamentId', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              tournamentId: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('tournamentId', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              tournamentId: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('tournamentId', 'string', 'body');
        });

        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              tournamentId: `${uuid()}-not-valid`
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'body');
        });

        it('does not belong to any tournament', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              tournamentId: uuid()
            })
            .expectBadRequestResponse()
            .expectMessage('Tournament not found');
        });
      });

      describe('if group', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              group: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('group', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              group: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('group', 'string', 'body');
        });
      });

      describe('if startTime', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              startTime: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('startTime', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              startTime: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('startTime', 'string', 'body');
        });

        it('is not date-time', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              startTime: 'not-a-date'
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('startTime', 'date-time', 'body');
        });

        it('is less than 5 minutes from now', () => {
          cy.authenticate('admin1')
            .requestCreateMatch({
              ...match,
              startTime: addMinutes(4.9).toISOString()
            })
            .expectBadRequestResponse()
            .expectMessage('Start time has to be at least 5 minutes from now');
        });
      });
    });
  });
});
