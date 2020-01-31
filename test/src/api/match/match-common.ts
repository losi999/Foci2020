import { MatchRequest } from 'api/types/requests';
import { MatchResponse } from 'api/types/responses';

export const createMatch = (match: MatchRequest) => {
  return cy.request({
    body: match,
    method: 'POST',
    url: '/match/v1/matches',
    failOnStatusCode: false
  });
};

export const updateMatch = (matchId: string, match: MatchRequest) => {
  return cy.request({
    body: match,
    method: 'PUT',
    url: `/match/v1/matches/${matchId}`,
    failOnStatusCode: false
  });
};

export const deleteMatch = (matchId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/match/v1/matches/${matchId}`,
    failOnStatusCode: false
  });
};

export const getMatch = (matchId: string) => {
  return cy.request({
    method: 'GET',
    url: `/match/v1/matches/${matchId}`,
    failOnStatusCode: false
  });
};

export const getMatchList = (tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: '/match/v1/matches',
    failOnStatusCode: false,
    qs: {
      tournamentId
    }
  });
};

export const validateMatch = (body: MatchResponse, matchId: string, match: MatchRequest) => {
  expect(body.matchId).to.equal(matchId);
  expect(body.group).to.equal(match.group);
  expect(body.startTime).to.equal(match.startTime);
};
