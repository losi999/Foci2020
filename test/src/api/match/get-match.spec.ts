import { MatchRequest, TeamRequest, TournamentRequest, MatchResponse } from 'api/shared/types/types';
import { createTeam, deleteTeam, validateTeam } from '../team/team-common';
import { createTournament, deleteTournament, validateTournament } from '../tournament/tournament-common';
import { addMinutes } from 'api/shared/common';
import { deleteMatch, createMatch, getMatch, validateMatch } from './match-common';
import uuid from 'uuid';
import { authenticate } from '../auth/auth-common';

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

    authenticate('admin');
    authenticate('player1');
  });

  let homeTeamId: string;
  let awayTeamId: string;
  let tournamentId: string;
  let match: MatchRequest;

  before(() => {
    createTeam(homeTeam, 'admin')
      .its('body')
      .its('teamId')
      .then((id) => {
        homeTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTeam(awayTeam, 'admin');
      })
      .its('body')
      .its('teamId')
      .then((id) => {
        awayTeamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
        return createTournament(tournament, 'admin');
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
    createdMatchIds.map(matchId => deleteMatch(matchId, 'admin'));
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin'));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId, 'admin'));
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

      createMatch(match, 'admin')
        .its('body')
        .its('matchId')
        .then((id) => {
          matchId = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
          return getMatch(matchId, 'admin');
        })
        .its('body')
        .should((body: MatchResponse) => {
          validateMatch(body, matchId, match);
          validateTeam(body.homeTeam, homeTeamId, homeTeam);
          validateTeam(body.awayTeam, awayTeamId, awayTeam);
          validateTournament(body.tournament, tournamentId, tournament);
        });
    });

    describe('should return error if matchId', () => {
      it('is not uuid', () => {
        getMatch(`${uuid()}-not-valid`, 'admin')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.pathParameters).to.contain('matchId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any match', () => {
        getMatch(uuid(), 'admin')
          .should((response) => {
            expect(response.status).to.equal(404);
          });
      });
    });
  });
});
