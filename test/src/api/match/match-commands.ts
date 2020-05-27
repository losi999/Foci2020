import { DynamoDB } from 'aws-sdk';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { MatchDocument, TeamDocument, TournamentDocument } from '@foci2020/shared/types/documents';
import { MatchResponse } from '@foci2020/shared/types/responses';

const documentClient = new DynamoDB.DocumentClient({
  region: Cypress.env('AWS_DEFAULT_REGION'),
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
});

const databaseService = databaseServiceFactory(Cypress.env('DYNAMO_TABLE'), documentClient);

export const requestCreateMatch = (idToken: string, match: MatchRequest) => {
  return cy.request({
    body: match,
    method: 'POST',
    url: '/match/v1/matches',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestUpdateMatch = (idToken: string, matchId: string, match: MatchRequest) => {
  return cy.request({
    body: match,
    method: 'PUT',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestDeleteMatch = (idToken: string, matchId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestGetMatch = (idToken: string, matchId: string) => {
  return cy.request({
    method: 'GET',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const requestGetMatchList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/match/v1/matches',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

export const saveMatchDocument = (document: MatchDocument): void => {
  cy.log('Save match document', document).wrap(databaseService.saveMatch(document), { log: false });
};

export const expectMatchResponse = (body: MatchResponse) => {
  return cy.log('TODO schema validation').wrap(body) as Cypress.ChainableResponseBody;
};

export const validateMatchDocument = (response: MatchResponse, request: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument, matchId?: string) => {
  const id = response?.matchId ?? matchId;
  cy.log('Get match document', id)
    .wrap(databaseService.getMatchById(id))
    .should((document: MatchDocument) => {
      expect(document.id).to.equal(id);
      expect(document.group).to.equal(request.group);
      expect(document.startTime).to.equal(request.startTime);
      expect(document.homeTeam.id).to.equal(homeTeam.id);
      expect(document.homeTeam.teamName).to.equal(homeTeam.teamName);
      expect(document.homeTeam.image).to.equal(homeTeam.image);
      expect(document.homeTeam.shortName).to.equal(homeTeam.shortName);
      expect(document.awayTeam.id).to.equal(awayTeam.id);
      expect(document.awayTeam.teamName).to.equal(awayTeam.teamName);
      expect(document.awayTeam.image).to.equal(awayTeam.image);
      expect(document.awayTeam.shortName).to.equal(awayTeam.shortName);
      expect(document.tournament.id).to.equal(tournament.id);
      expect(document.tournament.tournamentName).to.equal(tournament.tournamentName);
    });
};

export const validateMatchResponse = (response: MatchResponse, document: MatchDocument) => {
  expect(response.matchId).to.equal(document.id);
  expect(response.group).to.equal(document.group);
  expect(response.startTime).to.equal(document.startTime);
};

export const validateMatchDeleted = (matchId: string) => {
  cy.log('Get match document', matchId)
    .wrap(databaseService.getMatchById(matchId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};
