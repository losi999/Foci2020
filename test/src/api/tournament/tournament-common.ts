import { TournamentRequest } from 'api/types/requests';
import { TournamentResponse } from 'api/types/responses';

export const createTournament = (tournament: TournamentRequest) => {
  return cy.request({
    body: tournament,
    method: 'POST',
    url: '/tournament/v1/tournaments',
    failOnStatusCode: false
  });
};

export const updateTournament = (tournamentId: string, tournament: TournamentRequest) => {
  return cy.request({
    body: tournament,
    method: 'PUT',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    failOnStatusCode: false
  });
};

export const deleteTournament = (tournamentId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    failOnStatusCode: false
  });
};

export const getTournament = (tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    failOnStatusCode: false
  });
};

export const getTournamentList = () => {
  return cy.request({
    method: 'GET',
    url: '/tournament/v1/tournaments',
    failOnStatusCode: false
  });
};

export const validateTournament = (body: TournamentResponse, tournamentId: string, tournament: TournamentRequest) => {
  expect(body.tournamentId).to.equal(tournamentId);
  expect(body.tournamentName).to.equal(tournament.tournamentName);
};
