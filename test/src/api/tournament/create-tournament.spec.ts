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
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId));
  });

  it('should create a tournament', () => {
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

  describe('should return error if tournamentName', () => {
    it('is missing from body', () => {
      createTournament({
        tournamentName: undefined
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('tournamentName').to.contain('required');
        });
    });

    it('is not string', () => {
      createTournament({
        tournamentName: 1 as any
      })
        .should((response) => {
          expect(response.status).to.equal(400);
          expect(response.body.body).to.contain('tournamentName').to.contain('string');
        });
    });
  });
});
