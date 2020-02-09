import { deleteTeam, createTeam, getTeamList, validateTeam } from './team-common';
import { TeamRequest, TeamResponse } from 'api/shared/types/types';

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
    createdTeamIds.map(teamId => deleteTeam(teamId));
  });

  it('should get a list of teams', () => {
    let teamId1: string;
    let teamId2: string;

    createTeam(team1)
      .its('body')
      .its('teamId')
      .then((id) => {
        teamId1 = id;
        createdTeamIds.push(id);
        return createTeam(team2);
      })
      .its('body')
      .its('teamId')
      .then((id) => {
        teamId2 = id;
        createdTeamIds.push(id);
        return getTeamList();
      })
      .its('body')
      .should((teams: TeamResponse[]) => {
        validateTeam(teams.find(t => t.teamId === teamId1), teamId1, team1);
        validateTeam(teams.find(t => t.teamId === teamId2), teamId2, team2);
      });
  });
});
