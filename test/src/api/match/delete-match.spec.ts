import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument, BetDocument } from '@foci2020/shared/types/documents';
import { teamConverter, tournamentConverter, matchConverter, betConverter } from '@foci2020/test/api/dependencies';

describe('DELETE /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;
  let betDocument: BetDocument;

  beforeEach(() => {
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
    betDocument = betConverter.create({
      homeScore: 1,
      awayScore: 0
    }, uuid(), 'username', matchDocument.id, matchDocument.tournamentId);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteMatch(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteMatch(uuid())
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
          .validateBetDeleted(betDocument.userId, homeTeamDocument.id);
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
