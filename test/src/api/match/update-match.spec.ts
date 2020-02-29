import { TeamRequest, TournamentRequest, MatchRequest, MatchResponse } from 'api/types/types';
import { createTeam, deleteTeam, validateTeam } from '../team/team-common';
import { createTournament, deleteTournament, validateTournament } from '../tournament/tournament-common';
import { addMinutes } from 'api/common';
import { deleteMatch, createMatch, updateMatch, getMatch, validateMatch } from './match-common';
import uuid from 'uuid';

describe('PUT /match/v1/matches/{matchId}', () => {
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

  const oldTournament: TournamentRequest = {
    tournamentName: 'VB 2022'
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
  let oldTournamentId: string;
  let match: MatchRequest;

  before(() => {
    createTeam(homeTeam, 'admin1')
      .its('body')
      .its('teamId')
      .then((id) => {
        homeTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTeam(awayTeam, 'admin1');
      })
      .its('body')
      .its('teamId')
      .then((id) => {
        awayTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTournament(tournament, 'admin1');
      })
      .its('body')
      .its('tournamentId')
      .then((id) => {
        tournamentId = id;
        createdTournamentIds.push(id);
        expect(id).to.be.a('string');
        return createTournament(oldTournament, 'admin1');
      })
      .its('body')
      .its('tournamentId')
      .then((id) => {
        oldTournamentId = id;
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
    createdMatchIds.map(matchId => deleteMatch(matchId, 'admin1'));
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin1'));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId, 'admin1'));
  });

  let matchId: string;

  before(() => {
    createMatch({
      homeTeamId: awayTeamId,
      awayTeamId: homeTeamId,
      group: 'to update',
      startTime: addMinutes(20).toISOString(),
      tournamentId: oldTournamentId,
    }, 'admin1')
      .its('body')
      .its('matchId')
      .then((id) => {
        matchId = id;
        createdMatchIds.push(id);
        expect(id).to.be.a('string');
      });
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      updateMatch(matchId, match, 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should update a match', () => {
      updateMatch(matchId, match, 'admin1')
        .its('status')
        .then((status) => {
          expect(status).to.equal(200);
          return getMatch(matchId, 'admin1');
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
        updateMatch(matchId, {
          ...match,
          homeTeamId: undefined
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('homeTeamId').to.contain('required');
          });
      });

      it('is not string', () => {
        updateMatch(matchId, {
          ...match,
          homeTeamId: 1 as any
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('homeTeamId').to.contain('string');
          });
      });

      it('is not uuid', () => {
        updateMatch(matchId, {
          ...match,
          homeTeamId: `${uuid()}-not-valid`
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('homeTeamId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any team', () => {
        updateMatch(matchId, {
          ...match,
          homeTeamId: uuid()
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.equal('Home team not found');
          });
      });
    });

    describe('should return error if awayTeamId', () => {
      it('is missing from body', () => {
        updateMatch(matchId, {
          ...match,
          awayTeamId: undefined,
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('awayTeamId').to.contain('required');
          });
      });

      it('is not string', () => {
        updateMatch(matchId, {
          ...match,
          awayTeamId: 1 as any
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('awayTeamId').to.contain('string');
          });
      });

      it('is not uuid', () => {
        updateMatch(matchId, {
          ...match,
          awayTeamId: `${uuid()}-not-valid`
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('awayTeamId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any team', () => {
        updateMatch(matchId, {
          ...match,
          awayTeamId: uuid()
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.equal('Away team not found');
          });
      });

      it('is the same as homeTeamId', () => {
        updateMatch(matchId, {
          ...match,
          awayTeamId: homeTeamId
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.equal('Home and away teams cannot be the same');
          });
      });
    });

    describe('should return error if tournamentId', () => {
      it('is missing from body', () => {
        updateMatch(matchId, {
          ...match,
          tournamentId: undefined
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('tournamentId').to.contain('required');
          });
      });

      it('is not string', () => {
        updateMatch(matchId, {
          ...match,
          tournamentId: 1 as any
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('tournamentId').to.contain('string');
          });
      });

      it('is not uuid', () => {
        updateMatch(matchId, {
          ...match,
          tournamentId: `${uuid()}-not-valid`
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('tournamentId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any tournament', () => {
        updateMatch(matchId, {
          ...match,
          tournamentId: uuid()
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.equal('Tournament not found');
          });
      });
    });

    describe('should return error if group', () => {
      it('is missing from body', () => {
        updateMatch(matchId, {
          ...match,
          group: undefined
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('group').to.contain('required');
          });
      });

      it('is not string', () => {
        updateMatch(matchId, {
          ...match,
          group: 1 as any
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('group').to.contain('string');
          });
      });
    });

    describe('should return error if startTime', () => {
      it('is missing from body', () => {
        updateMatch(matchId, {
          ...match,
          startTime: undefined
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('startTime').to.contain('required');
          });
      });

      it('is not string', () => {
        updateMatch(matchId, {
          ...match,
          startTime: 1 as any
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('startTime').to.contain('string');
          });
      });

      it('is less than 5 minutes from now', () => {
        updateMatch(matchId, {
          ...match,
          startTime: addMinutes(4.9).toISOString()
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body).to.equal('Start time has to be at least 5 minutes from now');
          });
      });
    });
  });

  describe('should return with error if final score', () => {
    it('is already set for a match', () => {

    });
  });
});
