import { User, usernames } from '@foci2020/test/api/constants';
import { LoginRequest } from '@foci2020/shared/types/requests';
import { CommandFunction } from '@foci2020/test/api/types';

const unauthenticate = () => {
  return undefined as Cypress.ChainableRequest;
};

const authenticate = (user: User) => {
  const body: LoginRequest = {
    email: usernames[user],
    password: Cypress.env('PASSWORD'),
  };
  return cy.log(`Logging in as ${user}`).request({
    body,
    method: 'POST',
    url: 'user/v1/login',
    failOnStatusCode: false,
  })
    .its('body')
    .its('idToken') as Cypress.ChainableRequest;
};

export const setAuthCommands = () => {
  Cypress.Commands.add('authenticate', authenticate);
  Cypress.Commands.add('unauthenticate', unauthenticate);
};

declare global {
  namespace Cypress {
    interface Chainable {
      authenticate: CommandFunction<typeof authenticate>;
      unauthenticate: CommandFunction<typeof unauthenticate>;
    }
  }
}
