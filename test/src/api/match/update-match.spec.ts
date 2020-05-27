import { v4 as uuid } from 'uuid';
import { TeamRequest, TournamentRequest, MatchRequest } from '@foci2020/shared/types/requests';
import { createTeam_, deleteTeam, validateTeam_ } from '@foci2020/test/api/team/team-common';
import { createTournament, deleteTournament, validateTournament } from '@foci2020/test/api/tournament/tournament-common';
import { addMinutes } from '@foci2020/shared/common/utils';
import { deleteMatch, createMatch, updateMatch, getMatch, validateMatch } from '@foci2020/test/api/match/match-common';
import { MatchResponse } from '@foci2020/shared/types/responses';

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
    createTeam_(homeTeam, 'admin1')
      .its('body')
      .its('teamId')
      .then((id) => {
        homeTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTeam_(awayTeam, 'admin1');
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
          validateTeam_(body.homeTeam, homeTeamId, homeTeam);
          validateTeam_(body.awayTeam, awayTeamId, awayTeam);
          validateTournament(body.tournament, tournamentId, tournament);
        });
    });

    describe('should return error', () => {
      describe('if homeTeamId', () => {
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

      describe('if awayTeamId', () => {
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

      describe('if tournamentId', () => {
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

      describe('if group', () => {
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

      describe('if startTime', () => {
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

      describe('if matchId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any match', () => {

        });
      });

      describe('if finalScore', () => {
        it.skip('is already set for a match', () => {

        });
      });
    });
  });

});
