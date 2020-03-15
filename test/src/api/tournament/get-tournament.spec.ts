import { TournamentRequest, TournamentResponse } from 'api/types/types';
import { deleteTournament, createTournament, getTournament, validateTournament } from './tournament-common';
import uuid from 'uuid';

describe('GET /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
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
      getTournament(uuid(), 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should get tournament by id', () => {
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

    describe('should return error if tournamentId', () => {
      it('is not uuid', () => {
        getTournament(`${uuid()}-not-valid`, 'admin1')
          .should((response) => {
            expect(response.status).to.equal(400);
            expect(response.body.pathParameters).to.contain('tournamentId').to.contain('format').to.contain('uuid');
          });
      });

      it('does not belong to any tournament', () => {
        getTournament(uuid(), 'admin1')
          .should((response) => {
            expect(response.status).to.equal(404);
          });
      });
    });
  });
});
