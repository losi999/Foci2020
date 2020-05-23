import { TournamentRequest, TournamentResponse } from 'api/types/types';

export const createTournament = (tournament: TournamentRequest, idToken: string) => {
  return cy.request({
    body: tournament,
    method: 'POST',
    url: '/tournament/v1/tournaments',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const updateTournament = (tournamentId: string, tournament: TournamentRequest, idToken: string) => {
  return cy.request({
    body: tournament,
    method: 'PUT',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const deleteTournament = (tournamentId: string, idToken: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const getTournament = (tournamentId: string, idToken: string) => {
  return cy.request({
    method: 'GET',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const getTournamentList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/tournament/v1/tournaments',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const validateTournament = (body: TournamentResponse, tournamentId: string, tournament: TournamentRequest) => {
  expect(body.tournamentId).to.equal(tournamentId);
  expect(body.tournamentName).to.equal(tournament.tournamentName);
};
