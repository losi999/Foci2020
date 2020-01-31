import { MatchRequest, TeamRequest, TournamentRequest } from 'api/types/requests';
import { createTeam, deleteTeam, validateTeam } from '../team/team-common';
import { createTournament, deleteTournament, validateTournament } from '../tournament/tournament-common';
import { addMinutes } from 'api/common';
import { deleteMatch, createMatch, getMatch, validateMatch } from './match-common';
import { MatchResponse } from 'api/types/responses';
import uuid from 'uuid';

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

  it('should get match by id', () => {
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

  describe('should return error if matchId', () => {
    it('is not uuid', () => {
      getMatch(`${uuid()}-not-valid`)
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.pathParameters).to.contain('matchId').to.contain('format').to.contain('uuid');
        });
    });

    it('does not belong to any match', () => {
      getMatch(uuid())
        .should((response) => {
          expect(response.status).to.equal(404);
        });
    });
  });
});
