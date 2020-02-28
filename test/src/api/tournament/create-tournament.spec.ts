import { deleteTournament, createTournament, getTournament, validateTournament } from './tournament-common';
import { TournamentRequest, TournamentResponse } from 'api/shared/types/types';

describe('POST /tournament/v1/tournaments', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020',
  };

  let createdTournamentIds: string[];

  before(() => {
    createdTournamentIds = [];
  });

  after(() => {
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId, 'admin1'));
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      createTournament(tournament, 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should create a tournament', () => {
      let tournamentId: string;
      createTournament(tournament, 'admin1')
        .its('body')
        .its('tournamentId')
        .then((id) => {
          tournamentId = id;
          createdTournamentIds.push(id);
          expect(id).to.be.a('string');
          return getTournament(id, 'admin1');
        })
        .its('body')
        .should((body: TournamentResponse) => {
          validateTournament(body, tournamentId, tournament);
        });
    });

    describe('should return error if tournamentName', () => {
      it('is missing from body', () => {
        createTournament({
          tournamentName: undefined
        }, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.body).to.contain('tournamentName').to.contain('required');
          });
      });

      it('is not string', () => {
        createTournament({
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
