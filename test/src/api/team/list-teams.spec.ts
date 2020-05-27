import { TeamRequest } from '@foci2020/shared/types/requests';
import { deleteTeam, getTeamList, createTeam_, validateTeam_ } from '@foci2020/test/api/team/team-common';
import { TeamResponse } from '@foci2020/shared/types/responses';

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

  let createdTeamIds: string[];

  before(() => {
    createdTeamIds = [];
  });

  after(() => {
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin1'));
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      getTeamList('player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should get a list of teams', () => {
      let teamId1: string;
      let teamId2: string;

      createTeam_(team1, 'admin1')
        .its('body')
        .its('teamId')
        .then((id) => {
          teamId1 = id;
          createdTeamIds.push(id);
          return createTeam_(team2, 'admin1');
        })
        .its('body')
        .its('teamId')
        .then((id) => {
          teamId2 = id;
          createdTeamIds.push(id);
          return getTeamList('admin1');
        })
        .its('body')
        .should((teams: TeamResponse[]) => {
          validateTeam_(teams.find(t => t.teamId === teamId1), teamId1, team1);
          validateTeam_(teams.find(t => t.teamId === teamId2), teamId2, team2);
        });
    });
  });
});
