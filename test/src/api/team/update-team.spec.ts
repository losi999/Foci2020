import { TeamRequest } from 'api/types/requests';
import { deleteMatch, createMatch, getMatch } from '../match/match-common';
import { deleteTeam, createTeam, updateTeam, getTeam, validateTeam } from './team-common';
import { deleteTournament, createTournament } from '../tournament/tournament-common';
import { TeamResponse, MatchResponse } from 'api/types/responses';
import { addMinutes } from 'api/common';

describe('PUT /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  const teamToUpdate: TeamRequest = {
    teamName: 'to update',
    image: 'http://toupdate.com',
    shortName: 'TUP'
  };

  let createdMatchIds: string[];
  let createdTeamIds: string[];
  let createdTournamentIds: string[];

  before(() => {
    createdMatchIds = [];
    createdTeamIds = [];
    createdTournamentIds = [];
  });

  after(() => {
    createdMatchIds.map(matchId => deleteMatch(matchId));
    createdTeamIds.map(teamId => deleteTeam(teamId));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId));
  });

  let teamId: string;

  before(() => {
    createTeam(teamToUpdate)
      .its('body')
      .its('teamId')
      .then((id) => {
        teamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
      });
  });

  it('should update a team', () => {
    updateTeam(teamId, team)
      .its('status')
      .then((status) => {
        expect(status).to.equal(200);
        return getTeam(teamId);
      })
      .its('body')
      .should((body: TeamResponse) => {
        validateTeam(body, teamId, team);
      });
  });

  describe('related matches', () => {
    let fixTeamId: string;
    let tournamentId: string;

    const updatedTeam: TeamRequest = {
      teamName: 'updated',
      shortName: 'UPD',
      image: 'http://updated.com/upd.png'
    };

    beforeEach(() => {
      createTeam({
        teamName: 'Anglia',
        image: 'http://image.com/eng.png',
        shortName: 'ENG'
      })
        .its('body')
        .its('teamId')
        .then((id) => {
          fixTeamId = id;
          createdTeamIds.push(id);
          expect(id).to.be.a('string');
          return createTournament({
            tournamentName: 'EB 2020'
          });
        })
        .its('body')
        .its('tournamentId')
        .then((id) => {
          tournamentId = id;
          createdTournamentIds.push(id);
          expect(id).to.be.a('string');
        });
    });

    it('should be updated if home team is updated', () => {
      let matchId: string;

      createMatch({
        tournamentId,
        homeTeamId: teamId,
        awayTeamId: fixTeamId,
        group: 'A csoport',
        startTime: addMinutes(10).toISOString()
      }).its('body')
        .its('matchId')
        .then((id) => {
          matchId = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
          return getMatch(matchId);
        })
        .its('body')
        .then(() => {
          return updateTeam(teamId, updatedTeam);
        })
        .its('status')
        .wait(1000)
        .then((status) => {
          expect(status).to.equal(200);
          return getMatch(matchId);
        })
        .its('body')
        .should((body: MatchResponse) => {
          validateTeam(body.homeTeam, teamId, updatedTeam);
        });
    });

    it('should be updated if away team is updated', () => {
      let matchId: string;

      createMatch({
        tournamentId,
        awayTeamId: teamId,
        homeTeamId: fixTeamId,
        group: 'A csoport',
        startTime: addMinutes(10).toISOString()
      }).its('body')
        .its('matchId')
        .then((id) => {
          matchId = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
          return getMatch(matchId);
        })
        .its('body')
        .then(() => {
          return updateTeam(teamId, updatedTeam);
        })
        .its('status')
        .wait(1000)
        .then((status) => {
          expect(status).to.equal(200);
          return getMatch(matchId);
        })
        .its('body')
        .should((body: MatchResponse) => {
          validateTeam(body.awayTeam, teamId, updatedTeam);
        });
    });
  });

  describe('should return error if teamName', () => {
    it('is missing from body', () => {
      updateTeam(teamId, {
        ...team,
        teamName: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('teamName').to.contain('required');
        });
    });

    it('is not string', () => {
      updateTeam(teamId, {
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
      updateTeam(teamId, {
        ...team,
        image: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('image').to.contain('required');
        });
    });

    it('is not string', () => {
      updateTeam(teamId, {
        ...team,
        image: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('image').to.contain('string');
        });
    });

    it('is not an URI', () => {
      updateTeam(teamId, {
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
      updateTeam(teamId, {
        ...team,
        shortName: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('required');
        });
    });

    it('is not string', () => {
      updateTeam(teamId, {
        ...team,
        shortName: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('string');
        });
    });

    it('is shorter than 3 characters', () => {
      updateTeam(teamId, {
        ...team,
        shortName: 'AB'
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('shortName').to.contain('shorter').to.contain('3');
        });
    });

    it('is longer than 3 characters', () => {
      updateTeam(teamId, {
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
