import { createTeam, getTeam, deleteTeam, validateTeam } from './team-common';
import uuid from 'uuid';
import { TeamRequest, TeamResponse } from 'api/shared/types/types';
import { authenticate } from '../auth/auth-common';

describe('GET /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  let createdTeamIds: string[];

  before(() => {
    createdTeamIds = [];

    authenticate('admin');
    authenticate('player1');
  });

  after(() => {
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin'));
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      getTeam(uuid(), 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should get team by id', () => {
      let teamId: string;

      createTeam(team, 'admin')
        .its('body')
        .its('teamId')
        .then((id) => {
          createdTeamIds.push(id);
          teamId = id;
          expect(id).to.be.a('string');
          return getTeam(teamId, 'admin');
        })
        .its('body')
        .should((body: TeamResponse) => {
          validateTeam(body, teamId, team);
        });
    });

    describe('should return error if teamId', () => {
      it('is not uuid', () => {
        getTeam(`${uuid()}-not-valid`, 'admin')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.pathParameters).to.contain('teamId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any team', () => {
        getTeam(uuid(), 'admin')
          .should((response) => {
            expect(response.status).to.equal(404);
          });
      });
    });
  });
});
