import { DynamoDB } from 'aws-sdk';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';
import { TeamRequest, LoginRequest } from '@foci2020/shared/types/requests';
import { User, usernames } from '@foci2020/test/api/constants';

declare global {
  namespace Cypress {
    interface Chainable {
      getAs<T>(alias: string): Chainable<T>;
      getAs(...aliases: string[]): Chainable<any[]>;
      getTeam(): Chainable<[string, TeamDocument]>;
      requestCreateTeam(team: TeamRequest): Chainable<Response>;
      getTeamDocument(): Chainable<[string, TeamDocument]>;
      expectOkResponse(): Chainable<Response>;
      expectTeamIdResponse(): Chainable<string>;
      validateTeam(request: TeamRequest): Chainable<void>;
      authenticate(user: User): Chainable<string>;
    }
  }
}

const documentClient = new DynamoDB.DocumentClient({
  region: Cypress.env('AWS_DEFAULT_REGION'),
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
});

const databaseService = databaseServiceFactory(Cypress.env('DYNAMO_TABLE'), documentClient);

const authenticate = (user: User) => {
  const body: LoginRequest = {
    email: usernames[user],
    password: Cypress.env('PASSWORD')
  };
  return cy.log(`Logging in as ${user}`).request({
    body,
    method: 'POST',
    url: 'user/v1/login',
    failOnStatusCode: false
  }).its('body').its('idToken');
};

const requestCreateTeam = (idToken: string, team: TeamRequest) => {
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

const getTeamDocument = async (teamId: string): Promise<[string, TeamDocument]> => {
  const document = await databaseService.getTeamById(teamId);
  return [teamId, document];
};

const expectOkResponse = (response: Cypress.Response): Cypress.Response => {
  expect(response.status).to.equal(200);
  return response;
};

const expectTeamIdResponse = (response: Cypress.Response): string => {
  // check if uuid
  expect(response.body.teamId).not.to.be.undefined;
  return response.body.teamId;
};

const validateTeam = ([teamId, document]: [string, TeamDocument], request: TeamRequest) => {
  expect(document.id).to.equal(teamId);
  expect(document.teamName).to.equal(request.teamName);
  expect(document.image).to.equal(request.image);
  expect(document.shortName).to.equal(request.shortName);
};

export const getTeam = async (teamId: string): Promise<[string, TeamDocument]> => {
  const document = await databaseService.getTeamById(teamId);
  return [teamId, document];
};

export const getTournament = (tournamentId: string): Promise<TournamentDocument> => databaseService.getTournamentById(tournamentId);
export const getMatch = (matchId: string): Promise<MatchDocument> => databaseService.getMatchById(matchId);

export const getAs = (...aliases: string[]): any => {
  if (aliases.length === 1) {
    const alias = aliases[0];
    return cy.get(alias.startsWith('@') ? alias : `@${alias}`);
  }
  const promise = cy.wrap([], { log: false });

  for (const alias of aliases) {
    promise.then((arr) => {
      return cy.get(alias.startsWith('@') ? alias : `@${alias}`).then((got) => {
        return cy.wrap([...arr, got], { log: false });
      });
    });
  }

  return promise;
};

Cypress.Commands.add('getAs', getAs);
Cypress.Commands.add('getTeam', { prevSubject: true }, getTeam);

Cypress.Commands.add('authenticate', authenticate);
Cypress.Commands.add('requestCreateTeam', { prevSubject: true }, requestCreateTeam);
Cypress.Commands.add('getTeamDocument', { prevSubject: true }, getTeamDocument);
Cypress.Commands.add('expectOkResponse', { prevSubject: true }, expectOkResponse);
Cypress.Commands.add('expectTeamIdResponse', { prevSubject: true }, expectTeamIdResponse);
Cypress.Commands.add('validateTeam', { prevSubject: true }, validateTeam);
