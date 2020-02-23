import { createTournament, deleteTournament, getTournament } from './tournament-common';
import { deleteMatch, createMatch, getMatch } from '../match/match-common';
import { deleteTeam, createTeam } from '../team/team-common';
import { addMinutes } from 'api/shared/common';
import { TournamentRequest, TeamRequest } from 'api/shared/types/types';
import uuid from 'uuid';

describe('DELETE /tournament/v1/tournaments/{tournamentId}', () => {
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

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      deleteTournament(uuid(), 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should delete tournament', () => {
      let tournamentId: string;

      createTournament(tournament, 'admin1')
        .its('body')
        .its('tournamentId')
        .then((id) => {
          tournamentId = id;
          expect(id).to.be.a('string');
          return deleteTournament(tournamentId, 'admin1');
        })
        .its('status')
        .then((status) => {
          expect(status).to.equal(200);
          return getTournament(tournamentId, 'admin1');
        })
        .its('status')
        .should((status) => {
          expect(status).to.equal(404);
        });
    });

    describe('related matches', () => {
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

      let homeTeamId: string;
      let awayTeamId: string;
      let tournamentId: string;

      beforeEach(() => {
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
          });
      });

      it('should be deleted if tournament is deleted', () => {
        let matchId: string;

        createMatch({
          homeTeamId,
          awayTeamId,
          tournamentId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        }, 'admin1')
          .its('body')
          .its('matchId')
          .then((id) => {
            matchId = id;
            createdMatchIds.push(id);
            expect(id).to.be.a('string');
            return deleteTournament(tournamentId, 'admin1');
          })
          .its('status')
          .then((status) => {
            expect(status).to.equal(200);
            return getTournament(tournamentId, 'admin1');
          })
          .its('status')
          .then((status) => {
            expect(status).to.equal(404);
            return getMatch(matchId, 'admin1');
          })
          .its('status')
          .should((status) => {
            expect(status).to.equal(404);
          });
      });
    });
  });
});
