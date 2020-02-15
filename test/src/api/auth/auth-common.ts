import { LoginRequest, LoginResponse } from 'api/shared/types/types';
import { User, usernames } from '../constants';

export const authenticate = (user: User) => {
  const body: LoginRequest = {
    email: usernames[user],
    password: Cypress.env('PASSWORD')
  };
  return cy.request({
    body,
    method: 'POST',
    url: 'user/v1/login',
    failOnStatusCode: false
  }).its('body')
    .then((response: LoginResponse) => {
      cy.setCookie(user, response.idToken);
    });
};
