import { MatchRequest, MatchResponse } from 'api/shared/types/types';
import { User } from '../constants';

export const createMatch = (match: MatchRequest, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      body: match,
      method: 'POST',
      url: '/match/v1/matches',
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const updateMatch = (matchId: string, match: MatchRequest, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      body: match,
      method: 'PUT',
      url: `/match/v1/matches/${matchId}`,
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const deleteMatch = (matchId: string, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      method: 'DELETE',
      url: `/match/v1/matches/${matchId}`,
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const getMatch = (matchId: string, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      method: 'GET',
      url: `/match/v1/matches/${matchId}`,
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const getMatchList = (tournamentId: string, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      method: 'GET',
      url: '/match/v1/matches',
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false,
      qs: {
        tournamentId
      }
    }));
};

export const validateMatch = (body: MatchResponse, matchId: string, match: MatchRequest) => {
  expect(body.matchId).to.equal(matchId);
  expect(body.group).to.equal(match.group);
  expect(body.startTime).to.equal(match.startTime);
};
