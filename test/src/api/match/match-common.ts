import { User } from '@foci2020/test/api/constants';
import { authenticate } from '@foci2020/test/api/auth/auth-common';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { MatchResponse } from '@foci2020/shared/types/responses';

export const createMatch = (match: MatchRequest, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      body: match,
      method: 'POST',
      url: '/match/v1/matches',
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const updateMatch = (matchId: string, match: MatchRequest, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      body: match,
      method: 'PUT',
      url: `/match/v1/matches/${matchId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const deleteMatch = (matchId: string, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'DELETE',
      url: `/match/v1/matches/${matchId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const getMatch = (matchId: string, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'GET',
      url: `/match/v1/matches/${matchId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const getMatchList = (user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'GET',
      url: '/match/v1/matches',
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false,
    }));
};

export const validateMatch = (body: MatchResponse, matchId: string, match: MatchRequest) => {
  expect(body.matchId).to.equal(matchId);
  expect(body.group).to.equal(match.group);
  expect(body.startTime).to.equal(match.startTime);
};
