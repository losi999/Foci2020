import { TeamRequest, TournamentRequest, MatchRequest, MatchResponse } from 'api/types/types';
import { createTeam, deleteTeam, validateTeam } from '../team/team-common';
import { createTournament, deleteTournament, validateTournament } from '../tournament/tournament-common';
import { addMinutes } from 'api/common';
import { deleteMatch, createMatch, getMatchList, validateMatch } from './match-common';

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
          validateTeam(matchResponse1.homeTeam, homeTeamId, homeTeam);
          validateTeam(matchResponse1.awayTeam, awayTeamId, awayTeam);
          validateTournament(matchResponse1.tournament, tournamentId, tournament);

          const matchResponse2 = matches.find(m => m.matchId === matchId2);
          validateMatch(matchResponse2, matchId2, match2);
          validateTeam(matchResponse2.homeTeam, awayTeamId, awayTeam);
          validateTeam(matchResponse2.awayTeam, homeTeamId, homeTeam);
          validateTournament(matchResponse2.tournament, tournamentId, tournament);
        });
    });
  });
});