import { CommandFunctionWithPreviousSubject, CommandFunction } from '@foci2020/test/api/types';
import { BetRequest } from '@foci2020/shared/types/requests';
import { betConverter, databaseService } from '@foci2020/test/api/dependencies';
import { User } from '@foci2020/test/api/constants';
import { BetDocument, StandingDocument } from '@foci2020/shared/types/documents';
import { concatenate } from '@foci2020/shared/common/utils';
import { BetResult } from '@foci2020/shared/types/common';

const requestPlaceBet = (idToken: string, matchId: string, score: BetRequest) => {
  return cy.request({
    body: score,
    method: 'POST',
    url: `/betting/v1/matches/${matchId}/bets`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetMatchListOfTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: `/betting/v1/tournaments/${tournamentId}/matches`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetStandingListOfTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: `/betting/v1/tournaments/${tournamentId}/standings`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestGetBetListOfMatch = (idToken: string, matchId: string) => {
  return cy.request({
    method: 'GET',
    url: `/betting/v1/matches/${matchId}/bets`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const requestCompareWithPlayer = (idToken: string, tournamentId: string, userId: string) => {
  return cy.request({
    method: 'GET',
    url: `/betting/v1/tournaments/${tournamentId}/compare/${userId}`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};

const saveBetDocument = (document: BetDocument): void => {
  cy.log('Save bet document', document).wrap(databaseService.saveBet(document), { log: false });
};

const saveBetForUser = (user: User, score: BetRequest, matchId: string, tournamentId: string) => {
  return cy.authenticate(user)
    .then((idToken: string) => {
      const { sub, nickname } = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8'));
      const betdocument = betConverter.create(score, sub, nickname, matchId, tournamentId);
      return cy.log('Save bet document', betdocument).wrap(databaseService.saveBet(betdocument), { log: false });
    });
};

const validateBetDocument = (user: User, matchId: string, bet: BetRequest) => {
  let userId: string;
  let userName: string;
  return cy.authenticate(user)
    .then((idToken: string) => {
      const { sub, nickname } = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8'));
      userId = sub;
      userName = nickname;
      return cy.wrap(databaseService.getBetById(sub, matchId));
    })
    .then((document: BetDocument) => {
      expect(document.matchId).to.equal(matchId);
      expect(document.homeScore).to.equal(bet.homeScore);
      expect(document.awayScore).to.equal(bet.awayScore);
      expect(document.userId).to.equal(userId);
      expect(document.userName).to.equal(userName);
    });
};

const validateBetDeleted = (userId: string, matchId: string) => {
  return cy.log('Get bet document', concatenate(userId, matchId))
    .wrap(databaseService.getBetById(userId, matchId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};

const validateBetResult = (userId: string, matchId: string, result: BetResult) => {
  return cy.log('Get bet document', concatenate(userId, matchId))
    .wrap(databaseService.getBetById(userId, matchId))
    .should((document: BetDocument) => {
      expect(document.result).to.equal(result);
    });
};

const validateStandingDocument = (tournamentId: string, userId: string, results: StandingDocument['results']) => {
  return cy.log('Get standing document', concatenate(tournamentId, userId))
    .wrap(databaseService.getStandingById(tournamentId, userId))
    .should((document: StandingDocument) => {
      expect(document.results).to.deep.equal(results);
    });
};

export const setBettingCommands = () => {
  Cypress.Commands.add('requestGetMatchListOfTournament', { prevSubject: true }, requestGetMatchListOfTournament);
  Cypress.Commands.add('requestGetStandingListOfTournament', { prevSubject: true }, requestGetStandingListOfTournament);
  Cypress.Commands.add('requestGetBetListOfMatch', { prevSubject: true }, requestGetBetListOfMatch);
  Cypress.Commands.add('requestCompareWithPlayer', { prevSubject: true }, requestCompareWithPlayer);
  Cypress.Commands.add('requestPlaceBet', { prevSubject: true }, requestPlaceBet);
  Cypress.Commands.add('saveBetForUser', saveBetForUser);
  Cypress.Commands.add('saveBetDocument', saveBetDocument);
  Cypress.Commands.add('validateBetDocument', validateBetDocument);
  Cypress.Commands.add('validateBetDeleted', validateBetDeleted);
  Cypress.Commands.add('validateBetResult', validateBetResult);
  Cypress.Commands.add('validateStandingDocument', validateStandingDocument);
};

declare global {
  namespace Cypress {
    interface Chainable {
      saveBetForUser: CommandFunction<typeof saveBetForUser>;
      saveBetDocument: CommandFunction<typeof saveBetDocument>;

      validateBetDeleted: CommandFunction<typeof validateBetDeleted>;
      validateBetResult: CommandFunction<typeof validateBetResult>;
      validateStandingDocument: CommandFunction<typeof validateStandingDocument>;
    }

    interface ChainableRequest extends Chainable {
      requestGetMatchListOfTournament: CommandFunctionWithPreviousSubject<typeof requestGetMatchListOfTournament>;
      requestGetStandingListOfTournament: CommandFunctionWithPreviousSubject<typeof requestGetStandingListOfTournament>;
      requestGetBetListOfMatch: CommandFunctionWithPreviousSubject<typeof requestGetBetListOfMatch>;
      requestCompareWithPlayer: CommandFunctionWithPreviousSubject<typeof requestCompareWithPlayer>;
      requestPlaceBet: CommandFunctionWithPreviousSubject<typeof requestPlaceBet>;
    }

    interface ChainableResponseBody extends Chainable {
      validateBetDocument: CommandFunction<typeof validateBetDocument>;
    }
  }
}
