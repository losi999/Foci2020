import { DynamoDB } from 'aws-sdk';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { TeamResponse } from '@foci2020/shared/types/responses';

const documentClient = new DynamoDB.DocumentClient({
  region: Cypress.env('AWS_DEFAULT_REGION'),
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
});

const databaseService = databaseServiceFactory(Cypress.env('DYNAMO_TABLE'), documentClient);

export const requestCreateTeam = (idToken: string, team: TeamRequest) => {
  return cy.request({
    body: team,
    method: 'POST',
    url: '/team/v1/teams',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestUpdateTeam = (idToken: string, teamId: string, team: TeamRequest) => {
  return cy.request({
    body: team,
    method: 'PUT',
    url: `/team/v1/teams/${teamId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestDeleteTeam = (idToken: string, teamId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/team/v1/teams/${teamId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestGetTeam = (idToken: string, teamId: string) => {
  return cy.request({
    method: 'GET',
    url: `/team/v1/teams/${teamId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestGetTeamList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/team/v1/teams',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const saveTeamDocument = (document: TeamDocument): void => {
  cy.log('Save team document', document).wrap(databaseService.saveTeam(document), { log: false });
};

export const expectTeamResponse = (body: TeamResponse) => {
  return cy.log('TODO schema validation').wrap(body) as Cypress.ChainableResponseBody;
};

export const validateTeamDocument = (response: TeamResponse, request: TeamRequest, teamId?: string) => {
  const id = response?.teamId ?? teamId;
  cy.log('Get team document', id)
    .wrap(databaseService.getTeamById(id))
    .should((document: TeamDocument) => {
      expect(document.id).to.equal(id);
      expect(document.teamName).to.equal(request.teamName);
      expect(document.image).to.equal(request.image);
      expect(document.shortName).to.equal(request.shortName);
    });
};

export const validateTeamResponse = (response: TeamResponse, document: TeamDocument) => {
  expect(response.teamId).to.equal(document.id);
  expect(response.teamName).to.equal(document.teamName);
  expect(response.image).to.equal(document.image);
  expect(response.shortName).to.equal(document.shortName);
};

export const validateTeamDeleted = (teamId: string) => {
  cy.log('Get team document', teamId)
    .wrap(databaseService.getTeamById(teamId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};
