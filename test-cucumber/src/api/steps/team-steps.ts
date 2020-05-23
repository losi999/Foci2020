import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps';
import { createTeam, getTeam, validateTeam, deleteTeam, getTeamList, updateTeam } from '../team/team-common';
import { TeamResponse, TeamRequest } from 'api/types/types';
import { authenticate } from '../auth/auth-common';

Given('There is a team already created', () => {
  authenticate('admin1').then((idToken) => {
    return createTeam({
      teamName: 'Anglia',
      shortName: 'ENG',
      image: 'http://image.com/eng.png'
    }, idToken);
  }).its('body').its('teamId').as('teamId');
});

Given('I have a team request prepared', () => {
  cy.wrap<TeamRequest>({
    teamName: 'Magyarország',
    shortName: 'HUN',
    image: 'http://image.com/hun.png'
  }).as('team');
});

When('I request a team by teamId', () => {
  cy.getAll('@teamId', '@idToken').spread((teamId: string, idToken: string) => {
    return getTeam(teamId, idToken);
  }).as('request');
});

When('I create a team', () => {
  cy.getAll('@team', '@idToken').spread((team: TeamRequest, idToken: string) => {
    return createTeam(team, idToken);
  }).as('request');
});

When('I delete a team', () => {
  cy.getAll('@teamId', '@idToken').spread((teamId: string, idToken: string) => {
    return deleteTeam(teamId, idToken);
  }).as('request');
});

When('I list teams', () => {
  cy.get<string>('@idToken').then((idToken) => {
    return getTeamList(idToken);
  }).as('request');
});

When('I update a team', () => {
  cy.getAll('@teamId', '@idToken', '@team').spread((teamId: string, idToken: string, team: TeamRequest) => {
    return updateTeam(teamId, team, idToken);
  }).as('request');
});

Then('It returns created team id', () => {
  cy.get<Cypress.Response>('@request').its('body').its('teamId').as('teamId');
});

Then('Saved team is the same that I sent', () => {
  cy.getAll('@teamId', '@team', '@idToken').spread((teamId: string, team: TeamRequest, idToken: string) => {
    getTeam(teamId, idToken).its('body').should((body: TeamResponse) => {
      validateTeam(body, teamId, team);
    });
  });
});

Then('It returns a valid team', () => {
  cy.get<Cypress.Response>('@request').its('body').should((team: TeamResponse) => {
    expect(team).not.to.be.undefined;
    // TODO schema validation
  });
});

Then('It returns a valid list of teams', () => {
  cy.get<Cypress.Response>('@request').its('body').should((teams: TeamResponse[]) => {
    expect(teams).not.to.be.undefined;
    // TODO schema validation
  });
});
