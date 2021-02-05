import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { CommandFunction, CommandFunctionWithPreviousSubject } from '@foci2020/test/api/types';
import { headerExpiresIn } from '@foci2020/shared/constants';
import { TeamIdType } from '@foci2020/shared/types/common';
import { databaseService } from '@foci2020/test/api/dependencies';

const requestCreateTeam = (idToken: string, team: TeamRequest) => {
  return cy.request({
    body: team,
    method: 'POST',
    url: '/team/v1/teams',
    headers: {
      Authorization: idToken,
      [headerExpiresIn]: Cypress.env('EXPIRES_IN')
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestUpdateTeam = (idToken: string, teamId: TeamIdType, team: TeamRequest) => {
  return cy.request({
    body: team,
    method: 'PUT',
    url: `/team/v1/teams/${teamId}`,
    headers: {
      Authorization: idToken,
      [headerExpiresIn]: Cypress.env('EXPIRES_IN')
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestDeleteTeam = (idToken: string, teamId: TeamIdType) => {
  return cy.request({
    method: 'DELETE',
    url: `/team/v1/teams/${teamId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetTeam = (idToken: string, teamId: TeamIdType) => {
  return cy.request({
    method: 'GET',
    url: `/team/v1/teams/${teamId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetTeamList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/team/v1/teams',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const saveTeamDocument = (document: TeamDocument): void => {
  cy.log('Save team document', document).wrap(databaseService.saveTeam(document), { log: false });
};

const validateTeamDocument = (response: TeamResponse, request: TeamRequest, teamId?: string) => {
  const id = response?.teamId ?? teamId as TeamIdType;
  cy.log('Get team document', id)
    .wrap(databaseService.getTeamById(id))
    .should((document: TeamDocument) => {
      expect(document.id).to.equal(id);
      expect(document.teamName).to.equal(request.teamName);
      expect(document.image).to.equal(request.image);
      expect(document.shortName).to.equal(request.shortName);
    });
};

const validateTeamResponse = (response: TeamResponse, document: TeamDocument) => {
  expect(response.teamId).to.equal(document.id);
  expect(response.teamName).to.equal(document.teamName);
  expect(response.image).to.equal(document.image);
  expect(response.shortName).to.equal(document.shortName);
};

const validateTeamDeleted = (teamId: TeamIdType) => {
  cy.log('Get team document', teamId)
    .wrap(databaseService.getTeamById(teamId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};

export const setTeamCommands = () => {
  Cypress.Commands.add('requestCreateTeam', { prevSubject: true }, requestCreateTeam);
  Cypress.Commands.add('requestUpdateTeam', { prevSubject: true }, requestUpdateTeam);
  Cypress.Commands.add('requestDeleteTeam', { prevSubject: true }, requestDeleteTeam);
  Cypress.Commands.add('requestGetTeam', { prevSubject: true }, requestGetTeam);
  Cypress.Commands.add('requestGetTeamList', { prevSubject: true }, requestGetTeamList);

  Cypress.Commands.add('saveTeamDocument', saveTeamDocument);

  Cypress.Commands.add('validateTeamDocument', { prevSubject: true }, validateTeamDocument);
  Cypress.Commands.add('validateTeamResponse', { prevSubject: true }, validateTeamResponse);
  Cypress.Commands.add('validateTeamDeleted', validateTeamDeleted);
};

declare global {
  namespace Cypress {
    interface Chainable {
      saveTeamDocument: CommandFunction<typeof saveTeamDocument>;
      validateTeamDeleted: CommandFunction<typeof validateTeamDeleted>;
    }

    interface ChainableRequest extends Chainable {
      requestGetTeam: CommandFunctionWithPreviousSubject<typeof requestGetTeam>;
      requestCreateTeam: CommandFunctionWithPreviousSubject<typeof requestCreateTeam>;
      requestUpdateTeam: CommandFunctionWithPreviousSubject<typeof requestUpdateTeam>;
      requestDeleteTeam: CommandFunctionWithPreviousSubject<typeof requestDeleteTeam>;
      requestGetTeamList: CommandFunctionWithPreviousSubject<typeof requestGetTeamList>;
    }

    interface ChainableResponseBody extends Chainable {
      validateTeamDocument: CommandFunctionWithPreviousSubject<typeof validateTeamDocument>;
      validateTeamResponse: CommandFunctionWithPreviousSubject<typeof validateTeamResponse>;
    }
  }
}
