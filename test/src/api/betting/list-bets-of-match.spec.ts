import { MatchDocument, TeamDocument, TournamentDocument } from '@foci2020/shared/types/documents';
import { matchConverter, teamConverter, tournamentConverter } from '@foci2020/test/api/dependencies';
import { v4 as uuid } from 'uuid';
import { addMinutes } from '@foci2020/shared/common/utils';
import { default as schema } from '@foci2020/test/api/schemas/bet-response-list';

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
    }, 600);
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, 600);
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    }, 600);

    pendingMatchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(15).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, 600);

    startedMatchDocument = matchConverter.create({
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'B csoport',
      startTime: addMinutes(-10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, 600);
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
        it('betting time has expired', () => {
          cy.saveMatchDocument(startedMatchDocument)
            .saveBetForUser('player2', {
              homeScore: 1,
              awayScore: 1
            }, startedMatchDocument.id, startedMatchDocument.tournamentId)
            .authenticate('player1')
            .requestGetBetListOfMatch(startedMatchDocument.id)
            .expectOkResponse()
            .expectValidResponseSchema(schema)
            .validatePublicBetResponse('player1');
        });

        it('player already placed a bet', () => {
          cy.saveMatchDocument(startedMatchDocument)
            .saveBetForUser('player1', {
              homeScore: 1,
              awayScore: 1
            }, startedMatchDocument.id, startedMatchDocument.tournamentId)
            .saveBetForUser('player2', {
              homeScore: 1,
              awayScore: 1
            }, startedMatchDocument.id, startedMatchDocument.tournamentId)
            .authenticate('player1')
            .requestGetBetListOfMatch(startedMatchDocument.id)
            .expectOkResponse()
            .expectValidResponseSchema(schema)
            .validatePublicBetResponse('player1');
        });
      });

      describe('NOT showing other player\'s bets if', () => {
        it('player can still place a bet', () => {
          cy.saveMatchDocument(pendingMatchDocument)
            .saveBetForUser('player2', {
              homeScore: 1,
              awayScore: 1
            }, pendingMatchDocument.id, pendingMatchDocument.tournamentId)
            .authenticate('player1')
            .requestGetBetListOfMatch(pendingMatchDocument.id)
            .expectOkResponse()
            .expectValidResponseSchema(schema)
            .validatePrivateBetResponse('player1');
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
