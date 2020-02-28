import { TeamRequest, TeamResponse } from 'api/shared/types/types';
import { User } from '../constants';
import { authenticate } from '../auth/auth-common';

export const createTeam = (team: TeamRequest, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      body: team,
      method: 'POST',
      url: '/team/v1/teams',
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const updateTeam = (teamId: string, team: TeamRequest, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      body: team,
      method: 'PUT',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const deleteTeam = (teamId: string, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'DELETE',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const getTeam = (teamId: string, user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'GET',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    }));
};

export const getTeamList = (user: User) => {
  return authenticate(user)
    .then(idToken => cy.request({
      method: 'GET',
      url: '/team/v1/teams',
      headers: {
        Authorization: idToken
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
