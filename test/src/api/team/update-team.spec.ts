import { TeamRequest } from '@foci2020/shared/types/requests';
import { v4 as uuid } from 'uuid';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';

describe('PUT /team/v1/teams/{teamId}', () => {
  let converter: ITeamDocumentConverter;
  before(() => {
    converter = teamDocumentConverterFactory(uuid);
  });
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  const teamToUpdate: TeamRequest = {
    teamName: 'to update',
    image: 'http://toupdate.com',
    shortName: 'TUP'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestUpdateTeam(uuid(), teamToUpdate)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestUpdateTeam(uuid(), teamToUpdate)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should update a team', () => {
      const document = converter.create(team);
      cy.saveTeamDocument(document)
        .authenticate('admin1')
        .requestUpdateTeam(document.id, teamToUpdate)
        .expectOkResponse()
        .validateTeamDocument(teamToUpdate, document.id);
    });

    it('should update a team without image', () => {
      const request: TeamRequest = {
        ...team,
        image: undefined
      };

      const document = converter.create(team);
      cy.saveTeamDocument(document)
        .authenticate('admin1')
        .requestUpdateTeam(document.id, request)
        .expectOkResponse()
        .validateTeamDocument(request, document.id);
    });

    describe('related matches', () => {
      it.skip('should be updated if home team is updated', () => {

      });

      it.skip('should be updated if away team is updated', () => {

      });
    });

    describe('should return error', () => {
      describe('if teamName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              teamName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('teamName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              teamName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('teamName', 'string', 'body');
        });
      });

      describe('if image', () => {
        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              image: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('image', 'string', 'body');
        });

        it('is not an URI', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              image: 'not.an.uri'
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('image', 'uri', 'body');
        });
      });

      describe('if shortName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              shortName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('shortName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              shortName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('shortName', 'string', 'body');
        });

        it('is shorter than 3 characters', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              shortName: 'AB'
            })
            .expectBadRequestResponse()
            .expectTooShortProperty('shortName', 3, 'body');
        });

        it('is longer than 3 characters', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), {
              ...team,
              shortName: 'ABCD'
            })
            .expectBadRequestResponse()
            .expectTooLongProperty('shortName', 3, 'body');
        });
      });

      describe('if teamId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(`${uuid()}-not-valid`, teamToUpdate)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
        });

        it('does not belong to any team', () => {
          cy.authenticate('admin1')
            .requestUpdateTeam(uuid(), teamToUpdate)
            .expectNotFoundResponse();
        });
      });
    });
  });
});
