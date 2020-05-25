import { When, Then, Given } from 'cypress-cucumber-preprocessor/steps';
import { createMatch, getMatch, validateMatch, deleteMatch, getMatchList, updateMatch } from '../match/match-common';
import { MatchResponse, MatchRequest, TeamRequest, TournamentRequest } from 'api/types/types';
import { authenticate } from '../auth/auth-common';
import uuid from 'uuid';
import { addMinutes } from 'api/common';
import { createTeam, validateTeam } from '../team/team-common';
import { createTournament, validateTournament } from '../tournament/tournament-common';

Given('Id set', () => {
  cy.wrap(undefined).as('homeTeamId');
  cy.wrap(undefined).as('awayTeamId');
  cy.wrap(undefined).as('tournamentId');
});

// Given('There is a match already created', () => {
//   authenticate('admin1').then((idToken) => {
//     return createMatch({
//       homeTeamId: uuid(),
//       awayTeamId: uuid(),
//       tournamentId: uuid(),
//       group: 'A csoport',
//       startTime: addMinutes(10).toISOString()
//     }, idToken);
//   }).its('body').its('matchId').as('matchId');
// });

// Given('There is a home team, away team and tournament already created', () => {
//   cy.wrap<TeamRequest>({
//     teamName: 'Magyarország',
//     shortName: 'HUN'
//   }).as('homeTeam');
//   cy.wrap<TeamRequest>({
//     teamName: 'Anglia',
//     shortName: 'ENG'
//   }).as('awayTeam');
//   cy.wrap<TournamentRequest>({
//     tournamentName: 'EB 2020',
//   }).as('tournament');
//   authenticate('admin1').as('idToken');
//   cy.getAll('@homeTeam', '@awayTeam', '@tournament', '@idToken').spread((homeTeam: TeamRequest, awayTeam: TeamRequest, tournament: TournamentRequest, idToken: string) => {
//     createTeam(homeTeam, idToken).its('body').its('teamId').as('homeTeamId');
//     createTeam(awayTeam, idToken).its('body').its('teamId').as('awayTeamId');
//     createTournament(tournament, idToken).its('body').its('tournamentId').as('tournamentId');
//   });
// });

Given('I have a match request prepared', () => {
  cy.getAs('@homeTeamId', '@awayTeamId', '@tournamentId').spread((homeTeamId: string, awayTeamId: string, tournamentId: string) => {
    return cy.wrap<MatchRequest>({
      homeTeamId: homeTeamId ?? uuid(),
      awayTeamId: awayTeamId ?? uuid(),
      tournamentId: tournamentId ?? uuid(),
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    });
  }).as('match');
});

When('I request a match by matchId', () => {
  cy.getAs('@matchId', '@idToken').spread((matchId: string, idToken: string) => {
    return getMatch(matchId, idToken);
  }).as('request');
});

When('I create a match', () => {
  cy.getAs('@match', '@idToken').spread((match: MatchRequest, idToken: string) => {
    return createMatch(match, idToken);
  }).as('request');
});

When('I delete a match', () => {
  cy.getAs('@matchId', '@idToken').spread((matchId: string, idToken: string) => {
    return deleteMatch(matchId, idToken);
  }).as('request');
});

When('I list matchs', () => {
  cy.get<string>('@idToken').then((idToken) => {
    return getMatchList(idToken);
  }).as('request');
});

When('I update a match', () => {
  cy.getAs('@matchId', '@idToken', '@match').spread((matchId: string, idToken: string, match: MatchRequest) => {
    return updateMatch(matchId, match, idToken);
  }).as('request');
});

Then('It returns created match id', () => {
  cy.get<Cypress.Response>('@request').its('body').its('matchId').as('matchId');
});

Then('Saved match is the same that I sent', () => {
  cy.getAs('@matchId', '@match', '@idToken')
    .spread((
      matchId: string,
      match: MatchRequest,
      idToken: string) => {
      getMatch(matchId, idToken).its('body').should((body: MatchResponse) => {
        validateMatch(body, matchId, match);
        // validateTeam(body.homeTeam, homeTeamId, homeTeam);
        // validateTeam(body.awayTeam, awayTeamId, awayTeam);
        // validateTournament(body.tournament, tournamentId, tournament);
      });
    });
});

Then('It returns a valid match', () => {
  cy.get<Cypress.Response>('@request').its('body').should((match: MatchResponse) => {
    expect(match).not.to.be.undefined;
    // TODO schema validation
  });
});

Then('It returns a valid list of matchs', () => {
  cy.get<Cypress.Response>('@request').its('body').should((matchs: MatchResponse[]) => {
    expect(matchs).not.to.be.undefined;
    // TODO schema validation
  });
});
