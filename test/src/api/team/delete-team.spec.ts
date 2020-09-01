import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { teamConverter, tournamentConverter, matchConverter } from '@foci2020/test/api/dependencies';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('DELETE /team/v1/teams/{teamId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

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
    matchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, 600);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteTeam(uuid() as TeamIdType)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteTeam(uuid() as TeamIdType)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete team', () => {
      cy.saveTeamDocument(homeTeamDocument)
        .authenticate('admin1')
        .requestDeleteTeam(homeTeamDocument.id)
        .expectOkResponse()
        .validateTeamDeleted(homeTeamDocument.id);
    });

    describe('related matches', () => {
      it('should be deleted if "home team" is deleted', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestDeleteTeam(homeTeamDocument.id)
          .expectOkResponse()
          .validateTeamDeleted(homeTeamDocument.id)
          .wait(2000)
          .validateMatchDeleted(matchDocument.id);
      });

      it('should be deleted if "away team" is deleted', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestDeleteTeam(awayTeamDocument.id)
          .expectOkResponse()
          .validateTeamDeleted(awayTeamDocument.id)
          .wait(2000)
          .validateMatchDeleted(matchDocument.id);
      });
    });

    describe('should return error', () => {
      describe('if teamId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteTeam(`${uuid()}-not-valid` as TeamIdType)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
