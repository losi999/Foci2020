import { TeamRequest, TournamentRequest, MatchRequest } from '@foci2020/shared/types/requests';
import { deleteMatch, createMatch, getMatch } from '@foci2020/test/api/match/match-common';
import { deleteTeam, createTeam_ } from '@foci2020/test/api/team/team-common';
import { deleteTournament, createTournament } from '@foci2020/test/api/tournament/tournament-common';
import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';

describe('DELETE /match/v1/matches/{matchId}', () => {
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

  after(() => {
    createdMatchIds.map(matchId => deleteMatch(matchId, 'admin1'));
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin1'));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId, 'admin1'));
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

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      deleteMatch(uuid(), 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should delete match', () => {
      let matchId: string;

      createMatch(match, 'admin1')
        .its('body')
        .its('matchId')
        .then((id) => {
          matchId = id;
          createdMatchIds.push(id);
          expect(id).to.be.a('string');
          return deleteMatch(matchId, 'admin1');
        })
        .its('status')
        .then((status) => {
          expect(status).to.equal(200);
          return getMatch(matchId, 'admin1');
        })
        .its('status')
        .should((status) => {
          expect(status).to.equal(404);
        });
    });

    describe('related bets', () => {
      it.skip('should be deleted if match is deleted', () => {

      });
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it.skip('is not uuid', () => {

        });
      });
    });
  });
});
