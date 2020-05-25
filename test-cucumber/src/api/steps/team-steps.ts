import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps';
import { createTeam, getTeam, validateTeam, deleteTeam, getTeamList, updateTeam } from '../team/team-common';
import { TeamResponse, TeamRequest } from 'api/types/types';
import { authenticate } from '../auth/auth-common';
import { idTokenAlias, requestAlias, existing, toSend } from '../constants';

const existingTeam = `${existing}team`;
const existingTeamId = `${existingTeam}Id`;
const teamToSend = `team${toSend}`;
const teamToSendId = `${teamToSend}Id`;

const createExistingTeamAs = (aliasName?: string) => {
  const alias = aliasName ?? existingTeam;

  const team: TeamRequest = {
    teamName: 'Anglia',
    shortName: 'ENG',
    image: 'http://image.com/eng.png'
  };
  cy.wrap(team).as(alias);
  authenticate('admin1').then((idToken) => {
    return createTeam(team, idToken);
  }).its('body').its('teamId').as(`${alias}Id`);
};

Given('There is a team already created as {string}', createExistingTeamAs);
Given('There is a team already created', createExistingTeamAs);

Given('I have a team request prepared', () => {
  cy.wrap<TeamRequest>({
    teamName: 'Magyarország',
    shortName: 'HUN',
    image: 'http://image.com/hun.png'
  }).as(teamToSend);
});

When('I request a team by teamId', () => {
  cy.getAs(existingTeamId, idTokenAlias).spread((teamId: string, idToken: string) => {
    return getTeam(teamId, idToken);
  }).as(requestAlias);
});

When('I create a team', () => {
  cy.getAs(teamToSend, idTokenAlias).spread((team: TeamRequest, idToken: string) => {
    return createTeam(team, idToken);
  }).as(requestAlias);
});

When('I delete a team', () => {
  cy.getAs(existingTeamId, idTokenAlias).spread((teamId: string, idToken: string) => {
    return deleteTeam(teamId, idToken);
  }).as(requestAlias);
});

When('I list teams', () => {
  cy.getAs<string>(idTokenAlias).then((idToken) => {
    return getTeamList(idToken);
  }).as(requestAlias);
});

When('I update a team', () => {
  cy.getAs(existingTeamId, idTokenAlias, teamToSend).spread((teamId: string, idToken: string, team: TeamRequest) => {
    return updateTeam(teamId, team, idToken);
  }).as(requestAlias);
});

Then('It returns created team id', () => {
  cy.getAs<Cypress.Response>(requestAlias).its('body').its('teamId').as(teamToSendId);
});

Then('Saved team is the same that I sent', () => {
  cy.getAs(teamToSendId, teamToSend, idTokenAlias).spread((teamId: string, team: TeamRequest, idToken: string) => {
    getTeam(teamId, idToken).its('body').should((body: TeamResponse) => {
      validateTeam(body, teamId, team);
    });
  });
});

Then('It returns a valid team', () => {
  cy.getAs<Cypress.Response>(requestAlias).its('body').should((team: TeamResponse) => {
    expect(team).not.to.be.undefined;
    // TODO schema validation
  });
});

Then('It returns a valid list of teams', () => {
  cy.getAs<Cypress.Response>(requestAlias).its('body').should((teams: TeamResponse[]) => {
    expect(teams).not.to.be.undefined;
    // TODO schema validation
  });
});
