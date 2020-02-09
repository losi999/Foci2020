import { createTeam, getTeam, deleteTeam, validateTeam } from './team-common';
import { TeamRequest, TeamResponse } from 'api/shared/types/types';

describe('POST /team/v1/teams', () => {
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

  it('should create a team', () => {
    let teamId: string;
    createTeam(team)
      .its('body')
      .its('teamId')
      .then((id) => {
        teamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return getTeam(id);
      })
      .its('body')
      .should((body: TeamResponse) => {
        validateTeam(body, teamId, team);
      });
  });

  describe('should return error if teamName', () => {
    it('is missing from body', () => {
      createTeam({
        ...team,
        teamName: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('teamName').to.contain('required');
        });
    });

    it('is not string', () => {
      createTeam({
        ...team,
        teamName: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('teamName').to.contain('string');
        });
    });
  });

  describe('should return error if image', () => {
    it('is missing from body', () => {
      createTeam({
        ...team,
        image: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('image').to.contain('required');
        });
    });

    it('is not string', () => {
      createTeam({
        ...team,
        image: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('image').to.contain('string');
        });
    });

    it('is not an URI', () => {
      createTeam({
        ...team,
        image: 'not.an.uri'
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('image').to.contain('format').to.contain('uri');
        });
    });
  });

  describe('should return error if shortName', () => {
    it('is missing from body', () => {
      createTeam({
        ...team,
        shortName: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('required');
        });
    });

    it('is not string', () => {
      createTeam({
        ...team,
        shortName: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('string');
        });
    });

    it('is shorter than 3 characters', () => {
      createTeam({
        ...team,
        shortName: 'AB'
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('shorter').to.contain('3');
        });
    });

    it('is longer than 3 characters', () => {
      createTeam({
        ...team,
        shortName: 'ABCD'
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('longer').to.contain('3');
        });
    });
  });
});
