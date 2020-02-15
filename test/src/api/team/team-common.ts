import { TeamRequest, TeamResponse } from 'api/shared/types/types';
import { User } from '../constants';

export const createTeam = (team: TeamRequest, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      body: team,
      method: 'POST',
      url: '/team/v1/teams',
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const updateTeam = (teamId: string, team: TeamRequest, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      body: team,
      method: 'PUT',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const deleteTeam = (teamId: string, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      method: 'DELETE',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const getTeam = (teamId: string, user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      method: 'GET',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const getTeamList = (user: User) => {
  return cy.getCookie(user)
    .then(cookie => cy.request({
      method: 'GET',
      url: '/team/v1/teams',
      headers: {
        Authorization: cookie.value
      },
      failOnStatusCode: false
    }));
};

export const validateTeam = (body: TeamResponse, teamId: string, team: TeamRequest) => {
  expect(body.teamId).to.equal(teamId);
  expect(body.teamName).to.equal(team.teamName);
  expect(body.image).to.equal(team.image);
  expect(body.shortName).to.equal(team.shortName);
};
