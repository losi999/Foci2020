import { TournamentDocument, StandingDocument, BetDocument } from '@foci2020/shared/types/documents';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { betDocumentConverter } from '@foci2020/shared/dependencies/converters/bet-document-converter';
import { standingDocumentConverter } from '@foci2020/shared/dependencies/converters/standing-document-converter';
import { v4 as uuid } from 'uuid';
import { default as schema } from '@foci2020/test/api/schemas/standing-response-list';
import { MatchIdType, UserIdType } from '@foci2020/shared/types/common';

describe('GET /betting/v1/tournaments/{tournamentId}/standings', () => {
  let tournamentDocument: TournamentDocument;
  let higherStandingDocument: StandingDocument;
  let lowerStandingDocument: StandingDocument;
  let exactMatchBet: BetDocument;
  let outcomeBet: BetDocument;

  beforeEach(() => {
    tournamentDocument = tournamentDocumentConverter.create({
      tournamentName: 'EB 2020', 
    }, Cypress.env('EXPIRES_IN'));

    exactMatchBet = betDocumentConverter.create({
      homeScore: 1,
      awayScore: 2,
    }, uuid() as UserIdType, 'user1', uuid() as MatchIdType, tournamentDocument.id, Cypress.env('EXPIRES_IN'));

    outcomeBet = betDocumentConverter.create({
      homeScore: 1,
      awayScore: 2,
    }, uuid() as UserIdType, 'user2', uuid() as MatchIdType, tournamentDocument.id, Cypress.env('EXPIRES_IN'));

    higherStandingDocument = standingDocumentConverter.create([betDocumentConverter.calculateResult(exactMatchBet, {
      homeScore: 1,
      awayScore: 2,
    })], Cypress.env('EXPIRES_IN'));
    lowerStandingDocument = standingDocumentConverter.create([betDocumentConverter.calculateResult(outcomeBet, {
      homeScore: 3,
      awayScore: 5,
    })], Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetStandingListOfTournament(tournamentDocument.id)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
        .requestGetStandingListOfTournament(tournamentDocument.id)
        .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    it('should get the standings ordered by results', () => {
      cy.saveTournamentDocument(tournamentDocument)
        .saveStandingDocument(lowerStandingDocument)
        .saveStandingDocument(higherStandingDocument)
        .authenticate('player1')
        .requestGetStandingListOfTournament(tournamentDocument.id)
        .expectOkResponse()
        .expectValidResponseSchema(schema)
        .validateStandingResponse([higherStandingDocument, lowerStandingDocument]);
    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
            .requestGetStandingListOfTournament(`${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
