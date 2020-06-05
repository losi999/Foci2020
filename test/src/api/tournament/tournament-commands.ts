import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TournamentDocument } from '@foci2020/shared/types/documents';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { databaseService } from '@foci2020/test/api/dependencies';
import { CommandFunction, CommandFunctionWithPreviousSubject } from '@foci2020/test/api/types';

const requestCreateTournament = (idToken: string, tournament: TournamentRequest) => {
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

const requestUpdateTournament = (idToken: string, tournamentId: string, tournament: TournamentRequest) => {
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

const requestDeleteTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'DELETE',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: `/tournament/v1/tournaments/${tournamentId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetTournamentList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/tournament/v1/tournaments',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const saveTournamentDocument = (document: TournamentDocument): void => {
  cy.log('Save tournament document', document).wrap(databaseService.saveTournament(document), { log: false });
};

const validateTournamentDocument = (response: TournamentResponse, request: TournamentRequest, tournamentId?: string) => {
  const id = response?.tournamentId ?? tournamentId;
  cy.log('Get tournament document', id)
    .wrap(databaseService.getTournamentById(id))
    .should((document: TournamentDocument) => {
      expect(document.id).to.equal(id);
      expect(document.tournamentName).to.equal(request.tournamentName);
    });
};

const validateTournamentResponse = (response: TournamentResponse, document: TournamentDocument) => {
  expect(response.tournamentId).to.equal(document.id);
  expect(response.tournamentName).to.equal(document.tournamentName);
};

const validateTournamentDeleted = (tournamentId: string) => {
  cy.log('Get tournament document', tournamentId)
    .wrap(databaseService.getTournamentById(tournamentId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};

export const setTournamentCommands = () => {
  Cypress.Commands.add('requestCreateTournament', { prevSubject: true }, requestCreateTournament);
  Cypress.Commands.add('requestUpdateTournament', { prevSubject: true }, requestUpdateTournament);
  Cypress.Commands.add('requestDeleteTournament', { prevSubject: true }, requestDeleteTournament);
  Cypress.Commands.add('requestGetTournament', { prevSubject: true }, requestGetTournament);
  Cypress.Commands.add('requestGetTournamentList', { prevSubject: true }, requestGetTournamentList);

  Cypress.Commands.add('saveTournamentDocument', saveTournamentDocument);

  Cypress.Commands.add('validateTournamentDocument', { prevSubject: true }, validateTournamentDocument);
  Cypress.Commands.add('validateTournamentResponse', { prevSubject: true }, validateTournamentResponse);
  Cypress.Commands.add('validateTournamentDeleted', validateTournamentDeleted);
};

declare global {
  namespace Cypress {
    interface Chainable {
      saveTournamentDocument: CommandFunction<typeof saveTournamentDocument>;
      validateTournamentDeleted: CommandFunction<typeof validateTournamentDeleted>;
    }

    interface ChainableRequest extends Chainable {
      requestGetTournament: CommandFunctionWithPreviousSubject<typeof requestGetTournament>;
      requestCreateTournament: CommandFunctionWithPreviousSubject<typeof requestCreateTournament>;
      requestUpdateTournament: CommandFunctionWithPreviousSubject<typeof requestUpdateTournament>;
      requestDeleteTournament: CommandFunctionWithPreviousSubject<typeof requestDeleteTournament>;
      requestGetTournamentList: CommandFunctionWithPreviousSubject<typeof requestGetTournamentList>;
    }

    interface ChainableResponseBody extends Chainable {
      validateTournamentDocument: CommandFunctionWithPreviousSubject<typeof validateTournamentDocument>;
      validateTournamentResponse: CommandFunctionWithPreviousSubject<typeof validateTournamentResponse>;
    }
  }
}
