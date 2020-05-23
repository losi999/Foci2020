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

Given('I remove {string} property from {string}', (propertyName: string, alias: string) => {
  cy.get(`@${alias}`).then((obj: any) => {
    obj[propertyName] = undefined;
    return cy.wrap(obj);
  }).as(alias);
});

Given('I change {string} property value to {int} in {string}', (propertyName: string, propertyValue: number, alias: string) => {
  cy.get(`@${alias}`).then((obj: any) => {
    obj[propertyName] = propertyValue;
    return cy.wrap(obj);
  }).as(alias);
});

Given('I change {string} property value to {string} in {string}', (propertyName: string, propertyValue: number, alias: string) => {
  cy.get(`@${alias}`).then((obj: any) => {
    obj[propertyName] = propertyValue;
    return cy.wrap(obj);
  }).as(alias);
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

Then('It tells me that {string} property is missing from {string}', (propertyName: string, requestPart: string) => {
  cy.get<Cypress.Response>('@request').its('body').its(requestPart).should((data) => {
    expect(data).to.contain(propertyName).to.contain('required');
  });
});

Then('It tells me that {string} property is not {string} type in {string}', (propertyName: string, propertyType: string, requestPart: string) => {
  cy.get<Cypress.Response>('@request').its('body').its(requestPart).should((data) => {
    expect(data).to.contain(propertyName).to.contain(propertyType);
  });
});

Then('It tells me that {string} property is not {string} format in {string}', (propertyName: string, propertyformat: string, requestPart: string) => {
  cy.get<Cypress.Response>('@request').its('body').its(requestPart).should((data) => {
    expect(data).to.contain(propertyName).to.contain(propertyformat);
  });
});

Then('It tells me that {string} property is shorter than {int} characters in {string}', (propertyName: string, length: number, requestPart: string) => {
  cy.get<Cypress.Response>('@request').its('body').its(requestPart).should((data) => {
    expect(data).to.contain(propertyName).to.contain('shorter').to.contain(length);
  });
});

Then('It tells me that {string} property is longer than {int} characters in {string}', (propertyName: string, length: number, requestPart: string) => {
  cy.get<Cypress.Response>('@request').its('body').its(requestPart).should((data) => {
    expect(data).to.contain(propertyName).to.contain('longer').to.contain(length);
  });
});
