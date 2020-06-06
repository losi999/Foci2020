import { addMinutes } from '@foci2020/shared/common/utils';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { teamConverter, tournamentConverter, matchConverter } from '@foci2020/test/api/dependencies';
import { default as schema } from '@foci2020/test/api/schemas/match-response-list';

describe('GET /match/v1/matches', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let pendingMatchDocument: MatchDocument;
  let finishedMatchDocument: MatchDocument;

  beforeEach(() => {
    homeTeamDocument = teamConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    }, true);
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, true);
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    }, true);
    pendingMatchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, true);

    finishedMatchDocument = {
      ...matchConverter.create({
        homeTeamId: awayTeamDocument.id,
        awayTeamId: homeTeamDocument.id,
        tournamentId: tournamentDocument.id,
        group: 'B csoport',
        startTime: addMinutes(10).toISOString()
      }, homeTeamDocument, awayTeamDocument, tournamentDocument, true),
      finalScore: {
        homeScore: 2,
        awayScore: 0
      }
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
