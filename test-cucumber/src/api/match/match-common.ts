import { MatchRequest, MatchResponse } from 'api/types/types';
import { User } from '../constants';
import { authenticate } from '../auth/auth-common';

export const createMatch = (match: MatchRequest, idToken: string) => {
  return cy.request({
    body: match,
    method: 'POST',
    url: '/match/v1/matches',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const updateMatch = (matchId: string, match: MatchRequest, idToken: string) => {
  return cy.request({
    body: match,
    method: 'PUT',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const deleteMatch = (matchId: string, idToken: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const getMatch = (matchId: string, idToken: string) => {
  return cy.request({
    method: 'GET',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  });
};

export const getMatchList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/match/v1/matches',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false,
  });
};

export const validateMatch = (body: MatchResponse, matchId: string, match: MatchRequest) => {
  expect(body.matchId).to.equal(matchId);
  expect(body.group).to.equal(match.group);
  expect(body.startTime).to.equal(match.startTime);
};
