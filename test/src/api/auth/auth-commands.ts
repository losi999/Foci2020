import { User, usernames } from '@foci2020/test/api/constants';
import { LoginRequest } from '@foci2020/shared/types/requests';

export const unauthenticate = () => {
  return undefined as Cypress.ChainableRequest;
};

export const authenticate = (user: User) => {
  const body: LoginRequest = {
    email: usernames[user],
    password: Cypress.env('PASSWORD')
  };
  return cy.log(`Logging in as ${user}`).request({
    body,
    method: 'POST',
    url: 'user/v1/login',
    failOnStatusCode: false
  }).its('body').its('idToken') as Cypress.ChainableRequest;
};
