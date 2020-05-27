import { TeamRequest, TournamentRequest, MatchRequest } from '@foci2020/shared/types/requests';
import { createTeam_, deleteTeam, validateTeam_ } from '@foci2020/test/api/team/team-common';
import { createTournament, deleteTournament, validateTournament } from '@foci2020/test/api/tournament/tournament-common';
import { deleteMatch, getMatch, createMatch, validateMatch } from '@foci2020/test/api/match/match-common';
import { addMinutes } from '@foci2020/shared/common/utils';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { v4 as uuid } from 'uuid';

describe('GET /match/v1/matches/{matchId}', () => {
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

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      getMatch(uuid(), 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should get match by id', () => {
      let matchId: string;

      createMatch(match, 'admin1')
        .its('body')
        .its('matchId')
        .then((id) => {
          matchId = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
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

    describe('should return error if matchId', () => {
      it('is not uuid', () => {
        getMatch(`${uuid()}-not-valid`, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.pathParameters).to.contain('matchId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any match', () => {
        getMatch(uuid(), 'admin1')
          .should((response) => {
            expect(response.status).to.equal(404);
          });
      });
    });
  });
});
