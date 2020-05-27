import { DynamoDB } from 'aws-sdk';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TournamentDocument } from '@foci2020/shared/types/documents';
import { TournamentResponse } from '@foci2020/shared/types/responses';

const documentClient = new DynamoDB.DocumentClient({
  region: Cypress.env('AWS_DEFAULT_REGION'),
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
});

const databaseService = databaseServiceFactory(Cypress.env('DYNAMO_TABLE'), documentClient);

export const requestCreateTournament = (idToken: string, tournament: TournamentRequest) => {
  return cy.request({
    body: tournament,
    method: 'POST',
    url: '/tournament/v1/tournaments',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestUpdateTournament = (idToken: string, tournamentId: string, tournament: TournamentRequest) => {
  return cy.request({
    body: tournament,
    method: 'PUT',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestDeleteTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestGetTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestGetTournamentList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/tournament/v1/tournaments',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const saveTournamentDocument = (document: TournamentDocument): void => {
  cy.log('Save tournament document', document).wrap(databaseService.saveTournament(document), { log: false });
};

export const expectTournamentResponse = (body: TournamentResponse) => {
  return cy.log('TODO schema validation').wrap(body) as Cypress.ChainableResponseBody;
};

export const validateTournamentDocument = (response: TournamentResponse, request: TournamentRequest, tournamentId?: string) => {
  const id = response?.tournamentId ?? tournamentId;
  cy.log('Get tournament document', id)
    .wrap(databaseService.getTournamentById(id))
    .should((document: TournamentDocument) => {
      expect(document.id).to.equal(id);
      expect(document.tournamentName).to.equal(request.tournamentName);
    });
};

export const validateTournamentResponse = (response: TournamentResponse, document: TournamentDocument) => {
  expect(response.tournamentId).to.equal(document.id);
  expect(response.tournamentName).to.equal(document.tournamentName);
};

export const validateTournamentDeleted = (tournamentId: string) => {
  cy.log('Get tournament document', tournamentId)
    .wrap(databaseService.getTournamentById(tournamentId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};
