import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { teamConverter, tournamentConverter, matchConverter } from '@foci2020/test/api/dependencies';
import { default as schema } from '@foci2020/test/api/schemas/match-response';

describe('GET /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

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
          .requestGetMatch(`${uuid()}-not-valid`)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
      });

      it('does not belong to any match', () => {
        cy.authenticate('admin1')
          .requestGetMatch(uuid())
          .expectNotFoundResponse();
      });
    });
  });
});
