import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { User } from 'src/api/constants';
import { authenticate } from '../auth/auth-common';
import uuid from 'uuid';

Given('I do not authenticate', () => {
  cy.wrap(undefined).as('idToken');
});

Given('I log in as {string}', (user: User) => {
  authenticate(user).as('idToken');
});

// TODO restrict parameter
Given('I set {string} to a random UUID', (id: string) => {
  cy.wrap(uuid()).as(id);
});

// TODO restrict parameter
Given('I set {string} to a non-UUID value', (id: string) => {
  cy.wrap(`${uuid()}-not-uuid`).as(id);
});

Then('It returns ok response', () => {
  cy.get<Cypress.Response>('@request').its('status').should((status) => {
    expect(status).to.equal(200);
  });
});

Then('It returns unauthorized error', () => {
  cy.get<Cypress.Response>('@request').its('status').should((status) => {
    expect(status).to.equal(401);
  });
});

Then('It returns forbidden error', () => {
  cy.get<Cypress.Response>('@request').its('status').should((status) => {
    expect(status).to.equal(403);
  });
});

Then('It returns bad request error', () => {
  cy.get<Cypress.Response>('@request').its('status').should((status) => {
    expect(status).to.equal(400);
  });
});

Then('It returns not found error', () => {
  cy.get<Cypress.Response>('@request').its('status').should((status) => {
    expect(status).to.equal(404);
  });
});
