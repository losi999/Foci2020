import { LoginRequest } from 'api/types/types';
import { User, usernames } from '../constants';

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
  }).its('body').its('idToken');
};
