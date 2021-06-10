import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument, BetDocument } from '@foci2020/shared/types/documents';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { betDocumentConverter } from '@foci2020/shared/dependencies/converters/bet-document-converter';
import { MatchIdType, UserIdType } from '@foci2020/shared/types/common';

describe('DELETE /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;
  let betDocument: BetDocument;

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
    matchDocument = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      city: 'Budapest',
      stadium: 'Arena',
      startTime: addMinutes(10).toISOString(),
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));
    betDocument = betDocumentConverter.create({
      homeScore: 1,
      awayScore: 0,
    }, uuid() as UserIdType, 'username', matchDocument.id, matchDocument.tournamentId, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteMatch(uuid() as MatchIdType)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteMatch(uuid() as MatchIdType)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete match', () => {
      cy.saveMatchDocument(matchDocument)
        .authenticate('admin1')
        .requestDeleteMatch(matchDocument.id)
        .expectOkResponse()
        .validateMatchDeleted(matchDocument.id);
    });

    describe('related bets', () => {
      it('should be deleted if match is deleted', () => {
        cy.saveMatchDocument(matchDocument)
          .saveBetDocument(betDocument)
          .authenticate('admin1')
          .requestDeleteMatch(matchDocument.id)
          .expectOkResponse()
          .validateMatchDeleted(matchDocument.id)
          .wait(2000)
          .validateBetDeleted(betDocument.userId, matchDocument.id);
      });

      it.skip('should recalculate standings', () => {

      });
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteMatch(`${uuid()}-not-valid` as MatchIdType)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
