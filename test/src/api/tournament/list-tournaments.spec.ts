import { createTournament, deleteTournament, getTournamentList, validateTournament } from './tournament-common';
import { TournamentRequest, TournamentResponse } from 'api/shared/types/types';

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
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId));
  });

  it('should get a list of tournaments', () => {
    let tournamentId1: string;
    let tournamentId2: string;

    createTournament(tournament1)
      .its('body')
      .its('tournamentId')
      .then((id) => {
        tournamentId1 = id;
        createdTournamentIds.push(id);
        return createTournament(tournament2);
      })
      .its('body')
      .its('tournamentId')
      .then((id) => {
        tournamentId2 = id;
        createdTournamentIds.push(id);
        return getTournamentList();
      })
      .its('body')
      .should((tournaments: TournamentResponse[]) => {
        validateTournament(tournaments.find(t => t.tournamentId === tournamentId1), tournamentId1, tournament1);
        validateTournament(tournaments.find(t => t.tournamentId === tournamentId2), tournamentId2, tournament2);
      });
  });
});
