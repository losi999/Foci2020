import { MatchDocument, TeamDocument, TournamentDocument } from '@foci2020/shared/types/documents';
import { matchConverter, teamConverter, tournamentConverter } from '@foci2020/test/api/dependencies';
import { v4 as uuid } from 'uuid';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('GET /betting/v1/matches/{matchId}/bets', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let pendingMatchDocument: MatchDocument;
  let startedMatchDocument: MatchDocument;

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

    pendingMatchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(15).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);

    startedMatchDocument = matchConverter.create({
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'B csoport',
      startTime: addMinutes(-10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
      .requestGetBetListOfMatch(pendingMatchDocument.id)
      .expectUnauthorizedResponse();
    });
  });

  describe('called as an admin', () => {
    it('should return forbidden', () => {
      cy.authenticate('admin1')
      .requestGetBetListOfMatch(pendingMatchDocument.id)
      .expectForbiddenResponse();
    });
  });

  describe('called as a player', () => {
    describe('should list bets', () => {
      describe('showing other player\'s bets if', () => {
        it.skip('betting time has expired', () => {

        });

        it.skip('player already placed a bet', () => {

        });
      });

      describe('NOT showing other player\'s bets if', () => {
        it.skip('player can still place a bet', () => {

        });
      });
    });

    describe('should return error', () => {
      describe('if matchId', () => {
        it('is not uuid', () => {
          cy.authenticate('player1')
          .requestGetBetListOfMatch(`${uuid()}-not-valid`)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });

        it('does not belong to any match', () => {
          cy.authenticate('player1')
          .requestGetBetListOfMatch(uuid())
          .expectNotFoundResponse();
        });
      });
    });
  });
});
