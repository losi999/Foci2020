import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { default as schema } from '@foci2020/test/api/schemas/match-response';
import { MatchIdType } from '@foci2020/shared/types/common';

describe('GET /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

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
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetMatch(matchDocument.id)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetMatch(matchDocument.id)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get match by id', () => {
      cy.saveMatchDocument(matchDocument)
        .authenticate('admin1')
        .requestGetMatch(matchDocument.id)
        .expectOkResponse()
        .expectValidResponseSchema(schema)
        .validateMatchResponse(matchDocument, homeTeamDocument, awayTeamDocument, tournamentDocument);
    });

    describe('should return error if matchId', () => {
      it('is not uuid', () => {
        cy.authenticate('admin1')
          .requestGetMatch(`${uuid()}-not-valid` as MatchIdType)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
      });

      it('does not belong to any match', () => {
        cy.authenticate('admin1')
          .requestGetMatch(uuid() as MatchIdType)
          .expectNotFoundResponse();
      });
    });
  });
});
