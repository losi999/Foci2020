import { TournamentRequest, TournamentResponse } from 'api/shared/types/types';
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
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId));
  });

  it('should get tournament by id', () => {
    let tournamentId: string;

    createTournament(tournament)
      .its('body')
      .its('tournamentId')
      .then((id) => {
        tournamentId = id;
        createdTournamentIds.push(id);
        expect(id).to.be.a('string');
        return getTournament(id);
      })
      .its('body')
      .should((body: TournamentResponse) => {
        validateTournament(body, tournamentId, tournament);
      });
  });

  describe('should return error if tournamentId', () => {
    it('is not uuid', () => {
      getTournament(`${uuid()}-not-valid`)
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.pathParameters).to.contain('tournamentId').to.contain('format').to.contain('uuid');
        });
    });

    it('does not belong to any tournament', () => {
      getTournament(uuid())
        .should((response) => {
          expect(response.status).to.equal(404);
        });
    });
  });
});
