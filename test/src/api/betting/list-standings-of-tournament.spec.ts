import { TournamentDocument, StandingDocument, BetDocument } from '@foci2020/shared/types/documents';
import { tournamentConverter, standingConverter, betConverter } from '@foci2020/test/api/dependencies';
import { v4 as uuid } from 'uuid';
import { default as schema } from '@foci2020/test/api/schemas/standing-response-list';

describe('GET /betting/v1/tournaments/{tournamentId}/standings', () => {
  let tournamentDocument: TournamentDocument;
  let higherStandingDocument: StandingDocument;
  let lowerStandingDocument: StandingDocument;
  let exactMatchBet: BetDocument;
  let outcomeBet: BetDocument;

  beforeEach(() => {
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });

    exactMatchBet = betConverter.create({
      homeScore: 1, awayScore: 2
    }, uuid(), 'user1', uuid(), tournamentDocument.id);

    outcomeBet = betConverter.create({
      homeScore: 1, awayScore: 2
    }, uuid(), 'user2', uuid(), tournamentDocument.id);

    higherStandingDocument = standingConverter.create([betConverter.calculateResult(exactMatchBet, {
      homeScore: 1,
      awayScore: 2
    })]);
    lowerStandingDocument = standingConverter.create([betConverter.calculateResult(outcomeBet, {
      homeScore: 3,
      awayScore: 5
    })]);
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
