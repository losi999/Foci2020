import { TournamentRequest } from '@foci2020/shared/types/requests';
import { User } from '@foci2020/test/api/constants';
import { authenticate } from '@foci2020/test/api/auth/auth-common';
import { TournamentResponse } from '@foci2020/shared/types/responses';

export const createTournament = (tournament: TournamentRequest, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      body: tournament,
      method: 'POST',
      url: '/tournament/v1/tournaments',
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const updateTournament = (tournamentId: string, tournament: TournamentRequest, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      body: tournament,
      method: 'PUT',
      url: `/tournament/v1/tournaments/${tournamentId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const deleteTournament = (tournamentId: string, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'DELETE',
      url: `/tournament/v1/tournaments/${tournamentId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const getTournament = (tournamentId: string, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'GET',
      url: `/tournament/v1/tournaments/${tournamentId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const getTournamentList = (user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'GET',
      url: '/tournament/v1/tournaments',
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const validateTournament = (body: TournamentResponse, tournamentId: string, tournament: TournamentRequest) => {
  expect(body.tournamentId).to.equal(tournamentId);
  expect(body.tournamentName).to.equal(tournament.tournamentName);
};
