import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { default as schema } from '@foci2020/test/api/schemas/team-response';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('GET /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN',
  };

  let teamDocument: TeamDocument;

  beforeEach(() => {
    teamDocument = teamDocumentConverter.create(team, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTeam(uuid() as TeamIdType)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTeam(uuid() as TeamIdType)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get team by id', () => {
      cy.saveTeamDocument(teamDocument)
        .authenticate('admin1')
        .requestGetTeam(teamDocument.id)
        .expectOkResponse()
        .expectValidResponseSchema(schema)
        .validateTeamResponse(teamDocument);
    });

    describe('should return error if teamId', () => {
      it('is not uuid', () => {
        cy.authenticate('admin1')
          .requestGetTeam(`${uuid()}-not-valid` as TeamIdType)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
      });

      it('does not belong to any team', () => {
        cy.authenticate('admin1')
          .requestGetTeam(uuid() as TeamIdType)
          .expectNotFoundResponse();
      });
    });
  });
});
