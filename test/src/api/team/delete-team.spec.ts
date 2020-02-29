import { createTeam, deleteTeam, getTeam } from './team-common';
import { createTournament, deleteTournament } from '../tournament/tournament-common';
import { addMinutes } from 'api/common';
import { createMatch, getMatch, deleteMatch } from '../match/match-common';
import { TeamRequest, TournamentRequest } from 'api/types/types';
import uuid from 'uuid';

describe('DELETE /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
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
      deleteTeam(uuid(), 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should delete team', () => {
      let teamId: string;

      createTeam(team, 'admin1')
        .its('body')
        .its('teamId')
        .then((id) => {
          teamId = id;
          expect(id).to.be.a('string');
          return deleteTeam(teamId, 'admin1');
        })
        .its('status')
        .then((status) => {
          expect(status).to.equal(200);
          return getTeam(teamId, 'admin1');
        })
        .its('status')
        .should((status) => {
          expect(status).to.equal(404);
        });
    });

    describe('related matches', () => {
      const teamToDelete: TeamRequest = {
        teamName: 'Anglia',
        image: 'http://image.com/eng.png',
        shortName: 'ENG',
      };
      const tournament: TournamentRequest = {
        tournamentName: 'EB 2020'
      };

      let teamId: string;
      let teamToDeleteId: string;
      let tournamentId: string;

      beforeEach(() => {
        createTeam(team, 'admin1')
          .its('body')
          .its('teamId')
          .then((id) => {
            teamId = id;
            createdTeamIds.push(id);
            expect(id).to.be.a('string');
            return createTeam(teamToDelete, 'admin1');
          })
          .its('body')
          .its('teamId')
          .then((id) => {
            teamToDeleteId = id;
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

      it('should be deleted if "home team" is deleted', () => {
        let matchId: string;
        createMatch({
          tournamentId,
          homeTeamId: teamToDeleteId,
          awayTeamId: teamId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString(),
        }, 'admin1')
          .its('body')
          .its('matchId')
          .then((id) => {
            matchId = id;
            createdMatchIds.push(id);
            return deleteTeam(teamToDeleteId, 'admin1');
          })
          .its('status')
          .then((status) => {
            expect(status).to.equal(200);
            return getTeam(teamToDeleteId, 'admin1');
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

      it('should be deleted if "away team" is deleted', () => {
        let matchId: string;
        createMatch({
          tournamentId,
          awayTeamId: teamToDeleteId,
          homeTeamId: teamId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString(),
        }, 'admin1')
          .its('body')
          .its('matchId')
          .then((id) => {
            matchId = id;
            createdMatchIds.push(id);
            return deleteTeam(teamToDeleteId, 'admin1');
          })
          .its('status')
          .then((status) => {
            expect(status).to.equal(200);
            return getTeam(teamToDeleteId, 'admin1');
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
