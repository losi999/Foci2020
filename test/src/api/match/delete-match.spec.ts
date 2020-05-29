import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { teamConverter, tournamentConverter, matchConverter } from '@foci2020/test/api/dependencies';

describe('DELETE /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

  before(() => {
    homeTeamDocument = teamConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    });
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    });
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });
    matchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteMatch(matchDocument.id)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteMatch(matchDocument.id)
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
      it.skip('should be deleted if match is deleted', () => {

      });
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteMatch(`${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
