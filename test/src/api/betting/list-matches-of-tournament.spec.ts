import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { teamConverter, tournamentConverter, matchConverter } from '@foci2020/test/api/dependencies';
import { default as schema } from '@foci2020/test/api/schemas/match-response-list';

describe('GET /betting/v1/tournaments/{tournamentId}/matches', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument1: MatchDocument;
  let matchDocument2: MatchDocument;

  before(() => {
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
    matchDocument1 = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(15).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, true);

    matchDocument2 = matchConverter.create({
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'B csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, true);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetMatchListOfTournament(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
        .requestGetMatchListOfTournament(uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    it('should get a list of matches', () => {
      cy.saveMatchDocument(matchDocument1)
        .saveMatchDocument(matchDocument2)
        .authenticate('player1')
        .requestGetMatchListOfTournament(tournamentDocument.id)
        .expectOkResponse()
        .expectValidResponseSchema(schema);
    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
          .requestGetMatchListOfTournament(`${uuid()}-not-valid`)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
