import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { teamConverter } from '@foci2020/test/api/dependencies';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { default as schema } from '@foci2020/test/api/schemas/team-response';

describe('GET /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  let teamDocument: TeamDocument;

  beforeEach(() => {
    teamDocument = teamConverter.create(team);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTeam(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTeam(uuid())
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
          .requestGetTeam(`${uuid()}-not-valid`)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
      });

      it('does not belong to any team', () => {
        cy.authenticate('admin1')
          .requestGetTeam(uuid())
          .expectNotFoundResponse();
      });
    });
  });
});
