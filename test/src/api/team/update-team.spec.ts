import { TeamRequest } from '@foci2020/shared/types/requests';
import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('PUT /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN',
  };

  const teamToUpdate: TeamRequest = {
    teamName: 'to update',
    image: 'http://toupdate.com',
    shortName: 'TUP',
  };

  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

  beforeEach(() => {
    homeTeamDocument = teamDocumentConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    }, Cypress.env('EXPIRES_IN'));
    awayTeamDocument = teamDocumentConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, Cypress.env('EXPIRES_IN'));
    tournamentDocument = tournamentDocumentConverter.create({
      tournamentName: 'EB 2020', 
    }, Cypress.env('EXPIRES_IN'));

    matchDocument = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString(),
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestUpdateTeam(uuid() as TeamIdType, teamToUpdate)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestUpdateTeam(uuid() as TeamIdType, teamToUpdate)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should update a team', () => {
      cy.saveTeamDocument(homeTeamDocument)
        .authenticate('admin1')
        .requestUpdateTeam(homeTeamDocument.id, teamToUpdate)
        .expectOkResponse()
        .validateTeamDocument(teamToUpdate, homeTeamDocument.id);
    });

    it('should update a team without image', () => {
      const request: TeamRequest = {
        ...team,
        image: undefined,
      };

      cy.saveTeamDocument(homeTeamDocument)
        .authenticate('admin1')
        .requestUpdateTeam(homeTeamDocument.id, request)
        .expectOkResponse()
        .validateTeamDocument(request, homeTeamDocument.id);
    });

    describe('related matches', () => {
      it('should be updated if home team is updated', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestUpdateTeam(homeTeamDocument.id, teamToUpdate)
          .expectOkResponse()
          .wait(2000)
          .validateUpdatedHomeTeam(teamToUpdate, matchDocument, homeTeamDocument, awayTeamDocument, tournamentDocument, matchDocument.id);
      });

      it('should be updated if away team is updated', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestUpdateTeam(awayTeamDocument.id, teamToUpdate)
          .expectOkResponse()
          .wait(2000)
          .validateUpdatedAwayTeam(teamToUpdate, matchDocument, homeTeamDocument, awayTeamDocument, tournamentDocument, matchDocument.id);
      });
    });

    describe('should return error', () => {
      describe('if teamName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              teamName: undefined,
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('teamName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              teamName: 1 as any,
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('teamName', 'string', 'body');
        });
      });

      describe('if image', () => {
        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              image: 1 as any,
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('image', 'string', 'body');
        });

        it('is not an URI', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              image: 'not.an.uri',
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('image', 'uri', 'body');
        });
      });

      describe('if shortName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              shortName: undefined,
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('shortName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              shortName: 1 as any,
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('shortName', 'string', 'body');
        });

        it('is shorter than 3 characters', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              shortName: 'AB',
            })
            .expectBadRequestResponse()
            .expectTooShortProperty('shortName', 3, 'body');
        });

        it('is longer than 3 characters', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, {
              ...team,
              shortName: 'ABCD',
            })
            .expectBadRequestResponse()
            .expectTooLongProperty('shortName', 3, 'body');
        });
      });

      describe('if teamId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(`${uuid()}-not-valid` as TeamIdType, teamToUpdate)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
        });

        it('does not belong to any team', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid() as TeamIdType, teamToUpdate)
            .expectNotFoundResponse();
        });
      });
    });
  });
});
