import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps';
import { createTournament, getTournament, validateTournament, deleteTournament, getTournamentList, updateTournament } from '../tournament/tournament-common';
import { TournamentResponse, TournamentRequest } from 'api/types/types';
import { authenticate } from '../auth/auth-common';

Given('There is a tournament already created', () => {
  authenticate('admin1').then((idToken) => {
    return createTournament({
      tournamentName: 'VB 2022'
    }, idToken);
  }).its('body').its('tournamentId').as('tournamentId');
});

Given('I have a tournament request prepared', () => {
  cy.wrap<TournamentRequest>({
    tournamentName: 'EB 2020'
  }).as('tournament');
});

When('I request a tournament by tournamentId', () => {
  cy.getAll('@tournamentId', '@idToken').spread((tournamentId: string, idToken: string) => {
    return getTournament(tournamentId, idToken);
  }).as('request');
});

When('I create a tournament', () => {
  cy.getAll('@tournament', '@idToken').spread((tournament: TournamentRequest, idToken: string) => {
    return createTournament(tournament, idToken);
  }).as('request');
});

When('I delete a tournament', () => {
  cy.getAll('@tournamentId', '@idToken').spread((tournamentId: string, idToken: string) => {
    return deleteTournament(tournamentId, idToken);
  }).as('request');
});

When('I list tournaments', () => {
  cy.get<string>('@idToken').then((idToken) => {
    return getTournamentList(idToken);
  }).as('request');
});

When('I update a tournament', () => {
  cy.getAll('@tournamentId', '@idToken', '@tournament').spread((tournamentId: string, idToken: string, tournament: TournamentRequest) => {
    return updateTournament(tournamentId, tournament, idToken);
  }).as('request');
});

Then('It returns created tournament id', () => {
  cy.get<Cypress.Response>('@request').its('body').its('tournamentId').as('tournamentId');
});

Then('Saved tournament is the same that I sent', () => {
  cy.getAll('@tournamentId', '@tournament', '@idToken').spread((tournamentId: string, tournament: TournamentRequest, idToken: string) => {
    getTournament(tournamentId, idToken).its('body').should((body: TournamentResponse) => {
      validateTournament(body, tournamentId, tournament);
    });
  });
});

Then('It returns a valid tournament', () => {
  cy.get<Cypress.Response>('@request').its('body').should((tournament: TournamentResponse) => {
    expect(tournament).not.to.be.undefined;
    // TODO schema validation
  });
});

Then('It returns a valid list of tournaments', () => {
  cy.get<Cypress.Response>('@request').its('body').should((tournaments: TournamentResponse[]) => {
    expect(tournaments).not.to.be.undefined;
    // TODO schema validation
  });
});
