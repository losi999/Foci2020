import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { teamConverter } from '@foci2020/test/api/dependencies';

describe('GET /team/v1/teams', () => {
  const team1: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  const team2: TeamRequest = {
    teamName: 'Anglia',
    image: 'http://image.com/eng.png',
    shortName: 'ENG'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTeamList()
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTeamList()
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get a list of teams', () => {
      const document1 = teamConverter.create(team1);
      const document2 = teamConverter.create(team2);

      cy.saveTeamDocument(document1)
        .saveTeamDocument(document2)
        .authenticate('admin1')
        .requestGetTeamList()
        .expectOkResponse()
        .expectTeamResponse();
    });
  });
});
