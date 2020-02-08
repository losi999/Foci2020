import { addMinutes } from 'api/common';
import { createTeam, deleteTeam, validateTeam } from '../team/team-common';
import { createTournament, deleteTournament, validateTournament } from '../tournament/tournament-common';
import { deleteMatch, createMatch, getMatch, validateMatch } from './match-common';
import { MatchResponse } from 'api/types/responses';
import uuid = require('uuid');
import { TeamRequest, TournamentRequest, MatchRequest } from 'api/types/requests';

describe('POST /match/v1/matches', () => {
  const homeTeam: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN',
  };

  const awayTeam: TeamRequest = {
    teamName: 'Anglia',
    image: 'http://image.com/eng.png',
    shortName: 'ENG',
  };

  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  let createdMatchIds: string[];
  let createdTeamIds: string[];
  let createdTournamentIds: string[];

  before(() => {
    createdMatchIds = [];
    createdTeamIds = [];
    createdTournamentIds = [];
  });

  let homeTeamId: string;
  let awayTeamId: string;
  let tournamentId: string;
  let match: MatchRequest;

  before(() => {
    createTeam(homeTeam)
      .its('body')
      .its('teamId')
      .then((id) => {
        homeTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTeam(awayTeam);
      })
      .its('body')
      .its('teamId')
      .then((id) => {
        awayTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTournament(tournament);
      })
      .its('body')
      .its('tournamentId')
      .then((id) => {
        tournamentId = id;
        createdTournamentIds.push(id);
        expect(id).to.be.a('string');

        match = {
          homeTeamId,
          awayTeamId,
          tournamentId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        };
      });
  });

  after(() => {
    createdMatchIds.map(matchId => deleteMatch(matchId));
    createdTeamIds.map(teamId => deleteTeam(teamId));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId));
  });

  it('should create a match', () => {
    let matchId: string;

    createMatch(match)
      .its('body')
      .its('matchId')
      .then((id) => {
        matchId = id;
        createdMatchIds.push(id);
        expect(id).to.be.a('string');
        return getMatch(matchId);
      })
      .its('body')
      .should((body: MatchResponse) => {
        validateMatch(body, matchId, match);
        validateTeam(body.homeTeam, homeTeamId, homeTeam);
        validateTeam(body.awayTeam, awayTeamId, awayTeam);
        validateTournament(body.tournament, tournamentId, tournament);
      });
  });

  describe('should return error if homeTeamId', () => {
    it('is missing from body', () => {
      createMatch({
        ...match,
        homeTeamId: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('homeTeamId').to.contain('required');
        });
    });

    it('is not string', () => {
      createMatch({
        ...match,
        homeTeamId: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('homeTeamId').to.contain('string');
        });
    });

    it('is not uuid', () => {
      createMatch({
        ...match,
        homeTeamId: `${uuid()}-not-valid`
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('homeTeamId').to.contain('format').to.contain('uuid');
        });
    });

    it('does not belong to any team', () => {
      createMatch({
        ...match,
        homeTeamId: uuid()
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.equal('Home team not found');
        });
    });
  });

  describe('should return error if awayTeamId', () => {
    it('is missing from body', () => {
      createMatch({
        ...match,
        awayTeamId: undefined,
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('awayTeamId').to.contain('required');
        });
    });

    it('is not string', () => {
      createMatch({
        ...match,
        awayTeamId: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('awayTeamId').to.contain('string');
        });
    });

    it('is not uuid', () => {
      createMatch({
        ...match,
        awayTeamId: `${uuid()}-not-valid`
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('awayTeamId').to.contain('format').to.contain('uuid');
        });
    });

    it('does not belong to any team', () => {
      createMatch({
        ...match,
        awayTeamId: uuid()
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.equal('Away team not found');
        });
    });

    it('is the same as homeTeamId', () => {
      createMatch({
        ...match,
        awayTeamId: homeTeamId
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.equal('Home and away teams cannot be the same');
        });
    });
  });

  describe('should return error if tournamentId', () => {
    it('is missing from body', () => {
      createMatch({
        ...match,
        tournamentId: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('tournamentId').to.contain('required');
        });
    });

    it('is not string', () => {
      createMatch({
        ...match,
        tournamentId: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('tournamentId').to.contain('string');
        });
    });

    it('is not uuid', () => {
      createMatch({
        ...match,
        tournamentId: `${uuid()}-not-valid`
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('tournamentId').to.contain('format').to.contain('uuid');
        });
    });

    it('does not belong to any tournament', () => {
      createMatch({
        ...match,
        tournamentId: uuid()
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.equal('Tournament not found');
        });
    });
  });

  describe('should return error if group', () => {
    it('is missing from body', () => {
      createMatch({
        ...match,
        group: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('group').to.contain('required');
        });
    });

    it('is not string', () => {
      createMatch({
        ...match,
        group: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('group').to.contain('string');
        });
    });
  });

  describe('should return error if startTime', () => {
    it('is missing from body', () => {
      createMatch({
        ...match,
        startTime: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('startTime').to.contain('required');
        });
    });

    it('is not string', () => {
      createMatch({
        ...match,
        startTime: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('startTime').to.contain('string');
        });
    });

    it('is less than 5 minutes from now', () => {
      createMatch({
        ...match,
        startTime: addMinutes(4.9).toISOString()
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body).to.equal('Start time has to be at least 5 minutes from now');
        });
    });
  });
});
