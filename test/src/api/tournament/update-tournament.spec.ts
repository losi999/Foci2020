import { deleteMatch, createMatch, getMatch } from '../match/match-common';
import { TournamentRequest, TeamRequest, TournamentResponse, MatchResponse } from 'api/types/types';
import { deleteTeam, createTeam } from '../team/team-common';
import { deleteTournament, createTournament, updateTournament, getTournament, validateTournament } from './tournament-common';
import { addMinutes } from 'api/common';

describe('PUT /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  const tournamentToUpdate: TournamentRequest = {
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

  after(() => {
    createdMatchIds.map(matchId => deleteMatch(matchId, 'admin1'));
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin1'));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId, 'admin1'));
  });

  let tournamentId: string;

  before(() => {
    createTournament(tournamentToUpdate, 'admin1')
      .its('body')
      .its('tournamentId')
      .then((id) => {
        tournamentId = id;
        createdTournamentIds.push(id);
        expect(id).to.be.a('string');
      });
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      updateTournament(tournamentId, tournament, 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should update a tournament', () => {
      updateTournament(tournamentId, tournament, 'admin1')
        .its('status')
        .then((status) => {
          expect(status).to.equal(200);
          return getTournament(tournamentId, 'admin1');
        })
        .its('body')
        .should((body: TournamentResponse) => {
          validateTournament(body, tournamentId, tournament);
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

      const updatedTournament: TournamentRequest = {
        tournamentName: 'updated'
      };

      let homeTeamId: string;
      let awayTeamId: string;

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
          });
      });

      it('should be updated if tournament is updated', () => {
        let matchId: string;

        createMatch({
          tournamentId,
          homeTeamId,
          awayTeamId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        }, 'admin1').its('body')
          .its('matchId')
          .then((id) => {
            matchId = id;
            createdMatchIds.push(id);
            expect(id).to.be.a('string');
            return getMatch(matchId, 'admin1');
          })
          .its('body')
          .then(() => {
            return updateTournament(tournamentId, updatedTournament, 'admin1');
          })
          .its('status')
          .wait(1000)
          .then((status) => {
            expect(status).to.equal(200);
            return getMatch(matchId, 'admin1');
          })
          .its('body')
          .should((body: MatchResponse) => {
            validateTournament(body.tournament, tournamentId, updatedTournament);
          });
      });
    });

    describe('should return error if tournamentName', () => {
      it('is missing from body', () => {
        updateTournament(tournamentId, {
          tournamentName: undefined
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('tournamentName').to.contain('required');
          });
      });

      it('is not string', () => {
        updateTournament(tournamentId, {
          tournamentName: 1 as any
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('tournamentName').to.contain('string');
          });
      });
    });
  });
});
