import { TeamRequest, TournamentRequest, MatchRequest } from '@foci2020/shared/types/requests';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { createTeam_, deleteTeam, validateTeam_ } from '@foci2020/test/api/team/team-common';
import { createTournament, deleteTournament, validateTournament } from '@foci2020/test/api/tournament/tournament-common';
import { deleteMatch, getMatchList, createMatch, validateMatch } from '@foci2020/test/api/match/match-common';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('GET /match/v1/matches', () => {
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
  let match1: MatchRequest;
  let match2: MatchRequest;

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

        match1 = {
          homeTeamId,
          awayTeamId,
          tournamentId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        };

        match2 = {
          tournamentId,
          homeTeamId: awayTeamId,
          awayTeamId: homeTeamId,
          group: 'B csoport',
          startTime: addMinutes(25).toISOString()
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
      getMatchList('player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should get a list of matches', () => {
      let matchId1: string;
      let matchId2: string;

      createMatch(match1, 'admin1')
        .its('body')
        .its('matchId')
        .then((id) => {
          matchId1 = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
          return createMatch(match2, 'admin1');
        }).its('body')
        .its('matchId')
        .then((id) => {
          matchId2 = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
          return getMatchList('admin1');
        })
        .its('body')
        .should((matches: MatchResponse[]) => {
          const matchResponse1 = matches.find(m => m.matchId === matchId1);
          validateMatch(matchResponse1, matchId1, match1);
          validateTeam_(matchResponse1.homeTeam, homeTeamId, homeTeam);
          validateTeam_(matchResponse1.awayTeam, awayTeamId, awayTeam);
          validateTournament(matchResponse1.tournament, tournamentId, tournament);

          const matchResponse2 = matches.find(m => m.matchId === matchId2);
          validateMatch(matchResponse2, matchId2, match2);
          validateTeam_(matchResponse2.homeTeam, awayTeamId, awayTeam);
          validateTeam_(matchResponse2.awayTeam, homeTeamId, homeTeam);
          validateTournament(matchResponse2.tournament, tournamentId, tournament);
        });
    });
  });
});
