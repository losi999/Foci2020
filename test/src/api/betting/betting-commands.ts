import { CommandFunctionWithPreviousSubject, CommandFunction } from '@foci2020/test/api/types';
import { BetRequest } from '@foci2020/shared/types/requests';
import { betDocumentConverter } from '@foci2020/shared/dependencies/converters/bet-document-converter';
import { User } from '@foci2020/test/api/constants';
import { BetDocument, StandingDocument } from '@foci2020/shared/types/documents';
import { concatenate } from '@foci2020/shared/common/utils';
import { BetResult, MatchIdType, TournamentIdType, UserIdType } from '@foci2020/shared/types/common';
import { StandingResponse, BetResponse, CompareResponse } from '@foci2020/shared/types/responses';
import { headerExpiresIn } from '@foci2020/shared/constants';
import { databaseService } from '@foci2020/test/api/dependencies';

const requestPlaceBet = (idToken: string, matchId: string, score: BetRequest) => {
  return cy.request({
    body: score,
    method: 'POST',
    url: `/betting/v1/matches/${matchId}/bets`,
    headers: {
      Authorization: idToken,
      [headerExpiresIn]: Cypress.env('EXPIRES_IN')
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

const saveStandingDocument = (document: StandingDocument): void => {
  cy.log('Save standing document', document).wrap(databaseService.saveStanding(document), { log: false });
};

const saveBetForUser = (user: User, score: BetRequest, matchId: MatchIdType, tournamentId: TournamentIdType) => {
  return cy.authenticate(user)
    .then((idToken: string) => {
      const { sub, nickname } = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString('utf8'));
      const betdocument = betDocumentConverter.create(score, sub, nickname, matchId, tournamentId, Cypress.env('EXPIRES_IN'));
      return cy.log('Save bet document', betdocument).wrap(databaseService.saveBet(betdocument), { log: false });
    });
};

const validateBetDocument = (user: User, matchId: MatchIdType, bet: BetRequest) => {
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

const validateBetDeleted = (userId: UserIdType, matchId: MatchIdType) => {
  return cy.log('Get bet document', concatenate(userId, matchId))
    .wrap(databaseService.getBetById(userId, matchId))
    .should((document) => {
      expect(document).to.be.undefined;
    });
};

const validateBetResult = (userId: UserIdType, matchId: MatchIdType, result: BetResult) => {
  return cy.log('Get bet document', concatenate(userId, matchId))
    .wrap(databaseService.getBetById(userId, matchId))
    .should((document: BetDocument) => {
      expect(document.result).to.equal(result);
    });
};

const validateStandingDocument = (tournamentId: TournamentIdType, userId: UserIdType, results: StandingDocument['results']) => {
  return cy.log('Get standing document', concatenate(tournamentId, userId))
    .wrap(databaseService.getStandingById(tournamentId, userId))
    .should((document: StandingDocument) => {
      expect(document.results).to.deep.equal(results);
    });
};

const validateStandingResponse = (response: StandingResponse[], documents: StandingDocument[]) => {
  response.forEach((resp, index) => {
    expect(resp.userName).to.equal(documents[index].userName);
    expect(resp.total).to.equal(documents[index].total);
    expect(resp.userId).to.equal(documents[index].userId);
    expect(resp.results).to.deep.equal(documents[index].results);
  });
};

const validatePrivateBetResponse = (response: BetResponse[], user: User) => {
  response.filter(bet => bet.userName !== user).forEach((bet) => {
    expect(bet.homeScore).to.be.undefined;
    expect(bet.awayScore).to.be.undefined;
  });
};

const validatePublicBetResponse = (response: BetResponse[], user: User) => {
  response.filter(bet => bet.userName !== user).forEach((bet) => {
    expect(bet.homeScore).to.be.at.least(0);
    expect(bet.awayScore).to.be.at.least(0);
  });
};

const validatePublicCompareResponse = (response: CompareResponse, ownPlayer: User, otherPlayer: User, matchId: string) => {
  expect(response.leftUserName).to.equal(ownPlayer);
  expect(response.rightUserName).to.equal(otherPlayer);
  const match = response.matches.find(match => match.matchId === matchId);
  expect(match.rightScore.homeScore).to.be.at.least(0);
  expect(match.rightScore.awayScore).to.be.at.least(0);
};

const validatePrivateCompareResponse = (response: CompareResponse, ownPlayer: User, otherPlayer: User, matchId: string) => {
  expect(response.leftUserName).to.equal(ownPlayer);
  expect(response.rightUserName).to.equal(otherPlayer);
  const match = response.matches.find(match => match.matchId === matchId);
  expect(match.rightScore).to.be.undefined;
};

export const setBettingCommands = () => {
  Cypress.Commands.add('requestGetMatchListOfTournament', { prevSubject: true }, requestGetMatchListOfTournament);
  Cypress.Commands.add('requestGetStandingListOfTournament', { prevSubject: true }, requestGetStandingListOfTournament);
  Cypress.Commands.add('requestGetBetListOfMatch', { prevSubject: true }, requestGetBetListOfMatch);
  Cypress.Commands.add('requestCompareWithPlayer', { prevSubject: true }, requestCompareWithPlayer);
  Cypress.Commands.add('requestPlaceBet', { prevSubject: true }, requestPlaceBet);
  Cypress.Commands.add('saveBetForUser', saveBetForUser);
  Cypress.Commands.add('saveBetDocument', saveBetDocument);
  Cypress.Commands.add('saveStandingDocument', saveStandingDocument);
  Cypress.Commands.add('validateBetDocument', validateBetDocument);
  Cypress.Commands.add('validateBetDeleted', validateBetDeleted);
  Cypress.Commands.add('validateBetResult', validateBetResult);
  Cypress.Commands.add('validateStandingDocument', validateStandingDocument);
  Cypress.Commands.add('validateStandingResponse', { prevSubject: true }, validateStandingResponse);
  Cypress.Commands.add('validatePrivateBetResponse', { prevSubject: true }, validatePrivateBetResponse);
  Cypress.Commands.add('validatePublicBetResponse', { prevSubject: true }, validatePublicBetResponse);
  Cypress.Commands.add('validatePublicCompareResponse', { prevSubject: true }, validatePublicCompareResponse);
  Cypress.Commands.add('validatePrivateCompareResponse', { prevSubject: true }, validatePrivateCompareResponse);
};

declare global {
  namespace Cypress {
    interface Chainable {
      saveBetForUser: CommandFunction<typeof saveBetForUser>;
      saveBetDocument: CommandFunction<typeof saveBetDocument>;
      saveStandingDocument: CommandFunction<typeof saveStandingDocument>;

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
      validateStandingResponse: CommandFunctionWithPreviousSubject<typeof validateStandingResponse>;
      validatePrivateBetResponse: CommandFunctionWithPreviousSubject<typeof validatePrivateBetResponse>;
      validatePublicBetResponse: CommandFunctionWithPreviousSubject<typeof validatePublicBetResponse>;
      validatePublicCompareResponse: CommandFunctionWithPreviousSubject<typeof validatePublicCompareResponse>;
      validatePrivateCompareResponse: CommandFunctionWithPreviousSubject<typeof validatePrivateCompareResponse>;
    }
  }
}
