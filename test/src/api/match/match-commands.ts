import { MatchRequest, MatchFinalScoreRequest, TeamRequest, TournamentRequest } from '@foci2020/shared/types/requests';
import { MatchDocument, TeamDocument, TournamentDocument } from '@foci2020/shared/types/documents';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { CommandFunction, CommandFunctionWithPreviousSubject } from '@foci2020/test/api/types';
import { databaseService } from '@foci2020/test/api/dependencies';
import { headerExpiresIn } from '@foci2020/shared/constants';
import { MatchIdType } from '@foci2020/shared/types/common';

const requestCreateMatch = (idToken: string, match: MatchRequest) => {
  return cy.request({
    body: match,
    method: 'POST',
    url: '/match/v1/matches',
    headers: {
      Authorization: idToken,
      [headerExpiresIn]: 600
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestUpdateMatch = (idToken: string, matchId: MatchIdType, match: MatchRequest) => {
  return cy.request({
    body: match,
    method: 'PUT',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken,
      [headerExpiresIn]: 600
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestDeleteMatch = (idToken: string, matchId: MatchIdType) => {
  return cy.request({
    method: 'DELETE',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetMatch = (idToken: string, matchId: MatchIdType) => {
  return cy.request({
    method: 'GET',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetMatchList = (idToken: string) => {
  return cy.request({
    method: 'GET',
    url: '/match/v1/matches',
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestSetFinalScoreOfMatch = (idToken: string, matchId: MatchIdType, score: MatchFinalScoreRequest) => {
  return cy.request({
    body: score,
    method: 'PATCH',
    url: `/match/v1/matches/${matchId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const saveMatchDocument = (document: MatchDocument) => {
  return cy.log('Save match document', document).wrap(databaseService.saveMatch(document), { log: false });
};

const validateMatchDocument = (response: MatchResponse,
  match: MatchRequest,
  homeTeam: TeamDocument,
  awayTeam: TeamDocument,
  tournament: TournamentDocument,
  matchId?: string) => {
  const id = response?.matchId ?? matchId as MatchIdType;
  cy.log('Get match document', id)
    .wrap(databaseService.getMatchById(id))
    .should((document: MatchDocument) => {
      expect(document.id).to.equal(id);
      expect(document.group).to.equal(match.group);
      expect(document.startTime).to.equal(match.startTime);
      expect(document.homeTeam.id).to.equal(homeTeam.id);
      expect(document.homeTeam.teamName).to.equal(homeTeam.teamName);
      expect(document.homeTeam.image).to.equal(homeTeam.image);
      expect(document.homeTeam.shortName).to.equal(homeTeam.shortName);
      expect(document.awayTeam.id).to.equal(awayTeam.id);
      expect(document.awayTeam.teamName).to.equal(awayTeam.teamName);
      expect(document.awayTeam.image).to.equal(awayTeam.image);
      expect(document.awayTeam.shortName).to.equal(awayTeam.shortName);
      expect(document.tournament.id).to.equal(tournament.id);
      expect(document.tournament.tournamentName).to.equal(tournament.tournamentName);
    });
};

const validateUpdatedHomeTeam = (
  updated: TeamRequest,
  match: MatchDocument,
  homeTeam: TeamDocument,
  awayTeam: TeamDocument,
  tournament: TournamentDocument,
  matchId: MatchIdType) => {
  cy.log('Get match document', matchId)
    .wrap(databaseService.getMatchById(matchId))
    .should((document: MatchDocument) => {
      expect(document.id).to.equal(matchId);
      expect(document.group).to.equal(match.group);
      expect(document.startTime).to.equal(match.startTime);
      expect(document.homeTeam.id).to.equal(homeTeam.id);
      expect(document.homeTeam.teamName).to.equal(updated.teamName);
      expect(document.homeTeam.image).to.equal(updated.image);
      expect(document.homeTeam.shortName).to.equal(updated.shortName);
      expect(document.awayTeam.id).to.equal(awayTeam.id);
      expect(document.awayTeam.teamName).to.equal(awayTeam.teamName);
      expect(document.awayTeam.image).to.equal(awayTeam.image);
      expect(document.awayTeam.shortName).to.equal(awayTeam.shortName);
      expect(document.tournament.id).to.equal(tournament.id);
      expect(document.tournament.tournamentName).to.equal(tournament.tournamentName);
    });
};

const validateUpdatedAwayTeam = (updated: TeamRequest,
  match: MatchDocument,
  homeTeam: TeamDocument,
  awayTeam: TeamDocument,
  tournament: TournamentDocument,
  matchId: MatchIdType) => {
  cy.log('Get match document', matchId)
    .wrap(databaseService.getMatchById(matchId))
    .should((document: MatchDocument) => {
      expect(document.id).to.equal(matchId);
      expect(document.group).to.equal(match.group);
      expect(document.startTime).to.equal(match.startTime);
      expect(document.homeTeam.id).to.equal(homeTeam.id);
      expect(document.homeTeam.teamName).to.equal(homeTeam.teamName);
      expect(document.homeTeam.image).to.equal(homeTeam.image);
      expect(document.homeTeam.shortName).to.equal(homeTeam.shortName);
      expect(document.awayTeam.id).to.equal(awayTeam.id);
      expect(document.awayTeam.teamName).to.equal(updated.teamName);
      expect(document.awayTeam.image).to.equal(updated.image);
      expect(document.awayTeam.shortName).to.equal(updated.shortName);
      expect(document.tournament.id).to.equal(tournament.id);
      expect(document.tournament.tournamentName).to.equal(tournament.tournamentName);
    });
};

const validateUpdatedTournament = (updated: TournamentRequest,
  match: MatchDocument,
  homeTeam: TeamDocument,
  awayTeam: TeamDocument,
  tournament: TournamentDocument,
  matchId: MatchIdType) => {
  cy.log('Get match document', matchId)
    .wrap(databaseService.getMatchById(matchId))
    .should((document: MatchDocument) => {
      expect(document.id).to.equal(matchId);
      expect(document.group).to.equal(match.group);
      expect(document.startTime).to.equal(match.startTime);
      expect(document.homeTeam.id).to.equal(homeTeam.id);
      expect(document.homeTeam.teamName).to.equal(homeTeam.teamName);
      expect(document.homeTeam.image).to.equal(homeTeam.image);
      expect(document.homeTeam.shortName).to.equal(homeTeam.shortName);
      expect(document.awayTeam.id).to.equal(awayTeam.id);
      expect(document.awayTeam.teamName).to.equal(awayTeam.teamName);
      expect(document.awayTeam.image).to.equal(awayTeam.image);
      expect(document.awayTeam.shortName).to.equal(awayTeam.shortName);
      expect(document.tournament.id).to.equal(tournament.id);
      expect(document.tournament.tournamentName).to.equal(updated.tournamentName);
    });
};

const validateMatchFinalScore = (finalScore: MatchFinalScoreRequest,
  match: MatchDocument,
  homeTeam: TeamDocument,
  awayTeam: TeamDocument,
  tournament: TournamentDocument,
  matchId: MatchIdType) => {
  cy.log('Get match document', matchId)
    .wrap(databaseService.getMatchById(matchId))
    .should((document: MatchDocument) => {
      expect(document.id).to.equal(matchId);
      expect(document.group).to.equal(match.group);
      expect(document.startTime).to.equal(match.startTime);
      expect(document.homeTeam.id).to.equal(homeTeam.id);
      expect(document.homeTeam.teamName).to.equal(homeTeam.teamName);
      expect(document.homeTeam.image).to.equal(homeTeam.image);
      expect(document.homeTeam.shortName).to.equal(homeTeam.shortName);
      expect(document.awayTeam.id).to.equal(awayTeam.id);
      expect(document.awayTeam.teamName).to.equal(awayTeam.teamName);
      expect(document.awayTeam.image).to.equal(awayTeam.image);
      expect(document.awayTeam.shortName).to.equal(awayTeam.shortName);
      expect(document.tournament.id).to.equal(tournament.id);
      expect(document.tournament.tournamentName).to.equal(tournament.tournamentName);
      expect(document.finalScore.homeScore).to.equal(finalScore.homeScore);
      expect(document.finalScore.awayScore).to.equal(finalScore.awayScore);
    });
};

const validateMatchResponse = (response: MatchResponse, document: MatchDocument, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument) => {
  expect(response.matchId).to.equal(document.id);
  expect(response.group).to.equal(document.group);
  expect(response.startTime).to.equal(document.startTime);
  expect(response.homeTeam.teamId).to.equal(homeTeam.id);
  expect(response.homeTeam.teamName).to.equal(homeTeam.teamName);
  expect(response.homeTeam.image).to.equal(homeTeam.image);
  expect(response.homeTeam.shortName).to.equal(homeTeam.shortName);
  expect(response.awayTeam.teamId).to.equal(awayTeam.id);
  expect(response.awayTeam.teamName).to.equal(awayTeam.teamName);
  expect(response.awayTeam.image).to.equal(awayTeam.image);
  expect(response.awayTeam.shortName).to.equal(awayTeam.shortName);
  expect(response.tournament.tournamentId).to.equal(tournament.id);
  expect(response.tournament.tournamentName).to.equal(tournament.tournamentName);
};

const validateMatchDeleted = (matchId: MatchIdType) => {
  cy.log('Get match document', matchId)
    .wrap(databaseService.getMatchById(matchId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};

export const setMatchCommands = () => {
  Cypress.Commands.add('requestSetFinalScoreOfMatch', { prevSubject: true }, requestSetFinalScoreOfMatch);
  Cypress.Commands.add('requestCreateMatch', { prevSubject: true }, requestCreateMatch);
  Cypress.Commands.add('requestUpdateMatch', { prevSubject: true }, requestUpdateMatch);
  Cypress.Commands.add('requestDeleteMatch', { prevSubject: true }, requestDeleteMatch);
  Cypress.Commands.add('requestGetMatch', { prevSubject: true }, requestGetMatch);
  Cypress.Commands.add('requestGetMatchList', { prevSubject: true }, requestGetMatchList);

  Cypress.Commands.add('saveMatchDocument', saveMatchDocument);

  Cypress.Commands.add('validateMatchDocument', { prevSubject: true }, validateMatchDocument);
  Cypress.Commands.add('validateMatchFinalScore', validateMatchFinalScore);
  Cypress.Commands.add('validateUpdatedHomeTeam', validateUpdatedHomeTeam);
  Cypress.Commands.add('validateUpdatedAwayTeam', validateUpdatedAwayTeam);
  Cypress.Commands.add('validateUpdatedTournament', validateUpdatedTournament);
  Cypress.Commands.add('validateMatchResponse', { prevSubject: true }, validateMatchResponse);
  Cypress.Commands.add('validateMatchDeleted', validateMatchDeleted);
};

declare global {
  namespace Cypress {
    interface Chainable {
      saveMatchDocument: CommandFunction<typeof saveMatchDocument>;
      validateMatchDeleted: CommandFunction<typeof validateMatchDeleted>;
      validateMatchFinalScore: CommandFunction<typeof validateMatchFinalScore>;
      validateUpdatedHomeTeam: CommandFunction<typeof validateUpdatedHomeTeam>;
      validateUpdatedAwayTeam: CommandFunction<typeof validateUpdatedAwayTeam>;
      validateUpdatedTournament: CommandFunction<typeof validateUpdatedTournament>;
    }

    interface ChainableRequest extends Chainable {
      requestGetMatch: CommandFunctionWithPreviousSubject<typeof requestGetMatch>;
      requestCreateMatch: CommandFunctionWithPreviousSubject<typeof requestCreateMatch>;
      requestUpdateMatch: CommandFunctionWithPreviousSubject<typeof requestUpdateMatch>;
      requestDeleteMatch: CommandFunctionWithPreviousSubject<typeof requestDeleteMatch>;
      requestGetMatchList: CommandFunctionWithPreviousSubject<typeof requestGetMatchList>;
      requestSetFinalScoreOfMatch: CommandFunctionWithPreviousSubject<typeof requestSetFinalScoreOfMatch>;
    }

    interface ChainableResponseBody extends Chainable {
      validateMatchDocument: CommandFunctionWithPreviousSubject<typeof validateMatchDocument>;
      validateMatchResponse: CommandFunctionWithPreviousSubject<typeof validateMatchResponse>;
    }
  }
}
