import { addMinutes } from '@foci2020/shared/common/utils';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { default as schema } from '@foci2020/test/api/schemas/match-response-list';

describe('GET /match/v1/matches', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let pendingMatchDocument: MatchDocument;
  let finishedMatchDocument: MatchDocument;

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
      group: undefined,
      city: 'Budapest',
      stadium: undefined,
      startTime: addMinutes(10).toISOString(),
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));

    finishedMatchDocument = {
      ...matchDocumentConverter.create({
        homeTeamId: awayTeamDocument.id,
        awayTeamId: homeTeamDocument.id,
        tournamentId: tournamentDocument.id,
        group: 'B csoport',
        city: 'Budapest',
        stadium: 'Arena',
        startTime: addMinutes(10).toISOString(),
      }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN')),
      finalScore: {
        homeScore: 2,
        awayScore: 0,
      },
    };
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetMatchList()
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetMatchList()
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get a list of matches', () => {
      cy.saveMatchDocument(pendingMatchDocument)
        .saveMatchDocument(finishedMatchDocument)
        .authenticate('admin1')
        .requestGetMatchList()
        .expectOkResponse()
        .expectValidResponseSchema(schema);
    });
  });
});
