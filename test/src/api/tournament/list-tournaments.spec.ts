import { TournamentRequest } from '@foci2020/shared/types/requests';
import { deleteTournament, getTournamentList, createTournament, validateTournament } from '@foci2020/test/api/tournament/tournament-common';
import { TournamentResponse } from '@foci2020/shared/types/responses';

describe('GET /tournament/v1/tournaments', () => {
  const tournament1: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  const tournament2: TournamentRequest = {
    tournamentName: 'VB 2020'
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
      getTournamentList('player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should get a list of tournaments', () => {
      let tournamentId1: string;
      let tournamentId2: string;

      createTournament(tournament1, 'admin1')
        .its('body')
        .its('tournamentId')
        .then((id) => {
          tournamentId1 = id;
          createdTournamentIds.push(id);
          return createTournament(tournament2, 'admin1');
        })
        .its('body')
        .its('tournamentId')
        .then((id) => {
          tournamentId2 = id;
          createdTournamentIds.push(id);
          return getTournamentList('admin1');
        })
        .its('body')
        .should((tournaments: TournamentResponse[]) => {
          validateTournament(tournaments.find(t => t.tournamentId === tournamentId1), tournamentId1, tournament1);
          validateTournament(tournaments.find(t => t.tournamentId === tournamentId2), tournamentId2, tournament2);
        });
    });
  });
});
