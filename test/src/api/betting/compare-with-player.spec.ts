import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { addMinutes } from '@foci2020/shared/common/utils';
import { default as schema } from '@foci2020/test/api/schemas/compare-response';

describe('GET /betting/v1/tournaments/{tournamentId}/compare/{userId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let pendingMatchDocument: MatchDocument;
  let startedMatchDocument: MatchDocument;

  beforeEach(() => {
    homeTeamDocument = teamDocumentConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    }, Cypress.env('EXPIRES_IN'));
    awayTeamDocument = teamDocumentConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, Cypress.env('EXPIRES_IN'));
    tournamentDocument = tournamentDocumentConverter.create({
      tournamentName: 'EB 2020', 
    }, Cypress.env('EXPIRES_IN'));

    pendingMatchDocument = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(15).toISOString(),
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));

    startedMatchDocument = matchDocumentConverter.create({
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'B csoport',
      startTime: addMinutes(-10).toISOString(),
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestCompareWithPlayer(uuid(), uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
        .requestCompareWithPlayer(uuid(), uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    describe.skip('should get the comparison', () => {
      describe('showing other player\'s bets if', () => {
        it('betting time has expired', () => {
          cy.saveMatchDocument(pendingMatchDocument)
            .saveMatchDocument(startedMatchDocument)
            .saveBetForUser('player2', {
              homeScore: 1,
              awayScore: 1,
            }, startedMatchDocument.id, startedMatchDocument.tournamentId)
            .authenticate('player1')
            .requestCompareWithPlayer(startedMatchDocument.tournamentId, 'player2')
            .expectOkResponse()
            .expectValidResponseSchema(schema)
            .validatePublicCompareResponse('player1', 'player2', startedMatchDocument.id);
        });

        it('player already placed a bet', () => {
          cy.saveMatchDocument(pendingMatchDocument)
            .saveMatchDocument(startedMatchDocument)
            .saveBetForUser('player1', {
              homeScore: 4,
              awayScore: 0,
            }, pendingMatchDocument.id, pendingMatchDocument.tournamentId)
            .saveBetForUser('player2', {
              homeScore: 1,
              awayScore: 1,
            }, pendingMatchDocument.id, pendingMatchDocument.tournamentId)
            .authenticate('player1')
            .requestCompareWithPlayer(startedMatchDocument.tournamentId, 'player2')
            .expectOkResponse()
            .expectValidResponseSchema(schema)
            .validatePublicCompareResponse('player1', 'player2', pendingMatchDocument.id);
        });
      });

      describe('NOT showing other player\'s bets if', () => {
        it('player can still place a bet', () => {
          cy.saveMatchDocument(pendingMatchDocument)
            .saveMatchDocument(startedMatchDocument)
            .saveBetForUser('player2', {
              homeScore: 1,
              awayScore: 1,
            }, pendingMatchDocument.id, pendingMatchDocument.tournamentId)
            .authenticate('player1')
            .requestCompareWithPlayer(startedMatchDocument.tournamentId, 'player2')
            .expectOkResponse()
            .expectValidResponseSchema(schema)
            .validatePrivateCompareResponse('player1', 'player2', pendingMatchDocument.id);
        });
      });
    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
            .requestCompareWithPlayer(`${uuid()}-not-valid`, uuid())
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });

      describe('if userId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
            .requestCompareWithPlayer(uuid(), `${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('userId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
