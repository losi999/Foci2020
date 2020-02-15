import { deleteTeam, createTeam, getTeamList, validateTeam } from './team-common';
import { TeamRequest, TeamResponse } from 'api/shared/types/types';
import { authenticate } from '../auth/auth-common';

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

    authenticate('admin');
    authenticate('player1');
  });

  after(() => {
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin'));
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

      createTeam(team1, 'admin')
        .its('body')
        .its('teamId')
        .then((id) => {
          teamId1 = id;
          createdTeamIds.push(id);
          return createTeam(team2, 'admin');
        })
        .its('body')
        .its('teamId')
        .then((id) => {
          teamId2 = id;
          createdTeamIds.push(id);
          return getTeamList('admin');
        })
        .its('body')
        .should((teams: TeamResponse[]) => {
          validateTeam(teams.find(t => t.teamId === teamId1), teamId1, team1);
          validateTeam(teams.find(t => t.teamId === teamId2), teamId2, team2);
        });
    });
  });
});
