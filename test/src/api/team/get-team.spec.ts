import { createTeam, getTeam, deleteTeam, validateTeam } from './team-common';
import { TeamResponse } from 'api/types/responses';
import uuid from 'uuid';
import { TeamRequest } from 'api/types/requests';

describe('GET /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  let createdTeamIds: string[];

  before(() => {
    createdTeamIds = [];
  });

  after(() => {
    createdTeamIds.map(teamId => deleteTeam(teamId));
  });

  it('should get team by id', () => {
    let teamId: string;

    createTeam(team)
      .its('body')
      .its('teamId')
      .then((id) => {
        createdTeamIds.push(id);
        teamId = id;
        expect(id).to.be.a('string');
        return getTeam(teamId);
      })
      .its('body')
      .should((body: TeamResponse) => {
        validateTeam(body, teamId, team);
      });
  });

  describe('should return error if teamId', () => {
    it('is not uuid', () => {
      getTeam(`${uuid()}-not-valid`)
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.pathParameters).to.contain('teamId').to.contain('format').to.contain('uuid');
        });
    });

    it('does not belong to any team', () => {
      getTeam(uuid())
        .should((response) => {
          expect(response.status).to.equal(404);
        });
    });
  });
});
