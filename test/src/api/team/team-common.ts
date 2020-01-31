import { TeamRequest } from 'api/types/requests';
import { TeamResponse } from 'api/types/responses';

export const createTeam = (team: TeamRequest) => {
  return cy.request({
    body: team,
    method: 'POST',
    url: '/team/v1/teams',
    failOnStatusCode: false
  });
};

export const updateTeam = (teamId: string, team: TeamRequest) => {
  return cy.request({
    body: team,
    method: 'PUT',
    url: `/team/v1/teams/${teamId}`,
    failOnStatusCode: false
  });
};

export const deleteTeam = (teamId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/team/v1/teams/${teamId}`,
    failOnStatusCode: false
  });
};

export const getTeam = (teamId: string) => {
  return cy.request({
    method: 'GET',
    url: `/team/v1/teams/${teamId}`,
    failOnStatusCode: false
  });
};

export const getTeamList = () => {
  return cy.request({
    method: 'GET',
    url: '/team/v1/teams',
    failOnStatusCode: false
  });
};

export const validateTeam = (body: TeamResponse, teamId: string, team: TeamRequest) => {
  expect(body.teamId).to.equal(teamId);
  expect(body.teamName).to.equal(team.teamName);
  expect(body.image).to.equal(team.image);
  expect(body.shortName).to.equal(team.shortName);
};
