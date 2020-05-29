import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { teamConverter } from '@foci2020/test/api/dependencies';

describe('GET /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

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
      const document = teamConverter.create(team);
      cy.saveTeamDocument(document)
        .authenticate('admin1')
        .requestGetTeam(document.id)
        .expectOkResponse()
        .expectTeamResponse()
        .validateTeamResponse(document);
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
