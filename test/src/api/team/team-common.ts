import { TeamRequest } from '@foci2020/shared/types/requests';
import { User } from '@foci2020/test/api/constants';
import { authenticate } from '@foci2020/test/api/auth/auth-common';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { TeamDocument } from '@foci2020/shared/types/documents';

export const createTeam = (team: TeamRequest) =>
  (idToken: string) => {
    return cy.request({
      body: team,
      method: 'POST',
      url: '/team/v1/teams',
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    });
  };

export const createTeam_ = (team: TeamRequest, user: User) => {
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

export const getTeam = (teamId: string) =>
  (idToken: string) => {
    return cy.request({
      method: 'GET',
      url: `/team/v1/teams/${teamId}`,
      headers: {
        Authorization: idToken
      },
      failOnStatusCode: false
    });
  };

export const getTeam_ = (teamId: string, user: User) => {
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

export const validateTeam = (team: TeamRequest) => ([teamId, document]: [string, TeamDocument]) => {
  expect(document.id).to.equal(teamId);
  expect(document.teamName).to.equal(team.teamName);
  expect(document.image).to.equal(team.image);
  expect(document.shortName).to.equal(team.shortName);
};

export const validateTeam_ = (body: TeamResponse | TeamDocument, teamId: string, team: TeamRequest) => {
  expect(body.id).to.equal(teamId);
  expect(body.teamName).to.equal(team.teamName);
  expect(body.image).to.equal(team.image);
  expect(body.shortName).to.equal(team.shortName);
};
